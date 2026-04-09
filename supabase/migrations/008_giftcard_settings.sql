-- Migration: Create giftcard_settings table
-- This table stores the content for the gift cards page

-- Create the giftcard_settings table
CREATE TABLE IF NOT EXISTS public.giftcard_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_es VARCHAR(255) NOT NULL DEFAULT 'Tarjetas de Regalo',
    title_en VARCHAR(255) NOT NULL DEFAULT 'Gift Cards',
    description_es TEXT NOT NULL DEFAULT '',
    description_en TEXT NOT NULL DEFAULT '',
    image_url TEXT DEFAULT '',
    conditions_es TEXT[] DEFAULT ARRAY[]::TEXT[],
    conditions_en TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.giftcard_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.giftcard_settings
    FOR SELECT
    USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update" ON public.giftcard_settings
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert" ON public.giftcard_settings
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Insert default record
INSERT INTO public.giftcard_settings (
    title_es,
    title_en,
    description_es,
    description_en,
    conditions_es,
    conditions_en,
    is_active
) VALUES (
    'Tarjetas de Regalo',
    'Gift Cards',
    'Adquiere nuestras Giftcards y regala momentos inolvidables de bienestar y relajación. Elige entre una variedad de tratamientos lujosos, desde masajes rejuvenecedores hasta tratamientos faciales revitalizantes. Nuestros Giftcards son el regalo perfecto para consentir a tus seres queridos, donde podrán sumergirse en un oasis de calma y renovación. ¡Haz que cada detalle cuente y comparte el regalo de la tranquilidad y el cuidado personal con nuestros exclusivos Giftcards!',
    'Purchase our Gift Cards and give unforgettable moments of wellness and relaxation. Choose from a variety of luxurious treatments, from rejuvenating massages to revitalizing facial treatments. Our Gift Cards are the perfect gift to pamper your loved ones, where they can immerse themselves in an oasis of calm and renewal. Make every detail count and share the gift of tranquility and self-care with our exclusive Gift Cards!',
    ARRAY['Presentar la Gift Card el día al momento del canje.', 'Validez de 12 meses a partir de la fecha de compra.', 'Gift Card no canjeable por dinero.'],
    ARRAY['Present the Gift Card on the day of redemption.', 'Valid for 12 months from the date of purchase.', 'Gift Card is not redeemable for cash.'],
    true
) ON CONFLICT DO NOTHING;

-- Comment on the table
COMMENT ON TABLE public.giftcard_settings IS 'Stores content for the gift cards page';
