'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Loader2, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Spinner } from '@/components/ui'

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

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pendiente', cls: 'bg-beige text-warm-gray' },
  paid: { label: 'Pagada', cls: 'bg-blue-100 text-blue-700' },
  fulfilled: { label: 'Entregada', cls: 'bg-green-100 text-green-700' },
  payment_failed: { label: 'Pago fallido', cls: 'bg-red-100 text-red-600' },
  abandoned: { label: 'Abandonada', cls: 'bg-beige text-warm-gray' },
  refunded: { label: 'Reembolsada', cls: 'bg-purple-100 text-purple-700' },
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Pedidos Online</h1>
          <p className="text-warm-gray text-sm mt-1">
            Gift cards vendidas en la tienda del sitio (pagos vía Tilopay).
          </p>
        </div>
        <button onClick={load} className="p-2 text-warm-gray hover:text-dark" title="Refrescar">
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Pedidos ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Spinner className="py-8" />
          ) : orders.length === 0 ? (
            <p className="text-warm-gray text-sm py-6">
              Aún no hay pedidos. Cuando la tienda esté activa aparecerán aquí.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-warm-gray border-b border-beige">
                    <th className="py-2 pr-3">Pedido</th>
                    <th className="py-2 pr-3">Artículo</th>
                    <th className="py-2 pr-3">Total</th>
                    <th className="py-2 pr-3">Comprador → Destinatario</th>
                    <th className="py-2 pr-3">Método</th>
                    <th className="py-2 pr-3">Estado</th>
                    <th className="py-2 pr-3">Entrega</th>
                    <th className="py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige">
                  {orders.map((o) => {
                    const st = STATUS_LABEL[o.status] || STATUS_LABEL.pending
                    return (
                      <tr key={o.id}>
                        <td className="py-2.5 pr-3 font-mono text-xs">{o.order_number}</td>
                        <td className="py-2.5 pr-3">{o.item_name}</td>
                        <td className="py-2.5 pr-3 font-semibold">
                          ${(o.total_cents / 100).toFixed(2)}
                        </td>
                        <td className="py-2.5 pr-3">
                          <div className="max-w-[220px] truncate">
                            {o.buyer_name || o.buyer_email} → {o.recipient_name}
                          </div>
                        </td>
                        <td className="py-2.5 pr-3 text-xs text-warm-gray">
                          <span title={o.tilopay_method || ''}>{o.mindbody_tender || o.tilopay_method || '—'}</span>
                        </td>
                        <td className="py-2.5 pr-3">
                          <span className={`text-xs rounded-full px-2 py-0.5 ${st.cls}`}>
                            {st.label}
                          </span>{' '}
                          <span
                            className="text-xs text-warm-gray"
                            title={o.mindbody_error || ''}
                          >
                            {MB_LABEL[o.mindbody_status] || ''}
                          </span>
                        </td>
                        <td className="py-2.5 pr-3 text-xs text-warm-gray">
                          {o.email_sent_at ? '✉️✓' : '✉️—'} {o.whatsapp_sent_at ? '💬✓' : ''}
                          {o.scheduled_send_at &&
                            ` 🗓 ${new Date(o.scheduled_send_at).toLocaleDateString('es-PA')}`}
                        </td>
                        <td className="py-2.5">
                          {busyId === o.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-gold" />
                          ) : (
                            <div className="flex gap-2 text-xs">
                              {(o.status === 'fulfilled' || o.status === 'paid') && (
                                <button
                                  onClick={() => act(o.id, 'resend')}
                                  className="text-gold-600 hover:text-gold-700 font-medium"
                                >
                                  Reenviar
                                </button>
                              )}
                              {o.mindbody_status === 'failed' && (
                                <button
                                  onClick={() => act(o.id, 'retry_mindbody')}
                                  className="text-gold-600 hover:text-gold-700 font-medium"
                                >
                                  Reintentar MB
                                </button>
                              )}
                              {(o.status === 'pending' || o.status === 'payment_failed') && (
                                <button
                                  onClick={() => act(o.id, 'mark_paid')}
                                  className="text-gold-600 hover:text-gold-700 font-medium"
                                >
                                  Marcar pagada
                                </button>
                              )}
                              {o.gift_card_id && (
                                <Link
                                  href={`/admin/giftcards/issued/${o.gift_card_id}/print`}
                                  className="text-warm-gray hover:text-dark"
                                >
                                  Imprimir
                                </Link>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
