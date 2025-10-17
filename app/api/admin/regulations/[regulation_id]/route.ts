/**
 * GET /api/admin/regulations/[regulation_id]
 * DELETE /api/admin/regulations/[regulation_id]
 * 
 * Get regulation details (public) or delete regulation (admin-only)
 */

import { createClient } from '@/lib/supabase/server'
import { deleteFromVectorStore } from '@/lib/openai/vector-store'
import { VECTOR_STORES } from '@/lib/openai/client'
import { requireAdmin } from '@/lib/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ regulation_id: string }> }
) {
  try {
    const supabase = await createClient()

    // Get current user (authentication required)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { regulation_id } = await params

    // Fetch regulation
    const { data: regulation, error: dbError } = await (supabase
      .from('regulations') as any)
      .select('*')
      .eq('id', regulation_id)
      .single()

    if (dbError || !regulation) {
      return NextResponse.json(
        { error: 'Regulation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      regulation: {
        id: regulation.id,
        regulation_type: regulation.regulation_type,
        regulation_number: regulation.regulation_number,
        regulation_year: regulation.regulation_year,
        title: regulation.title,
        description: regulation.description,
        file_name: regulation.file_name,
        file_size: regulation.file_size,
        mime_type: regulation.mime_type,
        storage_path: regulation.storage_path,
        vs_file_id: regulation.vs_file_id,
        issued_date: regulation.issued_date,
        effective_date: regulation.effective_date,
        tags: regulation.tags,
        created_at: regulation.created_at,
        updated_at: regulation.updated_at,
      },
    })

  } catch (error) {
    console.error('[Regulation GET] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ regulation_id: string }> }
) {
  try {
    // Check admin access
    await requireAdmin()
    const supabase = await createClient()
    const { regulation_id } = await params

    // Fetch regulation first to get metadata
    const { data: regulation, error: fetchError } = await (supabase
      .from('regulations') as any)
      .select('*')
      .eq('id', regulation_id)
      .single()

    if (fetchError || !regulation) {
      return NextResponse.json(
        { error: 'Regulation not found' },
        { status: 404 }
      )
    }

    console.log(`[Regulation DELETE] Deleting regulation ${regulation_id}`)

    // Step 1: Delete from Supabase Storage
    if (regulation.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([regulation.storage_path])

      if (storageError) {
        console.error('[Regulation DELETE] Storage deletion error:', storageError)
        // Continue with other deletions even if storage fails
      } else {
        console.log(`[Regulation DELETE] Removed from storage: ${regulation.storage_path}`)
      }
    }

    // Step 2: Delete from OpenAI GLOBAL Vector Store
    if (regulation.vs_file_id && regulation.file_id) {
      try {
        const vectorStoreId = VECTOR_STORES.GLOBAL

        if (!vectorStoreId) {
          console.error('[Regulation DELETE] GLOBAL vector store ID not found in environment')
          console.error('[Regulation DELETE] Skipping vector store deletion - files will remain orphaned!')
        } else {
          await deleteFromVectorStore(vectorStoreId, regulation.vs_file_id, regulation.file_id)
          console.log(`[Regulation DELETE] Removed from GLOBAL vector store: ${regulation.vs_file_id}`)
        }
      } catch (openaiError) {
        console.error('[Regulation DELETE] OpenAI deletion error:', openaiError)
        // Continue with database deletion even if OpenAI fails
      }
    } else {
      console.log(`[Regulation DELETE] Skipping vector store deletion - missing metadata (vs_file_id: ${regulation.vs_file_id}, file_id: ${regulation.file_id})`)
    }

    // Step 3: Delete from database
    const { error: dbError } = await supabase
      .from('regulations')
      .delete()
      .eq('id', regulation_id)

    if (dbError) {
      console.error('[Regulation DELETE] Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to delete regulation from database' },
        { status: 500 }
      )
    }

    console.log(`[Regulation DELETE] Regulation ${regulation_id} deleted successfully`)

    return NextResponse.json({
      message: 'Regulation deleted successfully',
      regulation_id,
    })

  } catch (error: any) {
    console.error('[Regulation DELETE] Unexpected error:', error)
    
    // Handle admin auth errors
    if (error.message === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    if (error.message === 'Forbidden: Admin access required') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
