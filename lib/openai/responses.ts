/**
 * OpenAI Responses API Integration
 *
 * Functions for querying documents using OpenAI's Responses API
 * with file_search (attribute filtering) and web_search tools.
 */

import { openai, VECTOR_STORES } from './client'
import type {
  ResponsesAPIParams,
  ResponsesAPIResult,
  ResponseCitation,
  AttributeFilter,
} from './types'

/**
 * Build attribute filter for user isolation
 *
 * Creates a filter to restrict file_search to specific user_id and optionally chat_id.
 * This ensures users only see their own documents.
 */
export function buildAttributeFilter(
  userId: string,
  chatId?: string
): AttributeFilter {
  if (chatId) {
    // Filter for ephemeral documents: user_id AND chat_id
    return {
      type: 'and',
      filters: [
        {
          type: 'eq',
          key: 'user_id',
          value: userId,
        },
        {
          type: 'eq',
          key: 'chat_id',
          value: chatId,
        },
      ],
    }
  } else {
    // Filter for persistent documents: user_id only (My Docs)
    return {
      type: 'eq',
      key: 'user_id',
      value: userId,
    }
  }
}

/**
 * Query documents and web using OpenAI Responses API
 *
 * This function orchestrates file_search (RAG with attribute filtering)
 * and web_search in a single call.
 */
export async function queryWithResponses(
  params: ResponsesAPIParams
): Promise<ResponsesAPIResult> {
  const startTime = Date.now()

  try {
    // Build tools array
    const tools: any[] = []

    // Add file_search tool with attribute filtering
    const fileSearchTool: any = {
      type: 'file_search',
      vector_store_ids: params.vectorStoreIds,
    }

    // Add attribute filter if provided
    if (params.attributeFilter) {
      fileSearchTool.filters = params.attributeFilter
    }

    // Optional: Add max_num_results to reduce latency/tokens
    if (params.maxNumResults) {
      fileSearchTool.max_num_results = params.maxNumResults
    }

    tools.push(fileSearchTool)

    // Add web_search tool if requested
    if (params.useWebSearch) {
      tools.push({
        type: 'web_search',
      })
    }

    console.log('[OpenAI] Querying with Responses API:', {
      model: params.model || 'gpt-4o',
      question: params.question.substring(0, 100),
      vectorStores: params.vectorStoreIds,
      filter: params.attributeFilter,
      webSearch: params.useWebSearch,
    })

    // Call Responses API
    const response = await openai.responses.create({
      model: params.model || 'gpt-4o', // or 'gpt-4.1', 'gpt-5', etc.
      input: params.question,
      tools,
      include: ['file_search_call.results'], // Include search results for better debugging
    })

    const latency = Date.now() - startTime

    console.log('[OpenAI] Response received:', {
      id: response.id,
      latency: `${latency}ms`,
      outputItems: response.output?.length || 0,
    })

    // Parse response
    const result = parseResponsesAPIOutput(response, latency)

    return result
  } catch (error) {
    console.error('[OpenAI] Error querying with Responses API:', error)
    throw new Error(
      `Failed to query with Responses API: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Parse Responses API output to extract answer, citations, and metadata
 */
function parseResponsesAPIOutput(
  response: any,
  latency: number
): ResponsesAPIResult {
  const citations: ResponseCitation[] = []
  let answer = 'No answer generated'
  const toolCalls: any[] = []

  // Response.output is an array of output items
  for (const item of response.output || []) {
    // Track tool calls
    if (item.type === 'file_search_call' || item.type === 'web_search_call') {
      toolCalls.push({
        id: item.id,
        type: item.type,
        status: item.status,
        queries: item.queries,
      })
    }

    // Extract answer and citations from message
    if (item.type === 'message' && item.role === 'assistant') {
      for (const content of item.content || []) {
        if (content.type === 'output_text') {
          answer = content.text

          // Extract file citations from annotations
          for (const annotation of content.annotations || []) {
            if (annotation.type === 'file_citation') {
              citations.push({
                type: 'file',
                file_id: annotation.file_id,
                file_name: annotation.filename,
                quote: annotation.quote,
                snippet: content.text.substring(
                  Math.max(0, annotation.index - 50),
                  Math.min(content.text.length, annotation.index + 150)
                ),
              })
            }

            // Extract URL citations (from web_search)
            if (annotation.type === 'url_citation') {
              citations.push({
                type: 'web',
                url: annotation.url,
                title: annotation.title,
                snippet: content.text.substring(
                  Math.max(0, annotation.start_index - 50),
                  Math.min(content.text.length, annotation.end_index + 100)
                ),
              })
            }
          }
        }
      }
    }
  }

  // Get token usage from response
  const tokenUsage = {
    prompt_tokens: response.usage?.input_tokens || 0,
    completion_tokens: response.usage?.output_tokens || 0,
    total_tokens: response.usage?.total_tokens || 0,
  }

  return {
    answer,
    citations,
    request_id: response.id,
    token_usage: tokenUsage,
    tool_calls: toolCalls,
    latency_ms: latency,
  }
}

/**
 * Build system prompt for better responses
 */
export function buildSystemPrompt(context?: {
  hasUserDocuments: boolean
  hasGlobalDocs: boolean
}): string {
  let prompt = `You are a helpful AI assistant specializing in Indonesian employment law and contract analysis.`

  if (context?.hasUserDocuments) {
    prompt += `\n\nYou have access to the user's uploaded documents (contracts, payslips, NDAs, etc.). Use these documents to provide accurate, specific answers based on the user's actual situation.`
  }

  if (context?.hasGlobalDocs) {
    prompt += `\n\nYou also have access to Indonesian labor regulations (UU Ketenagakerjaan, PP, Permen). Reference these when discussing legal requirements and worker rights in Indonesia.`
  }

  prompt += `\n\nIMPORTANT:
- Always cite your sources using inline references
- Be concise but thorough in your explanations
- Use clear, easy-to-understand language
- If you're unsure about something, say so rather than guessing
- When discussing legal matters, emphasize that users should consult with legal professionals for definitive advice`

  return prompt
}

/**
 * Helper: Check if vector stores are available
 */
export function checkVectorStoresAvailable(): {
  globalAvailable: boolean
  bigAvailable: boolean
} {
  return {
    globalAvailable: !!VECTOR_STORES.GLOBAL,
    bigAvailable: !!VECTOR_STORES.BIG,
  }
}

/**
 * Quick query helper for common use cases
 *
 * @param question - User's question
 * @param userId - Current user ID (for filtering)
 * @param chatId - Optional chat ID (for ephemeral documents)
 * @param includeWebSearch - Whether to include web search
 */
export async function quickQuery(
  question: string,
  userId: string,
  chatId?: string,
  includeWebSearch: boolean = true
): Promise<ResponsesAPIResult> {
  // Build filter
  const filter = buildAttributeFilter(userId, chatId)

  // Determine which vector stores to search
  const vectorStoreIds: string[] = []

  if (VECTOR_STORES.BIG) {
    vectorStoreIds.push(VECTOR_STORES.BIG)
  }

  if (VECTOR_STORES.GLOBAL) {
    vectorStoreIds.push(VECTOR_STORES.GLOBAL)
  }

  if (vectorStoreIds.length === 0) {
    throw new Error('No vector stores configured')
  }

  return queryWithResponses({
    question,
    vectorStoreIds,
    attributeFilter: filter,
    useWebSearch: includeWebSearch,
    maxNumResults: 5, // Limit to top 5 results to reduce latency
  })
}
