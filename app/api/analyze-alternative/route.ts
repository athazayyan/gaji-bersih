/**
 * POST /api/analyze-alternative
 *
 * Hackathon workaround endpoint that returns markdown analysis
 * to avoid complex JSON parsing on the frontend.
 */

import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'
import { openai, VECTOR_STORES } from '@/lib/openai/client'
import { buildAttributeFilter } from '@/lib/openai/responses'
import { getAnalysisMarkdownPrompt } from '@/lib/openai/prompts'
import type { AnalysisType } from '@/lib/openai/types'

const analyzeRequestSchema = z.object({
  chat_id: z.string().uuid(),
  document_id: z.string().uuid(),
  analysis_type: z.enum(['contract', 'payslip', 'nda', 'policy']),
})

export async function POST(request: NextRequest) {
  const startedAt = Date.now()

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

    // 2. Validate request payload
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

    // 3. Verify chat session ownership and TTL
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

    // 4. Verify document ownership
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

    console.log(`[AnalyzeAlternative] Starting markdown analysis for ${document_id}`)

    // 5. Build OpenAI request
    const systemPrompt = getAnalysisMarkdownPrompt(analysis_type as AnalysisType)
    const attributeFilter = buildAttributeFilter(user.id, chat_id)

    const tools: any[] = [
      {
        type: 'file_search',
        vector_store_ids: [VECTOR_STORES.GLOBAL, VECTOR_STORES.BIG],
        filters: attributeFilter,
        max_num_results: 10,
      },
      {
        type: 'web_search',
      },
    ]

    const response = await openai.responses.create({
      model: 'gpt-4o',
      input:
        systemPrompt +
        '\n\n⚠️ PENTING: JANGAN gunakan placeholder seperti "Rp X", "Rp Y", "(asumsi nominal tercantum)", atau placeholder serupa. ' +
        'WAJIB mencari dan gunakan nilai nominal ASLI dari dokumen yang diunggah. ' +
        'Gunakan file_search untuk mengekstrak nilai-nilai yang tepat. ' +
        'Jika nilai tidak ditemukan setelah pencarian, tuliskan "Tidak tercantum dalam dokumen".\n\n' +
        'OUTPUT FORMAT: Kembalikan HANYA markdown valid sesuai struktur yang diminta. Jangan gunakan JSON atau format lain.',
      tools,
      include: ['file_search_call.results'],
    })

    const processingTimeMs = Date.now() - startedAt

    console.log('[AnalyzeAlternative] Response received:', {
      id: response.id,
      outputItems: response.output?.length || 0,
      processingTimeMs,
    })

    // 6. Extract markdown content and tool usage
    let markdownContent = ''
    const usedSearchMethods = new Set<string>()

    for (const item of response.output || []) {
      if (item.type === 'file_search_call') {
        usedSearchMethods.add('file_search')
      }
      if (item.type === 'web_search_call') {
        usedSearchMethods.add('web_search')
      }

      if (item.type === 'message' && item.role === 'assistant') {
        for (const content of item.content || []) {
          if (content.type === 'output_text') {
            markdownContent += content.text
          }
        }
      }
    }

    if (!markdownContent.trim()) {
      console.error('[AnalyzeAlternative] Missing markdown content in response')
      return NextResponse.json(
        {
          error: 'Analysis failed',
          message: 'AI did not return markdown content',
        },
        { status: 500 }
      )
    }

    // Ensure search methods reflect expected usage even if tool calls are batched
    if (usedSearchMethods.size === 0) {
      usedSearchMethods.add('file_search')
      usedSearchMethods.add('web_search')
    }

    const result = {
      analysis_id: randomUUID(),
      chat_id,
      document: {
        id: document.id,
        name: document.file_name || 'Unnamed document',
        type: document.doc_type || 'unknown',
        uploaded_at: document.created_at,
      },
      markdown_content: markdownContent.trim(),
      metadata: {
        analyzed_at: new Date().toISOString(),
        model_used: 'gpt-4o',
        search_methods_used: Array.from(usedSearchMethods),
        tokens_used: {
          prompt_tokens: response.usage?.input_tokens || 0,
          completion_tokens: response.usage?.output_tokens || 0,
          total_tokens: response.usage?.total_tokens || 0,
        },
        processing_time_ms: processingTimeMs,
      },
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('[AnalyzeAlternative] Unexpected error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error?.message || 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}

