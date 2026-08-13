import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  checkRateLimit,
  getClientIdentifier,
  RATE_LIMIT_AUTH,
} from '@/lib/booking/rate-limit'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const ALLOWED_SOURCES = new Set([
  'primera-visita',
  'empresas',
  'club-waitlist',
  'parejas-grupo',
  'referidos',
])

// POST /api/leads — public lead capture from marketing pages.
export async function POST(request: NextRequest) {
  const rl = checkRateLimit(`leads:${getClientIdentifier(request)}`, RATE_LIMIT_AUTH)
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  // Honeypot: bots fill the hidden "website" field.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const source = String(body.source || '')
  const name = String(body.name || '').trim().slice(0, 120)
  const phone = String(body.phone || '').replace(/[^\d+\s-]/g, '').trim().slice(0, 24)
  const email = body.email ? String(body.email).trim().slice(0, 160) : null
  const company = body.company ? String(body.company).trim().slice(0, 160) : null
  const message = body.message ? String(body.message).trim().slice(0, 1000) : null

  if (!ALLOWED_SOURCES.has(source)) {
    return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
  }
  if (!name || phone.replace(/\D/g, '').length < 7) {
    return NextResponse.json(
      { error: 'Nombre y teléfono válido son requeridos' },
      { status: 400 }
    )
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Correo inválido' }, { status: 400 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { error } = await supabase.from('leads').insert({
    source,
    name,
    phone,
    email,
    company,
    message,
    locale: body.locale ? String(body.locale).slice(0, 5) : null,
    path: body.path ? String(body.path).slice(0, 200) : null,
    session_id: body.session_id ? String(body.session_id).slice(0, 64) : null,
    utm_source: body.utm_source ? String(body.utm_source).slice(0, 80) : null,
    utm_medium: body.utm_medium ? String(body.utm_medium).slice(0, 80) : null,
    utm_campaign: body.utm_campaign ? String(body.utm_campaign).slice(0, 120) : null,
    referrer: body.referrer ? String(body.referrer).slice(0, 200) : null,
  })

  if (error) {
    console.error('Lead insert failed:', error)
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
