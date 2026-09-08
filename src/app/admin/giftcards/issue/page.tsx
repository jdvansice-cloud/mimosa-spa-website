'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Gift, ArrowLeft, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui'
import { GiftCardForm, type GiftCardFormPayload } from '@/components/admin/giftcards/GiftCardForm'

interface MeResponse {
  locationConfigId: string | null
  locationName: string | null
  isSuperAdmin: boolean
}

export default function AdminGiftCardIssuePage() {
  const router = useRouter()
  const [me, setMe] = useState<MeResponse | null>(null)

  useEffect(() => {
    fetch('/api/admin/giftcards/me')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d) setMe(d) })
      .catch(() => { /* the header just stays generic */ })
  }, [])

  const isLocationLocked = !!me?.locationConfigId

  const handleSubmit = async (payload: GiftCardFormPayload) => {
    const res = await fetch('/api/admin/giftcards/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || 'Error al emitir')
    router.push(`/admin/giftcards/issued/${data.id}/print`)
  }

  return (
    <div>
      <div className="mb-8">
        {!isLocationLocked && (
          <Link
            href="/admin/giftcards"
            className="inline-flex items-center gap-1 text-sm text-warm-gray-500 hover:text-dark mb-3"
          >
            <ArrowLeft className="h-4 w-4" /> Gift Cards
          </Link>
        )}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Gift className="h-6 w-6 text-gold" />
              </div>
              <h1 className="text-3xl font-display font-semibold text-dark">Emitir Gift Card</h1>
            </div>
            <p className="text-warm-gray-500">
              {isLocationLocked
                ? `Ubicación: ${me?.locationName ?? '—'}. Define el monto, genera el serial e imprime la etiqueta.`
                : 'Selecciona la ubicación, define el monto y genera el serial para imprimir.'}
            </p>
          </div>
          <Link href="/admin/giftcards/manual">
            <Button variant="outline" leftIcon={<BookOpen className="h-4 w-4" />}>Manual</Button>
          </Link>
        </div>
      </div>

      <GiftCardForm mode="create" submitLabel="Emitir e imprimir" onSubmit={handleSubmit} />
    </div>
  )
}
