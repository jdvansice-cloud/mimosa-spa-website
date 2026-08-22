'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Loader2, RefreshCw, ShoppingBag } from 'lucide-react'
import { AdminPage } from '@/components/admin/AdminPage'
import { AdminTable, CardField, StatusPill, type AdminColumn } from '@/components/admin/AdminTable'

interface OrderRow {
  id: string
  order_number: string
  status: string
  item_name: string | null
  total_cents: number
  buyer_name: string | null
  buyer_email: string
  recipient_name: string
  mindbody_status: string
  tilopay_method: string | null
  mindbody_tender: string | null
  email_sent_at: string | null
  whatsapp_sent_at: string | null
  scheduled_send_at: string | null
  gift_card_id: string | null
  created_at: string
  fulfillment_error: string | null
  mindbody_error: string | null
}

type Tone = 'green' | 'amber' | 'red' | 'gray'
const STATUS_LABEL: Record<string, { label: string; tone: Tone }> = {
  pending: { label: 'Pendiente', tone: 'amber' },
  paid: { label: 'Pagada', tone: 'green' },
  fulfilled: { label: 'Entregada', tone: 'green' },
  payment_failed: { label: 'Pago fallido', tone: 'red' },
  abandoned: { label: 'Abandonada', tone: 'gray' },
  refunded: { label: 'Reembolsada', tone: 'gray' },
}

const MB_LABEL: Record<string, string> = {
  registered: 'MB ✓',
  pending: 'MB …',
  failed: 'MB ✗',
  skipped: 'MB —',
}

