import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import Anthropic from '@anthropic-ai/sdk'
import fs from 'node:fs'
import path from 'node:path'
import { authorized, parseInbound, shouldDebounceSkip } from '@/lib/wati-agent/webhook'
import { env } from '@/lib/wati-agent/config/env'
import { storeFromEnv } from '@/lib/wati-agent/store'
import { watiFromEnv } from '@/lib/wati-agent/wati-api'
import { gate } from '@/lib/wati-agent/gate'
import { checkTriggers } from '@/lib/wati-agent/triggers'
import { performHandoff, resumeAgent } from '@/lib/wati-agent/handoff'
import { runTurn } from '@/lib/wati-agent/runner'
import { mediaBytesFromStorage } from '@/lib/wati-agent/media-bytes'
import * as mb from '@/lib/wati-agent/tools/mindbody-adapter'

export const dynamic = 'force-dynamic'
export const maxDuration = 60
const DEBOUNCE_MS = 6000

let STYLE_GUIDE = ''
try {
  STYLE_GUIDE = fs.readFileSync(path.join(process.cwd(), 'src/lib/wati-agent/voice/style-guide.md'), 'utf8')
} catch {
  STYLE_GUIDE = ''
}

export async function POST(request: NextRequest) {
  const e = env()
  if (!authorized(request.url, e.webhookSecret)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const body = await request.json().catch(() => null)
  const ev = parseInbound(body)
  if (!ev) return NextResponse.json({ ok: true, ignored: 'no waId' })
  const origin = `${request.nextUrl.protocol}//${request.headers.get('host')}`
  waitUntil(handleInbound(ev, origin).catch(err => console.error('wati-agent inbound failed', err)))
  return NextResponse.json({ ok: true })
}

async function handleInbound(ev: NonNullable<ReturnType<typeof parseInbound>>, origin: string) {
  const e = env()
  const store = storeFromEnv()
  const wati = watiFromEnv()
  let conv = await store.getConversation(ev.phone)
  if (!conv) conv = await store.upsertConversation({ phone: ev.phone, mode: 'agent', client_name: ev.senderName || null, wati_contact_id: ev.contactId, ticket_id: ev.ticketId })
  // Resume after 24 h in human mode with no activity
  if (conv.mode === 'human' && conv.human_since && Date.now() - new Date(conv.human_since).getTime() > 24 * 3600_000) {
    await resumeAgent(store, ev.phone)
    conv = (await store.getConversation(ev.phone))!
  }
  if (ev.owner) return
  const { inserted } = await store.insertMessage({ phone: ev.phone, wati_message_id: ev.messageId || null, direction: 'in', author: 'customer', type: ev.type, text: ev.text, media_ref: ev.mediaRef, shadow: false })
  if (!inserted) return
  const audioCount = ev.type === 'audio' || ev.type === 'voice' ? conv.audio_count + 1 : conv.audio_count
  conv = await store.upsertConversation({ phone: ev.phone, last_inbound_at: new Date().toISOString(), ticket_id: ev.ticketId ?? conv.ticket_id, audio_count: audioCount })
  const enabled = await store.getSetting('enabled', true)
  const g = gate({ globalMode: e.mode, enabledSetting: enabled, whitelist: e.whitelist, phone: ev.phone, conversationMode: conv.mode, owner: ev.owner })
  if (!g.run) {
    await store.logEvent(ev.phone, 'llm', { skipped: g.reason })
    return
  }
  const myId = await store.newestInboundId(ev.phone)
  await new Promise(r => setTimeout(r, DEBOUNCE_MS))
  if (shouldDebounceSkip(await store.newestInboundId(ev.phone), myId!)) return
  if (!g.shadow && e.operatorEmail) await wati.assignOperator(ev.phone, e.operatorEmail)
  const trig = checkTriggers({ type: ev.type, text: ev.text, audioCount })
  if (trig.handoff) {
    if (trig.motivo === 'es_bot' && !g.shadow) await wati.sendText(ev.phone, 'Soy la asistente de Mimosa 🌼 con gusto le comunico con una de mis compañeras.')
    await performHandoff({ store, wati, conv, motivo: trig.motivo, resumen: conv.summary ?? `Cliente envió: ${ev.text ?? ev.type}`, shadow: g.shadow, env: e })
    return
  }
  if ((ev.type === 'audio' || ev.type === 'voice') && audioCount === 1) {
    if (!g.shadow) await wati.sendText(ev.phone, '¿Me lo puede escribir por favor? 🌼')
    await store.insertMessage({ phone: ev.phone, wati_message_id: null, direction: 'out', author: 'camila', type: 'text', text: '¿Me lo puede escribir por favor? 🌼', media_ref: null, shadow: g.shadow })
    return
  }
  await runTurn(ev.phone, g.shadow, { anthropic: new Anthropic(), store, wati, origin, now: new Date(), mediaBytes: mediaBytesFromStorage, mb, styleGuide: STYLE_GUIDE })
}
