-- Migration: Add User Roles
-- Description: Add role column to profiles table for admin/user distinction
-- Created: 2025-01-18 10:00:00

-- Create enum for user roles
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'user';

-- Create index on role for faster admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Note: We don't add "Admins can view all profiles" policy here
-- because it causes infinite recursion (policy queries profiles table which triggers policy again)
-- Admin users should use is_admin() function or direct queries in application code

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN user_role = 'admin';
END;
$$;

-- Grant execute permission on is_admin function
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;

COMMENT ON COLUMN public.profiles.role IS 'User role: user (default) or admin';
COMMENT ON FUNCTION public.is_admin IS 'Check if a user has admin role';
