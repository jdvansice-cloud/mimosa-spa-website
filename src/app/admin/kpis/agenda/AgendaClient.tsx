'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import type { AgendaAppointment, AgendaMonth, StaffAvailability } from '@/lib/kpis/report'
import { BlackSpinner, CardBox, DeltaChip, Label, LoadingCard, deltaPct } from '../shared'
import { LangProvider, LangToggle, MONTHS_LONG, WEEKDAY_LETTERS, formatDateLang, useLang, useT } from '../i18n'
import { prefetchStaffKpis } from '../prefetch'

// ===========================================
// Agenda — calendario mensual con citas por día; al tocar un día se abre
// la vista de horario (columnas por terapeuta, bloques por hora) marcando
// realizadas y no-shows, con una franja semanal para cambiar de día.
// ===========================================

type LocationKey = 'all' | '1' | '2'

const LOCATIONS: Array<{ key: LocationKey; label: string }> = [
  { key: 'all', label: 'Todas' },
  { key: '1', label: 'Costa del Este' },
  { key: '2', label: 'San Francisco' },
]

const MIN_MONTH = '2024-07'
const HOUR_PX = 72
// Blocks shorter than this render as if they lasted this long, so tiny
// add-on segments stay readable and get pushed into a side lane.
const MIN_VISUAL_MIN = 20

function panamaToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Panama' }).format(new Date())
}

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + delta, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

function addDaysStr(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Monday of the week containing `date`. */
function mondayOf(date: string): string {
  const dow = (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7
  return addDaysStr(date, -dow)
}

/** First-name + last-name initials (e.g. "Luz Marina Pérez" → "LP"). */
function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

type DayState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; appointments: AgendaAppointment[]; availability: StaffAvailability[] }

/** Block color by appointment status. */
function statusClasses(status: string): string {
  if (status === 'NoShow') return 'bg-red-50 border-red-300'
  if (status === 'Completed') return 'bg-spa-green/20 border-spa-green/60'
  if (status === 'Arrived') return 'bg-gold-100 border-gold-500'
  return 'bg-white border-beige-500' // Booked / Confirmed / Requested — sin llegar
}

interface PlacedAppt {
  a: AgendaAppointment
  lane: number
  lanes: number
  visualMin: number
}

/**
 * Side-by-side lane layout for one therapist column: appointments whose
 * (visual) times overlap share the column width instead of stacking.
 */
function layoutColumn(appts: AgendaAppointment[]): PlacedAppt[] {
  const sorted = [...appts].sort((x, y) => x.startMin - y.startMin || y.durationMin - x.durationMin)
  const placed: PlacedAppt[] = sorted.map(a => ({
    a, lane: 0, lanes: 1, visualMin: Math.max(a.durationMin, MIN_VISUAL_MIN),
  }))

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
    laneEnds[lane] = p.a.startMin + p.visualMin
    p.lane = lane
    cluster.push(p)
    clusterEnd = Math.max(clusterEnd, p.a.startMin + p.visualMin)
  }
  if (cluster.length > 0) flush()
  return placed
}

export function AgendaClient() {
  return (
    <LangProvider>
      <AgendaInner />
    </LangProvider>
  )
}

