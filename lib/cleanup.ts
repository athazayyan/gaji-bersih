/**
 * Cleanup utilities for session and document management
 *
 * Handles deletion of documents from:
 * - Supabase Storage
 * - OpenAI Vector Store
 * - Database
 */

import { createServiceClient } from '@/lib/supabase/server'
import { deleteFromVectorStore } from '@/lib/openai/vector-store'
import { VECTOR_STORES } from '@/lib/openai/client'

export interface CleanupResult {
  total_documents: number
  deleted: {
    storage: number
    vector_store: number
    database: number
  }
  failed: {
    storage: number
    vector_store: number
    database: number
  }
  errors: Array<{
    document_id: string
    file_name: string
    step: 'storage' | 'vector_store' | 'database'
    error: string
  }>
}

/**
 * Clean up documents for a specific chat session
 * Deletes from all three locations: Storage, Vector Store, and Database
 */
export async function cleanupSessionDocuments(chatId: string): Promise<CleanupResult> {
  const supabase = createServiceClient()

  const result: CleanupResult = {
    total_documents: 0,
    deleted: { storage: 0, vector_store: 0, database: 0 },
    failed: { storage: 0, vector_store: 0, database: 0 },
    errors: [],
  }

  try {
    // Get all documents for this session
    const { data: documents, error: queryError } = await supabase
      .from('documents')
      .select('*')
      .eq('chat_id', chatId)
      .not('expires_at', 'is', null) // Only ephemeral docs

    if (queryError) {
      console.error('[Cleanup] Failed to query documents:', queryError)
      throw new Error(`Failed to query documents: ${queryError.message}`)
    }

    if (!documents || documents.length === 0) {
      console.log(`[Cleanup] No documents found for chat ${chatId}`)
      return result
    }

    result.total_documents = documents.length
    console.log(`[Cleanup] Found ${documents.length} documents to delete for chat ${chatId}`)

    // Delete each document
    for (const doc of documents) {
      console.log(`[Cleanup] Processing document: ${doc.id} (${doc.file_name})`)

      // Step 1: Delete from Supabase Storage
      try {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([doc.storage_path])

        if (storageError && !storageError.message.includes('not found')) {
          throw storageError
        }

        result.deleted.storage++
        console.log(`[Cleanup] ✅ Deleted from storage: ${doc.storage_path}`)
      } catch (storageErr: any) {
        result.failed.storage++
        result.errors.push({
          document_id: doc.id,
          file_name: doc.file_name,
          step: 'storage',
          error: storageErr.message || String(storageErr),
        })
        console.error(`[Cleanup] ❌ Storage deletion failed:`, storageErr)
      }

      // Step 2: Delete from OpenAI Vector Store
      if (doc.vs_file_id && doc.file_id) {
        try {
          const success = await deleteFromVectorStore(
            VECTOR_STORES.BIG,
            doc.vs_file_id,
            doc.file_id
          )

          if (success) {
            result.deleted.vector_store++
            console.log(`[Cleanup] ✅ Deleted from vector store: ${doc.vs_file_id}`)
          } else {
            throw new Error('deleteFromVectorStore returned false')
          }
        } catch (vsErr: any) {
          result.failed.vector_store++
          result.errors.push({
            document_id: doc.id,
            file_name: doc.file_name,
            step: 'vector_store',
            error: vsErr.message || String(vsErr),
          })
          console.error(`[Cleanup] ❌ Vector store deletion failed:`, vsErr)
        }
      } else {
        console.log(`[Cleanup] ⚠️ Skipping vector store deletion (no vs_file_id or file_id)`)
      }

      // Step 3: Delete from database
      try {
        const { error: dbError } = await supabase
          .from('documents')
          .delete()
          .eq('id', doc.id)

        if (dbError) {
          throw dbError
        }

        result.deleted.database++
        console.log(`[Cleanup] ✅ Deleted from database: ${doc.id}`)
      } catch (dbErr: any) {
        result.failed.database++
        result.errors.push({
          document_id: doc.id,
          file_name: doc.file_name,
          step: 'database',
          error: dbErr.message || String(dbErr),
        })
        console.error(`[Cleanup] ❌ Database deletion failed:`, dbErr)
      }
    }

    console.log(`[Cleanup] Session cleanup complete:`, {
      total: result.total_documents,
      deleted: result.deleted,
      failed: result.failed,
      errors: result.errors.length,
    })

    return result
  } catch (error) {
    console.error('[Cleanup] Unexpected error:', error)
    throw error
  }
}

