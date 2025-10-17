-- Storage Configuration for Gaji Bersih
-- Description: Set up storage buckets and RLS policies for document management
-- Created: 2025-01-01

-- ============================================================================
-- DOCUMENTS BUCKET
-- ============================================================================

-- Create the documents bucket (if not exists via dashboard)
-- Bucket settings:
--   - Name: documents
--   - Public: false (private bucket, requires authentication)
--   - File size limit: 10MB
--   - Allowed MIME types: PDF, images, text files

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760, -- 10MB in bytes
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'text/plain'
  ]
)
ON CONFLICT (id) DO UPDATE
  SET file_size_limit = 10485760,
      allowed_mime_types = ARRAY[
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'text/plain'
      ];

-- ============================================================================
-- STORAGE RLS POLICIES FOR DOCUMENTS BUCKET
-- ============================================================================

-- Policy: Users can upload files to their own folder
CREATE POLICY "Users can upload to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can read their own files
CREATE POLICY "Users can read their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own files (e.g., replace document)
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Service role can manage all files (for GC cleanup)
CREATE POLICY "Service role can manage all documents"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'documents');

-- ============================================================================
-- AVATARS BUCKET
-- ============================================================================

-- Create the avatars bucket for user profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true, -- public bucket for easy avatar access
  2097152, -- 2MB in bytes
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE
  SET file_size_limit = 2097152,
      allowed_mime_types = ARRAY[
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
      ];

-- ============================================================================
-- STORAGE RLS POLICIES FOR AVATARS BUCKET
-- ============================================================================

-- Policy: Anyone can view avatars (public bucket)
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Policy: Users can upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- HELPER FUNCTION: Generate Storage Path
-- ============================================================================

-- Function to generate consistent storage paths
CREATE OR REPLACE FUNCTION public.generate_storage_path(
  user_uuid UUID,
  file_name TEXT,
  bucket_name TEXT DEFAULT 'documents'
)
RETURNS TEXT AS $$
DECLARE
  file_extension TEXT;
  new_file_name TEXT;
BEGIN
  -- Extract file extension
  file_extension := substring(file_name from '\.([^.]+)$');

  -- Generate new filename with UUID to avoid conflicts
  new_file_name := gen_random_uuid()::text || '.' || file_extension;

  -- Return path: bucket/user-uuid/file-uuid.ext
  RETURN user_uuid::text || '/' || new_file_name;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.generate_storage_path TO authenticated;

-- Add comments
COMMENT ON FUNCTION public.generate_storage_path IS 'Generates consistent storage paths for user files: user-uuid/file-uuid.ext';

-- ============================================================================
-- NOTES
-- ============================================================================

-- File organization in storage:
-- documents/
--   ├── {user-uuid-1}/
--   │   ├── {file-uuid-1}.pdf
--   │   ├── {file-uuid-2}.pdf
--   │   └── ...
--   ├── {user-uuid-2}/
--   │   └── ...
--
-- avatars/
--   ├── {user-uuid-1}/
--   │   └── avatar.jpg
--   ├── {user-uuid-2}/
--   │   └── avatar.png
--   └── ...

-- To get a signed URL for private documents:
-- supabase.storage.from('documents').createSignedUrl(path, expiresIn)

-- To get public URL for avatars:
-- supabase.storage.from('avatars').getPublicUrl(path)
