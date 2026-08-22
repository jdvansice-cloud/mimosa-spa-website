-- Unified checkout: orders spine, split payments, promo codes, checkout policy.
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.
-- Design source: "Unified Checkout & E-Invoicing Proposal" (Aug 15 2026), §5.
-- Generalizes the gc_orders pattern to carts holding services + gift cards.

-- ===========================================
-- 1. CHECKOUT SETTINGS (single row)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.checkout_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  checkout_enabled BOOLEAN DEFAULT false,
  allow_pay_at_spa BOOLEAN DEFAULT true,          -- rung 1: optional prepay
  -- rung 2: required prepay for peak inventory (partner decision Aug 17:
  -- Fri–Sun, ALL services). 0=Sun..6=Sat, Postgres DOW convention.
  peak_prepay_required BOOLEAN DEFAULT true,
  peak_days INTEGER[] DEFAULT '{5,6,0}',
  peak_program_ids INTEGER[] DEFAULT '{}',        -- empty = all services on peak days
  -- Order numbers: MO-<base36>, minted by next_order_number()
  order_seq_start BIGINT DEFAULT 1000,
  abandoned_nudge_enabled BOOLEAN DEFAULT false,  -- WATI recovery, needs opt-in UI first
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO public.checkout_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START 1000;

CREATE OR REPLACE FUNCTION public.next_order_number()
RETURNS TEXT LANGUAGE sql AS
$$ SELECT 'MO-' || upper(lpad(to_hex(nextval('public.order_number_seq')), 6, '0')) $$;

-- ===========================================
-- 2. ORDERS (state machine spine)
-- ===========================================
-- Happy path: draft → totals_verified → authorized → booked → captured
--             → posted → invoiced → fulfilled
-- gift-card-only carts skip `authorized/booked` (no Tilopay hold needed when
-- a stored gift card covers 100%: draft → totals_verified → captured → …).
-- Failure branches keep the last good state in `status` and the reason in
-- failure_code/failure_detail, and always surface in the admin queue.
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL DEFAULT public.next_order_number(),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft','totals_verified','authorized','booked','captured',
    'posted','invoiced','fulfilled',
    'expired','cancelled','refunded'
  )),
  failure_code TEXT CHECK (failure_code IS NULL OR failure_code IN (
    'auth_declined','slot_lost_voided','capture_failed',
    'posting_failed','invoice_failed','gc_balance_short'
  )),
  failure_detail TEXT,

  -- who
  mindbody_client_id TEXT,                  -- required when the cart has services
  buyer_name TEXT,
  buyer_email TEXT,
  buyer_phone TEXT,                         -- WATI format (country code, no +)
  locale TEXT DEFAULT 'es' CHECK (locale IN ('es','en')),
  marketing_opt_in BOOLEAN DEFAULT false,   -- abandoned-bag nudge consent

  -- where (one location per bag, v1 decision Aug 17)
  location_id INTEGER NOT NULL DEFAULT 1,

  -- money (cents, USD)
  subtotal_cents INTEGER NOT NULL DEFAULT 0,
  discount_cents INTEGER NOT NULL DEFAULT 0,
  tax_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL DEFAULT 0,
  promo_code_id UUID,
  promo_code TEXT,                          -- snapshot of the code as typed

  -- Mindbody posting
  mindbody_sale_id BIGINT,
  mindbody_grand_total_cents INTEGER,       -- server-computed preflight total; must equal total_cents
  posting_attempts INTEGER DEFAULT 0,

  -- invoicing (Option C: emitted by our platform for online orders)
  invoice_number TEXT,
  invoice_cufe TEXT,
  invoice_status TEXT,

  -- transition timestamps (every arrow in the state machine is a column write)
  totals_verified_at TIMESTAMPTZ,
  authorized_at TIMESTAMPTZ,
  booked_at TIMESTAMPTZ,
  captured_at TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  invoiced_at TIMESTAMPTZ,
  fulfilled_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,

  source TEXT DEFAULT 'web' CHECK (source IN ('web','admin')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_client_idx ON public.orders (mindbody_client_id);
CREATE INDEX IF NOT EXISTS orders_email_idx ON public.orders (buyer_email);

-- ===========================================
-- 3. ORDER ITEMS (per-line tax is the invoice-grade fact)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('service','gift_card')),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  name_es TEXT NOT NULL,
  name_en TEXT,

  -- money (cents). ITBMS rate uses the FEP dTasaITBMS catalog so the invoice
  -- builder reads it verbatim: '00' exempt (monetary gift cards), '01' 7%.
  unit_price_cents INTEGER NOT NULL,
  discount_cents INTEGER NOT NULL DEFAULT 0,
  tax_rate_code TEXT NOT NULL DEFAULT '01' CHECK (tax_rate_code IN ('00','01','02','03')),
  tax_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL,

  -- service payload
  mindbody_session_type_id INTEGER,
  mindbody_pricing_option_id INTEGER,       -- Item.Metadata.Id at checkout
  mindbody_appointment_ids INTEGER[],       -- filled at `booked`
  staff_id INTEGER,
  staff_requested BOOLEAN DEFAULT false,
  appointment_start TIMESTAMPTZ,
  duration_minutes INTEGER,
  is_addon BOOLEAN DEFAULT false,

  -- gift-card payload
  gc_catalog_item_id UUID,
  gc_serial TEXT,                           -- our MW-serial = Mindbody BarcodeId (spike-verified)
  gc_recipient_name TEXT,
  gc_recipient_email TEXT,
  gc_message TEXT,
  gc_delivery_date DATE,

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS order_items_order_idx ON public.order_items (order_id);

