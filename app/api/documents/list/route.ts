/**
 * GET /api/documents/list
 * 
 * List user's documents with filtering options
 * Supports pagination and filtering by chat_id, doc_type, persistent/ephemeral
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get('chat_id')
    const docType = searchParams.get('doc_type')
    const isPersistent = searchParams.get('persistent') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = (supabase.from('documents') as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (chatId) {
      query = query.eq('chat_id', chatId)
    }

    if (docType) {
      query = query.eq('doc_type', docType)
    }

    // Filter by persistent flag only if explicitly provided
    if (searchParams.has('persistent')) {
      if (isPersistent) {
        query = query.is('chat_id', null)
      } else {
        query = query.not('chat_id', 'is', null)
      }
    }

    const { data: documents, error: dbError } = await query

    if (dbError) {
      console.error('[Documents List] Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      )
    }

    // Calculate status for each document
    const now = new Date()
    const documentsWithStatus = documents.map((doc: any) => ({
      id: doc.id,
      file_name: doc.file_name,
      file_size: doc.file_size,
      mime_type: doc.mime_type,
      doc_type: doc.doc_type,
      chat_id: doc.chat_id,
      vs_file_id: doc.vs_file_id,
      expires_at: doc.expires_at,
      created_at: doc.created_at,
      is_persistent: !doc.chat_id,
      is_expired: doc.expires_at ? new Date(doc.expires_at) < now : false,
    }))

    return NextResponse.json({
      documents: documentsWithStatus,
      total: documentsWithStatus.length,
      limit,
      offset,
    })

  } catch (error) {
    console.error('[Documents List] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
