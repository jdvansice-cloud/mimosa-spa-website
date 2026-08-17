-- Lifecycle notifications: welcome (new client), first-visit thanks, birthday.
-- Run by hand in the Supabase SQL editor.

-- mb_clients already exists as the KPI client cache (20260706_kpi_mindbody_cache).
-- Extend it with the contact/birthday fields the lifecycle cron needs — both
-- systems share one Mindbody client mirror without touching each other's columns.
ALTER TABLE public.mb_clients ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.mb_clients ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.mb_clients ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.mb_clients ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
-- month*100+day, e.g. Aug 15 → 815; lets PostgREST filter birthdays directly
ALTER TABLE public.mb_clients
  ADD COLUMN IF NOT EXISTS birth_md INT GENERATED ALWAYS AS (
    (EXTRACT(MONTH FROM birth_date) * 100 + EXTRACT(DAY FROM birth_date))::INT
  ) STORED;
CREATE INDEX IF NOT EXISTS idx_mb_clients_birth_md ON public.mb_clients (birth_md);

-- Once-only ledger. year=0 for one-time kinds; birthday uses the calendar year
-- so it can repeat annually.
CREATE TABLE IF NOT EXISTS public.lifecycle_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_key TEXT NOT NULL,           -- Mindbody client id
  kind TEXT NOT NULL CHECK (kind IN ('welcome', 'first_visit', 'birthday')),
  year INT NOT NULL DEFAULT 0,
  channel_wa BOOLEAN NOT NULL DEFAULT false,
  channel_email BOOLEAN NOT NULL DEFAULT false,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (client_key, kind, year)
);

-- Cursor storage for the rolling full-base client sync (birthday backfill).
CREATE TABLE IF NOT EXISTS public.lifecycle_state (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mb_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifecycle_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifecycle_state ENABLE ROW LEVEL SECURITY;
-- Service-role only (no policies): the cron uses the service key.