/**
 * Clean up expired documents across all sessions
 * Used for manual garbage collection
 */
export async function cleanupExpiredDocuments(): Promise<CleanupResult> {
  const supabase = createServiceClient()

  const result: CleanupResult = {
    total_documents: 0,
    deleted: { storage: 0, vector_store: 0, database: 0 },
    failed: { storage: 0, vector_store: 0, database: 0 },
    errors: [],
  }

  try {
    // Get all expired documents
    const { data: documents, error: queryError } = await supabase
      .from('documents')
      .select('*')
      .lt('expires_at', new Date().toISOString())
      .not('expires_at', 'is', null)
      .limit(100) // Process in batches

    if (queryError) {
      console.error('[Cleanup] Failed to query expired documents:', queryError)
      throw new Error(`Failed to query expired documents: ${queryError.message}`)
    }

    if (!documents || documents.length === 0) {
      console.log(`[Cleanup] No expired documents found`)
      return result
    }

    result.total_documents = documents.length
    console.log(`[Cleanup] Found ${documents.length} expired documents`)

    // Delete each document
    for (const doc of documents) {
      console.log(`[Cleanup] Processing expired document: ${doc.id} (${doc.file_name})`)

      // Step 1: Delete from Supabase Storage
      try {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([doc.storage_path])

        if (storageError && !storageError.message.includes('not found')) {
          throw storageError
        }

        result.deleted.storage++
        console.log(`[Cleanup] ✅ Deleted from storage: ${doc.storage_path}`)
      } catch (storageErr: any) {
        result.failed.storage++
        result.errors.push({
          document_id: doc.id,
          file_name: doc.file_name,
          step: 'storage',
          error: storageErr.message || String(storageErr),
        })
        console.error(`[Cleanup] ❌ Storage deletion failed:`, storageErr)
      }

      // Step 2: Delete from OpenAI Vector Store
      if (doc.vs_file_id && doc.file_id) {
        try {
          const success = await deleteFromVectorStore(
            VECTOR_STORES.BIG,
            doc.vs_file_id,
            doc.file_id
          )

          if (success) {
            result.deleted.vector_store++
            console.log(`[Cleanup] ✅ Deleted from vector store: ${doc.vs_file_id}`)
          } else {
            throw new Error('deleteFromVectorStore returned false')
          }
        } catch (vsErr: any) {
          result.failed.vector_store++
          result.errors.push({
            document_id: doc.id,
            file_name: doc.file_name,
            step: 'vector_store',
            error: vsErr.message || String(vsErr),
          })
          console.error(`[Cleanup] ❌ Vector store deletion failed:`, vsErr)
        }
      } else {
        console.log(`[Cleanup] ⚠️ Skipping vector store deletion (no vs_file_id or file_id)`)
      }

      // Step 3: Delete from database
      try {
        const { error: dbError } = await supabase
          .from('documents')
          .delete()
          .eq('id', doc.id)

        if (dbError) {
          throw dbError
        }

        result.deleted.database++
        console.log(`[Cleanup] ✅ Deleted from database: ${doc.id}`)
      } catch (dbErr: any) {
        result.failed.database++
        result.errors.push({
          document_id: doc.id,
          file_name: doc.file_name,
          step: 'database',
          error: dbErr.message || String(dbErr),
        })
        console.error(`[Cleanup] ❌ Database deletion failed:`, dbErr)
      }
    }

    console.log(`[Cleanup] Expired documents cleanup complete:`, {
      total: result.total_documents,
      deleted: result.deleted,
      failed: result.failed,
      errors: result.errors.length,
    })

    return result
  } catch (error) {
    console.error('[Cleanup] Unexpected error:', error)
    throw error
  }
}
