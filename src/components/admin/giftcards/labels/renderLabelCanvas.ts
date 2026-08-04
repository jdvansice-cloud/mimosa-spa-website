'use client'

import JsBarcode from 'jsbarcode'
import { LabelCard, LABEL_WIDTH_IN, LABEL_HEIGHT_IN } from './types'

// The label is rasterized at the printers' native 203 dpi so the printed
// dots match the canvas pixels 1:1 — no browser/driver scaling in the path.
// Width varies per printer profile (D520 3in / TSP143 2.835in).
//
// Design: Apple-gift-card minimalism adapted to 1-bit thermal — a small
// raised "$" beside a large plain number (cents raised and small, hidden
// when zero), tiny letterspaced caps as the only structural labels, no
// rules or boxes, whitespace doing the layout work.
const DPI = 203
export const LABEL_DOTS_H = Math.round(LABEL_HEIGHT_IN * DPI) // 406

// pt → dots (203/72).
const pt = (n: number) => Math.round((n * DPI) / 72)

const PAD_TOP = pt(7)
const PAD_X = pt(11.5) // ≈4 mm — die-cut position tolerance
const PAD_BOTTOM = pt(7)

const PRICE_SIZE = pt(26) // the number
const PRICE_SUP = Math.round(PRICE_SIZE * 0.52) // $ and cents, top-aligned
const EYEBROW_SIZE = pt(6.5) // "INCLUYE"
const TREAT_SIZE = pt(9.5)
const TREAT_LINE = Math.round(TREAT_SIZE * 1.35)
const MSG_SIZE = pt(11)
const MSG_LINE = Math.round(MSG_SIZE * 1.3)
const SERIAL_SIZE = pt(9)

const BARS_H = Math.round(0.27 * DPI)
const BARS_MAX_W = Math.round(2.4 * DPI)
const SERIAL_GAP = pt(2)

const LATO = "Lato, sans-serif"
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace"

interface Seg {
  text: string
  font: string
}

/** Greedy word-wrap over styled segments; clamps to maxLines with an ellipsis. */
function wrapSegments(
  ctx: CanvasRenderingContext2D,
  segs: Seg[],
  maxWidth: number,
  maxLines: number
): Seg[][] {
  const words: Seg[] = segs.flatMap((s) =>
    s.text.split(/\s+/).filter(Boolean).map((w) => ({ text: w, font: s.font }))
  )
  const lines: Seg[][] = []
  let line: Seg[] = []
  let lineW = 0
  const width = (text: string, font: string) => {
    ctx.font = font
    return ctx.measureText(text).width
  }
  for (const w of words) {
    const wW = width(w.text, w.font)
    const spaceW = line.length ? width(' ', w.font) : 0
    if (line.length && lineW + spaceW + wW > maxWidth) {
      lines.push(line)
      line = [w]
      lineW = wW
    } else {
      line = [...line, w]
      lineW += spaceW + wW
    }
  }
  if (line.length) lines.push(line)
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines)
    const last = kept[maxLines - 1]
    last[last.length - 1] = { ...last[last.length - 1], text: last[last.length - 1].text + '…' }
    return kept
  }
  return lines
}

function drawCenteredLine(
  ctx: CanvasRenderingContext2D,
  line: Seg[],
  centerX: number,
  topY: number
) {
  let total = 0
  for (let i = 0; i < line.length; i++) {
    ctx.font = line[i].font
    total += ctx.measureText((i ? ' ' : '') + line[i].text).width
  }
  let x = centerX - total / 2
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  for (let i = 0; i < line.length; i++) {
    ctx.font = line[i].font
    const text = (i ? ' ' : '') + line[i].text
    ctx.fillText(text, x, topY)
    x += ctx.measureText(text).width
  }
}

/**
 * Price in the Apple gift card idiom: raised small "$", large number, and —
 * only when the amount has cents — raised small cents. Right-aligned so it
 * anchors the top-right corner. Returns the block height.
 */
function drawPrice(
  ctx: CanvasRenderingContext2D,
  amountCents: number,
  rightX: number,
  topY: number
): number {
  const whole = Math.floor(amountCents / 100).toLocaleString('en-US')
  const cents = amountCents % 100
  const centsText = cents > 0 ? String(cents).padStart(2, '0') : null

  const numFont = `700 ${PRICE_SIZE}px ${LATO}`
  const supFont = `700 ${PRICE_SUP}px ${LATO}`
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'

  ctx.font = supFont
  const dollarW = ctx.measureText('$').width
  const centsW = centsText ? ctx.measureText(centsText).width : 0
  ctx.font = numFont
  const numW = ctx.measureText(whole).width

  const gap = pt(0.7)
  const total = dollarW + gap + numW + (centsText ? gap + centsW : 0)
  const supY = topY + pt(1.2) // optical top alignment of the small glyphs
  let x = rightX - total

  ctx.font = supFont
  ctx.fillText('$', x, supY)
  x += dollarW + gap
  ctx.font = numFont
  ctx.fillText(whole, x, topY)
  x += numW + gap
  if (centsText) {
    ctx.font = supFont
    ctx.fillText(centsText, x, supY)
  }
  return PRICE_SIZE
}

/** Code128 bars at exact dot multiples (3 dots/module, 2 if it must fit). */
function renderBarcode(serial: string): HTMLCanvasElement {
  const bc = document.createElement('canvas')
  for (const moduleDots of [3, 2]) {
    JsBarcode(bc, serial, {
      format: 'CODE128',
      displayValue: false,
      margin: 0,
      width: moduleDots,
      height: BARS_H,
    })
    if (bc.width <= BARS_MAX_W || moduleDots === 2) break
  }
  return bc
}

