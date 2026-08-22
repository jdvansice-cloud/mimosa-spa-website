/**
 * Per-document reconciliation against the bridge.
 *
 * The aggregate comparison said we would emit ~37 more documents and ~$11.7k
 * more than the bridge did, and the daily view showed the bridge issues a
 * document the day AFTER the sale. Neither tells us WHICH sales differ, so
 * this matches individual documents by amount inside a date window and reports
 * what is left over on each side.
 *
 * Greedy nearest-date matching on exact cent amounts: two documents for the
 * same cents are interchangeable for this purpose, and the leftovers are what
 * we actually care about.
 */
import { createClient } from '@supabase/supabase-js'
import { buildPosInvoiceInput } from '../../src/lib/efactura/fromMindbodySale.ts'

const month = process.argv[2] || '2026-06'
const WINDOW_DAYS = Number(process.argv[3] || 3)
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const start = month + '-01'
const end = new Date(Date.UTC(+month.slice(0, 4), +month.slice(5, 7), 1)).toISOString().slice(0, 10)
const day = (iso: string) => Math.floor(Date.parse(iso.slice(0, 10)) / 86400000)

async function pageAll<T>(table: string, cols: string, tweak: (q: any) => any): Promise<T[]> {
  const out: T[] = []
  for (let from = 0; ; from += 1000) {
    const { data } = await tweak(s.from(table).select(cols)).range(from, from + 999)
    if (!data?.length) break
    out.push(...(data as T[]))
    if (data.length < 1000) break
  }
  return out
}

type Sale = { id: number; sale_date: string; location_id: number | null; total_paid: number }
const sales = await pageAll<Sale>('mb_sales', 'id,sale_date,location_id,total_paid', q =>
  q.gte('sale_date', start).lt('sale_date', end).order('id')
)

// Our side: one document per invoiceable sale, with the line detail kept so an
// unmatched document can be explained rather than just counted.
type Ours = {
  saleId: number
  day: number
  cents: number
  descriptions: string[]
  paymentTypes: string[]
  matched: boolean
}
const ours: Ours[] = []
for (const sale of sales) {
  const d = await buildPosInvoiceInput(s, sale.id)
  if (!d.emit) continue
  ours.push({
    saleId: sale.id,
    day: day(sale.sale_date),
    cents: d.invoicedCents,
    descriptions: d.lines.map(l => l.description),
    paymentTypes: d.payments.map(p => p.tender),
    matched: false,
  })
}

type Bridge = { invoice_number: string; amount: number; itbms: number; issued_at: string; status: string }
const bridgeAll = await pageAll<Bridge>('biz_invoices', 'invoice_number,amount,itbms,issued_at,status', q =>
  q.order('invoice_number')
)
const bridge = bridgeAll
  .filter(r => (r.issued_at || '').startsWith(month) && r.status === 'authorized')
  // biz_invoices.amount is the NET taxable base, with the tax in `itbms`
  // alongside it (verified: amount 129.00 + itbms 9.03 = a $138.03 sale).
  // Our invoicedCents is tax-INCLUSIVE, so the comparable figure is the sum.
  .map(r => ({
    ...r,
    day: day(r.issued_at),
    cents: Math.round((Number(r.amount || 0) + Number(r.itbms || 0)) * 100),
    matched: false,
  }))

// Index the bridge by exact cent amount so matching is a lookup, not a scan.
const byCents = new Map<number, typeof bridge>()
for (const b of bridge) {
  const list = byCents.get(b.cents) ?? []
  list.push(b)
  byCents.set(b.cents, list)
}

/**
 * Two passes. The first demands the exact cent; the second allows ±CENT_TOL,
 * which separates "the bridge never issued this document" from "we round a
 * multi-line sale one cent differently". Those are very different problems and
 * lumping them together is what made the first comparison unreadable.
 */
const CENT_TOL = 2
let nearMatches = 0

function tryMatch(o: (typeof ours)[number], tol: number): boolean {
  let best: (typeof bridge)[number] | null = null
  let bestGap = Infinity
  for (let delta = -tol; delta <= tol; delta++) {
    for (const c of byCents.get(o.cents + delta) ?? []) {
      if (c.matched) continue
      // Nearest issue date wins — the bridge often issues the day after.
      const gap = Math.abs(c.day - o.day)
      if (gap <= WINDOW_DAYS && gap < bestGap) { best = c; bestGap = gap }
    }
  }
  if (!best) return false
  best.matched = true
  o.matched = true
  return true
}

for (const o of ours) tryMatch(o, 0)
for (const o of ours) {
  if (o.matched) continue
  if (tryMatch(o, CENT_TOL)) nearMatches++
}

const unmatchedOurs = ours.filter(o => !o.matched)
const unmatchedBridge = bridge.filter(b => !b.matched)
const $ = (c: number) => '$' + (c / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const sum = (a: number[]) => a.reduce((x, y) => x + y, 0)

console.log(`\n${month} — conciliación documento por documento (ventana ±${WINDOW_DAYS} días)\n`)
console.log(`  nuestros documentos : ${ours.length}  (${$(sum(ours.map(o => o.cents)))})`)
console.log(`  documentos puente   : ${bridge.length}  (${$(sum(bridge.map(b => b.cents)))})`)
console.log(`  emparejados exactos : ${ours.length - unmatchedOurs.length - nearMatches}`)
console.log(`  emparejados ±${CENT_TOL}¢    : ${nearMatches}   (redondeo, no discrepancia real)`)
console.log(`\n  SIN EMPAREJAR — nosotros facturamos, el puente no: ${unmatchedOurs.length} (${$(sum(unmatchedOurs.map(o => o.cents)))})`)
console.log(`  SIN EMPAREJAR — el puente facturó, nosotros no  : ${unmatchedBridge.length} (${$(sum(unmatchedBridge.map(b => b.cents)))})`)

// What is IN the documents the bridge never issued — this is the answer we want.
const wordCount = new Map<string, number>()
const tenderCount = new Map<string, number>()
for (const o of unmatchedOurs) {
  for (const d of new Set(o.descriptions)) wordCount.set(d, (wordCount.get(d) ?? 0) + 1)
  for (const t of new Set(o.paymentTypes)) tenderCount.set(t, (tenderCount.get(t) ?? 0) + 1)
}
const top = (m: Map<string, number>, n = 15) =>
  [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n)

console.log('\n  Conceptos más frecuentes en los documentos sin emparejar:')
for (const [k, v] of top(wordCount)) console.log(`    ${String(v).padStart(4)}  ${k}`)
console.log('\n  Formas de pago en los documentos sin emparejar:')
for (const [k, v] of top(tenderCount)) console.log(`    ${String(v).padStart(4)}  ${k}`)

console.log('\n  Muestra (10 ventas nuestras sin documento del puente):')
for (const o of unmatchedOurs.slice(0, 10)) {
  console.log(`    venta ${o.saleId}  ${$(o.cents)}  [${o.paymentTypes.join(', ')}]  ${o.descriptions.slice(0, 2).join(' + ')}`)
}
