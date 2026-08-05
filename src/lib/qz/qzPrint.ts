'use client'

// Gift-card label printing through QZ Tray (https://qz.io) — clean rebuild
// 2026-08-04.
//
// Pipeline: renderLabelCanvas()/renderTestCanvas() rasterize the label at
// the printers' native 203 dpi → the bitmap is (optionally) rotated with a
// lossless pixel permutation → QZ Tray receives it with every scaling step
// disabled → the driver lays dots 1:1 on the media.
//
// Hardware truths this file encodes (verified on the printers — do not
// "simplify" them away):
//
//  · D520: the macOS driver auto-rotates landscape (w > h) pages with a
//    blurry resample. Queue-level Rotate=0 fixes raw `lp` jobs but NOT QZ
//    jobs, and QZ's `orientation: 'portrait'` option prints sideways. The
//    only crisp path is pre-rotating the bitmap 90° CCW client-side and
//    submitting a portrait 2×3 in page (profile.rotateBitmap).
//  · Barcode modules are exact printer-dot multiples; `scaleContent:
//    false` + `density: 203` + nearest-neighbor keep them that way. Any
//    scaling anywhere is the #1 cause of unscannable barcodes.
//  · qz-tray 2.2.x signing: setSignaturePromise MUST use the
//    resolver-factory form `(toSign) => (resolve) => {…}` — returning a
//    Promise throws "Promise resolver #<Promise> is not a function"
//    (@types/qz-tray wrongly allows it). A REJECTED cert/signature promise
//    aborts every call client-side, so always RESOLVE — empty falls back
//    to QZ's "Allow" prompt instead of silent printing.
//
// Signing backend: /api/admin/qz/cert + /sign (QZ_TRAY_CERTIFICATE /
// QZ_TRAY_PRIVATE_KEY env). Silent printing additionally requires the
// public cert installed as ~/Library/Application Support/qz/override.crt
// on each front-desk machine.

import {
  LabelCard,
  LabelPrinterProfile,
  PRINTER_PROFILES,
  D520_PROFILE,
} from '@/components/admin/giftcards/labels/types'
import { renderLabelCanvas } from '@/components/admin/giftcards/labels/renderLabelCanvas'
import { renderTestCanvas } from '@/components/admin/giftcards/labels/renderTestLabel'

const DPI = 203

// v2: bumped when the D520 replaced the Star as primary so a stale saved
// Star choice doesn't shadow the new resolution order.
const PRINTER_STORAGE_KEY = 'giftcard-qz-printer-v2'

export class QzError extends Error {
  kind: 'connect' | 'printer' | 'print'
  /** On kind='printer': every printer QZ can see, for a manual picker. */
  printers?: string[]
  constructor(kind: QzError['kind'], message: string, printers?: string[]) {
    super(message)
    this.kind = kind
    this.printers = printers
  }
}

// ---------------------------------------------------------------------------
// QZ connection + signing (module singleton — one websocket per tab)
// ---------------------------------------------------------------------------

type Qz = typeof import('qz-tray')

let qzPromise: Promise<Qz> | null = null

function getQz(): Promise<Qz> {
  if (!qzPromise) {
    qzPromise = import('qz-tray').then((mod) => {
      const qz = mod.default ?? mod
      qz.security.setCertificatePromise((resolve: (v?: string) => void) => {
        fetch('/api/admin/qz/cert')
          .then((r) => (r.ok ? r.text().then(resolve) : resolve(undefined)))
          .catch(() => resolve(undefined))
      })
      qz.security.setSignatureAlgorithm('SHA512')
      qz.security.setSignaturePromise((toSign: string) => (resolve: (v?: string) => void) => {
        fetch('/api/admin/qz/sign', { method: 'POST', body: toSign })
          .then((r) => (r.ok ? r.text() : ''))
          .then(resolve)
          .catch(() => resolve(''))
      })
      return qz
    })
  }
  return qzPromise
}

async function connect(qz: Qz): Promise<void> {
  if (qz.websocket.isActive()) return
  try {
    await qz.websocket.connect({ retries: 3, delay: 1 })
  } catch {
    throw new QzError(
      'connect',
      'No se pudo conectar con QZ Tray. Verifica que esté instalado y ejecutándose (icono junto al reloj).'
    )
  }
}

// ---------------------------------------------------------------------------
// Printer resolution
// ---------------------------------------------------------------------------

