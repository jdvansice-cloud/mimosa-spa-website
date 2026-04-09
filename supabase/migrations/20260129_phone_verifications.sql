-- Create phone_verifications table for WhatsApp verification tokens
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
--
-- WATI Template Setup (verificacion_telefono):
-- =============================================
-- Category: Utility or Authentication
-- Language: Spanish
--
-- Header: None
-- Body: Hola {{1}}, haz clic en el botón para verificar tu número y acceder a Mimosa Spa. Este enlace expira en 15 minutos.
-- Footer: None
-- Buttons:
--   - Type: URL
--   - Button Text: Verificar WhatsApp
--   - URL Type: Dynamic
--   - Website URL: https://mimosa-spa-website.vercel.app/es/portal/auth/verify-phone?token={{1}}
--

CREATE TABLE IF NOT EXISTS phone_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  client_id TEXT NOT NULL,
  client_name TEXT NOT NULL,
  email TEXT,
  redirect_url TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for token lookup (fast verification)
CREATE INDEX IF NOT EXISTS idx_phone_verifications_token ON phone_verifications(token);

-- Create index for phone lookup (to invalidate old tokens)
CREATE INDEX IF NOT EXISTS idx_phone_verifications_phone ON phone_verifications(phone, used);

-- Enable Row Level Security
ALTER TABLE phone_verifications ENABLE ROW LEVEL SECURITY;

-- Only allow service role to access (server-side only)
-- This ensures the table can only be accessed via server-side API routes
CREATE POLICY "Service role only" ON phone_verifications
  FOR ALL
  USING (auth.role() = 'service_role');

-- Optional: Auto-cleanup old tokens (older than 24 hours)
-- You can set up a scheduled function to run this periodically
-- DELETE FROM phone_verifications WHERE created_at < NOW() - INTERVAL '24 hours';
