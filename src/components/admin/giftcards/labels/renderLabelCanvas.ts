'use client'

import JsBarcode from 'jsbarcode'
import { LabelCard, formatLabelMoney, LABEL_WIDTH_IN, LABEL_HEIGHT_IN } from './types'

// The label is rasterized at the printers' native 203 dpi so the printed
// dots match the canvas pixels 1:1 — no browser/driver scaling in the path.
// Width varies per printer profile (D520 3in / TSP143 2.835in).
const DPI = 203
export const LABEL_DOTS_H = Math.round(LABEL_HEIGHT_IN * DPI) // 406

// pt → dots (203/72). Sizes mirror the approved label design.
const pt = (n: number) => Math.round((n * DPI) / 72)

const PAD_TOP = pt(6.5)
const PAD_X = pt(11.5) // ≈4 mm — die-cut position tolerance on the D520
const PAD_BOTTOM = pt(7)

const EYEBROW_SIZE = pt(6.5)
const AMOUNT_SIZE = pt(16)
const TREAT_SIZE = pt(8)
const TREAT_LINE = Math.round(TREAT_SIZE * 1.3)
const MSG_SIZE = pt(9.5)
const MSG_LINE = Math.round(MSG_SIZE * 1.25)
const SERIAL_SIZE = pt(9)
const BAND_GAP = pt(5)

const BARS_H = Math.round(0.27 * DPI) // barcode bar height (0.27in)
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
  widthIn: number = LABEL_WIDTH_IN
): Promise<HTMLCanvasElement> {
  await Promise.all([
    document.fonts.load(`700 ${EYEBROW_SIZE}px ${LATO}`),
    document.fonts.load(`900 ${AMOUNT_SIZE}px ${LATO}`),
    document.fonts.load(`400 ${TREAT_SIZE}px ${LATO}`),
    document.fonts.load(`700 ${TREAT_SIZE}px ${LATO}`),
    document.fonts.load(`italic 400 ${MSG_SIZE}px ${LATO}`),
  ])

  const W = Math.round(widthIn * DPI)
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = LABEL_DOTS_H
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, LABEL_DOTS_H)
  ctx.fillStyle = '#000000'

  const contentW = W - PAD_X * 2
  const centerX = W / 2
  const rightX = W - PAD_X

  // Amount block — top right.
  let bandTop = PAD_TOP
  if (card.print_amount) {
    ctx.textBaseline = 'top'
    ctx.textAlign = 'right'
    ctx.font = `700 ${EYEBROW_SIZE}px ${LATO}`
    if ('letterSpacing' in ctx) (ctx as { letterSpacing: string }).letterSpacing = `${pt(1.4)}px`
    ctx.fillText('VALOR', rightX, PAD_TOP)
    if ('letterSpacing' in ctx) (ctx as { letterSpacing: string }).letterSpacing = '0px'
    ctx.font = `900 ${AMOUNT_SIZE}px ${LATO}`
    ctx.fillText(
      formatLabelMoney(card.amount_cents, card.currency),
      rightX,
      PAD_TOP + EYEBROW_SIZE + pt(1.5)
    )
    bandTop = PAD_TOP + EYEBROW_SIZE + pt(1.5) + AMOUNT_SIZE + pt(2)
  }

  // Barcode + serial block — bottom, centered.
  const bars = renderBarcode(card.serial)
  const serialTop = LABEL_DOTS_H - PAD_BOTTOM - SERIAL_SIZE
  const barsTop = serialTop - SERIAL_GAP - BARS_H
  ctx.drawImage(bars, Math.round((W - bars.width) / 2), barsTop)
  ctx.font = `600 ${SERIAL_SIZE}px ${MONO}`
  if ('letterSpacing' in ctx) (ctx as { letterSpacing: string }).letterSpacing = `${pt(1.6)}px`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(card.serial, centerX, serialTop)
  if ('letterSpacing' in ctx) (ctx as { letterSpacing: string }).letterSpacing = '0px'

  // Middle band — treatments and/or message, vertically centered between
  // the amount block and the barcode.
  const showTreatments =
    card.print_treatments &&
    Array.isArray(card.gift_treatment_names) &&
    card.gift_treatment_names.length > 0
  const treatLines = showTreatments
    ? wrapSegments(
        ctx,
        [
          { text: 'Incluye:', font: `700 ${TREAT_SIZE}px ${LATO}` },
          {
            text: (card.gift_treatment_names ?? []).join(' · '),
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

  const treatH = treatLines.length * TREAT_LINE
  const msgH = msgLines.length * MSG_LINE
  const gap = treatLines.length && msgLines.length ? BAND_GAP : 0
  const bandH = barsTop - pt(2) - bandTop
  let y = bandTop + Math.max(0, (bandH - (treatH + gap + msgH)) / 2)
  for (const line of treatLines) {
    drawCenteredLine(ctx, line, centerX, y + (TREAT_LINE - TREAT_SIZE) / 2)
    y += TREAT_LINE
  }
  y += gap
  for (const line of msgLines) {
    drawCenteredLine(ctx, line, centerX, y + (MSG_LINE - MSG_SIZE) / 2)
    y += MSG_LINE
  }

  return canvas
}
