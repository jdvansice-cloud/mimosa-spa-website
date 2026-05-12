-- Migration: track Mindbody sync state on gift_cards.
-- After staff scans the serial into Mindbody at sale time, the "Sincronizar"
-- action calls /sale/giftcardbalance and persists the result here.

ALTER TABLE public.gift_cards
    ADD COLUMN IF NOT EXISTS sold_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS mindbody_barcode_id TEXT,
    ADD COLUMN IF NOT EXISTS mindbody_remaining_balance_cents INTEGER,
    ADD COLUMN IF NOT EXISTS mindbody_synced_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_gift_cards_unsold
    ON public.gift_cards(issued_at DESC)
    WHERE sold_at IS NULL;

COMMENT ON COLUMN public.gift_cards.sold_at IS
  'First time Mindbody returned a record for this serial — i.e. the sale was rung up.';
COMMENT ON COLUMN public.gift_cards.mindbody_barcode_id IS
  'BarcodeId echoed by Mindbody /sale/giftcardbalance — confirms linkage.';
COMMENT ON COLUMN public.gift_cards.mindbody_remaining_balance_cents IS
  'Remaining balance in cents as of the last sync.';
COMMENT ON COLUMN public.gift_cards.mindbody_synced_at IS
  'Timestamp of the last successful balance fetch from Mindbody.';
