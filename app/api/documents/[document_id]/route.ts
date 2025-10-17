/**
 * GET /api/documents/[document_id]
 * DELETE /api/documents/[document_id]
 * 
 * Get document details or delete document from storage, vector store, and database
 */

import { createClient } from '@/lib/supabase/server'
import { deleteFromVectorStore } from '@/lib/openai/vector-store'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { document_id: string } }
) {
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

    const { document_id } = params

    // Fetch document (RLS ensures user can only access their own documents)
    const { data: document, error: dbError } = await (supabase
      .from('documents') as any)
      .select('*')
      .eq('id', document_id)
      .eq('user_id', user.id)
      .single()

    if (dbError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Calculate status
    const now = new Date()
    const isExpired = document.expires_at ? new Date(document.expires_at) < now : false

    return NextResponse.json({
      document: {
        id: document.id,
        file_name: document.file_name,
        file_size: document.file_size,
        mime_type: document.mime_type,
        doc_type: document.doc_type,
        chat_id: document.chat_id,
        storage_path: document.storage_path,
        file_id: document.file_id,
        vs_file_id: document.vs_file_id,
        vector_store: document.vector_store,
        expires_at: document.expires_at,
        created_at: document.created_at,
        is_persistent: !document.chat_id,
        is_expired: isExpired,
      },
    })

  } catch (error) {
    console.error('[Document GET] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { document_id: string } }
) {
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

    const { document_id } = params

    // Fetch document first to get metadata
    const { data: document, error: fetchError } = await (supabase
      .from('documents') as any)
      .select('*')
      .eq('id', document_id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    console.log(`[Document DELETE] Deleting document ${document_id}`)

    // Step 1: Delete from Supabase Storage
    if (document.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.storage_path])

      if (storageError) {
        console.error('[Document DELETE] Storage deletion error:', storageError)
        // Continue with other deletions even if storage fails
      } else {
        console.log(`[Document DELETE] Removed from storage: ${document.storage_path}`)
      }
    }

    // Step 2: Delete from OpenAI Vector Store
    if (document.vs_file_id && document.file_id && document.vector_store) {
      try {
        const vectorStoreId = document.vector_store === 'big' 
          ? process.env.OPENAI_VECTOR_STORE_BIG_ID 
          : process.env.OPENAI_VECTOR_STORE_GLOBAL_ID

        if (vectorStoreId) {
          await deleteFromVectorStore(vectorStoreId, document.vs_file_id, document.file_id)
          console.log(`[Document DELETE] Removed from vector store: ${document.vs_file_id}`)
        }
      } catch (openaiError) {
        console.error('[Document DELETE] OpenAI deletion error:', openaiError)
        // Continue with database deletion even if OpenAI fails
      }
    }

    // Step 3: Delete from database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', document_id)
      .eq('user_id', user.id)

    if (dbError) {
      console.error('[Document DELETE] Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to delete document from database' },
        { status: 500 }
      )
    }

    console.log(`[Document DELETE] Document ${document_id} deleted successfully`)

    return NextResponse.json({
      message: 'Document deleted successfully',
      document_id,
    })

  } catch (error) {
    console.error('[Document DELETE] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
