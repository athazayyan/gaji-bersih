/**
 * API Utility Functions
 * This file contains all API integration functions for backend communication
 * Integrated with backend APIs: /api/upload, /api/analyze, /api/chat/start
 */

export interface AnalysisResult {
  gajiPokok: number;
  tunjangan: {
    kesehatan?: number;
    transport?: number;
    makan?: number;
    [key: string]: number | undefined;
  };
  potongan: {
    bpjs?: number;
    pajak?: number;
    [key: string]: number | undefined;
  };
  gajiBersih: number;
  details?: string;
  issues?: any[];
  compliance?: any;
  summary?: string;
}

export interface ChatSession {
  chat_id: string;
  expires_at: string;
  created_at: string;
}

export interface UploadedDocument {
  id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  doc_type: string;
  storage_path: string;
  vs_file_id: string | null;
  expires_at: string | null;
  is_persistent: boolean;
  created_at: string;
}

/**
 * Create or retrieve a chat session
 * 
 * @param ttlMinutes - Time to live in minutes (default: 90)
 * @returns Promise with chat session data
 */
export async function createChatSession(ttlMinutes: number = 90): Promise<ChatSession> {
  const response = await fetch('/api/chat/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ttl_minutes: ttlMinutes }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create chat session');
  }

  const data = await response.json();
  return data.session;
}

/**
 * Upload file to backend
 *
 * @param file - The file to upload (PDF, Image, or Document)
 * @param chatId - The chat session ID
 * @param docType - Document type (contract, payslip, nda, etc.)
 * @param saveToMyDocs - Whether to save permanently to My Docs
 * @returns Promise with uploaded document data
 */
export async function uploadDocument(
  file: File,
  chatId: string,
  docType: string = 'contract',
  saveToMyDocs: boolean = false
): Promise<UploadedDocument> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('chat_id', chatId);
  formData.append('doc_type', docType);
  formData.append('save_to_my_docs', saveToMyDocs.toString());

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload document');
  }

  const data = await response.json();
  return data.document;
}

/**
 * Analyze uploaded document
 *
 * @param documentId - The document ID to analyze
 * @param chatId - The chat session ID
 * @param analysisType - Type of analysis (contract, payslip, nda, policy)
 * @returns Promise with analysis result
 */
export async function analyzeDocument(
  documentId: string,
  chatId: string,
  analysisType: 'contract' | 'payslip' | 'nda' | 'policy' = 'contract'
): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      document_id: documentId,
      chat_id: chatId,
      analysis_type: analysisType,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Failed to analyze document');
  }

  const data = await response.json();
  
  // Transform backend response to AnalysisResult format
  const analysis = data.analysis;
  const result = analysis.result || {};
  
  return {
    gajiPokok: result.salary?.base_salary || 0,
    tunjangan: {
      kesehatan: result.salary?.allowances?.health || 0,
      transport: result.salary?.allowances?.transportation || 0,
      makan: result.salary?.allowances?.meal || 0,
      ...result.salary?.allowances,
    },
    potongan: {
      bpjs: result.salary?.deductions?.bpjs || 0,
      pajak: result.salary?.deductions?.tax || 0,
      ...result.salary?.deductions,
    },
    gajiBersih: result.salary?.net_salary || result.salary?.take_home_pay || 0,
    issues: result.issues || [],
    compliance: result.compliance || {},
    summary: result.summary || analysis.summary || "",
    details: result.summary || analysis.summary || "Analisis berhasil dilakukan",
  };
}

/**
 * Get user's documents list
 *
 * @returns Promise with array of user documents
 */
export async function getUserDocuments(): Promise<any[]> {
  const response = await fetch('/api/documents/list');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch documents');
  }

  const data = await response.json();
  return data.documents || [];
}

/**
 * Get analysis history
 * Note: Backend doesn't have a dedicated history endpoint yet
 * This uses documents list as a temporary solution
 *
 * @returns Promise with array of previous analysis results
 */
export async function getAnalysisHistory(): Promise<AnalysisResult[]> {
  try {
    const documents = await getUserDocuments();
    
    // Map documents to analysis results format
    // This is a temporary solution until proper history endpoint is available
    return documents.map(doc => ({
      gajiPokok: 0,
      tunjangan: {},
      potongan: {},
      gajiBersih: 0,
      details: `Document: ${doc.file_name}`,
    }));
  } catch (error) {
    console.error('Failed to fetch analysis history:', error);
    return [];
  }
}

/**
 * Get specific document details
 *
 * @param documentId - The document ID
 * @returns Promise with document data
 */
export async function getDocument(documentId: string): Promise<any> {
  const response = await fetch(`/api/documents/${documentId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch document');
  }

  const data = await response.json();
  return data.document;
}

/**
 * Delete a document
 *
 * @param documentId - The document ID to delete
 * @returns Promise with deletion confirmation
 */
export async function deleteDocument(documentId: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/documents/${documentId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete document');
  }

  return { success: true };
}

/**
 * Save analysis result to backend
 * Note: Analysis is automatically saved when /api/analyze is called
 * This function is for compatibility with existing code
 *
 * @param data - Analysis result to save
 * @returns Promise with save confirmation
 */
export async function saveAnalysis(
  data: AnalysisResult
): Promise<{ success: boolean; id: string }> {
  // Analysis is automatically saved by the backend during /api/analyze
  // This is just a placeholder for compatibility
  console.log('Analysis auto-saved by backend');
  return {
    success: true,
    id: `analysis-${Date.now()}`,
  };
}
