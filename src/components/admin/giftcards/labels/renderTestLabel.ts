'use client'

import JsBarcode from 'jsbarcode'
import { LABEL_HEIGHT_IN } from './types'

// Calibration pattern for dialing in label media without spending a real
// gift card: registration (edge frames + midpoint ticks), orientation
// (ARRIBA marker), darkness (100/50/25% patches — clear film usually needs
// more heat than paper), and barcode sharpness (Code128 at 3 dots/module,
// same as real labels). Drawn in printer-dot space at 203 dpi like
// renderLabelCanvas — the outer frame sits at the exact bitmap edge, so
// where it lands on the physical label IS the registration offset.

const DPI = 203
const pt = (n: number) => Math.round((n * DPI) / 72)
const LATO = 'Lato, sans-serif'
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace'

const BARS_H = Math.round(0.27 * DPI)
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
    document.fonts.load(`700 ${pt(9)}px ${LATO}`),
    document.fonts.load(`400 ${pt(7)}px ${LATO}`),
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

  // Registration: frame at the exact edge + hairline 8 dots in, plus
  // midpoint ticks — an off-center print shows immediately as uneven gaps.
  frame(ctx, W, H, 0, 2)
  frame(ctx, W, H, 8, 1)
  ctx.fillRect(cx - 1, 0, 2, 14)
  ctx.fillRect(cx - 1, H - 14, 2, 14)
  ctx.fillRect(0, cy - 1, 14, 2)
  ctx.fillRect(W - 14, cy - 1, 14, 2)

  // Orientation marker — if this triangle isn't pointing at the top of the
  // physical label, the rotation pipeline broke.
  ctx.beginPath()
  ctx.moveTo(44, 26)
  ctx.lineTo(32, 50)
  ctx.lineTo(56, 50)
  ctx.closePath()
  ctx.fill()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.font = `700 ${pt(5.5)}px ${LATO}`
  ctx.fillText('ARRIBA', 44, 56)

  ctx.font = `700 ${pt(9)}px ${LATO}`
  ctx.fillText('MIMOSA · PRUEBA DE ETIQUETA', cx, 22)
  ctx.font = `400 ${pt(7)}px ${LATO}`
  ctx.fillText('3 × 2 in · 203 dpi · 1:1', cx, 22 + pt(9) + pt(3))

  // Darkness patches: solid should be dense black with no voids; 50% and
  // 25% should stay distinct. On clear film, raise Darkness until 100% is
  // solid but 50% hasn't blurred shut.
  const size = 46
  const gap = 18
  const px0 = cx - Math.round((size * 3 + gap * 2) / 2)
  const py0 = 88
  patch(ctx, px0, py0, size, () => true)
  patch(ctx, px0 + size + gap, py0, size, (a, b) => (a + b) % 2 === 0)
  patch(ctx, px0 + (size + gap) * 2, py0, size, (a, b) => a % 2 === 0 && b % 2 === 0)
  ctx.font = `400 ${pt(6)}px ${LATO}`
  const labelY = py0 + size + 6
  ctx.fillText('100%', px0 + size / 2, labelY)
  ctx.fillText('50%', px0 + size + gap + size / 2, labelY)
  ctx.fillText('25%', px0 + (size + gap) * 2 + size / 2, labelY)

  // Center cross — measure how far it lands from the physical center.
  ctx.fillRect(cx - 20, cy - 1, 40, 2)
  ctx.fillRect(cx - 1, cy - 20, 2, 40)

  // Barcode exactly as real labels print it: Code128, 3 dots/module.
  const bc = document.createElement('canvas')
  JsBarcode(bc, TEST_SERIAL, {
    format: 'CODE128',
    displayValue: false,
    margin: 0,
    width: 3,
    height: BARS_H,
  })
  const serialTop = H - 16 - pt(8)
  const barsTop = serialTop - 4 - BARS_H
  ctx.drawImage(bc, Math.round((W - bc.width) / 2), barsTop)
  ctx.font = `400 ${pt(8)}px ${MONO}`
  ctx.fillText(TEST_SERIAL, cx, serialTop)

  return canvas
}
