'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertTriangle, ChevronDown, Download, FileUp, Loader2, Upload } from 'lucide-react'
import type { AttendanceDay, AttendanceEmployee, AttendancePayload } from '@/lib/ta/report'
import { CardBox, Label, LoadingCard, formatDateEs } from '../shared'
import { LangProvider, LangToggle, MONTHS_LONG, useLang, useT } from '../i18n'

// ===========================================
// Asistencia — attendance review from the NGTeco TC7 clock.
// Upload the NGTeco Time export (Excel/CSV); punches are joined with
// Mindbody scheduled shifts and booked appointments per therapist per day:
// worked vs scheduled vs booked hours, late arrivals, early departures,
// missing punch-outs and no-shows to a scheduled shift.
// ===========================================

const GRACE_MIN = 5

interface ImportResult {
  filename: string
  status: string
  rows: number
  periodStart?: string
  periodEnd?: string
  employees?: number
  detail?: string
}

export function AsistenciaClient() {
  return (
    <LangProvider>
      <AsistenciaInner />
    </LangProvider>
  )
}

function monthLabel(month: string, lang: 'en' | 'es'): string {
  const m = Number(month.slice(5, 7)) - 1
  return `${MONTHS_LONG[lang][m].slice(0, 3)} ${month.slice(0, 4)}`
}

const fmtH = (min: number): string => `${(min / 60).toFixed(1).replace(/\.0$/, '')} h`
const fmtHM = (min: number): string => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`

function AsistenciaInner() {
  const { lang } = useLang()
  const t = useT()
  const [month, setMonth] = useState<string | null>(null)
  const [data, setData] = useState<AttendancePayload | null>(null)
  const [empty, setEmpty] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showImport, setShowImport] = useState(false)

  const load = useCallback(async (m: string | null) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/kpis/asistencia${m ? `?month=${m}` : ''}`, { cache: 'no-store' })
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
        setData(payload as AttendancePayload)
        setMonth((payload as AttendancePayload).month)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(null) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-xl">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-display font-semibold text-dark">{t('Asistencia')}</h1>
          <LangToggle />
        </div>
        <p className="text-sm text-warm-gray-500 mt-1">
          {t('Marcaciones del reloj NGTeco vs horarios y citas de Mindbody · tardanzas, salidas y horas trabajadas')}
        </p>
      </div>

      <div className="sticky top-14 lg:top-0 z-20 -mx-2 px-2 pt-2 pb-3 mb-4 bg-cream/95 backdrop-blur-sm border-b border-beige-300">
        <div className="flex flex-wrap items-center gap-2">
          {(data?.months ?? []).map(m => (
            <button
              key={m}
              onClick={() => { setMonth(m); load(m) }}
              aria-pressed={m === data?.month}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors capitalize ${
                m === data?.month ? 'bg-spa-green text-white border-spa-green' : 'bg-white text-warm-gray-500 border-beige-400 hover:bg-beige'
              }`}
            >
              {monthLabel(m, lang)}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            {data && (
              <a
                href={`/api/admin/kpis/asistencia/export?month=${data.month}`}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border border-dark bg-white text-dark hover:bg-beige transition-colors"
              >
                <Download className="h-4 w-4" />{t('Planilla')}
              </a>
            )}
            <button
              onClick={() => setShowImport(v => !v)}
              aria-expanded={showImport}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border transition-colors ${
                showImport ? 'bg-dark text-cream border-dark' : 'bg-gold text-dark border-gold hover:bg-gold-600'
              }`}
            >
              <Upload className="h-4 w-4" />{t('Importar reporte')}
            </button>
          </div>
        </div>
      </div>

      {showImport && <ImportPanel onDone={() => load(month)} />}

      {error && <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      {loading ? (
        <div className="space-y-4" aria-busy="true">
          <LoadingCard tall />
          <div className="grid grid-cols-2 gap-3"><LoadingCard /><LoadingCard /></div>
        </div>
      ) : empty ? (
        <CardBox>
          <p className="text-sm text-warm-gray-500">
            {t('Aún no hay marcaciones. En la app NGTeco Time ve a Reportes, exporta el Excel del período y súbelo aquí.')}
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
      const res = await fetch('/api/admin/kpis/asistencia/import', { method: 'POST', body: form })
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
    s === 'imported' ? 'bg-spa-green/15 text-spa-green' :
    s === 'duplicate' ? 'bg-gold/20 text-gold-700' :
    'bg-red-100 text-red-700'

  const statusLabel = (s: string) =>
    s === 'imported' ? t('importado') :
    s === 'duplicate' ? t('duplicado') : 'error'

  return (
    <CardBox className="mb-4">
      <Label>{t('Importar reporte de asistencia')}</Label>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); send(e.dataTransfer.files) }}
        className={`mt-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragOver ? 'border-spa-green bg-spa-green/5' : 'border-beige-400 bg-beige-50'
        }`}
      >
        {busy ? (
          <div className="flex flex-col items-center gap-2 text-sm text-warm-gray-500">
            <Loader2 className="h-6 w-6 animate-spin text-dark" />
            {t('Importando marcaciones…')}
          </div>
        ) : (
          <>
            <FileUp className="h-6 w-6 mx-auto text-warm-gray-500" />
            <p className="text-sm text-dark mt-2 font-medium">{t('Arrastra aquí el export de NGTeco Time')}</p>
            <p className="text-xs text-warm-gray-500 mt-0.5">
              {t('xlsx, xls o csv · subir un período repetido corrige las marcaciones anteriores, no las duplica')}
            </p>
            <button
              onClick={() => inputRef.current?.click()}
              className="mt-3 px-4 py-1.5 rounded-lg text-sm font-bold bg-dark text-cream hover:bg-dark/85"
            >
              {t('Elegir archivo')}
            </button>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".xlsx,.xls,.csv"
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
              <span className="text-warm-gray-500 whitespace-nowrap ml-auto">
                {r.status === 'imported'
                  ? `${r.periodStart} → ${r.periodEnd} · ${r.employees} ${t('personas')} · ${r.rows} ${t('marcaciones')}`
                  : r.detail}
              </span>
            </li>
          ))}
        </ul>
      )}
    </CardBox>
  )
}

