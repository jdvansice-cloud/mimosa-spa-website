-- Migration: Add mindbody_service_ids array to promotions table
-- This allows linking promotions to multiple Mindbody services for booking integration

-- Add column for storing multiple Mindbody service IDs
ALTER TABLE public.promotions
ADD COLUMN IF NOT EXISTS mindbody_service_ids INTEGER[] DEFAULT '{}';

-- Add column for storing original total price (before discount)
ALTER TABLE public.promotions
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2);

-- Comment on the new columns
COMMENT ON COLUMN public.promotions.mindbody_service_ids IS 'Array of Mindbody service IDs included in this promotion';
COMMENT ON COLUMN public.promotions.original_price IS 'Original combined price of all services before promotional discount';
