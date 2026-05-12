'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Printer, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui'
import {
  GiftCardLabelRenderer,
  LABEL_WIDTH_IN,
  LABEL_HEIGHT_IN,
  LabelCard,
  formatLabelMoney,
} from '@/components/admin/giftcards/labels'

interface GiftCard extends LabelCard {
  id: string
  buyer_email: string | null
  recipient_email: string | null
  base_amount_cents: number | null
  tax_cents: number | null
  issued_at: string
  sold_at: string | null
  mindbody_remaining_balance_cents: number | null
  mindbody_synced_at: string | null
}

const PREVIEW_SCALE = 2

export default function GiftCardPrintPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [card, setCard] = useState<GiftCard | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    (async () => {
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

  const handleSync = async () => {
    if (!id) return
    setSyncing(true)
    setSyncMessage(null)
    try {
      const res = await fetch(`/api/admin/giftcards/issued/${id}/sync`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error al sincronizar')
      if (data.status === 'not_found_in_mindbody') {
        setSyncMessage(data.message || 'No encontrada en Mindbody todavía.')
      } else {
        setSyncMessage('Sincronizada con Mindbody.')
        setCard(data.data)
      }
    } catch (e) {
      setSyncMessage(e instanceof Error ? e.message : 'Error al sincronizar')
    } finally {
      setSyncing(false)
      setTimeout(() => setSyncMessage(null), 4000)
    }
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>
  }

  if (!card) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div>
      {/* Mindbody sync status */}
      <div className="mb-4 no-print">
        <div className="rounded-lg border border-beige-300 bg-white p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="text-xs uppercase tracking-widest text-warm-gray">Estado en Mindbody</div>
            {card.sold_at ? (
              <div className="text-dark">
                Vendida · Saldo{' '}
                <span className="font-medium">
                  {card.mindbody_remaining_balance_cents != null
                    ? formatLabelMoney(card.mindbody_remaining_balance_cents, card.currency)
                    : '—'}
                </span>
              </div>
            ) : (
              <div className="text-amber-700">Pendiente — aún no aparece en Mindbody</div>
            )}
            {card.mindbody_synced_at && (
              <div className="text-xs text-warm-gray mt-1">
                Última sincronización: {new Date(card.mindbody_synced_at).toLocaleString('es-PA')}
              </div>
            )}
            {syncMessage && <div className="text-xs text-dark mt-1">{syncMessage}</div>}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleSync}
            isLoading={syncing}
            leftIcon={syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          >
            Sincronizar con Mindbody
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between no-print">
        <Link
          href="/admin/giftcards/issued"
          className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-dark"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a Emitidas
        </Link>
        <Button onClick={() => window.print()} leftIcon={<Printer className="h-4 w-4" />}>
          Imprimir Etiqueta
        </Button>
      </div>

      {/* Preview heading */}
      <div className="mb-3 no-print">
        <div className="text-xs uppercase tracking-widest text-warm-gray">
          Vista previa ({PREVIEW_SCALE}× tamaño real · 2.25&quot; × 1.25&quot;)
        </div>
      </div>

      {/* Scaled preview wrapper.
          On screen: scale up so staff can read it.
          On print:  scale 1, no padding, label printed at exact size. */}
      <div
        className="preview-wrapper"
        style={{
          width: `${LABEL_WIDTH_IN * PREVIEW_SCALE}in`,
          height: `${LABEL_HEIGHT_IN * PREVIEW_SCALE}in`,
        }}
      >
        <div
          className="print-label"
          style={{
            transform: `scale(${PREVIEW_SCALE})`,
            transformOrigin: 'top left',
            border: '1px dashed #c8b78c',
          }}
        >
          <GiftCardLabelRenderer card={card} />
        </div>
      </div>

      <style jsx global>{`
        @page {
          size: ${LABEL_WIDTH_IN}in ${LABEL_HEIGHT_IN}in;
          margin: 0;
        }
        @media print {
          html, body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Hide every element on the page by default… */
          body * { visibility: hidden; }
          /* …then bring back the label and everything inside it. */
          .print-label, .print-label * { visibility: visible; }
          .print-label {
            position: absolute;
            top: 0;
            left: 0;
            transform: none !important;
            border: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
