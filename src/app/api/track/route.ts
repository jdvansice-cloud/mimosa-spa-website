import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PANAMA_TZ } from '@/lib/kpis/constants'

// Public first-party analytics collector → web_events (Supabase).
// Strict allowlist + size caps; always returns 204 so the client never retries.

export const dynamic = 'force-dynamic'

const ALLOWED_EVENTS = new Set([
  'page_view',
  'booking_start',
  'booking_step_auth',
  'booking_step_location',
  'booking_step_services',
  'booking_step_addons',
  'booking_step_staff',
  'booking_step_datetime',
  'booking_step_confirm',
  'booking_completed',
  'whatsapp_click',
  'lead_submit',
  'giftshop_view',
  'giftshop_checkout',
  'giftshop_paid',
])

const str = (v: unknown, max: number): string | null =>
  typeof v === 'string' && v.length > 0 ? v.slice(0, max) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const event = str(body?.event, 40)
    const sessionId = str(body?.session_id, 64)
    if (!event || !sessionId || !ALLOWED_EVENTS.has(event)) {
      return new NextResponse(null, { status: 204 })
    }

    const eventDate = new Intl.DateTimeFormat('en-CA', { timeZone: PANAMA_TZ }).format(new Date())
    const locationId = Number(body?.location_id)
    const meta = body?.meta && typeof body.meta === 'object' ? body.meta : null

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )
    await supabase.from('web_events').insert({
      event_date: eventDate,
      event,
      session_id: sessionId,
      path: str(body?.path, 200),
      locale: str(body?.locale, 8),
      device: body?.device === 'mobile' || body?.device === 'desktop' ? body.device : null,
      utm_source: str(body?.utm_source, 80),
      utm_medium: str(body?.utm_medium, 80),
      utm_campaign: str(body?.utm_campaign, 120),
      referrer: str(body?.referrer, 200),
      location_id: Number.isFinite(locationId) ? locationId : null,
      meta: meta && JSON.stringify(meta).length <= 2000 ? meta : null,
    })
  } catch {
    // swallow — analytics must never surface errors to visitors
  }
  return new NextResponse(null, { status: 204 })
}
