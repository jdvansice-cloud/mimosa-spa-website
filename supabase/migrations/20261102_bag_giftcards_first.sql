-- supabase/migrations/20261102_bag_giftcards_first.sql
-- Launch the unified bag with gift cards only: prepaid services get their own switch,
-- and bag gift cards carry the same delivery choice as the standalone shop.
ALTER TABLE public.checkout_settings
  ADD COLUMN IF NOT EXISTS services_enabled BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS gc_delivery_method TEXT CHECK (gc_delivery_method IN ('email','whatsapp','self')),
  ADD COLUMN IF NOT EXISTS gc_recipient_phone TEXT,
  ADD COLUMN IF NOT EXISTS gc_design_slug TEXT;

COMMENT ON COLUMN public.checkout_settings.services_enabled IS
  'Prepaid treatments ("Pagar ahora" + service lines in /api/checkout). Off = gift cards only.';
