import { createClient } from '@supabase/supabase-js'
import { LOCATION_IDS, LOCATION_MANAGERS, LOCATION_NAMES, MONTHLY_BUDGETS, PANAMA_TZ } from './constants'
import { addDays, panamaToday } from './sync'

// ===========================================
// KPI aggregation for the /admin/kpis dashboard.
// All money figures are net of ITBMS (per-item tax split out at sync time),
// tips excluded, returned items excluded.
// Periods: today | mtd (month to date) | ytd (year to date).
// Every metric is compared against the same period last year, and the
// monthly drill-downs compare the current year against the previous year.
// Bulk history comes from the kpi_daily_* SQL views (migration 20260707);
// raw rows are only fetched for the current period (staff attribution,
// top services) and small cohort windows.
// ===========================================

export type KpiPeriod = 'today' | 'mtd' | 'lastmonth' | 'ytd'
export type KpiLocation = 'all' | 1 | 2

export interface KpiSeries {
  unit: 'hour' | 'day' | 'month'
  labels: string[]
  /** Selected period, this year. null = bucket not reached yet. */
  current: Array<number | null>
  /** Same period last year. */
  previous: Array<number | null>
}

export interface KpiMonthlySeries {
  cur: Array<number | null> // Jan..Dec of current year; null = future month
  prev: Array<number | null> // Jan..Dec of previous year
}

export interface KpiPayload {
  period: KpiPeriod
  location: KpiLocation
  /** Last complete day included — the dashboard never counts today's partial data. */
  asOf: string
  range: { start: string; end: string }
  lyRange: { start: string; end: string }
  updatedAt: string | null
  sales: {
    net: number
    lyNet: number
    /** Full previous period (complete LY month for mtd, complete LY year for ytd) — the "goal". */
    lyPeriodTotal: number | null
    saleCount: number
    avgTicket: number
    lyAvgTicket: number
    mix: { service: number; retail: number; giftcard: number }
    series: KpiSeries
  }
  visits: { count: number; lyCount: number }
  newClients: { count: number; lyCount: number }
  /** Full previous period per metric (complete LY month/year) — null for already-complete periods. */
  goals: {
    net: number
    avgTicket: number
    visits: number
    newClients: number
    noShowRate: number
  } | null
  monthly: {
    labels: string[]
    curYear: number
    prevYear: number
    net: KpiMonthlySeries
    avgTicket: KpiMonthlySeries
    visits: KpiMonthlySeries
    newClients: KpiMonthlySeries
    noShowRate: KpiMonthlySeries
  }
  retention: {
    cohortMonth: string
    cohortSize: number
    returned: number
    rate: number | null
    lyCohortSize: number
    lyReturned: number
    lyRate: number | null
  }
  prebooked: { clientsSeen: number; withNext: number; rate: number | null }
  noShow: { count: number; rate: number | null; lyRate: number | null }
  /** Ownership budget for the selected scope/period (null in gc mode or years without a budget). */
  budget: {
    year: number
    annual: number
    /** Ownership's month budget (mtd/lastmonth) or the annual budget (ytd). */
    periodTarget: number
    /** Where sales should be by asOf at budget pace (null for complete periods). */
    expectedToDate: number | null
    perLocation: Array<{ locationId: number; name: string; manager: string; annual: number; netYtd: number }> | null
  } | null
  topServices: Array<{ name: string; net: number; count: number }>
  /** Top 25 spenders in the period (UI shows 10, expandable). */
  topClients: Array<{ name: string; visits: number; net: number }>
  staff: Array<{ name: string; visits: number; hours: number; net: number }>
  locationSplit: Array<{ locationId: number; name: string; net: number; sharePct: number }> | null
}

export const MONTH_LABELS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

interface ItemRow {
  sale_id: number
  description: string | null
  bucket: string
  net_amount: number
  returned: boolean
  quantity: number
  sale: {
    sale_date: string
    sale_datetime: string
    location_id: number
    client_id: string | null
    gc_paid: number | null
    comp_paid: number | null
    total_paid: number | null
  }
}

/**
 * Money basis per sale: 'cash' = share NOT paid with gift card (money received
 * at the register), 'gc' = share paid WITH a gift card (redemptions).
 * Sales synced before payments existed have total_paid null → all cash.
 */
export type MoneyMode = 'cash' | 'gc'

/**
 * Per-sale money factors. Tips are part of total_paid but not of the items,
 * so they're excluded from the denominator (matches Mindbody's report exactly).
 * Tip line items are tax-free, so net_amount == their gross.
 */
