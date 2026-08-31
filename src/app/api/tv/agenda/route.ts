import { NextRequest, NextResponse } from 'next/server'
import { getTvAgenda } from '@/lib/tv/agenda'

/**
 * GET /api/tv/agenda?location=1&date=YYYY-MM-DD&token=...
 *
 * Daily therapist schedule for the work-area TV display. The TV browser
 * can't hold an admin session, so access is gated by TV_AGENDA_TOKEN
 * (a long random string in the display's bookmarked URL).
 */
export const dynamic = 'force-dynamic'
export const maxDuration = 60

function panamaToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Panama' }).format(new Date())
}

export async function GET(request: NextRequest) {
  const expected = process.env.TV_AGENDA_TOKEN
  if (!expected) {
    return NextResponse.json({ error: 'TV_AGENDA_TOKEN no configurado' }, { status: 503 })
  }
  const { searchParams } = new URL(request.url)
  if (searchParams.get('token') !== expected) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const location = Number(searchParams.get('location') || '1')
  if (![1, 2].includes(location)) {
    return NextResponse.json({ error: 'location inválida' }, { status: 400 })
  }
  const date = searchParams.get('date') || panamaToday()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'fecha inválida' }, { status: 400 })
  }

  try {
    return NextResponse.json(await getTvAgenda(date, location))
  } catch (err) {
    console.error('tv/agenda failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
