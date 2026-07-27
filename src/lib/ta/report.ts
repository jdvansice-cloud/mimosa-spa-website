import { getScheduleItems, getStaff } from '@/lib/booking/mindbody'
import { fetchAll, serviceClient, type Supabase } from '@/lib/kpis/queries'

// ===========================================
// Asistencia — joins TC7 clock punches (ta_punches) with Mindbody:
//  - scheduled shifts (live Schedule Items: availability blocks per day)
//  - booked appointments (mb_appointments cache)
// per employee per day: worked vs scheduled vs booked minutes, late
// arrivals against the scheduled shift start (first appointment as
// fallback), early departures and missing punch-outs.
// Panama has no DST; all times are local naive, so string compare is safe.
// ===========================================

const CANCELLED = new Set(['Cancelled', 'LateCancelled', 'NoShow'])
/** Grace before an arrival counts as late / a departure as early. */
export const LATE_GRACE_MIN = 5

export interface AttendanceDay {
  date: string
  clockIn: string | null
  clockOut: string | null
  /** Punch pairs in the day (split shifts). */
  shifts: number
  workedMin: number
  missingOut: boolean
  schedStart: string | null
  schedEnd: string | null
  schedMin: number | null
  firstAppt: string | null
  lastApptEnd: string | null
  apptMin: number
  appts: number
  /** clockIn − schedStart (fallback: first appointment); >0 = arrived late. */
  lateMin: number | null
  /** schedEnd (fallback: last appointment end) − clockOut; >0 = left early. */
  earlyOutMin: number | null
}

export interface AttendanceEmployee {
  name: string
  mbName: string | null
  days: number
  workedMin: number
  schedMin: number
  apptMin: number
  appts: number
  lateDays: number
  avgLateMin: number | null
  earlyOutDays: number
  missingOutDays: number
  /** Days with a Mindbody shift but no punch at all. */
  absentDays: number
  detail: AttendanceDay[]
}

export interface AttendancePayload {
  month: string
  months: string[]
  asOf: string
  schedulesLive: boolean
  totals: {
    employees: number
    workedMin: number
    schedMin: number
    apptMin: number
    lateDays: number
    missingOutDays: number
    absentDays: number
  }
  employees: AttendanceEmployee[]
  /** Clock names with no Mindbody staff match (fix via ta_staff_map). */
  unmatched: string[]
}

interface PunchRow {
  employee_name: string
  work_date: string
  clock_in: string | null
  clock_out: string | null
  minutes: number | null
}

interface ApptRow {
  start_datetime: string
  duration_min: number | null
  status: string
  staff_name: string | null
}

const normName = (n: string): string =>
  n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim()

const hhmm = (dt: string): string => dt.slice(11, 16)
const toMin = (t: string): number => +t.slice(0, 2) * 60 + +t.slice(3, 5)

function monthRange(month: string): { start: string; end: string } {
  const y = +month.slice(0, 4)
  const m = +month.slice(5, 7)
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate()
  return { start: `${month.slice(0, 7)}-01`, end: `${month.slice(0, 7)}-${String(last).padStart(2, '0')}` }
}

/** Match each clock name to a Mindbody staff name: manual map → exact → unique first-name. */
function buildNameMatcher(
  clockNames: string[],
  mbNames: string[],
  manual: Map<string, string>
): Map<string, string | null> {
  const byNorm = new Map(mbNames.map(n => [normName(n), n]))
  const byFirst = new Map<string, string[]>()
  for (const n of mbNames) {
    const first = normName(n).split(' ')[0]
    if (!first) continue
    if (!byFirst.has(first)) byFirst.set(first, [])
    byFirst.get(first)!.push(n)
  }
  const out = new Map<string, string | null>()
  for (const clock of clockNames) {
    const manualHit = manual.get(normName(clock))
    if (manualHit) { out.set(clock, manualHit); continue }
    const exact = byNorm.get(normName(clock))
    if (exact) { out.set(clock, exact); continue }
    const first = normName(clock).split(' ')[0]
    const candidates = byFirst.get(first) ?? []
    out.set(clock, candidates.length === 1 ? candidates[0] : null)
  }
  return out
}

