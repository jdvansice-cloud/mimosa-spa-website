'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { TvAgenda, TvAppointment } from '@/lib/tv/agenda'

// ===========================================
// TV Agenda — read-only daily calendar for the therapist work area,
// shown full-screen on an Android TV browser. Mirrors the Mindbody day
// view: one column per therapist, amber bands for working hours,
// labeled white blocks for unavailabilities (ALMUERZO…), colored
// appointment blocks (client, treatment, cabina) and a running red
// now-line. The whole day always fits the screen — no scrolling, no
// pointer interactions.
// ===========================================

const REFRESH_MS = 2 * 60_000 // refetch from Mindbody every 2 min
const HEADER_H = 56 // staff header row px (clock + date / name + working hours)
const GUTTER_W = 52 // time gutter px — thin, hours only; the width goes to the columns


/** Color by the visit's leading kind, so a glance says "massage" vs "facial". */
const KIND_COLORS: Record<Kind, { bg: string; fg: string }> = {
  massage: { bg: '#b5657f', fg: '#ffffff' }, // rose
  extra:   { bg: '#8ea8c3', fg: '#10222f' }, // slate
  facial:  { bg: '#7fb8a4', fg: '#0f2b22' }, // teal
  foot:    { bg: '#c9a15f', fg: '#2e2005' }, // gold
}
/**
 * Status overrides kind: an arrived client turns the tile green (they're
 * here — go), a finished visit fades to gray so the eye skips it, a no-show
 * turns red so nobody keeps a cabina waiting. Only UPCOMING visits keep
 * their kind color.
 */
const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  Arrived:   { bg: '#4f9a6e', fg: '#ffffff' }, // client is here — go
  Completed: { bg: '#cfcac0', fg: '#5a544a' }, // done — recede
  NoShow:    { bg: '#c94a4a', fg: '#ffffff' }, // didn't come — shout
}
function visitColor(v: Visit) {
  return STATUS_COLORS[v.status] ?? KIND_COLORS[v.items[0]?.kind ?? 'massage']
}

/**
 * The four kinds of work a therapist sees on the board, in the order the
 * spa runs them: massages first, then extras, facials, and foot massage.
 * Classified from the service name — Mindbody's own categories aren't on
 * the appointment payload.
 */
type Kind = 'massage' | 'extra' | 'facial' | 'foot'
const KIND_ORDER: Record<Kind, number> = { massage: 0, extra: 1, facial: 2, foot: 3 }

function kindOf(serviceName: string): Kind {
  const n = serviceName.toLowerCase()
  if (/^extra\b|adicional|add[- ]?on/.test(n)) return 'extra'
  if (/\bpies?\b|\bfoot\b|reflexolog|pedicur/.test(n)) return 'foot'
  if (/facial|mascarilla|limpieza|hidrataci|antiedad|peeling|microderm/.test(n) && !/corporal/.test(n)) return 'facial'
  return 'massage'
}

interface VisitItem {
  name: string
  kind: Kind
  minutes: number
  startMin: number
}

/** One box on the board: everything a client is having in one sitting. */
interface Visit {
  id: number
  clientName: string | null
  startMin: number
  endMin: number
  status: string
  resourceName: string | null
  items: VisitItem[]
}

interface PlacedAppt {
  a: Visit
  lane: number
  lanes: number
}

/** "Mimosa Relax - 60 min" → "Mimosa Relax"; the minutes are shown separately. */
function stripDuration(name: string): string {
  // Catches "- 60 min", "(10 min)" and the bare "45 min" some names use.
  return name
    .replace(/\s*[-–]?\s*\(?\s*\d+\s*min\.?\s*\)?\s*$/i, '')
    .trim()
}

/**
 * Break-room shorthand: drop the brand/category prefixes every therapist
 * already knows ("Mimosa Profundo" → "Profundo") so long names survive a
 * 150px column. The kind color still says massage vs facial vs pies.
 */
function shortServiceName(name: string): string {
  return name
    .replace(/^mimosa\s+/i, '')
    .replace(/^masaje\s+(de\s+)?/i, '')
    .replace(/^facial\s+de\s+/i, '')
    .replace(/^tratamiento\s+(de\s+)?/i, '')
    .trim()
}

/** Whichever status matters most for the floor wins for the whole visit. */
function visitStatus(statuses: string[]): string {
  if (statuses.includes('NoShow')) return 'NoShow'
  if (statuses.every(x => x === 'Completed')) return 'Completed'
  if (statuses.includes('Arrived')) return 'Arrived'
  return statuses[0] ?? ''
}

