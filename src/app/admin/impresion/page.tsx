'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Printer, Loader2, RotateCw, X, CheckCircle2, AlertTriangle, Play, Square, Crosshair, Eye } from 'lucide-react'
import { AdminPage } from '@/components/admin/AdminPage'
import { AdminTable, AdminColumn } from '@/components/admin/AdminTable'
import { Button } from '@/components/ui'
import { LOCATION_NAMES } from '@/lib/kpis/constants'
import { printCafeReceipt, getSavedReceiptPrinter, saveReceiptPrinter } from '@/lib/qz/qzReceipt'
import { renderCafeCanvas } from '@/components/admin/print/renderCafeCanvas'
import { QzError, listPrinters } from '@/lib/qz/client'
import { sampleCafeReceipt } from '@/lib/print/sampleReceipt'
import type { CafeReceiptPayload, PrintJob } from '@/lib/print/types'

/**
 * The print station.
 *
 * One front-desk Mac per spa runs this page with QZ Tray installed; it claims
 * CAFE jobs for its location and prints them. Everything else — a manager's
 * laptop, a phone — can open the same page to WATCH the queue without turning
 * the station on, so nobody accidentally claims receipts to a machine with no
 * printer attached.
 */

const POLL_MS = 5000
const STATION_KEY = 'cafe-print-station-v1'
const LOCATION_KEY = 'cafe-print-location-v1'

/** Stable per-machine id so a claim can be traced back to a counter. */
function loadStationId(): string {
  try {
    const saved = localStorage.getItem(STATION_KEY)
    if (saved) return saved
    const id = `estacion-${Math.random().toString(36).slice(2, 8)}`
    localStorage.setItem(STATION_KEY, id)
    return id
  } catch {
    return 'estacion-temporal'
  }
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  pending: { label: 'En cola', className: 'bg-beige-100 text-warm-gray-600' },
  printing: { label: 'Imprimiendo', className: 'bg-blue-50 text-blue-700' },
  printed: { label: 'Impreso', className: 'bg-green-50 text-green-700' },
  failed: { label: 'Falló', className: 'bg-red-50 text-red-700' },
  cancelled: { label: 'Cancelado', className: 'bg-beige-100 text-warm-gray-400' },
}

