import { getScheduleItems, getStaff } from '@/lib/booking/mindbody'
import { addDays, panamaToday } from './sync'
import {
  fetchAll,
  fetchDaily,
  minusOneYear,
  serviceClient,
  type DailyApptRow,
  type DailyCountRow,
  type DailySaleRow,
  type KpiLocation,
  type KpiSeries,
  MONTH_LABELS_ES,
} from './queries'

// ===========================================
// Daily sales report (/admin/kpis/ventas).
// Range summary + comparative series vs the same dates last year,
// per-day rollups for the collapsible list, and per-day transactions.
// Money is net of ITBMS, tips excluded, returned items excluded.
// ===========================================

export interface ReportDay {
  date: string
  visits: number
  saleCount: number
  net: number
  /** Same calendar day one year earlier. */
  lyNet: number
}

export interface SalesReport {
  range: { start: string; end: string }
  lyRange: { start: string; end: string }
  series: KpiSeries
  days: ReportDay[] // newest first
  totals: { net: number; lyNet: number; visits: number; lyVisits: number; saleCount: number }
  /** Full previous period (complete LY month/year) when the range is month- or year-to-date. */
  lyFull: { net: number; kind: 'month' | 'year' } | null
}

export interface ReportTransaction {
  saleId: number
  time: string // HH:MM local
  clientId: string | null
  clientName: string | null
  locationId: number
  paymentTypes: string[]
  items: Array<{ description: string; bucket: string; net: number; returned: boolean }>
  /** Mode-dependent: cash portion normally, gift-card portion in gc mode (ex-ITBMS, ex-tips). */
  net: number
  /** Gross amount paid with gift card on this sale (0 if none). */
  gcPaid: number
}

const round2 = (n: number) => Math.round(n * 100) / 100

