/** Compare what WE would invoice for a month against what the bridge actually emitted. */
import { createClient } from '@supabase/supabase-js'
import { buildPosInvoiceInput } from '../../src/lib/efactura/fromMindbodySale.ts'

const month = process.argv[2] || '2026-06'
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const start = month + '-01'
const end = new Date(Date.UTC(+month.slice(0,4), +month.slice(5,7), 1)).toISOString().slice(0,10)

// PostgREST caps a response at 1000 rows — page through or the month is silently truncated.
const sales: Array<{ id: number; total_paid: number }> = []
for (let from = 0; ; from += 1000) {
  const { data: page } = await s.from('mb_sales')
    .select('id,total_paid').gte('sale_date', start).lt('sale_date', end)
    .order('id').range(from, from + 999)
  if (!page?.length) break
  sales.push(...page as Array<{ id: number; total_paid: number }>)
  if (page.length < 1000) break
}

let docs = 0, amount = 0, itbms = 0, skipped = 0, storedValueCents = 0, tipsCents = 0
for (const sale of sales) {
  const d = await buildPosInvoiceInput(s, sale.id)
  if (!d.emit) {
    skipped++
    storedValueCents += Math.round(Number(sale.total_paid ?? 0) * 100)
    continue
  }
  docs++
  amount += d.invoicedCents / 100
  for (const l of d.lines) {
    const rate = l.taxRateCode === '01' ? 0.07 : 0
    itbms += rate === 0 ? 0 : (l.inclusiveCents - Math.round(l.inclusiveCents / 1.07)) / 100
  }
  for (const e of d.excluded) (/propina/.test(e.reason) ? tipsCents += e.cents : storedValueCents += e.cents)
}

const bridgeRows: Array<{ amount: number; itbms: number; issued_at: string }> = []
for (let from = 0; ; from += 1000) {
  const { data: page } = await s.from('biz_invoices')
    .select('amount,itbms,issued_at').order('invoice_number').range(from, from + 999)
  if (!page?.length) break
  bridgeRows.push(...page as Array<{ amount: number; itbms: number; issued_at: string }>)
  if (page.length < 1000) break
}
const bridge = bridgeRows.filter(r => (r.issued_at||'').startsWith(month))
// biz_invoices.amount is the NET taxable base and `itbms` sits alongside it
// (verified: amount 129.00 + itbms 9.03 = a $138.03 sale). Our figure is
// tax-INCLUSIVE, so the comparable total is the sum of the two. Comparing
// against `amount` alone invents an ~$11k "surplus" that is pure basis error.
const bAmount = bridge.reduce((a,r)=>a+Number(r.amount||0)+Number(r.itbms||0),0)
const bItbms  = bridge.reduce((a,r)=>a+Number(r.itbms||0),0)

const $ = (n:number) => '$'+n.toLocaleString('en-US',{minimumFractionDigits:2, maximumFractionDigits:2})
console.log(`\n${month} — ventas Mindbody analizadas: ${sales.length}\n`)
console.log('                     NOSOTROS          PUENTE ACTUAL        DIFERENCIA')
console.log('  documentos    ', String(docs).padStart(10), String(bridge.length).padStart(16), String(docs-bridge.length).padStart(15))
console.log('  monto         ', $(amount).padStart(10), $(bAmount).padStart(16), $(amount-bAmount).padStart(15))
console.log('  ITBMS         ', $(itbms).padStart(10), $(bItbms).padStart(16), $(itbms-bItbms).padStart(15))
console.log('\n  ventas omitidas (solo valor almacenado/cortesía):', skipped)
console.log('  excluido — valor almacenado:', $(storedValueCents/100))
console.log('  excluido — propinas        :', $(tipsCents/100))
