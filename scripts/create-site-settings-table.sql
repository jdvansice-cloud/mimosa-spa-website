-- Create site_settings table for storing configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_costa_del_este TEXT DEFAULT '+507 6000-0001',
  phone_san_francisco TEXT DEFAULT '+507 6000-0002',
  email TEXT DEFAULT 'info@mimosaretreat.com',
  whatsapp_number TEXT DEFAULT '50764049464',
  whatsapp_message TEXT DEFAULT 'Hola, me gustaría obtener información sobre sus servicios.',
  weekday_open TIME DEFAULT '09:00',
  weekday_close TIME DEFAULT '20:00',
  weekend_open TIME DEFAULT '09:00',
  weekend_close TIME DEFAULT '18:00',
  instagram_url TEXT DEFAULT 'https://instagram.com/mimosasparetreat',
  facebook_url TEXT DEFAULT 'https://facebook.com/mimosasparetreat',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO site_settings (
  phone_costa_del_este,
  phone_san_francisco,
  email,
  whatsapp_number,
  whatsapp_message,
  weekday_open,
  weekday_close,
  weekend_open,
  weekend_close,
  instagram_url,
  facebook_url
) VALUES (
  '+507 6000-0001',
  '+507 6000-0002',
  'info@mimosaretreat.com',
  '50764049464',
  'Hola, me gustaría obtener información sobre sus servicios.',
  '09:00',
  '20:00',
  '09:00',
  '18:00',
  'https://instagram.com/mimosasparetreat',
  'https://facebook.com/mimosasparetreat'
);

-- Enable RLS (Row Level Security)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON site_settings
  FOR SELECT USING (true);

-- Create policy for authenticated users to update
CREATE POLICY "Allow authenticated update" ON site_settings
  FOR UPDATE USING (true);

-- Create policy for service role full access
CREATE POLICY "Allow service role full access" ON site_settings
  FOR ALL USING (true);
