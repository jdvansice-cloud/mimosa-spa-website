-- The gift-card form now looks buyers and recipients up in the Mindbody client
-- mirror. When staff PICK a client (rather than typing a custom name), the
-- card keeps that identity: the buyer column already existed, the recipient
-- one did not. A typed-in name simply leaves the id NULL — that is the
-- difference between "selected client" and "custom name".
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.

ALTER TABLE public.gift_cards
  ADD COLUMN IF NOT EXISTS recipient_mindbody_client_id BIGINT;

COMMENT ON COLUMN public.gift_cards.recipient_mindbody_client_id IS
  'Mindbody client the recipient was matched to at issue time; NULL when the name was typed in as custom text.';
