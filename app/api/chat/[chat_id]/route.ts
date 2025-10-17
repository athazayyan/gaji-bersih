/**
 * GET /api/chat/[chat_id]
 * 
 * Get session details by chat_id
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{
    chat_id: string
  }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { chat_id } = await params
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Fetch session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('chat_id', chat_id)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    const sessionData = session as any

    // Check if expired
    const isExpired = new Date(sessionData.expires_at) < new Date()

    return NextResponse.json({
      chat_id: sessionData.chat_id,
      session_vs_id: sessionData.session_vs_id,
      expires_at: sessionData.expires_at,
      created_at: sessionData.created_at,
      is_expired: isExpired,
    }, { status: 200 })

  } catch (error) {
    console.error('[Session] Get error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/chat/[chat_id]
 * 
 * End session and schedule cleanup of ephemeral documents
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { chat_id } = await params
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Delete session (cascade will handle related records if configured)
    const { error: deleteError } = await supabase
      .from('sessions')
      .delete()
      .eq('chat_id', chat_id)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('[Session] Delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete session' },
        { status: 500 }
      )
    }

    console.log(`[Session] Deleted session ${chat_id} for user ${user.id}`)

    // Note: GC cleanup of documents will be handled by scheduled job
    // that checks expires_at on documents table

    return NextResponse.json({
      message: 'Session ended successfully',
      chat_id,
    }, { status: 200 })

  } catch (error) {
    console.error('[Session] Delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
