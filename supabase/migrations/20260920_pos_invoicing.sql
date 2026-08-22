-- Invoicing for counter (POS) sales, and credit notes for returns.
--
-- Until now electronic_invoices only ever described an ONLINE order, so the
-- only link it carried was order_id. Counter sales have no order — they are
-- Mindbody sales — and a return has to find the factura of the sale it
-- reverses, so the sale id has to be a first-class link.
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.

ALTER TABLE public.electronic_invoices
  ADD COLUMN IF NOT EXISTS mindbody_sale_id BIGINT,
  -- The sale being reversed, on a nota de crédito. Kept even when we could
  -- not resolve its CUFE, so a generic NC can still be traced to its origin.
  ADD COLUMN IF NOT EXISTS reverses_sale_id BIGINT;

CREATE INDEX IF NOT EXISTS electronic_invoices_mb_sale_idx
  ON public.electronic_invoices (mindbody_sale_id)
  WHERE mindbody_sale_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS electronic_invoices_reverses_idx
  ON public.electronic_invoices (reverses_sale_id)
  WHERE reverses_sale_id IS NOT NULL;

-- One active factura per Mindbody sale — the same idempotency guarantee the
-- online path gets from electronic_invoices_one_active_factura. This is what
-- stops a re-run of the POS sweep from invoicing the same sale twice.
CREATE UNIQUE INDEX IF NOT EXISTS electronic_invoices_one_active_pos_factura
  ON public.electronic_invoices (mindbody_sale_id)
  WHERE doc_type = '01' AND mindbody_sale_id IS NOT NULL
    AND status IN ('pending','emitting','authorized');

-- One active credit note per return sale, for the same reason: a retry must
-- not hand the customer a second nota de crédito.
CREATE UNIQUE INDEX IF NOT EXISTS electronic_invoices_one_active_pos_nc
  ON public.electronic_invoices (reverses_sale_id)
  WHERE doc_type IN ('04','06') AND reverses_sale_id IS NOT NULL
    AND status IN ('pending','emitting','authorized');

COMMENT ON COLUMN public.electronic_invoices.mindbody_sale_id IS
  'The Mindbody sale this document covers. For a nota de crédito this is the RETURN sale; the sale being reversed is reverses_sale_id.';

-- Returns need a nota de crédito, which the vendor bridge has never emitted
-- (zero negative documents in 1,049 June rows). This flags a return we could
-- not credit automatically, so it lands on a worklist instead of silently
-- leaving the refund with no fiscal document.
CREATE TABLE IF NOT EXISTS public.efactura_return_review (
  mindbody_sale_id BIGINT PRIMARY KEY,
  original_sale_id BIGINT,
  location_id INTEGER,
  amount_cents INTEGER NOT NULL,
  reason TEXT NOT NULL,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS efactura_return_review_open_idx
  ON public.efactura_return_review (created_at DESC)
  WHERE resolved_at IS NULL;

ALTER TABLE public.efactura_return_review ENABLE ROW LEVEL SECURITY;
