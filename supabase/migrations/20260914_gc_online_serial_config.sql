-- Give the online channel its own gift-card serial sequence: MO000001.
--
-- Until now `gift_card_serial_config` allowed exactly one row per Mindbody
-- location (UNIQUE), and online cards bypassed the table with a hardcoded
-- "MW-000001" series — the only serials carrying a dash. This creates a
-- "Mimosa Online" sequence on the shared minter (which formats prefix+digits
-- with no separator, matching CE000005 / SF000010) that still registers its
-- sales at San Francisco.
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.

-- 1. Several sequences may target the same Mindbody location: the online
--    sequence points at a physical branch (San Francisco).
ALTER TABLE public.gift_card_serial_config
  DROP CONSTRAINT IF EXISTS gift_card_serial_config_mindbody_location_id_key;

COMMENT ON COLUMN public.gift_card_serial_config.mindbody_location_id IS
  'Where sales on this sequence register in Mindbody. Not unique: the online sequence shares San Francisco.';

-- 2. Which sequence the online shop mints from. NULL = legacy MW- series.
ALTER TABLE public.gc_shop_settings
  ADD COLUMN IF NOT EXISTS serial_config_id UUID
    REFERENCES public.gift_card_serial_config(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.gc_shop_settings.serial_config_id IS
  'gift_card_serial_config used for online cards. NULL = legacy MW- sequence.';

-- 3. The "Mimosa Online" sequence (editable afterwards in
--    /admin/giftcards/config alongside Costa del Este and San Francisco).
INSERT INTO public.gift_card_serial_config
  (mindbody_location_id, location_name, prefix, serial_length, is_active)
VALUES
  (2, 'Mimosa Online', 'MO', 6, TRUE)
ON CONFLICT (prefix) DO NOTHING;

-- 4. Point the online shop at it.
UPDATE public.gc_shop_settings
   SET serial_config_id = (
         SELECT id FROM public.gift_card_serial_config WHERE prefix = 'MO'
       ),
       updated_at = NOW()
 WHERE id = 1
   AND serial_config_id IS NULL;
