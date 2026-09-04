import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { storeFromEnv } from '@/lib/wati-agent/store'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  const store = storeFromEnv()
  const [enabled, persona_name, api_operator_labels] = await Promise.all([
    store.getSetting('enabled', true),
    store.getSetting('persona_name', 'Camila'),
    store.getSetting<string[]>('api_operator_labels', []),
  ])
  return NextResponse.json({ enabled, persona_name, api_operator_labels })
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied
  const body = await req.json()
  const store = storeFromEnv()
  const updates: Array<Promise<void>> = []
  if ('enabled' in body) updates.push(store.setSetting('enabled', body.enabled))
  if ('persona_name' in body) updates.push(store.setSetting('persona_name', body.persona_name))
  if ('api_operator_labels' in body) updates.push(store.setSetting('api_operator_labels', body.api_operator_labels))
  await Promise.all(updates)
  return NextResponse.json({ ok: true })
}
