'use client'

// Shared QZ Tray connection + signing, used by both the gift-card label
// printer and the CAFE receipt printer. One websocket per tab: opening a
// second connection from the same page makes QZ drop jobs.
//
// qz-tray 2.2.x signing: setSignaturePromise MUST use the resolver-factory
// form `(toSign) => (resolve) => {…}` — returning a Promise throws "Promise
// resolver #<Promise> is not a function" (@types/qz-tray wrongly allows it).
// A REJECTED cert/signature promise aborts every call client-side, so always
// RESOLVE — resolving empty falls back to QZ's "Allow" prompt instead of
// failing silently.
//
// Signing backend: /api/admin/qz/cert + /sign (QZ_TRAY_CERTIFICATE /
// QZ_TRAY_PRIVATE_KEY env). Silent printing additionally requires the public
// cert installed as ~/Library/Application Support/qz/override.crt on each
// front-desk machine.

export type Qz = typeof import('qz-tray')

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

let qzPromise: Promise<Qz> | null = null

export function getQz(): Promise<Qz> {
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

export async function connect(qz: Qz): Promise<void> {
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

export async function listPrinters(): Promise<string[]> {
  const qz = await getQz()
  await connect(qz)
  const found = await qz.printers.find()
  return Array.isArray(found) ? found : [found]
}
