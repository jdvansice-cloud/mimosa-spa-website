/** Confirm the print-queue and POS-invoicing migrations landed. */
import { createClient } from '@supabase/supabase-js'
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const checks: Array<[string, string]> = [
  ['print_jobs', 'id,kind,invoice_id,order_id,location_id,status,payload,attempts,claimed_by,reprint_of'],
  ['efactura_return_review', 'mindbody_sale_id,original_sale_id,location_id,amount_cents,reason,resolved_at'],
  ['electronic_invoices', 'id,mindbody_sale_id,reverses_sale_id,doc_type,status'],
  ['efactura_config', 'location_id,razon_social,ruc,dv,direccion,telefono,receipt_footer,codigo_sucursal,enabled'],
]
for (const [table, cols] of checks) {
  const { error } = await s.from(table).select(cols).limit(1)
  console.log(error ? `FALLA  ${table}: ${error.message}` : `ok     ${table}`)
}

const { data: cfg } = await s.from('efactura_config')
  .select('location_id,codigo_sucursal,razon_social,ruc,dv,enabled,environment').order('location_id')
console.log('\nefactura_config:')
for (const c of (cfg ?? []) as any[]) {
  const missing = [!c.razon_social && 'razon_social', !c.ruc && 'ruc'].filter(Boolean)
  console.log(
    `  sede ${String(c.location_id).padEnd(2)} sucursal ${c.codigo_sucursal ?? '—'}  ` +
    `${c.enabled ? 'habilitada' : 'deshabilitada'} (${c.environment})  ` +
    (missing.length ? `FALTA PARA IMPRIMIR: ${missing.join(', ')}` : `${c.razon_social} · RUC ${c.ruc}`)
  )
}
