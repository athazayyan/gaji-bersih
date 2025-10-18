-- Migration: Add Storage Policies for Admin Regulations
-- Description: Allow admins to upload regulations to regulations/* path
-- Created: 2025-01-18 10:30:00

-- Policy: Admins can upload to regulations folder
CREATE POLICY "Admins can upload regulations"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'regulations'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Admins can read regulations
CREATE POLICY "Admins can read regulations"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'regulations'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Admins can delete regulations
CREATE POLICY "Admins can delete regulations"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'regulations'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: All authenticated users can read regulations (public access)
CREATE POLICY "Authenticated users can read regulations"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = 'regulations'
);
