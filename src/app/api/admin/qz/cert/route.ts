import { NextResponse } from 'next/server'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'

// Public certificate for QZ Tray request signing. Optional: when the env
// pair QZ_TRAY_CERTIFICATE / QZ_TRAY_PRIVATE_KEY is not configured, the
// client falls back to QZ Tray's unsigned mode (staff approves the site
// once via the QZ "Allow" prompt).
export async function GET() {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const cert = process.env.QZ_TRAY_CERTIFICATE
  if (!cert) {
    return NextResponse.json({ error: 'QZ signing not configured' }, { status: 404 })
  }
  // Support \n-escaped single-line env values (Vercel-friendly).
  return new NextResponse(cert.replace(/\\n/g, '\n'), {
    headers: { 'Content-Type': 'text/plain' },
  })
}