/**
 * Group a therapist's appointments into VISITS: every appointment of the
 * same client that overlaps or follows within a short gap joins one box, no
 * matter its length. Mindbody books a 150-min Day Spa as three or four
 * separate appointments — the therapist needs to see one block with the
 * whole list, not four fragments. Unnamed appointments and different
 * clients never merge, so a real double booking stays visibly split.
 */
const VISIT_GAP_MIN = 10

function buildVisits(appts: TvAppointment[]): Visit[] {
  const sorted = [...appts].sort((x, y) => x.startMin - y.startMin)
  const visits: Visit[] = []
  const statuses = new Map<number, string[]>()

  for (const a of sorted) {
    const v = a.clientName
      ? visits.find(
          x => x.clientName === a.clientName && a.startMin <= x.endMin + VISIT_GAP_MIN && a.endMin >= x.startMin - VISIT_GAP_MIN
        )
      : undefined
    const item: VisitItem = {
      name: shortServiceName(stripDuration(a.serviceName)),
      kind: kindOf(a.serviceName),
      minutes: a.endMin - a.startMin,
      startMin: a.startMin,
    }
    if (v) {
      v.items.push(item)
      v.startMin = Math.min(v.startMin, a.startMin)
      v.endMin = Math.max(v.endMin, a.endMin)
      v.resourceName = v.resourceName ?? a.resourceName
      statuses.get(v.id)!.push(a.status)
    } else {
      visits.push({
        id: a.id,
        clientName: a.clientName,
        startMin: a.startMin,
        endMin: a.endMin,
        status: a.status,
        resourceName: a.resourceName,
        items: [item],
      })
      statuses.set(a.id, [a.status])
    }
  }

  for (const v of visits) {
    v.status = visitStatus(statuses.get(v.id) ?? [])
    // The spa's running order, then chronological within a kind.
    v.items.sort((x, y) => KIND_ORDER[x.kind] - KIND_ORDER[y.kind] || x.startMin - y.startMin)
  }
  return visits
}

function layoutColumn(appts: Visit[]): PlacedAppt[] {
  const sorted = [...appts].sort(
    (x, y) => x.startMin - y.startMin || (y.endMin - y.startMin) - (x.endMin - x.startMin)
  )
  const placed: PlacedAppt[] = sorted.map(a => ({ a, lane: 0, lanes: 1 }))

  let cluster: PlacedAppt[] = []
  let clusterEnd = -1
  const laneEnds: number[] = []
  const flush = () => {
    const n = Math.max(...cluster.map(p => p.lane)) + 1
    cluster.forEach(p => { p.lanes = n })
    cluster = []
    laneEnds.length = 0
  }

  for (const p of placed) {
    if (cluster.length > 0 && p.a.startMin >= clusterEnd) flush()
    let lane = laneEnds.findIndex(end => end <= p.a.startMin)
    if (lane === -1) { lane = laneEnds.length; laneEnds.push(0) }
    laneEnds[lane] = p.a.endMin
    p.lane = lane
    cluster.push(p)
    clusterEnd = Math.max(clusterEnd, p.a.endMin)
  }
  if (cluster.length > 0) flush()
  return placed
}

function panamaToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Panama' }).format(new Date())
}

/** Current minutes-from-midnight in Panama. */
function panamaNowMin(): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Panama', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date())
  return Number(parts.slice(0, 2)) * 60 + Number(parts.slice(3, 5))
}