function buildSaleFactors(items: ItemRow[], mode: MoneyMode): Map<number, number> {
  const tips = new Map<number, number>()
  const sales = new Map<number, ItemRow['sale']>()
  for (const it of items) {
    sales.set(it.sale_id, it.sale)
    if (it.bucket === 'tip' && !it.returned) {
      tips.set(it.sale_id, (tips.get(it.sale_id) ?? 0) + (Number(it.net_amount) || 0))
    }
  }
  const out = new Map<number, number>()
  for (const [id, sale] of sales) {
    const total = Number(sale.total_paid) || 0
    const denom = total - (tips.get(id) ?? 0)
    let f: number
    if (total <= 0) f = mode === 'cash' ? 1 : 0
    else if (denom <= 0) f = 0
    else {
      const gc = Math.min(1, Math.max(0, (Number(sale.gc_paid) || 0) / denom))
      if (mode === 'gc') f = gc
      else {
        const comp = Math.min(1, Math.max(0, (Number(sale.comp_paid) || 0) / denom))
        f = Math.max(0, 1 - gc - comp)
      }
    }
    out.set(id, f)
  }
  return out
}

interface ApptRow {
  id: number
  start_datetime: string
  duration_min: number | null
  status: string
  location_id: number
  staff_id: number | null
  staff_name: string | null
  client_id: string | null
  first_appointment: boolean
}

export interface DailySaleRow { sale_date: string; location_id: number; bucket: string; net: number }
export interface DailyCountRow { sale_date: string; location_id: number; sale_count: number }
export interface DailyApptRow { day: string; location_id: number; visits: number; missed: number; new_clients: number }

const CANCELLED_STATUSES = new Set(['Cancelled', 'LateCancelled', 'NoShow'])
const MISSED_STATUSES = new Set(['NoShow', 'LateCancelled'])

export function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
export type Supabase = ReturnType<typeof serviceClient>

export function minusOneYear(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(Date.UTC(y - 1, m - 1, d)).toISOString().slice(0, 10)
}

function daysInMonth(year: number, month1: number): number {
  return new Date(Date.UTC(year, month1, 0)).getUTCDate()
}

function lastDayOfMonth(year: number, month1: number): string {
  return new Date(Date.UTC(year, month1, 0)).toISOString().slice(0, 10)
}

function panamaNowStamp(): string {
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: PANAMA_TZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).format(new Date())
  return `${panamaToday()}T${time}`
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function rangeFor(period: KpiPeriod, today: string): { start: string; end: string } {
  switch (period) {
    case 'today': return { start: today, end: today }
    case 'mtd': return { start: `${today.slice(0, 7)}-01`, end: today }
    case 'lastmonth': {
      const [y, m] = today.split('-').map(Number)
      const py = m === 1 ? y - 1 : y
      const pm = m === 1 ? 12 : m - 1
      return { start: `${py}-${String(pm).padStart(2, '0')}-01`, end: lastDayOfMonth(py, pm) }
    }
    case 'ytd': return { start: `${today.slice(0, 4)}-01-01`, end: today }
  }
}

/** Latest full month whose 90-day return window has already closed. */
function cohortMonthFor(today: string): { start: string; end: string; label: string } {
  const [y, m] = today.split('-').map(Number)
  for (let back = 3; back <= 12; back++) {
    const dt = new Date(Date.UTC(y, m - 1 - back, 1))
    const cy = dt.getUTCFullYear()
    const cm = dt.getUTCMonth() + 1
    const end = lastDayOfMonth(cy, cm)
    if (addDays(end, 90) <= today) {
      return { start: `${cy}-${String(cm).padStart(2, '0')}-01`, end, label: `${cy}-${String(cm).padStart(2, '0')}` }
    }
  }
  const fallback = `${y - 1}-${String(m).padStart(2, '0')}`
  return { start: `${fallback}-01`, end: lastDayOfMonth(y - 1, m), label: fallback }
}

// Paged fetch — supabase caps responses at 1000 rows per request.
export async function fetchAll<T>(build: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const PAGE = 1000
  const all: T[] = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await build(from, from + PAGE - 1)
    if (error) throw new Error(error.message)
    const rows = data ?? []
    all.push(...rows)
    if (rows.length < PAGE) break
  }
  return all
}

