-- FY2027 flagship: social-link data fix, proof system, marketing offers, leads.
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.

-- ===========================================
-- 1. DATA FIX: wrong social handles in the live settings row
-- ===========================================
UPDATE public.site_settings
SET instagram_url = 'https://instagram.com/mimosaretreat',
    facebook_url  = 'https://facebook.com/mimosaretreat',
    updated_at    = NOW()
WHERE instagram_url LIKE '%mimosasparetreat%'
   OR facebook_url  LIKE '%mimosasparetreat%';

-- ===========================================
-- 2. PROOF: Google rating summary on site_settings + curated reviews table
-- ===========================================
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS google_rating NUMERIC(2,1) DEFAULT 4.8,
  ADD COLUMN IF NOT EXISTS google_review_count INTEGER DEFAULT 96,
  ADD COLUMN IF NOT EXISTS google_reviews_url TEXT DEFAULT '';

CREATE TABLE IF NOT EXISTS public.site_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL DEFAULT 'review' CHECK (kind IN ('review', 'press', 'ugc')),
  quote_es TEXT NOT NULL,
  quote_en TEXT NOT NULL,
  author_name TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  source TEXT DEFAULT 'google',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active reviews" ON public.site_reviews;
CREATE POLICY "Anyone can view active reviews" ON public.site_reviews
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.site_reviews;
CREATE POLICY "Admins can manage all reviews" ON public.site_reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ===========================================
-- 3. MARKETING OFFERS: volatile commercial facts for the new pages
--    (couples rituals, Club Mimosa tiers, first-visit offer)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.marketing_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  page TEXT NOT NULL,
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_es TEXT,
  description_en TEXT,
  price NUMERIC(10,2),
  price_note_es TEXT,
  price_note_en TEXT,
  includes_es TEXT[] DEFAULT '{}',
  includes_en TEXT[] DEFAULT '{}',
  whatsapp_text_es TEXT,
  whatsapp_text_en TEXT,
  image_key TEXT,
  mindbody_service_id INTEGER,
  badge_es TEXT,
  badge_en TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_offers_page ON public.marketing_offers(page);

ALTER TABLE public.marketing_offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active offers" ON public.marketing_offers;
CREATE POLICY "Anyone can view active offers" ON public.marketing_offers
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage all offers" ON public.marketing_offers;
CREATE POLICY "Admins can manage all offers" ON public.marketing_offers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

INSERT INTO public.marketing_offers
  (key, page, name_es, name_en, description_es, description_en, price, includes_es, includes_en, whatsapp_text_es, whatsapp_text_en, image_key, badge_es, badge_en, sort_order)
