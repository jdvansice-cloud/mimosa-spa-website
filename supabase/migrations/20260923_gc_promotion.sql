-- A gift card can be built from an active site promotion: the promo's
-- treatments go on the card at the promo price. The card records WHICH
-- promotion, both as a reference and as a name snapshot — promotions get
-- edited and deleted, and the card must still say what was sold.
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.

ALTER TABLE public.gift_cards
  ADD COLUMN IF NOT EXISTS promotion_id UUID REFERENCES public.promotions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS promotion_name TEXT;

COMMENT ON COLUMN public.gift_cards.promotion_name IS
  'Title of the promotion applied at issue time (snapshot — survives promo edits/deletion). NULL when no promo was used.';
