-- Migration: Add promo code and discount fields to promotions table
-- This allows storing the Mindbody promo code, discount type, and discount amount

-- Add column for storing the Mindbody promo code
ALTER TABLE public.promotions
ADD COLUMN IF NOT EXISTS promo_code VARCHAR(50);

-- Add column for discount type (Percent or Amount)
ALTER TABLE public.promotions
ADD COLUMN IF NOT EXISTS discount_type VARCHAR(10);

-- Add column for discount amount
ALTER TABLE public.promotions
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2);

-- Add constraint for discount_type values
ALTER TABLE public.promotions
ADD CONSTRAINT check_discount_type
CHECK (discount_type IS NULL OR discount_type IN ('Percent', 'Amount'));

-- Comment on the new columns
COMMENT ON COLUMN public.promotions.promo_code IS 'Mindbody promotional code string';
COMMENT ON COLUMN public.promotions.discount_type IS 'Type of discount: Percent or Amount';
COMMENT ON COLUMN public.promotions.discount_amount IS 'Discount value (percentage or fixed amount)';
