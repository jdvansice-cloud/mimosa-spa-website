-- Expand bookings status constraint to include statuses synced from Mindbody
-- and add tracking columns for status sync

-- Drop old constraint and add new one with all valid statuses
ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_status_check
    CHECK (status IN ('confirmed', 'partial', 'failed', 'completed', 'cancelled', 'noshow'));

-- Add columns for tracking Mindbody sync state (if not already added)
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS mindbody_status TEXT,
  ADD COLUMN IF NOT EXISTS status_synced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE;
