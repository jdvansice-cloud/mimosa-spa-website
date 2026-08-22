'use client'

import QRCode from 'qrcode'
import { RATE_BY_CODE } from '@/lib/efactura/constants'
import type { CafeReceiptPayload } from '@/lib/print/types'

/**
 * Rasterize a CAFE for an 80 mm thermal receipt printer (MUNBYN, 203 dpi).
 *
 * Same discipline as the gift-card labels: draw at the printer's native
 * resolution so one canvas pixel is one printer dot, and let QZ submit the
 * bitmap with every scaling step disabled. Scaling anywhere in the path is
 * what makes a QR unscannable, and an unscannable QR is a CAFE the customer
 * cannot verify with the DGI.
 *
 * The paper is 80 mm but the head only covers 72 mm, so 576 dots is the width.
 */

const DPI = 203
export const RECEIPT_WIDTH_DOTS = 576 // 72 mm printable
const MARGIN = 16

// pt → dots. Thermal paper eats fine detail, so nothing here goes below 8 pt.
const pt = (n: number) => Math.round((n * DPI) / 72)

const BODY = pt(9)
const SMALL = pt(7.5)
const TINY = pt(6.5)
const TITLE = pt(13)
const TOTAL = pt(12)

const LINE = 1.35 // leading multiplier
const SANS = 'Helvetica, Arial, sans-serif'
// Monospace keeps the amount column aligned without measuring every string.
const MONO = 'Menlo, Consolas, monospace'

const money = (cents: number) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    cents / 100
  )

function docTitle(docType: string): string {
  if (docType === '04' || docType === '06') return 'NOTA DE CRÉDITO'
  return 'FACTURA ELECTRÓNICA'
}

function receptorLabel(tipo: string): string {
  switch (tipo) {
    case '01': return 'Contribuyente'
    case '03': return 'Gobierno'
    case '04': return 'Extranjero'
    default: return 'Consumidor final'
  }
}

/** Tax-rate note per line, e.g. "ITBMS 7%" or "Exento". */
function rateNote(code: string): string {
  const rate = RATE_BY_CODE[code] ?? 0
  return rate === 0 ? 'Exento' : `ITBMS ${Math.round(rate * 100)}%`
}

/**
 * "22 ago 2026, 12:11" in Panama time — month spelled out, matching how dates
 * are written everywhere else in the admin. Never a numeric M/D/Y, which a
 * reader here would parse as day-first and misread.
 */
function formatEmissionDate(iso: string): string {
  const d = new Date(iso)
  const date = d.toLocaleDateString('es-PA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'America/Panama',
  })
  const time = d.toLocaleTimeString('es-PA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Panama',
  })
  return `${date}, ${time}`
}

