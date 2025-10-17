/**
 * POST /api/admin/regulations/upload
 * 
 * Upload regulation document to Supabase Storage and OpenAI GLOBAL Vector Store
 * Admin-only endpoint for uploading UU/PP/Permen/Perda
 */

import { createClient } from '@/lib/supabase/server'
import { uploadToVectorStore } from '@/lib/openai/vector-store'
import { VECTOR_STORES } from '@/lib/openai/client'
import { requireAdmin } from '@/lib/admin'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// File validation
const MAX_FILE_SIZE = parseInt(process.env.MAX_REGULATION_FILE_SIZE_MB || '50') * 1024 * 1024 // Default 50MB for regulations
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'text/plain',
]

// Validation schema
const uploadSchema = z.object({
  regulation_type: z.enum(['uu', 'pp', 'permen', 'perda', 'other']),
  regulation_number: z.string().min(1, 'Regulation number is required'),
  regulation_year: z.number().int().min(1945).max(2100),
  title: z.string().min(1, 'Title is required'),
  description: z.string().nullish(),
  issued_date: z.string().nullish(),
  effective_date: z.string().nullish(),
  tags: z.array(z.string()).nullish(),
})

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const user = await requireAdmin()
    const supabase = await createClient()

    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    // Get metadata from form (handle null values from multipart)
    const metadata = {
      regulation_type: formData.get('regulation_type') as string,
      regulation_number: formData.get('regulation_number') as string,
      regulation_year: parseInt(formData.get('regulation_year') as string),
      title: formData.get('title') as string,
      description: formData.get('description') || undefined,
      issued_date: formData.get('issued_date') || undefined,
      effective_date: formData.get('effective_date') || undefined,
      tags: formData.get('tags') ? JSON.parse(formData.get('tags') as string) : undefined,
    }

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
          error: `File type ${file.type} not allowed. Allowed types: PDF, DOCX, TXT`,
          field: 'file'
        },
        { status: 400 }
      )
    }

    // Validate metadata
    const validation = uploadSchema.safeParse(metadata)
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        { 
          error: firstError.message,
          field: firstError.path[0] as string
        },
        { status: 400 }
      )
    }

    console.log(`[Admin Upload] Uploading regulation: ${metadata.title}`)

    // Check for duplicate regulation
    const { data: existing } = await (supabase
      .from('regulations') as any)
      .select('id')
      .eq('regulation_type', metadata.regulation_type)
      .eq('regulation_number', metadata.regulation_number)
      .eq('regulation_year', metadata.regulation_year)
      .single()

    if (existing) {
      return NextResponse.json(
        { 
          error: `Regulation ${metadata.regulation_type.toUpperCase()} No. ${metadata.regulation_number}/${metadata.regulation_year} already exists`,
          field: 'regulation_number'
        },
        { status: 409 }
      )
    }

    // Step 1: Upload to Supabase Storage
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`
    const storagePath = `regulations/${metadata.regulation_type}/${metadata.regulation_year}/${fileName}`

    const fileBuffer = Buffer.from(await file.arrayBuffer())

    const { error: storageError } = await supabase.storage
      .from('documents')
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (storageError) {
      console.error('[Admin Upload] Supabase storage error:', storageError)
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      )
    }

    console.log(`[Admin Upload] File uploaded to Supabase: ${storagePath}`)

    // Step 2: Upload to OpenAI GLOBAL Vector Store
    let openaiFileId: string | null = null
    let vsFileId: string | null = null

    try {
      // Prepare metadata attributes for OpenAI
      const attributes: any = {
        doc_type: 'regulation',  // CRITICAL: Allows OR filter to include regulations
        regulation_type: metadata.regulation_type,
        regulation_number: metadata.regulation_number,
        regulation_year: metadata.regulation_year.toString(),
        title: metadata.title,
        source: 'admin',
      }

      if (metadata.tags && metadata.tags.length > 0) {
        attributes.tags = metadata.tags.join(',')
      }

      // Upload to GLOBAL_STORE
      const uploadResult = await uploadToVectorStore({
        file: new File([fileBuffer], file.name, { type: file.type }),
        vectorStoreId: VECTOR_STORES.GLOBAL,
        attributes,
      })

      openaiFileId = uploadResult.file_id
      vsFileId = uploadResult.vs_file_id

      console.log(`[Admin Upload] File uploaded to GLOBAL Vector Store: ${vsFileId}`)

    } catch (openaiError) {
      console.error('[Admin Upload] OpenAI upload error:', openaiError)
      // Cleanup storage
      await supabase.storage.from('documents').remove([storagePath])
      return NextResponse.json(
        { error: 'Failed to upload to vector store' },
        { status: 500 }
      )
    }

    // Step 3: Save metadata to database
    const { data: regulation, error: dbError } = await (supabase
      .from('regulations') as any)
      .insert({
        uploaded_by: user.id,
        regulation_type: metadata.regulation_type,
        regulation_number: metadata.regulation_number,
        regulation_year: metadata.regulation_year,
        title: metadata.title,
        description: metadata.description || null,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        storage_path: storagePath,
        file_id: openaiFileId,
        vs_file_id: vsFileId,
        vector_store: 'global',
        issued_date: metadata.issued_date || null,
        effective_date: metadata.effective_date || null,
        tags: metadata.tags || null,
      })
      .select()
      .single()

    if (dbError) {
      console.error('[Admin Upload] Database error:', dbError)
      // Cleanup uploaded files
      await supabase.storage.from('documents').remove([storagePath])
      return NextResponse.json(
        { error: 'Failed to save regulation metadata' },
        { status: 500 }
      )
    }

    console.log(`[Admin Upload] Regulation saved: ${regulation.id}`)

    return NextResponse.json({
      message: 'Regulation uploaded successfully',
      regulation: {
        id: regulation.id,
        regulation_type: regulation.regulation_type,
        regulation_number: regulation.regulation_number,
        regulation_year: regulation.regulation_year,
        title: regulation.title,
        file_name: regulation.file_name,
        file_size: regulation.file_size,
        vs_file_id: regulation.vs_file_id,
        tags: regulation.tags,
        created_at: regulation.created_at,
      },
    }, { status: 201 })

  } catch (error: any) {
    console.error('[Admin Upload] Unexpected error:', error)
    
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
