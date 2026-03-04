-- Create bookings table to track all bookings made through the webapp
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Our confirmation number (MIM-{timestamp})
  confirmation_number TEXT NOT NULL,

  -- Booking status: confirmed (all ok), partial (some services failed), failed
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'partial', 'failed')),

  -- Client info
  mindbody_client_id INTEGER NOT NULL,
  client_name TEXT,
  client_phone TEXT,
  client_email TEXT,

  -- Location
  location_id INTEGER NOT NULL,
  location_name TEXT,

  -- Staff / Therapist
  staff_id INTEGER,
  therapist_name TEXT,
  staff_requested BOOLEAN DEFAULT FALSE,

  -- Appointment date/time (start of the first service)
  appointment_start TIMESTAMPTZ NOT NULL,

  -- Services booked (JSONB array)
  -- Each element: { sessionTypeId: number, name: string, duration: number }
  services JSONB NOT NULL DEFAULT '[]',

  -- Total duration in minutes
  total_duration INTEGER,

  -- Mindbody appointment IDs returned from the API
  mindbody_appointment_ids INTEGER[] DEFAULT '{}',

  -- Promotion used (if any)
  promotion_name TEXT,

  -- How many services were requested vs actually booked
  total_requested INTEGER NOT NULL DEFAULT 1,
  total_booked INTEGER NOT NULL DEFAULT 1,

  -- Pricing
  subtotal_before_tax DECIMAL(10,2),
  tax_amount DECIMAL(10,2),
  total_with_tax DECIMAL(10,2),

  -- WhatsApp confirmation sent?
  whatsapp_sent BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_confirmation ON public.bookings(confirmation_number);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON public.bookings(mindbody_client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_appointment_start ON public.bookings(appointment_start);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (server-side API routes)
CREATE POLICY "Service role full access" ON public.bookings
  FOR ALL
  USING (auth.role() = 'service_role');

-- Admins can view all bookings
CREATE POLICY "Admins can view bookings" ON public.bookings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Auto-update updated_at trigger
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
