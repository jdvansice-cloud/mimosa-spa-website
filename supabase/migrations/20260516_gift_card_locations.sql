-- Migration: per-location serial config + location-restricted admins.
--
-- - Reshape gift_card_serial_config to multi-row, one per Mindbody location.
--   Each location has its own prefix and counter so the two locations' serials
--   never collide.
-- - next_giftcard_serial(p_config_id UUID) mints the next serial for a given
--   location config (atomic via UPDATE … RETURNING).
-- - gift_cards rows record which location config and Mindbody location they
--   came from.
-- - profiles gets gift_card_location_config_id. When set on an admin profile,
--   that admin is locked to that location and only sees the gift card pages.

-- ---------------------------------------------------------------------------
-- 1. Reshape gift_card_serial_config.
--    Drop the single-row table and recreate. The previous default row had no
--    cards issued against it.
-- ---------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.next_giftcard_serial();
DROP FUNCTION IF EXISTS public.next_giftcard_serial(UUID);
DROP TABLE IF EXISTS public.gift_card_serial_config;

CREATE TABLE public.gift_card_serial_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mindbody_location_id INTEGER NOT NULL UNIQUE,
    location_name TEXT NOT NULL,
    prefix TEXT NOT NULL UNIQUE
        CHECK (prefix ~ '^[A-Z0-9]{1,8}$'),
    serial_length INTEGER NOT NULL DEFAULT 6
        CHECK (serial_length BETWEEN 4 AND 12),
    next_sequence_value BIGINT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.gift_card_serial_config ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.gift_card_serial_config IS
  'One row per Mindbody location. Each location has its own gift card prefix and counter.';

-- ---------------------------------------------------------------------------
-- 2. Per-location serial generation RPC.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.next_giftcard_serial(p_config_id UUID)
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
        WHERE id = p_config_id
          AND is_active = TRUE
        RETURNING prefix, serial_length, next_sequence_value - 1
        INTO v_prefix, v_length, v_next;

    IF v_prefix IS NULL THEN
        RAISE EXCEPTION 'gift_card_serial_config % not found or inactive', p_config_id;
    END IF;

    RETURN v_prefix || lpad(v_next::TEXT, v_length, '0');
END;
$$;

COMMENT ON FUNCTION public.next_giftcard_serial IS
  'Atomically mint the next gift card serial for a specific location config.';

-- ---------------------------------------------------------------------------
-- 3. Link issued gift cards to their location.
--    Both columns nullable so existing rows stay valid.
-- ---------------------------------------------------------------------------

ALTER TABLE public.gift_cards
    ADD COLUMN IF NOT EXISTS gift_card_serial_config_id UUID REFERENCES public.gift_card_serial_config(id),
    ADD COLUMN IF NOT EXISTS mindbody_location_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_gift_cards_serial_config
    ON public.gift_cards(gift_card_serial_config_id)
    WHERE gift_card_serial_config_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_gift_cards_mindbody_location
    ON public.gift_cards(mindbody_location_id)
    WHERE mindbody_location_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 4. Per-location admin profiles.
--    When set on a role='admin' profile, the user is restricted to issuing
--    Gift Cards for that one location.
-- ---------------------------------------------------------------------------

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS gift_card_location_config_id UUID REFERENCES public.gift_card_serial_config(id);

CREATE INDEX IF NOT EXISTS idx_profiles_gift_card_location
    ON public.profiles(gift_card_location_config_id)
    WHERE gift_card_location_config_id IS NOT NULL;

COMMENT ON COLUMN public.profiles.gift_card_location_config_id IS
  'When set on an admin profile, the user is location-restricted: lands on /admin/giftcards/issue for this location and cannot access other admin pages.';
