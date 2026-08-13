-- Capture the Tilopay payment method per order so the Mindbody registration
-- can use matching tenders (Yappy Web / Visa/MC Web / AMEX Web) and the
-- accountant can reconcile Mindbody ↔ Tilopay ↔ bank per method.
-- Idempotent — apply manually in the Supabase SQL editor.

ALTER TABLE public.gc_orders
  ADD COLUMN IF NOT EXISTS tilopay_method TEXT,       -- raw selected_method/brand from the callback
  ADD COLUMN IF NOT EXISTS mindbody_tender TEXT;      -- tender name used at registration
