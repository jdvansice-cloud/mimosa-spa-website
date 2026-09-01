'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Gift, Printer, Loader2, RefreshCw } from 'lucide-react'
import { AdminPage } from '@/components/admin/AdminPage'
import { GiftCardDetail, type GiftCardDetailData } from '@/components/admin/giftcards/GiftCardDetail'
import { StatusPill } from '@/components/admin/AdminTable'
import { Button } from '@/components/ui'

/**
 * Standalone view of one gift card — the deep-linkable version of the inline
 * expansion in the issued list (the print page's back-navigation lands here).
 * All rendering lives in the shared GiftCardDetail component.
 */

function status(card: GiftCardDetailData): { label: string; tone: 'green' | 'amber' | 'gray' | 'red' } {
  if (card.voided_at) return { label: 'Anulada', tone: 'red' }
  if (card.redeemed_at) return { label: 'Usada', tone: 'gray' }
  if (card.sold_at) return { label: 'Vendida', tone: 'green' }
  return { label: 'Emitida', tone: 'amber' }
}

export default function GiftCardDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [card, setCard] = useState<GiftCardDetailData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    try {
      const res = await fetch(`/api/admin/giftcards/issued/${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'No encontrada')
      setCard(data.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No encontrada')
    }
  }, [id])

  useEffect(() => { load() }, [load])

  const handleSync = async () => {
    if (!id) return
    setSyncing(true)
    setToast(null)
    try {
      const res = await fetch(`/api/admin/giftcards/issued/${id}/sync`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error al sincronizar')
      setToast(data.status === 'not_found_in_mindbody'
        ? (data.message || 'No encontrada en Mindbody todavía.')
        : 'Sincronizada con Mindbody.')
      await load()
    } catch (e) {
      setToast(e instanceof Error ? e.message : 'Error al sincronizar')
    } finally {
      setSyncing(false)
      setTimeout(() => setToast(null), 4000)
    }
  }

  if (error) {
    return (
      <AdminPage title="Gift card" icon={Gift} breadcrumb={{ href: '/admin/giftcards/issued', label: 'Emitidas' }}>
        <div className="p-6 rounded-lg bg-red-50 border border-red-200 text-red-700" role="alert">{error}</div>
      </AdminPage>
    )
  }

  if (!card) {
    return (
      <AdminPage title="Gift card" icon={Gift} breadcrumb={{ href: '/admin/giftcards/issued', label: 'Emitidas' }}>
        <div className="flex justify-center py-12" aria-busy="true">
          <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
        </div>
      </AdminPage>
    )
  }

  const st = status(card)

  return (
    <AdminPage
      title={card.serial}
      icon={Gift}
      breadcrumb={{ href: '/admin/giftcards/issued', label: 'Emitidas' }}
      description={<StatusPill tone={st.tone}>{st.label}</StatusPill>}
      actions={
        <>
          <Button variant="secondary" onClick={handleSync} disabled={syncing}
            leftIcon={syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}>
            Sincronizar
          </Button>
          <Link href={`/admin/giftcards/issued/${card.id}/print`}>
            <Button leftIcon={<Printer className="h-4 w-4" />}>Imprimir etiqueta</Button>
          </Link>
        </>
      }
    >
      {toast && (
        <div className="mb-4 p-3 rounded-lg bg-beige-100 border border-beige-300 text-warm-gray-700">{toast}</div>
      )}
      <GiftCardDetail card={card} />
    </AdminPage>
  )
}
