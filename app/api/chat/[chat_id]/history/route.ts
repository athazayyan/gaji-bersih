/**
 * GET /api/chat/[chat_id]/history
 *
 * Retrieve conversation history for a chat session from runs table
 * Supports pagination via query parameters
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chat_id: string }> }
) {
  try {
    const supabase = await createClient()
    const { chat_id } = await params

    // 1. Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // 2. Verify chat session ownership
    const { data: session, error: sessionError } = await (supabase.from('sessions') as any)
      .select('*')
      .eq('chat_id', chat_id)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        {
          error: 'Chat session not found',
        },
        { status: 404 }
      )
    }

    // 3. Get pagination parameters from query string
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    // 4. Query conversation history from runs table
    const { data: runs, error: runsError, count } = await supabase
      .from('runs')
      .select('*', { count: 'exact' })
      .eq('chat_id', chat_id)
      .order('created_at', { ascending: true }) // Oldest first for chronological order
      .range(offset, offset + limit - 1)

    if (runsError) {
      console.error('[History] Error fetching runs:', runsError)
      return NextResponse.json(
        {
          error: 'Failed to fetch conversation history',
        },
        { status: 500 }
      )
    }

    // 5. Calculate usage summary
    const totalTokens = runs?.reduce((sum, run) => sum + (run.token_usage || 0), 0) || 0
    const totalLatency = runs?.reduce((sum, run) => sum + (run.latency_ms || 0), 0) || 0
    const avgLatency = runs && runs.length > 0 ? totalLatency / runs.length : 0

    // 6. Format response
    const conversation = runs?.map((run) => ({
      id: run.id,
      question: run.question,
      answer: run.answer || '',
      citations_json: run.citations_json,
      tool_calls: run.tool_calls,
      token_usage: run.token_usage,
      latency_ms: run.latency_ms,
      created_at: run.created_at,
    })) || []

    return NextResponse.json(
      {
        chat_id,
        conversation,
        pagination: {
          total_count: count || 0,
          limit,
          offset,
          has_more: offset + limit < (count || 0),
        },
        usage_summary: {
          total_queries: runs?.length || 0,
          total_tokens: totalTokens,
          avg_latency_ms: Math.round(avgLatency),
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[History] Unexpected error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