// ---------- dashboard ----------

function Dashboard({ data }: { data: AttendancePayload }) {
  const t = useT()
  const tot = data.totals
  const coverage = tot.schedMin > 0 ? tot.workedMin / tot.schedMin : null

  return (
    <div className="space-y-4">
      {!data.schedulesLive && (
        <div className="p-3 rounded-xl bg-gold/15 border border-gold/40 text-xs text-dark flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-gold-700" />
          {t('No se pudieron cargar los horarios de Mindbody; las tardanzas se calculan contra la primera cita del día.')}
        </div>
      )}

      {data.unmatched.length > 0 && (
        <div className="p-3 rounded-xl bg-gold/15 border border-gold/40 text-xs text-dark flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-gold-700" />
          <span>
            {t('Sin match en Mindbody (revisa el nombre en el reloj):')}{' '}
            <strong>{data.unmatched.join(', ')}</strong>
          </span>
        </div>
      )}

      {/* Team summary */}
      <div className="grid grid-cols-2 gap-3">
        <CardBox>
          <Label>{t('Horas trabajadas')}</Label>
          <p className="text-2xl font-display font-semibold text-dark mt-1">{fmtH(tot.workedMin)}</p>
          <p className="text-xs text-warm-gray-500 mt-0.5">
            {tot.schedMin > 0
              ? `${t('de')} ${fmtH(tot.schedMin)} ${t('programadas')}${coverage !== null ? ` · ${Math.round(coverage * 100)}%` : ''}`
              : t('sin horario Mindbody')}
          </p>
        </CardBox>
        <CardBox>
          <Label>{t('Horas en citas')}</Label>
          <p className="text-2xl font-display font-semibold text-dark mt-1">{fmtH(tot.apptMin)}</p>
          <p className="text-xs text-warm-gray-500 mt-0.5">
            {tot.workedMin > 0 ? `${Math.round((tot.apptMin / tot.workedMin) * 100)}% ${t('del tiempo presente')}` : '—'}
          </p>
        </CardBox>
        <CardBox>
          <Label>{t('Días con tardanza')}</Label>
          <p className={`text-2xl font-display font-semibold mt-1 ${tot.lateDays > 0 ? 'text-red-700' : 'text-dark'}`}>{tot.lateDays}</p>
          <p className="text-xs text-warm-gray-500 mt-0.5">{t('más de')} {GRACE_MIN} {t('min después del horario')}</p>
        </CardBox>
        <CardBox>
          <Label>{t('Incidencias')}</Label>
          <p className="text-2xl font-display font-semibold text-dark mt-1">{tot.missingOutDays + tot.absentDays}</p>
          <p className="text-xs text-warm-gray-500 mt-0.5">
            {tot.missingOutDays} {t('sin marcar salida')} · {tot.absentDays} {t('ausencias con horario')}
          </p>
        </CardBox>
      </div>

      {data.employees.map(e => <EmployeeCard key={e.name} emp={e} />)}
    </div>
  )
}

