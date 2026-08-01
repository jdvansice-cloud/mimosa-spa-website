import { getScheduleItems, getStaff } from '@/lib/booking/mindbody'
import { addDays, panamaToday } from './sync'
import {
  fetchAll,
  minusOneYear,
  rangeFor,
  serviceClient,
  type KpiLocation,
  type KpiPeriod,
  type Supabase,
} from './queries'

// ===========================================
// Staff performance page (/admin/kpis/staff).
// Hours, revenue and tips are attributed per therapist; money is net of
// ITBMS/tips on a cash basis, matching the rest of Mobile Manager.
// Complete days only (through yesterday), like the KPI dashboard.
// ===========================================

export interface StaffMemberKpis {
  name: string
  hours: number
  lyHours: number
  visits: number
  lyVisits: number
  net: number
  lyNet: number
  avgPerVisit: number
  tips: number
  /** tips ÷ attributed net — a service-quality proxy. */
  tipRate: number | null
  /** % of visits where the client specifically requested this therapist. */
  requestedPct: number | null
  noShowRate: number | null
  firstVisits: number
  /** Trailing closed cohort: % of this therapist's clients (90–180 days ago) who rebooked HER within 90 days. */
  repeatRate: number | null
  repeatCohortSize: number
  /** Scheduled hours in the period (month views only, from Mindbody schedules). */
  availableHours: number | null
  utilizationPct: number | null
  topServices: Array<{ name: string; count: number }>
  /** "Ventas en Cabina" — add-ons the therapist sold during the service (Mindbody category −14). */
  cabinaNet: number
  lyCabinaNet: number
  cabinaCount: number
  /** cabina items sold ÷ visits — the up-sell attach rate. */
  cabinaAttach: number | null
  topCabina: Array<{ name: string; count: number }>
}

export interface StaffKpisPayload {
  period: KpiPeriod
  location: KpiLocation
  asOf: string
  range: { start: string; end: string }
  lyRange: { start: string; end: string }
  team: {
    hours: number
    visits: number
    net: number
    tips: number
    requestedPct: number | null
    cabinaNet: number
    cabinaCount: number
    cabinaAttach: number | null
  }
  members: StaffMemberKpis[] // net desc
}

const CANCELLED = new Set(['Cancelled', 'LateCancelled', 'NoShow'])
const round2 = (n: number) => Math.round(n * 100) / 100
const round1 = (n: number) => Math.round(n * 10) / 10

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
  staff_requested: boolean
}

/** Mindbody treatment category "ventas en Cabina" — items sold in the cabin during the service. */
const CABINA_CATEGORY_ID = -14

interface ItemRow {
  sale_id: number
  description: string | null
  bucket: string
  category_id: number | null
  net_amount: number
  returned: boolean
  sale: {
    sale_date: string
    location_id: number
    client_id: string | null
    gc_paid: number | null
    comp_paid: number | null
    total_paid: number | null
  }
}

function fetchAppts(supabase: Supabase, start: string, end: string, location: KpiLocation): Promise<ApptRow[]> {
  return fetchAll<ApptRow>((from, to) => {
    let q = supabase
      .from('mb_appointments')
      .select('id,start_datetime,duration_min,status,location_id,staff_id,staff_name,client_id,first_appointment,staff_requested')
      .gte('start_datetime', `${start}T00:00:00`)
      .lte('start_datetime', `${end}T23:59:59`)
    if (location !== 'all') q = q.eq('location_id', location)
    return q.order('id', { ascending: true }).range(from, to) as unknown as PromiseLike<{ data: ApptRow[] | null; error: { message: string } | null }>
  })
}

function fetchItems(supabase: Supabase, start: string, end: string, location: KpiLocation): Promise<ItemRow[]> {
  return fetchAll<ItemRow>((from, to) => {
    let q = supabase
      .from('mb_sale_items')
      .select('sale_id,line_no,description,bucket,category_id,net_amount,returned,sale:mb_sales!inner(sale_date,location_id,client_id,gc_paid,comp_paid,total_paid)')
      .gte('sale.sale_date', start)
      .lte('sale.sale_date', end)
    if (location !== 'all') q = q.eq('sale.location_id', location)
    return q
      .order('sale_id', { ascending: true })
      .order('line_no', { ascending: true })
      .range(from, to) as unknown as PromiseLike<{ data: ItemRow[] | null; error: { message: string } | null }>
  })
}

