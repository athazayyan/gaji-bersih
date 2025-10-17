-- Migration: Garbage Collection
-- Created: 2025-01-17 10:50:00

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- GC Logs Table
CREATE TABLE IF NOT EXISTS public.gc_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deleted_documents INTEGER NOT NULL DEFAULT 0,
  deleted_sessions INTEGER NOT NULL DEFAULT 0,
  execution_time_ms INTEGER,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gc_logs_created_at ON public.gc_logs(created_at DESC);

-- GC Function with logging
CREATE OR REPLACE FUNCTION public.cleanup_expired_documents_with_logging()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  doc_count INTEGER;
  session_count INTEGER;
  start_time TIMESTAMPTZ;
  execution_ms INTEGER;
  error_msg TEXT;
BEGIN
  start_time := clock_timestamp();
  BEGIN
    WITH deleted_docs AS (
      DELETE FROM public.documents WHERE expires_at IS NOT NULL AND expires_at < NOW()
      RETURNING id
    ) SELECT COUNT(*) INTO doc_count FROM deleted_docs;

    WITH deleted_sessions AS (
      DELETE FROM public.sessions WHERE expires_at < NOW()
      RETURNING chat_id
    ) SELECT COUNT(*) INTO session_count FROM deleted_sessions;

    execution_ms := EXTRACT(MILLISECONDS FROM (clock_timestamp() - start_time))::INTEGER;
    INSERT INTO public.gc_logs (deleted_documents, deleted_sessions, execution_time_ms)
    VALUES (doc_count, session_count, execution_ms);
  EXCEPTION WHEN OTHERS THEN
    error_msg := SQLERRM;
    execution_ms := EXTRACT(MILLISECONDS FROM (clock_timestamp() - start_time))::INTEGER;
    INSERT INTO public.gc_logs (deleted_documents, deleted_sessions, execution_time_ms, error)
    VALUES (COALESCE(doc_count, 0), COALESCE(session_count, 0), execution_ms, error_msg);
    RAISE;
  END;
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_old_gc_logs()
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE deleted_count INTEGER;
BEGIN
  WITH deleted AS (
    DELETE FROM public.gc_logs WHERE created_at < NOW() - INTERVAL '30 days'
    RETURNING id
  ) SELECT COUNT(*) INTO deleted_count FROM deleted;
  RETURN deleted_count;
END;
$$;

-- Schedule jobs (may fail on free tier)
DO $SCHEDULE$
BEGIN
  PERFORM cron.schedule(
    'cleanup-expired-documents',
    '*/15 * * * *',
    'SELECT public.cleanup_expired_documents_with_logging();'
  );
  PERFORM cron.schedule(
    'cleanup-old-gc-logs',
    '0 3 * * *',
    'SELECT public.cleanup_old_gc_logs();'
  );
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_cron scheduling failed (requires paid plan)';
END;
$SCHEDULE$;

GRANT EXECUTE ON FUNCTION public.cleanup_expired_documents_with_logging() TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_old_gc_logs() TO service_role;

COMMENT ON FUNCTION public.cleanup_expired_documents_with_logging() IS 'GC job to delete expired sessions/docs';
