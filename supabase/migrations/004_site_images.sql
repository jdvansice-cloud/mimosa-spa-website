-- Site Images table for managing all site images (banners, cards, etc.)
CREATE TABLE IF NOT EXISTS site_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL, -- Unique identifier like 'hero_banner', 'cta_background', etc.
  name VARCHAR(255) NOT NULL, -- Display name for admin UI
  description TEXT, -- Description of where/how the image is used
  image_url TEXT NOT NULL, -- Full URL to the image
  recommended_width INTEGER, -- Recommended width in pixels
  recommended_height INTEGER, -- Recommended height in pixels
  aspect_ratio VARCHAR(20), -- e.g., '16:9', '4:3', '1:1'
  category VARCHAR(50) NOT NULL DEFAULT 'general', -- Category for grouping: 'hero', 'categories', 'locations', 'promotions', 'gallery'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on key for fast lookups
CREATE INDEX IF NOT EXISTS idx_site_images_key ON site_images(key);
CREATE INDEX IF NOT EXISTS idx_site_images_category ON site_images(category);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_site_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_images_updated_at
  BEFORE UPDATE ON site_images
  FOR EACH ROW
  EXECUTE FUNCTION update_site_images_updated_at();

-- Insert default site images with their current URLs and recommended sizes
INSERT INTO site_images (key, name, description, image_url, recommended_width, recommended_height, aspect_ratio, category) VALUES
  -- Hero Section
  ('hero_banner', 'Banner Principal', 'Imagen de fondo del hero en la página principal', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070', 2070, 1380, '3:2', 'hero'),

  -- Booking CTA Section
  ('booking_cta_background', 'Fondo CTA Reserva', 'Imagen de fondo de la sección de llamada a reservar', 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070', 2070, 1380, '3:2', 'hero'),

  -- Featured Categories
  ('category_body_treatments', 'Categoría Tratamientos Corporales', 'Imagen de la tarjeta de tratamientos corporales', 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800', 800, 1000, '4:5', 'categories'),
  ('category_facial_treatments', 'Categoría Tratamientos Faciales', 'Imagen de la tarjeta de tratamientos faciales', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800', 800, 1000, '4:5', 'categories'),
  ('category_packages', 'Categoría Paquetes', 'Imagen de la tarjeta de paquetes', 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800', 800, 1000, '4:5', 'categories'),

  -- Location Cards
  ('location_costa_del_este', 'Ubicación Costa del Este', 'Imagen de la tarjeta de ubicación Costa del Este', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800', 800, 400, '2:1', 'locations'),
  ('location_san_francisco', 'Ubicación San Francisco', 'Imagen de la tarjeta de ubicación San Francisco', 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800', 800, 400, '2:1', 'locations'),

  -- Promotions (default/fallback)
  ('promotion_default', 'Promoción por Defecto', 'Imagen por defecto para promociones sin imagen', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800', 800, 600, '4:3', 'promotions')

ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active images
CREATE POLICY "Anyone can read active site images"
  ON site_images
  FOR SELECT
  USING (is_active = true);

-- Policy: Admin users can do everything
CREATE POLICY "Admin users can manage site images"
  ON site_images
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
