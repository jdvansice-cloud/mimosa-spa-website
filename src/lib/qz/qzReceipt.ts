'use client'

// CAFE receipt printing through QZ Tray.
//
// The receipt printer (MUNBYN 80 mm, over WiFi) is fed the same way as the
// gift-card labels: a bitmap rendered at the printer's native 203 dpi, with
// every scaling step in QZ disabled, so dots land 1:1 and the DGI QR stays
// scannable. See @/lib/qz/client for the connection and signing contract.
//
// Roll paper has no page height, so each job declares its own — the rendered
// canvas height converted back to inches. Getting this wrong is what makes a
// receipt printer either eject a full page per sale or clip the QR.

import { renderCafeCanvas, RECEIPT_WIDTH_DOTS } from '@/components/admin/print/renderCafeCanvas'
import type { CafeReceiptPayload } from '@/lib/print/types'
import { Qz, QzError, connect, getQz } from '@/lib/qz/client'

export { QzError } from '@/lib/qz/client'

const DPI = 203
const PRINTER_STORAGE_KEY = 'cafe-qz-printer-v1'

/** Substrings matched against QZ printer names, best guess first. */
const RECEIPT_HINTS = ['MUNBYN', 'ITPP', '80mm', 'Receipt', 'POS-80', 'TSP143']

export function getSavedReceiptPrinter(): string | null {
  try {
    return localStorage.getItem(PRINTER_STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveReceiptPrinter(name: string): void {
  try {
    localStorage.setItem(PRINTER_STORAGE_KEY, name)
  } catch {
    // localStorage unavailable — the printer just won't be remembered
  }
}

/**
 * Saved choice first, then the known hints. Deliberately NO fallback to the
 * OS default: on a front-desk Mac that is usually the label printer, and a
 * CAFE silently printed on a 3×2 label is worse than an error message.
 */
async function resolveReceiptPrinter(qz: Qz): Promise<string> {
  const saved = getSavedReceiptPrinter()
  if (saved) {
    try {
      return (await qz.printers.find(saved)) as string
    } catch {
      // saved printer gone — fall through to the hint search
    }
  }
  for (const hint of RECEIPT_HINTS) {
    try {
      return (await qz.printers.find(hint)) as string
    } catch {
      // not this one — try the next known name
    }
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
    'No se encontró la impresora de recibos (MUNBYN). Selecciona la impresora.',
    all
  )
}

/** Print one CAFE. Resolves with the printer name it went to. */
export async function printCafeReceipt(payload: CafeReceiptPayload): Promise<string> {
  const qz = await getQz()
  await connect(qz)
  const printer = await resolveReceiptPrinter(qz)
  const canvas = await renderCafeCanvas(payload)

  const config = qz.configs.create(printer, {
    units: 'in',
    size: { width: RECEIPT_WIDTH_DOTS / DPI, height: canvas.height / DPI },
    margins: 0,
    density: DPI,
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
  saveReceiptPrinter(printer)
  return printer
}
