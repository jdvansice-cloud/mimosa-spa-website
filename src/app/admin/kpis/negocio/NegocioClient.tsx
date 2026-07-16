'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, FileUp, Loader2, Upload } from 'lucide-react'
import type { BizPayload } from '@/lib/biz/kpis'
import { CardBox, Label, LoadingCard, money, pct, pct1 } from '../shared'
import { LangProvider, LangToggle, MONTHS_LONG, useLang, useT } from '../i18n'
import { prefetchStaffKpis } from '../prefetch'

// ===========================================
// Negocio — business KPIs from the monthly accountant packet.
// Import all the files at once (detection is content-based, names can vary),
// then the dashboard shows revenue vs budget, expense ratios vs industry
// benchmarks, tips, gift-card float, ITBMS position and cross-checks.
// ===========================================

const LOC_NAMES: Record<string, string> = { '1': 'Costa del Este', '2': 'San Francisco' }

type LocationKey = 'all' | '1' | '2'

const LOCATIONS: Array<{ key: LocationKey; label: string }> = [
  { key: 'all', label: 'Todas' },
  { key: '1', label: 'Costa del Este' },
  { key: '2', label: 'San Francisco' },
]

const DOC_LABELS: Record<string, string> = {
  bg_statement: 'Estado de cuenta Banco General',
  bg_ach: 'Detalle ACH Banco General',
  sg_statement: 'Estado de cuenta St. Georges',
  sg_ach: 'ACH St. Georges',
  sg_settlement: 'Liquidación de tarjetas St. Georges',
  bac_statement: 'Estado de cuenta BAC',
  bac_ach: 'Detalle ACH BAC',
  visa_txns: 'Movimientos Visa BAC',
  mb_closeout: 'Cierre diario Mindbody',
  gc_sold: 'Gift cards vendidas',
  gc_redeemed: 'Gift cards redimidas',
  efactura: 'Facturas electrónicas',
  socio_expenses: 'Gastos de socios',
  cxp: 'Cuentas por pagar',
  yappy_report: 'Reporte Yappy',
  pdf_reference: 'PDF de referencia',
  unknown: 'Formato no reconocido',
}

const CHECK_LABELS: Record<string, string> = {
  closeout_vs_mindbody: 'Cierre de caja vs Mindbody API (sin gift cards)',
  gc_vs_misc: 'Gift cards redimidas vs tender Misc',
  settlement_vs_card: 'Liquidación V/MC vs ventas con tarjeta',
  efactura_vs_closeout: 'Facturación electrónica vs cierre (sin gift cards redimidas)',
  yappy_vs_deposits: 'Reporte Yappy vs depósitos en banco',
  itbms_withheld_recon: 'Retención ITBMS: banco vs liquidación',
}

interface ImportResult {
  filename: string
  docType: string
  locationId: number | null
  month: string | null
  status: string
  rows: number
  detail?: string
}

export function NegocioClient() {
  return (
    <LangProvider>
      <NegocioInner />
    </LangProvider>
  )
}

function monthLabel(month: string, lang: 'en' | 'es'): string {
  const m = Number(month.slice(5, 7)) - 1
  return `${MONTHS_LONG[lang][m].slice(0, 3)} ${month.slice(0, 4)}`
}

