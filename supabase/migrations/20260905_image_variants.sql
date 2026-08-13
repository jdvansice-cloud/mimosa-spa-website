-- Image variants: several photos per site_images slot. The site rotates the
-- shown photo daily (deterministic per key), so heroes and cards stay fresh
-- without anyone touching the admin. Galleries are unaffected.
-- Idempotent — apply manually in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS public.site_image_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_key VARCHAR(100) NOT NULL,   -- matches site_images.key
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_image_variants_key
  ON public.site_image_variants(image_key);

-- Service-role only (all access goes through the admin API).
ALTER TABLE public.site_image_variants ENABLE ROW LEVEL SECURITY;
