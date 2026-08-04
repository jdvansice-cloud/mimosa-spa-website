'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { RefreshCw, ChevronDown } from 'lucide-react'
import type { KpiPayload, KpiPeriod, KpiSeries } from '@/lib/kpis/queries'
import {
  CardBox, DeltaChip, DualLine, GOLD, GREEN, Label, Legend, LoadingCard,
  deltaPct, money, moneyCompact, pct, pct1,
} from './shared'
import { LangProvider, LangToggle, MONTHS_LONG, formatDateLang, useLang, useT } from './i18n'
import { prefetchStaffKpis } from './prefetch'

// ===========================================
// KPI dashboard — mobile-first, all money net of ITBMS.
// Complete days only (through yesterday) — a half-elapsed day never distorts
// totals. Periods: Ayer · Mes (a la fecha) · Mes pasado · Año (a la fecha).
// Every chart compares the current year against the previous year.
// ===========================================

type LocationKey = 'all' | '1' | '2'

const PERIODS: Array<{ key: KpiPeriod; label: string }> = [
  { key: 'today', label: 'Ayer' },
  { key: 'mtd', label: 'Mes' },
  { key: 'lastmonth', label: 'Mes pasado' },
  { key: 'ytd', label: 'Año' },
]

const LOCATIONS: Array<{ key: LocationKey; label: string }> = [
  { key: 'all', label: 'Todas' },
  { key: '1', label: 'Costa del Este' },
  { key: '2', label: 'San Francisco' },
]



