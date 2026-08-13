import { panamaToday } from './sync'
import {
  fetchAll,
  rangeFor,
  serviceClient,
  type KpiLocation,
  type KpiPeriod,
  type KpiSeries,
  type Supabase,
} from './queries'

// ===========================================
// Marketing page (/admin/kpis/marketing): first-party web analytics.
// Sessions, page views, acquisition channels and the booking funnel,
// all from the web_events table (fed by /api/track). Includes today —
// events stream in live, unlike the Mindbody-synced pages.
// ===========================================

// Real widget order (store STEP_ORDER): datetime comes BEFORE staff.
// booking_start is the true funnel top (fired for every visitor, including
// already-authenticated ones who skip the auth step).
// P2 collapsed flow: services (location pill + inline add-ons) → datetime
// (optional therapist) → auth → confirm. Legacy step events from before the
// collapse simply won't appear in new sessions.
const FUNNEL_STEPS = [
  'booking_start',
  'booking_step_services',
  'booking_step_datetime',
  'booking_step_auth',
  'booking_step_confirm',
  'booking_completed',
] as const

export interface MarketingPayload {
  period: KpiPeriod
  location: KpiLocation
  asOf: string
  range: { start: string; end: string }
  firstEventDate: string | null
  traffic: {
    pageViews: number
    sessions: number
    viewsPerSession: number | null
    mobilePct: number | null
    topPages: Array<{ path: string; views: number }>
    series: KpiSeries // daily page views (current only)
  }
  channels: Array<{ channel: string; sessions: number; bookingStarts: number; bookings: number }>
  funnel: {
    steps: Array<{ step: string; sessions: number }>
    /** completed ÷ sessions that opened the booking flow */
    startToComplete: number | null
    /** completed ÷ all site sessions */
    visitToComplete: number | null
    completed: number
  }
  /** Online bookings completed vs appointments taking place in the period (directional). */
  onlineShare: { completed: number; appointments: number; pct: number | null }
}

interface EventRow {
  event_date: string
  event: string
  session_id: string
  path: string | null
  device: string | null
  utm_source: string | null
  utm_medium: string | null
  referrer: string | null
  location_id: number | null
}

function fetchEvents(supabase: Supabase, start: string, end: string): Promise<EventRow[]> {
  return fetchAll<EventRow>((from, to) =>
    supabase
      .from('web_events')
      .select('event_date,event,session_id,path,device,utm_source,utm_medium,referrer,location_id')
      .gte('event_date', start)
      .lte('event_date', end)
      .order('id', { ascending: true })
      .range(from, to) as unknown as PromiseLike<{ data: EventRow[] | null; error: { message: string } | null }>
  )
}

/** utm_source wins; otherwise referrer host; otherwise direct. */
function channelOf(e: EventRow): string {
  if (e.utm_source) {
    const s = e.utm_source.toLowerCase()
    if (s === 'ig') return 'instagram'
    if (s === 'fb') return 'facebook'
    if (s === 'wa') return 'whatsapp'
    return s
  }
  if (e.referrer) {
    try {
      const host = new URL(e.referrer).hostname.replace(/^www\./, '')
      if (host.includes('instagram')) return 'instagram'
      if (host.includes('facebook') || host.includes('fb.com')) return 'facebook'
      if (host.includes('google')) return 'google'
      if (host.includes('whatsapp') || host.includes('wa.me')) return 'whatsapp'
      if (host.includes('tiktok')) return 'tiktok'
      return host
    } catch {
      return 'referral'
    }
  }
  return 'direct'
}

function listDays(start: string, end: string): string[] {
  const out: string[] = []
  for (let t = Date.parse(`${start}T00:00:00Z`); t <= Date.parse(`${end}T00:00:00Z`); t += 86400000) {
    out.push(new Date(t).toISOString().slice(0, 10))
  }
  return out
}

