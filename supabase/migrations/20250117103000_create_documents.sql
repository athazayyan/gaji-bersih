-- Migration: Create Documents Table
-- Created: 2025-01-17 10:30:00

-- Enums
DO $$ BEGIN
  CREATE TYPE public.doc_type AS ENUM ('contract', 'policy', 'nda', 'regulation', 'payslip', 'other');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.vector_store_type AS ENUM ('global', 'big', 'session');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_id UUID REFERENCES public.sessions(chat_id) ON DELETE CASCADE,
  doc_type public.doc_type NOT NULL DEFAULT 'other',
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_id TEXT,
  vs_file_id TEXT,
  vector_store public.vector_store_type,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_chat_id ON public.documents(chat_id) WHERE chat_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_expires_at ON public.documents(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_user_expires ON public.documents(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_documents_user_chat ON public.documents(user_id, chat_id);
CREATE INDEX IF NOT EXISTS idx_documents_vs_file_id ON public.documents(vs_file_id) WHERE vs_file_id IS NOT NULL;

-- RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
CREATE POLICY "Users can view their own documents" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own documents" ON public.documents;
CREATE POLICY "Users can create their own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
CREATE POLICY "Users can update their own documents" ON public.documents
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;
CREATE POLICY "Users can delete their own documents" ON public.documents
  FOR DELETE USING (auth.uid() = user_id);

-- Permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;

-- Comments
COMMENT ON TABLE public.documents IS 'User document metadata for RAG system';
