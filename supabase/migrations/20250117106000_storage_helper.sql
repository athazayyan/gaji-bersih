-- Migration: Storage Helper
-- Created: 2025-01-17 10:60:00

CREATE OR REPLACE FUNCTION public.generate_storage_path(
  user_uuid UUID,
  file_name TEXT,
  bucket_name TEXT DEFAULT 'documents'
)
RETURNS TEXT LANGUAGE plpgsql SET search_path = ''
AS $$
DECLARE
  file_extension TEXT;
  new_file_name TEXT;
BEGIN
  file_extension := substring(file_name from '\.([^.]+)$');
  new_file_name := gen_random_uuid()::text || '.' || file_extension;
  RETURN user_uuid::text || '/' || new_file_name;
END;
$$;

GRANT EXECUTE ON FUNCTION public.generate_storage_path TO authenticated;
COMMENT ON FUNCTION public.generate_storage_path IS 'Generates storage paths: user-uuid/file-uuid.ext';
