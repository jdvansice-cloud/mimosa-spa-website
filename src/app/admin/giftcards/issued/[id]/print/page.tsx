'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import JsBarcode from 'jsbarcode'
import { ArrowLeft, Printer, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui'

interface GiftCard {
  id: string
  serial: string
  format: 'gift_card' | 'certificado'
  buyer_name: string
  buyer_email: string | null
  recipient_name: string
  recipient_email: string | null
  amount_cents: number
  base_amount_cents: number | null
  tax_cents: number | null
  currency: string
  treatment_name: string | null
  message: string | null
  print_amount: boolean
  print_message: boolean
  print_recipient: boolean
  issued_at: string
  sold_at: string | null
  mindbody_remaining_balance_cents: number | null
  mindbody_synced_at: string | null
}

function formatMoney(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100)
}

export default function GiftCardPrintPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [card, setCard] = useState<GiftCard | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)
  const barcodeRef = useRef<SVGSVGElement>(null)

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

  useEffect(() => {
    if (!card || !barcodeRef.current) return
    JsBarcode(barcodeRef.current, card.serial, {
      format: 'CODE128',
      displayValue: false,
      margin: 0,
      height: 60,
      width: 2,
    })
  }, [card])

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

  const isCert = card.format === 'certificado'

  return (
    <div>
      {/* Mindbody sync status — hidden when printing */}
      <div className="mb-4 print:hidden">
        <div className="rounded-lg border border-beige-300 bg-white p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="text-xs uppercase tracking-widest text-warm-gray">Estado en Mindbody</div>
            {card.sold_at ? (
              <div className="text-dark">
                Vendida · Saldo{' '}
                <span className="font-medium">
                  {card.mindbody_remaining_balance_cents != null
                    ? formatMoney(card.mindbody_remaining_balance_cents, card.currency)
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
            {syncMessage && (
              <div className="text-xs text-dark mt-1">{syncMessage}</div>
            )}
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

      {/* Toolbar — hidden when printing */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/admin/giftcards/issued"
          className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-dark"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a Emitidas
        </Link>
        <Button onClick={() => window.print()} leftIcon={<Printer className="h-4 w-4" />}>
          Imprimir
        </Button>
      </div>

      {/* Printable label */}
      <div className="print-card mx-auto bg-white border border-beige-300 rounded-2xl p-8 max-w-2xl shadow-card print:shadow-none print:border-0 print:rounded-none print:max-w-none">
        <div className="text-center mb-4">
          <div className="text-xs uppercase tracking-widest text-warm-gray mb-1">
            Mimosa Spa
          </div>
          <div className="text-2xl font-display font-semibold text-dark">
            {isCert ? 'Certificado de Regalo' : 'Gift Card'}
          </div>
        </div>

        <div className="space-y-4 text-dark">
          {card.print_recipient && (
            <div>
              <div className="text-xs uppercase tracking-widest text-warm-gray">Para</div>
              <div className="text-lg font-medium">{card.recipient_name}</div>
            </div>
          )}

          {isCert && card.treatment_name && (
            <div>
              <div className="text-xs uppercase tracking-widest text-warm-gray">Tratamiento</div>
              <div className="text-lg font-medium">{card.treatment_name}</div>
            </div>
          )}

          {card.print_amount && (
            <div>
              <div className="text-xs uppercase tracking-widest text-warm-gray">Valor</div>
              <div className="text-3xl font-display font-semibold text-gold">
                {formatMoney(card.amount_cents, card.currency)}
              </div>
              {isCert && (
                <div className="text-xs text-warm-gray mt-1">Incluye ITBMS</div>
              )}
            </div>
          )}

          {card.print_message && card.message && (
            <div>
              <div className="text-xs uppercase tracking-widest text-warm-gray">Mensaje</div>
              <div className="italic">{card.message}</div>
            </div>
          )}
        </div>

        {/* Barcode + serial */}
        <div className="mt-8 pt-6 border-t border-beige-200 flex flex-col items-center">
          <svg ref={barcodeRef} />
          <div className="mt-2 font-mono text-sm text-dark tracking-widest">
            {card.serial}
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-warm-gray">
          Emitida {new Date(card.issued_at).toLocaleDateString('es-PA')}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page { size: auto; margin: 12mm; }
          body { background: white; }
          aside, header, nav { display: none !important; }
        }
      `}</style>
    </div>
  )
}
