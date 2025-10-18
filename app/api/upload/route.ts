/**
 * POST /api/upload
 * 
 * Upload document to Supabase Storage and OpenAI Vector Store
 * Supports ephemeral (session-based) and persistent (My Docs) documents
 */

import { createClient } from '@/lib/supabase/server'
import { uploadToVectorStore } from '@/lib/openai/vector-store'
import { VECTOR_STORES } from '@/lib/openai/client'
import { NextRequest, NextResponse } from 'next/server'

// File validation
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || '10') * 1024 * 1024 // Default 10MB
const ALLOWED_MIME_TYPES = (process.env.ALLOWED_MIME_TYPES || 
  'application/pdf,image/jpeg,image/png,image/webp,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
).split(',')

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

    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const chatId = formData.get('chat_id') as string
    const docType = (formData.get('doc_type') as string) || 'other'
    const saveToMyDocs = formData.get('save_to_my_docs') === 'true'

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided', field: 'file' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
          field: 'file'
        },
        { status: 400 }
      )
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          error: `File type ${file.type} not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
          field: 'file'
        },
        { status: 400 }
      )
    }

    // Validate chat_id if provided (for ephemeral docs)
    if (chatId && !saveToMyDocs) {
      const { data: session } = await (supabase
        .from('sessions') as any)
        .select('chat_id, expires_at')
        .eq('chat_id', chatId)
        .eq('user_id', user.id)
        .single()

      if (!session) {
        return NextResponse.json(
          { error: 'Invalid chat session', field: 'chat_id' },
          { status: 400 }
        )
      }

      // Check if session is expired
      if (new Date(session.expires_at) < new Date()) {
        return NextResponse.json(
          { error: 'Chat session has expired', field: 'chat_id' },
          { status: 400 }
        )
      }
    }

    console.log(`[Upload] Starting upload for user ${user.id}, file: ${file.name}`)

    // Step 1: Upload to Supabase Storage
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`
    const storagePath = saveToMyDocs 
      ? `${user.id}/my-docs/${fileName}`
      : `${user.id}/sessions/${chatId}/${fileName}`

    const fileBuffer = Buffer.from(await file.arrayBuffer())

    const { data: storageData, error: storageError } = await supabase.storage
      .from('documents')
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (storageError) {
      console.error('[Upload] Supabase storage error:', storageError)
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      )
    }

    console.log(`[Upload] File uploaded to Supabase: ${storagePath}`)

    // Step 2: Upload to OpenAI Vector Store
    let openaiFileId: string | null = null
    let vsFileId: string | null = null

    try {
      // Calculate expiration for ephemeral docs
      const expiresAt = saveToMyDocs || !chatId
        ? null
        : new Date(Date.now() + 90 * 60 * 1000) // 90 minutes TTL

      // Prepare metadata attributes
      const attributes: any = {
        user_id: user.id,
        doc_type: docType,
      }

      if (chatId && !saveToMyDocs) {
        attributes.chat_id = chatId
      }

      if (expiresAt) {
        attributes.expires_at = Math.floor(expiresAt.getTime() / 1000) // Unix timestamp
      }

      // Upload to OpenAI and wait for indexing to complete
      console.log(`[Upload] Starting OpenAI upload to vector store: ${VECTOR_STORES.BIG}`)
      console.log(`[Upload] Attributes:`, JSON.stringify(attributes, null, 2))
      
      const uploadResult = await uploadToVectorStore({
        file: new File([fileBuffer], file.name, { type: file.type }),
        vectorStoreId: VECTOR_STORES.BIG,
        attributes,
      })

      openaiFileId = uploadResult.file_id
      vsFileId = uploadResult.vs_file_id

      console.log(`[Upload] ✅ OpenAI upload successful!`)
      console.log(`[Upload] File ID: ${openaiFileId}`)
      console.log(`[Upload] VS File ID: ${vsFileId}`)
      console.log(`[Upload] Status: ${uploadResult.status}`)
      
      // Note: File might still be indexing (status: in_progress)
      // The file will be searchable once status becomes 'completed'
      // This usually takes 10-30 seconds for PDFs

    } catch (openaiError) {
      console.error('[Upload] OpenAI upload error:', openaiError)
      console.error('[Upload] Error details:', openaiError instanceof Error ? openaiError.message : String(openaiError))
      console.error('[Upload] Stack:', openaiError instanceof Error ? openaiError.stack : 'No stack trace')
      // Continue even if OpenAI upload fails - we have the file in Supabase
    }

    // Step 3: Save metadata to database
    console.log(`[Upload] Saving to database with file_id=${openaiFileId}, vs_file_id=${vsFileId}`)
    
    const { data: document, error: dbError } = await (supabase
      .from('documents') as any)
      .insert({
        user_id: user.id,
        chat_id: saveToMyDocs ? null : chatId,
        doc_type: docType,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        storage_path: storagePath,
        file_id: openaiFileId,
        vs_file_id: vsFileId,
        vector_store: 'big',
        expires_at: saveToMyDocs || !chatId
          ? null
          : new Date(Date.now() + 90 * 60 * 1000).toISOString(),
      })
      .select()
      .single()
    
    console.log(`[Upload] Database insert result:`, { 
      success: !dbError, 
      document_id: document?.id,
      file_id: document?.file_id,
      vs_file_id: document?.vs_file_id 
    })

    if (dbError) {
      console.error('[Upload] Database error:', dbError)
      // Try to cleanup uploaded files
      await supabase.storage.from('documents').remove([storagePath])
      return NextResponse.json(
        { error: 'Failed to save document metadata' },
        { status: 500 }
      )
    }

    console.log(`[Upload] Document metadata saved: ${document.id}`)

    return NextResponse.json({
      message: 'File uploaded successfully',
      document: {
        id: document.id,
        file_name: document.file_name,
        file_size: document.file_size,
        mime_type: document.mime_type,
        doc_type: document.doc_type,
        storage_path: document.storage_path,
        vs_file_id: document.vs_file_id,
        expires_at: document.expires_at,
        is_persistent: saveToMyDocs,
        created_at: document.created_at,
      },
    }, { status: 201 })

  } catch (error) {
    console.error('[Upload] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
