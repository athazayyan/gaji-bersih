/**
 * Custom Application Types
 *
 * These are application-specific types that extend or complement database types.
 */

import type { Database } from './database.types'

// Database table types (shortcuts)
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Session = Database['public']['Tables']['sessions']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type Run = Database['public']['Tables']['runs']['Row']

// Insert types (for creating new records)
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type SessionInsert = Database['public']['Tables']['sessions']['Insert']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']
export type RunInsert = Database['public']['Tables']['runs']['Insert']

// Update types (for updating records)
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type SessionUpdate = Database['public']['Tables']['sessions']['Update']
export type DocumentUpdate = Database['public']['Tables']['documents']['Update']
export type RunUpdate = Database['public']['Tables']['runs']['Update']

// Enum types
export type DocType = Database['public']['Enums']['doc_type']
export type VectorStoreType = Database['public']['Enums']['vector_store_type']

// ============================================================================
// OpenAI Types
// ============================================================================

export interface Citation {
  type: 'web' | 'file'
  url?: string
  title?: string
  snippet?: string
  file_name?: string
  document_id?: string
  page?: number
}

export interface AnswerResponse {
  answer: string
  citations: Citation[]
  request_id?: string
  token_usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  latency_ms?: number
}

export interface AnswerRequest {
  chat_id: string
  question: string
  use_web_search?: boolean
}

// ============================================================================
// Upload Types
// ============================================================================

export interface UploadRequest {
  file: File
  chat_id?: string
  doc_type: DocType
  save_to_my_docs?: boolean // If true, document persists beyond session
}

export interface UploadResponse {
  document_id: string
  file_name: string
  file_size: number
  storage_path: string
  vs_file_id: string | null
  message: string
}

// ============================================================================
// Session Types
// ============================================================================

export interface CreateSessionRequest {
  ttl_minutes?: number // Optional, defaults to env SESSION_TTL_MINUTES
}

export interface CreateSessionResponse {
  chat_id: string
  session_vs_id: string | null
  expires_at: string
  created_at: string
}

// ============================================================================
// Document List Types
// ============================================================================

export interface DocumentListItem extends Document {
  is_expired: boolean
  signed_url?: string // Only included if requested
}

export interface DocumentListResponse {
  documents: DocumentListItem[]
  total: number
  ephemeral_count: number
  persistent_count: number
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  error: string
  message: string
  details?: unknown
  status?: number
}

// ============================================================================
// User Context
// ============================================================================

export interface UserContext {
  user_id: string
  email: string
  full_name?: string
  avatar_url?: string
}
