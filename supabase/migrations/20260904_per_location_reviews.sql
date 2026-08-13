-- Per-location Google review data: the sitewide badge aggregates BOTH
-- locations; location cards show their own rating; curated quotes can be
-- tagged with the location they came from.
-- Idempotent — apply manually in the Supabase SQL editor.

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS google_rating_cde NUMERIC(2,1),
  ADD COLUMN IF NOT EXISTS google_review_count_cde INTEGER,
  ADD COLUMN IF NOT EXISTS google_reviews_url_cde TEXT,
  ADD COLUMN IF NOT EXISTS google_rating_sfc NUMERIC(2,1),
  ADD COLUMN IF NOT EXISTS google_review_count_sfc INTEGER,
  ADD COLUMN IF NOT EXISTS google_reviews_url_sfc TEXT;

-- Seed with the REAL Google numbers read from both profiles on Aug 12 2026:
-- Costa del Este 4.8 (111 reviews) · San Francisco 5.0 (41 reviews).
-- The admin keeps these current in Configuración.
UPDATE public.site_settings
SET google_rating_cde = COALESCE(google_rating_cde, 4.8),
    google_review_count_cde = COALESCE(google_review_count_cde, 111),
    google_reviews_url_cde = COALESCE(NULLIF(google_reviews_url_cde, ''), 'https://maps.app.goo.gl/5iX28mGH2mxUiJJ1A'),
    google_rating_sfc = COALESCE(google_rating_sfc, 5.0),
    google_review_count_sfc = COALESCE(google_review_count_sfc, 41),
    google_reviews_url_sfc = COALESCE(NULLIF(google_reviews_url_sfc, ''), 'https://maps.app.goo.gl/sgT9VCx6DZBoy5wn6');

-- Tag curated quotes with their source location ('cde' | 'sfc' | NULL = any)
ALTER TABLE public.site_reviews
  ADD COLUMN IF NOT EXISTS location TEXT CHECK (location IN ('cde', 'sfc') OR location IS NULL);

-- Tag the six seeded real-review quotes with their location
UPDATE public.site_reviews SET location = 'cde'
WHERE location IS NULL AND author_name IN ('Fabián E.', 'Ileana M.', 'Tania R.');
UPDATE public.site_reviews SET location = 'sfc'
WHERE location IS NULL AND author_name IN ('Ana Lorena P.', 'Simone', 'Lena Paola C.');
