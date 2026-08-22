-- efactura: target the right DGI sucursal per channel.
--
-- The PAC distinguishes branches by informacionEmisor.codigoSucursal (4 digits),
-- NOT by puntoFacturacion (which is '001' for the whole RUC). Verified against
-- live documents: CDE = 0000 "Star plaza, costa del este",
-- SF = 0001 "Sucursal San Francisco", and 0002 = "Mimosa Online" (new).
--
-- Online orders invoice under the online sucursal regardless of which spa
-- delivers the service, so web revenue is identifiable in DGI reporting.
-- Idempotent — safe to re-run. Apply manually in the Supabase SQL editor.

ALTER TABLE public.efactura_config
  ADD COLUMN IF NOT EXISTS codigo_sucursal TEXT,
  ADD COLUMN IF NOT EXISTS label TEXT;

-- location_id 0 is the ONLINE channel (not a Mindbody location).
INSERT INTO public.efactura_config (location_id, punto_facturacion, environment, enabled)
VALUES (0, '001', 'prod', false)
ON CONFLICT (location_id) DO NOTHING;

UPDATE public.efactura_config SET codigo_sucursal = '0000', label = 'Costa del Este' WHERE location_id = 1;
UPDATE public.efactura_config SET codigo_sucursal = '0001', label = 'San Francisco'  WHERE location_id = 2;
UPDATE public.efactura_config SET codigo_sucursal = '0002', label = 'Mimosa Online'  WHERE location_id = 0;

-- Share the API key across every channel row (one key serves the whole RUC).
UPDATE public.efactura_config c
   SET api_key = (SELECT api_key FROM public.efactura_config WHERE api_key IS NOT NULL LIMIT 1)
 WHERE c.api_key IS NULL;

ALTER TABLE public.electronic_invoices
  ADD COLUMN IF NOT EXISTS codigo_sucursal TEXT;