/** Wrap on width, and hard-split runs (like a 60-char CUFE) that never fit. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const out: string[] = []
  for (const paragraph of text.split('\n')) {
    let line = ''
    for (const word of paragraph.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word
      if (ctx.measureText(candidate).width <= maxWidth) {
        line = candidate
        continue
      }
      if (line) out.push(line)
      if (ctx.measureText(word).width <= maxWidth) {
        line = word
        continue
      }
      let chunk = ''
      for (const ch of word) {
        if (ctx.measureText(chunk + ch).width > maxWidth) {
          out.push(chunk)
          chunk = ch
        } else chunk += ch
      }
      line = chunk
    }
    out.push(line)
  }
  return out
}

export async function renderCafeCanvas(payload: CafeReceiptPayload): Promise<HTMLCanvasElement> {
  const W = RECEIPT_WIDTH_DOTS
  const contentW = W - MARGIN * 2
  const right = W - MARGIN

  // The QR must be rendered before layout so its height is known. Error
  // correction M with a 4-module quiet zone is what DGI verifier apps expect.
  let qr: HTMLCanvasElement | null = null
  if (payload.documento.qrContent) {
    qr = document.createElement('canvas')
    await QRCode.toCanvas(qr, payload.documento.qrContent, {
      errorCorrectionLevel: 'M',
      margin: 4,
      scale: 5,
      color: { dark: '#000000', light: '#ffffff' },
    })
  }

  // Draw onto an over-tall canvas, then crop to the ink. Cheaper and far less
  // error-prone than running the whole layout twice just to measure it.
  const scratch = document.createElement('canvas')
  scratch.width = W
  scratch.height = 6000
  const ctx = scratch.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, scratch.height)
  ctx.fillStyle = '#000000'
  ctx.textBaseline = 'top'

  let y = MARGIN

  const text = (
    s: string,
    opts: { size?: number; align?: CanvasTextAlign; bold?: boolean; font?: string; gap?: number } = {}
  ) => {
    const size = opts.size ?? BODY
    ctx.font = `${opts.bold ? 'bold ' : ''}${size}px ${opts.font ?? SANS}`
    ctx.textAlign = opts.align ?? 'left'
    const x = opts.align === 'center' ? W / 2 : opts.align === 'right' ? right : MARGIN
    for (const line of wrap(ctx, s, contentW)) {
      ctx.fillText(line, x, y)
      y += Math.round(size * LINE)
    }
    y += opts.gap ?? 0
  }

  /** Label on the left, amount right-aligned on the same baseline. */
  const row = (label: string, amount: string, opts: { size?: number; bold?: boolean } = {}) => {
    const size = opts.size ?? BODY
    const weight = opts.bold ? 'bold ' : ''
    ctx.textAlign = 'left'
    ctx.font = `${weight}${size}px ${SANS}`
    ctx.fillText(label, MARGIN, y)
    ctx.textAlign = 'right'
    ctx.font = `${weight}${size}px ${MONO}`
    ctx.fillText(amount, right, y)
    y += Math.round(size * LINE)
  }

  const rule = (dashed = false) => {
    y += 6
    ctx.save()
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    if (dashed) ctx.setLineDash([6, 6])
    ctx.beginPath()
    ctx.moveTo(MARGIN, y)
    ctx.lineTo(right, y)
    ctx.stroke()
    ctx.restore()
    y += 10
  }

  // --- Test banner -----------------------------------------------------
  // Impossible to mistake for a real document if the environment is test.
  if (payload.documento.environment === 'test') {
    ctx.fillRect(MARGIN, y, contentW, pt(20))
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.font = `bold ${SMALL}px ${SANS}`
    ctx.fillText('DOCUMENTO DE PRUEBA — SIN VALOR FISCAL', W / 2, y + pt(5))
    ctx.fillStyle = '#000000'
    y += pt(20) + 12
  }

  // --- Emisor ----------------------------------------------------------
  const e = payload.emisor
  text(e.razonSocial, { size: TITLE, align: 'center', bold: true })
  text(`RUC ${e.ruc}${e.dv ? ` DV ${e.dv}` : ''}`, { size: SMALL, align: 'center' })
  if (e.direccion) text(e.direccion, { size: SMALL, align: 'center' })
  if (e.telefono) text(`Tel. ${e.telefono}`, { size: SMALL, align: 'center' })
  text(`Sucursal ${e.codigoSucursal} · ${e.sucursal}`, { size: SMALL, align: 'center' })

  rule()

  // --- Document --------------------------------------------------------
  const d = payload.documento
  text(docTitle(d.docType), { size: BODY, align: 'center', bold: true })
  if (d.numero) text(`No. ${d.numero}`, { size: SMALL, align: 'center' })
  text(formatEmissionDate(d.fechaEmision), { size: SMALL, align: 'center' })

  rule(true)

  // --- Receptor --------------------------------------------------------
  const r = payload.receptor
  text(`Cliente: ${r.nombre ?? receptorLabel(r.tipo)}`, { size: SMALL })
  // The RUC identifies a contribuyente; for a consumidor final the name line
  // above already says so, and repeating it just wastes paper.
  if (r.ruc) text(`RUC ${r.ruc}${r.dv ? `-${r.dv}` : ''} · ${receptorLabel(r.tipo)}`, { size: SMALL })

  rule(true)

  // --- Lines -----------------------------------------------------------
  for (const line of payload.lines) {
    text(line.description, { size: SMALL })
    row(
      `   ${line.quantity} × ${money(Math.round(line.totalCents / Math.max(line.quantity, 1)))}  ${rateNote(line.taxRateCode)}`,
      money(line.totalCents),
      { size: SMALL }
    )
  }

  rule()

  // --- Totals ----------------------------------------------------------
  const t = payload.totales
  row('Subtotal', money(t.netoCents), { size: SMALL })
  if (t.descuentoCents > 0) row('Descuento', `-${money(t.descuentoCents)}`, { size: SMALL })
  row('ITBMS', money(t.itbmsCents), { size: SMALL })
  y += 4
  row('TOTAL', money(t.totalCents), { size: TOTAL, bold: true })

  y += 8
  for (const p of payload.payments) row(p.label, money(p.amountCents), { size: SMALL })

  rule(true)

  // --- Fiscal identity -------------------------------------------------
  // The CUFE is what makes the paper verifiable, so it is printed in full
  // even though it wraps across three lines.
  text('CUFE', { size: TINY, bold: true })
  text(d.cufe, { size: TINY, font: MONO, gap: 6 })
  if (d.protocoloAutorizacion) {
    text(`Protocolo de autorización: ${d.protocoloAutorizacion}`, { size: TINY, gap: 6 })
  }

  if (qr) {
    const size = Math.min(qr.width, contentW)
    ctx.drawImage(qr, Math.round((W - size) / 2), y, size, size)
    y += size + 8
    text('Escanea para verificar en la DGI', { size: TINY, align: 'center' })
  }

  if (payload.referencia) text(`Ref. ${payload.referencia}`, { size: TINY, align: 'center' })
  if (payload.footer) {
    y += 8
    text(payload.footer, { size: SMALL, align: 'center' })
  }

  // Feed past the tear bar so the last line clears the cutter.
  y += pt(24)

  const out = document.createElement('canvas')
  out.width = W
  out.height = y
  const octx = out.getContext('2d')!
  octx.imageSmoothingEnabled = false
  octx.fillStyle = '#ffffff'
  octx.fillRect(0, 0, W, y)
  octx.drawImage(scratch, 0, 0, W, y, 0, 0, W, y)
  return out
}
