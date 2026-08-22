-- Mint an online gift-card serial and create its row in ONE transaction.
--
-- APPLIED, THEN SUPERSEDED — see 20260916_drop_atomic_serial.sql.
-- Kept as a record of what ran against the database. The code no longer calls
-- this function: we reverted to mint-then-insert, where a failed attempt burns
-- a serial but every retry mints a fresh number (self-healing). Inside one
-- transaction a serial clash would instead roll back and re-mint the SAME
-- number forever, wedging fulfillment.

CREATE OR REPLACE FUNCTION public.create_online_giftcard(
  p_config_id      UUID,
  p_location_id    INTEGER,
  p_buyer_name     TEXT,
  p_buyer_email    TEXT,
  p_buyer_phone    TEXT,
  p_recipient_name TEXT,
  p_recipient_email TEXT,
  p_amount_cents   INTEGER,
  p_base_amount_cents INTEGER,
  p_tax_cents      INTEGER,
  p_treatment_names TEXT[],
  p_message        TEXT,
  p_view_token     TEXT,
  p_expires_at     TIMESTAMPTZ,
  p_print_treatments BOOLEAN
)
RETURNS TABLE (id UUID, serial TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
  v_serial TEXT;
BEGIN
  IF p_config_id IS NULL THEN
    v_serial := 'MW-' || lpad(nextval('public.gc_online_serial_seq')::TEXT, 6, '0');
  ELSE
    v_serial := public.next_giftcard_serial(p_config_id);
  END IF;

  RETURN QUERY
  INSERT INTO public.gift_cards (
    serial, format, channel,
    buyer_name, buyer_email, buyer_phone,
    recipient_name, recipient_email,
    amount_cents, base_amount_cents, tax_cents,
    gift_treatment_names, message, view_token, expires_at,
    print_amount, print_message, print_recipient, print_treatments,
    gift_card_serial_config_id, mindbody_location_id
  ) VALUES (
    v_serial, 'gift_card', 'online',
    p_buyer_name, p_buyer_email, p_buyer_phone,
    p_recipient_name, p_recipient_email,
    p_amount_cents, p_base_amount_cents, p_tax_cents,
    p_treatment_names, p_message, p_view_token, p_expires_at,
    TRUE, p_message IS NOT NULL, TRUE, p_print_treatments,
    p_config_id, p_location_id
  )
  RETURNING gift_cards.id, gift_cards.serial;
END;
$$;
