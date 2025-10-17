/**
 * OpenAI-specific Types
 *
 * Type definitions for OpenAI Responses API and Vector Store operations.
 */

// ============================================================================
// Vector Store Types
// ============================================================================

/**
 * Attributes attached to vector store files for filtering
 *
 * Maximum 16 keys, 256 characters each
 * Values can be strings or numbers (timestamps, IDs, etc.)
 */
export interface VectorStoreFileAttributes {
  user_id: string
  chat_id?: string
  doc_type?: string
  expires_at?: string | number // Unix timestamp for expiration
  [key: string]: string | number | undefined
}

export interface UploadToVectorStoreParams {
  file: File | Blob
  vectorStoreId: string
  attributes: VectorStoreFileAttributes
}

export interface UploadToVectorStoreResult {
  file_id: string
  vs_file_id: string
  status: 'completed' | 'processing' | 'failed'
  error?: string
}

// ============================================================================
// Attribute Filtering Types
// ============================================================================

/**
 * Comparison filter for file attributes
 */
export type ComparisonFilter = {
  type: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin'
  key: string
  value: string | number | (string | number)[]
}

/**
 * Compound filter for combining multiple filters
 */
export type CompoundFilter = {
  type: 'and' | 'or'
  filters: AttributeFilter[]
}

/**
 * Attribute filter (can be comparison or compound)
 */
export type AttributeFilter = ComparisonFilter | CompoundFilter

// ============================================================================
// Responses API Types
// ============================================================================

export interface ResponsesAPIParams {
  question: string
  vectorStoreIds: string[]
  attributeFilter?: AttributeFilter
  useWebSearch?: boolean
  maxNumResults?: number
  model?: 'gpt-4o' | 'gpt-4.1' | 'gpt-5' | 'gpt-4o-mini'
}

export interface ResponsesAPIResult {
  answer: string
  citations: ResponseCitation[]
  request_id: string
  token_usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  tool_calls: ToolCall[]
  latency_ms?: number
}

export interface ResponseCitation {
  type: 'web' | 'file'
  // Web citations
  url?: string
  title?: string
  // File citations
  file_id?: string
  file_name?: string
  quote?: string
  // Common
  snippet?: string
  page_number?: number
}

export interface ToolCall {
  id: string
  type: 'file_search_call' | 'web_search_call' | string
  status?: 'completed' | 'failed'
  queries?: string[]
}

// ============================================================================
// File Search Tool Configuration
// ============================================================================

export interface FileSearchTool {
  type: 'file_search'
  vector_store_ids: string[]
  filters?: AttributeFilter
  max_num_results?: number
  ranking_options?: {
    score_threshold?: number
    ranker?: 'auto' | 'default-2024-08-21'
  }
}

export interface WebSearchTool {
  type: 'web_search'
  filters?: {
    allowed_domains?: string[]
  }
  user_location?: {
    type: 'approximate'
    country?: string
    city?: string
    region?: string
    timezone?: string
  }
}