function AgendaInner() {
  const { lang } = useLang()
  const t = useT()
  const WEEKDAYS = WEEKDAY_LETTERS[lang]
  const today = panamaToday()
  const maxMonth = shiftMonth(today.slice(0, 7), 2)
  const [month, setMonth] = useState(today.slice(0, 7))
  const [location, setLocation] = useState<LocationKey>('all')
  const [data, setData] = useState<AgendaMonth | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null) // day view when set
  const [dayCache, setDayCache] = useState<Record<string, DayState>>({})
  const [refreshTick, setRefreshTick] = useState(0)

  const load = useCallback(async (mo: string, l: LocationKey) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/kpis/agenda?month=${mo}&location=${l}`, { cache: 'no-store' })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error || `Error ${res.status}`)
      }
      setData(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(month, location) }, [month, location, load, refreshTick])
  useEffect(() => { prefetchStaffKpis() }, [])

  // Background refresh of today's appointments: on entry, then every 5 min
  // while the page stays open, and when the tab becomes visible again
  // (e.g. front-desk tablet waking up). The server skips if synced <5 min ago.
  const syncToday = useCallback(() => {
    if (typeof document !== 'undefined' && document.hidden) return
    fetch('/api/admin/kpis/sync-today', { method: 'POST' })
      .then(r => (r.ok ? r.json() : null))
      .then(res => {
        if (!res || res.skipped) return
        const t = panamaToday()
        setDayCache(prev => {
          const next = { ...prev }
          delete next[t]
          return next
        })
        setRefreshTick(x => x + 1)
      })
      .catch(() => {}) // background refresh only — cached data is already on screen
  }, [])

  useEffect(() => {
    syncToday()
    const interval = setInterval(syncToday, 5 * 60_000)
    const onVisible = () => { if (!document.hidden) syncToday() }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [syncToday])

  const openDay = useCallback(async (date: string, l: LocationKey, cache: Record<string, DayState>) => {
    setSelectedDate(date)
    if (cache[date]?.status === 'ready') return
    setDayCache(prev => ({ ...prev, [date]: { status: 'loading' } }))
    try {
      const res = await fetch(`/api/admin/kpis/agenda/day?date=${date}&location=${l}`, { cache: 'no-store' })
      if (!res.ok) throw new Error()
      const body = await res.json()
      setDayCache(prev => ({ ...prev, [date]: { status: 'ready', appointments: body.appointments, availability: body.availability ?? [] } }))
    } catch {
      setDayCache(prev => ({ ...prev, [date]: { status: 'error' } }))
    }
  }, [])

  // Self-heal: if the open day's cache entry was invalidated, refetch it
  useEffect(() => {
    if (selectedDate && !dayCache[selectedDate]) openDay(selectedDate, location, dayCache)
  }, [selectedDate, dayCache, location, openDay])

  // Changing location invalidates cached day schedules and refetches the open day
  function chooseLocation(l: LocationKey) {
    if (l === location) return
    setLocation(l)
    setDayCache({})
    if (selectedDate) openDay(selectedDate, l, {})
  }

  const locationChips = (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Sucursal">
      {LOCATIONS.map(l => (
        <button
          key={l.key}
          onClick={() => chooseLocation(l.key)}
          aria-pressed={location === l.key}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
            location === l.key
              ? 'bg-dark text-white border-dark'
              : 'bg-white text-warm-gray border-beige-400 hover:bg-beige'
          }`}
        >
          {t(l.label)}
        </button>
      ))}
    </div>
  )

  const [y, m] = month.split('-').map(Number)
  const firstDow = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7
  const maxActive = data ? Math.max(...data.days.map(d => d.active), 1) : 1
  const lyYear = y - 1
  const countByDate = new Map(data?.days.map(d => [d.date, d.active]) ?? [])

  // ---------- day (schedule) view ----------
  if (selectedDate) {
    const state = dayCache[selectedDate]
    const weekStart = mondayOf(selectedDate)
    const weekDays = Array.from({ length: 7 }, (_, i) => addDaysStr(weekStart, i))
    const appts = state?.status === 'ready' ? state.appointments : []
    const availability = state?.status === 'ready' ? state.availability : []
    const availByName = new Map(availability.map(a => [a.staffName, a.blocks]))
    // Columns: everyone with an appointment OR on shift that day
    const staffNames = [...new Set([...appts.map(a => a.staffName), ...availability.map(a => a.staffName)])]
      .sort((a, b) => a.localeCompare(b, 'es'))

    const mins = [...appts.map(a => a.startMin), ...availability.flatMap(a => a.blocks.map(b => b.startMin))]
    const ends = [...appts.map(a => a.startMin + a.durationMin), ...availability.flatMap(a => a.blocks.map(b => b.endMin))]
    const startHour = mins.length ? Math.min(8, Math.floor(Math.min(...mins) / 60)) : 8
    const endHour = ends.length ? Math.max(20, Math.ceil(Math.max(...ends) / 60)) : 20
    const gridH = (endHour - startHour) * HOUR_PX
    const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i)
    const isFutureDay = selectedDate > today

    return (
      <div className="max-w-4xl">
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => setSelectedDate(null)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-beige hover:bg-beige-300 text-dark text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> {t('Mes')}
          </button>
          <div>
            <h1 className="text-xl font-display font-semibold text-dark capitalize leading-tight">{formatDateLang(selectedDate, lang)}</h1>
            <p className="text-xs text-warm-gray">
              {appts.length} {t('citas')}
              {!isFutureDay && <> · {appts.filter(a => a.noShow).length} {t('no-shows')}</>}
            </p>
          </div>
        </div>

        {/* Sticky header: fixed location filters + independently side-scrolling day strip */}
        <div className="sticky top-14 lg:top-0 z-20 -mx-2 pt-2 pb-2 mb-3 bg-cream/95 backdrop-blur-sm border-b border-beige-300">
          <div className="mb-2 px-2">{locationChips}</div>
          <div className="overflow-x-auto px-2" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex gap-1.5 w-max">
              {weekDays.map((d, i) => {
                const sel = d === selectedDate
                const count = countByDate.get(d)
                return (
                  <button
                    key={d}
                    onClick={() => openDay(d, location, dayCache)}
                    aria-pressed={sel}
                    className={`w-16 shrink-0 rounded-xl py-1.5 flex flex-col items-center gap-0.5 border transition-colors ${
                      sel ? 'bg-dark text-cream border-dark' : d === today ? 'border-gold bg-white' : 'border-beige-400 bg-white hover:bg-beige'
                    }`}
                  >
                    <span className={`text-[9px] leading-none ${sel ? 'text-cream/70' : 'text-warm-gray'}`}>{WEEKDAYS[i]}</span>
                    <span className="text-base font-bold leading-none tabular-nums">{Number(d.slice(8, 10))}</span>
                    <span className={`text-[9px] leading-none tabular-nums ${sel ? 'text-cream/70' : 'text-spa-green font-bold'}`}>
                      {count ?? '·'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {(!state || state.status === 'loading') && (
          <div className="bg-white border border-beige-400 rounded-2xl flex items-center justify-center h-60"><BlackSpinner /></div>
        )}
        {state?.status === 'error' && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{t('No se pudo cargar el día.')}</div>
        )}

        {state?.status === 'ready' && (
          appts.length === 0 && availability.length === 0 ? (
            <CardBox><p className="text-sm text-warm-gray">{t('Sin citas este día.')}</p></CardBox>
          ) : (
            <CardBox className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-fit">
                  {/* Staff header */}
                  <div className="flex border-b border-beige-300 bg-beige-100/60">
                    <div className="w-12 shrink-0" />
                    {staffNames.map(name => (
                      <div key={name} className="w-28 shrink-0 px-1 py-2 flex flex-col items-center gap-1 border-l border-beige-200">
                        <span className="h-8 w-8 rounded-full bg-spa-green/20 text-spa-green text-[11px] font-bold flex items-center justify-center">
                          {initials(name)}
                        </span>
                        <span className="max-w-full text-[10px] font-bold text-dark truncate leading-none">{name}</span>
                      </div>
                    ))}
                  </div>
                  {/* Time grid */}
                  <div className="flex">
                    {/* Hour gutter */}
                    <div className="w-12 shrink-0 relative" style={{ height: gridH }}>
                      {hours.map(h => (
                        <span
                          key={h}
                          className="absolute right-1.5 -translate-y-1/2 text-[9px] text-warm-gray tabular-nums"
                          style={{ top: (h - startHour) * HOUR_PX }}
                        >
                          {h}:00
                        </span>
                      ))}
                    </div>
                    {staffNames.map(name => (
                      <div key={name} className="w-28 shrink-0 relative border-l border-beige-200 bg-beige-100/50" style={{ height: gridH }}>
                        {(availByName.get(name) ?? []).map((b, i) => (
                          <div
                            key={`av${i}`}
                            className="absolute inset-x-0 bg-spa-green/10"
                            style={{
                              top: ((b.startMin - startHour * 60) / 60) * HOUR_PX,
                              height: ((b.endMin - b.startMin) / 60) * HOUR_PX,
                            }}
                          />
                        ))}
                        {hours.map(h => (
                          <div key={h} className="absolute inset-x-0 border-t border-beige-200/70" style={{ top: (h - startHour) * HOUR_PX }} />
                        ))}
                        {layoutColumn(appts.filter(a => a.staffName === name)).map(({ a, lane, lanes, visualMin }) => {
                          const heightPx = (visualMin / 60) * HOUR_PX - 2
                          const compact = heightPx < 34
                          const laneW = 100 / lanes
                          return (
                            <div
                              key={a.id}
                              className={`absolute rounded-lg border px-1.5 py-0.5 overflow-hidden ${statusClasses(a.status)}`}
                              style={{
                                top: ((a.startMin - startHour * 60) / 60) * HOUR_PX,
                                height: heightPx,
                                left: `calc(${lane * laneW}% + 2px)`,
                                width: `calc(${laneW}% - 4px)`,
                              }}
                              title={`${a.startTime}–${a.endTime} · ${a.clientName ?? ''} · ${a.status}`}
                            >
                              {compact ? (
                                <p className={`text-[9px] leading-tight truncate ${a.noShow ? 'text-red-800 font-bold' : 'text-dark'}`}>
                                  <span className="tabular-nums text-warm-gray">{a.startTime}</span>{' '}
                                  {a.noShow && <b className="text-red-700">NS </b>}
                                  {a.clientName ?? '—'}
                                </p>
                              ) : (
                                <>
                                  <p className={`text-[9px] leading-tight tabular-nums ${a.noShow ? 'text-red-700' : 'text-warm-gray'}`}>
                                    {a.startTime}–{a.endTime}{a.noShow && <b> · NO-SHOW</b>}
                                  </p>
                                  <p className={`text-[10px] font-bold leading-tight truncate ${a.noShow ? 'text-red-800' : 'text-dark'}`}>
                                    {a.clientName ?? '—'}
                                  </p>
                                </>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 px-3 py-2 border-t border-beige-200 text-[10px] text-warm-gray">
                <span><span className="inline-block w-2.5 h-2.5 rounded-sm align-[-1px] bg-spa-green/10 border border-spa-green/30 mr-1" />{t('horario disponible')}</span>
                <span><span className="inline-block w-2.5 h-2.5 rounded-sm align-[-1px] bg-white border border-beige-500 mr-1" />{t('sin llegar')}</span>
                <span><span className="inline-block w-2.5 h-2.5 rounded-sm align-[-1px] bg-gold-100 border border-gold-500 mr-1" />{t('llegó')}</span>
                <span><span className="inline-block w-2.5 h-2.5 rounded-sm align-[-1px] bg-spa-green/40 mr-1" />{t('completada')}</span>
                <span><span className="inline-block w-2.5 h-2.5 rounded-sm align-[-1px] bg-red-200 border border-red-300 mr-1" />no-show</span>
              </div>
            </CardBox>
          )
        )}
      </div>
    )
  }

  // ---------- month view ----------
  return (
    <div className="max-w-xl">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-display font-semibold text-dark">{t('Agenda')}</h1>
          <LangToggle />
        </div>
        <p className="text-sm text-warm-gray mt-1">{t('Toca un día para ver el horario por terapeuta')}</p>
      </div>

      {/* Sticky controls */}
      <div className="sticky top-14 lg:top-0 z-20 -mx-2 px-2 pt-2 pb-3 mb-4 bg-cream/95 backdrop-blur-sm border-b border-beige-300">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setMonth(shiftMonth(month, -1))}
            disabled={month <= MIN_MONTH}
            aria-label={t('Mes anterior')}
            className="p-2 rounded-lg bg-white border border-beige-400 hover:bg-beige disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4 text-dark" />
          </button>
          <p className="text-base font-bold text-dark capitalize">{MONTHS_LONG[lang][m - 1]} {y}</p>
          <button
            onClick={() => setMonth(shiftMonth(month, 1))}
            disabled={month >= maxMonth}
            aria-label={t('Mes siguiente')}
            className="p-2 rounded-lg bg-white border border-beige-400 hover:bg-beige disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4 text-dark" />
          </button>
        </div>
        {locationChips}
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {loading || !data ? (
        <div className="space-y-4" aria-busy="true">
          <LoadingCard tall />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Month total — compared over the same dates, with the full LY month as goal */}
          <div className="rounded-2xl border border-gold-200 bg-gold-50 p-4">
            <Label>{t('Citas del mes')}</Label>
            <div className="flex items-baseline gap-3 flex-wrap mt-1">
              <span className="text-3xl font-bold text-dark tabular-nums">{data.totals.activeToDate.toLocaleString('en-US')}</span>
              <DeltaChip delta={deltaPct(data.totals.activeToDate, data.totals.lySameDates)} suffix={`vs ${lyYear}`} />
            </div>
            <p className="text-xs text-warm-gray mt-1">
              {data.totals.lySameDates > 0
                ? `${data.totals.lySameDates.toLocaleString('en-US')} ${t('citas en las mismas fechas de')} ${lyYear}`
                : `${t('sin datos de')} ${lyYear} ${t('para comparar')}`}
            </p>
            {data.totals.lyFullMonth > 0 && (
              <p className="text-xs text-warm-gray mt-0.5">
                {t('Meta —')} {lang === 'es' ? `${MONTHS_LONG.es[m - 1]} ${lyYear} completo` : `full ${MONTHS_LONG.en[m - 1]} ${lyYear}`}: <b className="text-dark">{data.totals.lyFullMonth.toLocaleString('en-US')}</b>
              </p>
            )}
            {data.totals.futureBooked > 0 && (
              <p className="text-xs text-spa-green font-bold mt-0.5">
                + {data.totals.futureBooked.toLocaleString('en-US')} {t('reservas futuras este mes')}
              </p>
            )}
          </div>

          {/* Calendar grid */}
          <CardBox>
            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-warm-gray mb-1">
              {WEEKDAYS.map((d, i) => <span key={i} className="py-1">{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDow }, (_, i) => <span key={`b${i}`} />)}
              {data.days.map(d => {
                const isToday = d.date === today
                const isFuture = d.date > today
                const heat = d.active > 0 ? 0.12 + 0.5 * (d.active / maxActive) : 0
                return (
                  <button
                    key={d.date}
                    onClick={() => openDay(d.date, location, dayCache)}
                    className={`rounded-xl py-1.5 flex flex-col items-center gap-0.5 border transition-colors ${
                      isToday ? 'border-gold' : 'border-transparent hover:border-beige-400'
                    }`}
                    style={{ background: heat > 0 ? `rgba(122, 158, 126, ${heat.toFixed(2)})` : undefined }}
                  >
                    <span className={`text-base font-bold leading-none tabular-nums ${isToday ? 'text-dark' : 'text-dark'}`}>
                      {Number(d.date.slice(8, 10))}
                    </span>
                    <span className={`text-[10px] leading-none tabular-nums ${isFuture ? 'text-spa-green font-bold' : 'text-warm-gray'}`}>
                      {d.active > 0 ? d.active : '·'}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="flex justify-between text-[10px] text-warm-gray mt-3">
              <span>■ {t('más intenso = más citas')}</span>
              <span><span className="text-spa-green font-bold">{t('verde')}</span> {t('= reservas futuras')}</span>
            </div>
          </CardBox>

          <p className="text-center text-xs text-warm-gray pb-4">
            {t('Hoy se actualiza al entrar y cada 5 min mientras la página esté abierta · reservas futuras ~60 días adelante')}
          </p>
        </div>
      )}
    </div>
  )
}
