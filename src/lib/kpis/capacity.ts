import { serviceClient, fetchAll } from './queries'

// ===========================================
// Bed/space capacity per location (physical ceiling on concurrent treatments).
// CDE: 8 cabinas / 11 camas + 3 sillas de pies  → 14 espacios
// SFC: 10 cabinas / 14 camas + 5 sillas de pies → 19 espacios
// Source: owner-provided floor layout (Aug 2026).
// ===========================================

export const LOCATION_CAPACITY: Record<number, { spots: number; beds: number; chairs: number; cabins: number }> = {
  1: { spots: 14, beds: 11, chairs: 3, cabins: 8 },
  2: { spots: 19, beds: 14, chairs: 5, cabins: 10 },
}

// 30-min blocks from 9:00 to 20:00 (22 blocks)
const DAY_START_MIN = 9 * 60
const DAY_END_MIN = 20 * 60
const BLOCK_MIN = 30
const N_BLOCKS = (DAY_END_MIN - DAY_START_MIN) / BLOCK_MIN

// AM shift = 9:00–14:30 (blocks 0..10), PM = 14:30–20:00 (blocks 11..21)
const AM_BLOCKS = 11

const EXCLUDED_STATUS = new Set(['Cancelled', 'LateCancelled', 'NoShow'])

interface ApptSlice { start_datetime: string; end_datetime: string | null; duration_min: number | null; status: string; location_id: number }

export interface CapacityBlock { time: string; occupied: number }
export interface CapacityDay {
  date: string
  location: number
  capacity: number
  blocks: CapacityBlock[]
  peak: number
  peakPct: number
  peakAm: number
  peakPm: number
}
export interface CapacityWeekday { dow: number; avgPeakAm: number; avgPeakPm: number }
export interface CapacityPayload {
  date: string
  locations: Array<CapacityDay & { weekly: CapacityWeekday[] }>
}

function blockLabel(i: number): string {
  const min = DAY_START_MIN + i * BLOCK_MIN
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h}:${m === 0 ? '00' : m}`
}

function occupancyFor(appts: ApptSlice[]): number[] {
  const blocks = Array(N_BLOCKS).fill(0)
  for (const a of appts) {
    if (EXCLUDED_STATUS.has(a.status)) continue
    const s = new Date(a.start_datetime)
    const startMin = s.getHours() * 60 + s.getMinutes()
    let endMin: number
    if (a.end_datetime) {
      const e = new Date(a.end_datetime)
      endMin = e.getHours() * 60 + e.getMinutes()
    } else {
      endMin = startMin + (a.duration_min ?? 60)
    }
    const i0 = Math.max(0, Math.floor((startMin - DAY_START_MIN) / BLOCK_MIN))
    const i1 = Math.min(N_BLOCKS, Math.ceil((endMin - DAY_START_MIN) / BLOCK_MIN))
    for (let i = i0; i < i1; i++) blocks[i]++
  }
  return blocks
}

async function fetchAppts(start: string, end: string, location: number): Promise<ApptSlice[]> {
  const supabase = serviceClient()
  return fetchAll<ApptSlice>((from, to) =>
    supabase
      .from('mb_appointments')
      .select('start_datetime,end_datetime,duration_min,status,location_id')
      .eq('location_id', location)
      .gte('start_datetime', `${start}T00:00:00`)
      .lte('start_datetime', `${end}T23:59:59`)
      .order('id', { ascending: true })
      .range(from, to) as unknown as PromiseLike<{ data: ApptSlice[] | null; error: { message: string } | null }>
  )
}

function dayOf(a: ApptSlice): string {
  return a.start_datetime.slice(0, 10)
}

export async function getCapacity(date: string): Promise<CapacityPayload> {
  // one fetch covering the selected date plus the trailing 28 days for the
  // weekday summary
  const from = new Date(`${date}T12:00:00`)
  const weeksStart = new Date(from.getTime() - 28 * 864e5).toISOString().slice(0, 10)

  const locations = await Promise.all([1, 2].map(async (loc) => {
    const capacity = LOCATION_CAPACITY[loc].spots
    const appts = await fetchAppts(weeksStart, date, loc)

    // selected-day occupancy
    const dayAppts = appts.filter(a => dayOf(a) === date)
    const blocks = occupancyFor(dayAppts)
    const peak = Math.max(0, ...blocks)
    const peakAm = Math.max(0, ...blocks.slice(0, AM_BLOCKS))
    const peakPm = Math.max(0, ...blocks.slice(AM_BLOCKS))

    // last-4-weeks weekday peaks (exclude the selected date itself if partial)
    const byDay = new Map<string, ApptSlice[]>()
    for (const a of appts) {
      const d = dayOf(a)
      if (d === date) continue
      if (!byDay.has(d)) byDay.set(d, [])
      byDay.get(d)!.push(a)
    }
    const acc: Record<number, { am: number[]; pm: number[] }> = {}
    for (const [d, list] of byDay) {
      const dow = new Date(`${d}T12:00:00`).getDay()
      const b = occupancyFor(list)
      acc[dow] = acc[dow] || { am: [], pm: [] }
      acc[dow].am.push(Math.max(0, ...b.slice(0, AM_BLOCKS)))
      acc[dow].pm.push(Math.max(0, ...b.slice(AM_BLOCKS)))
    }
    const weekly: CapacityWeekday[] = []
    for (let dow = 0; dow < 7; dow++) {
      const e = acc[dow]
      const avg = (xs: number[]) => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0
      weekly.push({ dow, avgPeakAm: e ? avg(e.am) : 0, avgPeakPm: e ? avg(e.pm) : 0 })
    }

    return {
      date,
      location: loc,
      capacity,
      blocks: blocks.map((occupied, i) => ({ time: blockLabel(i), occupied })),
      peak,
      peakPct: capacity ? Math.round(100 * peak / capacity) : 0,
      peakAm,
      peakPm,
      weekly,
    }
  }))

  return { date, locations }
}
