import { NextRequest, NextResponse } from 'next/server'
import { authorized } from '@/lib/wati-agent/webhook'
import { cleanPhone } from '@/lib/wati-agent/phone'
import { env } from '@/lib/wati-agent/config/env'
import { storeFromEnv } from '@/lib/wati-agent/store'
import { resumeAgent } from '@/lib/wati-agent/handoff'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (!authorized(request.url, env().webhookSecret)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const b = await request.json().catch(() => null)
  const phone = cleanPhone(b?.waId)
  const status = String(b?.ticketStatus ?? b?.status ?? b?.statusString ?? '').toUpperCase()
  try {
    if (phone && status === 'SOLVED') {
      const store = storeFromEnv()
      const c = await store.getConversation(phone)
      if (c && c.mode === 'human') await resumeAgent(store, phone)
    }
  } catch (err) {
    console.error('wati-agent status webhook failed', err)
  }
  return NextResponse.json({ ok: true })
}
