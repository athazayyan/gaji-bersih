-- Migration: Create Regulations Table
-- Description: Store admin-uploaded regulations for GLOBAL_STORE
-- Created: 2025-01-18 10:10:00

-- Create regulations table
CREATE TABLE IF NOT EXISTS public.regulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  regulation_type TEXT NOT NULL CHECK (regulation_type IN ('uu', 'pp', 'permen', 'perda', 'other')),
  regulation_number TEXT NOT NULL,
  regulation_year INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  -- File information
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  
  -- Storage paths
  storage_path TEXT NOT NULL,
  file_id TEXT, -- OpenAI File ID
  vs_file_id TEXT, -- OpenAI Vector Store File ID
  vector_store TEXT DEFAULT 'global', -- Always 'global' for regulations
  
  -- Metadata
  issued_date DATE,
  effective_date DATE,
  tags TEXT[], -- Array of tags for categorization
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_regulations_type ON public.regulations(regulation_type);
CREATE INDEX IF NOT EXISTS idx_regulations_year ON public.regulations(regulation_year);
CREATE INDEX IF NOT EXISTS idx_regulations_uploaded_by ON public.regulations(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_regulations_tags ON public.regulations USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_regulations_created_at ON public.regulations(created_at DESC);

-- Full text search index
CREATE INDEX IF NOT EXISTS idx_regulations_search ON public.regulations 
  USING GIN(to_tsvector('indonesian', title || ' ' || COALESCE(description, '')));

-- Enable Row Level Security
ALTER TABLE public.regulations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Everyone (authenticated users) can view regulations
DROP POLICY IF EXISTS "Anyone can view regulations" ON public.regulations;
CREATE POLICY "Anyone can view regulations" ON public.regulations
  FOR SELECT 
  TO authenticated
  USING (true);

-- Only admins can insert regulations
DROP POLICY IF EXISTS "Only admins can insert regulations" ON public.regulations;
CREATE POLICY "Only admins can insert regulations" ON public.regulations
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update regulations
DROP POLICY IF EXISTS "Only admins can update regulations" ON public.regulations;
CREATE POLICY "Only admins can update regulations" ON public.regulations
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete regulations
DROP POLICY IF EXISTS "Only admins can delete regulations" ON public.regulations;
CREATE POLICY "Only admins can delete regulations" ON public.regulations
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_regulations_updated_at
  BEFORE UPDATE ON public.regulations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Comments
COMMENT ON TABLE public.regulations IS 'Admin-uploaded regulations stored in GLOBAL_STORE';
COMMENT ON COLUMN public.regulations.regulation_type IS 'Type: uu, pp, permen, perda, other';
COMMENT ON COLUMN public.regulations.vector_store IS 'Always "global" for regulations';
COMMENT ON COLUMN public.regulations.tags IS 'Array of tags for categorization and filtering';
