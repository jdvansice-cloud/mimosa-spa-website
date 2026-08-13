-- Online gift-card shop: settings, catalog, orders, gift_cards extensions.
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.

-- ===========================================
-- 1. SHOP SETTINGS (single row)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.gc_shop_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  shop_enabled BOOLEAN DEFAULT false,
  hero_banner_es TEXT,
  hero_banner_en TEXT,
  occasion_slug TEXT,                        -- seasonal skin: 'navidad' | 'feb14' | 'dic8' | NULL
  default_mindbody_location_id INTEGER DEFAULT 1,
  whatsapp_delivery_enabled BOOLEAN DEFAULT false,  -- flips on once the WATI template is approved
  notify_email TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO public.gc_shop_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- 2. CATALOG
-- ===========================================
CREATE TABLE IF NOT EXISTS public.gc_catalog_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('monetary', 'experience')),
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_es TEXT,
  description_en TEXT,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),  -- face value | base price (pre-ITBMS)
  treatment_names TEXT[] DEFAULT '{}',                     -- experience only
  image_url TEXT,
  default_design_slug TEXT DEFAULT 'general',
  mindbody_giftcard_id BIGINT,               -- GC product id for /sale/purchasegiftcard
  mindbody_layout_id BIGINT,
  badge_es TEXT,
  badge_en TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT false,           -- activated by admin once Mindbody products exist
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.gc_catalog_items (kind, name_es, name_en, amount_cents, sort_order)
SELECT * FROM (VALUES
  ('monetary', 'Gift Card $50',  'Gift Card $50',   5000, 1),
  ('monetary', 'Gift Card $100', 'Gift Card $100', 10000, 2),
  ('monetary', 'Gift Card $150', 'Gift Card $150', 15000, 3),
  ('monetary', 'Gift Card $200', 'Gift Card $200', 20000, 4)
) AS seed(kind, name_es, name_en, amount_cents, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.gc_catalog_items WHERE kind = 'monetary');

INSERT INTO public.gc_catalog_items
  (kind, name_es, name_en, description_es, description_en, amount_cents, treatment_names, sort_order)
SELECT * FROM (VALUES
  ('experience', 'Ritual Mimosa', 'Mimosa Ritual',
   'Relax 60 + ritual de pies + cráneo facial + ceremonia de té.',
   'Relax 60 + foot ritual + head massage + tea ceremony.',
   9900, ARRAY['Ritual Mimosa'], 10),
  ('experience', 'Ritual en Pareja', 'Couples Ritual',
   '2× Mimosa Relax 60 en cabina doble + ceremonia de té.',
   '2× Mimosa Relax 60 in a double cabin + tea ceremony.',
   18900, ARRAY['Ritual en Pareja'], 11),
  ('experience', 'Escape Romántico', 'Romantic Escape',
   'Masajes 90 min con piedras calientes, cava y chocolates.',
   '90-min massages with hot stones, cava and chocolates.',
   24900, ARRAY['Escape Romántico'], 12),
  ('experience', 'Aniversario Mimosa', 'Mimosa Anniversary',
   'Day Spa completo para dos.',
   'Full Day Spa for two.',
   29900, ARRAY['Aniversario Mimosa'], 13)
) AS seed(kind, name_es, name_en, description_es, description_en, amount_cents, treatment_names, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.gc_catalog_items WHERE kind = 'experience');

-- ===========================================
-- 3. ORDERS (payment lifecycle, one row per attempt)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.gc_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','paid','fulfilled','payment_failed','abandoned','refunded')),
  -- item snapshot
  catalog_item_id UUID REFERENCES public.gc_catalog_items(id),
  item_kind TEXT,
  item_name TEXT,
  base_amount_cents INTEGER NOT NULL,
  itbms_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  -- buyer / recipient
  buyer_name TEXT,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  buyer_country TEXT DEFAULT 'PA',
  recipient_name TEXT NOT NULL,
  recipient_email TEXT,
  recipient_phone TEXT,
  gift_message TEXT,
  -- delivery
  delivery_email BOOLEAN DEFAULT true,
  delivery_whatsapp BOOLEAN DEFAULT false,
  scheduled_send_at TIMESTAMPTZ,
  email_sent_at TIMESTAMPTZ,
  whatsapp_sent_at TIMESTAMPTZ,
  whatsapp_error TEXT,
  design_slug TEXT DEFAULT 'general',
  locale TEXT DEFAULT 'es',
  -- tilopay
  tilopay_tpt TEXT,
  tilopay_auth TEXT,
  tilopay_response_code TEXT,
  tilopay_description TEXT,
  paid_at TIMESTAMPTZ,
  callback_raw JSONB,
  -- fulfillment
  gift_card_id UUID REFERENCES public.gift_cards(id),
  fulfilled_at TIMESTAMPTZ,
  fulfillment_error TEXT,
  mindbody_status TEXT DEFAULT 'pending'
    CHECK (mindbody_status IN ('pending','registered','failed','skipped')),
  mindbody_error TEXT,
  mindbody_attempts INTEGER DEFAULT 0,
  mindbody_registered_at TIMESTAMPTZ,
  -- refund
  refunded_at TIMESTAMPTZ,
  refund_amount_cents INTEGER,
  refunded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gc_orders_status_created ON public.gc_orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gc_orders_buyer_email ON public.gc_orders(buyer_email);
CREATE INDEX IF NOT EXISTS idx_gc_orders_scheduled ON public.gc_orders(scheduled_send_at)
  WHERE status IN ('paid','fulfilled') AND email_sent_at IS NULL;

-- ===========================================
-- 4. GIFT_CARDS extensions for the online channel
-- ===========================================
ALTER TABLE public.gift_cards
  ADD COLUMN IF NOT EXISTS channel TEXT NOT NULL DEFAULT 'admin' CHECK (channel IN ('admin','online')),
  ADD COLUMN IF NOT EXISTS view_token TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS voided_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS void_reason TEXT;

-- Online serial: channel-scoped sequence (NOT a gift_card_serial_config row —
-- that table is keyed by physical location).
CREATE SEQUENCE IF NOT EXISTS public.gc_online_serial_seq START 1;

CREATE OR REPLACE FUNCTION public.next_online_giftcard_serial()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT 'MW-' || lpad(nextval('public.gc_online_serial_seq')::text, 6, '0');
$$;

-- ===========================================
-- 5. CORPORATE INQUIRIES
-- ===========================================
CREATE TABLE IF NOT EXISTS public.gc_corporate_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  quantity INTEGER,
  amount_note TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service-role only across the board (house style: RLS on, no policies).
ALTER TABLE public.gc_shop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gc_catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gc_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gc_corporate_inquiries ENABLE ROW LEVEL SECURITY;
