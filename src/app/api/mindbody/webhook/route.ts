import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { broadcastTvRefresh } from '@/lib/tv/broadcast'

// ===========================================
// POST /api/mindbody/webhook — Mindbody Webhooks API receiver.
//
// Mindbody pushes appointment events here (appointmentBooking.created /
// updated / cancelled, appointmentAddOn.created / deleted) the moment the
// front desk books, confirms, marks arrived, or cancels. We don't trust the
// event payload for state — its `status` only knows Scheduled/Cancelled —
// we just use it as a trigger: broadcast "refresh" over Supabase Realtime
// and the TV boards refetch the live schedule from the Public API.
//
// Setup: scripts/mindbody-webhook.mjs (create → set signature key →
// activate). Mindbody sends a HEAD request when the subscription is
// created and needs a 2xx back; every POST is signed with HMAC-SHA256
// (header X-Mindbody-Signature = "sha256=" + base64(hmac(key, body))).
// Must answer 2xx within 10s or Mindbody retries every 15 min for 3 h.
// ===========================================

export const dynamic = 'force-dynamic'
export const maxDuration = 10

interface WebhookEnvelope {
  messageId?: string
  eventId?: string
  eventSchemaVersion?: number
  eventInstanceOriginationDateTime?: string
  eventData?: {
    siteId?: number
    locationId?: number
    appointmentId?: number
    staffId?: number
    status?: string
    isConfirmed?: boolean
    hasArrived?: boolean
    startDateTime?: string
  }
}

/** Events that change what a therapist sees on the board. */
const TV_EVENT_PREFIXES = ['appointmentBooking.', 'appointmentAddOn.']

/** URL validation ping from Mindbody during subscription creation. */
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}

function signatureMatches(rawBody: string, header: string | null, key: string): boolean {
  if (!header) return false
  const expected = 'sha256=' + createHmac('sha256', key).update(rawBody, 'utf8').digest('base64')
  const a = Buffer.from(expected)
  const b = Buffer.from(header)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: NextRequest) {
  const key = process.env.MINDBODY_WEBHOOK_SIGNATURE_KEY
  if (!key) {
    console.error('mindbody/webhook: MINDBODY_WEBHOOK_SIGNATURE_KEY not configured')
    return NextResponse.json({ error: 'Webhook no configurado' }, { status: 503 })
  }

  const rawBody = await request.text()
  if (!signatureMatches(rawBody, request.headers.get('x-mindbody-signature'), key)) {
    console.warn('mindbody/webhook: bad signature')
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
  }

  let envelope: WebhookEnvelope
  try {
    envelope = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const eventId = envelope.eventId ?? ''
  const data = envelope.eventData ?? {}
  console.log('mindbody/webhook:', eventId, {
    messageId: envelope.messageId,
    appointmentId: data.appointmentId,
    locationId: data.locationId,
    status: data.status,
    isConfirmed: data.isConfirmed,
    hasArrived: data.hasArrived,
    start: data.startDateTime,
  })

  if (TV_EVENT_PREFIXES.some(p => eventId.startsWith(p))) {
    // Fire-and-forget: a failed broadcast must not make Mindbody retry the
    // event — the TV's fallback poll covers it.
    try {
      await broadcastTvRefresh({
        locationId: data.locationId ?? null,
        appointmentId: data.appointmentId ?? null,
        eventId,
      })
    } catch (err) {
      console.error('mindbody/webhook: broadcast failed', err)
    }
  }

  return NextResponse.json({ ok: true })
}