-- ===========================================
-- 4. ORDER PAYMENTS (split tender: Tilopay + gift card)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.order_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('tilopay','gift_card','pay_at_spa')),
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending','authorized','captured','voided','refunded','failed','redeemed'
  )),
  -- tilopay
  tilopay_tpt TEXT,                         -- Tilopay order id
  tilopay_auth TEXT,
  tilopay_method TEXT,                      -- raw "<selected_method>|<crd>|<brand>"
  mindbody_tender TEXT,                     -- 'Yappy Web' | 'Visa/MC Web' | 'AMEX Web'
  -- gift card
  gc_barcode TEXT,                          -- card used as tender (GiftCard payment in checkout)
  gc_balance_before_cents INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS order_payments_order_idx ON public.order_payments (order_id);
CREATE INDEX IF NOT EXISTS order_payments_tpt_idx ON public.order_payments (tilopay_tpt);

-- ===========================================
-- 5. PROMO CODES (site-managed source of truth; posted to Mindbody
--    as exact per-item DiscountAmount, never recomputed there)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,                -- stored uppercase; lookups uppercase the input
  kind TEXT NOT NULL CHECK (kind IN ('percent','fixed')),
  value INTEGER NOT NULL CHECK (value > 0), -- percent: 1–100 · fixed: cents
  scope TEXT NOT NULL DEFAULT 'all' CHECK (scope IN ('all','services','gift_cards','programs')),
  program_ids INTEGER[] DEFAULT '{}',       -- when scope='programs' (e.g. facials only)
  min_subtotal_cents INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  max_uses INTEGER,                         -- NULL = unlimited
  max_uses_per_customer INTEGER,            -- keyed on mindbody_client_id, else buyer_email
  is_active BOOLEAN DEFAULT true,
  description TEXT,                         -- internal note for admin
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
DO $$ BEGIN
  ALTER TABLE public.promo_codes ADD CONSTRAINT promo_percent_range
    CHECK (kind <> 'percent' OR value <= 100);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.promo_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID NOT NULL REFERENCES public.promo_codes(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_key TEXT NOT NULL,               -- mindbody_client_id or lowercased email
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (order_id)                         -- one code per order (v1)
);
CREATE INDEX IF NOT EXISTS promo_redemptions_code_customer_idx
  ON public.promo_redemptions (promo_code_id, customer_key);

-- orders.promo_code_id FK added after both tables exist
DO $$ BEGIN
  ALTER TABLE public.orders
    ADD CONSTRAINT orders_promo_code_fk FOREIGN KEY (promo_code_id)
    REFERENCES public.promo_codes(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Service-role only across the board (house style: RLS on, no policies).
ALTER TABLE public.checkout_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_redemptions ENABLE ROW LEVEL SECURITY;
