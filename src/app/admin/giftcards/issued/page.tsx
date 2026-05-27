'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Gift, ArrowLeft, Plus, Printer, Loader2, RefreshCw } from 'lucide-react'
import { Button, Card, CardContent } from '@/components/ui'

interface IssuedRow {
  id: string
  serial: string
  buyer_name: string
  recipient_name: string
  amount_cents: number
  gift_treatment_names: string[] | null
  issued_at: string
  redeemed_at: string | null
  sold_at: string | null
  mindbody_remaining_balance_cents: number | null
  mindbody_synced_at: string | null
}

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-PA', { dateStyle: 'short', timeStyle: 'short' })
}

function statusLabel(row: IssuedRow): { label: string; tone: 'green' | 'yellow' | 'gray' } {
  if (row.redeemed_at) return { label: 'Canjeada', tone: 'gray' }
  if (row.sold_at) return { label: 'Vendida', tone: 'green' }
  return { label: 'Pendiente', tone: 'yellow' }
}

export default function AdminGiftCardsIssuedPage() {
  const [rows, setRows] = useState<IssuedRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncingId, setSyncingId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/giftcards/issued')
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error al cargar')
      setRows(data.data ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSync = async (id: string) => {
    setSyncingId(id)
    setToast(null)
    try {
      const res = await fetch(`/api/admin/giftcards/issued/${id}/sync`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error al sincronizar')
      if (data.status === 'not_found_in_mindbody') {
        setToast(data.message || 'No encontrada en Mindbody todavía.')
      } else {
        setToast('Sincronizada con Mindbody.')
      }
      await load()
    } catch (e) {
      setToast(e instanceof Error ? e.message : 'Error al sincronizar')
    } finally {
      setSyncingId(null)
      setTimeout(() => setToast(null), 4000)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/giftcards"
          className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-dark mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> Gift Cards
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Gift className="h-6 w-6 text-gold" />
              </div>
              <h1 className="text-3xl font-display font-semibold text-dark">Gift Cards Emitidas</h1>
            </div>
            <p className="text-warm-gray">
              Historial de Gift Cards y Certificados. &quot;Sincronizar&quot; consulta el saldo actual en Mindbody.
            </p>
          </div>
          <Link href="/admin/giftcards/issue">
            <Button leftIcon={<Plus className="h-4 w-4" />}>Emitir Nueva</Button>
          </Link>
        </div>
      </div>

      {toast && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-beige-100 text-dark text-sm">{toast}</div>
      )}

      <Card variant="default" padding="none">
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          ) : error ? (
            <div className="p-6 text-red-600">{error}</div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center text-warm-gray">
              Aún no se han emitido Gift Cards.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-beige-100 text-left text-warm-gray uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Serial</th>
                    <th className="px-4 py-3">Comprador</th>
                    <th className="px-4 py-3">Destinatario</th>
                    <th className="px-4 py-3">Monto</th>
                    <th className="px-4 py-3">Tratamientos</th>
                    <th className="px-4 py-3">Saldo Mindbody</th>
                    <th className="px-4 py-3">Emitida</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => {
                    const status = statusLabel(row)
                    const toneClass = status.tone === 'green'
                      ? 'text-green-700'
                      : status.tone === 'yellow'
                        ? 'text-amber-700'
                        : 'text-warm-gray'
                    return (
                      <tr key={row.id} className="border-t border-beige-200 hover:bg-beige-50">
                        <td className="px-4 py-3 font-mono text-dark">{row.serial}</td>
                        <td className="px-4 py-3">{row.buyer_name}</td>
                        <td className="px-4 py-3">{row.recipient_name}</td>
                        <td className="px-4 py-3">{formatMoney(row.amount_cents)}</td>
                        <td className="px-4 py-3 text-warm-gray text-xs">
                          {row.gift_treatment_names && row.gift_treatment_names.length > 0
                            ? row.gift_treatment_names.join(' · ')
                            : '—'}
                        </td>
                        <td className="px-4 py-3">
                          {row.mindbody_remaining_balance_cents != null ? (
                            <span className="text-dark">{formatMoney(row.mindbody_remaining_balance_cents)}</span>
                          ) : (
                            <span className="text-warm-gray">—</span>
                          )}
                          {row.mindbody_synced_at && (
                            <div className="text-[10px] text-warm-gray">
                              {formatDate(row.mindbody_synced_at)}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-warm-gray">{formatDate(row.issued_at)}</td>
                        <td className={`px-4 py-3 ${toneClass}`}>{status.label}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleSync(row.id)}
                              disabled={syncingId === row.id}
                              className="inline-flex items-center gap-1 text-gold hover:underline disabled:opacity-50"
                            >
                              {syncingId === row.id
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : <RefreshCw className="h-4 w-4" />}
                              Sincronizar
                            </button>
                            <Link
                              href={`/admin/giftcards/issued/${row.id}/print`}
                              className="inline-flex items-center gap-1 text-gold hover:underline"
                            >
                              <Printer className="h-4 w-4" /> Imprimir
                            </Link>
                          </div>
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
