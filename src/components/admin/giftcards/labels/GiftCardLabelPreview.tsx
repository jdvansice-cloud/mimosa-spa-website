'use client'

import { useEffect, useState } from 'react'
import { renderLabelCanvas } from './renderLabelCanvas'
import { LabelCard } from './types'

/**
 * On-screen preview of the label. Rendered at 2× supersampling and displayed
 * at the logical dot size, so it looks smooth (retina screens get real
 * detail) while staying layout-identical to the exact bitmap QZ prints.
 * `physical` sizes it in real inches instead — for the browser-print
 * fallback copy, which must land on paper at label size.
 */
export function GiftCardLabelPreview({
  card,
  scale = 1,
  physical = false,
  className,
}: {
  card: LabelCard
  /** Logical screen px per printer dot (1 → 609px wide, ≈2× physical size). */
  scale?: number
  /** Size in physical inches instead of pixels. */
  physical?: boolean
  className?: string
}) {
  const [img, setImg] = useState<{ src: string; w: number; h: number } | null>(null)

  useEffect(() => {
    let cancelled = false
    renderLabelCanvas(card, undefined, 2).then((canvas) => {
      if (!cancelled) {
        // Logical (dot) dimensions — the canvas itself is 2× supersampled.
        setImg({ src: canvas.toDataURL('image/png'), w: canvas.width / 2, h: canvas.height / 2 })
      }
    })
    return () => {
      cancelled = true
    }
  }, [card])

  const size = img
    ? physical
      ? { width: `${(img.w / 203) * scale}in`, height: `${(img.h / 203) * scale}in` }
      : { width: `${Math.round(img.w * scale)}px`, height: `${Math.round(img.h * scale)}px` }
    : {}
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={img?.src}
      alt={`Etiqueta ${card.serial}`}
      className={className}
      style={{
        ...size,
        maxWidth: 'none',
        display: 'block',
        background: 'white',
      }}
    />
  )
}