/** Cash share of a sale (gift-card and comped payments excluded, tips out of the denominator). */
function cashFactors(items: ItemRow[]): Map<number, number> {
  const tips = new Map<number, number>()
  const sales = new Map<number, ItemRow['sale']>()
  for (const it of items) {
    sales.set(it.sale_id, it.sale)
    if (it.bucket === 'tip' && !it.returned) tips.set(it.sale_id, (tips.get(it.sale_id) ?? 0) + (Number(it.net_amount) || 0))
  }
  const out = new Map<number, number>()
  for (const [id, sale] of sales) {
    const total = Number(sale.total_paid) || 0
    const denom = total - (tips.get(id) ?? 0)
    if (total <= 0) out.set(id, 1)
    else if (denom <= 0) out.set(id, 0)
    else {
      const nonCash = Math.min(1, Math.max(0, ((Number(sale.gc_paid) || 0) + (Number(sale.comp_paid) || 0)) / denom))
      out.set(id, 1 - nonCash)
    }
  }
  return out
}

interface Attribution {
  net: Map<string, number>
  tips: Map<string, number>
  services: Map<string, Map<string, number>> // staff → service name → count
  cabinaNet: Map<string, number>
  cabinaCount: Map<string, number>
  cabinaItems: Map<string, Map<string, number>> // staff → cabina item → count
}

/**
 * Attribute service revenue and tips via the client's same-day appointment(s).
 * When a client saw MORE THAN ONE therapist that day (couples, day spa), the
 * ticket splits proportionally to each therapist's appointment minutes —
 * otherwise the first therapist on the schedule inherits the whole ticket
 * and looks artificially productive.
 */
function attribute(items: ItemRow[], appts: ApptRow[]): Attribution {
  const partsByKey = new Map<string, Map<string, number>>() // key → staff → minutes
  for (const a of appts) {
    if (CANCELLED.has(a.status) || !a.client_id || !a.staff_name) continue
    const key = `${a.client_id}|${a.start_datetime.slice(0, 10)}|${a.location_id}`
    const parts = partsByKey.get(key) ?? new Map<string, number>()
    parts.set(a.staff_name, (parts.get(a.staff_name) ?? 0) + (a.duration_min ?? 60))
    partsByKey.set(key, parts)
  }
  const factors = cashFactors(items)
  const net = new Map<string, number>()
  const tips = new Map<string, number>()
  const services = new Map<string, Map<string, number>>()
  const cabinaNet = new Map<string, number>()
  const cabinaCount = new Map<string, number>()
  const cabinaItems = new Map<string, Map<string, number>>()
  for (const it of items) {
    if (it.returned || !it.sale.client_id) continue
    const parts = partsByKey.get(`${it.sale.client_id}|${it.sale.sale_date}|${it.sale.location_id}`)
    if (!parts || parts.size === 0) continue
    const totalMin = [...parts.values()].reduce((s, v) => s + v, 0)
    let primary = '', primaryMin = -1
    for (const [st, min] of parts) if (min > primaryMin) { primaryMin = min; primary = st }

    const full = Number(it.net_amount) || 0
    const amount = full * (factors.get(it.sale_id) ?? 1)
    for (const [staff, min] of parts) {
      const share = totalMin > 0 ? min / totalMin : 1 / parts.size
      if (it.bucket === 'tip') {
        // Tips are what the client chose to give — full value, split by share
        tips.set(staff, (tips.get(staff) ?? 0) + full * share)
      } else {
        net.set(staff, (net.get(staff) ?? 0) + amount * share)
      }
    }
    // item COUNTS stay whole and go to the main therapist of the day
    if (it.bucket === 'service') {
      const name = (it.description || 'Servicio').trim()
      const byName = services.get(primary) ?? new Map<string, number>()
      byName.set(name, (byName.get(name) ?? 0) + 1)
      services.set(primary, byName)
    }
    if (it.bucket !== 'tip' && it.category_id === CABINA_CATEGORY_ID) {
      // a cabin extra is sold by the treating therapist — credit the main one
      cabinaNet.set(primary, (cabinaNet.get(primary) ?? 0) + amount)
      cabinaCount.set(primary, (cabinaCount.get(primary) ?? 0) + 1)
      const name = (it.description || 'Venta en cabina').trim()
      const byName = cabinaItems.get(primary) ?? new Map<string, number>()
      byName.set(name, (byName.get(name) ?? 0) + 1)
      cabinaItems.set(primary, byName)
    }
  }
  return { net, tips, services, cabinaNet, cabinaCount, cabinaItems }
}

