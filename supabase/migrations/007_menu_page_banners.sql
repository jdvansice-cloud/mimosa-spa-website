-- Add menu page banner images to site_images table
-- These are the hero banners shown at the top of each menu category page

INSERT INTO site_images (key, name, description, image_url, recommended_width, recommended_height, aspect_ratio, category) VALUES
  -- Menu Page Banners
  ('menu_corporales_banner', 'Banner Tratamientos Corporales', 'Imagen del banner en la página de Tratamientos Corporales', '/Tratamientos Corporales.png', 1920, 600, '16:5', 'hero'),
  ('menu_corporales_deluxe_banner', 'Banner Tratamientos Corporales Deluxe', 'Imagen del banner en la página de Tratamientos Corporales Deluxe', '/Tratamientos Corporales Deluxe.png', 1920, 600, '16:5', 'hero'),
  ('menu_faciales_banner', 'Banner Tratamientos Faciales', 'Imagen del banner en la página de Tratamientos Faciales', '/Tratamientos Faciales.png', 1920, 600, '16:5', 'hero'),
  ('menu_paquetes_banner', 'Banner Paquetes', 'Imagen del banner en la página de Paquetes', '/Tratamientos en Paquetes.png', 1920, 600, '16:5', 'hero'),

  -- Logo
  ('logo', 'Logo Mimosa Spa', 'Logo principal del spa usado en navegación y portal', '/logo.png', 200, 80, '5:2', 'general')

ON CONFLICT (key) DO NOTHING;
