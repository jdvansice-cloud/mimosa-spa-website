import { NextRequest, NextResponse } from 'next/server'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'
import { loadOrder, ordersAdminClient, runPaidOrderPipeline } from '@/lib/orders/pipeline'
import { captureTilopayPayment, refundTilopayPayment, voidTilopayPayment } from '@/lib/payments/tilopay'
import { SITE_URL } from '@/lib/nav'

/**
 * POST /api/admin/orders/[id] — manual recovery actions.
 *  retry     re-run the pipeline (book/capture/post) — the everyday fix
 *  capture   retry only the Tilopay capture after a capture_failed
 *  void      release an authorization (customer never charged)
 *  refund    refund a captured payment (Tilopay leg only — Mindbody cannot
 *            return a Custom-tender sale, so the POS refund is flagged instead)
 *  pos_refund_done  staff confirming that POS refund was recorded
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
  const supabase = ordersAdminClient()
  const loaded = await loadOrder(supabase, id)
  if (!loaded) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const tp = loaded.payments.find(p => p.kind === 'tilopay')
  const now = new Date().toISOString()

  if (action === 'retry') {
    const outcome = await runPaidOrderPipeline(id, SITE_URL || request.nextUrl.origin)
    const refreshed = await loadOrder(supabase, id)
    return NextResponse.json({ ok: outcome.ok, outcome, order: refreshed?.order })
  }

  if (action === 'capture') {
    if (!tp) return NextResponse.json({ error: 'No hay pago con tarjeta en esta orden' }, { status: 400 })
    const res = await captureTilopayPayment(loaded.order.order_number, tp.amount_cents)
    if (!res.ok) return NextResponse.json({ error: 'Tilopay rechazó la captura', raw: res.raw }, { status: 502 })
    await supabase.from('order_payments').update({ status: 'captured', updated_at: now }).eq('id', tp.id)
    await supabase.from('orders')
      .update({ status: 'captured', captured_at: now, failure_code: null, failure_detail: null, updated_at: now })
      .eq('id', id)
    const outcome = await runPaidOrderPipeline(id, SITE_URL || request.nextUrl.origin)
    return NextResponse.json({ ok: outcome.ok, outcome })
  }

  if (action === 'void') {
    if (!tp) return NextResponse.json({ error: 'No hay pago con tarjeta en esta orden' }, { status: 400 })
    const res = await voidTilopayPayment(loaded.order.order_number, tp.amount_cents)
    if (!res.ok) return NextResponse.json({ error: 'Tilopay rechazó la anulación', raw: res.raw }, { status: 502 })
    await supabase.from('order_payments').update({ status: 'voided', updated_at: now }).eq('id', tp.id)
    await supabase.from('orders')
      .update({ status: 'cancelled', cancelled_at: now, updated_at: now })
      .eq('id', id)
    return NextResponse.json({ ok: true })
  }

  if (action === 'refund') {
    if (!tp) return NextResponse.json({ error: 'No hay pago con tarjeta en esta orden' }, { status: 400 })
    const amountCents = Math.min(Number(body.amountCents) || tp.amount_cents, tp.amount_cents)
    const res = await refundTilopayPayment(loaded.order.order_number, amountCents, 2)
    if (!res.ok) return NextResponse.json({ error: 'Tilopay rechazó el reembolso', raw: res.raw }, { status: 502 })
    await supabase.from('order_payments').update({ status: 'refunded', updated_at: now }).eq('id', tp.id)
    await supabase.from('orders')
      .update({
        status: 'refunded',
        updated_at: now,
        // The matching refund has to be recorded at the POS by hand (the API
        // can't return a Custom-tender sale). Never a void: the sale must
        // survive so the document count matches the nota de crédito.
        pos_refund_required: !!loaded.order.mindbody_sale_id,
        notes: [loaded.order.notes, `Reembolso $${(amountCents / 100).toFixed(2)} por ${ctx.email ?? 'admin'}`]
          .filter(Boolean).join(' | '),
      })
      .eq('id', id)

    // Nota de crédito referencing the original CUFE — emitted automatically.
    const { emitCreditNoteForOrder } = await import('@/lib/efactura/emit')
    const nc = await emitCreditNoteForOrder(id, supabase)

    // The Mindbody leg stays manual: a Custom-tender sale can't be returned
    // via API, so staff record the refund at the POS.
    return NextResponse.json({
      ok: true,
      creditNote: nc,
      manualSteps: [
        `Registrar el reembolso de la venta #${loaded.order.mindbody_sale_id ?? ''} en Mindbody (POS) — no anular.`,
        ...(nc.ok && !('skipped' in nc && nc.skipped)
          ? []
          : ['Revisar la nota de crédito en /admin/facturas.']),
      ],
    })
  }

  if (action === 'pos_refund_done') {
    // Staff confirming the refund was recorded at the Mindbody POS. Stored with
    // who and when so the outstanding-work list clears on evidence, not memory.
    await supabase.from('orders')
      .update({ pos_refund_done_at: now, pos_refund_done_by: ctx.email ?? 'admin', updated_at: now })
      .eq('id', id)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
}
