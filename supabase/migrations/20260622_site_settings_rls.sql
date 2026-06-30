-- Fix: enable Row Level Security on public.site_settings
--
-- The live table had RLS policies defined but RLS was never enabled (schema
-- drift from the scripts/ table recreation). With RLS off on a public-schema
-- table, the policies are inert and anon can read AND write it.
--
-- Supabase Advisor: "Policy Exists RLS Disabled" + "RLS Disabled in Public"
-- (both CRITICAL — same root cause).
--
-- site_settings holds only non-sensitive public info (phones, email, WhatsApp
-- number, business hours, social URLs, discount flags), so public read stays
-- allowed; writes are restricted to admin / service role by the existing
-- policies. Server API routes use the service role key and bypass RLS.

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
