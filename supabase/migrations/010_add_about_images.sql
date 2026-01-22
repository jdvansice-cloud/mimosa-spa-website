-- Add about page images to site_images table
INSERT INTO site_images (key, name, description, image_url, recommended_width, recommended_height, aspect_ratio, category) VALUES
  ('about_image_1', 'Imagen Nosotros 1', 'Primera imagen de la página Nosotros (izquierda)', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600', 600, 800, '3:4', 'general'),
  ('about_image_2', 'Imagen Nosotros 2', 'Segunda imagen de la página Nosotros (derecha)', 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=600', 600, 800, '3:4', 'general')
ON CONFLICT (key) DO NOTHING;
