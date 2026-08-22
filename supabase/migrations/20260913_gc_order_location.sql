-- Per-order Mindbody location for gift-card fulfillment.
--
-- A gift-card-only sale has no location the customer chose, so it posts to the
-- gift shop's configured branch (gc_shop_settings.default_mindbody_location_id
-- = San Francisco). But when a gift card rides along with a booking, it should
-- register at the spa delivering the service — so the whole order lands on one
-- branch in Mindbody. This column carries that per-order override.
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.

ALTER TABLE public.gc_orders
  ADD COLUMN IF NOT EXISTS mindbody_location_id INTEGER;

COMMENT ON COLUMN public.gc_orders.mindbody_location_id IS
  'Overrides gc_shop_settings.default_mindbody_location_id when the card was bought alongside a service.';