function StatusChip({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { label: status, className: 'bg-beige-100 text-warm-gray-600' }
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${s.className}`}>
      {s.label}
    </span>
  )
}

const money = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)

function formatTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-PA', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Panama',
  })
}

export default function PrintStationPage() {
  const [locationId, setLocationId] = useState(1)
  const [stationId, setStationId] = useState('')
  const [active, setActive] = useState(false)
  const [jobs, setJobs] = useState<PrintJob[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [printerChoices, setPrinterChoices] = useState<string[] | null>(null)
  const [printer, setPrinter] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  // A poll tick must never overlap the previous one: printing is slow, and two
  // in-flight drains would claim the same job twice.
  const drainingRef = useRef(false)
  const activeRef = useRef(false)

  useEffect(() => {
    setStationId(loadStationId())
    setPrinter(getSavedReceiptPrinter())
    try {
      const saved = Number(localStorage.getItem(LOCATION_KEY))
      if (saved === 1 || saved === 2) setLocationId(saved)
    } catch {
      // no stored preference — keep the default
    }
  }, [])

  useEffect(() => {
    activeRef.current = active
  }, [active])

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/print/jobs?locationId=${locationId}`)
      const data = await res.json()
      if (res.ok) setJobs(data.jobs ?? [])
    } catch {
      // a failed refresh only means a stale list; the next tick retries
    } finally {
      setLoading(false)
    }
  }, [locationId])

  /** Claim whatever is pending and print it, reporting each outcome. */
  const drain = useCallback(async () => {
    if (drainingRef.current || !activeRef.current || !stationId) return
    drainingRef.current = true
    try {
      const res = await fetch('/api/admin/print/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationId, stationId }),
      })
      const data = await res.json()
      const claimed: PrintJob[] = data.jobs ?? []

      for (const job of claimed) {
        try {
          const usedPrinter = await printCafeReceipt(job.payload as CafeReceiptPayload)
          setPrinter(usedPrinter)
          await fetch(`/api/admin/print/jobs/${job.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'done' }),
          })
        } catch (e) {
          // Surface the printer picker rather than failing silently in a loop.
          if (e instanceof QzError && e.kind === 'printer') {
            setPrinterChoices(e.printers ?? [])
            setActive(false)
          }
          const msg = e instanceof Error ? e.message : 'Error de impresión'
          setMessage(msg)
          await fetch(`/api/admin/print/jobs/${job.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'failed', error: msg }),
          })
          // Stop after the first failure: if the printer is offline, marching
          // through the queue just turns every waiting receipt into a failure.
          break
        }
      }
      if (claimed.length) await refresh()
    } catch {
      // network blip — the next tick tries again
    } finally {
      drainingRef.current = false
    }
  }, [locationId, stationId, refresh])

  useEffect(() => {
    refresh()
    const timer = setInterval(() => {
      refresh()
      drain()
    }, POLL_MS)
    return () => clearInterval(timer)
  }, [refresh, drain])

  const act = async (jobId: string, action: 'reprint' | 'cancel') => {
    const res = await fetch(`/api/admin/print/jobs/${jobId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const data = await res.json().catch(() => ({}))
    setMessage(res.ok ? (action === 'reprint' ? 'Reimpresión en cola.' : 'Cancelado.') : data?.error)
    await refresh()
  }

  /**
   * Render a job (or the sample) on screen at half size. Checking the layout
   * on paper costs a roll and a trip to the counter; this costs a click.
   */
  const showPreview = async (payload: CafeReceiptPayload) => {
    try {
      const canvas = await renderCafeCanvas(payload)
      setPreview(canvas.toDataURL('image/png'))
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'No se pudo generar la vista previa')
    }
  }

  /** Prove the printer works before a customer is standing at the counter. */
  const testPrint = async () => {
    setMessage('Imprimiendo prueba…')
    try {
      const used = await printCafeReceipt(sampleCafeReceipt())
      setPrinter(used)
      setMessage(`Prueba enviada a ${used}.`)
    } catch (e) {
      if (e instanceof QzError && e.kind === 'printer') setPrinterChoices(e.printers ?? [])
      setMessage(e instanceof Error ? e.message : 'Error al imprimir la prueba')
    }
  }

  const choosePrinter = async () => {
    try {
      setPrinterChoices(await listPrinters())
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'No se pudieron listar las impresoras')
    }
  }

  const pending = jobs.filter(j => j.status === 'pending' || j.status === 'printing').length
  const failed = jobs.filter(j => j.status === 'failed').length

  const columns: Array<AdminColumn<PrintJob>> = [
    {
      key: 'documento',
      header: 'Documento',
      render: j => (
        <div>
          <div className="font-medium text-dark">{j.payload?.documento?.numero ?? 'Sin número'}</div>
          <div className="text-xs text-warm-gray-500">{j.payload?.referencia ?? '—'}</div>
        </div>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      render: j => (j.payload?.totales ? money(j.payload.totales.totalCents) : '—'),
    },
    { key: 'status', header: 'Estado', render: j => <StatusChip status={j.status} /> },
    {
      key: 'when',
      header: 'Creado',
      render: j => <span className="text-sm text-warm-gray-500">{formatTime(j.created_at)}</span>,
    },
    {
      key: 'detail',
      header: 'Detalle',
      render: j => (
        <span className="text-xs text-warm-gray-500">
          {j.error ? j.error : j.printed_at ? `Impreso ${formatTime(j.printed_at)}` : j.claimed_by ?? '—'}
          {j.reprint_of && <span className="ml-1 text-gold-700">(reimpresión)</span>}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      srHeader: 'Acciones',
      align: 'right',
      render: j => (
        <div className="flex justify-end gap-1">
          <Button variant="secondary" size="sm" onClick={() => showPreview(j.payload)}>
            <Eye className="h-4 w-4" />
            <span className="sr-only">Vista previa</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => act(j.id, 'reprint')}>
            <RotateCw className="h-4 w-4" /> Reimprimir
          </Button>
          {(j.status === 'pending' || j.status === 'failed' || j.status === 'printing') && (
            <Button variant="secondary" size="sm" onClick={() => act(j.id, 'cancel')}>
              <X className="h-4 w-4" />
              <span className="sr-only">Cancelar</span>
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <AdminPage
      title="Impresión de facturas"
      icon={Printer}
      description="Los CAFE emitidos en el mostrador se imprimen aquí. Activa la estación en la Mac que tiene la impresora conectada; las demás pantallas solo observan la cola."
      actions={
        <>
        <Button variant="secondary" onClick={() => showPreview(sampleCafeReceipt())}>
          <Eye className="h-4 w-4" /> Ver muestra
        </Button>
        <Button variant="secondary" onClick={testPrint}>
          <Crosshair className="h-4 w-4" /> Imprimir prueba
        </Button>
        <Button variant={active ? 'secondary' : 'primary'} onClick={() => setActive(a => !a)}>
          {active ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {active ? 'Detener estación' : 'Activar estación'}
        </Button>
        </>
      }
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="p-4 bg-white border border-beige-300 rounded-lg">
          <label htmlFor="sede" className="block text-xs text-warm-gray-500 mb-1">Sede</label>
          <select
            id="sede"
            value={locationId}
            onChange={e => {
              const v = Number(e.target.value)
              setLocationId(v)
              try { localStorage.setItem(LOCATION_KEY, String(v)) } catch { /* not remembered */ }
            }}
            className="w-full border border-beige-300 rounded px-2 py-2"
          >
            {Object.entries(LOCATION_NAMES).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>

        <div className="p-4 bg-white border border-beige-300 rounded-lg">
          <div className="text-xs text-warm-gray-500 mb-1">Impresora</div>
          <div className="text-sm text-dark truncate">{printer ?? 'Sin seleccionar'}</div>
          <button onClick={choosePrinter} className="mt-1 text-xs text-gold-700 hover:underline">
            Cambiar impresora
          </button>
          <div className="text-xs text-warm-gray-400 mt-1">{stationId}</div>
        </div>

        <div className="p-4 bg-white border border-beige-300 rounded-lg">
          <div className="text-xs text-warm-gray-500 mb-1">Cola</div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-display text-dark">{pending}</span>
            <span className="text-sm text-warm-gray-500">pendientes</span>
          </div>
          {failed > 0 && (
            <div className="mt-1 text-sm text-red-700 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> {failed} sin imprimir
            </div>
          )}
        </div>
      </div>

      {active && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Estación activa — revisando la cola cada {POLL_MS / 1000} segundos.
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-beige-100 border border-beige-300 text-warm-gray-700 flex items-center justify-between gap-2">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} aria-label="Cerrar"><X className="h-4 w-4" /></button>
        </div>
      )}

      {printerChoices && (
        <div className="mb-4 p-4 rounded-lg bg-white border border-beige-300">
          <div className="text-sm font-medium text-dark mb-2">Selecciona la impresora de recibos</div>
          <div className="flex flex-wrap gap-2">
            {printerChoices.length === 0 && (
              <span className="text-sm text-warm-gray-500">QZ Tray no reporta impresoras.</span>
            )}
            {printerChoices.map(name => (
              <Button
                key={name}
                variant="secondary"
                size="sm"
                onClick={() => {
                  saveReceiptPrinter(name)
                  setPrinter(name)
                  setPrinterChoices(null)
                  setMessage(`Impresora guardada: ${name}`)
                }}
              >
                {name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {preview && (
        <div className="mb-4 p-4 rounded-lg bg-white border border-beige-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-dark">Vista previa (80 mm)</span>
            <button onClick={() => setPreview(null)} aria-label="Cerrar vista previa">
              <X className="h-4 w-4" />
            </button>
          </div>
          {/* Half of 576 dots — the receipt at roughly its physical size on a
              typical screen, which is what you want to judge legibility. */}
          <img src={preview} alt="Vista previa del CAFE" width={288} className="border border-beige-200" />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gold-600" /></div>
      ) : (
        <AdminTable
          rows={jobs}
          columns={columns}
          rowKey={j => j.id}
          empty="No hay documentos en la cola."
          mobileCard={j => (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-dark">{j.payload?.documento?.numero ?? 'Sin número'}</span>
                <StatusChip status={j.status} />
              </div>
              <div className="text-sm text-warm-gray-500">
                {j.payload?.referencia ?? '—'} · {j.payload?.totales ? money(j.payload.totales.totalCents) : '—'}
              </div>
              <div className="text-xs text-warm-gray-400">{formatTime(j.created_at)}</div>
              {j.error && <div className="text-xs text-red-700">{j.error}</div>}
              <div className="pt-2">
                <Button variant="secondary" size="sm" onClick={() => act(j.id, 'reprint')}>
                  <RotateCw className="h-4 w-4" /> Reimprimir
                </Button>
              </div>
            </div>
          )}
        />
      )}
    </AdminPage>
  )
}
