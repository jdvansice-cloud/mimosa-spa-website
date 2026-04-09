-- ===========================================
-- MIGRATION 005: Add top picks to treatment settings
-- ===========================================
-- Adds is_top_pick column to treatment_settings table
-- Top picks are featured treatments shown at the top of menu pages
-- ===========================================

-- Add is_top_pick column to treatment_settings
ALTER TABLE public.treatment_settings
ADD COLUMN IF NOT EXISTS is_top_pick BOOLEAN DEFAULT false;

-- Create index for faster top pick queries
CREATE INDEX IF NOT EXISTS idx_treatment_settings_is_top_pick
ON public.treatment_settings(is_top_pick)
WHERE is_top_pick = true;

-- Comment for documentation
COMMENT ON COLUMN public.treatment_settings.is_top_pick IS 'Featured treatment shown prominently at the top of menu pages';
