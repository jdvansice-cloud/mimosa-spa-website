import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/auth/require-admin'
import { storeFromEnv } from '@/lib/wati-agent/store'
import { watiFromEnv } from '@/lib/wati-agent/wati-api'
import { performHandoff, resumeAgent } from '@/lib/wati-agent/handoff'
import { env } from '@/lib/wati-agent/config/env'
import type { ClientProfile } from '@/lib/wati-agent/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ phone: string }> },
) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { phone } = await params
  const store = storeFromEnv()
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: messages } = await sb
    .from('wati_agent_messages')
    .select('*')
    .eq('phone', phone)
    .order('created_at', { ascending: true })
    .limit(500)
  return NextResponse.json({
    conversation: await store.getConversation(phone),
    messages: messages ?? [],
    events: await store.eventsFor(phone, 200),
    profile: await store.getProfile(phone),
    logs: await store.recentConversationLogs(phone, 10),
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ phone: string }> },
) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { phone } = await params
  const body = await req.json()
  const { action } = body as { action?: string }
  const store = storeFromEnv()
  const conv = await store.getConversation(phone)
  if (!conv) return NextResponse.json({ error: 'No existe' }, { status: 404 })

  if (action === 'pause') {
    await store.upsertConversation({ phone, mode: 'off' })
  } else if (action === 'resume') {
    await resumeAgent(store, phone)
  } else if (action === 'handoff') {
    await performHandoff({
      store,
      wati: watiFromEnv(),
      conv,
      motivo: 'admin',
      resumen: conv.summary ?? 'Pasado a humano desde el panel',
      shadow: false,
      env: env(),
    })
  } else if (action === 'profile') {
    const patch = (body as { profile?: Record<string, unknown> }).profile
    if (!patch || typeof patch !== 'object') return NextResponse.json({ error: 'perfil inválido' }, { status: 400 })
    const profile = await store.mergeProfile(phone, patch as Partial<ClientProfile>)
    return NextResponse.json({ ok: true, profile })
  } else {
    return NextResponse.json({ error: 'acción inválida' }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
