-- Create service_resource_eligibility table for the Room/Resource Booking PRD
-- (docs/PRD_ROOM_RESOURCE_BOOKING.md v1.4 — see decision D-10).
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
--
-- Purpose:
--   Mindbody's read APIs do not surface the Service ↔ Resource eligibility link
--   at Mimosa's site. Mimosa configures eligibility in Mindbody admin (the
--   Service's Resource dropdown), and we MIRROR that configuration into this
--   table so the booking flow can resolve "which rooms can host this service".
--
--   Each row says: "session type X at location Y can be booked into resource Z."
--
--   One row per (session_type_id, location_id, resource_id) tuple.
--   v1 booking flow filters this table by:
--     - session_type_id = the service being booked
--     - location_id     = the customer's chosen location
--     - is_active       = true
--     - resource_id     must point to a resource whose name parses as v1-eligible
--                       (-1 suffix for standard rooms, any -N for Foot Massage).

CREATE TABLE IF NOT EXISTS service_resource_eligibility (
  id                BIGSERIAL PRIMARY KEY,
  session_type_id   INTEGER NOT NULL,
  location_id       INTEGER NOT NULL,
  resource_id       INTEGER NOT NULL,
  -- Denormalized for human-readable querying / debugging (not authoritative).
  -- Update these when Mindbody renames a service or resource; the IDs are the contract.
  session_type_name TEXT,
  resource_name     TEXT,
  -- Bookkeeping:
  is_active         BOOLEAN NOT NULL DEFAULT true,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_type_id, location_id, resource_id)
);

-- Primary lookup: booking flow queries by (session_type_id, location_id).
CREATE INDEX IF NOT EXISTS idx_sre_session_location_active
  ON service_resource_eligibility (session_type_id, location_id)
  WHERE is_active;

-- Secondary lookup: "which services use this room?" — useful for the audit and
-- for impact analysis when deactivating a resource.
CREATE INDEX IF NOT EXISTS idx_sre_resource_active
  ON service_resource_eligibility (resource_id)
  WHERE is_active;

-- Auto-update updated_at on every row change.
CREATE OR REPLACE FUNCTION sre_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sre_updated_at_trigger ON service_resource_eligibility;
CREATE TRIGGER sre_updated_at_trigger
  BEFORE UPDATE ON service_resource_eligibility
  FOR EACH ROW
  EXECUTE FUNCTION sre_set_updated_at();

-- Row Level Security: service role only (server-side API routes).
ALTER TABLE service_resource_eligibility ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON service_resource_eligibility
  FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE service_resource_eligibility IS
  'Mirrors Mindbody admin''s Service ↔ Resource link. See docs/PRD_ROOM_RESOURCE_BOOKING.md D-10.';
COMMENT ON COLUMN service_resource_eligibility.session_type_id IS
  'Mindbody SessionType.Id (e.g., 49 = "Mimosa Relax - 60 min").';
COMMENT ON COLUMN service_resource_eligibility.location_id IS
  'Mindbody Location.Id (1 = Costa del Este, 2 = San Francisco).';
COMMENT ON COLUMN service_resource_eligibility.resource_id IS
  'Mindbody Resource.Id. Must reference a resource that exists in /site/resources and follows the <CE|SF> | <Base Name> -<n> naming convention (D-6).';
COMMENT ON COLUMN service_resource_eligibility.is_active IS
  'Soft-delete flag. Inactive rows are ignored by the booking flow but retained for audit history.';
