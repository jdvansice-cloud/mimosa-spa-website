import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { storeFromEnv } from '@/lib/wati-agent/store'
import type { ConversationMode } from '@/lib/wati-agent/types'

export async function GET(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied
  const mode = req.nextUrl.searchParams.get('mode') as ConversationMode | null
  const data = await storeFromEnv().listConversations({ mode: mode || undefined, limit: 200 })
  return NextResponse.json({ data })
}
