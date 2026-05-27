-- Migration: per-type gift card configuration synced from Mindbody.
--
-- Each Mindbody gift card product becomes a row in gift_card_types with its
-- own prefix and serial counter. The issuance flow picks a category, then a
-- type within that category, then asks the type's RPC to mint a serial.
--
-- Categories: 'gift_card' (default), 'certificado' (name contains "certificado"),
--             'privilege' (name contains "Privilege"). Auto-assigned on sync;
--             editable per type.

-- ---------------------------------------------------------------------------
-- 1. Align gift_cards.format check to the new vocabulary.
--    Adds 'privilege', migrates any old 'membership' rows (defensive — none
--    expected since the prior membership migration was never applied).
-- ---------------------------------------------------------------------------

UPDATE public.gift_cards SET format = 'privilege' WHERE format = 'membership';

ALTER TABLE public.gift_cards
    DROP CONSTRAINT IF EXISTS gift_cards_format_check;

ALTER TABLE public.gift_cards
    ADD CONSTRAINT gift_cards_format_check
    CHECK (format IN ('gift_card', 'certificado', 'privilege'));

-- The 20260511 migration set a DEFAULT on serial that called the global
-- gift_card_serial_seq. Serial generation now belongs to per-type RPCs;
-- drop the default so we don't accidentally allocate from the wrong counter.
ALTER TABLE public.gift_cards
    ALTER COLUMN serial DROP DEFAULT;

-- ---------------------------------------------------------------------------
-- 2. gift_card_types — one row per Mindbody gift card product.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.gift_card_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mindbody_id BIGINT UNIQUE,                       -- null when manually added
    name TEXT NOT NULL,
    value_cents INTEGER,                             -- null = open amount
    category TEXT NOT NULL
        CHECK (category IN ('gift_card', 'certificado', 'privilege')),
    prefix TEXT NOT NULL UNIQUE
        CHECK (prefix ~ '^[A-Z0-9]{1,8}$'),
    serial_length INTEGER NOT NULL DEFAULT 6
        CHECK (serial_length BETWEEN 4 AND 12),
    next_sequence_value BIGINT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gift_card_types_category_active
    ON public.gift_card_types(category, is_active)
    WHERE is_active = true;

ALTER TABLE public.gift_card_types ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.gift_card_types IS
  'Gift card product types synced from Mindbody, each with its own serial prefix and counter.';
COMMENT ON COLUMN public.gift_card_types.value_cents IS
  'Preset value in cents. NULL or 0 = open amount, staff enters at issuance.';

-- ---------------------------------------------------------------------------
-- 3. Foreign key from gift_cards → gift_card_types.
--    Nullable so existing rows (issued before this migration) stay valid.
-- ---------------------------------------------------------------------------

ALTER TABLE public.gift_cards
    ADD COLUMN IF NOT EXISTS gift_card_type_id UUID REFERENCES public.gift_card_types(id);

CREATE INDEX IF NOT EXISTS idx_gift_cards_type
    ON public.gift_cards(gift_card_type_id)
    WHERE gift_card_type_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 4. Per-type serial generation. Atomic via UPDATE … RETURNING — Postgres
--    serializes concurrent writers on the row so the counter is safe without
--    needing a dedicated sequence per type.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.next_giftcard_type_serial(p_type_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_prefix TEXT;
    v_length INTEGER;
    v_next BIGINT;
BEGIN
    UPDATE public.gift_card_types
        SET next_sequence_value = next_sequence_value + 1,
            updated_at = NOW()
        WHERE id = p_type_id
        RETURNING prefix, serial_length, next_sequence_value - 1
        INTO v_prefix, v_length, v_next;

    IF v_prefix IS NULL THEN
        RAISE EXCEPTION 'Unknown gift_card_type %', p_type_id;
    END IF;

    RETURN v_prefix || lpad(v_next::TEXT, v_length, '0');
END;
$$;

COMMENT ON FUNCTION public.next_giftcard_type_serial IS
  'Atomically mint the next serial for a gift card type, e.g. → "PRIV1K000001".';
