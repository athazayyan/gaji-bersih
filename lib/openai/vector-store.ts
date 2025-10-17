/**
 * OpenAI Vector Store Management with Attributes
 *
 * Functions for uploading files to and managing OpenAI Vector Stores
 * with first-class attribute support for filtering.
 */

import { openai, VECTOR_STORES } from './client'
import type {
  UploadToVectorStoreParams,
  UploadToVectorStoreResult,
  VectorStoreFileAttributes,
} from './types'

/**
 * Upload a file to OpenAI and attach it to a vector store with attributes
 *
 * This function:
 * 1. Uploads file to OpenAI Files API (purpose: "assistants")
 * 2. Attaches file to vector store with attributes for filtering
 * 3. Returns file IDs and status
 */
export async function uploadToVectorStore(
  params: UploadToVectorStoreParams
): Promise<UploadToVectorStoreResult> {
  try {
    // Step 1: Upload file to OpenAI Files API
    const file = await openai.files.create({
      file: params.file,
      purpose: 'assistants',
    })

    console.log(`[OpenAI] File uploaded: ${file.id}`)

    // Step 2: Attach file to vector store with attributes
    const vectorStoreFile = await openai.vectorStores.files.create(
      params.vectorStoreId,
      {
        file_id: file.id,
        // Set attributes for filtering (filter out undefined values)
        attributes: Object.fromEntries(
          Object.entries(params.attributes).filter(([_, v]) => v !== undefined)
        ) as any,
      }
    )

    console.log(
      `[OpenAI] File attached to vector store: ${vectorStoreFile.id}`,
      `attributes:`,
      params.attributes
    )

    // Step 3: Return result
    return {
      file_id: file.id,
      vs_file_id: vectorStoreFile.id,
      status: vectorStoreFile.status as 'completed' | 'processing' | 'failed',
    }
  } catch (error) {
    console.error('[OpenAI] Error uploading to vector store:', error)
    throw new Error(
      `Failed to upload file to vector store: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Upload and poll until indexing is complete
 *
 * This blocks until the file is fully indexed and ready for search.
 */
export async function uploadAndPollVectorStore(
  params: UploadToVectorStoreParams
): Promise<UploadToVectorStoreResult> {
  try {
    // Step 1: Upload file to OpenAI Files API
    const file = await openai.files.create({
      file: params.file,
      purpose: 'assistants',
    })

    console.log(`[OpenAI] File uploaded: ${file.id}`)

    // Step 2: Attach file to vector store and poll until completed
    const vectorStoreFile = await openai.vectorStores.files.createAndPoll(
      params.vectorStoreId,
      {
        file_id: file.id,
        attributes: Object.fromEntries(
          Object.entries(params.attributes).filter(([_, v]) => v !== undefined)
        ) as any,
      }
    )

    console.log(
      `[OpenAI] File indexed in vector store: ${vectorStoreFile.id}, status: ${vectorStoreFile.status}`
    )

    return {
      file_id: file.id,
      vs_file_id: vectorStoreFile.id,
      status: vectorStoreFile.status as 'completed' | 'processing' | 'failed',
    }
  } catch (error) {
    console.error('[OpenAI] Error uploading and polling:', error)
    throw new Error(
      `Failed to upload and index file: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Update attributes on an existing vector store file
 */
export async function updateVectorStoreFileAttributes(
  vectorStoreId: string,
  fileId: string,
  attributes: VectorStoreFileAttributes
): Promise<boolean> {
  try {
    await (openai.vectorStores.files as any).update(vectorStoreId, fileId, {
      attributes: Object.fromEntries(
        Object.entries(attributes).filter(([_, v]) => v !== undefined)
      ) as any,
    } as any)

    console.log(`[OpenAI] Updated attributes for file ${fileId}:`, attributes)
    return true
  } catch (error) {
    console.error('[OpenAI] Error updating file attributes:', error)
    return false
  }
}

/**
 * Check the status of a vector store file
 */
export async function checkVectorStoreFileStatus(
  vectorStoreId: string,
  fileId: string
): Promise<'completed' | 'processing' | 'failed' | 'cancelled'> {
  try {
    const file = await (openai.vectorStores.files as any).retrieve(
      vectorStoreId,
      fileId,
      {} as any
    )
    // Map 'in_progress' to 'processing' for compatibility
    const status = file.status === 'in_progress' ? 'processing' : file.status
    return status as 'completed' | 'processing' | 'failed' | 'cancelled'
  } catch (error) {
    console.error('[OpenAI] Error checking vector store file status:', error)
    return 'failed'
  }
}

/**
 * Delete a file from OpenAI vector store and Files API
 */
export async function deleteFromVectorStore(
  vectorStoreId: string,
  vsFileId: string,
  fileId: string
): Promise<boolean> {
  try {
    // Delete from vector store
    // Correct SDK signature: delete(fileID, { vector_store_id })
    await openai.vectorStores.files.delete(vsFileId, {
      vector_store_id: vectorStoreId,
    })
    console.log(`[OpenAI] Deleted from vector store: ${vsFileId}`)

    // Delete the file itself from OpenAI Files API
    await openai.files.delete(fileId)
    console.log(`[OpenAI] Deleted file: ${fileId}`)

    return true
  } catch (error) {
    console.error('[OpenAI] Error deleting from vector store:', error)
    return false
  }
}

/**
 * List files in a vector store (with optional attribute filter)
 */
export async function listVectorStoreFiles(vectorStoreId: string) {
  try {
    const files = await openai.vectorStores.files.list(vectorStoreId)
    return files.data
  } catch (error) {
    console.error('[OpenAI] Error listing vector store files:', error)
    return []
  }
}

/**
 * Cleanup expired files from BIG_STORE based on expires_at attribute
 *
 * This function queries all files in the vector store and deletes those
 * where attributes.expires_at < now (in Unix timestamp).
 */
export async function cleanupExpiredFiles(): Promise<{
  deleted: number
  errors: number
}> {
  let deleted = 0
  let errors = 0

  try {
    const now = Math.floor(Date.now() / 1000) // Current Unix timestamp

    // List all files in BIG_STORE
    const files = await listVectorStoreFiles(VECTOR_STORES.BIG)

    console.log(`[OpenAI GC] Checking ${files.length} files for expiration`)

    // Filter and delete expired files
    for (const file of files) {
      try {
        // Check if file has expires_at attribute
        const expiresAt = file.attributes?.expires_at

        if (expiresAt) {
          const expiresAtTimestamp =
            typeof expiresAt === 'string' ? parseInt(expiresAt, 10) : (expiresAt as number)

          // If expired, delete it
          if (expiresAtTimestamp < now) {
            console.log(
              `[OpenAI GC] Deleting expired file: ${file.id} (expired at ${new Date(expiresAtTimestamp * 1000).toISOString()})`
            )

            const success = await deleteFromVectorStore(
              VECTOR_STORES.BIG,
              file.id,
              (file as any).file_id || file.id
            )

            if (success) {
              deleted++
            } else {
              errors++
            }
          }
        }
      } catch (fileError) {
        console.error(
          `[OpenAI GC] Error processing file ${file.id}:`,
          fileError
        )
        errors++
      }
    }

    console.log(
      `[OpenAI GC] Cleanup complete: ${deleted} deleted, ${errors} errors`
    )
  } catch (error) {
    console.error('[OpenAI GC] Error during cleanup:', error)
  }

  return { deleted, errors }
}

/**
 * Batch upload multiple files to vector store
 */
export async function batchUploadToVectorStore(
  files: { file: File | Blob; attributes: VectorStoreFileAttributes }[],
  vectorStoreId: string = VECTOR_STORES.BIG
): Promise<UploadToVectorStoreResult[]> {
  const results = await Promise.allSettled(
    files.map((f) =>
      uploadToVectorStore({
        file: f.file,
        vectorStoreId,
        attributes: f.attributes,
      })
    )
  )

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value
    } else {
      console.error(`[OpenAI] Failed to upload file ${index}:`, result.reason)
      return {
        file_id: '',
        vs_file_id: '',
        status: 'failed' as const,
        error:
          result.reason instanceof Error
            ? result.reason.message
            : 'Unknown error',
      }
    }
  })
}
