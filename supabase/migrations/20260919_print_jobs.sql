-- Print queue for the CAFE (comprobante auxiliar de factura electrónica).
--
-- Once we invoice at the counter, the customer must leave with a printed CAFE.
-- A fire-and-forget print is not good enough: if the roll jams or the MUNBYN
-- drops off the WiFi, nobody finds out until the customer is gone. So every
-- print is a row with a status, and the front desk sees what did not come out.
--
-- Lifecycle:  pending -> printing -> printed
--                          |
--                          +-------> failed  (reprint puts a NEW row in pending)
--
-- A job in 'printing' whose station died is reclaimed by the stale sweep in
-- claimPrintJobs() — the payload is a snapshot, so replaying it is safe.
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS public.print_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 'cafe' the fiscal document · 'gift_card' the label · 'test' calibration
  kind TEXT NOT NULL DEFAULT 'cafe'
    CHECK (kind IN ('cafe','gift_card','test')),

  invoice_id UUID REFERENCES public.electronic_invoices(id) ON DELETE CASCADE,
  order_id   UUID REFERENCES public.orders(id) ON DELETE SET NULL,

  -- Which counter should print it. 1 = Costa del Este, 2 = San Francisco.
  -- A station only claims jobs for the location it is stationed at.
  location_id INTEGER NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','printing','printed','failed','cancelled')),

  -- Everything needed to render, frozen at enqueue time. A reprint months
  -- later must produce the same document even if the order has since changed.
  payload JSONB NOT NULL,

  attempts INTEGER NOT NULL DEFAULT 0,
  claimed_at TIMESTAMPTZ,
  claimed_by TEXT,                 -- station id, so two counters never collide
  printed_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  error TEXT,

  -- Set when this row replaces one that failed, for the reprint trail.
  reprint_of UUID REFERENCES public.print_jobs(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- The claim query: oldest pending job for this location.
CREATE INDEX IF NOT EXISTS print_jobs_claimable_idx
  ON public.print_jobs (location_id, created_at)
  WHERE status IN ('pending','printing');

-- The "what still hasn't printed" list the front desk watches.
CREATE INDEX IF NOT EXISTS print_jobs_unfinished_idx
  ON public.print_jobs (created_at DESC)
  WHERE status IN ('pending','printing','failed');

CREATE INDEX IF NOT EXISTS print_jobs_invoice_idx ON public.print_jobs (invoice_id);

-- One live CAFE print per invoice. A failed job is excluded so a reprint can
-- be queued, and this is what stops a retrying cron from printing duplicates
-- of a fiscal document.
CREATE UNIQUE INDEX IF NOT EXISTS print_jobs_one_live_cafe
  ON public.print_jobs (invoice_id)
  WHERE kind = 'cafe' AND invoice_id IS NOT NULL
    AND status IN ('pending','printing','printed');

-- Service-role only (house style: RLS on, no policies).
ALTER TABLE public.print_jobs ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.print_jobs IS
  'CAFE / label print queue with delivery confirmation — a job is only "printed" once the station reports the QZ job succeeded.';
COMMENT ON COLUMN public.print_jobs.payload IS
  'Render snapshot frozen at enqueue time so a reprint reproduces the original document.';

-- ===========================================
-- EMISOR DETAILS FOR THE PRINTED DOCUMENT
-- ===========================================
-- The PAC knows who we are (it is keyed off the API key), so emission never
-- needed these. The PRINTED CAFE does: the DGI expects razón social, RUC-DV
-- and the branch address on the customer's copy. Left NULL on purpose — the
-- print station refuses to print a CAFE until someone fills them in rather
-- than handing out a document with a guessed RUC.
ALTER TABLE public.efactura_config
  ADD COLUMN IF NOT EXISTS razon_social TEXT,
  ADD COLUMN IF NOT EXISTS ruc TEXT,
  ADD COLUMN IF NOT EXISTS dv TEXT,
  ADD COLUMN IF NOT EXISTS direccion TEXT,
  ADD COLUMN IF NOT EXISTS telefono TEXT,
  -- Shown under the totals, e.g. "Gracias por su visita".
  ADD COLUMN IF NOT EXISTS receipt_footer TEXT;

COMMENT ON COLUMN public.efactura_config.ruc IS
  'Emisor RUC as printed on the CAFE. Required before the print station will emit a paper document.';