async function fetchItems(supabase: Supabase, start: string, end: string, location: KpiLocation): Promise<ItemRow[]> {
  // NB: deterministic .order() is required — PostgREST pagination without it
  // returns unstable row order and pages can miss/duplicate rows.
  return fetchAll<ItemRow>((from, to) => {
    let q = supabase
      .from('mb_sale_items')
      .select('sale_id,line_no,description,bucket,net_amount,returned,quantity,sale:mb_sales!inner(sale_date,sale_datetime,location_id,client_id,gc_paid,comp_paid,total_paid)')
      .gte('sale.sale_date', start)
      .lte('sale.sale_date', end)
    if (location !== 'all') q = q.eq('sale.location_id', location)
    return q
      .order('sale_id', { ascending: true })
      .order('line_no', { ascending: true })
      .range(from, to) as unknown as PromiseLike<{ data: ItemRow[] | null; error: { message: string } | null }>
  })
}

async function fetchAppts(
  supabase: Supabase,
  startStamp: string,
  endStamp: string,
  location: KpiLocation
): Promise<ApptRow[]> {
  return fetchAll<ApptRow>((from, to) => {
    let q = supabase
      .from('mb_appointments')
      .select('id,start_datetime,duration_min,status,location_id,staff_id,staff_name,client_id,first_appointment')
      .gte('start_datetime', startStamp)
      .lte('start_datetime', endStamp)
    if (location !== 'all') q = q.eq('location_id', location)
    return q.order('id', { ascending: true }).range(from, to) as unknown as PromiseLike<{ data: ApptRow[] | null; error: { message: string } | null }>
  })
}

export function fetchDaily<T>(supabase: Supabase, view: string, dateCol: string, start: string, end: string, location: KpiLocation): Promise<T[]> {
  // Deterministic ordering — without it PostgREST pages over a grouped view
  // come back in unstable order and rows get lost/duplicated across pages.
  const orderCols = view === 'kpi_daily_sales' || view === 'kpi_daily_sales_cash'
    ? [dateCol, 'location_id', 'bucket']
    : [dateCol, 'location_id']
  return fetchAll<T>((from, to) => {
    let q = supabase.from(view).select('*').gte(dateCol, start).lte(dateCol, end)
    if (location !== 'all') q = q.eq('location_id', location)
    for (const col of orderCols) q = q.order(col, { ascending: true })
    return q.range(from, to) as unknown as PromiseLike<{ data: T[] | null; error: { message: string } | null }>
  })
}

// ---------- aggregation helpers over view rows ----------

const inRange = (d: string, r: { start: string; end: string }) => d >= r.start && d <= r.end

function sumSales(rows: DailySaleRow[], r: { start: string; end: string }): number {
  let net = 0
  for (const row of rows) if (inRange(row.sale_date, r)) net += Number(row.net)
  return net
}

function sumCounts(rows: DailyCountRow[], r: { start: string; end: string }): number {
  let n = 0
  for (const row of rows) if (inRange(row.sale_date, r)) n += row.sale_count
  return n
}

/** month index 0-11 for a YYYY-MM-DD in the given year, or -1. */
function monthIdx(date: string, year: number): number {
  return Number(date.slice(0, 4)) === year ? Number(date.slice(5, 7)) - 1 : -1
}

function nullFuture(arr: number[], lastValidIdx: number): Array<number | null> {
  return arr.map((v, i) => (i > lastValidIdx ? null : v))
}

// ---------- current-period aggregation over raw rows ----------

interface SalesAgg {
  net: number
  saleCount: number
  mixNet: { service: number; retail: number; giftcard: number }
  byHour: Map<number, number>
  byClient: Map<string, number>
  serviceByName: Map<string, { net: number; count: number }>
  serviceByClientDate: Map<string, number>
}

