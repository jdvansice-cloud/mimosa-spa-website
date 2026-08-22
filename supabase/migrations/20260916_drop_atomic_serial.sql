-- Retire create_online_giftcard() (added in 20260915, never used in the end).
--
-- Fulfillment went back to the simpler mint-then-insert: a failed attempt
-- burns a serial, which is fine for gift cards and keeps retries self-healing
-- because each attempt mints a fresh number.
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.

DROP FUNCTION IF EXISTS public.create_online_giftcard(
  UUID, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT,
  INTEGER, INTEGER, INTEGER, TEXT[], TEXT, TEXT, TIMESTAMPTZ, BOOLEAN
);