VALUES
  ('pareja_ritual', 'parejas', 'Ritual en Pareja', 'Couples Ritual',
   'Dos masajes Mimosa Relax de 60 minutos en cabina doble, con ceremonia de té para cerrar.',
   'Two 60-minute Mimosa Relax massages in a double cabin, closing with a tea ceremony.',
   189.00,
   ARRAY['2× Mimosa Relax 60 min en cabina doble', 'Ceremonia de té', 'Aromaterapia'],
   ARRAY['2× Mimosa Relax 60 min in a double cabin', 'Tea ceremony', 'Aromatherapy'],
   'Hola, quiero reservar el Ritual en Pareja ($189).',
   'Hi, I would like to book the Couples Ritual ($189).',
   'parejas_ritual', NULL, NULL, 1),
  ('pareja_escape', 'parejas', 'Escape Romántico', 'Romantic Escape',
   'Masajes de 90 minutos con piedras calientes, cava y chocolates.',
   '90-minute massages with hot stones, cava and chocolates.',
   249.00,
   ARRAY['2× masaje 90 min', 'Piedras calientes', 'Cava y chocolates'],
   ARRAY['2× 90-min massage', 'Hot stones', 'Cava and chocolates'],
   'Hola, quiero reservar el Escape Romántico ($249).',
   'Hi, I would like to book the Romantic Escape ($249).',
   'parejas_escape', 'Más pedido', 'Most requested', 2),
  ('pareja_aniversario', 'parejas', 'Aniversario Mimosa', 'Mimosa Anniversary',
   'La experiencia Day Spa completa para dos: el regalo de aniversario definitivo.',
   'The full Day Spa experience for two: the ultimate anniversary gift.',
   299.00,
   ARRAY['Day Spa completo para dos', 'Cabina doble privada', 'Brindis y detalle especial'],
   ARRAY['Full Day Spa for two', 'Private double cabin', 'Toast and special touch'],
   'Hola, quiero reservar el Aniversario Mimosa ($299).',
   'Hi, I would like to book the Mimosa Anniversary ($299).',
   'parejas_aniversario', NULL, NULL, 3),
  ('club_esencial', 'club-mimosa', 'Club Mimosa Esencial', 'Club Mimosa Essential',
   'Un masaje Relax 60 al mes + 10% en todo lo demás.',
   'One Relax 60 massage per month + 10% off everything else.',
   89.00,
   ARRAY['1 crédito Relax 60 al mes (acumulable 60 días)', '10% de descuento en servicios adicionales', 'Precio de miembro en gift cards'],
   ARRAY['1 Relax 60 credit per month (rolls over 60 days)', '10% off additional services', 'Member pricing on gift cards'],
   'Hola, quiero información del Club Mimosa Esencial ($89/mes).',
   'Hi, I would like information about Club Mimosa Essential ($89/month).',
   'club_esencial', NULL, NULL, 1),
  ('club_plus', 'club-mimosa', 'Club Mimosa Plus', 'Club Mimosa Plus',
   'Dos créditos al mes o un ritual signature de 90 minutos + beneficios preferentes.',
   'Two credits per month or one 90-minute signature ritual + priority benefits.',
   165.00,
   ARRAY['2 créditos al mes o 1 ritual signature 90 min', '15% de descuento en extras', 'Reserva prioritaria', '1 pase de invitado por trimestre'],
   ARRAY['2 credits per month or 1 signature 90-min ritual', '15% off extras', 'Priority booking', '1 guest pass per quarter'],
   'Hola, quiero información del Club Mimosa Plus ($165/mes).',
   'Hi, I would like information about Club Mimosa Plus ($165/month).',
   'club_plus', NULL, NULL, 2),
  ('club_founding', 'club-mimosa', 'Miembro Fundador', 'Founding Member',
   'Los primeros 100 miembros aseguran su tarifa para siempre: Esencial $79 · Plus $149.',
   'The first 100 members lock their rate forever: Essential $79 · Plus $149.',
   79.00,
   ARRAY['Esencial $79/mes de por vida', 'Plus $149/mes de por vida', 'Solo los primeros 100 miembros'],
   ARRAY['Essential $79/month for life', 'Plus $149/month for life', 'First 100 members only'],
   'Hola, quiero ser Miembro Fundador del Club Mimosa.',
   'Hi, I want to be a Club Mimosa Founding Member.',
   'club_founding', 'Primeros 100', 'First 100', 3),
  ('first_visit', 'primera-visita', 'Tu primer Ritual Mimosa', 'Your first Mimosa Ritual',
   'Tu primera visita: Ritual Mimosa por $79 — masaje Relax 60 con ritual de pies de bienvenida.',
   'Your first visit: Mimosa Ritual for $79 — Relax 60 massage with a welcome foot ritual.',
   79.00,
   ARRAY['Masaje Relax 60 min', 'Ritual de pies de bienvenida', 'Té de cortesía'],
   ARRAY['Relax 60-min massage', 'Welcome foot ritual', 'Complimentary tea'],
   'Hola, quiero mi primer Ritual Mimosa ($79).',
   'Hi, I would like my first Mimosa Ritual ($79).',
   'first_visit', 'Nuevos clientes', 'New clients', 1)
ON CONFLICT (key) DO NOTHING;

-- ===========================================
-- 4. LEADS: capture from primera-visita / empresas / club waitlist / parejas grupos
-- ===========================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  company TEXT,
  message TEXT,
  locale TEXT,
  path TEXT,
  session_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  meta JSONB
);

CREATE INDEX IF NOT EXISTS idx_leads_source_created ON public.leads(source, created_at DESC);

-- Service-role only (RLS on, no policies) — public writes go through /api/leads.
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
