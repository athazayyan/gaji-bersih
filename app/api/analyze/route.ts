/**
 * POST /api/analyze
 *
 * Analyze employment document (contract, payslip, NDA) using OpenAI Responses API
 * Returns structured analysis with issues, compliance checks, and citations
 */

import { createClient } from '@/lib/supabase/server'
import { openai, VECTOR_STORES } from '@/lib/openai/client'
import { buildAttributeFilter } from '@/lib/openai/responses'
import { getAnalysisSystemPrompt, getAnalysisJSONSchema } from '@/lib/openai/prompts'
import {
  buildSummary,
  aggregateReferences,
  validateAnalysisResult,
  validateSalaryCalculation,
} from '@/lib/openai/analysis'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import type { AnalysisType, AnalysisResult } from '@/lib/openai/types'

// Request validation schema
const analyzeRequestSchema = z.object({
  chat_id: z.string().uuid(),
  document_id: z.string().uuid(),
  analysis_type: z.enum(['contract', 'payslip', 'nda', 'policy']),
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()

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
    const validation = analyzeRequestSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: {
            [firstError.path.join('.') || 'unknown']: firstError.message,
          },
        },
        { status: 400 }
      )
    }

    const { chat_id, document_id, analysis_type } = validation.data

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
            error: 'Chat session not found or expired',
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

    // 4. Verify document exists and belongs to this chat
    const { data: document, error: docError } = await (supabase.from('documents') as any)
      .select('*')
      .eq('id', document_id)
      .eq('user_id', user.id)
      .single()

    if (docError || !document) {
      return NextResponse.json(
        {
          error: 'Resource not found',
          message: 'Document not found or has been deleted',
        },
        { status: 404 }
      )
    }

    // 5. Check if analysis already exists
    const { data: existingAnalysis } = await (supabase.from('analyses') as any)
      .select('*')
      .eq('document_id', document_id)
      .single()

    if (existingAnalysis) {
      console.log(`[Analyze] Returning existing analysis: ${existingAnalysis.id}`)

      // Return existing analysis
      return NextResponse.json(
        formatAnalysisResponse(existingAnalysis, document, chat_id),
        { status: 200 }
      )
    }

    console.log(`[Analyze] Starting analysis for document: ${document_id}`)

    // 6. Build OpenAI Responses API request
    const systemPrompt = getAnalysisSystemPrompt(analysis_type as AnalysisType)
    const jsonSchema = getAnalysisJSONSchema(analysis_type as AnalysisType)

    // Build attribute filter for user isolation
    const attributeFilter = buildAttributeFilter(user.id, chat_id)

    // Build tools array
    const tools: any[] = [
      {
        type: 'file_search',
        vector_store_ids: [VECTOR_STORES.GLOBAL, VECTOR_STORES.BIG],
        filters: attributeFilter,
        max_num_results: 10,
      },
      {
        type: 'web_search', // ALWAYS enabled for latest regulations
      },
    ]

    console.log('[Analyze] Calling OpenAI Responses API with structured output')

    // 7. Call OpenAI Responses API
    // Note: Using JSON mode instead of strict schema for compatibility
    const response = await openai.responses.create({
      model: 'gpt-4o',
      input: systemPrompt + '\n\nIMPORTANT: Return ONLY valid JSON matching the schema. No markdown, no explanation.',
      tools,
      include: ['file_search_call.results'], // Include search results
    })

    const processingTime = Date.now() - startTime

    console.log('[Analyze] Response received:', {
      id: response.id,
      outputItems: response.output?.length || 0,
      processingTime: `${processingTime}ms`,
    })

    // 8. Parse response
    let parsedResult: any = null
    const toolCalls: any[] = []

    for (const item of response.output || []) {
      // Track tool calls
      if (item.type === 'file_search_call' || item.type === 'web_search_call') {
        toolCalls.push({
          type: item.type,
          id: item.id,
          status: item.status,
        })
      }

      // Extract JSON from message content
      if (item.type === 'message' && item.role === 'assistant') {
        for (const content of item.content || []) {
          if (content.type === 'output_text') {
            try {
              parsedResult = JSON.parse(content.text)
            } catch (parseError) {
              console.error('[Analyze] JSON parse error:', parseError)
              return NextResponse.json(
                {
                  error: 'Analysis failed',
                  message: 'Failed to parse AI response',
                },
                { status: 500 }
              )
            }
          }
        }
      }
    }

    if (!parsedResult) {
      return NextResponse.json(
        {
          error: 'Analysis failed',
          message: 'No valid response from AI',
        },
        { status: 500 }
      )
    }

    // 9. Validate response structure
    const resultValidation = validateAnalysisResult(parsedResult)
    if (!resultValidation.valid) {
      console.error('[Analyze] Validation errors:', resultValidation.errors)
      return NextResponse.json(
        {
          error: 'Analysis failed',
          message: 'Invalid response structure from AI',
          details: resultValidation.errors,
        },
        { status: 500 }
      )
    }

    // Validate salary calculation if present
    if (parsedResult.salary_calculation) {
      const salaryValidation = validateSalaryCalculation(parsedResult.salary_calculation)
      if (!salaryValidation.valid) {
        console.error('[Analyze] Salary calculation validation errors:', salaryValidation.errors)
      }
    }

    // 10. Build summary and aggregate references
    const summary = buildSummary(parsedResult.issues)
    const allReferences = aggregateReferences(parsedResult.issues)

    // 11. Save to database
    const { data: savedAnalysis, error: saveError } = await (supabase.from('analyses') as any)
      .insert({
        chat_id,
        user_id: user.id,
        document_id,
        analysis_type,
        summary,
        issues: parsedResult.issues,
        salary_calculation: parsedResult.salary_calculation || null,
        all_references: allReferences,
        model_used: 'gpt-4o',
        tokens_used: response.usage?.total_tokens || 0,
        prompt_tokens: response.usage?.input_tokens || 0,
        completion_tokens: response.usage?.output_tokens || 0,
        processing_time_ms: processingTime,
      })
      .select()
      .single()

    if (saveError) {
      console.error('[Analyze] Database save error:', saveError)
      return NextResponse.json(
        {
          error: 'Failed to save analysis',
        },
        { status: 500 }
      )
    }

    console.log(`[Analyze] Analysis saved: ${savedAnalysis.id}`)

    // 12. Return formatted response
    return NextResponse.json(formatAnalysisResponse(savedAnalysis, document, chat_id), {
      status: 201,
    })
  } catch (error: any) {
    console.error('[Analyze] Unexpected error:', error)
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
 * Format analysis result to match PRD response schema
 */
function formatAnalysisResponse(
  analysis: any,
  document: any,
  chatId: string
): AnalysisResult {
  return {
    analysis_id: analysis.id,
    chat_id: chatId,
    document: {
      id: document.id,
      name: document.file_name || 'Unnamed document',
      type: document.doc_type || 'unknown',
      uploaded_at: document.created_at,
    },
    summary: analysis.summary,
    salary_calculation: analysis.salary_calculation,
    issues: analysis.issues,
    all_references: analysis.all_references,
    metadata: {
      analyzed_at: analysis.created_at,
      model_used: analysis.model_used,
      search_methods_used: ['file_search', 'web_search'],
      tokens_used: {
        prompt_tokens: analysis.prompt_tokens || 0,
        completion_tokens: analysis.completion_tokens || 0,
        total_tokens: analysis.tokens_used || 0,
      },
      processing_time_ms: analysis.processing_time_ms,
    },
  }
}
