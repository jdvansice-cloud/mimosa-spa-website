'use client'

import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, Download, Loader2, Receipt, RefreshCw, XCircle } from 'lucide-react'
import { AdminPage } from '@/components/admin/AdminPage'
import { AdminTable, CardField, StatusPill, type AdminColumn } from '@/components/admin/AdminTable'

interface InvoiceRow {
  id: string
  order_id: string | null
  location_id: number
  doc_type: string
  environment: string
  status: string
  cufe: string | null
  numero_documento: string | null
  protocolo_autorizacion: string | null
  fecha_autorizacion: string | null
  qr_content: string | null
  referenced_cufe: string | null
  error: string | null
  attempts: number
  created_at: string
  codigo_sucursal: string | null
  order: { order_number: string; buyer_name: string | null; total_cents: number } | null
}
interface ConfigRow {
  location_id: number
  label: string | null
  codigo_sucursal: string | null
  environment: string
  punto_facturacion: string
  enabled: boolean
}

const DOC_LABEL: Record<string, string> = {
  '01': 'Factura',
  '04': 'Nota de crédito',
  '06': 'NC genérica',
}
type Tone = 'green' | 'amber' | 'red' | 'gray'
const STATUS: Record<string, { label: string; tone: Tone }> = {
  pending: { label: 'Pendiente', tone: 'gray' },
  emitting: { label: 'Emitiendo', tone: 'amber' },
  authorized: { label: 'Autorizada', tone: 'green' },
  rejected: { label: 'Rechazada', tone: 'red' },
  cancelled: { label: 'Anulada', tone: 'gray' },
}
const statusOf = (s: string) => STATUS[s] ?? { label: s, tone: 'gray' as Tone }
const money = (c: number) => `$${(c / 100).toFixed(2)}`
const dt = (s: string | null) =>
  s ? new Date(s).toLocaleString('es-PA', { timeZone: 'America/Panama', day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit' }) : '—'

export default function AdminFacturasPage() {
  const [rows, setRows] = useState<InvoiceRow[]>([])
  const [config, setConfig] = useState<ConfigRow[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/facturas')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      setRows(json.data ?? [])
      setConfig(json.config ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const act = async (row: InvoiceRow, action: string) => {
    let reason = ''
    if (action === 'cancel') {
      reason = prompt('Motivo de la anulación (mínimo 10 caracteres):') ?? ''
      if (reason.trim().length < 10) return
    }
    setBusyId(row.id)
    setError(null)
    try {
      const res = await fetch('/api/admin/facturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, invoiceId: row.id, reason }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      if (action === 'cafe' && json.base64) {
        const blob = new Blob(
          [Uint8Array.from(atob(json.base64), c => c.charCodeAt(0))],
          { type: 'application/pdf' }
        )
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
        setTimeout(() => URL.revokeObjectURL(url), 60_000)
      } else {
        await load()
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setBusyId(null)
    }
  }

  // Name the branch from the config rather than the Mindbody location id: an
  // online order is delivered at a spa but INVOICED under "Mimosa Online".
  const sucursalName = (r: InvoiceRow) =>
    config.find(c => c.codigo_sucursal && c.codigo_sucursal === r.codigo_sucursal)?.label
    ?? (r.codigo_sucursal ? `Sucursal ${r.codigo_sucursal}` : '—')

  const rejected = rows.filter(r => r.status === 'rejected').length
  const testMode = config.some(c => c.environment === 'test' && c.enabled)

  // Shared by the desktop row and the mobile card so the two can't drift.
  const actions = (r: InvoiceRow) => (
    <div className="flex flex-wrap gap-1.5">
      {r.status === 'authorized' && (
        <>
          <button onClick={() => act(r, 'cafe')} disabled={busyId === r.id}
            className="inline-flex items-center gap-1 min-h-[44px] rounded-lg border border-beige-400 px-3 text-xs hover:bg-beige/50 disabled:opacity-50">
            {busyId === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />} CAFE
          </button>
          <button onClick={() => act(r, 'cancel')} disabled={busyId === r.id}
            className="min-h-[44px] rounded-lg border border-beige-400 px-3 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50">
            Anular
          </button>
        </>
      )}
      {r.status === 'rejected' && (
        <button onClick={() => act(r, 'retry')} disabled={busyId === r.id}
          className="min-h-[44px] rounded-lg bg-dark px-3 text-xs font-medium text-cream disabled:opacity-50">
          {busyId === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Reintentar'}
        </button>
      )}
      {r.qr_content && (
        <a href={r.qr_content} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center min-h-[44px] rounded-lg border border-beige-400 px-3 text-xs hover:bg-beige/50">
          DGI
        </a>
      )}
    </div>
  )

  const docCell = (r: InvoiceRow) => (
    <>
      <p className="font-medium text-dark">{DOC_LABEL[r.doc_type] ?? r.doc_type}</p>
      <p className="text-[11px] text-warm-gray-500">
        {r.numero_documento ? `Nº ${r.numero_documento} · ` : ''}{sucursalName(r)}
      </p>
    </>
  )

  const orderCell = (r: InvoiceRow) => (
    r.order ? (
      <>
        <p className="font-mono text-xs text-dark">{r.order.order_number}</p>
        <p className="text-[11px] text-warm-gray-500">
          {r.order.buyer_name} · {money(r.order.total_cents)}
        </p>
      </>
    ) : <span className="text-warm-gray-500">—</span>
  )

  const statusCell = (r: InvoiceRow) => {
    const st = statusOf(r.status)
    return (
      <>
        <StatusPill tone={st.tone}>{st.label}</StatusPill>
        {r.error && <p className="mt-1 max-w-[260px] text-[11px] text-red-600">{r.error}</p>}
        {r.attempts > 1 && <p className="text-[11px] text-warm-gray-500">{r.attempts} intentos</p>}
      </>
    )
  }

  const columns: Array<AdminColumn<InvoiceRow>> = [
    { key: 'doc', header: 'Documento', render: docCell },
    { key: 'order', header: 'Pedido', render: orderCell },
    {
      key: 'cufe',
      header: 'CUFE',
      render: r => (
        <>
          {r.cufe
            ? <p className="max-w-[220px] break-all font-mono text-[10px] text-warm-gray-500">{r.cufe}</p>
            : <span className="text-warm-gray-500">—</span>}
          {r.referenced_cufe && (
            <p className="mt-1 max-w-[220px] break-all text-[10px] text-purple-700">ref: {r.referenced_cufe}</p>
          )}
        </>
      ),
    },
    { key: 'status', header: 'Estado', render: statusCell },
    {
      key: 'issued',
      header: 'Emitido',
      render: r => <span className="text-xs text-warm-gray-500">{dt(r.fecha_autorizacion ?? r.created_at)}</span>,
    },
    { key: 'actions', header: '', srHeader: 'Acciones', render: actions },
  ]

  const mobileCard = (r: InvoiceRow) => {
    const st = statusOf(r.status)
    return (
      <>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">{docCell(r)}</div>
          <StatusPill tone={st.tone}>{st.label}</StatusPill>
        </div>
        <dl className="mt-3 space-y-1">
          {r.order && <CardField label="Pedido">{orderCell(r)}</CardField>}
          <CardField label="Emitido">{dt(r.fecha_autorizacion ?? r.created_at)}</CardField>
          {r.cufe && (
            <CardField label="CUFE">
              <span className="break-all font-mono text-[10px] text-warm-gray-500">{r.cufe}</span>
            </CardField>
          )}
        </dl>
        {r.error && <p className="mt-2 text-[11px] text-red-600">{r.error}</p>}
        <div className="mt-3">{actions(r)}</div>
      </>
    )
  }

  return (
    <AdminPage
      title="Facturación electrónica"
      icon={Receipt}
      description="Documentos emitidos directamente al PAC. Las gift cards no se facturan en la venta — se factura el servicio al momento de canjearlas."
      actions={
        <button onClick={load} className="inline-flex items-center gap-1.5 min-h-[44px] rounded-lg border border-beige-400 px-4 text-sm hover:bg-beige/50">
          <RefreshCw className="h-4 w-4" /> Actualizar
        </button>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {config.map(c => (
            <div key={c.location_id} className="rounded-lg border border-beige-400 bg-white px-4 py-2 text-sm">
              <span className="font-medium text-dark">{c.label ?? `Sucursal ${c.codigo_sucursal ?? c.location_id}`}</span>
              <span className="ml-2 text-warm-gray-500">punto {c.punto_facturacion}</span>
              <span className={`ml-2 rounded-full px-2 py-0.5 text-[11px] ${c.enabled ? 'bg-green-100 text-green-800' : 'bg-beige-300 text-warm-gray-600'}`}>
                {c.enabled ? 'activa' : 'inactiva'}
              </span>
              {c.environment === 'test' && (
                <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-800">pruebas</span>
              )}
            </div>
          ))}
        </div>

        {testMode && (
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Ambiente de PRUEBAS: los documentos emitidos no tienen valor fiscal.
          </div>
        )}
        {rejected > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            <XCircle className="h-4 w-4 shrink-0" />
            {rejected} documento(s) rechazados por la DGI — revisa el motivo y reintenta.
          </div>
        )}

        <AdminTable
          rows={rows}
          columns={columns}
          rowKey={r => r.id}
          mobileCard={mobileCard}
          loading={loading}
          error={error}
          empty="Todavía no se ha emitido ningún documento."
        />
      </div>
    </AdminPage>
  )
}
