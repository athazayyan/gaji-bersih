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
 * Build attribute filter for file_search
 *
 * Uses OR compound filter to allow EITHER:
 * 1. User's own documents (user_id matches)
 * 2. Public regulations (doc_type = "regulation")
 *
 * This prevents users from seeing other users' documents while
 * still allowing access to shared regulations.
 */
export function buildAttributeFilter(
  userId: string,
  chatId?: string
): AttributeFilter | undefined {
  // OR filter: Match user's documents OR public regulations
  // This prevents "bleeding" of other users' documents
  return {
    type: 'or',
    filters: [
      // User's own documents (BIG_STORE files with user_id)
      {
        type: 'eq',
        key: 'user_id',
        value: userId,
      },
      // Public regulations (GLOBAL_STORE files marked as regulations)
      {
        type: 'eq',
        key: 'doc_type',
        value: 'regulation',
      },
    ],
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

    // Add single file_search tool with ALL vector stores
    // Note: We apply the user filter only to BIG_STORE by setting attributes on files
    // GLOBAL_STORE files don't have user_id attribute, so they won't be filtered out
    const fileSearchTool: any = {
      type: 'file_search',
      vector_store_ids: params.vectorStoreIds,
    }

    // Apply attribute filter if provided
    // This will only match files that have the user_id attribute
    // GLOBAL_STORE files (regulations) don't have user_id, so they'll still be searchable
    if (params.attributeFilter) {
      fileSearchTool.filters = params.attributeFilter
    }

    if (params.maxNumResults) {
      fileSearchTool.max_num_results = params.maxNumResults
    }

    fileSearchTool.ranking_options = {
      ranker: 'default-2024-08-21',
      score_threshold: 0.3, // Lower threshold to get more results
    }

    tools.push(fileSearchTool)
    console.log('[OpenAI] Added file_search tool with vector stores:', params.vectorStoreIds)
    console.log('[OpenAI] Filter applied:', JSON.stringify(params.attributeFilter, null, 2))

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
      filter: JSON.stringify(params.attributeFilter, null, 2),
      webSearch: params.useWebSearch,
      toolCount: tools.length,
    })
    
    console.log('[OpenAI] Tools being sent:', JSON.stringify(tools, null, 2))

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

    // Log file_search results for debugging
    for (const item of response.output || []) {
      if (item.type === 'file_search_call') {
        const fileSearchItem = item as any
        console.log('[OpenAI] File search call:', {
          id: fileSearchItem.id,
          status: fileSearchItem.status,
          queries: fileSearchItem.queries,
          resultsCount: fileSearchItem.search_results?.length || 0,
        })
        
        if (fileSearchItem.search_results && fileSearchItem.search_results.length > 0) {
          console.log('[OpenAI] Sample search results:', fileSearchItem.search_results.slice(0, 2).map((r: any) => ({
            file_id: r.file_id,
            filename: r.filename,
            score: r.score,
            contentLength: r.content?.length || 0,
          })))
        } else {
          console.log('[OpenAI] ℹ️  No search_results in tool call (citations will be in message annotations)')
        }
      }
    }

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
