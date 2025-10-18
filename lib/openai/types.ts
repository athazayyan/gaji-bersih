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

// ============================================================================
// Analysis Types (for POST /api/analyze)
// ============================================================================

export type AnalysisType = 'contract' | 'payslip' | 'nda' | 'policy'
export type IssuePriority = 'critical' | 'important' | 'optional'
export type ComplianceStatus = 'compliant' | 'potentially_non_compliant' | 'non_compliant' | 'unclear'

/**
 * Reference from stored regulation
 */
export interface StoredRegulationReference {
  type: 'stored_regulation'
  source_id: string
  title: string
  article?: string
  excerpt: string
  file_id: string
  relevance_score: number
}

/**
 * Reference from web search
 */
export interface WebSearchReference {
  type: 'web_search'
  title: string
  url: string
  snippet: string
  published_date?: string
  domain: string
  relevance_score: number
}

/**
 * Single issue identified in document analysis
 */
export interface AnalysisIssue {
  id: string
  priority: IssuePriority
  category: string
  title: string
  question: string
  contract_excerpt: string
  ai_explanation: string
  references: Array<StoredRegulationReference | WebSearchReference>
  compliance_status: ComplianceStatus
  compliance_details: string
  recommendation: string
  severity_score: number
}

/**
 * Salary calculation breakdown (for payslips)
 */
export interface SalaryCalculation {
  gross_salary: number
  deductions: {
    bpjs_kesehatan: number
    bpjs_ketenagakerjaan: number
    pph21: number
    other_deductions: number
    total_deductions: number
  }
  allowances: {
    [key: string]: number // Dynamic allowance types
    total_allowances: number
  }
  total_income: number       // gross + allowances
  take_home_pay: number      // total_income - deductions
  calculation_breakdown: {
    formula: string
    details: string
  }
}

/**
 * Summary statistics for analysis
 */
export interface AnalysisSummary {
  total_issues: number
  critical: number
  important: number
  optional: number
}

/**
 * Aggregated references section
 */
export interface AllReferences {
  stored_regulations: Array<{
    id: string
    title: string
    regulation_type: string
    regulation_number: string
    category: string
    file_id: string
    used_in_issues: string[]
  }>
  web_sources: Array<{
    title: string
    url: string
    domain: string
    published_date?: string
    used_in_issues: string[]
  }>
  total_stored_regulations: number
  total_web_sources: number
}

/**
 * Complete analysis result (matching PRD response schema)
 */
export interface AnalysisResult {
  analysis_id: string
  chat_id: string
  document: {
    id: string
    name: string
    type: string
    uploaded_at: string
  }
  summary: AnalysisSummary
  salary_calculation?: SalaryCalculation
  issues: AnalysisIssue[]
  all_references: AllReferences
  metadata: {
    analyzed_at: string
    model_used: string
    search_methods_used: string[]
    tokens_used: {
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }
    processing_time_ms: number
  }
}

/**
 * Simplified markdown analysis result for alternative endpoint
 */
export interface AnalysisMarkdownResult {
  analysis_id: string
  chat_id: string
  document: {
    id: string
    name: string
    type: string
    uploaded_at: string
  }
  markdown_content: string
  metadata: {
    analyzed_at: string
    model_used: string
    search_methods_used: string[]
    tokens_used: {
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }
    processing_time_ms: number
  }
}

// ============================================================================
// Chat Types (for POST /api/chat)
// ============================================================================

/**
 * Contract citation in chat response
 */
export interface ContractCitation {
  document_id: string
  document_name: string
  document_type: string
  page?: number
  excerpt: string
  relevance_score: number
}

/**
 * Regulation citation in chat response
 */
export interface RegulationCitation {
  regulation_id: string
  title: string
  regulation_type: string
  regulation_number: string
  article?: string
  excerpt: string
  file_id: string
  relevance_score: number
}

/**
 * Web citation in chat response
 */
export interface WebCitation {
  title: string
  url: string
  domain: string
  snippet: string
  published_date?: string
  relevance_score: number
}

/**
 * Multi-source citations for chat response
 */
export interface ChatSourceCitations {
  contract_citations: ContractCitation[]
  regulation_citations: RegulationCitation[]
  web_citations: WebCitation[]
}

/**
 * Chat response result (matching PRD response schema)
 */
export interface ChatResult {
  message_id: string
  chat_id: string
  role: 'assistant'
  content: string
  sources: ChatSourceCitations
  context: {
    analysis_id?: string
    previous_messages_count: number
    user_gross_salary?: number
  }
  metadata: {
    created_at: string
    model_used: string
    search_methods_used: string[]
    tokens_used: {
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }
  }
}
