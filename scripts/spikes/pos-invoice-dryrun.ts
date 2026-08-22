/**
 * Shadow run: decide what we WOULD invoice for real Mindbody POS sales.
 * Transmits nothing. Reports coverage, exclusions and any sale we'd refuse.
 *
 *   npm run efactura:pos-dryrun [days]
 */
import { createClient } from '@supabase/supabase-js'
import { buildPosInvoiceInput } from '../../src/lib/efactura/fromMindbodySale.ts'
import { buildInvoiceRequest } from '../../src/lib/efactura/buildInvoice.ts'

const days = Number(process.argv[2] || 14)
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const since = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10)

const { data: sales } = await s.from('mb_sales')
  .select('id, sale_date, location_id, total_paid').gte('sale_date', since).order('sale_date')
console.log(`Analizando ${sales?.length ?? 0} ventas desde ${since}\n`)

let emit = 0, skipped = 0, failed = 0
let invoicedCents = 0, saleCents = 0, excludedCents = 0
const skipReasons: Record<string, number> = {}
const exclReasons: Record<string, { n: number; cents: number }> = {}
const problems: string[] = []
let sample: unknown = null

for (const sale of sales ?? []) {
  const d = await buildPosInvoiceInput(s, sale.id)
  saleCents += Math.round(Number(sale.total_paid ?? 0) * 100)
  if (!d.emit) {
    skipped++
    skipReasons[d.reason] = (skipReasons[d.reason] || 0) + 1
    if (/insuficientes/.test(d.reason)) problems.push(`venta ${sale.id}: ${d.reason}`)
    continue
  }
  for (const e of d.excluded) {
    exclReasons[e.reason] = exclReasons[e.reason] || { n: 0, cents: 0 }
    exclReasons[e.reason].n++; exclReasons[e.reason].cents += e.cents
    excludedCents += e.cents
  }
  try {
    const payload = buildInvoiceRequest({
      lines: d.lines, payments: d.payments,
      puntoFacturacion: '001',
      codigoSucursal: d.locationId === 1 ? '0000' : '0001',
    })
    emit++; invoicedCents += d.invoicedCents
    if (!sample && d.excluded.length > 0 && d.lines.length > 0) sample = { saleId: d.saleId, payload, excluded: d.excluded }
  } catch (e) {
    failed++
    problems.push(`venta ${sale.id}: ${e instanceof Error ? e.message : 'error'}`)
  }
}

const money = (c: number) => '$' + (c / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })
console.log('RESULTADO')
console.log('  facturables :', emit)
console.log('  omitidas    :', skipped)
console.log('  con error   :', failed)
console.log('\n  total ventas      :', money(saleCents))
console.log('  total a facturar  :', money(invoicedCents))
console.log('  excluido (no facturable):', money(excludedCents))

console.log('\nVENTAS OMITIDAS')
Object.entries(skipReasons).sort((a,b)=>b[1]-a[1]).forEach(([r,n]) => console.log('   '+String(n).padStart(4), r))
console.log('\nLÍNEAS EXCLUIDAS DE LA FACTURA')
Object.entries(exclReasons).sort((a,b)=>b[1].cents-a[1].cents).forEach(([r,v]) =>
  console.log('   '+String(v.n).padStart(4), r.padEnd(46), money(v.cents)))

if (problems.length) {
  console.log('\n⚠ REVISAR (' + problems.length + '):')
  problems.slice(0, 10).forEach(p => console.log('   ' + p))
}
if (sample) {
  console.log('\nEJEMPLO (venta mixta) ─────────────────────')
  console.log(JSON.stringify(sample, null, 1).slice(0, 1800))
}
