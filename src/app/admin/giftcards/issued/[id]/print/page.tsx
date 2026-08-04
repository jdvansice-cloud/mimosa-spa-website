'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Printer, Loader2, RefreshCw, FileText } from 'lucide-react'
import { Button } from '@/components/ui'
import {
  GiftCardLabelPreview,
  LABEL_WIDTH_IN,
  LABEL_HEIGHT_IN,
  LabelCard,
  formatLabelMoney,
} from '@/components/admin/giftcards/labels'
import { printGiftCardLabel, savePrinter, QzError } from '@/lib/qz/qzPrint'

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
  const [printing, setPrinting] = useState(false)
  const [printMessage, setPrintMessage] = useState<string | null>(null)
  const [printerChoices, setPrinterChoices] = useState<string[] | null>(null)

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

  const handleQzPrint = async () => {
    if (!card || printing) return
    setPrinting(true)
    setPrintMessage(null)
    setPrinterChoices(null)
    try {
      const printer = await printGiftCardLabel(card)
      setPrintMessage(`Etiqueta enviada a ${printer}.`)
    } catch (e) {
      if (e instanceof QzError) {
        setPrintMessage(e.message)
        if (e.kind === 'printer' && e.printers?.length) setPrinterChoices(e.printers)
      } else {
        setPrintMessage(e instanceof Error ? e.message : 'Error al imprimir.')
      }
    } finally {
      setPrinting(false)
    }
  }

  const handlePickPrinter = (name: string) => {
    savePrinter(name)
    setPrinterChoices(null)
    void handleQzPrint()
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 no-print">
        <Link
          href="/admin/giftcards/issued"
          className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-dark"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a Emitidas
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => window.print()}
            leftIcon={<FileText className="h-4 w-4" />}
          >
            Diálogo del navegador
          </Button>
          <Button
            onClick={handleQzPrint}
            isLoading={printing}
            leftIcon={printing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
          >
            Imprimir Etiqueta
          </Button>
        </div>
      </div>

      {/* QZ print feedback */}
      {(printMessage || printerChoices) && (
        <div className="mb-4 no-print rounded-lg border border-beige-300 bg-white p-3 text-sm text-dark space-y-2">
          {printMessage && <div>{printMessage}</div>}
          {printerChoices && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-warm-gray">Impresoras detectadas:</span>
              {printerChoices.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePickPrinter(p)}
                  className="rounded border border-beige-300 px-2 py-1 text-xs hover:bg-beige-50"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Preview heading */}
      <div className="mb-3 no-print">
        <div className="text-xs uppercase tracking-widest text-warm-gray">
          Vista previa ({PREVIEW_SCALE}× tamaño real · etiqueta 3&quot; × 2&quot; con línea negra) — se imprime exactamente esta imagen
        </div>
      </div>

      {/* On-screen preview: the exact 203 dpi bitmap QZ sends, at 2×. */}
      <div className="no-print inline-block" style={{ border: '1px dashed #c8b78c' }}>
        <GiftCardLabelPreview card={card} scale={PREVIEW_SCALE} />
      </div>

      {/* Browser-print fallback copy at 1:1 — offscreen until @media print. */}
      <div className="print-label print-only">
        <GiftCardLabelPreview card={card} scale={1} />
      </div>

      {/* Printer settings reminder */}
      <div className="mt-5 no-print max-w-xl rounded-lg border border-beige-300 bg-beige-50 p-4 text-xs text-warm-gray leading-relaxed">
        <div className="font-semibold text-dark mb-1">Impresión directa (QZ Tray · Omezizy D520)</div>
        <ul className="list-disc pl-4 space-y-0.5">
          <li><span className="font-medium text-dark">QZ Tray</span> debe estar instalado y ejecutándose en esta computadora (qz.io/download). La D520 va conectada por <span className="font-medium text-dark">USB</span>.</li>
          <li>La D520 detecta la <span className="font-medium text-dark">línea negra</span> del liner y cuadra cada etiqueta sola — al cargar un rollo nuevo presiona feed una vez para calibrar.</li>
          <li>&quot;Imprimir Etiqueta&quot; envía la imagen a 203 dpi directo a la impresora, sin diálogo. &quot;Diálogo del navegador&quot; es el respaldo: tamaño 3&quot; × 2&quot;, márgenes 0, escala 100%.</li>
          <li>Si la impresión sale clara, sube <span className="font-medium text-dark">Darkness</span> en las opciones de la impresora D520.</li>
        </ul>
      </div>

      <style jsx global>{`
        @page {
          size: ${LABEL_WIDTH_IN}in ${LABEL_HEIGHT_IN}in;
          margin: 0;
        }
        .print-only {
          position: absolute;
          left: -9999px;
          top: 0;
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
          }
        }
      `}</style>
    </div>
  )
}
