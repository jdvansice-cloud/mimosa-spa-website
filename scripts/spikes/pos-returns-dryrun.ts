/**
 * Dry run of the credit-note path over every return in the data.
 *
 * Transmits nothing. Answers the questions that decide whether this is safe to
 * turn on: how many returns produce a credit note at all, how often we can
 * identify the original sale, and what the ones we cannot look like.
 */
import { createClient } from '@supabase/supabase-js'
import { buildPosReturnInput } from '../../src/lib/efactura/posReturns.ts'

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const limit = Number(process.argv[2] || 0) // 0 = all

const returns: Array<{ id: number; sale_date: string; total_paid: number }> = []
for (let from = 0; ; from += 1000) {
  const { data } = await s.from('mb_sales')
    .select('id,sale_date,total_paid')
    .lt('total_paid', 0)
    .order('sale_datetime', { ascending: false })
    .range(from, from + 999)
  if (!data?.length) break
  returns.push(...(data as any[]))
  if (data.length < 1000) break
  if (limit && returns.length >= limit) break
}
const work = limit ? returns.slice(0, limit) : returns

let credited = 0, skipped = 0, withOriginal = 0, withoutOriginal = 0
let creditedCents = 0
const skipReasons = new Map<string, number>()
const orphans: Array<{ id: number; cents: number; date: string }> = []

for (const r of work) {
  const d = await buildPosReturnInput(s, r.id)
  if (!d.emit) {
    skipped++
    const key = d.reason.replace(/\d+/g, 'N')
    skipReasons.set(key, (skipReasons.get(key) ?? 0) + 1)
    continue
  }
  credited++
  creditedCents += d.creditedCents
  if (d.originalSaleId) withOriginal++
  else { withoutOriginal++; orphans.push({ id: r.id, cents: d.creditedCents, date: r.sale_date }) }
}

const $ = (c: number) => '$' + (c / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
console.log(`\nDevoluciones analizadas: ${work.length}\n`)
console.log(`  generan nota de crédito : ${credited}  (${$(creditedCents)})`)
console.log(`     └─ venta original identificada : ${withOriginal}`)
console.log(`     └─ sin identificar (NC genérica): ${withoutOriginal}`)
console.log(`  sin documento           : ${skipped}`)
console.log('\n  Motivos por los que no se emite nota de crédito:')
for (const [k, v] of [...skipReasons.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`    ${String(v).padStart(4)}  ${k}`)
}
if (orphans.length) {
  console.log('\n  Muestra de devoluciones sin venta original identificada:')
  for (const o of orphans.slice(0, 10)) console.log(`    venta ${o.id}  ${$(o.cents)}  ${o.date}`)
}
