'use client'

// Direct-to-printer printing via QZ Tray (https://qz.io). QZ Tray runs on the
// front-desk machine and exposes a local websocket; we hand it the label
// bitmap already rasterized at 203 dpi so no scaling happens anywhere.
//
// Signing: if /api/admin/qz/cert + /sign are configured (env keys present),
// requests are signed and QZ prints silently (the public cert must be
// installed as QZ Tray's override.crt on each machine). Without them QZ
// shows its "Allow" prompt.

import {
  LabelCard,
  LabelPrinterProfile,
  PRINTER_PROFILES,
  D520_PROFILE,
  LABEL_HEIGHT_IN,
} from '@/components/admin/giftcards/labels/types'
import { renderLabelCanvas } from '@/components/admin/giftcards/labels/renderLabelCanvas'

const PRINTER_STORAGE_KEY = 'giftcard-qz-printer'

export class QzError extends Error {
  kind: 'connect' | 'printer' | 'print'
  printers?: string[]
  constructor(kind: QzError['kind'], message: string, printers?: string[]) {
    super(message)
    this.kind = kind
    this.printers = printers
  }
}

type Qz = typeof import('qz-tray')

let qzPromise: Promise<Qz> | null = null

async function getQz(): Promise<Qz> {
  if (!qzPromise) {
    qzPromise = import('qz-tray').then((mod) => {
      const qz = mod.default ?? mod
      // When signing isn't configured (endpoints 404), fall back to
      // anonymous requests by RESOLVING empty — a rejected signature
      // promise makes qz-tray.js abort every call before it is sent.
      qz.security.setCertificatePromise((resolve: (v?: string) => void) => {
        fetch('/api/admin/qz/cert')
          .then((r) => (r.ok ? r.text().then(resolve) : resolve(undefined)))
          .catch(() => resolve(undefined))
      })
      qz.security.setSignatureAlgorithm('SHA512')
      // NOTE: qz-tray 2.2.x requires the resolver-factory form here — despite
      // its typings, returning a Promise directly throws "Promise resolver
      // #<Promise> is not a function" inside qz-tray.js.
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

async function connect(qz: Qz) {
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

export function getSavedPrinter(): string | null {
  try {
    return localStorage.getItem(PRINTER_STORAGE_KEY)
  } catch {
    return null
  }
}

export function savePrinter(name: string) {
  try {
    localStorage.setItem(PRINTER_STORAGE_KEY, name)
  } catch {
    // localStorage unavailable — printer just won't be remembered
  }
}

export async function listPrinters(): Promise<string[]> {
  const qz = await getQz()
  await connect(qz)
  const found = await qz.printers.find()
  return Array.isArray(found) ? found : [found]
}

/** Geometry profile for a resolved printer name (D520 assumed if unknown). */
function profileFor(name: string): LabelPrinterProfile {
  return (
    PRINTER_PROFILES.find((p) => name.toUpperCase().includes(p.hint.toUpperCase())) ??
    D520_PROFILE
  )
}

/** Resolve the target printer: saved choice first, then profile hints, then default. */
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
      // try the next known printer
    }
  }
  try {
    const def = (await qz.printers.getDefault()) as string
    if (def) return { name: def, profile: profileFor(def) }
  } catch {
    // no default printer either — fall through to the picker
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

/**
 * Render the label for the resolved printer and print it 1:1.
 * Returns the printer name.
 */
export async function printGiftCardLabel(card: LabelCard): Promise<string> {
  const qz = await getQz()
  await connect(qz)
  const { name, profile } = await resolvePrinter(qz)

  const canvas = await renderLabelCanvas(card, profile.widthIn)
  const config = qz.configs.create(name, {
    units: 'in',
    size: { width: profile.widthIn, height: profile.pageHeightIn },
    margins: 0,
    density: 203,
    colorType: 'blackwhite',
    interpolation: 'nearest-neighbor',
    scaleContent: false,
  })

  const base64 = canvas.toDataURL('image/png').split(',')[1]
  try {
    await qz.print(config, [{ type: 'pixel', format: 'image', flavor: 'base64', data: base64 }])
  } catch (e) {
    throw new QzError('print', e instanceof Error ? e.message : 'Error al imprimir con QZ Tray.')
  }
  savePrinter(name)
  return name
}

// Re-export for callers that size UI around the label.
export { LABEL_HEIGHT_IN }