function eachDate(start: string, end: string): string[] {
  const out: string[] = []
  const d = new Date(`${start}T00:00:00Z`)
  const stop = Date.parse(`${end}T00:00:00Z`)
  while (d.getTime() <= stop) {
    out.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return out
}

interface GcUsageRow { sale_date: string; location_id: number; net: number; tx_count: number }

export async function getSalesReport(start: string, end: string, location: KpiLocation, gcMode = false): Promise<SalesReport> {
  const supabase = serviceClient()
  const lyRange = { start: minusOneYear(start), end: minusOneYear(end) }
  // Normal mode: cash basis (money received at the register).
  // Gift-card mode: only the portion of sales paid with gift cards.
  const salesView = gcMode ? 'kpi_daily_gc_usage' : 'kpi_daily_sales_cash'

  const [sales, counts, appts, lySales, lyAppts] = await Promise.all([
    fetchDaily<DailySaleRow & GcUsageRow>(supabase, salesView, 'sale_date', start, end, location),
    gcMode
      ? Promise.resolve([] as DailyCountRow[])
      : fetchDaily<DailyCountRow>(supabase, 'kpi_daily_sale_counts', 'sale_date', start, end, location),
    gcMode
      ? Promise.resolve([] as DailyApptRow[])
      : fetchDaily<DailyApptRow>(supabase, 'kpi_daily_appointments', 'day', start, end, location),
    fetchDaily<DailySaleRow & GcUsageRow>(supabase, salesView, 'sale_date', lyRange.start, lyRange.end, location),
    gcMode
      ? Promise.resolve([] as DailyApptRow[])
      : fetchDaily<DailyApptRow>(supabase, 'kpi_daily_appointments', 'day', lyRange.start, lyRange.end, location),
  ])

  const netByDate = new Map<string, number>()
  for (const r of sales) netByDate.set(r.sale_date, (netByDate.get(r.sale_date) ?? 0) + Number(r.net))
  const countByDate = new Map<string, number>()
  if (gcMode) for (const r of sales) countByDate.set(r.sale_date, (countByDate.get(r.sale_date) ?? 0) + r.tx_count)
  else for (const r of counts) countByDate.set(r.sale_date, (countByDate.get(r.sale_date) ?? 0) + r.sale_count)
  const visitsByDate = new Map<string, number>()
  if (gcMode) for (const [d, n] of countByDate) visitsByDate.set(d, n) // "usos" instead of visits
  else for (const r of appts) visitsByDate.set(r.day, (visitsByDate.get(r.day) ?? 0) + r.visits)
  const lyNetByDate = new Map<string, number>()
  for (const r of lySales) lyNetByDate.set(r.sale_date, (lyNetByDate.get(r.sale_date) ?? 0) + Number(r.net))

  const dates = eachDate(start, end)
  const lyDates = eachDate(lyRange.start, lyRange.end)

  // Day rows: only days with activity, newest first
  const days: ReportDay[] = dates
    .filter(d => (netByDate.get(d) ?? 0) !== 0 || (visitsByDate.get(d) ?? 0) > 0 || (countByDate.get(d) ?? 0) > 0)
    .map(d => ({
      date: d,
      visits: visitsByDate.get(d) ?? 0,
      saleCount: countByDate.get(d) ?? 0,
      net: round2(netByDate.get(d) ?? 0),
      lyNet: round2(lyNetByDate.get(minusOneYear(d)) ?? 0),
    }))
    .reverse()

  // Comparative series: daily up to 45 days, else monthly
  let series: KpiSeries
  if (dates.length <= 45) {
    series = {
      unit: 'day',
      labels: dates.map(d => d.slice(8, 10)),
      current: dates.map(d => round2(netByDate.get(d) ?? 0)),
      previous: dates.map((_, i) => (i < lyDates.length ? round2(lyNetByDate.get(lyDates[i]) ?? 0) : null)),
    }
  } else {
    const monthKeys: string[] = []
    const curM = new Map<string, number>()
    for (const d of dates) {
      const k = d.slice(0, 7)
      if (!monthKeys.includes(k)) monthKeys.push(k)
      curM.set(k, (curM.get(k) ?? 0) + (netByDate.get(d) ?? 0))
    }
    const prevM = new Map<string, number>()
    for (const d of lyDates) {
      const k = d.slice(0, 7)
      prevM.set(k, (prevM.get(k) ?? 0) + (lyNetByDate.get(d) ?? 0))
    }
    series = {
      unit: 'month',
      labels: monthKeys.map(k => MONTH_LABELS_ES[Number(k.slice(5, 7)) - 1]),
      current: monthKeys.map(k => round2(curM.get(k) ?? 0)),
      previous: monthKeys.map(k => round2(prevM.get(minusOneYear(`${k}-01`).slice(0, 7)) ?? 0)),
    }
  }

  let lyVisits = 0
  for (const r of lyAppts) lyVisits += r.visits

  // "Goal" line: complete LY month/year when the range is a to-date period
  const today = panamaToday()
  let lyFull: SalesReport['lyFull'] = null
  const isMonthToDate = end === today && start === `${end.slice(0, 7)}-01`
  const isYearToDate = end === today && start === `${end.slice(0, 4)}-01-01`
  if (isMonthToDate || isYearToDate) {
    const [ly, lm] = lyRange.start.split('-').map(Number)
    const fullStart = lyRange.start
    const fullEnd = isMonthToDate
      ? `${lyRange.start.slice(0, 7)}-${String(new Date(Date.UTC(ly, lm, 0)).getUTCDate()).padStart(2, '0')}`
      : `${lyRange.start.slice(0, 4)}-12-31`
    const fullRows = await fetchDaily<DailySaleRow>(supabase, salesView, 'sale_date', fullStart, fullEnd, location)
    lyFull = {
      net: round2(fullRows.reduce((s, r) => s + Number(r.net), 0)),
      kind: isMonthToDate ? 'month' : 'year',
    }
  }

  return {
    range: { start, end },
    lyRange,
    series,
    days,
    lyFull,
    totals: {
      net: round2(days.reduce((s, d) => s + d.net, 0)),
      lyNet: round2([...lyNetByDate.values()].reduce((s, v) => s + v, 0)),
      visits: days.reduce((s, d) => s + d.visits, 0),
      lyVisits,
      saleCount: days.reduce((s, d) => s + d.saleCount, 0),
    },
  }
}

// ---------- agenda (calendar view) ----------

export interface AgendaDay {
  date: string
  /** Appointments that count: not cancelled (includes no-shows for past days). */
  active: number
  missed: number
  cancelled: number
}

export interface AgendaMonth {
  month: string // YYYY-MM
  days: AgendaDay[]
  totals: {
    /** Citas up to today (or the whole month if it's already past). */
    activeToDate: number
    /** Future bookings within this month. */
    futureBooked: number
    /** LY citas over the SAME dates (1..same day) — the fair comparison. */
    lySameDates: number
    /** LY complete month — the goal. */
    lyFullMonth: number
    /** Estimated net income of the month's remaining bookings (last-30-days $/appointment-minute × booked minutes). */
    expectedIncome: number | null
  }
}

interface AgendaApptRow { start_datetime: string; status: string; duration_min: number | null }

export async function getAgendaMonth(month: string, location: KpiLocation): Promise<AgendaMonth> {
  const supabase = serviceClient()
  const [y, m] = month.split('-').map(Number)
  const start = `${month}-01`
  const end = `${month}-${String(new Date(Date.UTC(y, m, 0)).getUTCDate()).padStart(2, '0')}`
  const lyStart = minusOneYear(start)
  const lyEnd = minusOneYear(end)

  const today = panamaToday()
  const rateStart = addDays(today, -30)
  const rateEnd = addDays(today, -1)

  const [appts, lyAppts, rateNetRows, rateAppts] = await Promise.all([
    fetchAll<AgendaApptRow>((from, to) => {
      let q = supabase
        .from('mb_appointments')
        .select('start_datetime,status,duration_min')
        .gte('start_datetime', `${start}T00:00:00`)
        .lte('start_datetime', `${end}T23:59:59`)
      if (location !== 'all') q = q.eq('location_id', location)
      return q.order('id', { ascending: true }).range(from, to) as unknown as PromiseLike<{ data: AgendaApptRow[] | null; error: { message: string } | null }>
    }),
    fetchDaily<DailyApptRow>(supabase, 'kpi_daily_appointments', 'day', lyStart, lyEnd, location),
    // last 30 complete days: service net + appointment minutes → $/minute
    (() => {
      let q = supabase
        .from('kpi_daily_sales')
        .select('net')
        .eq('bucket', 'service')
        .gte('sale_date', rateStart)
        .lte('sale_date', rateEnd)
      if (location !== 'all') q = q.eq('location_id', location)
      return q
    })(),
    fetchAll<{ duration_min: number | null; status: string }>((from, to) => {
      let q = supabase
        .from('mb_appointments')
        .select('duration_min,status')
        .gte('start_datetime', `${rateStart}T00:00:00`)
        .lte('start_datetime', `${rateEnd}T23:59:59`)
      if (location !== 'all') q = q.eq('location_id', location)
      return q.order('id', { ascending: true }).range(from, to) as unknown as PromiseLike<{ data: Array<{ duration_min: number | null; status: string }> | null; error: { message: string } | null }>
    }),
  ])

  const byDate = new Map<string, AgendaDay>()
  for (const d of eachDate(start, end)) byDate.set(d, { date: d, active: 0, missed: 0, cancelled: 0 })
  for (const a of appts) {
    const day = byDate.get(a.start_datetime.slice(0, 10))
    if (!day) continue
    if (a.status === 'Cancelled' || a.status === 'LateCancelled') day.cancelled++
    else if (a.status === 'NoShow') { day.active++; day.missed++ }
    else day.active++
  }

  const days = [...byDate.values()]
  // Compare like-for-like: only dates that have already happened
  const cutoff = end < today ? end : today
  const lyCutoff = minusOneYear(cutoff)

  // Expected income of the remaining bookings: recent $/appointment-minute ×
  // minutes on the books. Duration-weighted so a 90-min booking counts more
  // than a 30-min one.
  const rateNet = (rateNetRows.data ?? []).reduce((s, r) => s + Number(r.net ?? 0), 0)
  const rateMinutes = rateAppts
    .filter(a => !['Cancelled', 'LateCancelled', 'NoShow'].includes(a.status))
    .reduce((s, a) => s + (a.duration_min ?? 0), 0)
  const perMinute = rateMinutes > 0 ? rateNet / rateMinutes : null
  const futureMinutes = appts
    .filter(a => a.start_datetime.slice(0, 10) > cutoff && !['Cancelled', 'LateCancelled', 'NoShow'].includes(a.status))
    .reduce((s, a) => s + (a.duration_min ?? 0), 0)
  const expectedIncome = perMinute !== null && futureMinutes > 0
    ? Math.round(perMinute * futureMinutes)
    : null

  return {
    month,
    days,
    totals: {
      activeToDate: days.filter(d => d.date <= cutoff).reduce((s, d) => s + d.active, 0),
      futureBooked: days.filter(d => d.date > cutoff).reduce((s, d) => s + d.active, 0),
      lySameDates: lyAppts.filter(r => r.day <= lyCutoff).reduce((s, r) => s + r.visits + r.missed, 0),
      lyFullMonth: lyAppts.reduce((s, r) => s + r.visits + r.missed, 0),
      expectedIncome,
    },
  }
}

// ---------- agenda day schedule ----------

export interface AgendaAppointment {
  id: number
  startTime: string // HH:MM
  endTime: string
  startMin: number // minutes from midnight (for grid positioning)
  durationMin: number
  staffId: number | null
  staffName: string
  clientName: string | null
  status: string
  noShow: boolean
  locationId: number
}

export interface StaffAvailability {
  staffId: number
  staffName: string
  /** Working windows in minutes from midnight (unavailabilities subtracted). */
  blocks: Array<{ startMin: number; endMin: number }>
}

export interface AgendaDaySchedule {
  appointments: AgendaAppointment[]
  availability: StaffAvailability[]
}

function stampToMin(stamp: string): number {
  const hm = stamp.replace(/Z$/, '').slice(11, 16)
  return Number(hm.slice(0, 2)) * 60 + Number(hm.slice(3, 5))
}

/** Merge overlapping intervals, then subtract the `minus` intervals. */
function netIntervals(
  blocks: Array<{ startMin: number; endMin: number }>,
  minus: Array<{ startMin: number; endMin: number }>
): Array<{ startMin: number; endMin: number }> {
  const merged = [...blocks]
    .sort((a, b) => a.startMin - b.startMin)
    .reduce<Array<{ startMin: number; endMin: number }>>((acc, b) => {
      const last = acc[acc.length - 1]
      if (last && b.startMin <= last.endMin) last.endMin = Math.max(last.endMin, b.endMin)
      else acc.push({ ...b })
      return acc
    }, [])
  let result = merged
  for (const m of minus) {
    result = result.flatMap(b => {
      if (m.endMin <= b.startMin || m.startMin >= b.endMin) return [b]
      const parts: Array<{ startMin: number; endMin: number }> = []
      if (m.startMin > b.startMin) parts.push({ startMin: b.startMin, endMin: m.startMin })
      if (m.endMin < b.endMin) parts.push({ startMin: m.endMin, endMin: b.endMin })
      return parts
    })
  }
  return result.filter(b => b.endMin > b.startMin)
}

/**
 * Therapist working hours for one day, fetched live from Mindbody
 * (small: 1 call). Returns [] if the call fails — the schedule still renders.
 */
async function getDayAvailability(date: string, location: KpiLocation): Promise<StaffAvailability[]> {
  try {
    const locationIds = location === 'all' ? [1, 2] : [location]
    // scheduleitems only returns schedules when staffIds are passed explicitly
    const staff = await getStaff()
    const staffIds = staff.map(s => s.Id)
    if (staffIds.length === 0) return []
    const staffMembers = await getScheduleItems({ locationIds, staffIds, startDate: date, endDate: date })
    return staffMembers
      .map(m => ({
        staffId: m.Id,
        staffName: [m.FirstName, m.LastName].filter(Boolean).join(' ').trim(),
        blocks: netIntervals(
          (m.Availabilities ?? []).map(a => ({ startMin: stampToMin(a.StartDateTime), endMin: stampToMin(a.EndDateTime) })),
          (m.Unavailabilities ?? []).map(u => ({ startMin: stampToMin(u.StartDateTime), endMin: stampToMin(u.EndDateTime) }))
        ),
      }))
      .filter(a => a.staffName && a.blocks.length > 0)
  } catch (err) {
    console.error('getDayAvailability failed (rendering without):', err)
    return []
  }
}

interface AgendaDayApptRow {
  id: number
  start_datetime: string
  end_datetime: string | null
  duration_min: number | null
  status: string
  location_id: number
  staff_id: number | null
  staff_name: string | null
  client_id: string | null
}

/** Appointments (cancelled excluded) + therapist availability for one day. */
export async function getAgendaDay(date: string, location: KpiLocation): Promise<AgendaDaySchedule> {
  const supabase = serviceClient()

  const availabilityPromise = getDayAvailability(date, location)
  const rows = await fetchAll<AgendaDayApptRow>((from, to) => {
    let q = supabase
      .from('mb_appointments')
      .select('id,start_datetime,end_datetime,duration_min,status,location_id,staff_id,staff_name,client_id')
      .gte('start_datetime', `${date}T00:00:00`)
      .lte('start_datetime', `${date}T23:59:59`)
      .not('status', 'in', '("Cancelled","LateCancelled")')
    if (location !== 'all') q = q.eq('location_id', location)
    return q.order('start_datetime', { ascending: true }).order('id', { ascending: true }).range(from, to) as unknown as PromiseLike<{ data: AgendaDayApptRow[] | null; error: { message: string } | null }>
  })

  const clientIds = [...new Set(rows.map(r => r.client_id).filter((c): c is string => !!c))]
  const nameById = new Map<string, string>()
  for (const ids of chunk(clientIds, 200)) {
    const { data, error } = await supabase
      .from('mb_clients')
      .select('id,first_name,last_name')
      .in('id', ids)
    if (error) break
    for (const c of (data ?? []) as ClientRow[]) {
      const name = [c.first_name, c.last_name].filter(Boolean).join(' ').trim()
      if (name) nameById.set(c.id, name)
    }
  }

  const appointments = rows.map(r => {
    const start = r.start_datetime.slice(11, 16)
    const startMin = Number(start.slice(0, 2)) * 60 + Number(start.slice(3, 5))
    const durationMin = r.duration_min ?? (r.end_datetime
      ? Math.max(15, (Date.parse(r.end_datetime.replace(' ', 'T')) - Date.parse(r.start_datetime.replace(' ', 'T'))) / 60000)
      : 60)
    const endMin = startMin + durationMin
    const endTime = `${String(Math.floor(endMin / 60) % 24).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`
    return {
      id: r.id,
      startTime: start,
      endTime: r.end_datetime ? r.end_datetime.slice(11, 16) : endTime,
      startMin,
      durationMin,
      staffId: r.staff_id,
      staffName: r.staff_name || 'Sin asignar',
      clientName: r.client_id ? nameById.get(r.client_id) ?? null : null,
      status: r.status,
      noShow: r.status === 'NoShow',
      locationId: r.location_id,
    }
  })

  return { appointments, availability: await availabilityPromise }
}

interface SaleRow {
  id: number
  sale_datetime: string
  location_id: number
  client_id: string | null
  payment_types: string[]
  gc_paid: number | null
  comp_paid: number | null
  total_paid: number | null
}

interface ItemRow {
  sale_id: number
  description: string | null
  bucket: string
  net_amount: number
  returned: boolean
}

interface ClientRow { id: string; first_name: string | null; last_name: string | null }

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export async function getDayTransactions(date: string, location: KpiLocation, gcMode = false): Promise<ReportTransaction[]> {
  const supabase = serviceClient()

  let salesRows = await fetchAll<SaleRow>((from, to) => {
    let q = supabase
      .from('mb_sales')
      .select('id,sale_datetime,location_id,client_id,payment_types,gc_paid,comp_paid,total_paid')
      .eq('sale_date', date)
    if (location !== 'all') q = q.eq('location_id', location)
    return q.order('sale_datetime', { ascending: true }).order('id', { ascending: true }).range(from, to) as unknown as PromiseLike<{ data: SaleRow[] | null; error: { message: string } | null }>
  })
  if (gcMode) salesRows = salesRows.filter(s => (Number(s.gc_paid) || 0) > 0)
  if (salesRows.length === 0) return []

  const saleIds = salesRows.map(s => s.id)
  const itemRows: ItemRow[] = []
  for (const ids of chunk(saleIds, 200)) {
    const { data, error } = await supabase
      .from('mb_sale_items')
      .select('sale_id,description,bucket,net_amount,returned')
      .in('sale_id', ids)
    if (error) throw new Error(error.message)
    itemRows.push(...(data ?? []))
  }

  const clientIds = [...new Set(salesRows.map(s => s.client_id).filter((c): c is string => !!c))]
  const nameById = new Map<string, string>()
  // Tolerate the name columns not existing yet (migration 20260708) —
  // transactions then fall back to showing the client id.
  for (const ids of chunk(clientIds, 200)) {
    const { data, error } = await supabase
      .from('mb_clients')
      .select('id,first_name,last_name')
      .in('id', ids)
    if (error) break
    for (const c of (data ?? []) as ClientRow[]) {
      const name = [c.first_name, c.last_name].filter(Boolean).join(' ').trim()
      if (name) nameById.set(c.id, name)
    }
  }

  const itemsBySale = new Map<number, ItemRow[]>()
  for (const it of itemRows) {
    const list = itemsBySale.get(it.sale_id) ?? []
    list.push(it)
    itemsBySale.set(it.sale_id, list)
  }

  return salesRows.map(s => {
    const items = itemsBySale.get(s.id) ?? []
    const itemNet = items.reduce(
      (sum, it) => (it.returned || it.bucket === 'tip' ? sum : sum + (Number(it.net_amount) || 0)),
      0
    )
    // Money basis: cash portion normally (gift-card and comped portions
    // excluded — no money received), gift-card portion in gc mode.
    // Tips are excluded from the denominator (paid, but not an item).
    const tipSum = items.reduce(
      (sum, it) => (it.bucket === 'tip' && !it.returned ? sum + (Number(it.net_amount) || 0) : sum),
      0
    )
    const total = Number(s.total_paid) || 0
    const denom = total - tipSum
    let factor: number
    if (total <= 0) factor = gcMode ? 0 : 1
    else if (denom <= 0) factor = 0
    else {
      const gcShare = Math.min(1, Math.max(0, (Number(s.gc_paid) || 0) / denom))
      const compShare = Math.min(1, Math.max(0, (Number(s.comp_paid) || 0) / denom))
      factor = gcMode ? gcShare : Math.max(0, 1 - gcShare - compShare)
    }
    const net = itemNet * factor
    return {
      saleId: s.id,
      time: s.sale_datetime.slice(11, 16),
      clientId: s.client_id,
      clientName: s.client_id ? nameById.get(s.client_id) ?? null : null,
      locationId: s.location_id,
      paymentTypes: s.payment_types ?? [],
      items: items.map(it => ({
        description: (it.description || '—').trim(),
        bucket: it.bucket,
        net: round2(Number(it.net_amount) || 0),
        returned: it.returned,
      })),
      net: round2(net),
      gcPaid: round2(Number(s.gc_paid) || 0),
    }
  })
}