function EmployeeCard({ emp }: { emp: AttendanceEmployee }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const coverage = emp.schedMin > 0 ? emp.workedMin / emp.schedMin : null

  return (
    <CardBox>
      <button onClick={() => setOpen(v => !v)} aria-expanded={open} className="w-full text-left">
        <div className="flex items-center gap-2">
          <div className="min-w-0">
            <p className="font-display font-semibold text-dark text-lg truncate">{emp.name}</p>
            <p className="text-xs text-warm-gray-500">
              {emp.mbName
                ? emp.mbName !== emp.name ? `Mindbody: ${emp.mbName}` : t('vinculado con Mindbody')
                : t('sin match en Mindbody')}
            </p>
          </div>
          <div className="ml-auto text-right shrink-0">
            <p className="font-semibold text-dark">{fmtH(emp.workedMin)}</p>
            <p className="text-xs text-warm-gray-500">
              {emp.days} {t('días')}{coverage !== null ? ` · ${Math.round(coverage * 100)}% ${t('del horario')}` : ''}
            </p>
          </div>
          <ChevronDown className={`h-4 w-4 text-warm-gray-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2 text-[11px] font-bold">
          {emp.appts > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-beige text-warm-gray-500">
              {fmtH(emp.apptMin)} {t('en')} {emp.appts} {t('citas')}
            </span>
          )}
          {emp.lateDays > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              {emp.lateDays} {t('tardanzas')}{emp.avgLateMin !== null ? ` · ${t('prom.')} ${emp.avgLateMin} min` : ''}
            </span>
          )}
          {emp.earlyOutDays > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold-700">{emp.earlyOutDays} {t('salidas tempranas')}</span>
          )}
          {emp.missingOutDays > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold-700">{emp.missingOutDays} {t('sin marcar salida')}</span>
          )}
          {emp.absentDays > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700">{emp.absentDays} {t('ausencias con horario')}</span>
          )}
        </div>
      </button>

      {open && (
        <div className="mt-3 -mx-4 px-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-warm-gray-500 border-b border-beige-300">
                <th className="py-1.5 pr-2 font-semibold">{t('Fecha')}</th>
                <th className="py-1.5 pr-2 font-semibold">{t('Entrada')}</th>
                <th className="py-1.5 pr-2 font-semibold">{t('Salida')}</th>
                <th className="py-1.5 pr-2 font-semibold text-right">{t('Horas')}</th>
                <th className="py-1.5 pr-2 font-semibold">{t('Horario')}</th>
                <th className="py-1.5 font-semibold text-right">{t('Citas')}</th>
              </tr>
            </thead>
            <tbody>
              {emp.detail.map(d => <DayRow key={d.date} d={d} />)}
            </tbody>
          </table>
        </div>
      )}
    </CardBox>
  )
}

function DayRow({ d }: { d: AttendanceDay }) {
  const t = useT()
  const late = d.lateMin !== null && d.lateMin > GRACE_MIN
  const early = d.earlyOutMin !== null && d.earlyOutMin > GRACE_MIN && !d.missingOut
  const absent = d.shifts === 0

  return (
    <tr className={`border-b border-beige-200 ${absent ? 'bg-red-50/60' : ''}`}>
      <td className="py-1.5 pr-2 whitespace-nowrap text-dark">{formatDateEs(d.date).replace(/ \d{4}$/, '')}</td>
      <td className={`py-1.5 pr-2 whitespace-nowrap ${late ? 'text-red-700 font-bold' : 'text-dark'}`}>
        {absent ? t('no marcó') : d.clockIn ?? '—'}
        {late && <span className="block text-[10px] font-bold">+{d.lateMin} min</span>}
      </td>
      <td className={`py-1.5 pr-2 whitespace-nowrap ${d.missingOut && !absent ? 'text-gold-700 font-bold' : early ? 'text-gold-700 font-bold' : 'text-dark'}`}>
        {absent ? '' : d.missingOut ? t('sin salida') : d.clockOut ?? '—'}
        {early && d.earlyOutMin !== null && <span className="block text-[10px] font-bold">−{d.earlyOutMin} min</span>}
      </td>
      <td className="py-1.5 pr-2 text-right whitespace-nowrap text-dark font-semibold">{absent ? '—' : fmtHM(d.workedMin)}</td>
      <td className="py-1.5 pr-2 whitespace-nowrap text-warm-gray-500">
        {d.schedStart ? `${d.schedStart}–${d.schedEnd}` : d.firstAppt ? `${t('citas desde')} ${d.firstAppt}` : '—'}
      </td>
      <td className="py-1.5 text-right whitespace-nowrap text-warm-gray-500">
        {d.appts > 0 ? `${d.appts} · ${fmtHM(d.apptMin)}` : '—'}
      </td>
    </tr>
  )
}