export async function getMarketing(period: KpiPeriod, location: KpiLocation): Promise<MarketingPayload> {
  const supabase = serviceClient()
  const asOf = panamaToday() // live data — include today
  const range = rangeFor(period, asOf)

  const [events, apptRes, firstRes] = await Promise.all([
    fetchEvents(supabase, range.start, range.end),
    (() => {
      let q = supabase
        .from('mb_appointments')
        .select('id', { count: 'exact', head: true })
        .gte('start_datetime', `${range.start}T00:00:00`)
        .lte('start_datetime', `${range.end}T23:59:59`)
        .not('status', 'in', '("Cancelled","LateCancelled","NoShow")')
      if (location !== 'all') q = q.eq('location_id', location)
      return q
    })(),
    supabase.from('web_events').select('event_date').order('id', { ascending: true }).limit(1).maybeSingle(),
  ])

  // Booking-funnel events can carry a location; page views don't. When a
  // location filter is on, keep page traffic global but filter the funnel.
  const funnelEvents = events.filter(e =>
    e.event.startsWith('booking') && (location === 'all' || e.location_id === null || e.location_id === location)
  )

  const pageViews = events.filter(e => e.event === 'page_view')
  const sessionIds = new Set(events.map(e => e.session_id))
  const mobileSessions = new Set(events.filter(e => e.device === 'mobile').map(e => e.session_id))

  // Daily page-view series
  const days = listDays(range.start, range.end)
  const byDay = new Map<string, number>()
  for (const e of pageViews) byDay.set(e.event_date, (byDay.get(e.event_date) ?? 0) + 1)
  const series: KpiSeries = {
    unit: 'day',
    labels: days.map(d => String(Number(d.slice(8, 10)))),
    current: days.map(d => (d > asOf ? null : byDay.get(d) ?? 0)),
    previous: days.map(() => null),
  }

  // Top pages
  const pathCounts = new Map<string, number>()
  for (const e of pageViews) {
    const p = (e.path ?? '/').replace(/^\/(es|en)(\/|$)/, '/') || '/'
    pathCounts.set(p, (pathCounts.get(p) ?? 0) + 1)
  }
  const topPages = [...pathCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, views]) => ({ path, views }))

  // Funnel: distinct sessions per step
  const stepSessions = new Map<string, Set<string>>()
  for (const e of funnelEvents) {
    const set = stepSessions.get(e.event) ?? new Set<string>()
    set.add(e.session_id)
    stepSessions.set(e.event, set)
  }
  const funnelSteps = FUNNEL_STEPS.map(step => ({ step, sessions: stepSessions.get(step)?.size ?? 0 }))
  const opened = funnelSteps[0].sessions
  const completed = funnelSteps[funnelSteps.length - 1].sessions

  // Channels: session → first-touch channel; count booking starts/completes per channel
  const sessionChannel = new Map<string, string>()
  for (const e of events) {
    if (!sessionChannel.has(e.session_id)) sessionChannel.set(e.session_id, channelOf(e))
  }
  const chAgg = new Map<string, { sessions: number; bookingStarts: number; bookings: number }>()
  const startedSessions = stepSessions.get('booking_step_auth') ?? new Set<string>()
  const completedSessions = stepSessions.get('booking_completed') ?? new Set<string>()
  for (const [sid, ch] of sessionChannel) {
    const e = chAgg.get(ch) ?? { sessions: 0, bookingStarts: 0, bookings: 0 }
    e.sessions++
    if (startedSessions.has(sid)) e.bookingStarts++
    if (completedSessions.has(sid)) e.bookings++
    chAgg.set(ch, e)
  }
  const channels = [...chAgg.entries()]
    .map(([channel, v]) => ({ channel, ...v }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 12)

  const appointments = apptRes.count ?? 0

  return {
    period,
    location,
    asOf,
    range,
    firstEventDate: firstRes.data?.event_date ?? null,
    traffic: {
      pageViews: pageViews.length,
      sessions: sessionIds.size,
      viewsPerSession: sessionIds.size > 0 ? Math.round((10 * pageViews.length) / sessionIds.size) / 10 : null,
      mobilePct: sessionIds.size > 0 ? mobileSessions.size / sessionIds.size : null,
      topPages,
      series,
    },
    channels,
    funnel: {
      steps: funnelSteps,
      startToComplete: opened > 0 ? completed / opened : null,
      visitToComplete: sessionIds.size > 0 ? completed / sessionIds.size : null,
      completed,
    },
    onlineShare: {
      completed,
      appointments,
      pct: appointments > 0 ? completed / appointments : null,
    },
  }
}
