/**
 * GET /api/chat/list
 * 
 * List all active sessions for the current user
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const includeExpired = url.searchParams.get('include_expired') === 'true'

    let query = supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!includeExpired) {
      query = query.gt('expires_at', new Date().toISOString())
    }

    const { data: sessions, error: sessionsError } = await query

    if (sessionsError) {
      console.error('[Session] List error:', sessionsError)
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      )
    }

    const now = new Date()
    const sessionsWithStatus = (sessions || []).map((session: any) => ({
      chat_id: session.chat_id,
      session_vs_id: session.session_vs_id,
      expires_at: session.expires_at,
      created_at: session.created_at,
      is_expired: new Date(session.expires_at) < now,
    }))

    return NextResponse.json({
      sessions: sessionsWithStatus,
      count: sessionsWithStatus.length,
    }, { status: 200 })

  } catch (error) {
    console.error('[Session] List error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
