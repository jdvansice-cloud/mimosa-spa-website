'use client'

import { useEffect, useState } from 'react'
import { renderLabelCanvas } from './renderLabelCanvas'
import { LabelCard } from './types'

/**
 * On-screen preview of the label bitmap — the exact 203 dpi canvas that QZ
 * Tray sends to the printer. Displayed at an INTEGER pixel multiple of the
 * canvas (1 canvas dot → `scale` screen px) with smoothing disabled, so the
 * preview is always crisp; fractional CSS-inch scaling blurred it.
 */
export function GiftCardLabelPreview({
  card,
  scale = 1,
  physical = false,
  className,
}: {
  card: LabelCard
  /** Integer screen pixels per printer dot (1 ≈ 2× physical size on a 96dpi screen). */
  scale?: number
  /** Size in physical inches instead of pixels — for the browser-print fallback copy. */
  physical?: boolean
  className?: string
}) {
  const [img, setImg] = useState<{ src: string; w: number; h: number } | null>(null)

  useEffect(() => {
    let cancelled = false
    renderLabelCanvas(card).then((canvas) => {
      if (!cancelled) {
        setImg({ src: canvas.toDataURL('image/png'), w: canvas.width, h: canvas.height })
      }
    })
    return () => {
      cancelled = true
    }
  }, [card])

  const k = Math.max(1, Math.round(scale))
  const size = img
    ? physical
      ? { width: `${(img.w / 203) * scale}in`, height: `${(img.h / 203) * scale}in` }
      : { width: `${img.w * k}px`, height: `${img.h * k}px` }
    : {}
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={img?.src}
      alt={`Etiqueta ${card.serial}`}
      className={className}
      style={{
        ...size,
        display: 'block',
        background: 'white',
        imageRendering: physical ? 'auto' : 'pixelated',
      }}
    />
  )
}
