'use client'

import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, Loader2, RefreshCw, ShoppingBag } from 'lucide-react'
import { AdminPage } from '@/components/admin/AdminPage'
import { AdminTable, CardField, StatusPill, type AdminColumn } from '@/components/admin/AdminTable'

interface OrderItem {
  item_type: string
  name_es: string
  total_cents: number
  appointment_start: string | null
  gc_serial: string | null
  mindbody_appointment_ids: number[] | null
}
interface OrderPayment {
  kind: string
  amount_cents: number
  status: string
  tilopay_tpt: string | null
  mindbody_tender: string | null
  gc_barcode: string | null
}
interface OrderRow {
  id: string
  order_number: string
  status: string
  failure_code: string | null
  failure_detail: string | null
  buyer_name: string | null
  buyer_email: string | null
  buyer_phone: string | null
  location_id: number
  discount_cents: number
  tax_cents: number
  total_cents: number
  promo_code: string | null
  mindbody_sale_id: number | null
  mindbody_grand_total_cents: number | null
  posting_attempts: number
  pos_refund_required: boolean
  pos_refund_done_at: string | null
  authorized_at: string | null
  captured_at: string | null
  posted_at: string | null
  notes: string | null
  created_at: string
  items: OrderItem[]
  payments: OrderPayment[]
}

type Tone = 'green' | 'amber' | 'red' | 'gray'
const STATUS: Record<string, { label: string; tone: Tone }> = {
  draft: { label: 'Borrador', tone: 'gray' },
  totals_verified: { label: 'Sin pagar', tone: 'gray' },
  authorized: { label: 'Autorizada', tone: 'amber' },
  booked: { label: 'Reservada', tone: 'amber' },
  captured: { label: 'Cobrada', tone: 'amber' },
  posted: { label: 'En Mindbody', tone: 'amber' },
  invoiced: { label: 'Facturada', tone: 'green' },
  fulfilled: { label: 'Completada', tone: 'green' },
  expired: { label: 'Expirada', tone: 'gray' },
  cancelled: { label: 'Cancelada', tone: 'red' },
  refunded: { label: 'Reembolsada', tone: 'gray' },
}

const FAILURE: Record<string, string> = {
  auth_declined: 'Pago rechazado',
  slot_lost_voided: 'Horario perdido — autorización anulada',
  capture_failed: 'No se pudo cobrar la autorización',
  posting_failed: 'No se pudo registrar en Mindbody',
  invoice_failed: 'No se pudo facturar',
  gc_balance_short: 'Saldo de gift card insuficiente',
}

