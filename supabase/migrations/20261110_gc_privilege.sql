-- Privilege cards: high-value gift cards sold at a discount
-- (e.g. worth $1,000, sold for $800), numbered on their OWN serial series
-- per location so they never mix with regular gift cards.
--
-- Design: the Privilege series lives on the location's existing
-- gift_card_serial_config row (a second prefix + length + counter) instead of
-- a separate row. Cards keep pointing at the same location row, so
-- location-restricted staff see and issue them with no change to scoping.
--
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.

-- 1. A second, independent series per location. NULL prefix = Privilege
--    cards are not offered at that location.
ALTER TABLE public.gift_card_serial_config
  ADD COLUMN IF NOT EXISTS privilege_prefix TEXT,
  ADD COLUMN IF NOT EXISTS privilege_serial_length INTEGER NOT NULL DEFAULT 6,
  ADD COLUMN IF NOT EXISTS privilege_next_sequence_value BIGINT NOT NULL DEFAULT 1;

ALTER TABLE public.gift_card_serial_config
  DROP CONSTRAINT IF EXISTS gift_card_serial_config_privilege_prefix_check,
  DROP CONSTRAINT IF EXISTS gift_card_serial_config_privilege_length_check,
  DROP CONSTRAINT IF EXISTS gift_card_serial_config_privilege_next_check;

ALTER TABLE public.gift_card_serial_config
  ADD CONSTRAINT gift_card_serial_config_privilege_prefix_check
    CHECK (privilege_prefix IS NULL OR privilege_prefix ~ '^[A-Z0-9]{1,8}$'),
  ADD CONSTRAINT gift_card_serial_config_privilege_length_check
    CHECK (privilege_serial_length BETWEEN 4 AND 12),
  ADD CONSTRAINT gift_card_serial_config_privilege_next_check
    CHECK (privilege_next_sequence_value >= 1);

CREATE UNIQUE INDEX IF NOT EXISTS gift_card_serial_config_privilege_prefix_key
  ON public.gift_card_serial_config (privilege_prefix)
  WHERE privilege_prefix IS NOT NULL;

COMMENT ON COLUMN public.gift_card_serial_config.privilege_prefix IS
  'Prefix of this location''s Privilege card series (e.g. PCE). NULL = Privilege not offered here.';
COMMENT ON COLUMN public.gift_card_serial_config.privilege_next_sequence_value IS
  'Next number of the Privilege series — independent of next_sequence_value.';

-- 2. Starting series for the two physical locations: P + the regular prefix
--    (CE -> PCE000001, SF -> PSF000001). Editable afterwards in
--    /admin/giftcards/config. The online sequence (MO) gets none.
UPDATE public.gift_card_serial_config
   SET privilege_prefix = 'P' || prefix
 WHERE prefix IN ('CE', 'SF')
   AND privilege_prefix IS NULL;

-- 3. Atomic mint from the Privilege series (same UPDATE … RETURNING pattern
--    as next_giftcard_serial, on the other counter).
CREATE OR REPLACE FUNCTION public.next_giftcard_privilege_serial(p_config_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_prefix TEXT;
    v_length INTEGER;
    v_next BIGINT;
BEGIN
    UPDATE public.gift_card_serial_config
        SET privilege_next_sequence_value = privilege_next_sequence_value + 1,
            updated_at = NOW()
        WHERE id = p_config_id
          AND is_active = TRUE
          AND privilege_prefix IS NOT NULL
        RETURNING privilege_prefix, privilege_serial_length, privilege_next_sequence_value - 1
        INTO v_prefix, v_length, v_next;

    IF v_prefix IS NULL THEN
        RAISE EXCEPTION 'gift_card_serial_config % has no active Privilege series', p_config_id;
    END IF;

    RETURN v_prefix || lpad(v_next::TEXT, v_length, '0');
END;
$$;

COMMENT ON FUNCTION public.next_giftcard_privilege_serial IS
  'Atomically mint the next Privilege card serial for a location, e.g. -> "PCE000001".';

-- 4. What the buyer actually paid. amount_cents stays the card''s VALUE (what
--    Mindbody loads as balance and what the label prints); sale_amount_cents
--    is the discounted price. Same naming as gc_catalog_items.sale_amount_cents.
ALTER TABLE public.gift_cards
  ADD COLUMN IF NOT EXISTS sale_amount_cents INTEGER;

ALTER TABLE public.gift_cards
  DROP CONSTRAINT IF EXISTS gift_cards_sale_amount_check;
ALTER TABLE public.gift_cards
  ADD CONSTRAINT gift_cards_sale_amount_check
    CHECK (sale_amount_cents IS NULL OR (sale_amount_cents > 0 AND sale_amount_cents < amount_cents));

COMMENT ON COLUMN public.gift_cards.sale_amount_cents IS
  'Price charged when the card was sold below its value (Privilege). NULL = sold at amount_cents.';

-- 5. format = 'privilege' marks these cards. The value has been allowed since
--    20260513; re-assert the constraint in case it drifted.
ALTER TABLE public.gift_cards DROP CONSTRAINT IF EXISTS gift_cards_format_check;
ALTER TABLE public.gift_cards
  ADD CONSTRAINT gift_cards_format_check
    CHECK (format IN ('gift_card', 'certificado', 'privilege'));
