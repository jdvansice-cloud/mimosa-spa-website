import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * POST /api/wati/round-robin
 *
 * Called by the WATI chatbot's Webhook node when a customer does not pick a
 * location. Answers whose turn it is so the bot's Condition node can hand the
 * chat to that location's team (WATI Pro has no built-in round robin).
 *
 * Auth:   Authorization: Bearer <WATI_ROUND_ROBIN_SECRET>
 * Body:   { "phone": "50761234567" }   (WATI variable {{phone}})
 * Reply:  { "team": "cde" | "sfc", "reused": boolean }
 *
 * Alternates strictly between the two teams. A phone routed in the last 24 h
 * gets the same team again, so retries don't burn a turn.
 * GET is accepted too (?phone=...) for quick checks from a browser.
 */
export const dynamic = 'force-dynamic'
export const maxDuration = 15

type Team = 'cde' | 'sfc'

// Accepts the secret as a Bearer header or as ?token= (WATI's Webhook node
// makes headers fiddly; a token in the URL is the same pattern as the TV agenda).
function authorized(request: NextRequest): boolean {
  const secret = process.env.WATI_ROUND_ROBIN_SECRET
  if (!secret) return false
  const header = request.headers.get('authorization') || ''
  const bearer = header.replace(/^Bearer\s+/i, '').trim()
  if (bearer === secret) return true
  const token = new URL(request.url).searchParams.get('token')?.trim()
  return token === secret
}

function cleanPhone(raw: unknown): string {
  return String(raw ?? '').replace(/\D/g, '')
}

async function pick(phone: string): Promise<{ team: Team; reused: boolean }> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data, error } = await supabase.rpc('wati_round_robin_next', { p_phone: phone })
  if (error) throw new Error(error.message)
  const row = Array.isArray(data) ? data[0] : data
  if (!row?.team) throw new Error('empty result from wati_round_robin_next')
  return { team: row.team as Team, reused: Boolean(row.reused) }
}

async function handle(request: NextRequest, phoneRaw: unknown) {
  if (!process.env.WATI_ROUND_ROBIN_SECRET) {
    return NextResponse.json({ error: 'WATI_ROUND_ROBIN_SECRET no configurado' }, { status: 503 })
  }
  if (!authorized(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  // WATI sends the raw variable; an unresolved "{{phone}}" or blank still gets
  // a turn so the chat is never left in the default pool. Unknown phones get a
  // unique key so they don't all share one team via the 24 h stickiness.
  const phone = cleanPhone(phoneRaw) || `unknown-${Date.now()}`

  try {
    const result = await pick(phone)
    console.log(`WATI round-robin: ${phone} -> ${result.team}${result.reused ? ' (reused)' : ''}`)
    return NextResponse.json(result)
  } catch (err) {
    console.error('WATI round-robin failed:', err)
    // Never leave the bot hanging: fall back to a fixed team on DB trouble.
    return NextResponse.json({ team: 'sfc', reused: false, fallback: true }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown> = {}
  try {
    body = await request.json()
  } catch {
    /* empty or non-JSON body: handled as unknown phone */
  }
  return handle(request, body.phone ?? body.whatsappNumber ?? body.waId)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  return handle(request, searchParams.get('phone'))
}
