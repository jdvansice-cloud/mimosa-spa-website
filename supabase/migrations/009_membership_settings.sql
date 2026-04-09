-- Migration: Create membership_settings table
-- This table stores the content for the Mimosa Privilege membership page

-- Create the membership_settings table
CREATE TABLE IF NOT EXISTS public.membership_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_es VARCHAR(255) NOT NULL DEFAULT 'Membresía Privilege',
    title_en VARCHAR(255) NOT NULL DEFAULT 'Privilege Membership',
    subtitle_es VARCHAR(255) NOT NULL DEFAULT 'Mimosa Privilege Membership',
    subtitle_en VARCHAR(255) NOT NULL DEFAULT 'Mimosa Privilege Membership',
    intro_es TEXT NOT NULL DEFAULT '',
    intro_en TEXT NOT NULL DEFAULT '',
    image_url TEXT DEFAULT '',
    what_is_title_es VARCHAR(255) NOT NULL DEFAULT '¿Qué es Mimosa Privilege?',
    what_is_title_en VARCHAR(255) NOT NULL DEFAULT 'What is Mimosa Privilege?',
    what_is_content_es TEXT NOT NULL DEFAULT '',
    what_is_content_en TEXT NOT NULL DEFAULT '',
    benefits_title_es VARCHAR(255) NOT NULL DEFAULT 'Beneficios que te encantarán',
    benefits_title_en VARCHAR(255) NOT NULL DEFAULT 'Benefits you will love',
    benefits_es TEXT[] DEFAULT ARRAY[]::TEXT[],
    benefits_en TEXT[] DEFAULT ARRAY[]::TEXT[],
    who_is_for_title_es VARCHAR(255) NOT NULL DEFAULT '¿Para quién es?',
    who_is_for_title_en VARCHAR(255) NOT NULL DEFAULT 'Who is it for?',
    who_is_for_es TEXT[] DEFAULT ARRAY[]::TEXT[],
    who_is_for_en TEXT[] DEFAULT ARRAY[]::TEXT[],
    group_use_title_es VARCHAR(255) NOT NULL DEFAULT 'Uso en grupo',
    group_use_title_en VARCHAR(255) NOT NULL DEFAULT 'Group use',
    group_use_es TEXT[] DEFAULT ARRAY[]::TEXT[],
    group_use_en TEXT[] DEFAULT ARRAY[]::TEXT[],
    options_title_es VARCHAR(255) NOT NULL DEFAULT 'Opciones de Membresía',
    options_title_en VARCHAR(255) NOT NULL DEFAULT 'Membership Options',
    options_es TEXT[] DEFAULT ARRAY[]::TEXT[],
    options_en TEXT[] DEFAULT ARRAY[]::TEXT[],
    tiers JSONB DEFAULT '[]'::JSONB,
    cta_es TEXT NOT NULL DEFAULT '',
    cta_en TEXT NOT NULL DEFAULT '',
    table_note_es VARCHAR(255) NOT NULL DEFAULT '* Precios no incluyen ITBMS',
    table_note_en VARCHAR(255) NOT NULL DEFAULT '* Prices do not include ITBMS',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.membership_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.membership_settings
    FOR SELECT
    USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update" ON public.membership_settings
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert" ON public.membership_settings
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Insert default record with all content from the existing website
INSERT INTO public.membership_settings (
    title_es,
    title_en,
    subtitle_es,
    subtitle_en,
    intro_es,
    intro_en,
    what_is_title_es,
    what_is_title_en,
    what_is_content_es,
    what_is_content_en,
    benefits_title_es,
    benefits_title_en,
    benefits_es,
    benefits_en,
    who_is_for_title_es,
    who_is_for_title_en,
    who_is_for_es,
    who_is_for_en,
    group_use_title_es,
    group_use_title_en,
    group_use_es,
    group_use_en,
    options_title_es,
    options_title_en,
    options_es,
    options_en,
    tiers,
    cta_es,
    cta_en,
    table_note_es,
    table_note_en,
    is_active
) VALUES (
    'Membresía Privilege',
    'Privilege Membership',
    'Mimosa Privilege Membership',
    'Mimosa Privilege Membership',
    'Más bienestar. Más ventajas. Mejor valor.

Si amas Mimosa Spa y nos visitas con frecuencia, Mimosa Privilege es para ti.
Disfruta tus masajes, faciales y tus tratamientos favoritos.',
    'More wellness. More benefits. Better value.

If you love Mimosa Spa and visit us frequently, Mimosa Privilege is for you.
Enjoy your massages, facials, and your favorite treatments.',
    '¿Qué es Mimosa Privilege?',
    'What is Mimosa Privilege?',
    'Una membresía exclusiva que te regala más valor por tu dinero y te permite usarla en:

Masajes
Tratamientos faciales
Tratamientos especiales',
    'An exclusive membership that gives you more value for your money and allows you to use it on:

Massages
Facial treatments
Special treatments',
    'Beneficios que te encantarán',
    'Benefits you will love',
    ARRAY['Obtienes crédito adicional desde el primer día', 'Tarjeta elegante, práctica y fácil de llevar', 'No necesitas efectivo: solo presenta tu tarjeta', 'Compartible con tu familia', 'Ideal para disfrutar sola(o), en pareja, con amigos o en grupo', 'Perfecta también para beneficios corporativos, incentivos y atención a clientes'],
    ARRAY['Get additional credit from day one', 'Elegant, practical and easy to carry card', 'No cash needed: just present your card', 'Shareable with your family', 'Ideal to enjoy alone, as a couple, with friends or in a group', 'Also perfect for corporate benefits, incentives and customer service'],
    '¿Para quién es?',
    'Who is it for?',
    ARRAY['Residentes o visitantes frecuentes', 'Uso personal', 'Familias', 'Empresas (staff, clientes, proveedores o eventos)'],
    ARRAY['Residents or frequent visitors', 'Personal use', 'Families', 'Companies (staff, clients, suppliers or events)'],
    'Uso en grupo',
    'Group use',
    ARRAY['Tarjetas de 18 meses: hasta 6 personas', 'Tarjetas de 12 meses: hasta 4 personas'],
    ARRAY['18-month cards: up to 6 people', '12-month cards: up to 4 people'],
    'Opciones de Membresía',
    'Membership Options',
    ARRAY['Paga $500 y recibe $625', 'Paga $1,000 y recibe $1,350'],
    ARRAY['Pay $500 and receive $625', 'Pay $1,000 and receive $1,350'],
    '[{"name": "Mimosa Privilege $500", "price": 500, "value": 625, "validity_months": 12, "guests_per_visit": 4, "benefit_percent": 25}, {"name": "Mimosa Privilege $1,000", "price": 1000, "value": 1350, "validity_months": 18, "guests_per_visit": 6, "benefit_percent": 35}]'::JSONB,
    'Escríbenos y pregunta hoy mismo por Mimosa Privilege.',
    'Contact us and ask about Mimosa Privilege today.',
    '* Precios no incluyen ITBMS',
    '* Prices do not include ITBMS',
    true
) ON CONFLICT DO NOTHING;

-- Comment on the table
COMMENT ON TABLE public.membership_settings IS 'Stores content for the Mimosa Privilege membership page';