/** "11:00" — no a.m./p.m.; inside the grid the position already says which. */
const labelShort = (min: number): string => {
  const h24 = Math.floor(min / 60) % 24
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(min % 60).padStart(2, '0')}`
}

/**
 * "Mié 02 Sep" — the board only ever shows today. Hand-rolled Spanish
 * abbreviations: ICU's es short forms come out as "sept." / "mié." with
 * locale-dependent dots and casing, and the TV needs one fixed look.
 */
const DOW_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MON_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
function dayLabel(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Panama', weekday: 'short', day: '2-digit', month: 'numeric',
  }).formatToParts(new Date())
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? ''
  const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  return `${DOW_ES[dow] ?? ''} ${get('day')} ${MON_ES[Number(get('month')) - 1] ?? ''}`
}

export function TvAgendaClient({ location, token }: { location: number; token: string }) {
  const [data, setData] = useState<TvAgenda | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [nowMin, setNowMin] = useState(panamaNowMin())
  const [gridH, setGridH] = useState(600)
  const gridTopRef = useRef<HTMLDivElement | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/tv/agenda?location=${location}&date=${panamaToday()}&token=${encodeURIComponent(token)}`,
        { cache: 'no-store' }
      )
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error || `Error ${res.status}`)
      }
      setData(await res.json())
      setError(null)
    } catch (err) {
      // Keep the last good schedule on screen; only surface the error when empty
      setError(err instanceof Error ? err.message : 'No se pudo cargar')
    }
  }, [location, token])

  useEffect(() => {
    load()
    const t = setInterval(load, REFRESH_MS)
    return () => clearInterval(t)
  }, [load])

  // Now-line ticks every 30s
  useEffect(() => {
    const t = setInterval(() => setNowMin(panamaNowMin()), 30_000)
    return () => clearInterval(t)
  }, [])

  // Fit the full day into whatever is below the staff header — no scroll
  useEffect(() => {
    const measure = () => {
      const top = gridTopRef.current?.getBoundingClientRect().top ?? 0
      setGridH(Math.max(200, window.innerHeight - top - 4))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [data])

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f1e7] text-2xl text-[#7a6f5d]">
        {error ?? 'Cargando agenda…'}
      </div>
    )
  }

  const { windowStartMin, windowEndMin, columns } = data
  const totalMin = windowEndMin - windowStartMin
  const pxPerMin = gridH / totalMin
  const y = (min: number) => (min - windowStartMin) * pxPerMin
  const hours: number[] = []
  for (let m = Math.ceil(windowStartMin / 60) * 60; m <= windowEndMin; m += 60) hours.push(m)
  const showNow = nowMin >= windowStartMin && nowMin <= windowEndMin

  return (
    <div className="h-screen select-none overflow-hidden bg-[#f6f1e7] [cursor:none]">
      {/* Staff header row */}
      <div className="flex" style={{ height: HEADER_H }}>
        <div
          className="flex shrink-0 flex-col items-center justify-center border-b border-r border-[#d8cfc0] bg-[#2b2620] leading-tight text-[#f6f1e7]"
          style={{ width: GUTTER_W }}
        >
          <span className="text-[16px] font-black tabular-nums">{labelShort(nowMin)}</span>
          <span className="text-[12px] font-bold tabular-nums text-[#f8c471]">{dayLabel()}</span>
        </div>
        {columns.map(c => (
          <div
            key={c.staffId}
            className="flex min-w-0 flex-1 items-center justify-center border-b border-r border-[#d8cfc0] bg-[#3a342b] px-1 text-center"
          >
            <span className="flex min-w-0 flex-col items-center leading-tight">
              <span className="truncate text-[15px] font-bold text-white">{c.staffName}</span>
              <span className="truncate text-[12px] tabular-nums text-[#f8c471]">
                {c.availability.length > 0
                  ? c.availability.map(b => `${labelShort(b.startMin)}–${labelShort(b.endMin)}`).join(' · ')
                  : 'sin horario'}
              </span>
            </span>
          </div>
        ))}
        {columns.length === 0 && (
          <div className="flex flex-1 items-center justify-center border-b border-[#d8cfc0] text-sm text-[#7a6f5d]">
            Sin terapeutas programadas hoy
          </div>
        )}
      </div>

      {/* Time grid */}
      <div ref={gridTopRef} className="relative flex" style={{ height: gridH }}>
        {/* Hour gutter */}
        <div className="relative shrink-0 border-r border-[#d8cfc0] bg-[#efe8da]" style={{ width: GUTTER_W }}>
          {hours.map(m => (
            <span
              key={m}
              className="absolute right-1.5 -translate-y-1/2 whitespace-nowrap text-[13px] font-bold tabular-nums text-[#7a6f5d]"
              style={{ top: y(m) }}
            >
              {(Math.floor(m / 60) % 12) === 0 ? 12 : Math.floor(m / 60) % 12}
              <span className="text-[9px] font-semibold">{m < 12 * 60 ? 'am' : 'pm'}</span>
            </span>
          ))}
        </div>

        {columns.map(c => (
          <div key={c.staffId} className="relative min-w-0 flex-1 border-r border-[#d8cfc0] bg-white">
            {/* Working hours — amber band, like Mindbody */}
            {c.availability.map((b, i) => (
              <div
                key={`av${i}`}
                className="absolute inset-x-0 bg-[#f8c471]/60"
                style={{ top: y(Math.max(b.startMin, windowStartMin)), height: (Math.min(b.endMin, windowEndMin) - Math.max(b.startMin, windowStartMin)) * pxPerMin }}
              />
            ))}
            {/* Hour rules */}
            {hours.map(m => (
              <div key={m} className="absolute inset-x-0 border-t border-[#e2dacb]" style={{ top: y(m) }} />
            ))}
            {/* Unavailabilities (lunch, blocks) — labeled white cards */}
            {/* Unavailabilities read as "not here", not as events: a hatched
                gray band with one small label. The grid already shows when. */}
            {c.unavailabilities.map((u, i) => (
              <div
                key={`un${i}`}
                className="absolute inset-x-0 z-10 flex items-start justify-center overflow-hidden"
                style={{
                  top: y(Math.max(u.startMin, windowStartMin)),
                  height: Math.max((Math.min(u.endMin, windowEndMin) - Math.max(u.startMin, windowStartMin)) * pxPerMin, 12),
                  background: 'repeating-linear-gradient(-45deg, #eae4d8 0 8px, #f3eee4 8px 16px)',
                }}
              >
                <span className="mt-0.5 truncate px-1 text-[10px] font-bold uppercase tracking-wide text-[#8b8170]">
                  {u.label}
                </span>
              </div>
            ))}
            {/* Appointments */}
            {layoutColumn(buildVisits(c.appointments)).map(({ a, lane, lanes }) => {
              const color = visitColor(a)
              const h = Math.max((a.endMin - a.startMin) * pxPerMin, 16)
              const compact = h < 56
              const laneW = 100 / lanes
              return (
                <div
                  key={a.id}
                  className="absolute z-20 overflow-hidden rounded-md px-1.5 py-0.5 shadow-sm"
                  style={{
                    top: y(a.startMin),
                    height: h,
                    left: `calc(${lane * laneW}% + 2px)`,
                    width: `calc(${laneW}% - 4px)`,
                    background: color.bg,
                    color: color.fg,
                    borderLeft: `4px solid rgba(0,0,0,0.25)`,
                    // Completed visits also drop their shadow so they sit flat
                    opacity: a.status === 'Completed' ? 0.85 : 1,
                  }}
                >
                  {a.status === 'Completed' && (
                    <span className="absolute right-1 top-0.5 text-[12px] font-black leading-none" title="Completada">✓</span>
                  )}
                  {a.status === 'Arrived' && (
                    <span className="absolute right-1 top-0.5 rounded bg-white/90 px-1 text-[9px] font-black leading-tight text-[#2f6b47]">
                      LLEGÓ
                    </span>
                  )}
                  {a.status === 'NoShow' && (
                    <span className="absolute right-1 top-0.5 rounded bg-white px-1 text-[9px] font-black leading-tight text-[#c94a4a]">
                      NO SHOW
                    </span>
                  )}
                  {/* When they're booked — the first thing the eye lands on */}
                  <p className="truncate pr-12 text-[14px] font-black leading-tight tabular-nums">
                    {labelShort(a.startMin)}–{labelShort(a.endMin)}
                    {a.resourceName ? <span className="font-semibold opacity-80"> · {a.resourceName}</span> : null}
                  </p>
                  <p className="truncate text-[13px] font-bold leading-tight opacity-95">
                    {a.clientName ?? '—'}
                  </p>
                  {/* What to do, in running order: massages → extras → facials →
                      pies. Names wrap instead of truncating — the whole point
                      of the board is knowing WHICH treatment. */}
                  {compact ? (
                    <p className="text-[12px] font-semibold leading-tight opacity-90 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                      {a.items.map(i => i.name).join(' · ')}
                    </p>
                  ) : (
                    <ul className="mt-0.5 space-y-px">
                      {a.items.map((i, idx) => (
                        <li key={idx} className="flex items-baseline gap-1 text-[12px] font-semibold leading-[1.15]">
                          <span className="min-w-0 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">{i.name}</span>
                          <span className="ml-auto shrink-0 pl-1 text-[11px] tabular-nums opacity-75">{i.minutes}′</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        {/* Running now-line across the whole grid */}
        {showNow && (
          <div className="pointer-events-none absolute inset-x-0 z-30" style={{ top: y(nowMin) }}>
            <div className="border-t-2 border-red-500" />
            <span className="absolute -top-2.5 left-0.5 rounded-full bg-red-500 px-1.5 py-px text-[11px] font-bold tabular-nums text-white">
              {labelShort(nowMin)}
            </span>
          </div>
        )}

        {/* Stale-data notice if a refresh fails while showing an old schedule */}
        {error && (
          <div className="absolute bottom-1 right-2 z-40 rounded bg-red-600/90 px-2 py-0.5 text-[10px] font-semibold text-white">
            Sin conexión — mostrando última agenda
          </div>
        )}
      </div>
    </div>
  )
}
