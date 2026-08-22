/** Daily reconciliation for a month: ours (by sale date) vs the bridge (by issue date). */
import { createClient } from '@supabase/supabase-js'
import { buildPosInvoiceInput } from '../../src/lib/efactura/fromMindbodySale.ts'

const month = process.argv[2] || '2026-06'
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const page = async <T,>(t: string, cols: string, apply: (q: any) => any): Promise<T[]> => {
  const out: T[] = []
  for (let from = 0; ; from += 1000) {
    const { data } = await apply(s.from(t).select(cols)).range(from, from + 999)
    if (!data?.length) break
    out.push(...(data as T[])); if (data.length < 1000) break
  }
  return out
}
const start = month + '-01'
const end = new Date(Date.UTC(+month.slice(0,4), +month.slice(5,7), 1)).toISOString().slice(0,10)

const sales = await page<{id:number; sale_date:string}>('mb_sales','id,sale_date',
  q => q.gte('sale_date',start).lt('sale_date',end).order('id'))
const invs = await page<{amount:number; issued_at:string; status:string}>('biz_invoices','amount,issued_at,status',
  q => q.order('invoice_number'))

const ours: Record<string,{n:number;amt:number}> = {}
for (const sale of sales) {
  const d = await buildPosInvoiceInput(s, sale.id)
  if (!d.emit) continue
  const k = sale.sale_date.slice(0,10)
  ours[k] = ours[k] || {n:0,amt:0}; ours[k].n++; ours[k].amt += d.invoicedCents/100
}
const theirs: Record<string,{n:number;amt:number}> = {}
for (const r of invs.filter(r => r.status==='authorized' && (r.issued_at||'').startsWith(month))) {
  const k = r.issued_at.slice(0,10)
  theirs[k] = theirs[k] || {n:0,amt:0}; theirs[k].n++; theirs[k].amt += Number(r.amount||0)
}
const days = [...new Set([...Object.keys(ours), ...Object.keys(theirs)])].sort()
console.log('\ndía         nuestros   puente     Δdocs      Δmonto')
let big = 0
for (const d of days) {
  const o = ours[d]||{n:0,amt:0}, t = theirs[d]||{n:0,amt:0}
  const dn = o.n-t.n, da = o.amt-t.amt
  if (Math.abs(dn) > 3) big++
  console.log(' ', d, String(o.n).padStart(6), String(t.n).padStart(9), String(dn).padStart(8),
    ('$'+da.toFixed(2)).padStart(12), Math.abs(dn)>3 ? '  <<<' : '')
}
console.log('\ndías con diferencia >3 documentos:', big, 'de', days.length)
