/**
 * API Utility Functions
 * This file contains all API integration functions for backend communication
 *
 * TODO: Replace mock implementations with actual backend API calls
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
}

/**
 * Upload file and analyze salary document
 *
 * @param file - The file to upload (PDF, Image, or Document)
 * @returns Promise with analysis result
 *
 * Backend Integration Guide:
 * 1. This function should send file to backend API endpoint
 * 2. Backend should process file using OCR/AI
 * 3. Backend should extract salary information
 * 4. Backend should return structured data
 *
 * Example Backend Endpoint:
 * POST /api/analyze-document
 * Content-Type: multipart/form-data
 * Body: { file: File }
 * Response: { success: boolean, data: AnalysisResult, message: string }
 */
export async function analyzeDocument(file: File): Promise<AnalysisResult> {
  // TODO: Replace with actual backend API call
  // const formData = new FormData();
  // formData.append('file', file);
  //
  // const response = await fetch('/api/analyze-document', {
  //   method: 'POST',
  //   body: formData,
  // });
  //
  // if (!response.ok) {
  //   throw new Error('Failed to analyze document');
  // }
  //
  // const result = await response.json();
  // return result.data;

  // Mock implementation for MVP
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        gajiPokok: 8000000,
        tunjangan: {
          kesehatan: 500000,
          transport: 300000,
          makan: 400000,
        },
        potongan: {
          bpjs: 100000,
          pajak: 400000,
        },
        gajiBersih: 8700000,
        details: "Analisis berhasil dilakukan pada dokumen penawaran kerja",
      });
    }, 5000); // Simulate 5 second processing
  });
}

/**
 * Get analysis history
 *
 * @returns Promise with array of previous analysis results
 *
 * Backend Integration:
 * GET /api/analysis-history
 * Response: { success: boolean, data: AnalysisResult[], message: string }
 */
export async function getAnalysisHistory(): Promise<AnalysisResult[]> {
  // TODO: Replace with actual backend API call
  // const response = await fetch('/api/analysis-history');
  // const result = await response.json();
  // return result.data;

  // Mock implementation for MVP
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          gajiPokok: 8000000,
          tunjangan: { kesehatan: 500000, transport: 300000, makan: 400000 },
          potongan: { bpjs: 100000, pajak: 400000 },
          gajiBersih: 8700000,
        },
      ]);
    }, 1000);
  });
}

/**
 * Save analysis result to backend
 *
 * @param data - Analysis result to save
 * @returns Promise with save confirmation
 *
 * Backend Integration:
 * POST /api/save-analysis
 * Body: { data: AnalysisResult }
 * Response: { success: boolean, id: string, message: string }
 */
export async function saveAnalysis(
  data: AnalysisResult
): Promise<{ success: boolean; id: string }> {
  // TODO: Replace with actual backend API call
  // const response = await fetch('/api/save-analysis', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ data }),
  // });
  // const result = await response.json();
  // return result;

  // Mock implementation for MVP
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        id: `analysis-${Date.now()}`,
      });
    }, 500);
  });
}
