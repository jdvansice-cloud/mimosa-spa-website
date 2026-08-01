-- Migration: gift_cards table for internal staff issuance tool.
-- The serial printed on each card/certificado is what staff scans into Mindbody at sale time.

CREATE SEQUENCE IF NOT EXISTS public.gift_card_serial_seq START 1;

CREATE TABLE IF NOT EXISTS public.gift_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial TEXT NOT NULL UNIQUE
        DEFAULT ('MG-' || lpad(nextval('public.gift_card_serial_seq')::TEXT, 6, '0')),

    format TEXT NOT NULL CHECK (format IN ('gift_card', 'certificado')),

    -- Buyer
    buyer_mindbody_client_id BIGINT,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT,
    buyer_phone TEXT,

    -- Recipient (may not be a Mindbody client)
    recipient_name TEXT NOT NULL,
    recipient_email TEXT,

    -- Money. amount_cents is what the card is worth at redemption / what may be printed.
    -- For certificados, base_amount_cents + tax_cents should equal amount_cents.
    amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
    base_amount_cents INTEGER,
    tax_cents INTEGER,
    currency TEXT NOT NULL DEFAULT 'USD',

    -- Certificado specifics
    treatment_mindbody_id TEXT,
    treatment_name TEXT,

    -- Optional personal message
    message TEXT,

    -- What to actually print
    print_amount BOOLEAN NOT NULL DEFAULT true,
    print_message BOOLEAN NOT NULL DEFAULT true,
    print_recipient BOOLEAN NOT NULL DEFAULT true,

    -- Audit / linkage
    issued_by UUID REFERENCES auth.users(id),
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    mindbody_sale_id TEXT,
    redeemed_at TIMESTAMPTZ,
    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gift_cards_issued_at ON public.gift_cards(issued_at DESC);
CREATE INDEX IF NOT EXISTS idx_gift_cards_buyer_mindbody
    ON public.gift_cards(buyer_mindbody_client_id)
    WHERE buyer_mindbody_client_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_gift_cards_unredeemed
    ON public.gift_cards(redeemed_at)
    WHERE redeemed_at IS NULL;

-- RLS: only service-role (used by /api/admin/giftcards/*) can touch this table.
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.gift_cards IS
  'Internal-issued gift cards / certificados de regalo. Serial is scanned into Mindbody at sale time.';
COMMENT ON COLUMN public.gift_cards.format IS
  'gift_card = fixed monetary amount; certificado = treatment/package priced (ITBMS-inclusive)';
COMMENT ON COLUMN public.gift_cards.amount_cents IS
  'Final redeemable amount in cents. For certificados includes ITBMS.';
