import { NextRequest, NextResponse } from 'next/server'
import { importAttendanceFromEmail } from '@/lib/ta/email'

// Daily attendance ingest: the NGTeco TC7 clock emails its Time Card
// report to the spa's Gmail; this cron pulls the attachment and imports
// it (last export wins — see src/lib/ta/import.ts). Runs twice a day so
// whatever send-time is configured on the clock still lands same-day.
// Returns 200 with {configured:false} until the Gmail env vars are set,
// so the cron doesn't page anyone before setup.
export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const summary = await importAttendanceFromEmail()
    if (summary.results.some(r => r.status === 'error')) {
      console.error('attendance-email: import errors', JSON.stringify(summary.results))
    }
    return NextResponse.json(summary)
  } catch (err) {
    console.error('attendance-email cron failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
