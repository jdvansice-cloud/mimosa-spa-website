-- How the customer paid for the gift card, read from the Mindbody sale.
--
-- The balance endpoint the sync uses knows nothing about the sale, but
-- /sale/sales items carry GiftCardBarcodeId — an exact link from a sale to
-- the card it sold. When the sync sees a card flip to sold, it finds that
-- sale and keeps the tender ("Visa/MC", "Yappy", "Efectivo + Gift Card")
-- and the sale id, so the card's record answers "how was this paid?"
-- without opening Mindbody.
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.

ALTER TABLE public.gift_cards
  ADD COLUMN IF NOT EXISTS sold_payment_method TEXT;

COMMENT ON COLUMN public.gift_cards.sold_payment_method IS
  'Tender type(s) of the Mindbody sale that sold this card, e.g. "Yappy" or "Visa/MC + Efectivo". NULL until the sale is located.';
