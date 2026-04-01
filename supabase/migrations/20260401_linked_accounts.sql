-- Dual-channel OTP auth with account linking
-- Run this in Supabase SQL Editor
--
-- This migration adds:
-- 1. linked_accounts table: maps a verified credential (email or phone) to a specific Mindbody client ID.
--    Solves the non-unique credentials problem (families sharing email/phone in Mindbody).
-- 2. otp_code column on phone_verifications: replaces link-based WhatsApp verification with 6-digit OTP codes.
--

-- ============================================================
-- 1. linked_accounts table
-- ============================================================
CREATE TABLE IF NOT EXISTS linked_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  credential TEXT NOT NULL,
  credential_type TEXT NOT NULL CHECK (credential_type IN ('email', 'phone')),
  mindbody_client_id INTEGER NOT NULL,
  client_name TEXT NOT NULL,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(credential, credential_type, mindbody_client_id)
);

-- Fast lookup by credential
CREATE INDEX IF NOT EXISTS idx_linked_accounts_credential
  ON linked_accounts(credential, credential_type);

-- Fast lookup by Mindbody client (to find all credentials for a client)
CREATE INDEX IF NOT EXISTS idx_linked_accounts_client
  ON linked_accounts(mindbody_client_id);

-- Enable Row Level Security
ALTER TABLE linked_accounts ENABLE ROW LEVEL SECURITY;

-- Only service role can access (all operations via server-side API routes)
CREATE POLICY "Service role full access" ON linked_accounts
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 2. Add otp_code to phone_verifications
-- ============================================================
ALTER TABLE phone_verifications
  ADD COLUMN IF NOT EXISTS otp_code TEXT;

-- Index for OTP code lookup (phone + code)
CREATE INDEX IF NOT EXISTS idx_phone_verifications_otp
  ON phone_verifications(phone, otp_code)
  WHERE used = FALSE;
