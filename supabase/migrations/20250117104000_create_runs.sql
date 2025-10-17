-- Migration: Create Runs Table
-- Created: 2025-01-17 10:40:00

CREATE TABLE IF NOT EXISTS public.runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES public.sessions(chat_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_id TEXT,
  question TEXT NOT NULL,
  answer TEXT,
  token_usage INTEGER,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  latency_ms INTEGER,
  citations_json JSONB,
  tool_calls JSONB,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_runs_user_id ON public.runs(user_id);
CREATE INDEX IF NOT EXISTS idx_runs_chat_id ON public.runs(chat_id);
CREATE INDEX IF NOT EXISTS idx_runs_created_at ON public.runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_runs_user_created ON public.runs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_runs_citations ON public.runs USING GIN (citations_json);
CREATE INDEX IF NOT EXISTS idx_runs_error ON public.runs(error) WHERE error IS NOT NULL;

-- RLS
ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own runs" ON public.runs;
CREATE POLICY "Users can view their own runs" ON public.runs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create runs" ON public.runs;
CREATE POLICY "Users can create runs" ON public.runs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Permissions
GRANT SELECT, INSERT ON public.runs TO authenticated;

-- View for analytics
CREATE OR REPLACE VIEW public.user_usage_stats AS
SELECT user_id, COUNT(*) as total_queries, SUM(token_usage) as total_tokens,
  AVG(latency_ms) as avg_latency_ms, COUNT(CASE WHEN error IS NOT NULL THEN 1 END) as error_count,
  DATE_TRUNC('day', created_at) as query_date
FROM public.runs GROUP BY user_id, DATE_TRUNC('day', created_at);

GRANT SELECT ON public.user_usage_stats TO authenticated;
ALTER VIEW public.user_usage_stats SET (security_invoker = on);

COMMENT ON TABLE public.runs IS 'Query execution logs for observability and cost tracking';
