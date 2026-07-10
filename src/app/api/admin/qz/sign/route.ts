import { NextRequest, NextResponse } from 'next/server'
import { createSign } from 'crypto'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'

// Signs QZ Tray print requests (SHA512withRSA) with the private key that
// pairs with QZ_TRAY_CERTIFICATE. Only signs for authenticated admins — the
// signature only authorizes printing on the staff machine's own QZ Tray.
export async function POST(request: NextRequest) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const key = process.env.QZ_TRAY_PRIVATE_KEY
  if (!key) {
    return NextResponse.json({ error: 'QZ signing not configured' }, { status: 404 })
  }
  const toSign = await request.text()
  if (!toSign || toSign.length > 8192) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  const signer = createSign('SHA512')
  signer.update(toSign)
  const signature = signer.sign(key.replace(/\\n/g, '\n'), 'base64')
  return new NextResponse(signature, { headers: { 'Content-Type': 'text/plain' } })
}