export function getSavedPrinter(): string | null {
  try {
    return localStorage.getItem(PRINTER_STORAGE_KEY)
  } catch {
    return null
  }
}

export function savePrinter(name: string): void {
  try {
    localStorage.setItem(PRINTER_STORAGE_KEY, name)
  } catch {
    // localStorage unavailable — the printer just won't be remembered
  }
}

export async function listPrinters(): Promise<string[]> {
  const qz = await getQz()
  await connect(qz)
  const found = await qz.printers.find()
  return Array.isArray(found) ? found : [found]
}

/** Geometry profile for a printer name (D520 assumed for unknown names). */
function profileFor(name: string): LabelPrinterProfile {
  return (
    PRINTER_PROFILES.find((p) => name.toUpperCase().includes(p.hint.toUpperCase())) ??
    D520_PROFILE
  )
}

/** Saved choice first, then profile hints, then OS default, else picker. */
async function resolvePrinter(qz: Qz): Promise<{ name: string; profile: LabelPrinterProfile }> {
  const saved = getSavedPrinter()
  if (saved) {
    try {
      const name = (await qz.printers.find(saved)) as string
      return { name, profile: profileFor(name) }
    } catch {
      // saved printer gone — fall through to search
    }
  }
  for (const profile of PRINTER_PROFILES) {
    try {
      const name = (await qz.printers.find(profile.hint)) as string
      return { name, profile }
    } catch {
      // not connected — try the next known printer
    }
  }
  try {
    const def = (await qz.printers.getDefault()) as string
    if (def) return { name: def, profile: profileFor(def) }
  } catch {
    // no OS default either
  }
  let all: string[] = []
  try {
    const found = await qz.printers.find()
    all = Array.isArray(found) ? found : [found]
  } catch {
    // even enumeration failed — report with an empty list
  }
  throw new QzError(
    'printer',
    'No se encontró la impresora de etiquetas (D520 / TSP143). Selecciona la impresora.',
    all
  )
}

// ---------------------------------------------------------------------------
// Job submission
// ---------------------------------------------------------------------------

/** Lossless 90° CCW rotation — a pixel permutation, no resampling. */
function rotateCCW(src: HTMLCanvasElement): HTMLCanvasElement {
  const out = document.createElement('canvas')
  out.width = src.height
  out.height = src.width
  const ctx = out.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  ctx.translate(out.width / 2, out.height / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.drawImage(src, -src.width / 2, -src.height / 2)
  return out
}

async function submitBitmap(
  qz: Qz,
  printer: string,
  profile: LabelPrinterProfile,
  canvas: HTMLCanvasElement
): Promise<void> {
  let bitmap = canvas
  let size = { width: profile.widthIn, height: profile.pageHeightIn }
  if (profile.rotateBitmap) {
    bitmap = rotateCCW(canvas)
    size = { width: profile.pageHeightIn, height: profile.widthIn }
  }
  const config = qz.configs.create(printer, {
    units: 'in',
    size,
    margins: 0,
    density: DPI,
    colorType: 'blackwhite',
    interpolation: 'nearest-neighbor',
    scaleContent: false,
  })
  const base64 = bitmap.toDataURL('image/png').split(',')[1]
  try {
    await qz.print(config, [{ type: 'pixel', format: 'image', flavor: 'base64', data: base64 }])
  } catch (e) {
    throw new QzError('print', e instanceof Error ? e.message : 'Error al imprimir con QZ Tray.')
  }
}

/** Connect → resolve printer → render at its width → print 1:1 → remember. */
async function printCanvas(
  render: (widthIn: number) => Promise<HTMLCanvasElement>
): Promise<string> {
  const qz = await getQz()
  await connect(qz)
  const { name, profile } = await resolvePrinter(qz)
  const canvas = await render(profile.widthIn)
  await submitBitmap(qz, name, profile, canvas)
  savePrinter(name)
  return name
}

/** Print a gift card label. Returns the printer it went to. */
export function printGiftCardLabel(card: LabelCard): Promise<string> {
  return printCanvas((widthIn) => renderLabelCanvas(card, widthIn))
}

/**
 * Print the calibration test pattern — registration frames, darkness
 * patches, orientation marker, and a real Code128. Use it when loading new
 * media (e.g. the transparent labels) or provisioning a machine.
 */
export function printTestLabel(): Promise<string> {
  return printCanvas((widthIn) => renderTestCanvas(widthIn))
}
