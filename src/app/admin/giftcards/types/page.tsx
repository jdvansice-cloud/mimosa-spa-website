'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Hash, RefreshCw, Loader2 } from 'lucide-react'
import { Button, Card, CardContent } from '@/components/ui'

type Category = 'gift_card' | 'certificado' | 'privilege'

interface GiftCardType {
  id: string
  mindbody_id: number | null
  name: string
  value_cents: number | null
  category: Category
  prefix: string
  serial_length: number
  next_sequence_value: number
  is_active: boolean
}

const CATEGORY_LABEL: Record<Category, string> = {
  gift_card: 'Gift Card',
  certificado: 'Certificado',
  privilege: 'Privilege',
}

function formatMoney(cents: number | null): string {
  if (cents == null || cents === 0) return 'Abierto'
  return `$${(cents / 100).toFixed(2)}`
}

export default function GiftCardTypesPage() {
  const [rows, setRows] = useState<GiftCardType[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)

  const load = async () => {
    try {
      const res = await fetch('/api/admin/giftcards/types')
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

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch('/api/admin/giftcards/types/sync', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error al sincronizar')
      showToast(`Sincronizado: ${data.created} nuevos, ${data.updated} actualizados.`)
      await load()
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al sincronizar')
    } finally {
      setSyncing(false)
    }
  }

  const updateLocal = (id: string, patch: Partial<GiftCardType>) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r))
  }

  const saveRow = async (row: GiftCardType, patch: Partial<GiftCardType>) => {
    setSavingId(row.id)
    try {
      const res = await fetch(`/api/admin/giftcards/types/${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error al guardar')
      updateLocal(row.id, data.data)
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al guardar')
      // revert by reloading
      await load()
    } finally {
      setSavingId(null)
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
                <Hash className="h-6 w-6 text-gold" />
              </div>
              <h1 className="text-3xl font-display font-semibold text-dark">Tipos de Tarjeta</h1>
            </div>
            <p className="text-warm-gray">
              Sincronizado desde Mindbody. Edita prefijo, longitud y categoría por tipo.
              Cada tipo lleva su propia secuencia.
            </p>
          </div>
          <Button
            onClick={handleSync}
            isLoading={syncing}
            leftIcon={syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          >
            Sincronizar desde Mindbody
          </Button>
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
              No hay tipos aún. Pulsa &quot;Sincronizar desde Mindbody&quot; para importarlos.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-beige-100 text-left text-warm-gray uppercase text-xs">
                  <tr>
                    <th className="px-3 py-3">Nombre (Mindbody)</th>
                    <th className="px-3 py-3">Valor</th>
                    <th className="px-3 py-3">Categoría</th>
                    <th className="px-3 py-3">Prefijo</th>
                    <th className="px-3 py-3">Longitud</th>
                    <th className="px-3 py-3">Próximo Serial</th>
                    <th className="px-3 py-3">Activo</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => {
                    const padded = String(row.next_sequence_value).padStart(row.serial_length, '0')
                    return (
                      <tr key={row.id} className="border-t border-beige-200">
                        <td className="px-3 py-3">
                          <div className="text-dark">{row.name}</div>
                          {row.mindbody_id != null && (
                            <div className="text-[10px] text-warm-gray font-mono">
                              MB Id {row.mindbody_id}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3">{formatMoney(row.value_cents)}</td>
                        <td className="px-3 py-3">
                          <select
                            className="input"
                            value={row.category}
                            onChange={e => {
                              const next = e.target.value as Category
                              updateLocal(row.id, { category: next })
                              saveRow(row, { category: next })
                            }}
                          >
                            <option value="gift_card">{CATEGORY_LABEL.gift_card}</option>
                            <option value="certificado">{CATEGORY_LABEL.certificado}</option>
                            <option value="privilege">{CATEGORY_LABEL.privilege}</option>
                          </select>
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="text"
                            className="input font-mono uppercase w-28"
                            maxLength={8}
                            value={row.prefix}
                            onChange={e => updateLocal(row.id, { prefix: e.target.value.toUpperCase() })}
                            onBlur={() => saveRow(row, { prefix: row.prefix })}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            min={4}
                            max={12}
                            className="input w-20"
                            value={row.serial_length}
                            onChange={e => updateLocal(row.id, { serial_length: Number(e.target.value) })}
                            onBlur={() => saveRow(row, { serial_length: row.serial_length })}
                          />
                        </td>
                        <td className="px-3 py-3 font-mono text-dark">
                          {row.prefix}{padded}
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-gold focus:ring-gold rounded"
                            checked={row.is_active}
                            onChange={e => {
                              const next = e.target.checked
                              updateLocal(row.id, { is_active: next })
                              saveRow(row, { is_active: next })
                            }}
                          />
                          {savingId === row.id && (
                            <Loader2 className="h-3 w-3 animate-spin inline-block ml-2 text-warm-gray" />
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