/** Grouped monthly bars, current year vs previous year. */
function YearBars({ cur, prev, labels }: { cur: Array<number | null>; prev: Array<number | null>; labels: string[] }) {
  const max = Math.max(...[...cur, ...prev].map(v => v ?? 0), 1)
  return (
    <div>
      <div className="flex items-end gap-1 h-24 mt-3" aria-hidden="true">
        {labels.map((_, i) => (
          <div key={i} className="flex-1 flex items-end gap-[2px] h-full">
            <div className="flex-1 rounded-t" style={{ background: GOLD, opacity: 0.55, height: `${Math.max(2, (100 * (prev[i] ?? 0)) / max)}%` }} title={`${labels[i]}: ${prev[i] ?? 0}`} />
            <div className="flex-1 rounded-t" style={{ background: GREEN, height: cur[i] === null ? '0%' : `${Math.max(2, (100 * (cur[i] ?? 0)) / max)}%` }} title={`${labels[i]}: ${cur[i] ?? '—'}`} />
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-1">
        {labels.map((l, i) => (
          <span key={i} className="flex-1 text-center text-[8px] text-warm-gray">{l}</span>
        ))}
      </div>
    </div>
  )
}

/** Stat card that expands into a monthly comparison chart when tapped. */
function ExpandableStat({
  label, value, sub, chip, goal, chart, chartFormat, curYear, prevYear, monthLabels, open, onToggle,
}: {
  label: string
  value: string
  /** Small companion line under the value (e.g. treatments behind the visits). */
  sub?: string | null
  chip: React.ReactNode
  /** "Meta — <period> completo: <value>" line, when the period is still in progress. */
  goal?: string | null
  chart: { cur: Array<number | null>; prev: Array<number | null> }
  chartFormat: (v: number) => string
  curYear: number
  prevYear: number
  monthLabels: string[]
  open: boolean
  onToggle: () => void
}) {
  const t = useT()
  return (
    <div className={`bg-white border rounded-2xl transition-colors ${open ? 'border-spa-green col-span-2' : 'border-beige-400'}`}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full text-left p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold rounded-2xl"
      >
        <div className="flex items-start justify-between gap-2">
          <Label>{label}</Label>
          <ChevronDown className={`h-4 w-4 text-warm-gray shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
        <p className="text-2xl font-bold text-dark tabular-nums mt-1">{value}</p>
        {sub && <p className="text-[10px] text-warm-gray tabular-nums">{sub}</p>}
        <div className="mt-1">{chip}</div>
        {goal && <p className="text-[10px] text-warm-gray mt-1 tabular-nums">{goal}</p>}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-[11px] text-warm-gray">{t('Por mes')} · {curYear} vs {prevYear}</p>
          <DualLine
            series={{ unit: 'month', labels: monthLabels, current: chart.cur, previous: chart.prev }}
            formatY={chartFormat}
          />
          <Legend curLabel={String(curYear)} prevLabel={String(prevYear)} />
        </div>
      )}
    </div>
  )
}

// ---------- main component ----------

export function KpisClient() {
  return (
    <LangProvider>
      <KpisInner />
    </LangProvider>
  )
}

function KpisInner() {
  const { lang } = useLang()
  const t = useT()
  const [period, setPeriod] = useState<KpiPeriod>('mtd')
  const [location, setLocation] = useState<LocationKey>('all')
  const [data, setData] = useState<KpiPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openStat, setOpenStat] = useState<string | null>(null)
  const [gcMode, setGcMode] = useState(false)
  const [showAllClients, setShowAllClients] = useState(false)
  const [showAllServices, setShowAllServices] = useState(false)
  const cache = useRef(new Map<string, KpiPayload>())

  const load = useCallback(async (p: KpiPeriod, l: LocationKey, gc: boolean, force = false) => {
    const key = `${p}|${l}|${gc ? 'gc' : 'cash'}`
    if (!force && cache.current.has(key)) {
      setData(cache.current.get(key)!)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/kpis?period=${p}&location=${l}${gc ? '&gc=1' : ''}`, { cache: 'no-store' })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error || `Error ${res.status}`)
      }
      const payload: KpiPayload = await res.json()
      cache.current.set(key, payload)
      setData(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(period, location, gcMode) }, [period, location, gcMode, load])
  useEffect(() => { prefetchStaffKpis() }, [])

  async function refreshNow() {
    setSyncing(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/kpis/sync', { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error || 'La sincronización falló')
      }
      cache.current.clear()
      await load(period, location, gcMode, true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'La sincronización falló')
    } finally {
      setSyncing(false)
    }
  }

  const lyYear = data ? data.lyRange.start.slice(0, 4) : ''
  const vsLabel = `vs ${lyYear}`
  const monthName = (start: string) => MONTHS_LONG[lang][Number(start.slice(5, 7)) - 1]
  const goalPeriodLabel = data
    ? data.period === 'ytd'
      ? lang === 'es' ? `${lyYear} completo` : `full ${lyYear}`
      : lang === 'es' ? `${monthName(data.range.start)} ${lyYear} completo` : `full ${monthName(data.range.start)} ${lyYear}`
    : ''
  const goalLine = (v: string | null) => (data?.goals && v ? `${t('Meta —')} ${goalPeriodLabel}: ${v}` : null)

  function chartTitle(d: KpiPayload): string {
    if (d.period === 'today') return `${t('Ayer')} vs ${d.lyRange.start}`
    if (d.period === 'mtd' || d.period === 'lastmonth') {
      const m = monthName(d.range.start)
      return `${m} ${d.range.start.slice(0, 4)} vs ${m} ${lyYear} · ${t('por día')}`
    }
    return `${d.range.start.slice(0, 4)} vs ${lyYear} · ${t('por mes')}`
  }

  return (
    <div className="max-w-xl">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-semibold text-dark">KPIs</h1>
            <LangToggle />
          </div>
          <p className="text-sm text-warm-gray mt-1">
            {t('Ventas netas sin ITBMS, método de caja · comparado con las mismas fechas del año pasado')}
          </p>
          {data && (
            <p className="text-xs font-bold text-spa-green mt-1">
              {t('Solo días completos — datos hasta el')} {formatDateLang(data.asOf, lang)}
            </p>
          )}
        </div>
        <button
          onClick={refreshNow}
          disabled={syncing}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-beige hover:bg-beige-300 text-dark text-sm font-medium transition-colors disabled:opacity-50 shrink-0"
        >
          {syncing
            ? <span className="inline-block h-4 w-4 rounded-full border-2 border-dark border-t-transparent animate-spin motion-reduce:animate-none" />
            : <RefreshCw className="h-4 w-4" />}
          {syncing ? t('Sincronizando…') : t('Actualizar')}
        </button>
      </div>

      {/* Filters — sticky while scrolling */}
      <div className="sticky top-14 lg:top-0 z-20 -mx-2 px-2 pt-2 pb-3 mb-2 bg-cream/95 backdrop-blur-sm border-b border-beige-300">
      <div className="flex flex-wrap gap-2 mb-2" role="group" aria-label="Período">
        {PERIODS.map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            aria-pressed={period === p.key}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              period === p.key
                ? 'bg-spa-green text-white border-spa-green'
                : 'bg-white text-warm-gray border-beige-400 hover:bg-beige'
            }`}
          >
            {t(p.label)}
          </button>
        ))}
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
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}. Si las vistas kpi_daily_* aún no existen, corre la migración 20260707_kpi_daily_views.sql.
        </div>
      )}

      {loading || !data ? (
        <div className="space-y-4" aria-busy="true">
          <LoadingCard tall />
          <div className="grid grid-cols-2 gap-3">
            <LoadingCard /><LoadingCard /><LoadingCard /><LoadingCard />
          </div>
          <LoadingCard tall />
          <LoadingCard />
          <LoadingCard tall />
          <LoadingCard />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Net sales hero + dual-year chart for the selected period */}
          <div className="rounded-2xl border border-gold-200 bg-gold-50 p-4">
            <Label>{t(gcMode ? 'Gift cards redimidas · neto sin ITBMS' : 'Ventas netas · sin ITBMS')}</Label>
            <div className="flex items-baseline gap-3 flex-wrap mt-1">
              <span className="text-4xl font-bold text-dark tabular-nums">{money(data.sales.net)}</span>
              <DeltaChip delta={deltaPct(data.sales.net, data.sales.lyNet)} suffix={vsLabel} />
            </div>
            <p className="text-xs text-warm-gray mt-1">
              {data.sales.lyNet > 0
                ? `${money(data.sales.lyNet)} ${t('en las mismas fechas de')} ${lyYear} (${data.lyRange.start.slice(5)} → ${data.lyRange.end.slice(5)})`
                : `${t('sin datos de')} ${lyYear} ${t('para comparar')}`}
            </p>
            {data.sales.lyPeriodTotal !== null && data.sales.lyPeriodTotal > 0 && (
              <p className="text-xs text-warm-gray mt-0.5">
                {t('Meta —')} {goalPeriodLabel}: <b className="text-dark">{money(data.sales.lyPeriodTotal)}</b>
              </p>
            )}
            {gcMode && (
              <p className="text-xs text-warm-gray mt-0.5">
                {data.sales.saleCount.toLocaleString('en-US')} {t('usos')} · {t('promedio')} {money(data.sales.avgTicket)} {t('por uso')}
              </p>
            )}
            {data.budget && (
              <div className="mt-3 rounded-xl bg-white/70 border border-gold-200 px-3 py-2">
                <div className="flex items-baseline justify-between gap-2 text-xs">
                  <span className="text-warm-gray">
                    {t('Presupuesto')} {data.budget.year}
                    {data.period !== 'ytd' && <> · {MONTHS_LONG[lang][Number(data.range.start.slice(5, 7)) - 1]}</>}
                    : <b className="text-dark tabular-nums">{money(data.budget.periodTarget)}</b>
                  </span>
                  <b className="text-spa-green tabular-nums">{pct(data.sales.net / data.budget.periodTarget)}</b>
                </div>
                <div className="relative h-2 mt-1.5 rounded-full bg-beige overflow-hidden">
                  <div
                    className="h-full rounded-full bg-spa-green"
                    style={{ width: `${Math.min(100, (100 * data.sales.net) / data.budget.periodTarget)}%` }}
                  />
                  {data.budget.expectedToDate !== null && (
                    <div
                      className="absolute top-0 bottom-0 w-[2px] bg-gold-600"
                      style={{ left: `${Math.min(99, (100 * data.budget.expectedToDate) / data.budget.periodTarget)}%` }}
                    />
                  )}
                </div>
                {data.budget.expectedToDate !== null && data.budget.expectedToDate > 0 && (
                  <p className="text-[10px] text-warm-gray mt-1 tabular-nums">
                    {t('esperado a la fecha')}: {money(data.budget.expectedToDate)} · {t('ritmo')}:{' '}
                    <b className={data.sales.net >= data.budget.expectedToDate ? 'text-spa-green' : 'text-red-700'}>
                      {pct(data.sales.net / data.budget.expectedToDate)}
                    </b>
                  </p>
                )}
              </div>
            )}
            <p className="text-[11px] text-warm-gray mt-3">{chartTitle(data)}</p>
            <DualLine series={data.sales.series} formatY={moneyCompact} formatValue={money} />
            <Legend curLabel={String(data.monthly.curYear)} prevLabel={String(data.monthly.prevYear)} />
          </div>

          {/* Stat grid — each card expands into a monthly comparison chart */}
          {!gcMode && <div className="grid grid-cols-2 gap-3">
            <ExpandableStat
              label={t('Ticket promedio')}
              value={money(data.sales.avgTicket)}
              chip={<DeltaChip delta={deltaPct(data.sales.avgTicket, data.sales.lyAvgTicket)} suffix={vsLabel} />}
              goal={goalLine(data.goals ? money(data.goals.avgTicket) : null)}
              chart={data.monthly.avgTicket}
              chartFormat={moneyCompact}
              curYear={data.monthly.curYear}
              prevYear={data.monthly.prevYear}
              monthLabels={data.monthly.labels}
              open={openStat === 'ticket'}
              onToggle={() => setOpenStat(openStat === 'ticket' ? null : 'ticket')}
            />
            <ExpandableStat
              label={t('Visitas')}
              value={data.visits.count.toLocaleString('en-US')}
              sub={`${data.treatments.count.toLocaleString('en-US')} ${t('tratamientos')}`}
              chip={<DeltaChip delta={deltaPct(data.visits.count, data.visits.lyCount)} suffix={vsLabel} />}
              goal={goalLine(data.goals ? data.goals.visits.toLocaleString('en-US') : null)}
              chart={data.monthly.visits}
              chartFormat={v => String(Math.round(v))}
              curYear={data.monthly.curYear}
              prevYear={data.monthly.prevYear}
              monthLabels={data.monthly.labels}
              open={openStat === 'visitas'}
              onToggle={() => setOpenStat(openStat === 'visitas' ? null : 'visitas')}
            />
            <ExpandableStat
              label={t('Primeras visitas')}
              value={String(data.newClients.count)}
              chip={<DeltaChip delta={deltaPct(data.newClients.count, data.newClients.lyCount)} suffix={vsLabel} />}
              goal={goalLine(data.goals ? String(data.goals.newClients) : null)}
              chart={data.monthly.newClients}
              chartFormat={v => String(Math.round(v))}
              curYear={data.monthly.curYear}
              prevYear={data.monthly.prevYear}
              monthLabels={data.monthly.labels}
              open={openStat === 'nuevos'}
              onToggle={() => setOpenStat(openStat === 'nuevos' ? null : 'nuevos')}
            />
            <ExpandableStat
              label={t('No-shows + canc. tardías')}
              value={pct(data.noShow.rate)}
              chip={
                <DeltaChip
                  delta={data.noShow.rate !== null && data.noShow.lyRate ? deltaPct(data.noShow.rate, data.noShow.lyRate) : null}
                  invert
                  suffix={vsLabel}
                />
              }
              goal={goalLine(data.goals ? pct1(data.goals.noShowRate) : null)}
              chart={data.monthly.noShowRate}
              chartFormat={pct1}
              curYear={data.monthly.curYear}
              prevYear={data.monthly.prevYear}
              monthLabels={data.monthly.labels}
              open={openStat === 'noshow'}
              onToggle={() => setOpenStat(openStat === 'noshow' ? null : 'noshow')}
            />
          </div>}

          {/* Retention / pre-booked / acquisition don't apply to gift-card usage */}
          {!gcMode && <>
          <CardBox>
            <Label>{t('Retención · clientes nuevos')}</Label>
            {data.retention.cohortSize > 0 ? (
              <>
                <p className="text-sm text-dark mt-2">
                  {t('De')} <b className="text-spa-green">{data.retention.cohortSize} {t('clientes nuevos')}</b> {t('en')} {MONTHS_LONG[lang][Number(data.retention.cohortMonth.slice(5, 7)) - 1]} {data.retention.cohortMonth.slice(0, 4)},{' '}
                  <b className="text-spa-green">{data.retention.returned} {t('regresaron')}</b> {t('dentro de 90 días.')}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="font-display font-semibold text-5xl text-spa-green leading-none">{pct(data.retention.rate)}</span>
                  <span className="text-xs text-warm-gray leading-relaxed">
                    {data.retention.lyRate !== null
                      ? <>{t('mismo cohorte de')} {lyYear}: {pct(data.retention.lyRate)} ({data.retention.lyReturned} {t('de')} {data.retention.lyCohortSize})</>
                      : <>{t('sin cohorte comparable en')} {lyYear}</>}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-beige text-warm-gray">{t('Industria 35%')}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${data.retention.rate !== null && data.retention.rate >= 0.5 ? 'bg-green-100 text-green-800' : 'bg-beige text-warm-gray'}`}>{t('Meta 50%')}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-warm-gray mt-2">{t('Aún no hay datos del cohorte.')}</p>
            )}
          </CardBox>

          {/* Pre-booked */}
          <CardBox>
            <Label>{t('Ya reagendados')}</Label>
            <div className="flex items-center gap-4 mt-2">
              <span className="font-display font-semibold text-5xl text-spa-green leading-none">{pct(data.prebooked.rate)}</span>
              <span className="text-xs text-warm-gray leading-relaxed">
                {data.prebooked.withNext} {t('de')} {data.prebooked.clientsSeen} {t('clientes del período')}<br />{t('ya tienen su próxima cita')}
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-beige text-warm-gray">{t('Meta ≥50%')}</span>
            </div>
          </CardBox>

          {/* Acquisition: monthly bars, both years */}
          <CardBox>
            <Label>{t('Adquisición · primeras visitas por mes')}</Label>
            <YearBars cur={data.monthly.newClients.cur} prev={data.monthly.newClients.prev} labels={data.monthly.labels} />
            <Legend curLabel={String(data.monthly.curYear)} prevLabel={String(data.monthly.prevYear)} />
          </CardBox>
          </>}

          {/* Revenue mix */}
          <CardBox>
            <Label>{t('Mezcla de ingresos')}</Label>
            {(() => {
              const { service, retail, giftcard } = data.sales.mix
              const total = service + retail + giftcard
              const segs = [
                { label: t('Servicios'), value: service, cls: 'bg-spa-green' },
                { label: t('Retail'), value: retail, cls: 'bg-spa-green/50' },
                { label: t('Gift cards'), value: giftcard, cls: 'bg-gold-600' },
              ]
              return total > 0 ? (
                <>
                  <div className="flex h-3.5 rounded-full overflow-hidden mt-3">
                    {segs.map(s => (
                      <div key={s.label} className={s.cls} style={{ width: `${(100 * s.value) / total}%` }} />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-warm-gray">
                    {segs.map(s => (
                      <span key={s.label} className="flex items-center gap-1.5">
                        <span className={`inline-block w-2 h-2 rounded-full ${s.cls}`} />
                        {s.label} <b className="text-dark">{Math.round((100 * s.value) / total)}%</b>
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-warm-gray mt-2">{t('Sin ventas en el período.')}</p>
              )
            })()}
          </CardBox>

          {/* Location split */}
          {data.locationSplit && (
            <CardBox>
              <Label>{t('Por sucursal')}</Label>
              <div className="space-y-3 mt-3">
                {data.locationSplit.map(s => (
                  <div key={s.locationId}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-dark">{s.name}</span>
                      <b className="tabular-nums text-dark">{money(s.net)} · {s.sharePct}%</b>
                    </div>
                    <div className="h-2 rounded-full bg-beige overflow-hidden">
                      <div className="h-full rounded-full bg-spa-green" style={{ width: `${s.sharePct}%` }} />
                    </div>
                    {data.period === 'ytd' && (() => {
                      const b = data.budget?.perLocation?.find(x => x.locationId === s.locationId)
                      if (!b || b.annual <= 0) return null
                      return (
                        <p className="text-[10px] text-warm-gray mt-1 tabular-nums">
                          {t('Presupuesto')} {data.budget!.year} ({b.manager}): {money(b.annual)} ·{' '}
                          <b className={b.netYtd / b.annual >= (data.budget!.expectedToDate ?? 0) / data.budget!.annual ? 'text-spa-green' : 'text-dark'}>
                            {pct(b.netYtd / b.annual)}
                          </b>
                        </p>
                      )
                    })()}
                  </div>
                ))}
              </div>
            </CardBox>
          )}

          {/* Top services */}
          <CardBox>
            <Label>{t(gcMode ? 'Top servicios pagados con gift card' : 'Top servicios · neto del período')}</Label>
            <div className="mt-2 divide-y divide-dashed divide-beige-400">
              {data.topServices.length === 0 && <p className="text-sm text-warm-gray py-2">{t('Sin servicios en el período.')}</p>}
              {data.topServices.slice(0, showAllServices ? 25 : 5).map(s => (
                <div key={s.name} className="flex justify-between items-center gap-3 py-2 text-sm">
                  <span className="text-dark">{s.name} <span className="text-warm-gray">×{s.count}</span></span>
                  <b className="tabular-nums text-dark shrink-0">{money(s.net)}</b>
                </div>
              ))}
            </div>
            {data.topServices.length > 5 && (
              <button
                onClick={() => setShowAllServices(v => !v)}
                aria-expanded={showAllServices}
                className="w-full mt-2 py-2 rounded-lg bg-beige hover:bg-beige-300 text-dark text-xs font-bold transition-colors"
              >
                {t(showAllServices ? 'Ver top 5' : 'Ver top 25')}
              </button>
            )}
          </CardBox>

          {/* Top clients */}
          <CardBox>
            <Label>{t(gcMode ? 'Top clientes · gift cards redimidas' : 'Top clientes · neto del período')}</Label>
            {data.topClients.length === 0 ? (
              <p className="text-sm text-warm-gray py-2 mt-2">{t('Sin clientes en el período.')}</p>
            ) : (
              <>
                <table className="w-full mt-2 text-sm">
                  <thead>
                    <tr className="text-[10px] font-bold tracking-wider uppercase text-warm-gray">
                      <th className="text-left font-bold py-1.5">{t('Cliente')}</th>
                      <th className="text-right font-bold py-1.5">{t('Visitas')}</th>
                      <th className="text-right font-bold py-1.5">{t('Neto')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashed divide-beige-400">
                    {data.topClients.slice(0, showAllClients ? 25 : 10).map((c, i) => (
                      <tr key={c.name + i} className="text-dark">
                        <td className="py-2 pr-2">
                          <span className="text-warm-gray tabular-nums">{i + 1}.</span> {c.name}
                        </td>
                        <td className="py-2 px-2 text-right tabular-nums">{gcMode ? '—' : c.visits}</td>
                        <td className="py-2 pl-2 text-right tabular-nums font-bold">{money(c.net)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.topClients.length > 10 && (
                  <button
                    onClick={() => setShowAllClients(v => !v)}
                    aria-expanded={showAllClients}
                    className="w-full mt-2 py-2 rounded-lg bg-beige hover:bg-beige-300 text-dark text-xs font-bold transition-colors"
                  >
                    {t(showAllClients ? 'Ver top 10' : 'Ver top 25')}
                  </button>
                )}
              </>
            )}
          </CardBox>

          {/* Staff */}
          {!gcMode && <CardBox>
            <Label>{t('Top 10 terapeutas · neto atribuido')}</Label>
            {data.staff.length === 0 ? (
              <p className="text-sm text-warm-gray py-2 mt-2">{t('Sin visitas en el período.')}</p>
            ) : (
              <table className="w-full mt-2 text-sm">
                <thead>
                  <tr className="text-[10px] font-bold tracking-wider uppercase text-warm-gray">
                    <th className="text-left font-bold py-1.5">{t('Terapeuta')}</th>
                    <th className="text-right font-bold py-1.5">{t('Tratam.')}</th>
                    <th className="text-right font-bold py-1.5">{t('Horas')}</th>
                    <th className="text-right font-bold py-1.5">{t('Neto')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed divide-beige-400">
                  {data.staff.map(s => (
                    <tr key={s.name} className={s.name === 'Sin asignar' || s.name === 'Resto del equipo' ? 'text-warm-gray' : 'text-dark'}>
                      <td className="py-2 pr-2">{t(s.name)}</td>
                      <td className="py-2 px-2 text-right tabular-nums">{s.visits}</td>
                      <td className="py-2 px-2 text-right tabular-nums">{s.hours}</td>
                      <td className="py-2 pl-2 text-right tabular-nums font-bold text-dark">{money(s.net)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p className="text-[10px] text-warm-gray mt-2">
              {t('Ingreso de servicios atribuido a la terapeuta de la cita del mismo día del cliente.')}{' '}
              {t('“Resto del equipo” incluye a las demás terapeutas y ventas sin cita asociada.')}
            </p>
          </CardBox>}

          <p className="text-center text-xs text-warm-gray pb-4">
            {data.range.start} → {data.range.end} · {t('comparado con')} {data.lyRange.start} → {data.lyRange.end}
          </p>
        </div>
      )}
    </div>
  )
}