function NegocioInner() {
  const { lang } = useLang()
  const t = useT()
  const [month, setMonth] = useState<string | null>(null)
  const [location, setLocation] = useState<LocationKey>('all')
  const [data, setData] = useState<BizPayload | null>(null)
  const [empty, setEmpty] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showImport, setShowImport] = useState(false)

  const load = useCallback(async (m: string | null, l: LocationKey = 'all') => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/kpis/negocio?location=${l}${m ? `&month=${m}` : ''}`, { cache: 'no-store' })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error || `Error ${res.status}`)
      }
      const payload = await res.json()
      if (!('month' in payload)) {
        setEmpty(true)
        setData(null)
        setShowImport(true)
      } else {
        setEmpty(false)
        setData(payload as BizPayload)
        setMonth((payload as BizPayload).month)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(month) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { prefetchStaffKpis() }, [])

  return (
    <div className="max-w-xl">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-display font-semibold text-dark">{t('Negocio')}</h1>
          <LangToggle />
        </div>
        <p className="text-sm text-warm-gray mt-1">
          {t('KPIs del negocio a partir del paquete contable mensual · ingresos, gastos, ratios vs industria')}
        </p>
      </div>

      {/* Sticky: months + import toggle */}
      <div className="sticky top-14 lg:top-0 z-20 -mx-2 px-2 pt-2 pb-3 mb-4 bg-cream/95 backdrop-blur-sm border-b border-beige-300">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {(data?.months ?? []).map(m => (
            <button
              key={m}
              onClick={() => { setMonth(m); load(m, location) }}
              aria-pressed={m === data?.month}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors capitalize ${
                m === data?.month ? 'bg-spa-green text-white border-spa-green' : 'bg-white text-warm-gray border-beige-400 hover:bg-beige'
              }`}
            >
              {monthLabel(m, lang)}
            </button>
          ))}
          <button
            onClick={() => { setMonth('ytd'); load('ytd', location) }}
            aria-pressed={data?.month === 'ytd'}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              data?.month === 'ytd' ? 'bg-spa-green text-white border-spa-green' : 'bg-white text-warm-gray border-beige-400 hover:bg-beige'
            }`}
          >
            {t('Año')}
          </button>
          <button
            onClick={() => setShowImport(v => !v)}
            aria-expanded={showImport}
            className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border transition-colors ${
              showImport ? 'bg-dark text-cream border-dark' : 'bg-gold text-dark border-gold hover:bg-gold-600'
            }`}
          >
            <Upload className="h-4 w-4" />{t('Importar archivos')}
          </button>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Sucursal">
          {LOCATIONS.map(l => (
            <button
              key={l.key}
              onClick={() => { setLocation(l.key); load(month, l.key) }}
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

      {showImport && <ImportPanel onDone={() => load(month, location)} />}

      {error && <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      {loading ? (
        <div className="space-y-4" aria-busy="true">
          <LoadingCard tall />
          <div className="grid grid-cols-2 gap-3"><LoadingCard /><LoadingCard /><LoadingCard /><LoadingCard /></div>
        </div>
      ) : empty ? (
        <CardBox>
          <p className="text-sm text-warm-gray">
            {t('Aún no hay datos. Importa el paquete de archivos del mes (todos a la vez) para ver el tablero.')}
          </p>
        </CardBox>
      ) : data ? (
        <Dashboard data={data} />
      ) : null}
    </div>
  )
}

// ---------- import panel ----------

function ImportPanel({ onDone }: { onDone: () => void }) {
  const t = useT()
  const [dragOver, setDragOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const [results, setResults] = useState<ImportResult[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const send = useCallback(async (files: FileList | File[]) => {
    const list = [...files]
    if (list.length === 0) return
    setBusy(true)
    setError(null)
    setResults(null)
    try {
      const form = new FormData()
      for (const f of list) form.append('files', f)
      const res = await fetch('/api/admin/kpis/negocio/import', { method: 'POST', body: form })
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error(body?.error || `Error ${res.status}`)
      setResults(body.results as ImportResult[])
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo importar')
    } finally {
      setBusy(false)
    }
  }, [onDone])

  const statusStyle = (s: string) =>
    s === 'imported' || s === 'superseded-replaced' ? 'bg-spa-green/15 text-spa-green' :
    s === 'reference' ? 'bg-beige-200 text-warm-gray' :
    s === 'duplicate' ? 'bg-gold/20 text-gold-700' :
    'bg-red-100 text-red-700'

  const statusLabel = (s: string) =>
    s === 'imported' ? t('importado') :
    s === 'superseded-replaced' ? t('reemplazó al anterior') :
    s === 'reference' ? t('referencia') :
    s === 'duplicate' ? t('duplicado') : 'error'

  return (
    <CardBox className="mb-4">
      <Label>{t('Importar paquete mensual')}</Label>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); send(e.dataTransfer.files) }}
        className={`mt-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragOver ? 'border-spa-green bg-spa-green/5' : 'border-beige-400 bg-beige-50'
        }`}
      >
        {busy ? (
          <div className="flex flex-col items-center gap-2 text-sm text-warm-gray">
            <Loader2 className="h-6 w-6 animate-spin text-dark" />
            {t('Importando y verificando archivos…')}
          </div>
        ) : (
          <>
            <FileUp className="h-6 w-6 mx-auto text-warm-gray" />
            <p className="text-sm text-dark mt-2 font-medium">{t('Arrastra aquí todos los archivos del mes')}</p>
            <p className="text-xs text-warm-gray mt-0.5">
              {t('xlsx, xls y pdf · el tipo se detecta por contenido, el nombre puede variar · subir de nuevo un reporte reemplaza al anterior')}
            </p>
            <button
              onClick={() => inputRef.current?.click()}
              className="mt-3 px-4 py-1.5 rounded-lg text-sm font-bold bg-dark text-cream hover:bg-dark/85"
            >
              {t('Elegir archivos')}
            </button>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".xlsx,.xls,.pdf"
              className="hidden"
              onChange={e => e.target.files && send(e.target.files)}
            />
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-700 mt-3">{error}</p>}

      {results && (
        <ul className="mt-3 space-y-1.5 text-xs">
          {results.map((r, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full font-bold shrink-0 ${statusStyle(r.status)}`}>{statusLabel(r.status)}</span>
              <span className="text-dark truncate">{r.filename}</span>
              <span className="text-warm-gray whitespace-nowrap ml-auto">
                {t(DOC_LABELS[r.docType] ?? r.docType)}
                {r.locationId ? ` · ${LOC_NAMES[String(r.locationId)]}` : ''}
                {r.rows > 0 ? ` · ${r.rows}` : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </CardBox>
  )
}

// ---------- dashboard ----------

function Dashboard({ data }: { data: BizPayload }) {
  const t = useT()
  const rev = data.revenue
  const budgetPct = rev.budget && rev.budget > 0 ? rev.total / rev.budget : null

  return (
    <div className="space-y-4">
      {/* Revenue vs budget */}
      <CardBox>
        <Label>{t('Ingresos del mes · neto sin ITBMS')}</Label>
        <p className="text-3xl font-bold text-dark tabular-nums mt-1">{money(rev.total)}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-0.5 text-xs text-warm-gray tabular-nums mt-1">
          {Object.entries(rev.byLocation).map(([loc, v]) => (
            <span key={loc}>{LOC_NAMES[loc] ?? loc}: <b className="text-dark">{money(v)}</b></span>
          ))}
        </div>
        {rev.budget !== null && rev.budget > 0 && (
          <div className="mt-3">
            <div className="h-2.5 rounded-full bg-beige-200 overflow-hidden">
              <div
                className={`h-full rounded-full ${budgetPct !== null && budgetPct >= 1 ? 'bg-spa-green' : 'bg-gold'}`}
                style={{ width: `${Math.min(100, (budgetPct ?? 0) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-warm-gray tabular-nums mt-1">
              <b className="text-dark">{pct(budgetPct)}</b> {t('del presupuesto')} ({money(rev.budget)})
            </p>
          </div>
        )}
      </CardBox>

      {/* Expense + margin tiles */}
      <div className="grid grid-cols-2 gap-3">
        <CardBox>
          <Label>{t('Gastos del mes')}</Label>
          <p className="text-2xl font-bold text-dark tabular-nums mt-1">{money(data.expenses.total)}</p>
          {data.expenses.unclassified > 0 && (
            <p className="text-xs text-warm-gray tabular-nums">{money(data.expenses.unclassified)} {t('sin clasificar')}</p>
          )}
        </CardBox>
        <CardBox>
          <Label>{t('Margen operativo')}</Label>
          <p className={`text-2xl font-bold tabular-nums mt-1 ${data.ratios.marginPct !== null && data.ratios.marginPct < 0 ? 'text-red-600' : 'text-dark'}`}>
            {pct1(data.ratios.marginPct)}
          </p>
          <p className="text-xs text-warm-gray tabular-nums">{money(rev.total - data.expenses.total)} · {t('meta industria')} 8–15%</p>
        </CardBox>
      </div>

      {/* Ratios vs industry */}
      <CardBox>
        <Label>{t('Ratios vs industria de spas')}</Label>
        <div className="mt-3 space-y-3">
          <RatioBand label={t('Planilla + CSS')} value={data.ratios.payrollPct} band={data.benchmarks.payroll} lowIsGood />
          <RatioBand label={t('Alquiler')} value={data.ratios.rentPct} band={data.benchmarks.rent} lowIsGood />
          <RatioBand label={t('Insumos')} value={data.ratios.suppliesPct} band={data.benchmarks.supplies} lowIsGood />
          <RatioBand label={t('Margen')} value={data.ratios.marginPct} band={data.benchmarks.margin} />
        </div>
        <p className="text-[10px] text-warm-gray mt-3">
          {t('Bandas = referencia de la industria de spas/salones · % sobre ingresos netos del mes')}
        </p>
      </CardBox>

      {/* Expenses by category */}
      <CardBox>
        <Label>{t('Gastos por categoría')}</Label>
        <div className="mt-2 space-y-1.5">
          {data.expenses.byCategory.map(c => (
            <div key={c.category}>
              <div className="flex justify-between text-xs">
                <span className={c.category === 'Sin clasificar' ? 'text-gold-700 font-bold' : 'text-dark'}>{t(c.category)}</span>
                <span className="tabular-nums text-dark"><b>{money(c.amount)}</b> <span className="text-warm-gray">· {pct(c.pct)}</span></span>
              </div>
              <div className="h-2 rounded-full bg-beige-200 mt-0.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${c.category === 'Sin clasificar' ? 'bg-gold' : 'bg-spa-green'}`}
                  style={{ width: `${Math.max(1.5, c.pct * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {data.expenses.socioTotal > 0 && (
          <p className="text-[10px] text-warm-gray mt-2">
            {t('Incluye')} {money(data.expenses.socioTotal)} {t('pagados por los socios (cxp Socios) · transferencias internas y pagos de tarjeta excluidos')}
          </p>
        )}
        {data.expenses.revenueShare !== null && data.expenses.sharedAllocated > 0 && (
          <p className="text-[10px] text-warm-gray mt-1">
            {t('Incluye')} {money(data.expenses.sharedAllocated)} {t('de gastos compartidos (BAC, Visa, socios) asignados por participación en ingresos')} ({pct(data.expenses.revenueShare)})
          </p>
        )}
      </CardBox>

      {/* Tips / GC / ITBMS / commissions */}
      <div className="grid grid-cols-2 gap-3">
        <CardBox>
          <Label>{t('Propinas · tarjeta')}</Label>
          <p className="text-2xl font-bold text-dark tabular-nums mt-1">{money(data.tips.total)}</p>
          <p className="text-xs text-warm-gray tabular-nums">
            {Object.entries(data.tips.byLocation).map(([l, v]) => `${LOC_NAMES[l]?.split(' ')[0] ?? l}: ${money(v)}`).join(' · ')}
          </p>
        </CardBox>
        <CardBox>
          <Label>{t('Gift cards · flujo del mes')}</Label>
          <p className="text-2xl font-bold text-dark tabular-nums mt-1">{money(data.giftCards.net)}</p>
          <p className="text-xs text-warm-gray tabular-nums">
            {t('vendidas')} {money(data.giftCards.sold)} − {t('redimidas')} {money(data.giftCards.redeemed)}
          </p>
        </CardBox>
        <CardBox>
          <Label>{t('Posición ITBMS')}</Label>
          <p className="text-2xl font-bold text-dark tabular-nums mt-1">{money(data.itbms.position)}</p>
          <p className="text-xs text-warm-gray tabular-nums">
            {t('cobrado')} {money(data.itbms.collected)} − {t('retenido')} {money(data.itbms.withheld)} − {t('crédito')} {money(data.itbms.socioCredit)}
          </p>
        </CardBox>
        <CardBox>
          <Label>{t('Comisiones bancarias')}</Label>
          <p className="text-2xl font-bold text-dark tabular-nums mt-1">{money(data.commissions.bank)}</p>
          <p className="text-xs text-warm-gray tabular-nums">
            {data.commissions.pctOfCardSales !== null && <>{pct1(data.commissions.pctOfCardSales)} {t('de ventas con tarjeta')}</>}
          </p>
        </CardBox>
      </div>

      {/* Bank balances */}
      {data.balances.length > 0 && (
        <CardBox>
          <Label>{t('Saldos bancarios · fin de mes')}</Label>
          <div className="mt-2 space-y-1 text-sm tabular-nums">
            {data.balances.map(b => (
              <div key={b.accountKey} className="flex justify-between">
                <span className="text-warm-gray">{b.accountKey}</span>
                <b className="text-dark">{money(b.balance)}</b>
              </div>
            ))}
            <div className="flex justify-between border-t border-beige-300 pt-1 mt-1">
              <span className="text-warm-gray font-bold">Total</span>
              <b className="text-dark">{money(data.balances.reduce((s, b) => s + b.balance, 0))}</b>
            </div>
          </div>
        </CardBox>
      )}

      {/* Cross-checks */}
      {data.checks.length > 0 && (
        <CardBox>
          <Label>{t('Verificaciones cruzadas')}</Label>
          <div className="mt-2 space-y-2">
            {data.checks.map(c => (
              <div key={c.key} className="flex items-start gap-2 text-xs">
                {c.ok
                  ? <CheckCircle2 className="h-4 w-4 text-spa-green shrink-0 mt-0.5" />
                  : <AlertTriangle className="h-4 w-4 text-gold-700 shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-dark font-medium">{t(CHECK_LABELS[c.key] ?? c.key)}</p>
                  <p className="text-warm-gray tabular-nums">
                    {money(c.a)} {t('vs')} {money(c.b)} · {t('diferencia')} {money(c.diff)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBox>
      )}

    </div>
  )
}

/** Horizontal scale with the industry band and a marker at the actual value. */
function RatioBand({ label, value, band, lowIsGood = false }: {
  label: string
  value: number | null
  band: [number, number]
  lowIsGood?: boolean
}) {
  const t = useT()
  const cap = Math.max(band[1] * 1.5, (value ?? 0) * 1.15, 0.01)
  const x = (v: number) => `${Math.min(100, Math.max(0, (v / cap) * 100))}%`
  const inBand = value !== null && value >= band[0] && value <= band[1]
  const good = value !== null && (inBand || (lowIsGood ? value < band[0] : value > band[1]))
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-dark font-medium">{label}</span>
        <span className={`tabular-nums font-bold ${value === null ? 'text-warm-gray' : good ? 'text-spa-green' : 'text-gold-700'}`}>
          {pct1(value)}
          <span className="text-warm-gray font-normal"> · {t('meta')} {Math.round(band[0] * 100)}–{Math.round(band[1] * 100)}%</span>
        </span>
      </div>
      <div className="relative h-3 rounded-full bg-beige-200">
        <div
          className="absolute top-0 bottom-0 bg-spa-green/25 rounded-full"
          style={{ left: x(band[0]), width: `calc(${x(band[1])} - ${x(band[0])})` }}
        />
        {value !== null && (
          <div
            className={`absolute -top-0.5 w-1 h-4 rounded-full ${good ? 'bg-spa-green' : 'bg-gold-600'}`}
            style={{ left: `calc(${x(value)} - 2px)` }}
          />
        )}
      </div>
    </div>
  )
}
