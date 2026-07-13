'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowUpDown, Award, Clock, HandCoins, ShoppingBag } from 'lucide-react'
import type { StaffKpisPayload, StaffMemberKpis } from '@/lib/kpis/staff'
import type { KpiPeriod } from '@/lib/kpis/queries'
import { CardBox, DeltaChip, Label, LoadingCard, deltaPct, money, pct } from '../shared'
import { LangProvider, LangToggle, formatDateLang, useLang, useT } from '../i18n'

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
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/kpis/staff?period=${p}&location=${l}`, { cache: 'no-store' })
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
        className={`inline-flex items-center gap-1 uppercase tracking-wider ${sortKey === key ? 'text-spa-green' : 'text-warm-gray'}`}
      >
        {label}<ArrowUpDown className="h-3 w-3" />
      </button>
    </th>
  )

  return (
    <div className="max-w-2xl">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-display font-semibold text-dark">Staff</h1>
          <LangToggle />
        </div>
        <p className="text-sm text-warm-gray mt-1">{t('Rendimiento por terapeuta · neto sin ITBMS, método de caja')}</p>
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
                period === p.key ? 'bg-spa-green text-white border-spa-green' : 'bg-white text-warm-gray border-beige-400 hover:bg-beige'
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
                location === l.key ? 'bg-dark text-white border-dark' : 'bg-white text-warm-gray border-beige-400 hover:bg-beige'
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
                  <Award className="h-3.5 w-3.5" />{t('Más solicitada')}
                </div>
                <p className="text-sm font-bold text-dark mt-1 leading-tight">{podium.requested.name.split(' ')[0]}</p>
                <p className="text-xs text-warm-gray tabular-nums">{pct(podium.requested.requestedPct)} {t('de sus visitas')}</p>
              </div>
              <div className="rounded-2xl border border-gold-200 bg-gold-50 p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-gold-700">
                  <HandCoins className="h-3.5 w-3.5" />{t('Mejor propina')}
                </div>
                <p className="text-sm font-bold text-dark mt-1 leading-tight">{podium.tipped.name.split(' ')[0]}</p>
                <p className="text-xs text-warm-gray tabular-nums">{podium.tipped.tipRate !== null ? pct(podium.tipped.tipRate) : '—'} {t('del neto')}</p>
              </div>
              <div className="rounded-2xl border border-gold-200 bg-gold-50 p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-gold-700">
                  <Clock className="h-3.5 w-3.5" />{t('Más horas')}
                </div>
                <p className="text-sm font-bold text-dark mt-1 leading-tight">{podium.hours.name.split(' ')[0]}</p>
                <p className="text-xs text-warm-gray tabular-nums">{podium.hours.hours} h</p>
              </div>
              <div className="rounded-2xl border border-gold-200 bg-gold-50 p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-gold-700">
                  <ShoppingBag className="h-3.5 w-3.5" />{t('Venta cabina')}
                </div>
                <p className="text-sm font-bold text-dark mt-1 leading-tight">{podium.cabina.cabinaNet > 0 ? podium.cabina.name.split(' ')[0] : '—'}</p>
                <p className="text-xs text-warm-gray tabular-nums">
                  {podium.cabina.cabinaNet > 0 ? `${money(podium.cabina.cabinaNet)} · ${podium.cabina.cabinaCount} ${t('extras')}` : t('sin ventas')}
                </p>
              </div>
            </div>
          )}

          {/* Team summary */}
          <CardBox>
            <Label>{t('Equipo')}</Label>
            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm text-dark tabular-nums">
              <span><b>{data.members.length}</b> {t('terapeutas')}</span>
              <span><b>{data.team.hours.toLocaleString('en-US')}</b> {t('horas')}</span>
              <span><b>{data.team.visits.toLocaleString('en-US')}</b> {t('visitas')}</span>
              <span><b>{money(data.team.net)}</b> {t('neto')}</span>
              <span><b>{money(data.team.tips)}</b> {t('propinas')}</span>
              <span><b>{pct(data.team.requestedPct)}</b> {t('solicitadas')}</span>
              <span><b>{money(data.team.cabinaNet)}</b> {t('venta cabina')} · <b>{pct(data.team.cabinaAttach)}</b> {t('de las visitas')}</span>
            </div>
          </CardBox>

          {/* Sortable table */}
          <CardBox className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="text-[10px] text-left border-b border-beige-300 bg-beige-100/60">
                    <th className="py-1.5 pl-4 font-bold uppercase tracking-wider text-warm-gray">{t('Terapeuta')}</th>
                    {th('hours', t('Horas'), 'text-right')}
                    {th('visits', t('Visitas'), 'text-right')}
                    {th('net', t('Neto'), 'text-right')}
                    {th('tips', t('Propinas'), 'text-right')}
                    {th('cabinaNet', t('Cabina'), 'text-right')}
                    {th('requestedPct', t('Solicitada'), 'text-right')}
                    {th('repeatRate', t('Fidelidad'), 'text-right pr-4')}
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
            <p className="text-[10px] text-warm-gray px-4 py-2 border-t border-beige-200">
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
        <td className="py-2.5 pl-4 pr-2 font-medium text-dark whitespace-nowrap">{m.name}</td>
        <td className="py-2.5 text-right tabular-nums">{m.hours}</td>
        <td className="py-2.5 text-right tabular-nums">{m.visits}</td>
        <td className="py-2.5 text-right tabular-nums font-bold text-dark">{money(m.net)}</td>
        <td className="py-2.5 text-right tabular-nums">{money(m.tips)}</td>
        <td className="py-2.5 text-right tabular-nums">{m.cabinaNet > 0 ? money(m.cabinaNet) : '—'}</td>
        <td className="py-2.5 text-right tabular-nums">{pct(m.requestedPct)}</td>
        <td className="py-2.5 pr-4 text-right tabular-nums">{pct(m.repeatRate)}</td>
      </tr>
      {open && (
        <tr className="bg-beige-100/60">
          <td colSpan={8} className="px-4 py-3">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
              <span className="flex items-center gap-1.5">
                <DeltaChip delta={deltaPct(m.net, m.lyNet)} suffix={`${t('neto')} vs ${lyYear}`} />
              </span>
              <span className="flex items-center gap-1.5">
                <DeltaChip delta={deltaPct(m.hours, m.lyHours)} suffix={`${t('horas')} vs ${lyYear}`} />
              </span>
              <span className="text-warm-gray tabular-nums">{t('promedio')}/{t('visita')}: <b className="text-dark">{money(m.avgPerVisit)}</b></span>
              <span className="text-warm-gray tabular-nums">{t('primeras visitas')}: <b className="text-dark">{m.firstVisits}</b></span>
              <span className="text-warm-gray tabular-nums">no-shows: <b className="text-dark">{pct(m.noShowRate)}</b></span>
              {m.tipRate !== null && (
                <span className="text-warm-gray tabular-nums">{t('propina')}: <b className="text-dark">{pct(m.tipRate)}</b> {t('del neto')}</span>
              )}
              {m.utilizationPct !== null && (
                <span className="text-warm-gray tabular-nums">
                  {t('ocupación')}: <b className="text-dark">{pct(m.utilizationPct)}</b> ({m.hours}h / {m.availableHours}h)
                </span>
              )}
              {m.repeatRate !== null && (
                <span className="text-warm-gray tabular-nums">{t('fidelidad')}: <b className="text-dark">{pct(m.repeatRate)}</b> ({t('cohorte')} {m.repeatCohortSize})</span>
              )}
              {m.cabinaCount > 0 && (
                <span className="text-warm-gray tabular-nums">
                  {t('venta cabina')}: <b className="text-dark">{money(m.cabinaNet)}</b> · {m.cabinaCount} {t('extras')} · <b className="text-dark">{pct(m.cabinaAttach)}</b> {t('de sus visitas')}
                  {m.lyCabinaNet > 0 && <> · {lyYear}: {money(m.lyCabinaNet)}</>}
                </span>
              )}
            </div>
            {m.topServices.length > 0 && (
              <p className="text-xs text-warm-gray mt-2">
                {t('Top servicios')}: {m.topServices.map(s => `${s.name} ×${s.count}`).join(' · ')}
              </p>
            )}
            {m.topCabina.length > 0 && (
              <p className="text-xs text-warm-gray mt-1">
                {t('Top venta cabina')}: {m.topCabina.map(s => `${s.name} ×${s.count}`).join(' · ')}
              </p>
            )}
          </td>
        </tr>
      )}
    </>
  )
}