const money = (c: number) => `$${(c / 100).toFixed(2)}`
const dt = (s: string | null) =>
  s ? new Date(s).toLocaleString('es-PA', { timeZone: 'America/Panama', day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit' }) : '—'

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [onlyAttention, setOnlyAttention] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/orders${onlyAttention ? '?attention=1' : ''}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      setOrders(json.data ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setLoading(false)
    }
  }, [onlyAttention])

  useEffect(() => { load() }, [load])

  const act = async (id: string, action: string) => {
    const confirmMsg: Record<string, string> = {
      void: '¿Anular la autorización? El cliente no queda cobrado.',
      refund: '¿Reembolsar el pago? Luego debes anular la venta en Mindbody y emitir la nota de crédito.',
    }
    if (confirmMsg[action] && !confirm(confirmMsg[action])) return
    setBusyId(id)
    setError(null)
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      if (json.manualSteps) alert(`Reembolso hecho.\n\nPasos manuales:\n• ${json.manualSteps.join('\n• ')}`)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setBusyId(null)
    }
  }

  const attentionCount = orders.filter(
    o => o.failure_code || ['authorized', 'booked', 'captured'].includes(o.status)
  ).length

  const posRefundPending = (o: OrderRow) => o.pos_refund_required && !o.pos_refund_done_at

  const needsAttentionFor = (o: OrderRow) =>
    !!o.failure_code || ['authorized', 'booked', 'captured'].includes(o.status) || posRefundPending(o)

  const orderCell = (o: OrderRow) => (
    <>
      <button onClick={() => setExpanded(expanded === o.id ? null : o.id)}
        aria-expanded={expanded === o.id}
        className="font-mono text-xs text-gold-700 hover:underline">
        {o.order_number}
      </button>
      <p className="text-[11px] text-warm-gray-500">{dt(o.created_at)}</p>
      <p className="text-[11px] text-warm-gray-500">{o.location_id === 1 ? 'CDE' : 'SFC'}</p>
    </>
  )

  const itemsCell = (o: OrderRow) => (
    <>
      {o.items.map((it, i) => (
        <p key={i} className="text-xs text-dark">
          {it.item_type === 'gift_card' ? '🎁 ' : ''}{it.name_es}
          {it.appointment_start && <span className="text-warm-gray-500"> · {dt(it.appointment_start)}</span>}
        </p>
      ))}
      {o.promo_code && <p className="text-[11px] text-green-700">Código {o.promo_code}</p>}
    </>
  )

  const statusCell = (o: OrderRow) => {
    const st = STATUS[o.status] ?? { label: o.status, tone: 'gray' as const }
    return (
      <>
        <StatusPill tone={st.tone}>{st.label}</StatusPill>
        {o.failure_code && (
          <p className="mt-1 text-[11px] text-red-600">{FAILURE[o.failure_code] ?? o.failure_code}</p>
        )}
        {posRefundPending(o) && (
          <p className="mt-1 text-[11px] text-amber-700">
            Falta registrar el reembolso de la venta #{o.mindbody_sale_id} en Mindbody (POS)
          </p>
        )}
        {o.pos_refund_required && o.pos_refund_done_at && (
          <p className="mt-1 text-[11px] text-warm-gray-500">Reembolso registrado en Mindbody</p>
        )}
      </>
    )
  }

  const mindbodyCell = (o: OrderRow) => (
    o.mindbody_sale_id ? (
      <span className="text-green-700">Venta #{o.mindbody_sale_id}</span>
    ) : o.items.some(i => i.item_type === 'service') ? (
      <span className="text-warm-gray-500">— {o.posting_attempts > 0 && `(${o.posting_attempts} intentos)`}</span>
    ) : (
      <span className="text-warm-gray-500">n/a</span>
    )
  )

  const actions = (o: OrderRow) => (
    <div className="flex flex-wrap gap-1.5">
      {needsAttentionFor(o) && !posRefundPending(o) && (
        <button
          onClick={() => act(o.id, o.failure_code === 'capture_failed' ? 'capture' : 'retry')}
          disabled={busyId === o.id}
          className="min-h-[44px] rounded-lg bg-dark px-3 text-xs font-medium text-cream disabled:opacity-50"
        >
          {busyId === o.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Reintentar'}
        </button>
      )}
      {posRefundPending(o) && (
        <button onClick={() => act(o.id, 'pos_refund_done')} disabled={busyId === o.id}
          className="min-h-[44px] rounded-lg bg-dark px-3 text-xs font-medium text-cream disabled:opacity-50">
          {busyId === o.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Ya registré el reembolso'}
        </button>
      )}
      {o.status === 'authorized' && (
        <button onClick={() => act(o.id, 'void')} disabled={busyId === o.id}
          className="min-h-[44px] rounded-lg border border-beige-400 px-3 text-xs disabled:opacity-50">
          Anular
        </button>
      )}
      {['captured', 'posted', 'invoiced', 'fulfilled'].includes(o.status) && (
        <button onClick={() => act(o.id, 'refund')} disabled={busyId === o.id}
          className="min-h-[44px] rounded-lg border border-beige-400 px-3 text-xs text-red-600 disabled:opacity-50">
          Reembolsar
        </button>
      )}
    </div>
  )

  /** Payment breakdown — shown inline when a row is expanded. */
  const details = (o: OrderRow) => (
    <div className="mt-2 space-y-1 rounded-lg bg-beige/40 p-2 text-[11px] text-warm-gray-500">
      {o.payments.map((p, i) => (
        <p key={i}>
          {p.kind === 'tilopay' ? (p.mindbody_tender ?? 'Tarjeta') : p.kind === 'gift_card' ? `Gift card ${p.gc_barcode}` : p.kind}
          {' · '}{money(p.amount_cents)}{' · '}{p.status}
          {p.tilopay_tpt && ` · tpt ${p.tilopay_tpt}`}
        </p>
      ))}
      {o.mindbody_grand_total_cents != null && o.mindbody_grand_total_cents !== o.total_cents && (
        <p className="text-red-600">
          Mindbody calculó {money(o.mindbody_grand_total_cents)} vs {money(o.total_cents)} de la orden.
        </p>
      )}
      {o.failure_detail && <p className="text-red-600">{o.failure_detail}</p>}
      {o.notes && <p>{o.notes}</p>}
      <p>Autorizada {dt(o.authorized_at)} · Cobrada {dt(o.captured_at)} · Registrada {dt(o.posted_at)}</p>
    </div>
  )

  const columns: Array<AdminColumn<OrderRow>> = [
    { key: 'order', header: 'Pedido', render: orderCell },
    {
      key: 'client',
      header: 'Cliente',
      render: o => (
        <>
          <p className="text-dark">{o.buyer_name ?? '—'}</p>
          <p className="text-[11px] text-warm-gray-500">{o.buyer_email}</p>
        </>
      ),
    },
    { key: 'items', header: 'Artículos', render: itemsCell },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      cellClassName: 'tabular-nums',
      render: o => (
        <>
          {money(o.total_cents)}
          {o.discount_cents > 0 && <p className="text-[11px] text-green-700">−{money(o.discount_cents)}</p>}
        </>
      ),
    },
    { key: 'status', header: 'Estado', render: statusCell },
    { key: 'mindbody', header: 'Mindbody', cellClassName: 'text-xs', render: mindbodyCell },
    {
      key: 'actions',
      header: '',
      srHeader: 'Acciones',
      render: o => (
        <>
          {actions(o)}
          {expanded === o.id && details(o)}
        </>
      ),
    },
  ]

  const mobileCard = (o: OrderRow) => {
    const st = STATUS[o.status] ?? { label: o.status, tone: 'gray' as const }
    return (
      <>
        <div className="flex items-start justify-between gap-3">
          <button onClick={() => setExpanded(expanded === o.id ? null : o.id)}
            aria-expanded={expanded === o.id}
            className="font-mono text-sm font-semibold text-gold-700 hover:underline break-all">
            {o.order_number}
          </button>
          <StatusPill tone={st.tone}>{st.label}</StatusPill>
        </div>
        <p className="mt-1 text-2xl font-display font-semibold text-dark tabular-nums">
          {money(o.total_cents)}
          {o.discount_cents > 0 && (
            <span className="ml-2 text-sm font-body font-normal text-green-700">−{money(o.discount_cents)}</span>
          )}
        </p>
        <div className="mt-2">{itemsCell(o)}</div>
        <dl className="mt-3 space-y-1">
          <CardField label="Cliente">{o.buyer_name ?? o.buyer_email}</CardField>
          <CardField label="Sucursal">{o.location_id === 1 ? 'CDE' : 'SFC'}</CardField>
          <CardField label="Creada">{dt(o.created_at)}</CardField>
          <CardField label="Mindbody">{mindbodyCell(o)}</CardField>
        </dl>
        {o.failure_code && (
          <p className="mt-2 text-[11px] text-red-600">{FAILURE[o.failure_code] ?? o.failure_code}</p>
        )}
        <div className="mt-3">{actions(o)}</div>
        {expanded === o.id && details(o)}
      </>
    )
  }

  return (
    <AdminPage
      title="Pedidos en línea"
      icon={ShoppingBag}
      description="Servicios y gift cards pagados en el sitio. Mindbody sigue siendo el sistema de registro."
      actions={
        <>
          <label className="flex items-center gap-2 text-sm text-warm-gray-500">
            <input type="checkbox" checked={onlyAttention} onChange={e => setOnlyAttention(e.target.checked)} />
            Solo los que necesitan atención
          </label>
          <button onClick={load}
            className="inline-flex items-center gap-1.5 min-h-[44px] rounded-lg border border-beige-400 px-4 text-sm hover:bg-beige/50">
            <RefreshCw className="h-4 w-4" /> Actualizar
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {attentionCount > 0 && !onlyAttention && (
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {attentionCount} pedido(s) necesitan atención (fallo o proceso incompleto).
          </div>
        )}
        <AdminTable
          rows={orders}
          columns={columns}
          rowKey={o => o.id}
          mobileCard={mobileCard}
          loading={loading}
          error={error}
          empty="No hay pedidos todavía."
        />
      </div>
    </AdminPage>
  )
}