function aggregateSales(items: ItemRow[], mode: MoneyMode = 'cash'): SalesAgg {
  const agg: SalesAgg = {
    net: 0, saleCount: 0,
    mixNet: { service: 0, retail: 0, giftcard: 0 },
    byHour: new Map(), byClient: new Map(),
    serviceByName: new Map(), serviceByClientDate: new Map(),
  }
  const factors = buildSaleFactors(items, mode)
  const saleIds = new Set<number>()
  for (const it of items) {
    if (it.returned || it.bucket === 'tip') continue
    const factor = factors.get(it.sale_id) ?? (mode === 'cash' ? 1 : 0)
    if (factor <= 0) continue
    const net = (Number(it.net_amount) || 0) * factor
    agg.net += net
    saleIds.add(it.sale_id)
    if (it.bucket === 'service' || it.bucket === 'retail' || it.bucket === 'giftcard') {
      agg.mixNet[it.bucket] += net
    }
    const hour = Number(it.sale.sale_datetime.slice(11, 13))
    agg.byHour.set(hour, (agg.byHour.get(hour) ?? 0) + net)
    if (it.sale.client_id) {
      agg.byClient.set(it.sale.client_id, (agg.byClient.get(it.sale.client_id) ?? 0) + net)
    }
    if (it.bucket === 'service') {
      const name = (it.description || 'Servicio').trim()
      const cur = agg.serviceByName.get(name) ?? { net: 0, count: 0 }
      cur.net += net
      cur.count += Number(it.quantity) || 1
      agg.serviceByName.set(name, cur)
      if (it.sale.client_id) {
        const key = `${it.sale.client_id}|${it.sale.sale_date}|${it.sale.location_id}`
        agg.serviceByClientDate.set(key, (agg.serviceByClientDate.get(key) ?? 0) + net)
      }
    }
  }
  agg.saleCount = saleIds.size
  return agg
}

function visitStats(appts: ApptRow[]) {
  const visits = appts.filter(a => !CANCELLED_STATUSES.has(a.status))
  const missed = appts.filter(a => MISSED_STATUSES.has(a.status)).length
  const attempted = visits.length + missed
  const newClientIds = new Set(
    visits.filter(a => a.first_appointment && a.client_id).map(a => a.client_id as string)
  )
  return {
    visits,
    visitCount: visits.length,
    missed,
    noShowRate: attempted > 0 ? missed / attempted : null,
    newClients: newClientIds.size,
  }
}

function cohortStats(cohortAppts: ApptRow[], windowAppts: ApptRow[]) {
  const firstByClient = new Map<string, string>()
  for (const a of cohortAppts) {
    if (CANCELLED_STATUSES.has(a.status) || !a.first_appointment || !a.client_id) continue
    const prev = firstByClient.get(a.client_id)
    if (!prev || a.start_datetime < prev) firstByClient.set(a.client_id, a.start_datetime)
  }
  let returned = 0
  for (const [clientId, firstStamp] of firstByClient) {
    const deadline = addDays(firstStamp.slice(0, 10), 90)
    const cameBack = windowAppts.some(a =>
      a.client_id === clientId &&
      !CANCELLED_STATUSES.has(a.status) &&
      a.start_datetime > firstStamp &&
      a.start_datetime.slice(0, 10) <= deadline
    )
    if (cameBack) returned++
  }
  const size = firstByClient.size
  return { size, returned, rate: size > 0 ? returned / size : null }
}

// ---------- series builders ----------

function hourlySeries(cur: SalesAgg, lyItems: ItemRow[], nowHour: number, mode: MoneyMode): KpiSeries {
  const HOURS = Array.from({ length: 15 }, (_, i) => 7 + i) // 7:00 – 21:00
  const lyByHour = new Map<number, number>()
  const lyFactors = buildSaleFactors(lyItems, mode)
  for (const it of lyItems) {
    if (it.returned || it.bucket === 'tip') continue
    const factor = lyFactors.get(it.sale_id) ?? (mode === 'cash' ? 1 : 0)
    if (factor <= 0) continue
    const h = Number(it.sale.sale_datetime.slice(11, 13))
    lyByHour.set(h, (lyByHour.get(h) ?? 0) + (Number(it.net_amount) || 0) * factor)
  }
  return {
    unit: 'hour',
    labels: HOURS.map(h => `${h}:00`),
    current: HOURS.map(h => (h > nowHour ? null : round2(cur.byHour.get(h) ?? 0))),
    previous: HOURS.map(h => round2(lyByHour.get(h) ?? 0)),
  }
}

function dailySeries(
  salesDaily: DailySaleRow[],
  range: { start: string; end: string },
  lyRange: { start: string; end: string },
  today: string
): KpiSeries {
  const [y, m] = range.start.split('-').map(Number)
  const [ly, lm] = lyRange.start.split('-').map(Number)
  const nDays = Math.max(daysInMonth(y, m), daysInMonth(ly, lm))
  const cur = new Array<number>(nDays).fill(0)
  const prev = new Array<number>(nDays).fill(0)
  const curPrefix = range.start.slice(0, 8)
  const prevPrefix = lyRange.start.slice(0, 8)
  for (const row of salesDaily) {
    if (row.sale_date.startsWith(curPrefix)) cur[Number(row.sale_date.slice(8, 10)) - 1] += Number(row.net)
    else if (row.sale_date.startsWith(prevPrefix)) prev[Number(row.sale_date.slice(8, 10)) - 1] += Number(row.net)
  }
  // Only cut the current line short when charting the in-progress month
  const isCurrentMonth = range.start.slice(0, 7) === today.slice(0, 7)
  const todayDay = isCurrentMonth ? Number(today.slice(8, 10)) - 1 : Infinity
  const lyDays = daysInMonth(ly, lm)
  return {
    unit: 'day',
    labels: Array.from({ length: nDays }, (_, i) => String(i + 1)),
    current: cur.map((v, i) => (i > todayDay || i >= daysInMonth(y, m) ? null : round2(v))),
    previous: prev.map((v, i) => (i >= lyDays ? null : round2(v))),
  }
}

