-- Direct electronic invoicing (Panama FEP) through the PAC efacturapty.
-- Replaces the vendor bridge for sales we control: our platform builds the
-- invoice payload so per-line ITBMS, forma de pago and receptor type are exact.
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.

-- ===========================================
-- 1. CONFIG (one row per location = one punto de facturación)
-- ===========================================
-- Under a single RUC two locations must NOT share a punto de facturación,
-- so each Mindbody location gets its own series.
CREATE TABLE IF NOT EXISTS public.efactura_config (
  location_id INTEGER PRIMARY KEY,            -- 1 = Costa del Este, 2 = San Francisco
  api_key TEXT,                               -- sent as Authorization: Bearer
  environment TEXT NOT NULL DEFAULT 'test' CHECK (environment IN ('test','prod')),
  punto_facturacion TEXT NOT NULL DEFAULT '001',
  -- Codificación Panameña de Bienes y Servicios (item classification).
  default_cpbs_code_short INTEGER,
  enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.efactura_config (location_id, punto_facturacion)
VALUES (1, '001'), (2, '002')
ON CONFLICT (location_id) DO NOTHING;

-- ===========================================
-- 2. EMITTED DOCUMENTS
-- ===========================================
CREATE TABLE IF NOT EXISTS public.electronic_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  location_id INTEGER NOT NULL DEFAULT 1,
  -- 01 factura · 04 NC referida a FE · 06 NC genérica
  doc_type TEXT NOT NULL DEFAULT '01',
  environment TEXT NOT NULL DEFAULT 'test' CHECK (environment IN ('test','prod')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','emitting','authorized','rejected','cancelled')),

  -- PAC results
  cufe TEXT,
  numero_documento TEXT,                      -- assigned by the PAC
  protocolo_autorizacion TEXT,
  fecha_autorizacion TIMESTAMPTZ,
  qr_content TEXT,
  referenced_cufe TEXT,                       -- for a NC: the factura it amends

  request_payload JSONB,
  response_payload JSONB,
  error TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  emitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS electronic_invoices_order_idx ON public.electronic_invoices (order_id);
CREATE INDEX IF NOT EXISTS electronic_invoices_status_idx ON public.electronic_invoices (status, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS electronic_invoices_cufe_idx
  ON public.electronic_invoices (cufe) WHERE cufe IS NOT NULL;

-- Idempotency: at most one ACTIVE factura per order. A rejected attempt can be
-- retried (excluded here) and a cancelled document frees the slot.
CREATE UNIQUE INDEX IF NOT EXISTS electronic_invoices_one_active_factura
  ON public.electronic_invoices (order_id)
  WHERE doc_type = '01' AND order_id IS NOT NULL
    AND status IN ('pending','emitting','authorized');

-- ===========================================
-- 3. ORDER LINKAGE
-- ===========================================
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS invoice_id UUID REFERENCES public.electronic_invoices(id) ON DELETE SET NULL;

-- Service lines carry an item code for the invoice; gift cards never do
-- (stored value is not a sale — invoiced at redemption instead).
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS invoice_item_code TEXT;

-- Service-role only across the board (house style: RLS on, no policies).
ALTER TABLE public.efactura_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electronic_invoices ENABLE ROW LEVEL SECURITY;
