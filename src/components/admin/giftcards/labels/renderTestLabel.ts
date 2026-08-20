'use client'

import JsBarcode from 'jsbarcode'
import { LABEL_WIDTH_IN, LABEL_HEIGHT_IN } from './types'

// Calibration pattern for dialing in label media without spending a real
// gift card: registration (edge frames + midpoint ticks), orientation
// (ARRIBA marker), darkness (100/50/25% patches), and barcode sharpness
// (Code128 at 3 dots/module, same as real labels). Drawn in printer-dot
// space at 203 dpi like renderLabelCanvas — the outer frame sits at the
// exact bitmap edge, so where it lands on the physical label IS the
// registration offset. Layout compacted 2026-08-05 for 2.25 × 1.25 in.

const DPI = 203
const pt = (n: number) => Math.round((n * DPI) / 72)
const LATO = 'Lato, sans-serif'
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace'

const BARS_H = 40
const TEST_SERIAL = 'PRUEBA123'

function frame(ctx: CanvasRenderingContext2D, w: number, h: number, inset: number, t: number) {
  ctx.fillRect(inset, inset, w - inset * 2, t)
  ctx.fillRect(inset, h - inset - t, w - inset * 2, t)
  ctx.fillRect(inset, inset, t, h - inset * 2)
  ctx.fillRect(w - inset - t, inset, t, h - inset * 2)
}

/** Square patch dithered dot-by-dot — never resampled, so % ink is exact. */
function patch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  on: (px: number, py: number) => boolean
) {
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      if (on(px, py)) ctx.fillRect(x + px, y + py, 1, 1)
    }
  }
}

export async function renderTestCanvas(widthIn: number): Promise<HTMLCanvasElement> {
  await Promise.all([
    document.fonts.load(`700 ${pt(7)}px ${LATO}`),
    document.fonts.load(`400 ${pt(5.5)}px ${LATO}`),
  ]).catch(() => undefined)

  const W = Math.round(widthIn * DPI)
  const H = Math.round(LABEL_HEIGHT_IN * DPI)
  const cx = Math.round(W / 2)
  const cy = Math.round(H / 2)

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#000000'

  // Registration: frame at the exact edge + hairline 6 dots in, plus
  // midpoint ticks — an off-center print shows immediately as uneven gaps.
  frame(ctx, W, H, 0, 2)
  frame(ctx, W, H, 6, 1)
  ctx.fillRect(cx - 1, 0, 2, 10)
  ctx.fillRect(cx - 1, H - 10, 2, 10)
  ctx.fillRect(0, cy - 1, 10, 2)
  ctx.fillRect(W - 10, cy - 1, 10, 2)

  // Orientation marker — if this triangle isn't pointing at the top of the
  // physical label, the rotation pipeline broke.
  ctx.beginPath()
  ctx.moveTo(30, 12)
  ctx.lineTo(21, 30)
  ctx.lineTo(39, 30)
  ctx.closePath()
  ctx.fill()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.font = `700 ${pt(4.5)}px ${LATO}`
  ctx.fillText('ARRIBA', 30, 34)

  ctx.font = `700 ${pt(7)}px ${LATO}`
  ctx.fillText('MIMOSA · PRUEBA', cx, 12)
  ctx.font = `400 ${pt(5.5)}px ${LATO}`
  ctx.fillText(`${LABEL_WIDTH_IN} × ${LABEL_HEIGHT_IN} in · 203 dpi · 1:1`, cx, 12 + pt(7) + pt(2))

  // Darkness patches: solid should be dense black with no voids; 50% and
  // 25% should stay distinct.
  const size = 28
  const gap = 12
  const px0 = cx - Math.round((size * 3 + gap * 2) / 2)
  const py0 = 62
  patch(ctx, px0, py0, size, () => true)
  patch(ctx, px0 + size + gap, py0, size, (a, b) => (a + b) % 2 === 0)
  patch(ctx, px0 + (size + gap) * 2, py0, size, (a, b) => a % 2 === 0 && b % 2 === 0)
  ctx.font = `400 ${pt(5)}px ${LATO}`
  const labelY = py0 + size + 4
  ctx.fillText('100%', px0 + size / 2, labelY)
  ctx.fillText('50%', px0 + size + gap + size / 2, labelY)
  ctx.fillText('25%', px0 + (size + gap) * 2 + size / 2, labelY)

  // Barcode exactly as real labels print it: Code128, 3 dots/module,
  // bottom-anchored with the test serial beneath.
  const bc = document.createElement('canvas')
  JsBarcode(bc, TEST_SERIAL, {
    format: 'CODE128',
    displayValue: false,
    margin: 0,
    width: 3,
    height: BARS_H,
  })
  const serialTop = H - 12 - pt(7)
  const barsTop = serialTop - 4 - BARS_H
  ctx.drawImage(bc, Math.round((W - bc.width) / 2), barsTop)
  ctx.font = `400 ${pt(7)}px ${MONO}`
  ctx.fillText(TEST_SERIAL, cx, serialTop)

  return canvas
}
