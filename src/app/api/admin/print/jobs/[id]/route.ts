import { NextRequest, NextResponse } from 'next/server'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'
import { ordersAdminClient } from '@/lib/orders/pipeline'
import { completePrintJob, reprintJob } from '@/lib/print/queue'

/**
 * POST /api/admin/print/jobs/[id]
 *   done     the station confirming the printer accepted the job
 *   failed   the station reporting a QZ / printer error  { error }
 *   reprint  queue a fresh copy (a new row — the trail keeps both)
 *   cancel   give up on a job nobody should chase any more
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const action = String(body.action ?? '')

  if (action === 'done') {
    await completePrintJob(id, { ok: true })
    return NextResponse.json({ ok: true })
  }

  if (action === 'failed') {
    const message = String(body.error ?? 'Error de impresión')
    await completePrintJob(id, { ok: false, error: message })
    return NextResponse.json({ ok: true })
  }

  if (action === 'reprint') {
    const res = await reprintJob(id)
    if (!res.ok) return NextResponse.json({ error: res.error }, { status: 400 })
    return NextResponse.json(res)
  }

  if (action === 'cancel') {
    const now = new Date().toISOString()
    await ordersAdminClient()
      .from('print_jobs')
      .update({
        status: 'cancelled',
        updated_at: now,
        error: `Cancelado por ${ctx.email ?? 'admin'}`,
      })
      .eq('id', id)
      .in('status', ['pending', 'printing', 'failed'])
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
}
