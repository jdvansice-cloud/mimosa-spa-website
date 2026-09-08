'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Gift, Loader2, Lock, Printer } from 'lucide-react'
import { AdminPage } from '@/components/admin/AdminPage'
import { Button } from '@/components/ui'
import { GiftCardForm, type GiftCardFormPayload } from '@/components/admin/giftcards/GiftCardForm'
import type { GiftCardDetailData } from '@/components/admin/giftcards/GiftCardDetail'

/**
 * Edit a card while it is still Emitida. The moment Mindbody registers the
 * sale the record freezes (see the PATCH handler) — this page then explains
 * why instead of showing a form that would fail on save.
 */
export default function GiftCardEditPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const router = useRouter()
  const [card, setCard] = useState<GiftCardDetailData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const res = await fetch(`/api/admin/giftcards/issued/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'No encontrada')
        setCard(data.data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'No encontrada')
      }
    })()
  }, [id])

  const handleSubmit = async (payload: GiftCardFormPayload) => {
    const res = await fetch(`/api/admin/giftcards/issued/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || 'Error al guardar')
    router.push(`/admin/giftcards/issued/${id}/print`)
  }

  const breadcrumb = { href: '/admin/giftcards/issued', label: 'Emitidas' }

  if (error) {
    return (
      <AdminPage title="Editar Gift Card" icon={Gift} breadcrumb={breadcrumb}>
        <div className="p-6 rounded-lg bg-red-50 border border-red-200 text-red-700" role="alert">{error}</div>
      </AdminPage>
    )
  }

  if (!card) {
    return (
      <AdminPage title="Editar Gift Card" icon={Gift} breadcrumb={breadcrumb}>
        <div className="flex justify-center py-12" aria-busy="true">
          <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
        </div>
      </AdminPage>
    )
  }

  const locked = !!(card.sold_at || card.redeemed_at || card.voided_at)
  if (locked) {
    return (
      <AdminPage title={card.serial} icon={Gift} breadcrumb={breadcrumb} description="Esta Gift Card ya no se puede editar.">
        <div className="max-w-xl rounded-lg border border-beige-300 bg-white p-6">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-warm-gray-500 mt-0.5 shrink-0" />
            <div className="text-sm text-dark leading-relaxed">
              {card.voided_at
                ? 'La tarjeta fue anulada.'
                : 'La venta ya quedó registrada en Mindbody, así que el monto y los datos quedan fijos. Si hay un error, corrígelo directamente en Mindbody y luego usa "Sincronizar".'}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/admin/giftcards/issued/${card.id}`}>
              <Button variant="outline">Ver detalle</Button>
            </Link>
            <Link href={`/admin/giftcards/issued/${card.id}/print`}>
              <Button leftIcon={<Printer className="h-4 w-4" />}>Imprimir etiqueta</Button>
            </Link>
          </div>
        </div>
      </AdminPage>
    )
  }

  return (
    <AdminPage
      title={`Editar ${card.serial}`}
      icon={Gift}
      breadcrumb={breadcrumb}
      description="Se puede editar mientras la tarjeta esté Emitida. Al guardar vuelves a la etiqueta — reimprímela si cambiaste algo que se imprime."
    >
      <GiftCardForm mode="edit" initial={card} submitLabel="Guardar cambios" onSubmit={handleSubmit} />
    </AdminPage>
  )
}
