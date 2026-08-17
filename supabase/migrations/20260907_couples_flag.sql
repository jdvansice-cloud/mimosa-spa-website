-- Couples (parejas) visit flag. Detected when: (a) the website books a
-- service from a Parejas program, or (b) staff book 2+ simultaneous
-- appointments with different therapists under one client profile.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS is_couples BOOLEAN NOT NULL DEFAULT false;
