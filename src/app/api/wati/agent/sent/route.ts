import { NextRequest, NextResponse } from 'next/server'
import { authorized, parseSent, isHumanOperator } from '@/lib/wati-agent/webhook'
import { env } from '@/lib/wati-agent/config/env'
import { storeFromEnv } from '@/lib/wati-agent/store'
import { registerTakeover } from '@/lib/wati-agent/handoff'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const e = env()
  if (!authorized(request.url, e.webhookSecret)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const ev = parseSent(await request.json().catch(() => null))
  if (!ev) return NextResponse.json({ ok: true })
  const store = storeFromEnv()
  const apiLabels = await store.getSetting<string[]>('api_operator_labels', [''])
  const conv = await store.getConversation(ev.phone)
  const human = isHumanOperator(ev, e.operatorEmail, apiLabels)
  // Skip the insert when no conversation row exists yet (foreign key).
  if (conv) {
    await store.insertMessage({ phone: ev.phone, wati_message_id: ev.messageId || null, direction: 'out', author: human ? 'human' : 'camila', type: 'text', text: ev.text, media_ref: null, shadow: false }).catch(() => ({ inserted: false }))
  }
  if (human && conv && conv.mode === 'agent') await registerTakeover(store, ev.phone, ev.operatorEmail!)
  return NextResponse.json({ ok: true })
}
