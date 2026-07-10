'use client'

// Direct-to-printer printing via QZ Tray (https://qz.io). QZ Tray runs on the
// front-desk machine and exposes a local websocket; we hand it the label
// bitmap already rasterized at 203 dpi so no scaling happens anywhere.
//
// Signing: if /api/admin/qz/cert + /sign are configured (env keys present),
// requests are signed and QZ prints silently. Without them QZ shows its
// "Allow" prompt once — staff checks "Remember this decision".

import { LABEL_WIDTH_IN, LABEL_HEIGHT_IN } from '@/components/admin/giftcards/labels/types'

const PRINTER_STORAGE_KEY = 'giftcard-qz-printer'
const DEFAULT_PRINTER_HINT = 'TSP143'

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
      'No se pudo conectar con QZ Tray. Verifica que esté instalado y ejecutándose (icono verde junto al reloj).'
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

/** Resolve the target printer: saved choice first, then a TSP143 search. */
async function resolvePrinter(qz: Qz): Promise<string> {
  const saved = getSavedPrinter()
  if (saved) {
    try {
      return (await qz.printers.find(saved)) as string
    } catch {
      // saved printer gone — fall through to search
    }
  }
  try {
    return (await qz.printers.find(DEFAULT_PRINTER_HINT)) as string
  } catch {
    // The Star is the system default at the front desk — same fallback the
    // wash-fold-oms POS uses before giving up.
    try {
      const def = (await qz.printers.getDefault()) as string
      if (def) return def
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
      'No se encontró la impresora Star TSP143. Selecciona la impresora de etiquetas.',
      all
    )
  }
}

/**
 * Print the 203 dpi label canvas 1:1 on the Star TSP143.
 * Returns the resolved printer name.
 */
export async function printLabelCanvas(canvas: HTMLCanvasElement): Promise<string> {
  const qz = await getQz()
  await connect(qz)
  const printer = await resolvePrinter(qz)

  const config = qz.configs.create(printer, {
    units: 'in',
    size: { width: LABEL_WIDTH_IN, height: LABEL_HEIGHT_IN },
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
  savePrinter(printer)
  return printer
}
