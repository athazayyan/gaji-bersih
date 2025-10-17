-- Migration: Fix infinite recursion in profiles RLS policy
-- Description: Remove problematic admin policy that causes recursion
-- Created: 2025-01-18 10:20:00

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Keep only the simple user policy (no recursion)
-- Users can view their own profile is already defined in create_profiles migration
