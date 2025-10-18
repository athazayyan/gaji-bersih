-- Migration: Create Analyses Table
-- Description: Store structured analysis reports for employment documents
-- Created: 2025-01-18 11:00:00

-- Create analyses table
CREATE TABLE IF NOT EXISTS public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES public.sessions(chat_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL CHECK (analysis_type IN ('contract', 'payslip', 'nda', 'policy')),

  -- Structured analysis data (rich nested JSON matching PRD schema)
  summary JSONB NOT NULL,              -- {total_issues, critical, important, optional}
  issues JSONB NOT NULL,               -- Array of identified issues with full details
  salary_calculation JSONB,            -- Take-home pay calculation (nullable, only for payslips)
  all_references JSONB NOT NULL,       -- Aggregated citations {stored_regulations, web_sources}

  -- Metadata
  model_used TEXT DEFAULT 'gpt-4o',
  tokens_used INTEGER,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_analysis_per_document UNIQUE(document_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analyses_chat_id ON public.analyses(chat_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_document_id ON public.analyses(document_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON public.analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_user_created ON public.analyses(user_id, created_at DESC);

-- GIN index for JSONB queries
CREATE INDEX IF NOT EXISTS idx_analyses_summary ON public.analyses USING GIN (summary);
CREATE INDEX IF NOT EXISTS idx_analyses_issues ON public.analyses USING GIN (issues);

-- Enable Row Level Security
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own analyses
DROP POLICY IF EXISTS "Users can view their own analyses" ON public.analyses;
CREATE POLICY "Users can view their own analyses" ON public.analyses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own analyses
DROP POLICY IF EXISTS "Users can insert their own analyses" ON public.analyses;
CREATE POLICY "Users can insert their own analyses" ON public.analyses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own analyses
DROP POLICY IF EXISTS "Users can update their own analyses" ON public.analyses;
CREATE POLICY "Users can update their own analyses" ON public.analyses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own analyses
DROP POLICY IF EXISTS "Users can delete their own analyses" ON public.analyses;
CREATE POLICY "Users can delete their own analyses" ON public.analyses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER set_analyses_updated_at
  BEFORE UPDATE ON public.analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analyses TO authenticated;

-- Comments
COMMENT ON TABLE public.analyses IS 'Structured analysis reports for Phase 1 (document analysis). Stores rich nested data with issues, compliance checks, and salary calculations.';
COMMENT ON COLUMN public.analyses.summary IS 'Summary statistics: {total_issues, critical, important, optional}';
COMMENT ON COLUMN public.analyses.issues IS 'Array of issue objects with priority, category, references, compliance status, etc.';
COMMENT ON COLUMN public.analyses.salary_calculation IS 'Take-home pay calculation for payslips: {gross_salary, deductions, allowances, total_income, take_home_pay, calculation_breakdown}';
COMMENT ON COLUMN public.analyses.all_references IS 'Aggregated citations: {stored_regulations: [], web_sources: [], total_stored_regulations, total_web_sources}';
