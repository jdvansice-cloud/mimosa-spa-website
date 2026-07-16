'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronDown } from 'lucide-react'
import type { ReportTransaction, SalesReport } from '@/lib/kpis/report'
import {
  BlackSpinner, CardBox, DeltaChip, DualLine, Label, Legend, LoadingCard,
  deltaPct, money, money2, moneyCompact,
} from '../shared'
import { LangProvider, LangToggle, formatDateLang, useLang, useT } from '../i18n'
import { prefetchStaffKpis } from '../prefetch'
import { RangeCalendar } from './RangeCalendar'

// ===========================================
// Reporte de ventas diarias — rango con presets o calendario único,
// gráfico comparativo vs el año pasado, días colapsables con sus
// transacciones y gran total al final. Neto sin ITBMS, sin propinas.
// ===========================================

type Preset = 'lastmonth' | 'thismonth' | 'year' | 'custom'
type LocationKey = 'all' | '1' | '2'

const PRESETS: Array<{ key: Preset; label: string }> = [
  { key: 'lastmonth', label: 'Mes pasado' },
  { key: 'thismonth', label: 'Este mes' },
  { key: 'year', label: 'Este año' },
]

const LOCATIONS: Array<{ key: LocationKey; label: string }> = [
  { key: 'all', label: 'Todas' },
  { key: '1', label: 'Costa del Este' },
  { key: '2', label: 'San Francisco' },
]

function panamaToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Panama' }).format(new Date())
}

function presetRange(preset: Preset, today: string): { start: string; end: string } {
  const [y, m] = today.split('-').map(Number)
  if (preset === 'thismonth') return { start: `${today.slice(0, 7)}-01`, end: today }
  if (preset === 'year') return { start: `${y}-01-01`, end: today }
  // lastmonth
  const py = m === 1 ? y - 1 : y
  const pm = m === 1 ? 12 : m - 1
  const lastDay = new Date(Date.UTC(py, pm, 0)).getUTCDate()
  return { start: `${py}-${String(pm).padStart(2, '0')}-01`, end: `${py}-${String(pm).padStart(2, '0')}-${lastDay}` }
}

type DayState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; transactions: ReportTransaction[] }

export function VentasClient() {
  return (
    <LangProvider>
      <VentasInner />
    </LangProvider>
  )
}

