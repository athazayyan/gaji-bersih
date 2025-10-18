/**
 * POST /api/chat/start
 * 
 * Create or retrieve a chat session with TTL management.
 * Returns existing session if found and not expired, otherwise creates new one.
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createSessionSchema = z.object({
  ttl_minutes: z.number().min(1).max(240).optional(), // Max 4 hours
  force_new: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
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

    const body = await request.json().catch(() => ({}))
    
    // Validate input
    const validation = createSessionSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        { 
          error: firstError.message,
          field: firstError.path.join('.') || 'unknown'
        },
        { status: 400 }
      )
    }

    const forceNew = validation.data.force_new ?? false
    const ttlMinutes =
      validation.data.ttl_minutes ||
      parseInt(process.env.SESSION_TTL_MINUTES || '90')

    if (!forceNew) {
      // Check for existing active session
      const { data: existingSessions } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)

      if (existingSessions && existingSessions.length > 0) {
        const session = existingSessions[0] as any

        // Update TTL (reset expiration)
        const newExpiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000)

        await (supabase.from('sessions') as any)
          .update({ expires_at: newExpiresAt.toISOString() })
          .eq('chat_id', session.chat_id)

        console.log(
          `[Session] Reused session ${session.chat_id} for user ${user.id}`
        )

        return NextResponse.json(
          {
            message: 'Session retrieved and TTL reset',
            chat_id: session.chat_id,
            session_vs_id: session.session_vs_id,
            expires_at: newExpiresAt.toISOString(),
            created_at: session.created_at,
            is_new: false,
          },
          { status: 200 }
        )
      }
    } else {
      // Force new session: expire all active sessions for this user
      const nowIso = new Date().toISOString()
      const { data: activeSessions } = await supabase
        .from('sessions')
        .select('chat_id')
        .eq('user_id', user.id)
        .gt('expires_at', nowIso)

      if (activeSessions && activeSessions.length > 0) {
        const chatIds = activeSessions.map((s: any) => s.chat_id)
        const { error: expireError } = await supabase
          .from('sessions')
          .update({ expires_at: nowIso })
          .in('chat_id', chatIds)
        if (expireError) {
          console.warn(
            `[Session] Failed to expire sessions for user ${user.id}:`,
            expireError
          )
        } else {
          console.log(
            `[Session] Expired ${chatIds.length} sessions for user ${user.id}`
          )
        }
      }
    }

    // Create new session
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000)

    const { data: newSession, error: createError } = await (supabase
      .from('sessions') as any)
      .insert({
        user_id: user.id,
        session_vs_id: null, // Will be set when documents are uploaded
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (createError) {
      console.error('[Session] Create error:', createError)
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      )
    }

    console.log(`[Session] Created new session ${newSession.chat_id} for user ${user.id}`)

    return NextResponse.json({
      message: forceNew ? 'New session created (force)' : 'New session created',
      chat_id: newSession.chat_id,
      session_vs_id: newSession.session_vs_id,
      expires_at: newSession.expires_at,
      created_at: newSession.created_at,
      is_new: true,
    }, { status: 201 })

  } catch (error) {
    console.error('[Session] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
