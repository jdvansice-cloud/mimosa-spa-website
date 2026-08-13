-- Add missing columns to existing site_settings table
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS phone_costa_del_este TEXT DEFAULT '+507 6000-0001',
ADD COLUMN IF NOT EXISTS phone_san_francisco TEXT DEFAULT '+507 6000-0002',
ADD COLUMN IF NOT EXISTS email TEXT DEFAULT 'info@mimosaretreat.com',
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT DEFAULT '50764049464',
ADD COLUMN IF NOT EXISTS whatsapp_message TEXT DEFAULT 'Hola, me gustaría obtener información sobre sus servicios.',
ADD COLUMN IF NOT EXISTS weekday_open TEXT DEFAULT '09:00',
ADD COLUMN IF NOT EXISTS weekday_close TEXT DEFAULT '20:00',
ADD COLUMN IF NOT EXISTS weekend_open TEXT DEFAULT '09:00',
ADD COLUMN IF NOT EXISTS weekend_close TEXT DEFAULT '18:00',
ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT 'https://instagram.com/mimosaretreat',
ADD COLUMN IF NOT EXISTS facebook_url TEXT DEFAULT 'https://facebook.com/mimosaretreat',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