interface GcUsageRow { sale_date: string; location_id: number; net: number; tx_count: number }

export async function getKpis(period: KpiPeriod, location: KpiLocation, gcMode = false): Promise<KpiPayload> {
  const supabase = serviceClient()
  const mode: MoneyMode = gcMode ? 'gc' : 'cash'
  // Complete days only: everything is calculated through yesterday, so a
  // half-elapsed day never distorts totals or YoY comparisons.
  const asOf = addDays(panamaToday(), -1)
  const curYear = Number(asOf.slice(0, 4))
  const prevYear = curYear - 1
  const curMonthIdx = Number(asOf.slice(5, 7)) - 1
  const range = rangeFor(period, asOf)
  const lyRange = { start: minusOneYear(range.start), end: minusOneYear(range.end) }
  const cohort = cohortMonthFor(asOf)
  const lyCohort = { start: minusOneYear(cohort.start), end: minusOneYear(cohort.end) }
  const nowStamp = panamaNowStamp()
  // lyRange can reach before Jan 1 of the previous year (e.g. "last month"
  // in January compares against December two calendar years back).
  const defaultViewStart = `${prevYear}-01-01`
  const viewStart = lyRange.start < defaultViewStart ? lyRange.start : defaultViewStart

  const noAppts = Promise.resolve([] as ApptRow[])
  const [
    curItems, lyDayItems,
    salesDailyRaw, countsDailyRaw, apptsDaily,
    curAppts, futureAppts,
    cohortWindowAppts, lyCohortWindowAppts,
    syncState,
  ] = await Promise.all([
    fetchItems(supabase, range.start, range.end, location),
    period === 'today' ? fetchItems(supabase, lyRange.start, lyRange.end, location) : Promise.resolve([] as ItemRow[]),
    gcMode
      ? fetchDaily<GcUsageRow>(supabase, 'kpi_daily_gc_usage', 'sale_date', viewStart, asOf, location)
      : fetchDaily<DailySaleRow>(supabase, 'kpi_daily_sales_cash', 'sale_date', viewStart, asOf, location),
    gcMode
      ? Promise.resolve([] as DailyCountRow[])
      : fetchDaily<DailyCountRow>(supabase, 'kpi_daily_sale_counts', 'sale_date', viewStart, asOf, location),
    fetchDaily<DailyApptRow>(supabase, 'kpi_daily_appointments', 'day', viewStart, asOf, location),
    // Appointment-based metrics don't apply to the gift-card view
    gcMode ? noAppts : fetchAppts(supabase, `${range.start}T00:00:00`, `${range.end}T23:59:59`, location),
    gcMode ? noAppts : fetchAppts(supabase, nowStamp, `${addDays(asOf, 91)}T23:59:59`, location),
    gcMode ? noAppts : fetchAppts(supabase, `${cohort.start}T00:00:00`, `${addDays(cohort.end, 91)}T23:59:59`, location),
    gcMode ? noAppts : fetchAppts(supabase, `${lyCohort.start}T00:00:00`, `${addDays(lyCohort.end, 91)}T23:59:59`, location),
    supabase.from('kpi_sync_state').select('updated_at').eq('key', 'sales_last_sync').maybeSingle(),
  ])

  // In gc mode the usage view feeds both the "sales" and "counts" roles;
  // rows carry a synthetic bucket so downstream grouping still works.
  const salesDaily: DailySaleRow[] = gcMode
    ? (salesDailyRaw as GcUsageRow[]).map(r => ({ sale_date: r.sale_date, location_id: r.location_id, bucket: 'service', net: r.net }))
    : (salesDailyRaw as DailySaleRow[])
  const countsDaily: DailyCountRow[] = gcMode
    ? (salesDailyRaw as GcUsageRow[]).map(r => ({ sale_date: r.sale_date, location_id: r.location_id, sale_count: r.tx_count }))
    : countsDailyRaw

  const cur = aggregateSales(curItems, mode)
  const curVisits = visitStats(curAppts)

  // ---- last-year figures from the daily views ----
  const lyNet = sumSales(salesDaily, lyRange)
  const lySaleCount = sumCounts(countsDaily, lyRange)
  let lyVisitCount = 0, lyMissed = 0, lyNew = 0
  for (const row of apptsDaily) {
    if (inRange(row.day, lyRange)) {
      lyVisitCount += row.visits
      lyMissed += row.missed
      lyNew += row.new_clients
    }
  }
  const lyAttempted = lyVisitCount + lyMissed

  // ---- monthly drill-down series (Jan..Dec, current vs previous year) ----
  const mk = () => ({ cur: new Array<number>(12).fill(0), prev: new Array<number>(12).fill(0) })
  const mNet = mk(), mCount = mk(), mVisits = mk(), mMissed = mk(), mNew = mk()
  for (const row of salesDaily) {
    let i = monthIdx(row.sale_date, curYear)
    if (i >= 0) mNet.cur[i] += Number(row.net)
    i = monthIdx(row.sale_date, prevYear)
    if (i >= 0) mNet.prev[i] += Number(row.net)
  }
  for (const row of countsDaily) {
    let i = monthIdx(row.sale_date, curYear)
    if (i >= 0) mCount.cur[i] += row.sale_count
    i = monthIdx(row.sale_date, prevYear)
    if (i >= 0) mCount.prev[i] += row.sale_count
  }
  for (const row of apptsDaily) {
    for (const [year, side] of [[curYear, 'cur'], [prevYear, 'prev']] as const) {
      const i = monthIdx(row.day, year)
      if (i < 0) continue
      mVisits[side][i] += row.visits
      mMissed[side][i] += row.missed
      mNew[side][i] += row.new_clients
    }
  }
  const ticketOf = (net: number[], count: number[]) => net.map((n, i) => (count[i] > 0 ? round2(n / count[i]) : 0))
  const rateOf = (missed: number[], visits: number[]) =>
    missed.map((mi, i) => (mi + visits[i] > 0 ? round2((100 * mi) / (mi + visits[i])) / 100 : 0))

  const monthly = {
    labels: MONTH_LABELS_ES,
    curYear,
    prevYear,
    net: { cur: nullFuture(mNet.cur.map(round2), curMonthIdx), prev: mNet.prev.map(round2) },
    avgTicket: { cur: nullFuture(ticketOf(mNet.cur, mCount.cur), curMonthIdx), prev: ticketOf(mNet.prev, mCount.prev) },
    visits: { cur: nullFuture(mVisits.cur, curMonthIdx), prev: mVisits.prev.map(v => v) },
    newClients: { cur: nullFuture(mNew.cur, curMonthIdx), prev: mNew.prev.map(v => v) },
    noShowRate: { cur: nullFuture(rateOf(mMissed.cur, mVisits.cur), curMonthIdx), prev: rateOf(mMissed.prev, mVisits.prev) },
  }

  // Full previous period as the "goal" (only meaningful for to-date periods)
  let goals: KpiPayload['goals'] = null
  if (period === 'mtd' || period === 'ytd') {
    const pick = (arr: number[]) =>
      period === 'mtd' ? arr[curMonthIdx] ?? 0 : arr.reduce((s, v) => s + v, 0)
    const gNet = pick(mNet.prev)
    const gCount = pick(mCount.prev)
    const gVisits = pick(mVisits.prev)
    const gMissed = pick(mMissed.prev)
    goals = {
      net: round2(gNet),
      avgTicket: gCount > 0 ? round2(gNet / gCount) : 0,
      visits: gVisits,
      newClients: pick(mNew.prev),
      noShowRate: gVisits + gMissed > 0 ? gMissed / (gVisits + gMissed) : 0,
    }
  }
  const lyPeriodTotal = goals?.net ?? null

  // ---- ownership budget vs actuals (real monthly budgets per location) ----
  const budgetMap = MONTHLY_BUDGETS[curYear]
  let budget: KpiPayload['budget'] = null
  if (budgetMap && !gcMode) {
    const locIds = location === 'all' ? [...LOCATION_IDS] : [location]
    const monthBudget = (i: number) => locIds.reduce((sum, id) => sum + (budgetMap[id]?.[i] ?? 0), 0)
    const annual = Array.from({ length: 12 }, (_, i) => monthBudget(i)).reduce((a, b) => a + b, 0)
    const dayOfMonth = Number(asOf.slice(8, 10))
    const dim = daysInMonth(curYear, curMonthIdx + 1)

    let periodTarget: number | null = null
    let expectedToDate: number | null = null
    if (period === 'mtd') {
      periodTarget = monthBudget(curMonthIdx)
      expectedToDate = periodTarget * (dayOfMonth / dim)
    } else if (period === 'lastmonth' && Number(range.start.slice(0, 4)) === curYear) {
      periodTarget = monthBudget(Number(range.start.slice(5, 7)) - 1)
    } else if (period === 'ytd') {
      periodTarget = annual
      let cum = 0
      for (let i = 0; i < curMonthIdx; i++) cum += monthBudget(i)
      cum += monthBudget(curMonthIdx) * (dayOfMonth / dim)
      expectedToDate = cum
    }

    if (periodTarget !== null && annual > 0) {
      // YTD net per location for the split card (from the daily cash view)
      let perLocation: NonNullable<KpiPayload['budget']>['perLocation'] = null
      if (location === 'all') {
        const ytdByLoc = new Map<number, number>()
        for (const row of salesDaily) {
          if (row.sale_date >= `${curYear}-01-01`) {
            ytdByLoc.set(row.location_id, (ytdByLoc.get(row.location_id) ?? 0) + Number(row.net))
          }
        }
        perLocation = [...LOCATION_IDS].map(id => ({
          locationId: id,
          name: LOCATION_NAMES[id],
          manager: LOCATION_MANAGERS[id],
          annual: (budgetMap[id] ?? []).reduce((a, b) => a + b, 0),
          netYtd: round2(ytdByLoc.get(id) ?? 0),
        }))
      }
      budget = {
        year: curYear,
        annual,
        periodTarget: Math.round(periodTarget),
        expectedToDate: expectedToDate !== null ? Math.round(expectedToDate) : null,
        perLocation,
      }
    }
  }

  // ---- sales chart series for the selected period ----
  let series: KpiSeries
  if (period === 'today') {
    // "Ayer" — a complete day, so show all hours
    series = hourlySeries(cur, lyDayItems, 24, mode)
  } else if (period === 'mtd' || period === 'lastmonth') {
    series = dailySeries(salesDaily, range, lyRange, asOf)
  } else {
    series = {
      unit: 'month',
      labels: MONTH_LABELS_ES,
      current: monthly.net.cur,
      previous: monthly.net.prev,
    }
  }

  // ---- retention cohorts ----
  const inCohortMonth = (a: ApptRow, c: { start: string; end: string }) =>
    a.start_datetime.slice(0, 10) >= c.start && a.start_datetime.slice(0, 10) <= c.end
  const curCohort = cohortStats(cohortWindowAppts.filter(a => inCohortMonth(a, cohort)), cohortWindowAppts)
  const prevCohort = cohortStats(lyCohortWindowAppts.filter(a => inCohortMonth(a, lyCohort)), lyCohortWindowAppts)

  // ---- pre-booked ----
  const seenClients = new Set(curVisits.visits.filter(a => a.client_id).map(a => a.client_id as string))
  const futureClients = new Set(
    futureAppts.filter(a => !CANCELLED_STATUSES.has(a.status) && a.client_id).map(a => a.client_id as string)
  )
  let withNext = 0
  for (const c of seenClients) if (futureClients.has(c)) withNext++

  // ---- staff attribution ----
  const staffMap = new Map<string, { name: string; visits: number; hours: number; net: number }>()
  const apptByClientDate = new Map<string, string>()
  for (const a of curVisits.visits) {
    const name = a.staff_name || 'Sin asignar'
    const entry = staffMap.get(name) ?? { name, visits: 0, hours: 0, net: 0 }
    entry.visits++
    entry.hours += (a.duration_min ?? 0) / 60
    staffMap.set(name, entry)
    if (a.client_id) {
      const key = `${a.client_id}|${a.start_datetime.slice(0, 10)}|${a.location_id}`
      if (!apptByClientDate.has(key)) apptByClientDate.set(key, name)
    }
  }
  let unassignedNet = 0
  for (const [key, net] of cur.serviceByClientDate) {
    const staffName = apptByClientDate.get(key)
    if (staffName && staffMap.has(staffName)) staffMap.get(staffName)!.net += net
    else unassignedNet += net
  }
  const ranked = [...staffMap.values()]
    .map(s => ({ ...s, hours: Math.round(s.hours * 10) / 10, net: round2(s.net) }))
    .sort((a, b) => b.net - a.net || b.visits - a.visits)
  const staff = ranked.slice(0, 10)
  // Everyone below the top 10, plus revenue with no matching appointment,
  // collapses into a single closing line so the card still sums to the total.
  const rest = ranked.slice(10)
  const restNet = rest.reduce((sum, s) => sum + s.net, 0) + unassignedNet
  if (rest.length > 0 || unassignedNet > 0.005) {
    staff.push({
      name: 'Resto del equipo',
      visits: rest.reduce((sum, s) => sum + s.visits, 0),
      hours: Math.round(rest.reduce((sum, s) => sum + s.hours, 0) * 10) / 10,
      net: round2(restNet),
    })
  }

  // Top 25 — the UI shows 5 and can expand
  const topServices = [...cur.serviceByName.entries()]
    .map(([name, v]) => ({ name, net: round2(v.net), count: v.count }))
    .sort((a, b) => b.net - a.net)
    .slice(0, 25)

  // Top 25 spenders: names from mb_clients, visits from the period's appointments
  const topSpenders = [...cur.byClient.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
  const clientNameById = new Map<string, string>()
  if (topSpenders.length > 0) {
    const { data: clientRows } = await supabase
      .from('mb_clients')
      .select('id,first_name,last_name')
      .in('id', topSpenders.map(([id]) => id))
    for (const c of (clientRows ?? []) as Array<{ id: string; first_name: string | null; last_name: string | null }>) {
      const name = [c.first_name, c.last_name].filter(Boolean).join(' ').trim()
      if (name) clientNameById.set(c.id, name)
    }
  }
  const visitsByClient = new Map<string, number>()
  for (const a of curVisits.visits) {
    if (a.client_id) visitsByClient.set(a.client_id, (visitsByClient.get(a.client_id) ?? 0) + 1)
  }
  const topClients = topSpenders.map(([id, net]) => ({
    name: clientNameById.get(id) ?? `Cliente ${id}`,
    visits: visitsByClient.get(id) ?? 0,
    net: round2(net),
  }))

  // ---- location split (from the daily view, current range) ----
  let locationSplit: KpiPayload['locationSplit'] = null
  if (location === 'all') {
    const byLoc = new Map<number, number>()
    for (const row of salesDaily) {
      if (inRange(row.sale_date, range)) byLoc.set(row.location_id, (byLoc.get(row.location_id) ?? 0) + Number(row.net))
    }
    locationSplit = [1, 2].map(id => {
      const net = byLoc.get(id) ?? 0
      return {
        locationId: id,
        name: LOCATION_NAMES[id],
        net: round2(net),
        sharePct: cur.net > 0 ? Math.round((100 * net) / cur.net) : 0,
      }
    })
  }

  return {
    period,
    location,
    asOf,
    range,
    lyRange,
    updatedAt: (syncState.data?.updated_at as string | undefined) ?? null,
    sales: {
      net: round2(cur.net),
      lyNet: round2(lyNet),
      lyPeriodTotal,
      saleCount: cur.saleCount,
      avgTicket: cur.saleCount > 0 ? round2(cur.net / cur.saleCount) : 0,
      lyAvgTicket: lySaleCount > 0 ? round2(lyNet / lySaleCount) : 0,
      mix: {
        service: round2(cur.mixNet.service),
        retail: round2(cur.mixNet.retail),
        giftcard: round2(cur.mixNet.giftcard),
      },
      series,
    },
    visits: { count: curVisits.visitCount, lyCount: lyVisitCount },
    newClients: { count: curVisits.newClients, lyCount: lyNew },
    goals,
    budget,
    monthly,
    retention: {
      cohortMonth: cohort.label,
      cohortSize: curCohort.size,
      returned: curCohort.returned,
      rate: curCohort.rate,
      lyCohortSize: prevCohort.size,
      lyReturned: prevCohort.returned,
      lyRate: prevCohort.rate,
    },
    prebooked: {
      clientsSeen: seenClients.size,
      withNext,
      rate: seenClients.size > 0 ? withNext / seenClients.size : null,
    },
    noShow: {
      count: curVisits.missed,
      rate: curVisits.noShowRate,
      lyRate: lyAttempted > 0 ? lyMissed / lyAttempted : null,
    },
    topServices,
    topClients,
    staff,
    locationSplit,
  }
}
