'use client'

import Link from 'next/link'
import { ArrowLeft, LayoutTemplate } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import {
  GiftCardLabelPreview,
  LABEL_WIDTH_IN,
  LABEL_HEIGHT_IN,
  LabelCard,
} from '@/components/admin/giftcards/labels'

const PREVIEW_SCALE = 1 // 1 logical px per dot ≈ 2× physical size on screen

const samplePlain: LabelCard = {
  serial: 'MG000123',
  buyer_name: 'Carlos Pérez',
  recipient_name: 'Ana Gómez',
  amount_cents: 10000,
  currency: 'USD',
  gift_treatment_names: null,
  message: 'Feliz cumpleaños — disfruta este detalle.',
  print_amount: true,
  print_message: true,
  print_recipient: true,
  print_treatments: false,
}

const sampleWithTreatments: LabelCard = {
  serial: 'MG000124',
  buyer_name: 'María Vega',
  recipient_name: 'Lucía Vega',
  amount_cents: 16050,
  currency: 'USD',
  gift_treatment_names: ['Masaje Relajante 60 min', 'Facial Hidratante'],
  message: 'Con cariño, mamá.',
  print_amount: true,
  print_message: true,
  print_recipient: true,
  print_treatments: true,
}

function Preview({ title, subtitle, card }: { title: string; subtitle: string; card: LabelCard }) {
  return (
    <Card variant="default" padding="md">
      <CardContent>
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-dark">{title}</h2>
          <p className="text-xs text-warm-gray-500 mt-1">{subtitle}</p>
          <p className="text-xs text-warm-gray-500 mt-1">
            Vista previa a ≈2× tamaño real ({LABEL_WIDTH_IN}&quot; × {LABEL_HEIGHT_IN}&quot;)
          </p>
        </div>
        <div className="inline-block" style={{ border: '1px dashed #c8b78c' }}>
          <GiftCardLabelPreview card={card} scale={PREVIEW_SCALE} />
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminGiftCardTemplatesPage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/giftcards"
          className="inline-flex items-center gap-1 text-sm text-warm-gray-500 hover:text-dark mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> Gift Cards
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gold/10 rounded-lg">
            <LayoutTemplate className="h-6 w-6 text-gold" />
          </div>
          <h1 className="text-3xl font-display font-semibold text-dark">Plantilla de Etiqueta</h1>
        </div>
        <p className="text-warm-gray-500">
          Plantilla única para etiquetas de 3&quot; × 2&quot; con línea negra — Omezizy D520 vía QZ Tray
          (bitmap a 203 dpi, ancho completo de 3&quot;). Datos de muestra.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Preview
          title="Sin tratamientos"
          subtitle="Gift Card emitida por un monto directo."
          card={samplePlain}
        />
        <Preview
          title="Con tratamientos"
          subtitle="Gift Card cuyo monto se calculó sumando tratamientos."
          card={sampleWithTreatments}
        />
      </div>

      <div className="mt-8 text-sm text-warm-gray-500 max-w-2xl">
        Edita <code className="font-mono">src/components/admin/giftcards/labels/renderLabelCanvas.ts</code>
        {' '}para cambiar el diseño. Los datos de cada Gift Card emitida se renderizan en este formato.
      </div>
    </div>
  )
}
