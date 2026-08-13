-- Bonus cards (app-native promo credits) + referral rails.
-- Deliberately NOT gift_cards rows: bonus credits never exist in Mindbody,
-- carry hard expiry, and are promo expense (not deferred revenue).
-- Idempotent — apply manually in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS public.bonus_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial TEXT UNIQUE NOT NULL,               -- 'BN-' + 6 unambiguous chars
  kind TEXT NOT NULL DEFAULT 'promo'
    CHECK (kind IN ('promo','referral_reward','referral_welcome')),
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  owner_name TEXT,
  owner_email TEXT,
  owner_phone TEXT,
  source_order_id UUID REFERENCES public.gc_orders(id),
  referral_code_id UUID,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  redeemed_at TIMESTAMPTZ,
  redeemed_by UUID REFERENCES auth.users(id),
  redeemed_location_id INTEGER,
  redemption_note TEXT,
  voided_at TIMESTAMPTZ,
  void_reason TEXT,
  view_token TEXT UNIQUE
);
-- Status is derived (vigente/expirada/canjeada/anulada) — no column to drift.

CREATE INDEX IF NOT EXISTS idx_bonus_cards_open ON public.bonus_cards(expires_at)
  WHERE redeemed_at IS NULL AND voided_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_bonus_cards_owner_email ON public.bonus_cards(owner_email);

CREATE TABLE IF NOT EXISTS public.bonus_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  min_total_cents INTEGER NOT NULL,
  bonus_cents INTEGER NOT NULL,
  validity_days INTEGER DEFAULT 90,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.bonus_rules (name, is_active, min_total_cents, bonus_cents, validity_days)
SELECT 'Compra $150+ → Bonus $25', false, 15000, 2500, 90
WHERE NOT EXISTS (SELECT 1 FROM public.bonus_rules);

CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  owner_name TEXT,
  owner_email TEXT,
  owner_phone TEXT,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.gc_orders
  ADD COLUMN IF NOT EXISTS referral_code_id UUID REFERENCES public.referral_codes(id),
  ADD COLUMN IF NOT EXISTS bonus_card_id UUID REFERENCES public.bonus_cards(id);

ALTER TABLE public.bonus_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonus_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