/** Per Mindbody staff name per day: merged availability window. */
async function scheduledByStaffDay(
  start: string,
  end: string
): Promise<Map<string, Map<string, { start: string; end: string; min: number }>> | null> {
  try {
    const staff = await getStaff()
    if (staff.length === 0) return null
    const members = await getScheduleItems({ locationIds: [1, 2], staffIds: staff.map(s => s.Id), startDate: start, endDate: end })
    const out = new Map<string, Map<string, { start: string; end: string; min: number }>>()
    for (const m of members) {
      const name = [m.FirstName, m.LastName].filter(Boolean).join(' ').trim()
      if (!name) continue
      for (const a of m.Availabilities ?? []) {
        const s = a.StartDateTime.replace(/Z$/, '')
        const e = a.EndDateTime.replace(/Z$/, '')
        const date = s.slice(0, 10)
        if (!out.has(name)) out.set(name, new Map())
        const days = out.get(name)!
        const cur = days.get(date)
        const block = { start: hhmm(s), end: hhmm(e), min: Math.max(0, (Date.parse(e + 'Z') - Date.parse(s + 'Z')) / 60000) }
        if (!cur) days.set(date, block)
        else days.set(date, {
          start: cur.start < block.start ? cur.start : block.start,
          end: cur.end > block.end ? cur.end : block.end,
          min: cur.min + block.min,
        })
      }
    }
    return out
  } catch (err) {
    console.error('scheduledByStaffDay failed (rendering without):', err)
    return null
  }
}

function fetchAppts(supabase: Supabase, start: string, end: string): Promise<ApptRow[]> {
  return fetchAll<ApptRow>((from, to) =>
    supabase
      .from('mb_appointments')
      .select('start_datetime,duration_min,status,staff_name')
      .gte('start_datetime', `${start}T00:00:00`)
      .lte('start_datetime', `${end}T23:59:59`)
      .order('id', { ascending: true })
      .range(from, to) as unknown as PromiseLike<{ data: ApptRow[] | null; error: { message: string } | null }>
  )
}