/**
 * Rasterize a gift card label at 203 dpi. The same bitmap feeds the
 * on-screen preview and the QZ Tray print job, so the preview is exactly
 * what prints. `widthIn` comes from the printer profile (default D520 3in).
 */
export async function renderLabelCanvas(
  card: LabelCard,
  widthIn: number = LABEL_WIDTH_IN,
  /**
   * Render at a multiple of 203 dpi. 1 (default) = the exact bitmap the
   * printer receives; 2 = supersampled for smooth on-screen previews.
   * Layout is identical at any factor — everything draws in dot space.
   */
  supersample = 1
): Promise<HTMLCanvasElement> {
  await Promise.all([
    document.fonts.load(`700 ${PRICE_SIZE}px ${LATO}`),
    document.fonts.load(`700 ${PRICE_SUP}px ${LATO}`),
    document.fonts.load(`700 ${EYEBROW_SIZE}px ${LATO}`),
    document.fonts.load(`400 ${TREAT_SIZE}px ${LATO}`),
    document.fonts.load(`italic 400 ${MSG_SIZE}px ${LATO}`),
  ])

  const W = Math.round(widthIn * DPI)
  const canvas = document.createElement('canvas')
  canvas.width = W * supersample
  canvas.height = LABEL_DOTS_H * supersample
  const ctx = canvas.getContext('2d')!
  ctx.scale(supersample, supersample)
  ctx.imageSmoothingEnabled = false // barcode drawImage must stay dot-sharp
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, LABEL_DOTS_H)
  ctx.fillStyle = '#000000'

  const contentW = W - PAD_X * 2
  const centerX = W / 2
  const rightX = W - PAD_X

  // Price — top right. When hidden, the middle band owns the whole top.
  let bandTop = PAD_TOP
  if (card.print_amount) {
    const h = drawPrice(ctx, card.amount_cents, rightX, PAD_TOP)
    bandTop = PAD_TOP + h + pt(2)
  }

  // Barcode + serial — centered, bottom.
  const bars = renderBarcode(card.serial)
  const serialTop = LABEL_DOTS_H - PAD_BOTTOM - SERIAL_SIZE
  const barsTop = serialTop - SERIAL_GAP - BARS_H
  ctx.drawImage(bars, Math.round((W - bars.width) / 2), barsTop)
  ctx.font = `600 ${SERIAL_SIZE}px ${MONO}`
  if ('letterSpacing' in ctx) (ctx as { letterSpacing: string }).letterSpacing = `${pt(1.8)}px`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(card.serial, centerX, serialTop)
  if ('letterSpacing' in ctx) (ctx as { letterSpacing: string }).letterSpacing = '0px'

  // Middle band — whichever of treatments / message are enabled, vertically
  // centered together in the space between price and barcode.
  const showTreatments =
    card.print_treatments &&
    Array.isArray(card.gift_treatment_names) &&
    card.gift_treatment_names.length > 0
  const treatLines = showTreatments
    ? wrapSegments(
        ctx,
        [
          {
            text: (card.gift_treatment_names ?? []).join('  ·  '),
            font: `400 ${TREAT_SIZE}px ${LATO}`,
          },
        ],
        contentW,
        3
      )
    : []
  const msgLines =
    card.print_message && card.message
      ? wrapSegments(
          ctx,
          [{ text: `“${card.message}”`, font: `italic 400 ${MSG_SIZE}px ${LATO}` }],
          contentW,
          3
        )
      : []

  // Bigger body sizes can overflow the band when both blocks max out their
  // line clamps — drop trailing lines (with ellipsis) before crowding the
  // barcode.
  const bandH = barsTop - pt(2) - bandTop
  const eyebrowH = () => (treatLines.length ? EYEBROW_SIZE + pt(2.5) : 0)
  const contentH = () =>
    eyebrowH() +
    treatLines.length * TREAT_LINE +
    (treatLines.length && msgLines.length ? pt(5) : 0) +
    msgLines.length * MSG_LINE
  const ellipsize = (lines: Seg[][]) => {
    const last = lines[lines.length - 1]
    const seg = last[last.length - 1]
    if (!seg.text.endsWith('…')) last[last.length - 1] = { ...seg, text: seg.text + '…' }
  }
  while (contentH() > bandH && msgLines.length > 1) {
    msgLines.pop()
    ellipsize(msgLines)
  }
  while (contentH() > bandH && treatLines.length > 1) {
    treatLines.pop()
    ellipsize(treatLines)
  }
  const treatH = treatLines.length * TREAT_LINE
  const msgH = msgLines.length * MSG_LINE
  const gap = treatLines.length && msgLines.length ? pt(5) : 0
  let y = bandTop + Math.max(0, (bandH - (eyebrowH() + treatH + gap + msgH)) / 2)

  if (treatLines.length) {
    ctx.font = `700 ${EYEBROW_SIZE}px ${LATO}`
    if ('letterSpacing' in ctx) (ctx as { letterSpacing: string }).letterSpacing = `${pt(1.3)}px`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText('INCLUYE', centerX, y)
    if ('letterSpacing' in ctx) (ctx as { letterSpacing: string }).letterSpacing = '0px'
    y += eyebrowH()
    for (const line of treatLines) {
      drawCenteredLine(ctx, line, centerX, y + (TREAT_LINE - TREAT_SIZE) / 2)
      y += TREAT_LINE
    }
  }
  y += gap
  for (const line of msgLines) {
    drawCenteredLine(ctx, line, centerX, y + (MSG_LINE - MSG_SIZE) / 2)
    y += MSG_LINE
  }

  return canvas
}
