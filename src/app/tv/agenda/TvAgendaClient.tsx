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
const HEADER_H = 44 // staff header row px
const GUTTER_W = 64 // time gutter px

/** Stable muted palette keyed by session type, echoing Mindbody's per-service colors. */
const SERVICE_COLORS = [
  { bg: '#8ea8c3', fg: '#10222f' }, // slate blue
  { bg: '#b5657f', fg: '#ffffff' }, // rose
  { bg: '#7fb8a4', fg: '#0f2b22' }, // teal
  { bg: '#b39ddb', fg: '#231a3a' }, // lavender
  { bg: '#c9a15f', fg: '#2e2005' }, // gold
  { bg: '#9d7fb8', fg: '#ffffff' }, // purple
  { bg: '#6f9fbf', fg: '#ffffff' }, // steel
  { bg: '#c98a8a', fg: '#331111' }, // clay
] as const

function serviceColor(a: TvAppointment) {
  const key = a.sessionTypeId ?? 0
  return SERVICE_COLORS[Math.abs(key) % SERVICE_COLORS.length]
}

interface MergedAppt extends TvAppointment {
  /** Add-on services absorbed into this block (same client, overlapping time). */
  addons: string[]
}

interface PlacedAppt {
  a: MergedAppt
  lane: number
  lanes: number
}

/** "Mimosa Relax - 60 min" → "Mimosa Relax"; the block's height already says the duration. */
function stripDuration(name: string): string {
  // Catches "- 60 min", "(10 min)" and the bare "45 min" some names use.
  return name
    .replace(/\s*[-–]?\s*\(?\s*\d+\s*min\.?\s*\)?\s*$/i, '')
    .trim()
}

/**
 * Fold add-ons into their parent service. Mindbody books an "Extra Piedras
 * Calientes (10 min)" as its own overlapping appointment, which on the TV
 * became a second cramped block stealing half the column width. Any shorter
 * appointment of the SAME client that overlaps (or starts within 5 min of)
 * a longer one is absorbed: the parent block stretches to cover it and lists
 * it as a "+ …" line. Different clients never merge — a true double booking
 * must stay visible as two blocks.
 */
function mergeAddons(appts: TvAppointment[]): MergedAppt[] {
  const sorted = [...appts].sort((x, y) => (y.endMin - y.startMin) - (x.endMin - x.startMin))
  const out: MergedAppt[] = []
  for (const a of sorted) {
    const parent = a.clientName
      ? out.find(p =>
          p.clientName === a.clientName &&
          a.startMin < p.endMin + 5 && a.endMin > p.startMin - 5
        )
      : undefined
    if (parent) {
      parent.addons.push(stripDuration(a.serviceName))
      parent.startMin = Math.min(parent.startMin, a.startMin)
      parent.endMin = Math.max(parent.endMin, a.endMin)
      // Completed/NoShow on the parent wins; an add-on never downgrades it.
    } else {
      out.push({ ...a, addons: [] })
    }
  }
  return out
}

/**
 * Side-by-side lanes within one therapist column: appointments whose times
 * overlap (add-ons in cabina) share the width instead of painting on top of
 * each other. Same approach as the KPIs agenda.
 */
function layoutColumn(appts: MergedAppt[]): PlacedAppt[] {
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

const label12h = (min: number): string => {
  const h24 = Math.floor(min / 60) % 24
  const mm = min % 60
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(mm).padStart(2, '0')} ${h24 < 12 ? 'a.m.' : 'p.m.'}`
}

const DAY_LABEL = new Intl.DateTimeFormat('es-PA', {
  timeZone: 'America/Panama', weekday: 'long', day: 'numeric', month: 'long',
})

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
          <span className="text-[13px] font-bold tabular-nums">{label12h(nowMin)}</span>
          <span className="text-[9px] capitalize opacity-70">{DAY_LABEL.format(new Date())}</span>
        </div>
        {columns.map(c => (
          <div
            key={c.staffId}
            className="flex min-w-0 flex-1 items-center justify-center border-b border-r border-[#d8cfc0] bg-[#3a342b] px-1 text-center"
          >
            <span className="truncate text-[13px] font-semibold leading-tight text-white">
              {c.staffName}
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
              className="absolute right-1.5 -translate-y-1/2 whitespace-nowrap text-[11px] font-medium tabular-nums text-[#7a6f5d]"
              style={{ top: y(m) }}
            >
              {label12h(m)}
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
            {layoutColumn(mergeAddons(c.appointments)).map(({ a, lane, lanes }) => {
              const color = serviceColor(a)
              const h = Math.max((a.endMin - a.startMin) * pxPerMin, 16)
              const compact = h < 40
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
                    borderLeft: a.status === 'NoShow' ? '4px solid #dc2626' : `4px solid rgba(0,0,0,0.25)`,
                    // No-shows stay fully visible, marked with red stripes + badge
                    backgroundImage: a.status === 'NoShow'
                      ? 'repeating-linear-gradient(45deg, rgba(220,38,38,0.28) 0 6px, transparent 6px 14px)'
                      : undefined,
                  }}
                >
                  {a.status === 'Completed' && (
                    <span className="absolute right-1 top-0.5 text-[12px] font-black leading-none" title="Completada">✓</span>
                  )}
                  {a.status === 'Arrived' && (
                    <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-1 ring-white/70" title="Llegó" />
                  )}
                  {a.status === 'NoShow' && (
                    <span className="absolute right-1 top-0.5 rounded bg-red-600 px-1 text-[9px] font-black leading-tight text-white">
                      NO SHOW
                    </span>
                  )}
                  <p className="truncate pr-4 text-[13px] font-bold leading-tight">
                    {stripDuration(a.serviceName)}
                  </p>
                  <p className="truncate text-[12px] font-semibold leading-tight opacity-95">
                    {a.clientName ?? '—'}
                  </p>
                  {a.addons.length > 0 && (
                    <p className="truncate text-[10px] font-medium leading-tight opacity-90">
                      + {a.addons.join(' · + ')}
                    </p>
                  )}
                  {!compact && (
                    <p className="truncate text-[10px] leading-tight opacity-85 tabular-nums">
                      {label12h(a.startMin)}–{label12h(a.endMin)}
                      {a.resourceName ? ` · ${a.resourceName}` : ''}
                    </p>
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
            <span className="absolute -top-2.5 left-1 rounded-full bg-red-500 px-1.5 py-px text-[10px] font-bold tabular-nums text-white">
              {label12h(nowMin)}
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
