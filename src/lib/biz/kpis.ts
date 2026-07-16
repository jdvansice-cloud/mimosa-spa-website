import { MONTHLY_BUDGETS } from '@/lib/kpis/constants'
import { fetchAll, serviceClient } from '@/lib/kpis/queries'
import { INTERNAL_CATEGORIES, classifyExpense } from './classify'

// ===========================================
// Business KPI dashboard (Mobile Manager · Negocio).
// Everything reads the imported packet tables; the Mindbody-synced
// kpi_daily_sales view is used only to cross-check the closeout.
// Benchmarks: spa/salon industry references documented in the accounting
// project plan (payroll 40–60% of revenue with 30–35% service-payroll
// target, rent 8–15%, supplies 8–12%, net margin 8–15%).
// ===========================================

export interface BizCheck {
  key: string
  a: number
  b: number
  diff: number
  /** within tolerance */
  ok: boolean
}

export interface BizPayload {
  month: string // YYYY-MM-01
  months: string[]
  files: Array<{ docType: string; locationId: number | null; filename: string; rows: number; status: string; uploadedAt: string }>
  revenue: {
    total: number
    byLocation: Record<string, number>
    itbmsCollected: number
    budget: number | null
    mbNet: number | null
  }
  expenses: {
    total: number
    byCategory: Array<{ category: string; amount: number; pct: number }>
    unclassified: number
    socioTotal: number
  }
  ratios: {
    payrollPct: number | null
    rentPct: number | null
    suppliesPct: number | null
    marginPct: number | null
  }
  benchmarks: Record<'payroll' | 'rent' | 'supplies' | 'margin', [number, number]>
  tips: { total: number; byLocation: Record<string, number>; pctOfCardSales: number | null }
  giftCards: { sold: number; redeemed: number; net: number }
  itbms: { collected: number; withheld: number; socioCredit: number; position: number }
  commissions: { bank: number; cardDetail: number; pctOfCardSales: number | null }
  balances: Array<{ accountKey: string; balance: number; date: string }>
  checks: BizCheck[]
}

const round2 = (n: number) => Math.round(n * 100) / 100

interface TxnRow {
  account_key: string
  location_id: number | null
  txn_date: string
  description: string
  note: string | null
  debit: number
  credit: number
  balance: number | null
  category: string | null
}

