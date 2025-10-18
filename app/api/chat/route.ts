/**
 * POST /api/chat
 *
 * Conversational Q&A about analyzed documents with context awareness
 * Uses OpenAI Responses API with file_search and web_search
 */

import { createClient } from '@/lib/supabase/server'
import { queryWithResponses, buildAttributeFilter } from '@/lib/openai/responses'
import { getChatSystemPrompt } from '@/lib/openai/prompts'
import { VECTOR_STORES } from '@/lib/openai/client'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import type { ChatResult, ChatSourceCitations } from '@/lib/openai/types'

// Request validation schema
const chatRequestSchema = z.object({
  chat_id: z.string().uuid(),
  message: z.string().min(1).max(2000),
  include_web_search: z.boolean().optional().default(true),
  max_file_results: z.number().min(1).max(50).optional().default(10),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // 2. Validate request body
    const body = await request.json().catch(() => ({}))
    const validation = chatRequestSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: {
            [firstError.path.join('.') || 'message']: firstError.message,
          },
        },
        { status: 400 }
      )
    }

    const { chat_id, message, include_web_search, max_file_results } = validation.data

    // 3. Verify chat session ownership and not expired
    const { data: session, error: sessionError } = await (supabase.from('sessions') as any)
      .select('*')
      .eq('chat_id', chat_id)
      .eq('user_id', user.id)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (sessionError || !session) {
      if (sessionError?.code === 'PGRST116') {
        return NextResponse.json(
          {
            error: 'Session expired',
            message: 'This chat session has expired. Please create a new session.',
          },
          { status: 410 }
        )
      }
      return NextResponse.json(
        {
          error: 'Access denied',
          message: "You don't have permission to access this chat session",
        },
        { status: 403 }
      )
    }

    // 4. Load previous analysis for context (if exists)
    const { data: analyses } = await (supabase.from('analyses') as any)
      .select('*')
      .eq('chat_id', chat_id)
      .order('created_at', { ascending: false })
      .limit(1)

    const previousAnalysis = analyses?.[0]

    // Check if user has uploaded documents for this chat (for prompt guidance)
    const { data: userDocuments } = await (supabase.from('documents') as any)
      .select('id')
      .eq('chat_id', chat_id)
      .eq('user_id', user.id)
      .limit(1)

    const hasUserDocuments = !!previousAnalysis || (userDocuments?.length || 0) > 0

    // 5. Load conversation history (last 10 messages)
    const { data: previousRuns } = await supabase
      .from('runs')
      .select('question, answer')
      .eq('chat_id', chat_id)
      .order('created_at', { ascending: false })
      .limit(10)

    const conversationHistory = previousRuns || []

    // 6. Build context-aware prompt
    let contextualMessage = message

    if (previousAnalysis) {
      const analysisContext = `

[CONTEXT FROM PREVIOUS ANALYSIS]
- Document type: ${previousAnalysis.analysis_type}
- Total issues found: ${previousAnalysis.summary?.total_issues || 0}
- Critical issues: ${previousAnalysis.summary?.critical || 0}
${
  previousAnalysis.salary_calculation
    ? `- Gross salary: Rp ${previousAnalysis.salary_calculation.gross_salary?.toLocaleString('id-ID')}\n- Take-home pay: Rp ${previousAnalysis.salary_calculation.take_home_pay?.toLocaleString('id-ID')}`
    : ''
}

[USER QUESTION]
${message}
`
      contextualMessage = analysisContext
    }

    // Add conversation history
    if (conversationHistory.length > 0) {
      const historyText = conversationHistory
        .reverse()
        .map((run: any) => `Q: ${run.question}\nA: ${run.answer}`)
        .join('\n\n')

      contextualMessage = `[PREVIOUS CONVERSATION]\n${historyText}\n\n${contextualMessage}`
    }

    console.log(`[Chat] Processing message for chat: ${chat_id}`)

    // 7. Build system prompt
    const systemPrompt = getChatSystemPrompt(hasUserDocuments, !!VECTOR_STORES.GLOBAL)

    // Combine system prompt with user message
    const fullPrompt = `${systemPrompt}\n\n${contextualMessage}`

    // 8. Call OpenAI Responses API
    const result = await queryWithResponses({
      question: fullPrompt,
      vectorStoreIds: [VECTOR_STORES.GLOBAL, VECTOR_STORES.BIG].filter(Boolean),
      attributeFilter: buildAttributeFilter(user.id, chat_id),
      useWebSearch: include_web_search,
      maxNumResults: max_file_results,
      model: 'gpt-4o',
    })

    // 9. Parse citations from response
    const citations = parseCitations(result, supabase)

    // 10. Save to runs table
    const { data: savedRun, error: saveError } = await supabase
      .from('runs')
      .insert({
        chat_id,
        user_id: user.id,
        request_id: result.request_id,
        question: message,
        answer: result.answer,
        citations_json: citations,
        tool_calls: result.tool_calls as any, // Cast to Json type for database
        token_usage: result.token_usage.total_tokens,
        prompt_tokens: result.token_usage.prompt_tokens,
        completion_tokens: result.token_usage.completion_tokens,
        latency_ms: result.latency_ms,
      })
      .select()
      .single()

    if (saveError) {
      console.error('[Chat] Error saving to runs:', saveError)
    }

    console.log(`[Chat] Saved run: ${savedRun?.id}`)

    // 11. Format and return response
    const chatResult: ChatResult = {
      message_id: savedRun?.id || 'unknown',
      chat_id,
      role: 'assistant',
      content: result.answer,
      sources: await buildSourceCitations(result, supabase, user.id),
      context: {
        analysis_id: previousAnalysis?.id,
        previous_messages_count: conversationHistory.length,
        user_gross_salary: previousAnalysis?.salary_calculation?.gross_salary,
      },
      metadata: {
        created_at: new Date().toISOString(),
        model_used: 'gpt-4o',
        search_methods_used: result.tool_calls
          .map((t) => (t.type === 'file_search_call' ? 'file_search' : 'web_search'))
          .filter((v, i, a) => a.indexOf(v) === i),
        tokens_used: result.token_usage,
      },
    }

    return NextResponse.json(chatResult, { status: 200 })
  } catch (error: any) {
    console.error('[Chat] Unexpected error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}

/**
 * Parse citations for storage
 */
function parseCitations(result: any, supabase: any) {
  return {
    file_citations: result.citations.filter((c: any) => c.type === 'file'),
    web_citations: result.citations.filter((c: any) => c.type === 'web'),
    total: result.citations.length,
  }
}

/**
 * Build multi-source citations for response
 * 
 * SECURITY: This function filters citations to ensure users only see:
 * 1. Their own documents (verified by user_id)
 * 2. Public regulations (no user_id required)
 * 
 * Citations from other users' documents are silently dropped.
 */
async function buildSourceCitations(
  result: any,
  supabase: any,
  userId: string
): Promise<ChatSourceCitations> {
  const contractCitations: any[] = []
  const regulationCitations: any[] = []
  const webCitations: any[] = []

  // Process file citations with security filtering
  for (const citation of result.citations.filter((c: any) => c.type === 'file')) {
    // SECURITY: First check if it's the user's document
    // This query will only return results if user_id matches
    const { data: doc } = await (supabase.from('documents') as any)
      .select('*')
      .eq('file_id', citation.file_id)
      .eq('user_id', userId) // ✅ SECURITY: Only user's own documents
      .single()

    if (doc) {
      // ✅ AUTHORIZED: User's contract/payslip/document
      contractCitations.push({
        document_id: doc.id,
        document_name: doc.file_name,
        document_type: doc.doc_type,
        excerpt: citation.snippet || citation.quote || '',
        relevance_score: 0.9, // Default score
      })
    } else {
      // SECURITY: Check if it's a public regulation (not another user's doc)
      const { data: regulation } = await (supabase.from('regulations') as any)
        .select('*')
        .eq('file_id', citation.file_id)
        .single()

      if (regulation) {
        // ✅ AUTHORIZED: Public regulation (no user_id check needed)
        regulationCitations.push({
          regulation_id: regulation.id,
          title: regulation.title,
          regulation_type: regulation.regulation_type,
          regulation_number: `${regulation.regulation_number}/${regulation.regulation_year}`,
          excerpt: citation.snippet || citation.quote || '',
          file_id: citation.file_id,
          relevance_score: 0.9,
        })
      }
      // else: ❌ UNAUTHORIZED: Citation from another user's document - silently dropped
    }
  }

  // Process web citations
  for (const citation of result.citations.filter((c: any) => c.type === 'web')) {
    webCitations.push({
      title: citation.title || 'Web Source',
      url: citation.url,
      domain: new URL(citation.url).hostname,
      snippet: citation.snippet || '',
      relevance_score: 0.8,
    })
  }

  return {
    contract_citations: contractCitations,
    regulation_citations: regulationCitations,
    web_citations: webCitations,
  }
}
