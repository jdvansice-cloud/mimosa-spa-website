-- Migration: collapse the gift card platform to a single global config.
--
-- - Drops the per-type system (gift_card_types, the FK, the per-type RPC).
--   Mimosa is the sole source of truth for gift cards and their serials —
--   nothing is synced from Mindbody.
-- - Single-row gift_card_serial_config holds the one prefix + length + counter.
-- - New next_giftcard_serial() RPC (no args) atomically mints the next serial.
-- - Adds gift_treatment_names + print_treatments to gift_cards so the
--   optional treatments-as-a-gift selection can be persisted and printed.
--
-- Idempotent against the partial 20260513 state (whether or not staff ran it).

-- ---------------------------------------------------------------------------
-- 1. Tear down the per-type system if it exists.
-- ---------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.next_giftcard_type_serial(UUID);
DROP FUNCTION IF EXISTS public.next_giftcard_serial(TEXT);  -- old 3-format variant
ALTER TABLE public.gift_cards DROP COLUMN IF EXISTS gift_card_type_id;
DROP TABLE IF EXISTS public.gift_card_types;
DROP TABLE IF EXISTS public.gift_card_format_settings;       -- never shipped to prod

-- The format column had a CHECK that required gift_card/certificado/privilege.
-- Future rows always store 'gift_card' (single type), but we leave the column
-- in place for existing data and relax the check.
ALTER TABLE public.gift_cards DROP CONSTRAINT IF EXISTS gift_cards_format_check;
ALTER TABLE public.gift_cards
    ADD CONSTRAINT gift_cards_format_check
    CHECK (format IN ('gift_card', 'certificado', 'privilege'));

-- Drop any stray DEFAULT on serial (kept lingering from older migrations).
ALTER TABLE public.gift_cards ALTER COLUMN serial DROP DEFAULT;

-- ---------------------------------------------------------------------------
-- 2. Optional treatments for the label.
--    When staff picks treatments as a gift (customer reference), persist
--    their names so the label can print them.
-- ---------------------------------------------------------------------------

ALTER TABLE public.gift_cards
    ADD COLUMN IF NOT EXISTS gift_treatment_names TEXT[],
    ADD COLUMN IF NOT EXISTS print_treatments BOOLEAN NOT NULL DEFAULT TRUE;

COMMENT ON COLUMN public.gift_cards.gift_treatment_names IS
  'Optional list of Mindbody treatment names selected as a gift. For label printing + reference.';
COMMENT ON COLUMN public.gift_cards.print_treatments IS
  'When true, the label prints the gift_treatment_names list.';

-- ---------------------------------------------------------------------------
-- 3. Single-row config: one prefix, one length, one counter.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.gift_card_serial_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    prefix TEXT NOT NULL
        CHECK (prefix ~ '^[A-Z0-9]{1,8}$'),
    serial_length INTEGER NOT NULL DEFAULT 6
        CHECK (serial_length BETWEEN 4 AND 12),
    next_sequence_value BIGINT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.gift_card_serial_config ENABLE ROW LEVEL SECURITY;

INSERT INTO public.gift_card_serial_config (id, prefix, serial_length)
VALUES (1, 'MG', 6)
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE public.gift_card_serial_config IS
  'Single-row config: one prefix and counter for all Mimosa gift card serials.';

-- ---------------------------------------------------------------------------
-- 4. Atomic serial generation. UPDATE … RETURNING serializes concurrent
--    writers on the single row, so no race.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.next_giftcard_serial()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_prefix TEXT;
    v_length INTEGER;
    v_next BIGINT;
BEGIN
    UPDATE public.gift_card_serial_config
        SET next_sequence_value = next_sequence_value + 1,
            updated_at = NOW()
        WHERE id = 1
        RETURNING prefix, serial_length, next_sequence_value - 1
        INTO v_prefix, v_length, v_next;

    IF v_prefix IS NULL THEN
        RAISE EXCEPTION 'gift_card_serial_config row not initialized';
    END IF;

    RETURN v_prefix || lpad(v_next::TEXT, v_length, '0');
END;
$$;

COMMENT ON FUNCTION public.next_giftcard_serial IS
  'Atomically mint the next gift card serial, e.g. → "MG000001".';