export async function getBizKpis(monthParam?: string | null): Promise<BizPayload | { months: string[] }> {
  const supabase = serviceClient()

  const { data: monthRows } = await supabase
    .from('biz_files')
    .select('month')
    .order('month', { ascending: false })
  const months = [...new Set((monthRows ?? []).map(r => r.month as string))]
  if (months.length === 0) return { months: [] }
  const month = monthParam && months.includes(monthParam) ? monthParam : months[0]
  const end = new Date(`${month}T00:00:00Z`)
  end.setUTCMonth(end.getUTCMonth() + 1)
  const monthEnd = end.toISOString().slice(0, 10)

  const [filesRes, txns, settlements, daily, socios] = await Promise.all([
    supabase
      .from('biz_files')
      .select('doc_type,location_id,filename,rows_imported,status,uploaded_at,summary')
      .eq('month', month)
      .order('id', { ascending: true }),
    fetchAll<TxnRow>((from, to) =>
      supabase
        .from('biz_bank_txns')
        .select('account_key,location_id,txn_date,description,note,debit,credit,balance,category')
        .gte('txn_date', month).lt('txn_date', monthEnd)
        .order('id', { ascending: true }).range(from, to) as unknown as PromiseLike<{ data: TxnRow[] | null; error: { message: string } | null }>
    ),
    fetchAll<{ location_id: number | null; gross: number; consumo: number; tip: number; itbms_withheld: number; commission: number; commission_itbms: number }>((from, to) =>
      supabase
        .from('biz_card_settlements')
        .select('location_id,gross,consumo,tip,itbms_withheld,commission,commission_itbms')
        .gte('txn_date', month).lt('txn_date', monthEnd)
        .order('id', { ascending: true }).range(from, to) as unknown as PromiseLike<{ data: never[] | null; error: { message: string } | null }>
    ),
    fetchAll<{ doc_type: string; location_id: number; sale_date: string; cash: number; card: number; misc: number; subtotal: number | null; itbms: number | null; total: number }>((from, to) =>
      supabase
        .from('biz_daily_sales')
        .select('doc_type,location_id,sale_date,cash,card,misc,subtotal,itbms,total')
        .gte('sale_date', month).lt('sale_date', monthEnd)
        .order('id', { ascending: true }).range(from, to) as unknown as PromiseLike<{ data: never[] | null; error: { message: string } | null }>
    ),
    fetchAll<{ vendor: string; description: string | null; amount: number; itbms: number; total: number }>((from, to) =>
      supabase
        .from('biz_socio_expenses')
        .select('vendor,description,amount,itbms,total,file:biz_files!inner(month)')
        .eq('file.month', month)
        .order('id', { ascending: true }).range(from, to) as unknown as PromiseLike<{ data: never[] | null; error: { message: string } | null }>
    ),
  ])

  // ---- revenue (Mindbody closeout: SUBTOTAL = net of ITBMS; GC sales excluded = liability)
  const closeout = daily.filter(d => d.doc_type === 'mb_closeout')
  const revByLoc: Record<string, number> = {}
  let revenue = 0, itbmsCollected = 0
  for (const d of closeout) {
    const net = Number(d.subtotal ?? 0)
    revenue += net
    itbmsCollected += Number(d.itbms ?? 0)
    revByLoc[d.location_id] = (revByLoc[d.location_id] ?? 0) + net
  }
  const year = Number(month.slice(0, 4))
  const mIdx = Number(month.slice(5, 7)) - 1
  const budgets = MONTHLY_BUDGETS[year]
  const budget = budgets ? (budgets[1]?.[mIdx] ?? 0) + (budgets[2]?.[mIdx] ?? 0) : null

  // Mindbody-synced accrual net for the same month (cross-check).
  // Gift-card SALES are excluded: the closeout treats them as a liability,
  // not revenue, so the comparable Mindbody number is services + retail.
  const { data: mbRows } = await supabase
    .from('kpi_daily_sales')
    .select('net,bucket')
    .gte('sale_date', month).lt('sale_date', monthEnd)
    .neq('bucket', 'giftcard')
  const mbNet = mbRows ? round2(mbRows.reduce((s, r) => s + Number(r.net ?? 0), 0)) : null

  // ---- expenses (bank debits + partner-paid), internal & tax-withholding excluded
  const catTotals = new Map<string, number>()
  const addExpense = (category: string, amount: number) => {
    if (amount <= 0 || INTERNAL_CATEGORIES.has(category) || category === 'Retención ITBMS') return
    catTotals.set(category, (catTotals.get(category) ?? 0) + amount)
  }
  for (const t of txns) if (t.debit > 0) addExpense(t.category ?? 'Sin clasificar', Number(t.debit))
  let socioTotal = 0
  for (const sx of socios) {
    socioTotal += Number(sx.total)
    addExpense(classifyExpense(`${sx.vendor} ${sx.description ?? ''}`), Number(sx.total))
  }
  const totalExpenses = [...catTotals.values()].reduce((s, v) => s + v, 0)
  const byCategory = [...catTotals.entries()]
    .map(([category, amount]) => ({ category, amount: round2(amount), pct: totalExpenses > 0 ? amount / totalExpenses : 0 }))
    .sort((a, b) => b.amount - a.amount)

  // ---- ratios vs industry
  const payroll = (catTotals.get('Planilla') ?? 0) + (catTotals.get('CSS (cargas sociales)') ?? 0)
  const rent = catTotals.get('Alquiler') ?? 0
  const supplies = (catTotals.get('Insumos') ?? 0) + (catTotals.get('Lavandería') ?? 0)
  const ratios = {
    payrollPct: revenue > 0 ? payroll / revenue : null,
    rentPct: revenue > 0 ? rent / revenue : null,
    suppliesPct: revenue > 0 ? supplies / revenue : null,
    marginPct: revenue > 0 ? (revenue - totalExpenses) / revenue : null,
  }

  // ---- tips (card tips from the SG settlement; cash tips are not in the packet)
  const tipsByLoc: Record<string, number> = {}
  let tipsTotal = 0, cardGross = 0, cardCommission = 0, settlementWithheld = 0
  for (const st of settlements) {
    tipsTotal += Number(st.tip)
    cardGross += Number(st.gross)
    cardCommission += Number(st.commission) + Number(st.commission_itbms)
    settlementWithheld += Number(st.itbms_withheld)
    const k = String(st.location_id ?? 0)
    tipsByLoc[k] = (tipsByLoc[k] ?? 0) + Number(st.tip)
  }

  // ---- gift cards (sold = liability in, redeemed = liability out)
  const gcSold = daily.filter(d => d.doc_type === 'gc_sold').reduce((s, d) => s + Number(d.total), 0)
  const gcRedeemed = daily.filter(d => d.doc_type === 'gc_redeemed').reduce((s, d) => s + Number(d.total), 0)

  // ---- ITBMS position: collected − withheld by acquirer − credit on purchases
  const bankWithheld = txns.filter(t => t.category === 'Retención ITBMS').reduce((s, t) => s + Number(t.debit), 0)
  const withheld = bankWithheld > 0 ? bankWithheld : settlementWithheld
  const socioCredit = socios.reduce((s, x) => s + Number(x.itbms), 0)
  const position = itbmsCollected - withheld - socioCredit

  // ---- commissions
  const bankCommission = catTotals.get('Comisiones bancarias') ?? 0

  // ---- end-of-month balances per account
  const balances: Array<{ accountKey: string; balance: number; date: string }> = []
  const byAccount = new Map<string, TxnRow[]>()
  for (const t of txns) {
    const list = byAccount.get(t.account_key) ?? []
    list.push(t)
    byAccount.set(t.account_key, list)
  }
  for (const [key, list] of byAccount) {
    const withBal = list.filter(t => t.balance !== null)
    if (withBal.length === 0) continue
    const last = withBal[withBal.length - 1]
    balances.push({ accountKey: key, balance: round2(Number(last.balance)), date: last.txn_date })
  }
  balances.sort((a, b) => a.accountKey.localeCompare(b.accountKey))

  // ---- cross-checks
  const closeoutMisc = closeout.reduce((s, d) => s + Number(d.misc), 0)
  const closeoutCard = closeout.reduce((s, d) => s + Number(d.card), 0)
  const closeoutTotal = closeout.reduce((s, d) => s + Number(d.total), 0)
  // GC bought with a gift card also shows as Misc tender, outside the closeout
  const gcSoldMisc = daily.filter(d => d.doc_type === 'gc_sold').reduce((s, d) => s + Number(d.misc), 0)
  // V/MC-only withholding on the statement (RETENCION CLAVE settles separately)
  const bankWithheldVmc = txns
    .filter(t => t.category === 'Retención ITBMS' && /RETEN\.? SOBRE ITBMS/i.test(t.description))
    .reduce((s, t) => s + Number(t.debit), 0)
  const { data: invRows } = await supabase
    .from('biz_invoices')
    .select('amount,status,file:biz_files!inner(month)')
    .eq('file.month', month)
  const invoicedAuthorized = (invRows ?? []).filter(r => r.status === 'authorized').reduce((s, r) => s + Number(r.amount), 0)
  const yappyFile = (filesRes.data ?? []).find(f => f.doc_type === 'yappy_report')
  const yappyReported = Number((yappyFile?.summary as { total?: number } | null)?.total ?? 0)
  const yappyDeposits = txns
    .filter(t => /DEPOSITO YAPPY/i.test(t.description))
    .reduce((s, t) => s + Number(t.credit), 0)

  const check = (key: string, a: number, b: number, tolerance: number): BizCheck => ({
    key, a: round2(a), b: round2(b), diff: round2(a - b), ok: Math.abs(a - b) <= tolerance,
  })
  const checks: BizCheck[] = []
  if (closeout.length > 0 && mbNet !== null && mbNet > 0) checks.push(check('closeout_vs_mindbody', revenue, mbNet, Math.max(50, revenue * 0.02)))
  if (gcRedeemed > 0 && closeoutMisc > 0) checks.push(check('gc_vs_misc', gcRedeemed, closeoutMisc + gcSoldMisc, gcRedeemed * 0.05))
  if (cardGross > 0 && closeoutCard > 0) checks.push(check('settlement_vs_card', cardGross, closeoutCard, cardGross * 0.1))
  if (invoicedAuthorized > 0 && closeoutTotal > 0) checks.push(check('efactura_vs_closeout', invoicedAuthorized, closeoutTotal - gcRedeemed, closeoutTotal * 0.03))
  if (yappyReported > 0 && yappyDeposits > 0) checks.push(check('yappy_vs_deposits', yappyReported, yappyDeposits, yappyReported * 0.05))
  if (bankWithheldVmc > 0 && settlementWithheld > 0) checks.push(check('itbms_withheld_recon', bankWithheldVmc, settlementWithheld, Math.max(20, bankWithheldVmc * 0.05)))

  return {
    month,
    months,
    files: (filesRes.data ?? []).map(f => ({
      docType: f.doc_type, locationId: f.location_id, filename: f.filename,
      rows: f.rows_imported, status: f.status, uploadedAt: f.uploaded_at,
    })),
    revenue: {
      total: round2(revenue),
      byLocation: Object.fromEntries(Object.entries(revByLoc).map(([k, v]) => [k, round2(v)])),
      itbmsCollected: round2(itbmsCollected),
      budget,
      mbNet,
    },
    expenses: {
      total: round2(totalExpenses),
      byCategory,
      unclassified: round2(catTotals.get('Sin clasificar') ?? 0),
      socioTotal: round2(socioTotal),
    },
    ratios,
    benchmarks: { payroll: [0.40, 0.60], rent: [0.08, 0.15], supplies: [0.08, 0.12], margin: [0.08, 0.15] },
    tips: {
      total: round2(tipsTotal),
      byLocation: Object.fromEntries(Object.entries(tipsByLoc).map(([k, v]) => [k, round2(v)])),
      pctOfCardSales: cardGross > 0 ? tipsTotal / cardGross : null,
    },
    giftCards: { sold: round2(gcSold), redeemed: round2(gcRedeemed), net: round2(gcSold - gcRedeemed) },
    itbms: { collected: round2(itbmsCollected), withheld: round2(withheld), socioCredit: round2(socioCredit), position: round2(position) },
    commissions: {
      bank: round2(bankCommission),
      cardDetail: round2(cardCommission),
      pctOfCardSales: cardGross > 0 ? (bankCommission || cardCommission) / cardGross : null,
    },
    balances,
    checks,
  }
}