function VentasInner() {
  const { lang } = useLang()
  const t = useT()
  const today = useRef(panamaToday()).current
  const [preset, setPreset] = useState<Preset>('thismonth')
  const [range, setRange] = useState(() => presetRange('thismonth', today))
  const [location, setLocation] = useState<LocationKey>('all')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [data, setData] = useState<SalesReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [days, setDays] = useState<Record<string, DayState>>({})
  const [gcMode, setGcMode] = useState(false)
  const [openDays, setOpenDays] = useState<Set<string>>(new Set())

  const load = useCallback(async (r: { start: string; end: string }, l: LocationKey, gc: boolean) => {
    setLoading(true)
    setError(null)
    setDays({})
    setOpenDays(new Set())
    try {
      const res = await fetch(`/api/admin/kpis/sales-report?start=${r.start}&end=${r.end}&location=${l}${gc ? '&gc=1' : ''}`, { cache: 'no-store' })
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

  const [refreshTick, setRefreshTick] = useState(0)
  useEffect(() => { load(range, location, gcMode) }, [range, location, gcMode, load, refreshTick])
  useEffect(() => { prefetchStaffKpis() }, [])

  // Background refresh of today's sales/appointments: on entry, every 5 min
  // while open, and when the tab becomes visible again. Server skips if
  // synced <5 min ago. Only re-renders when the visible range includes today.
  const syncToday = useCallback(() => {
    if (typeof document !== 'undefined' && document.hidden) return
    fetch('/api/admin/kpis/sync-today', { method: 'POST' })
      .then(r => (r.ok ? r.json() : null))
      .then(res => {
        if (!res || res.skipped) return
        setRange(r => {
          if (r.end >= panamaToday()) {
            setDays(prev => {
              const next = { ...prev }
              delete next[panamaToday()]
              return next
            })
            setRefreshTick(x => x + 1)
          }
          return r
        })
      })
      .catch(() => {}) // background only — cached data is already on screen
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

  function choosePreset(p: Preset) {
    setPreset(p)
    setCalendarOpen(false)
    setRange(presetRange(p, today))
  }

  async function toggleDay(date: string) {
    const next = new Set(openDays)
    if (next.has(date)) {
      next.delete(date)
      setOpenDays(next)
      return
    }
    next.add(date)
    setOpenDays(next)
    if (!days[date]) {
      setDays(prev => ({ ...prev, [date]: { status: 'loading' } }))
      try {
        const res = await fetch(`/api/admin/kpis/sales-report/day?date=${date}&location=${location}${gcMode ? '&gc=1' : ''}`, { cache: 'no-store' })
        if (!res.ok) throw new Error()
        const body = await res.json()
        setDays(prev => ({ ...prev, [date]: { status: 'ready', transactions: body.transactions } }))
      } catch {
        setDays(prev => ({ ...prev, [date]: { status: 'error' } }))
      }
    }
  }

  const lyYear = data ? data.lyRange.start.slice(0, 4) : ''
  const curYear = data ? data.range.start.slice(0, 4) : ''

  return (
    <div className="max-w-xl">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-display font-semibold text-dark">{t('Reporte de Ventas')}</h1>
          <LangToggle />
        </div>
        <p className="text-sm text-warm-gray mt-1">{t('Ventas netas por día, sin ITBMS ni propinas · comparado con el año pasado')}</p>
      </div>

      {/* Filters — sticky while scrolling */}
      <div className="sticky top-14 lg:top-0 z-20 -mx-2 px-2 pt-2 pb-3 mb-2 bg-cream/95 backdrop-blur-sm border-b border-beige-300">
        <div className="flex flex-wrap gap-2 mb-2" role="group" aria-label="Período">
          {PRESETS.map(p => (
            <button
              key={p.key}
              onClick={() => choosePreset(p.key)}
              aria-pressed={preset === p.key}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                preset === p.key
                  ? 'bg-spa-green text-white border-spa-green'
                  : 'bg-white text-warm-gray border-beige-400 hover:bg-beige'
              }`}
            >
              {t(p.label)}
            </button>
          ))}
          <button
            onClick={() => { setPreset('custom'); setCalendarOpen(o => !o) }}
            aria-pressed={preset === 'custom'}
            aria-expanded={calendarOpen}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              preset === 'custom'
                ? 'bg-spa-green text-white border-spa-green'
                : 'bg-white text-warm-gray border-beige-400 hover:bg-beige'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            {preset === 'custom' ? `${range.start} → ${range.end}` : t('Rango')}
          </button>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Sucursal">
          {LOCATIONS.map(l => (
            <button
              key={l.key}
              onClick={() => setLocation(l.key)}
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
          <button
            onClick={() => setGcMode(g => !g)}
            aria-pressed={gcMode}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              gcMode
                ? 'bg-gold-600 text-white border-gold-600'
                : 'bg-white text-warm-gray border-beige-400 hover:bg-beige'
            }`}
          >
            {t('Uso de gift cards')}
          </button>
        </div>
        {calendarOpen && (
          <div className="mt-2">
            <RangeCalendar
              initial={range}
              maxDate={today}
              onClose={() => setCalendarOpen(false)}
              onApply={r => { setCalendarOpen(false); setPreset('custom'); setRange(r) }}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {loading || !data ? (
        <div className="space-y-4" aria-busy="true">
          <LoadingCard tall />
          <LoadingCard tall />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Comparative chart */}
          <div className="rounded-2xl border border-gold-200 bg-gold-50 p-4">
            <Label>{t(gcMode ? 'Gift cards redimidas · comparativo' : 'Ventas netas · comparativo')}</Label>
            <div className="flex items-baseline gap-3 flex-wrap mt-1">
              <span className="text-3xl font-bold text-dark tabular-nums">{money(data.totals.net)}</span>
              <DeltaChip delta={deltaPct(data.totals.net, data.totals.lyNet)} suffix={`vs ${lyYear}`} />
            </div>
            <p className="text-xs text-warm-gray mt-1">
              {data.totals.lyNet > 0
                ? `${money(data.totals.lyNet)} ${t('en las mismas fechas de')} ${lyYear}`
                : `${t('sin datos de')} ${lyYear} ${t('para comparar')}`}
            </p>
            {data.lyFull && data.lyFull.net > 0 && (
              <p className="text-xs text-warm-gray mt-0.5">
                {t('Meta —')} {data.lyFull.kind === 'year'
                  ? (lang === 'es' ? `${lyYear} completo` : `full ${lyYear}`)
                  : (lang === 'es' ? `mes completo ${lyYear}` : `full month ${lyYear}`)}: <b className="text-dark">{money(data.lyFull.net)}</b>
              </p>
            )}
            <p className="text-[11px] text-warm-gray mt-3">
              {data.range.start} → {data.range.end} vs {data.lyRange.start} → {data.lyRange.end}
              {data.series.unit === 'day' ? ` · ${t('por día')}` : ` · ${t('por mes')}`}
            </p>
            <DualLine series={data.series} formatY={moneyCompact} />
            <Legend curLabel={curYear} prevLabel={lyYear} />
          </div>

          {/* Daily rows */}
          <CardBox className="p-0 overflow-hidden">
            {data.days.length === 0 && <p className="text-sm text-warm-gray p-4">{t('Sin ventas en el período.')}</p>}
            {data.days.map(d => {
              const open = openDays.has(d.date)
              const state = days[d.date]
              return (
                <div key={d.date} className="border-b border-beige-200 last:border-b-0">
                  <button
                    onClick={() => toggleDay(d.date)}
                    aria-expanded={open}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-beige-100 transition-colors ${open ? 'bg-beige-100' : ''}`}
                  >
                    <span className="text-sm text-dark capitalize">{formatDateLang(d.date, lang)}</span>
                    <span className="flex items-center gap-3 shrink-0">
                      <span className="flex flex-col items-end gap-0.5">
                        <span className="flex items-baseline gap-3">
                          <span className="text-xs text-warm-gray tabular-nums">{d.visits} {t(gcMode ? 'usos' : 'visitas')}</span>
                          <b className="text-sm text-dark tabular-nums">{money2(d.net)}</b>
                        </span>
                        <span className="text-[10px] font-bold tabular-nums text-gold-700">
                          {lyYear}: {d.lyNet > 0 ? money(d.lyNet) : '—'}
                        </span>
                      </span>
                      <ChevronDown className={`h-4 w-4 text-warm-gray transition-transform ${open ? 'rotate-180' : ''}`} />
                    </span>
                  </button>

                  {open && (
                    <div className="px-4 pb-3 bg-beige-100/60">
                      {(!state || state.status === 'loading') && (
                        <div className="flex justify-center py-4"><BlackSpinner /></div>
                      )}
                      {state?.status === 'error' && (
                        <p className="text-xs text-red-700 py-2">{t('No se pudieron cargar las transacciones.')}</p>
                      )}
                      {state?.status === 'ready' && (
                        <div className="divide-y divide-dashed divide-beige-400">
                          {state.transactions.length === 0 && (
                            <p className="text-xs text-warm-gray py-2">{t('Sin transacciones este día.')}</p>
                          )}
                          {state.transactions.map(t2 => {
                            const shown = t2.items.filter(it => it.bucket !== 'tip')
                            const tip = t2.items.filter(it => it.bucket === 'tip').reduce((s, it) => s + it.net, 0)
                            return (
                              <div key={t2.saleId} className="py-2.5">
                                <div className="flex items-baseline justify-between gap-3">
                                  <span className="text-sm text-dark">
                                    <span className="tabular-nums text-warm-gray">{t2.time}</span>{' '}
                                    {t2.clientName ?? (t2.clientId ? `${t('Cliente')} ${t2.clientId}` : t('Sin cliente'))}
                                  </span>
                                  <b className="text-sm text-dark tabular-nums shrink-0">{money2(t2.net)}</b>
                                </div>
                                <p className="text-xs text-warm-gray mt-0.5">
                                  #{t2.saleId} · {shown.map(it => `${it.returned ? '(dev) ' : ''}${it.description}`).join(' · ') || '—'}
                                  {t2.paymentTypes.length > 0 && <> · {t2.paymentTypes.join(', ')}</>}
                                  {!gcMode && t2.gcPaid > 0 && <> · {t('pagado con gift card')} {money2(t2.gcPaid)}</>}
                                  {tip > 0 && <> · {t('propina')} {money2(tip)}</>}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Grand total */}
            {data.days.length > 0 && (
              <div className="flex items-center justify-between gap-3 px-4 py-3.5 bg-dark text-cream">
                <span className="text-sm font-bold">{t('Total del período')}</span>
                <span className="flex flex-col items-end gap-0.5">
                  <span className="flex items-baseline gap-4">
                    <span className="text-xs text-beige-300 tabular-nums">{gcMode ? `${data.totals.saleCount.toLocaleString('en-US')} ${t('usos')}` : `${data.totals.visits.toLocaleString('en-US')} ${t('visitas')} · ${data.totals.saleCount.toLocaleString('en-US')} ${t('ventas')}`}</span>
                    <b className="text-base tabular-nums">{money2(data.totals.net)}</b>
                  </span>
                  <span className="text-[10px] font-bold tabular-nums text-gold">
                    {lyYear}: {data.totals.lyNet > 0 ? money(data.totals.lyNet) : '—'} ({t('mismas fechas')})
                  </span>
                </span>
              </div>
            )}
          </CardBox>

          <p className="text-center text-xs text-warm-gray pb-4">
            {t(gcMode
              ? 'Porción de ventas pagada con gift cards · neto sin ITBMS ni propinas'
              : 'Método de caja: dinero recibido, porción pagada con gift card excluida · neto sin ITBMS ni propinas')}
            {' · '}{t('hoy se actualiza al entrar y cada 5 min')}
          </p>
        </div>
      )}
    </div>
  )
}
