-- Admin-manageable image slots for the FY27 marketing pages: seeding these
-- rows makes them appear in /admin/imagenes so the September photography
-- replaces the placeholders with zero deploys.
-- Idempotent — apply manually in the Supabase SQL editor.

INSERT INTO public.site_images (key, name, description, image_url, recommended_width, recommended_height, aspect_ratio, category) VALUES
  ('parejas_banner', 'Banner Parejas', 'Hero de la página Parejas y Ocasiones (y landing de masaje de parejas)', 'https://images.unsplash.com/photo-1591343395902-1adcb454c4e2?q=80&w=1900', 1900, 900, '2:1', 'hero'),
  ('parejas_ritual', 'Ritual en Pareja', 'Tarjeta del Ritual en Pareja ($189) en la página Parejas', 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800', 800, 600, '4:3', 'categories'),
  ('parejas_escape', 'Escape Romántico', 'Tarjeta del Escape Romántico ($249) en la página Parejas', 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=800', 800, 600, '4:3', 'categories'),
  ('parejas_aniversario', 'Aniversario Mimosa', 'Tarjeta del Aniversario Mimosa ($299) en la página Parejas', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800', 800, 600, '4:3', 'categories'),
  ('empresas_banner', 'Banner Empresas', 'Hero de la página Mimosa para Empresas', 'https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=1900', 1900, 900, '2:1', 'hero'),
  ('club_banner', 'Banner Club Mimosa', 'Hero de la página Club Mimosa', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1900', 1900, 900, '2:1', 'hero'),
  ('primera_visita_banner', 'Banner Primera Visita', 'Hero de la página Tu Primera Visita', 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1900', 1900, 900, '2:1', 'hero'),
  ('giftcards_banner', 'Banner Tienda Gift Cards', 'Hero de la tienda online de gift cards', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1900', 1900, 900, '2:1', 'hero'),
  ('category_parejas', 'Categoría Parejas', 'Tarjeta Parejas en el menú y la portada', 'https://images.unsplash.com/photo-1591343395902-1adcb454c4e2?q=80&w=800', 800, 1000, '4:5', 'categories')
ON CONFLICT (key) DO NOTHING;
