-- ===========================================
-- ADD MINDBODY CLIENT ID TO PROFILES
-- Version: 1.0.1
-- ===========================================

-- Add mindbody_client_id column to profiles table
-- This stores the linked Mindbody client ID for each user
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS mindbody_client_id BIGINT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_mindbody_client_id
ON public.profiles(mindbody_client_id)
WHERE mindbody_client_id IS NOT NULL;

-- Allow users to update their own mindbody_client_id
-- (existing policy already allows users to update own profile)

-- Comment for documentation
COMMENT ON COLUMN public.profiles.mindbody_client_id IS 'Linked Mindbody client ID for booking appointments';
