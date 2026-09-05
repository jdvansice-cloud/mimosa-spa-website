import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { getKnowledge, invalidateKnowledge, TOPIC_KEYS } from '@/lib/wati-agent/knowledge'

function summary(k: Awaited<ReturnType<typeof getKnowledge>>) {
  return {
    builtAt: k.builtAt,
    treatments: k.treatments.length,
    topics: TOPIC_KEYS.length,
    catalogChars: k.catalogText.length,
  }
}

/** Current knowledge snapshot (may be served from the 6h cache). */
export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    return NextResponse.json(summary(await getKnowledge()))
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

/** Drops the cache and rebuilds from Supabase + the site copy. */
export async function POST() {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    invalidateKnowledge()
    return NextResponse.json(summary(await getKnowledge()))
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
