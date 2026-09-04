import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { storeFromEnv } from '@/lib/wati-agent/store'
import { env } from '@/lib/wati-agent/config/env'

export async function GET(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied
  const days = Number(req.nextUrl.searchParams.get('days') ?? '7') || 7
  const since = new Date(Date.now() - days * 86_400_000).toISOString()
  const stats = await storeFromEnv().stats(since)
  return NextResponse.json({ ...stats, mode: env().mode })
}
