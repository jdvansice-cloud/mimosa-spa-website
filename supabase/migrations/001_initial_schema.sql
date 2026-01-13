-- ===========================================
-- MIMOSA SPA WEBSITE DATABASE SCHEMA
-- Version: 1.0.0
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- PROFILES TABLE (extends auth.users)
-- ===========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ===========================================
-- PROMOTIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_es TEXT NOT NULL,
  title_en TEXT,
  description_es TEXT,
  description_en TEXT,
  services TEXT[] DEFAULT '{}',
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER,
  image_url TEXT,
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  mindbody_service_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Promotions policies
CREATE POLICY "Anyone can view active promotions" ON public.promotions
  FOR SELECT USING (is_active = true AND valid_until >= CURRENT_DATE);

CREATE POLICY "Admins can manage all promotions" ON public.promotions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ===========================================
-- GALLERY IMAGES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_es TEXT,
  title_en TEXT,
  description_es TEXT,
  description_en TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT CHECK (category IN ('spa', 'treatments', 'facilities', 'team', 'ambiance')),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Gallery policies
CREATE POLICY "Anyone can view active gallery images" ON public.gallery_images
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all gallery images" ON public.gallery_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ===========================================
-- SITE SETTINGS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Site settings policies
CREATE POLICY "Anyone can view site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON public.site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at
  BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- STORAGE BUCKETS
-- ===========================================
-- Note: Run these in Supabase Dashboard > Storage

-- INSERT INTO storage.buckets (id, name, public) VALUES ('promotions', 'promotions', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);

-- Storage policies (run in SQL editor)
-- CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id IN ('promotions', 'gallery', 'assets'));
-- CREATE POLICY "Admins can upload" ON storage.objects FOR INSERT WITH CHECK (
--   bucket_id IN ('promotions', 'gallery', 'assets') AND
--   EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
-- );

-- ===========================================
-- SEED DATA (Optional)
-- ===========================================

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES
  ('whatsapp', '{"number": "507XXXXXXXX", "message": "Hola, me gustaría obtener información sobre sus servicios."}'),
  ('social', '{"instagram": "https://instagram.com/mimosasparetreat", "facebook": "https://facebook.com/mimosasparetreat"}'),
  ('contact', '{"email": "info@mimosaretreat.com", "phone": "+507 6000-0000"}')
ON CONFLICT (key) DO NOTHING;

-- Insert sample promotions
INSERT INTO public.promotions (title_es, title_en, description_es, description_en, services, price, duration_minutes, valid_from, valid_until, is_active, sort_order) VALUES
  ('Esencia de Paz', 'Essence of Peace', 'Masaje de Piernas Cansadas + Masaje Craneo-Facial', 'Tired Legs Massage + Cranio-Facial Massage', ARRAY['Masaje de Piernas Cansadas', 'Masaje Craneo-Facial'], 79, 65, '2026-01-01', '2026-01-31', true, 1),
  ('Suspiro de Serenidad', 'Sigh of Serenity', 'Masaje Liberador de Tensión + Masaje de Pies en Camilla + Masaje Craneofacial', 'Tension Release Massage + Table Foot Massage + Craniofacial Massage', ARRAY['Masaje Liberador de Tensión', 'Masaje de Pies en Camilla', 'Masaje Craneofacial'], 99, 85, '2026-01-01', '2026-01-31', true, 2),
  ('Calma Total', 'Total Calm', 'Masaje Relajante + Exfoliación Corporal + Masaje de Piedras Calientes + Mascarilla Hidratante', 'Relaxing Massage + Body Exfoliation + Hot Stone Massage + Hydrating Mask', ARRAY['Masaje Relajante', 'Exfoliación Corporal', 'Masaje de Piedras Calientes', 'Mascarilla Hidratante'], 129, 110, '2026-01-01', '2026-01-31', true, 3)
ON CONFLICT DO NOTHING;
