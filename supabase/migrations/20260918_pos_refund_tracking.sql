-- Track the manual Mindbody refund that follows an online refund.
--
-- We do NOT void the original sale: voiding erases it, and the factura it
-- backs cannot be un-emitted. Instead the POS records a REFUND, so the
-- document count stays aligned across all three systems —
--   site:    order        + refund
--   fiscal:  factura      + nota de crédito
--   Mindbody: sale        + refund
--
-- Mindbody's API cannot do it for us: POST /sale/returnsale rejects a
-- Custom-tender sale (verified in sandbox — InvalidSaleReturn), so a human
-- records the refund at the POS. This flag keeps that task visible until
-- someone confirms it, instead of trusting a dismissed alert.
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS pos_refund_required BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS pos_refund_done_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS pos_refund_done_by TEXT;

COMMENT ON COLUMN public.orders.pos_refund_required IS
  'Refunded order whose matching refund still has to be recorded at the Mindbody POS (never a void — document parity with the nota de crédito).';

CREATE INDEX IF NOT EXISTS orders_pos_refund_pending_idx
  ON public.orders (created_at DESC)
  WHERE pos_refund_required AND pos_refund_done_at IS NULL;
