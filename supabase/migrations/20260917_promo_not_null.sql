-- Harden promo_codes against NULL flags.
--
-- `is_active` and `min_subtotal_cents` had defaults but stayed nullable, so a
-- row could hold NULL — and `!null` reads as "inactive", silently rejecting a
-- perfectly good code with no way to tell from the admin UI. Column defaults
-- don't save you either: a bulk insert that omits the key writes NULL
-- explicitly rather than falling back to the default.
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.

UPDATE public.promo_codes SET is_active = TRUE WHERE is_active IS NULL;
UPDATE public.promo_codes SET min_subtotal_cents = 0 WHERE min_subtotal_cents IS NULL;
UPDATE public.promo_codes SET program_ids = '{}' WHERE program_ids IS NULL;

ALTER TABLE public.promo_codes
  ALTER COLUMN is_active SET DEFAULT TRUE,
  ALTER COLUMN is_active SET NOT NULL,
  ALTER COLUMN min_subtotal_cents SET DEFAULT 0,
  ALTER COLUMN min_subtotal_cents SET NOT NULL,
  ALTER COLUMN program_ids SET DEFAULT '{}',
  ALTER COLUMN program_ids SET NOT NULL;
