-- Seasonal gift-card promotions: the buyer pays the sale price, the card is worth the face value.
ALTER TABLE public.gc_catalog_items
  ADD COLUMN IF NOT EXISTS sale_amount_cents INTEGER
  CHECK (sale_amount_cents IS NULL OR (sale_amount_cents > 0 AND sale_amount_cents < amount_cents));
COMMENT ON COLUMN public.gc_catalog_items.sale_amount_cents IS 'Price charged when set (pre-ITBMS for experiences); amount_cents stays the face value.';

ALTER TABLE public.gc_orders      ADD COLUMN IF NOT EXISTS face_value_cents INTEGER;
ALTER TABLE public.order_items    ADD COLUMN IF NOT EXISTS gc_face_value_cents INTEGER;
COMMENT ON COLUMN public.gc_orders.face_value_cents IS 'Card value when it differs from total_cents (discounted sale). NULL = total_cents.';
