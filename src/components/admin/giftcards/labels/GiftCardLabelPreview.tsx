'use client'

import { useEffect, useState } from 'react'
import { renderLabelCanvas } from './renderLabelCanvas'
import { LabelCard, LABEL_WIDTH_IN, LABEL_HEIGHT_IN } from './types'

/**
 * On-screen preview of the label bitmap. Shows the exact 203 dpi canvas that
 * QZ Tray sends to the printer, scaled to `scale` × real size via CSS inches.
 */
export function GiftCardLabelPreview({
  card,
  scale = 1,
  className,
}: {
  card: LabelCard
  scale?: number
  className?: string
}) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    renderLabelCanvas(card).then((canvas) => {
      if (!cancelled) setSrc(canvas.toDataURL('image/png'))
    })
    return () => {
      cancelled = true
    }
  }, [card])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src ?? undefined}
      alt={`Etiqueta ${card.serial}`}
      className={className}
      style={{
        width: `${LABEL_WIDTH_IN * scale}in`,
        height: `${LABEL_HEIGHT_IN * scale}in`,
        display: 'block',
        background: 'white',
        imageRendering: scale > 1 ? 'pixelated' : 'auto',
      }}
    />
  )
}
