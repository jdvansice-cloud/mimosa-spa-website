'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowUpDown, Award, Clock, HandCoins, ShoppingBag } from 'lucide-react'
import type { StaffKpisPayload, StaffMemberKpis } from '@/lib/kpis/staff'
import type { KpiPeriod } from '@/lib/kpis/queries'
import { CardBox, DeltaChip, Label, LoadingCard, deltaPct, money, pct } from '../shared'
import { LangProvider, LangToggle, formatDateLang, useLang, useT } from '../i18n'
import { readStaffCache, writeStaffCache } from '../prefetch'
import { InfoTip, DictionaryLink } from '../explain'

// ===========================================
// Staff performance — hours, revenue, tips, requested %, client loyalty.
// Complete days only (through yesterday), cash basis, like the dashboard.
// ===========================================

type LocationKey = 'all' | '1' | '2'
type SortKey = 'net' | 'hours' | 'visits' | 'tips' | 'cabinaNet' | 'requestedPct' | 'repeatRate'

const PERIODS: Array<{ key: KpiPeriod; label: string }> = [
  { key: 'mtd', label: 'Mes' },
  { key: 'lastmonth', label: 'Mes pasado' },
  { key: 'ytd', label: 'Año' },
]

const LOCATIONS: Array<{ key: LocationKey; label: string }> = [
  { key: 'all', label: 'Todas' },
  { key: '1', label: 'Costa del Este' },
  { key: '2', label: 'San Francisco' },
]

export function StaffClient() {
  return (
    <LangProvider>
      <StaffInner />
    </LangProvider>
  )
}