/** Scheduled hours per staff for short ranges (≤62 days), live from Mindbody. */
async function availableHoursByStaff(start: string, end: string, location: KpiLocation): Promise<Map<string, number> | null> {
  const span = (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000
  if (span > 62) return null
  try {
    const staff = await getStaff()
    if (staff.length === 0) return null
    const locationIds = location === 'all' ? [1, 2] : [location]
    const members = await getScheduleItems({ locationIds, staffIds: staff.map(s => s.Id), startDate: start, endDate: end })
    const durMin = (a: { StartDateTime: string; EndDateTime: string }) =>
      Math.max(0, (Date.parse(a.EndDateTime.replace(/Z$/, '') + 'Z') - Date.parse(a.StartDateTime.replace(/Z$/, '') + 'Z')) / 60000)
    const out = new Map<string, number>()
    for (const m of members) {
      const name = [m.FirstName, m.LastName].filter(Boolean).join(' ').trim()
      if (!name) continue
      const avail = (m.Availabilities ?? []).reduce((s, a) => s + durMin(a), 0)
      const unavail = (m.Unavailabilities ?? []).reduce((s, a) => s + durMin(a), 0)
      const hours = Math.max(0, avail - unavail) / 60
      if (hours > 0) out.set(name, hours)
    }
    return out
  } catch (err) {
    console.error('availableHoursByStaff failed (rendering without):', err)
    return null
  }
}

export async function getStaffKpis(
  period: KpiPeriod,
  location: KpiLocation,
  /** Skip the live Mindbody schedules call (utilization) for a fast first paint. */
  includeAvailability = true
): Promise<StaffKpisPayload> {
  const supabase = serviceClient()
  const asOf = addDays(panamaToday(), -1)
  const range = rangeFor(period, asOf)
  const lyRange = { start: minusOneYear(range.start), end: minusOneYear(range.end) }

  const [curAppts, lyAppts, curItems, lyItems, trailingAppts, availability] = await Promise.all([
    fetchAppts(supabase, range.start, range.end, location),
    fetchAppts(supabase, lyRange.start, lyRange.end, location),
    fetchItems(supabase, range.start, range.end, location),
    fetchItems(supabase, lyRange.start, lyRange.end, location),
    // Loyalty cohort: visits 90–180 days ago + their 90-day follow-up window
    fetchAppts(supabase, addDays(asOf, -180), asOf, location),
    includeAvailability
      ? availableHoursByStaff(range.start, range.end > asOf ? asOf : range.end, location)
      : Promise.resolve(null),
  ])

  const cur = attribute(curItems, curAppts)
  const ly = attribute(lyItems, lyAppts)

  // Loyalty: earliest cohort visit per (staff, client), rebooked same staff ≤90d after
  const cohortEnd = addDays(asOf, -90)
  const firstVisit = new Map<string, string>() // staff|client → date
  for (const a of trailingAppts) {
    if (CANCELLED.has(a.status) || !a.client_id || !a.staff_name) continue
    const d = a.start_datetime.slice(0, 10)
    if (d > cohortEnd) continue
    const key = `${a.staff_name}|${a.client_id}`
    if (!firstVisit.has(key) || d < firstVisit.get(key)!) firstVisit.set(key, d)
  }
  const cohortSize = new Map<string, number>()
  const cohortReturned = new Map<string, number>()
  for (const [key, date] of firstVisit) {
    const staff = key.split('|')[0]
    cohortSize.set(staff, (cohortSize.get(staff) ?? 0) + 1)
    const deadline = addDays(date, 90)
    const clientId = key.slice(staff.length + 1)
    const returned = trailingAppts.some(a =>
      a.staff_name === staff &&
      a.client_id === clientId &&
      !CANCELLED.has(a.status) &&
      a.start_datetime.slice(0, 10) > date &&
      a.start_datetime.slice(0, 10) <= deadline
    )
    if (returned) cohortReturned.set(staff, (cohortReturned.get(staff) ?? 0) + 1)
  }

  // Per-staff aggregates for the period
  interface Agg { hours: number; visits: number; missed: number; requested: number; firstVisits: number }
  const mk = () => ({ hours: 0, visits: 0, missed: 0, requested: 0, firstVisits: 0 })
  const agg = new Map<string, Agg>()
  const lyAgg = new Map<string, { hours: number; visits: number }>()
  for (const a of curAppts) {
    const name = a.staff_name || 'Sin asignar'
    const e = agg.get(name) ?? mk()
    if (a.status === 'NoShow' || a.status === 'LateCancelled') e.missed++
    else if (!CANCELLED.has(a.status)) {
      e.visits++
      e.hours += (a.duration_min ?? 0) / 60
      if (a.staff_requested) e.requested++
      if (a.first_appointment) e.firstVisits++
    }
    agg.set(name, e)
  }
  for (const a of lyAppts) {
    if (CANCELLED.has(a.status)) continue
    const name = a.staff_name || 'Sin asignar'
    const e = lyAgg.get(name) ?? { hours: 0, visits: 0 }
    e.visits++
    e.hours += (a.duration_min ?? 0) / 60
    lyAgg.set(name, e)
  }

  const members: StaffMemberKpis[] = [...agg.entries()]
    .filter(([name, e]) => name !== 'Sin asignar' && (e.visits > 0 || e.missed > 0))
    .map(([name, e]) => {
      const net = cur.net.get(name) ?? 0
      const tips = cur.tips.get(name) ?? 0
      const availableHours = availability?.get(name) ?? null
      const csize = cohortSize.get(name) ?? 0
      const attempted = e.visits + e.missed
      return {
        name,
        hours: round1(e.hours),
        lyHours: round1(lyAgg.get(name)?.hours ?? 0),
        visits: e.visits,
        lyVisits: lyAgg.get(name)?.visits ?? 0,
        net: round2(net),
        lyNet: round2(ly.net.get(name) ?? 0),
        avgPerVisit: e.visits > 0 ? round2(net / e.visits) : 0,
        tips: round2(tips),
        tipRate: net > 0 ? round2((100 * tips) / net) / 100 : null,
        requestedPct: e.visits > 0 ? e.requested / e.visits : null,
        noShowRate: attempted > 0 ? e.missed / attempted : null,
        firstVisits: e.firstVisits,
        repeatRate: csize >= 5 ? (cohortReturned.get(name) ?? 0) / csize : null,
        repeatCohortSize: csize,
        availableHours: availableHours !== null ? round1(availableHours) : null,
        utilizationPct: availableHours && availableHours > 0 ? Math.min(1.5, e.hours / availableHours) : null,
        topServices: [...(cur.services.get(name) ?? new Map<string, number>()).entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([n, count]) => ({ name: n, count })),
        cabinaNet: round2(cur.cabinaNet.get(name) ?? 0),
        lyCabinaNet: round2(ly.cabinaNet.get(name) ?? 0),
        cabinaCount: cur.cabinaCount.get(name) ?? 0,
        cabinaAttach: e.visits > 0 ? (cur.cabinaCount.get(name) ?? 0) / e.visits : null,
        topCabina: [...(cur.cabinaItems.get(name) ?? new Map<string, number>()).entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([n, count]) => ({ name: n, count })),
      }
    })
    .sort((a, b) => b.net - a.net)

  const teamVisits = members.reduce((s, m) => s + m.visits, 0)
  const teamRequested = members.reduce((s, m) => s + (m.requestedPct ?? 0) * m.visits, 0)
  const teamCabinaCount = members.reduce((s, m) => s + m.cabinaCount, 0)

  return {
    period,
    location,
    asOf,
    range,
    lyRange,
    team: {
      hours: round1(members.reduce((s, m) => s + m.hours, 0)),
      visits: teamVisits,
      net: round2(members.reduce((s, m) => s + m.net, 0)),
      tips: round2(members.reduce((s, m) => s + m.tips, 0)),
      requestedPct: teamVisits > 0 ? teamRequested / teamVisits : null,
      cabinaNet: round2(members.reduce((s, m) => s + m.cabinaNet, 0)),
      cabinaCount: teamCabinaCount,
      cabinaAttach: teamVisits > 0 ? teamCabinaCount / teamVisits : null,
    },
    members,
  }
}
