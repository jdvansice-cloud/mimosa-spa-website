-- Round-robin router for WhatsApp chats that skip the location question.
-- WATI Pro has no built-in round robin, so the chatbot's Webhook node asks
-- /api/wati/round-robin whose turn it is and a Condition node then hands the
-- chat to that location's team.
--
-- One state row holds the last team picked. Every pick is logged so retries
-- (WATI re-firing the node, the client re-running the bot) keep the same
-- team instead of flipping the counter.
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS public.wati_round_robin_state (
  id         SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  last_team  TEXT NOT NULL DEFAULT 'sfc',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO public.wati_round_robin_state (id) VALUES (1) ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.wati_round_robin_log (
  id         BIGSERIAL PRIMARY KEY,
  phone      TEXT NOT NULL,
  team       TEXT NOT NULL,
  reused     BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS wati_round_robin_log_phone_idx
  ON public.wati_round_robin_log (phone, created_at DESC);

ALTER TABLE public.wati_round_robin_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wati_round_robin_log   ENABLE ROW LEVEL SECURITY;
-- No policies: only the service role (the API route) touches these tables.

-- Picks the next team atomically. Alternates 'cde' <-> 'sfc'. If this phone
-- was routed within the last 24 h, returns that same team and does not
-- advance the counter.
CREATE OR REPLACE FUNCTION public.wati_round_robin_next(p_phone TEXT)
RETURNS TABLE (team TEXT, reused BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_recent TEXT;
  v_team   TEXT;
BEGIN
  SELECT l.team INTO v_recent
  FROM public.wati_round_robin_log l
  WHERE l.phone = p_phone AND l.created_at > now() - INTERVAL '24 hours'
  ORDER BY l.created_at DESC
  LIMIT 1;

  IF v_recent IS NOT NULL THEN
    INSERT INTO public.wati_round_robin_log (phone, team, reused) VALUES (p_phone, v_recent, true);
    RETURN QUERY SELECT v_recent, true;
    RETURN;
  END IF;

  -- Row lock serialises concurrent picks so two chats never get the same turn.
  UPDATE public.wati_round_robin_state s
  SET last_team = CASE s.last_team WHEN 'cde' THEN 'sfc' ELSE 'cde' END,
      updated_at = now()
  WHERE s.id = 1
  RETURNING s.last_team INTO v_team;

  INSERT INTO public.wati_round_robin_log (phone, team, reused) VALUES (p_phone, v_team, false);
  RETURN QUERY SELECT v_team, false;
END;
$$;

REVOKE ALL ON FUNCTION public.wati_round_robin_next(TEXT) FROM PUBLIC, anon, authenticated;