export async function getAttendance(month: string | null): Promise<AttendancePayload | { months: [] }> {
  const supabase = serviceClient()

  const { data: monthRows, error: mErr } = await supabase
    .from('ta_punches')
    .select('work_date')
    .order('work_date', { ascending: false })
  if (mErr) throw new Error(mErr.message)
  const months = [...new Set((monthRows ?? []).map(r => `${r.work_date.slice(0, 7)}-01`))]
  if (months.length === 0) return { months: [] }
  const sel = month && months.includes(month) ? month : months[0]
  const { start, end } = monthRange(sel)

  const [punchRows, appts, sched, manualRows] = await Promise.all([
    fetchAll<PunchRow>((from, to) =>
      supabase
        .from('ta_punches')
        .select('employee_name,work_date,clock_in,clock_out,minutes')
        .gte('work_date', start)
        .lte('work_date', end)
        .order('id', { ascending: true })
        .range(from, to) as unknown as PromiseLike<{ data: PunchRow[] | null; error: { message: string } | null }>
    ),
    fetchAppts(serviceClient(), start, end),
    scheduledByStaffDay(start, end),
    supabase.from('ta_staff_map').select('employee_name,mb_staff_name'),
  ])

  const manual = new Map(
    (manualRows.data ?? []).map(r => [normName(r.employee_name), r.mb_staff_name as string])
  )

  // Appointments per staff/day
  const apptByStaffDay = new Map<string, Map<string, { min: number; count: number; first: string; lastEnd: string }>>()
  for (const a of appts) {
    if (!a.staff_name || CANCELLED.has(a.status)) continue
    const date = a.start_datetime.slice(0, 10)
    const startT = hhmm(a.start_datetime)
    const dur = Number(a.duration_min) || 0
    const endMin = toMin(startT) + dur
    const endT = `${String(Math.floor(endMin / 60) % 24).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`
    if (!apptByStaffDay.has(a.staff_name)) apptByStaffDay.set(a.staff_name, new Map())
    const days = apptByStaffDay.get(a.staff_name)!
    const cur = days.get(date)
    if (!cur) days.set(date, { min: dur, count: 1, first: startT, lastEnd: endT })
    else days.set(date, {
      min: cur.min + dur,
      count: cur.count + 1,
      first: startT < cur.first ? startT : cur.first,
      lastEnd: endT > cur.lastEnd ? endT : cur.lastEnd,
    })
  }

  const mbNames = [...new Set([...apptByStaffDay.keys(), ...(sched ? [...sched.keys()] : [])])]
  const clockNames = [...new Set(punchRows.map(p => p.employee_name))]
  const matcher = buildNameMatcher(clockNames, mbNames, manual)

  // Punches per employee/day
  const byEmpDay = new Map<string, Map<string, PunchRow[]>>()
  for (const p of punchRows) {
    if (!byEmpDay.has(p.employee_name)) byEmpDay.set(p.employee_name, new Map())
    const days = byEmpDay.get(p.employee_name)!
    if (!days.has(p.work_date)) days.set(p.work_date, [])
    days.get(p.work_date)!.push(p)
  }

  // Absences only make sense inside the window the clock export covers —
  // otherwise a partial-month upload flags every other scheduled day.
  const punchDates = punchRows.map(p => p.work_date).sort()
  const coveredStart = punchDates[0] ?? start
  const coveredEnd = punchDates[punchDates.length - 1] ?? end

  const employees: AttendanceEmployee[] = []
  for (const [name, days] of byEmpDay) {
    const mbName = matcher.get(name) ?? null
    const schedDays = mbName && sched ? sched.get(mbName) : undefined
    const apptDays = mbName ? apptByStaffDay.get(mbName) : undefined

    const detail: AttendanceDay[] = []
    const dates = new Set<string>([...days.keys()])
    // days with a scheduled shift but no punch → absent
    if (schedDays) for (const d of schedDays.keys()) if (d >= coveredStart && d <= coveredEnd) dates.add(d)

    for (const date of [...dates].sort()) {
      const punches = days.get(date) ?? []
      // Postgres time columns come back as HH:MM:SS — trim to HH:MM
      const ins = punches.map(p => p.clock_in?.slice(0, 5)).filter((t): t is string => !!t).sort()
      const outs = punches.map(p => p.clock_out?.slice(0, 5)).filter((t): t is string => !!t).sort()
      const clockIn = ins[0] ?? null
      const clockOut = outs[outs.length - 1] ?? null
      const workedMin = punches.reduce((s, p) => s + (Number(p.minutes) || 0), 0)
      const sc = schedDays?.get(date)
      const ap = apptDays?.get(date)
      const refStart = sc?.start ?? ap?.first ?? null
      const refEnd = sc?.end ?? ap?.lastEnd ?? null
      detail.push({
        date,
        clockIn,
        clockOut,
        shifts: punches.length,
        workedMin,
        missingOut: punches.some(p => p.clock_in && !p.clock_out),
        schedStart: sc?.start ?? null,
        schedEnd: sc?.end ?? null,
        schedMin: sc ? Math.round(sc.min) : null,
        firstAppt: ap?.first ?? null,
        lastApptEnd: ap?.lastEnd ?? null,
        apptMin: ap?.min ?? 0,
        appts: ap?.count ?? 0,
        lateMin: clockIn && refStart ? toMin(clockIn) - toMin(refStart) : null,
        earlyOutMin: clockOut && refEnd ? toMin(refEnd) - toMin(clockOut) : null,
      })
    }

    const worked = detail.filter(d => d.shifts > 0)
    const lateVals = worked.map(d => d.lateMin).filter((v): v is number => v !== null && v > LATE_GRACE_MIN)
    employees.push({
      name,
      mbName,
      days: worked.length,
      workedMin: worked.reduce((s, d) => s + d.workedMin, 0),
      schedMin: detail.reduce((s, d) => s + (d.schedMin ?? 0), 0),
      apptMin: worked.reduce((s, d) => s + d.apptMin, 0),
      appts: worked.reduce((s, d) => s + d.appts, 0),
      lateDays: lateVals.length,
      avgLateMin: lateVals.length ? Math.round(lateVals.reduce((a, b) => a + b, 0) / lateVals.length) : null,
      earlyOutDays: worked.filter(d => d.earlyOutMin !== null && d.earlyOutMin > LATE_GRACE_MIN && !d.missingOut).length,
      missingOutDays: worked.filter(d => d.missingOut).length,
      absentDays: detail.filter(d => d.shifts === 0).length,
      detail,
    })
  }
  employees.sort((a, b) => b.workedMin - a.workedMin)

  return {
    month: sel,
    months,
    asOf: end,
    schedulesLive: sched !== null,
    totals: {
      employees: employees.length,
      workedMin: employees.reduce((s, e) => s + e.workedMin, 0),
      schedMin: employees.reduce((s, e) => s + e.schedMin, 0),
      apptMin: employees.reduce((s, e) => s + e.apptMin, 0),
      lateDays: employees.reduce((s, e) => s + e.lateDays, 0),
      missingOutDays: employees.reduce((s, e) => s + e.missingOutDays, 0),
      absentDays: employees.reduce((s, e) => s + e.absentDays, 0),
    },
    employees,
    unmatched: clockNames.filter(n => !matcher.get(n)),
  }
}