export default function AdminGcOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/giftcards/orders')
      if (res.ok) {
        const { data } = await res.json()
        setOrders(data || [])
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const act = async (id: string, action: string) => {
    setBusyId(id)
    setError(null)
    try {
      let payload: Record<string, string> = { action }
      if (action === 'mark_paid') {
        const tpt = prompt(
          'ID de transacción Tilopay (tpt) verificado en el portal:'
        )
        if (!tpt) return
        payload = { action, tpt }
      }
      const res = await fetch(`/api/admin/giftcards/orders/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setError(body?.error || 'Acción falló')
      }
      await load()
    } finally {
      setBusyId(null)
    }
  }

  const money = (c: number) => `$${(c / 100).toFixed(2)}`
  const statusOf = (o: OrderRow) => STATUS_LABEL[o.status] ?? STATUS_LABEL.pending
  const delivery = (o: OrderRow) =>
    `${o.email_sent_at ? '✉️✓' : '✉️—'}${o.whatsapp_sent_at ? ' 💬✓' : ''}${o.scheduled_send_at ? ` 🗓 ${new Date(o.scheduled_send_at).toLocaleDateString('es-PA')}` : ''}`

  // One action set, shared by the desktop row and the mobile card.
  const actions = (o: OrderRow) => (
    busyId === o.id ? (
      <Loader2 className="h-4 w-4 animate-spin text-gold-600" />
    ) : (
      <div className="flex flex-wrap gap-1.5 text-xs">
        {(o.status === 'fulfilled' || o.status === 'paid') && (
          <button onClick={() => act(o.id, 'resend')}
            className="min-h-[44px] rounded-lg border border-beige-400 px-3 font-medium text-gold-700 hover:bg-beige/50">
            Reenviar
          </button>
        )}
        {o.mindbody_status === 'failed' && (
          <button onClick={() => act(o.id, 'retry_mindbody')}
            className="min-h-[44px] rounded-lg border border-beige-400 px-3 font-medium text-gold-700 hover:bg-beige/50">
            Reintentar MB
          </button>
        )}
        {(o.status === 'pending' || o.status === 'payment_failed') && (
          <button onClick={() => act(o.id, 'mark_paid')}
            className="min-h-[44px] rounded-lg border border-beige-400 px-3 font-medium text-gold-700 hover:bg-beige/50">
            Marcar pagada
          </button>
        )}
        {o.gift_card_id && (
          <Link href={`/admin/giftcards/issued/${o.gift_card_id}/print`}
            className="inline-flex items-center min-h-[44px] rounded-lg border border-beige-400 px-3 text-warm-gray-500 hover:text-dark hover:bg-beige/50">
            Imprimir
          </Link>
        )}
      </div>
    )
  )

  const columns: Array<AdminColumn<OrderRow>> = [
    { key: 'order', header: 'Pedido', cellClassName: 'font-mono text-xs', render: o => o.order_number },
    { key: 'item', header: 'Artículo', render: o => o.item_name },
    { key: 'total', header: 'Total', cellClassName: 'font-semibold tabular-nums', render: o => money(o.total_cents) },
    {
      key: 'people',
      header: 'Comprador → Destinatario',
      render: o => (
        <div className="max-w-[220px] truncate">
          {o.buyer_name || o.buyer_email} → {o.recipient_name}
        </div>
      ),
    },
    {
      key: 'method',
      header: 'Método',
      cellClassName: 'text-xs text-warm-gray-500',
      render: o => <span title={o.tilopay_method || ''}>{o.mindbody_tender || o.tilopay_method || '—'}</span>,
    },
    {
      key: 'status',
      header: 'Estado',
      render: o => {
        const st = statusOf(o)
        return (
          <>
            <StatusPill tone={st.tone}>{st.label}</StatusPill>{' '}
            <span className="text-xs text-warm-gray-500" title={o.mindbody_error || ''}>
              {MB_LABEL[o.mindbody_status] || ''}
            </span>
          </>
        )
      },
    },
    { key: 'delivery', header: 'Entrega', cellClassName: 'text-xs text-warm-gray-500', render: delivery },
    { key: 'actions', header: '', srHeader: 'Acciones', render: actions },
  ]

  const mobileCard = (o: OrderRow) => {
    const st = statusOf(o)
    return (
      <>
        <div className="flex items-start justify-between gap-3">
          <span className="font-mono text-sm font-semibold text-dark break-all">{o.order_number}</span>
          <StatusPill tone={st.tone}>{st.label}</StatusPill>
        </div>
        <p className="mt-1 text-2xl font-display font-semibold text-dark tabular-nums">{money(o.total_cents)}</p>
        <p className="text-sm text-dark">{o.item_name}</p>
        <dl className="mt-3 space-y-1">
          <CardField label="Compró">{o.buyer_name || o.buyer_email}</CardField>
          <CardField label="Para">{o.recipient_name}</CardField>
          <CardField label="Método">{o.mindbody_tender || o.tilopay_method || '—'}</CardField>
          <CardField label="Entrega">{delivery(o)}</CardField>
          <CardField label="Mindbody">{MB_LABEL[o.mindbody_status] || '—'}</CardField>
        </dl>
        {o.mindbody_error && <p className="mt-2 text-[11px] text-red-600">{o.mindbody_error}</p>}
        <div className="mt-3">{actions(o)}</div>
      </>
    )
  }

  return (
    <AdminPage
      title="Pedidos Online"
      icon={ShoppingBag}
      breadcrumb={{ href: '/admin/giftcards', label: 'Gift Cards' }}
      description="Gift cards vendidas en la tienda del sitio (pagos vía Tilopay)."
      actions={
        <button onClick={load}
          className="inline-flex items-center gap-1.5 min-h-[44px] rounded-lg border border-beige-400 px-4 text-sm hover:bg-beige/50">
          <RefreshCw className="h-4 w-4" /> Actualizar
        </button>
      }
    >
      <div className="space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
        <AdminTable
          rows={orders}
          columns={columns}
          rowKey={o => o.id}
          mobileCard={mobileCard}
          loading={isLoading}
          empty="Aún no hay pedidos. Cuando la tienda esté activa aparecerán aquí."
        />
      </div>
    </AdminPage>
  )
}