function StaffInner() {
  const { lang } = useLang()
  const t = useT()
  const [period, setPeriod] = useState<KpiPeriod>('mtd')
  const [location, setLocation] = useState<LocationKey>('all')
  const [data, setData] = useState<StaffKpisPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('net')
  const [openRow, setOpenRow] = useState<string | null>(null)

  const load = useCallback(async (p: KpiPeriod, l: LocationKey) => {
    setError(null)
    const fetchStaff = async (availability: boolean) => {
      const res = await fetch(
        `/api/admin/kpis/staff?period=${p}&location=${l}&availability=${availability ? '1' : '0'}`,
        { cache: 'no-store' }
      )
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error || `Error ${res.status}`)
      }
      return (await res.json()) as StaffKpisPayload
    }
    // Serve the prefetched/last payload instantly when available…
    const cached = readStaffCache<StaffKpisPayload>(p, l)
    if (cached) {
      setData(cached)
      setLoading(false)
    } else {
      setLoading(true)
    }
    try {
      // …otherwise paint fast without the live Mindbody utilization call…
      if (!cached) {
        setData(await fetchStaff(false))
        setLoading(false)
      }
      // …and always refresh with the full payload in the background.
      const full = await fetchStaff(true)
      setData(full)
      writeStaffCache(p, l, full)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(period, location) }, [period, location, load])

  const lyYear = data ? data.lyRange.start.slice(0, 4) : ''
  const MIN_VISITS = 10

  const sorted = data
    ? [...data.members].sort((a, b) => ((b[sortKey] ?? -1) as number) - ((a[sortKey] ?? -1) as number))
    : []

  const eligible = data ? data.members.filter(m => m.visits >= MIN_VISITS) : []
  const podium = data && eligible.length > 0
    ? {
        requested: [...eligible].sort((a, b) => (b.requestedPct ?? -1) - (a.requestedPct ?? -1))[0],
        tipped: [...eligible].sort((a, b) => (b.tipRate ?? -1) - (a.tipRate ?? -1))[0],
        hours: [...eligible].sort((a, b) => b.hours - a.hours)[0],
        cabina: [...eligible].sort((a, b) => b.cabinaNet - a.cabinaNet)[0],
      }
    : null

  const th = (key: SortKey, label: string, extra = '') => (
    <th className={`py-1.5 font-bold whitespace-nowrap ${extra}`}>
      <button
        onClick={() => setSortKey(key)}
        className={`inline-flex items-center gap-1 uppercase tracking-wider ${sortKey === key ? 'text-spa-green' : 'text-warm-gray-500'}`}
      >
        {label}<ArrowUpDown className="h-3 w-3" />
      </button>
    </th>
  )

  return (
    <div className="max-w-xl">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-display font-semibold text-dark">Staff</h1>
          <LangToggle />
          <DictionaryLink />
        </div>
        <p className="text-sm text-warm-gray-500 mt-1">{t('Rendimiento por terapeuta · neto sin ITBMS, método de caja')}</p>
        {data && (
          <p className="text-xs font-bold text-spa-green mt-1">
            {t('Solo días completos — datos hasta el')} {formatDateLang(data.asOf, lang)}
          </p>
        )}
      </div>

      {/* Sticky filters */}
      <div className="sticky top-14 lg:top-0 z-20 -mx-2 px-2 pt-2 pb-3 mb-4 bg-cream/95 backdrop-blur-sm border-b border-beige-300">
        <div className="flex flex-wrap gap-2 mb-2" role="group" aria-label="Período">
          {PERIODS.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              aria-pressed={period === p.key}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                period === p.key ? 'bg-spa-green text-white border-spa-green' : 'bg-white text-warm-gray-500 border-beige-400 hover:bg-beige'
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
                location === l.key ? 'bg-dark text-white border-dark' : 'bg-white text-warm-gray-500 border-beige-400 hover:bg-beige'
              }`}
            >
              {t(l.label)}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      {loading || !data ? (
        <div className="space-y-4" aria-busy="true">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3"><LoadingCard /><LoadingCard /><LoadingCard /><LoadingCard /></div>
          <LoadingCard tall />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Podium */}
          {podium && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-gold-200 bg-gold-50 p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-gold-700">
                  <Award className="h-3.5 w-3.5" />{t('Más solicitada')}<InfoTip k="podium" />
                </div>
                <p className="text-sm font-bold text-dark mt-1 leading-tight">{podium.requested.name.split(' ')[0]}</p>
                <p className="text-xs text-warm-gray-500 tabular-nums">{pct(podium.requested.requestedPct)} {t('de sus tratamientos')}</p>
              </div>
              <div className="rounded-2xl border border-gold-200 bg-gold-50 p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-gold-700">
                  <HandCoins className="h-3.5 w-3.5" />{t('Mejor propina')}
                </div>
                <p className="text-sm font-bold text-dark mt-1 leading-tight">{podium.tipped.name.split(' ')[0]}</p>
                <p className="text-xs text-warm-gray-500 tabular-nums">{podium.tipped.tipRate !== null ? pct(podium.tipped.tipRate) : '—'} {t('del neto')}</p>
              </div>
              <div className="rounded-2xl border border-gold-200 bg-gold-50 p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-gold-700">
                  <Clock className="h-3.5 w-3.5" />{t('Más horas')}
                </div>
                <p className="text-sm font-bold text-dark mt-1 leading-tight">{podium.hours.name.split(' ')[0]}</p>
                <p className="text-xs text-warm-gray-500 tabular-nums">{podium.hours.hours} h</p>
              </div>
              <div className="rounded-2xl border border-gold-200 bg-gold-50 p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-gold-700">
                  <ShoppingBag className="h-3.5 w-3.5" />{t('Venta cabina')}
                </div>
                <p className="text-sm font-bold text-dark mt-1 leading-tight">{podium.cabina.cabinaNet > 0 ? podium.cabina.name.split(' ')[0] : '—'}</p>
                <p className="text-xs text-warm-gray-500 tabular-nums">
                  {podium.cabina.cabinaNet > 0 ? `${money(podium.cabina.cabinaNet)} · ${podium.cabina.cabinaCount} ${t('extras')}` : t('sin ventas')}
                </p>
              </div>
            </div>
          )}

          {/* Team summary */}
          <CardBox>
            <Label info="equipo">{t('Equipo')}</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-3 mt-3">
              {[
                { v: String(data.members.length), l: t('terapeutas') },
                { v: data.team.hours.toLocaleString('en-US'), l: t('horas') },
                { v: data.team.clientVisits.toLocaleString('en-US'), l: t('visitas') },
                { v: data.team.visits.toLocaleString('en-US'), l: t('tratamientos') },
                { v: money(data.team.net), l: t('neto') },
                { v: money(data.team.tips), l: t('propinas') },
                { v: pct(data.team.requestedPct), l: t('solicitadas') },
                { v: money(data.team.cabinaNet), l: t('venta cabina') },
                { v: pct(data.team.cabinaAttach), l: `${t('venta cabina')} / ${t('visitas')}` },
              ].map(s => (
                <div key={s.l}>
                  <p className="text-base font-bold text-dark tabular-nums leading-tight">{s.v}</p>
                  <p className="text-[11px] text-warm-gray-500 leading-tight">{s.l}</p>
                </div>
              ))}
            </div>
          </CardBox>

          {/* Sortable table */}
          <CardBox className="p-0 overflow-hidden">
            <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
              {/* All columns always visible: the card scrolls sideways on phones
                  and the therapist name stays pinned on the left. */}
              <table className="w-full text-sm min-w-[680px]">
                <thead>
                  <tr className="text-[10px] text-left border-b border-beige-300 bg-beige-100/60">
                    <th className="sticky left-0 z-10 bg-beige-100 py-1.5 pl-4 pr-3 font-bold uppercase tracking-wider text-warm-gray-500 border-r border-beige-200">
                      {t('Terapeuta')}
                    </th>
                    {th('hours', t('Horas'), 'text-right px-2.5')}
                    {th('visits', t('Tratam.'), 'text-right px-2.5')}
                    {th('net', t('Neto'), 'text-right px-2.5')}
                    {th('tips', t('Propinas'), 'text-right px-2.5')}
                    {th('cabinaNet', t('Cabina'), 'text-right px-2.5')}
                    {th('requestedPct', t('Solicitada'), 'text-right px-2.5')}
                    {th('repeatRate', t('Fidelidad'), 'text-right pl-2.5 pr-4')}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed divide-beige-300">
                  {sorted.map(m => (
                    <StaffRow
                      key={m.name}
                      m={m}
                      lyYear={lyYear}
                      open={openRow === m.name}
                      onToggle={() => setOpenRow(openRow === m.name ? null : m.name)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-warm-gray-500 px-4 py-2 border-t border-beige-200">
              <InfoTip k="staff_tabla" />{' '}
              {t('Neto y propinas atribuidos por la cita del mismo día del cliente · Cabina = extras de la categoría “ventas en Cabina” vendidos durante el servicio · Solicitada = el cliente pidió a esa terapeuta · Fidelidad = clientes de hace 3–6 meses que volvieron con ella en 90 días (mín. 5)')}
            </p>
          </CardBox>
        </div>
      )}
    </div>
  )
}

function StaffRow({ m, lyYear, open, onToggle }: { m: StaffMemberKpis; lyYear: string; open: boolean; onToggle: () => void }) {
  const t = useT()
  return (
    <>
      <tr
        onClick={onToggle}
        className={`cursor-pointer transition-colors ${open ? 'bg-beige-100' : 'hover:bg-beige-100/50'}`}
      >
        <td className={`sticky left-0 z-10 py-2.5 pl-4 pr-3 font-medium text-dark whitespace-nowrap border-r border-beige-200 ${open ? 'bg-beige-100' : 'bg-white'}`}>
          {m.name}
        </td>
        <td className="py-2.5 px-2.5 text-right tabular-nums">{m.hours}</td>
        <td className="py-2.5 px-2.5 text-right tabular-nums">{m.visits}</td>
        <td className="py-2.5 px-2.5 text-right tabular-nums font-bold text-dark">{money(m.net)}</td>
        <td className="py-2.5 px-2.5 text-right tabular-nums">{money(m.tips)}</td>
        <td className="py-2.5 px-2.5 text-right tabular-nums">{m.cabinaNet > 0 ? money(m.cabinaNet) : '—'}</td>
        <td className="py-2.5 px-2.5 text-right tabular-nums">{pct(m.requestedPct)}</td>
        <td className="py-2.5 pl-2.5 pr-4 text-right tabular-nums">{pct(m.repeatRate)}</td>
      </tr>
      {open && (
        <tr className="bg-beige-100/60">
          {/* inner div pins to the visible viewport so the detail reads fine
              even when the table is scrolled sideways */}
          <td colSpan={8} className="py-3">
            <div className="sticky left-0 max-w-[calc(100vw-4rem)] sm:max-w-xl px-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
              <span className="flex items-center gap-1.5">
                <DeltaChip delta={deltaPct(m.net, m.lyNet)} suffix={`${t('neto')} vs ${lyYear}`} />
              </span>
              <span className="flex items-center gap-1.5">
                <DeltaChip delta={deltaPct(m.hours, m.lyHours)} suffix={`${t('horas')} vs ${lyYear}`} />
              </span>
              <span className="text-warm-gray-500 tabular-nums">{t('visitas')}: <b className="text-dark">{m.clientVisits}</b></span>
              <span className="text-warm-gray-500 tabular-nums">{t('promedio')}/{t('tratamiento')}: <b className="text-dark">{money(m.avgPerVisit)}</b></span>
              <span className="text-warm-gray-500 tabular-nums">{t('primeras visitas')}: <b className="text-dark">{m.firstVisits}</b></span>
              <span className="text-warm-gray-500 tabular-nums">no-shows: <b className="text-dark">{pct(m.noShowRate)}</b></span>
              {m.tipRate !== null && (
                <span className="text-warm-gray-500 tabular-nums">{t('propina')}: <b className="text-dark">{pct(m.tipRate)}</b> {t('del neto')}</span>
              )}
              {m.utilizationPct !== null && (
                <span className="text-warm-gray-500 tabular-nums">
                  {t('ocupación')}: <b className="text-dark">{pct(m.utilizationPct)}</b> ({m.hours}h / {m.availableHours}h)
                </span>
              )}
              {m.repeatRate !== null && (
                <span className="text-warm-gray-500 tabular-nums">{t('fidelidad')}: <b className="text-dark">{pct(m.repeatRate)}</b> ({t('cohorte')} {m.repeatCohortSize})</span>
              )}
              {m.cabinaCount > 0 && (
                <span className="text-warm-gray-500 tabular-nums">
                  {t('venta cabina')}: <b className="text-dark">{money(m.cabinaNet)}</b> · {m.cabinaCount} {t('extras')} · <b className="text-dark">{pct(m.cabinaAttach)}</b> {t('de sus tratamientos')}
                  {m.lyCabinaNet > 0 && <> · {lyYear}: {money(m.lyCabinaNet)}</>}
                </span>
              )}
            </div>
            {m.topServices.length > 0 && (
              <p className="text-xs text-warm-gray-500 mt-2">
                {t('Top servicios')}: {m.topServices.map(s => `${s.name} ×${s.count}`).join(' · ')}
              </p>
            )}
            {m.topCabina.length > 0 && (
              <p className="text-xs text-warm-gray-500 mt-1">
                {t('Top venta cabina')}: {m.topCabina.map(s => `${s.name} ×${s.count}`).join(' · ')}
              </p>
            )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
