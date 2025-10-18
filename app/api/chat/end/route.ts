/**
 * DELETE /api/chat/end
 *
 * End a chat session and cleanup associated documents.
 * Sets expires_at to now() and immediately deletes all ephemeral documents.
 */

import { createClient } from '@/lib/supabase/server'
import { cleanupSessionDocuments } from '@/lib/cleanup'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const endSessionSchema = z.object({
  chat_id: z.string().min(1, 'chat_id is required'),
})

export async function DELETE(request: NextRequest) {
  const startTime = Date.now()

  try {
    const supabase = await createClient()

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please sign in to continue' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()

    // Validate input
    const validation = endSessionSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        {
          error: 'Bad request',
          message: firstError.message,
          field: firstError.path.join('.') || 'unknown'
        },
        { status: 400 }
      )
    }

    const { chat_id } = validation.data

    // Verify session exists and user owns it
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('chat_id', chat_id)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        {
          error: 'Session not found',
          message: 'This chat session does not exist or has already been ended',
          chat_id,
          suggestion: 'Please start a new session to continue'
        },
        { status: 404 }
      )
    }

    // Check if already expired (already ended)
    const isAlreadyExpired = new Date(session.expires_at) < new Date()

    if (isAlreadyExpired) {
      // Allow idempotent operation, but note that it's already expired
      return NextResponse.json({
        success: true,
        chat_id,
        message: 'Session was already expired',
        ended_at: session.expires_at,
        cleanup: {
          queued: false,
          documents_to_delete: 0,
          message: 'Session already expired. Documents may have been cleaned up automatically.'
        },
        session_summary: {
          started_at: session.created_at,
          duration_minutes: Math.round(
            (new Date(session.expires_at).getTime() - new Date(session.created_at).getTime()) / 1000 / 60
          ),
        }
      }, { status: 200 })
    }

    // Set expires_at to now (immediately expire the session)
    const now = new Date().toISOString()

    const { error: updateError } = await supabase
      .from('sessions')
      .update({ expires_at: now })
      .eq('chat_id', chat_id)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('[Session End] Failed to update session:', updateError)
      return NextResponse.json(
        { error: 'Failed to end session', message: updateError.message },
        { status: 500 }
      )
    }

    console.log(`[Session End] Session ended: ${chat_id} by user ${user.id}`)

    // Get count of documents before cleanup
    const { data: documents } = await supabase
      .from('documents')
      .select('id, file_name, file_size')
      .eq('chat_id', chat_id)
      .not('expires_at', 'is', null) // Only ephemeral docs

    const documentsToDelete = documents || []
    const documentsCount = documentsToDelete.length

    console.log(`[Session End] Will delete ${documentsCount} documents`)

    // Trigger immediate cleanup (synchronous for hackathon - simpler!)
    let cleanupResult
    try {
      cleanupResult = await cleanupSessionDocuments(chat_id)
      console.log(`[Session End] Cleanup completed:`, cleanupResult)
    } catch (cleanupError) {
      console.error('[Session End] Cleanup failed:', cleanupError)
      // Don't fail the request - session is already marked as ended
      cleanupResult = {
        total_documents: documentsCount,
        deleted: { storage: 0, vector_store: 0, database: 0 },
        failed: { storage: 0, vector_store: 0, database: 0 },
        errors: [{
          document_id: 'unknown',
          file_name: 'unknown',
          step: 'database' as const,
          error: cleanupError instanceof Error ? cleanupError.message : 'Unknown error'
        }],
      }
    }

    // Calculate session duration
    const durationMs = new Date().getTime() - new Date(session.created_at).getTime()
    const durationMinutes = Math.round(durationMs / 1000 / 60)

    // Return success response
    const executionTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      chat_id,
      ended_at: now,
      cleanup: {
        completed: true,
        documents_deleted: cleanupResult.deleted.database,
        documents_failed: cleanupResult.failed.database,
        execution_time_ms: executionTime,
        message: cleanupResult.errors.length > 0
          ? `Deleted ${cleanupResult.deleted.database} documents with ${cleanupResult.errors.length} errors`
          : `Successfully deleted ${cleanupResult.deleted.database} documents`
      },
      session_summary: {
        started_at: session.created_at,
        duration_minutes: durationMinutes,
        documents_uploaded: documentsCount,
      },
      errors: cleanupResult.errors.length > 0 ? cleanupResult.errors : undefined,
    }, { status: 200 })

  } catch (error) {
    console.error('[Session End] Unexpected error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Failed to end session'
      },
      { status: 500 }
    )
  }
}
