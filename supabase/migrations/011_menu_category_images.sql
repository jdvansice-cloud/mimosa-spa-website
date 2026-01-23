-- Add menu category images for gift cards, membership, and promotions
INSERT INTO site_images (key, name, description, image_url, recommended_width, recommended_height, aspect_ratio, category) VALUES
  ('category_giftcards', 'Categoría Gift Cards', 'Imagen de la tarjeta de gift cards en el menú', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800', 800, 1000, '4:5', 'categories'),
  ('category_membership', 'Categoría Membresía Privilege', 'Imagen de la tarjeta de membresía en el menú', 'https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=800', 800, 1000, '4:5', 'categories'),
  ('category_promotions', 'Categoría Promociones', 'Imagen de la tarjeta de promociones en el menú', 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?q=80&w=800', 800, 1000, '4:5', 'categories')
ON CONFLICT (key) DO NOTHING;
