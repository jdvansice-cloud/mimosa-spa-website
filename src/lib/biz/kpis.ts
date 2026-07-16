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
  location: 'all' | 1 | 2
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
    /** Company-wide costs (BAC, Visa, socios) allocated to this location by revenue share. */
    sharedAllocated: number
    revenueShare: number | null
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

export async function getBizKpis(monthParam?: string | null, location: 'all' | 1 | 2 = 'all'): Promise<BizPayload | { months: string[] }> {
  const supabase = serviceClient()

  const { data: monthRows } = await supabase
    .from('biz_files')
    .select('month,doc_type')
    .order('month', { ascending: false })
  const months = [...new Set((monthRows ?? []).map(r => r.month as string))]
  // months with revenue data — a stray statement (e.g. a Visa cycle crossing
  // months) shouldn't count as an "imported month" for the YTD budget
  const closeoutMonths = new Set((monthRows ?? []).filter(r => r.doc_type === 'mb_closeout').map(r => r.month as string))
  if (months.length === 0) return { months: [] }
  // 'ytd' aggregates every imported month of the latest year
  const isYtd = monthParam === 'ytd'
  const month = !isYtd && monthParam && months.includes(monthParam) ? monthParam : months[0]
  const rangeStart = isYtd ? `${month.slice(0, 4)}-01-01` : month
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
        .gte('txn_date', rangeStart).lt('txn_date', monthEnd)
        .order('id', { ascending: true }).range(from, to) as unknown as PromiseLike<{ data: TxnRow[] | null; error: { message: string } | null }>
    ),
    fetchAll<{ location_id: number | null; gross: number; consumo: number; tip: number; itbms_withheld: number; commission: number; commission_itbms: number }>((from, to) =>
      supabase
        .from('biz_card_settlements')
        .select('location_id,gross,consumo,tip,itbms_withheld,commission,commission_itbms')
        .gte('txn_date', rangeStart).lt('txn_date', monthEnd)
        .order('id', { ascending: true }).range(from, to) as unknown as PromiseLike<{ data: never[] | null; error: { message: string } | null }>
    ),
    fetchAll<{ doc_type: string; location_id: number; sale_date: string; cash: number; card: number; misc: number; subtotal: number | null; itbms: number | null; total: number }>((from, to) =>
      supabase
        .from('biz_daily_sales')
        .select('doc_type,location_id,sale_date,cash,card,misc,subtotal,itbms,total')
        .gte('sale_date', rangeStart).lt('sale_date', monthEnd)
        .order('id', { ascending: true }).range(from, to) as unknown as PromiseLike<{ data: never[] | null; error: { message: string } | null }>
    ),
    fetchAll<{ vendor: string; description: string | null; amount: number; itbms: number; total: number }>((from, to) =>
      supabase
        .from('biz_socio_expenses')
        .select('vendor,description,amount,itbms,total,file:biz_files!inner(month)')
        .gte('file.month', rangeStart).lte('file.month', month)
        .order('id', { ascending: true }).range(from, to) as unknown as PromiseLike<{ data: never[] | null; error: { message: string } | null }>
    ),
  ])

  // ---- revenue (Mindbody closeout: SUBTOTAL = net of ITBMS; GC sales excluded = liability)
  const closeoutAll = daily.filter(d => d.doc_type === 'mb_closeout')
  const revByLoc: Record<string, number> = {}
  let revenueAll = 0
  for (const d of closeoutAll) {
    const net = Number(d.subtotal ?? 0)
    revenueAll += net
    revByLoc[d.location_id] = (revByLoc[d.location_id] ?? 0) + net
  }
  // Location slice. `share` = this location's revenue share, used to allocate
  // company-wide costs (BAC, Visa, partner-paid) when a location is selected.
  const dailyLoc = location === 'all' ? daily : daily.filter(d => d.location_id === location)
  const closeout = location === 'all' ? closeoutAll : closeoutAll.filter(d => d.location_id === location)
  const revenue = location === 'all' ? revenueAll : (revByLoc[location] ?? 0)
  const share = location === 'all' ? 1 : revenueAll > 0 ? revenue / revenueAll : 0
  const itbmsCollected = closeout.reduce((s, d) => s + Number(d.itbms ?? 0), 0)
  const year = Number(month.slice(0, 4))
  const mIdx = Number(month.slice(5, 7)) - 1
  const budgets = MONTHLY_BUDGETS[year]
  // YTD budget covers only the months actually imported this year, so the
  // % of budget stays honest until older packets are backfilled
  const monthIdxs = isYtd
    ? [...closeoutMonths].filter(m => m.startsWith(`${year}-`)).map(m => Number(m.slice(5, 7)) - 1)
    : [mIdx]
  const budgetFor = (loc: 1 | 2) => monthIdxs.reduce((s, i) => s + (budgets?.[loc]?.[i] ?? 0), 0)
  const budget = budgets
    ? location === 'all'
      ? budgetFor(1) + budgetFor(2)
      : budgetFor(location)
    : null

  // Mindbody-synced accrual net for the same month (cross-check).
  // Gift-card SALES are excluded: the closeout treats them as a liability,
  // not revenue, so the comparable Mindbody number is services + retail.
  let mbQ = supabase
    .from('kpi_daily_sales')
    .select('net,bucket')
    .gte('sale_date', rangeStart).lt('sale_date', monthEnd)
    .neq('bucket', 'giftcard')
  if (location !== 'all') mbQ = mbQ.eq('location_id', location)
  const { data: mbRows } = await mbQ
  const mbNet = mbRows ? round2(mbRows.reduce((s, r) => s + Number(r.net ?? 0), 0)) : null

  // ---- expenses (bank debits + partner-paid), internal & tax-withholding excluded
  const catTotals = new Map<string, number>()
  const addExpense = (category: string, amount: number) => {
    if (amount <= 0 || INTERNAL_CATEGORIES.has(category) || category === 'Retención ITBMS') return
    catTotals.set(category, (catTotals.get(category) ?? 0) + amount)
  }
  // Direct costs carry this location's tag (BG/SG accounts, Visa rows whose
  // note names a location). Untagged rows (BAC, generic Visa) + partner-paid
  // expenses are shared: allocated by revenue share when a location is selected.
  const txnsDirect = location === 'all' ? txns : txns.filter(t => t.location_id === location)
  const txnsShared = location === 'all' ? [] : txns.filter(t => t.location_id === null)
  let sharedAllocated = 0
  const addShared = (category: string, amount: number) => {
    const portion = amount * share
    if (portion <= 0 || INTERNAL_CATEGORIES.has(category) || category === 'Retención ITBMS') return
    sharedAllocated += portion
    catTotals.set(category, (catTotals.get(category) ?? 0) + portion)
  }
  for (const t of txnsDirect) if (t.debit > 0) addExpense(t.category ?? 'Sin clasificar', Number(t.debit))
  for (const t of txnsShared) if (t.debit > 0) addShared(t.category ?? 'Sin clasificar', Number(t.debit))
  let socioTotal = 0
  for (const sx of socios) {
    socioTotal += Number(sx.total) * share
    addShared(classifyExpense(`${sx.vendor} ${sx.description ?? ''}`), Number(sx.total))
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
  const settlementsLoc = location === 'all' ? settlements : settlements.filter(st => st.location_id === location)
  const tipsByLoc: Record<string, number> = {}
  let tipsTotal = 0, cardGross = 0, cardCommission = 0, settlementWithheld = 0
  for (const st of settlementsLoc) {
    tipsTotal += Number(st.tip)
    cardGross += Number(st.gross)
    cardCommission += Number(st.commission) + Number(st.commission_itbms)
    settlementWithheld += Number(st.itbms_withheld)
    const k = String(st.location_id ?? 0)
    tipsByLoc[k] = (tipsByLoc[k] ?? 0) + Number(st.tip)
  }

  // ---- gift cards (sold = liability in, redeemed = liability out)
  const gcSold = dailyLoc.filter(d => d.doc_type === 'gc_sold').reduce((s, d) => s + Number(d.total), 0)
  const gcRedeemed = dailyLoc.filter(d => d.doc_type === 'gc_redeemed').reduce((s, d) => s + Number(d.total), 0)

  // ---- ITBMS position: collected − withheld by acquirer − credit on purchases
  const bankWithheld = txnsDirect.filter(t => t.category === 'Retención ITBMS').reduce((s, t) => s + Number(t.debit), 0)
  const withheld = bankWithheld > 0 ? bankWithheld : settlementWithheld
  const socioCredit = socios.reduce((s, x) => s + Number(x.itbms), 0) * share
  const position = itbmsCollected - withheld - socioCredit

  // ---- commissions
  const bankCommission = catTotals.get('Comisiones bancarias') ?? 0

  // ---- end-of-month balances per account
  const balances: Array<{ accountKey: string; balance: number; date: string }> = []
  const byAccount = new Map<string, TxnRow[]>()
  for (const t of txnsDirect) {
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
  const gcSoldMisc = dailyLoc.filter(d => d.doc_type === 'gc_sold').reduce((s, d) => s + Number(d.misc), 0)
  // V/MC-only withholding on the statement (RETENCION CLAVE settles separately)
  const bankWithheldVmc = txnsDirect
    .filter(t => t.category === 'Retención ITBMS' && /RETEN\.? SOBRE ITBMS/i.test(t.description))
    .reduce((s, t) => s + Number(t.debit), 0)
  let invQ = supabase
    .from('biz_invoices')
    .select('amount,status,file:biz_files!inner(month)')
    .gte('file.month', rangeStart).lte('file.month', month)
  if (location !== 'all') invQ = invQ.eq('location_id', location)
  const { data: invRows } = await invQ
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
  // per-location tolerance is wider: clients book/redeem across locations
  if (closeout.length > 0 && mbNet !== null && mbNet > 0) checks.push(check('closeout_vs_mindbody', revenue, mbNet, Math.max(50, revenue * (location === 'all' ? 0.02 : 0.04))))
  // gift cards travel between locations — these two only reconcile company-wide
  if (location === 'all' && gcRedeemed > 0 && closeoutMisc > 0) checks.push(check('gc_vs_misc', gcRedeemed, closeoutMisc + gcSoldMisc, gcRedeemed * 0.05))
  if (cardGross > 0 && closeoutCard > 0) checks.push(check('settlement_vs_card', cardGross, closeoutCard, cardGross * 0.1))
  if (location === 'all' && invoicedAuthorized > 0 && closeoutTotal > 0) checks.push(check('efactura_vs_closeout', invoicedAuthorized, closeoutTotal - gcRedeemed, closeoutTotal * 0.03))
  // the Yappy report is company-wide — only meaningful without a location filter
  if (location === 'all' && yappyReported > 0 && yappyDeposits > 0) checks.push(check('yappy_vs_deposits', yappyReported, yappyDeposits, yappyReported * 0.05))
  if (bankWithheldVmc > 0 && settlementWithheld > 0) checks.push(check('itbms_withheld_recon', bankWithheldVmc, settlementWithheld, Math.max(20, bankWithheldVmc * 0.05)))

  return {
    month: isYtd ? 'ytd' : month,
    location,
    months,
    files: (filesRes.data ?? []).map(f => ({
      docType: f.doc_type, locationId: f.location_id, filename: f.filename,
      rows: f.rows_imported, status: f.status, uploadedAt: f.uploaded_at,
    })),
    revenue: {
      total: round2(revenue),
      byLocation: Object.fromEntries(
        Object.entries(revByLoc)
          .filter(([k]) => location === 'all' || Number(k) === location)
          .map(([k, v]) => [k, round2(v)])
      ),
      itbmsCollected: round2(itbmsCollected),
      budget,
      mbNet,
    },
    expenses: {
      total: round2(totalExpenses),
      byCategory,
      unclassified: round2(catTotals.get('Sin clasificar') ?? 0),
      socioTotal: round2(socioTotal),
      sharedAllocated: location === 'all' ? 0 : round2(sharedAllocated),
      revenueShare: location === 'all' ? null : share,
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
