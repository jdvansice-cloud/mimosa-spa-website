import { NextRequest, NextResponse } from 'next/server'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'
import { giftshopAdminClient } from '@/lib/giftshop/data'
import { fulfillOrder, deliverOrder } from '@/lib/giftshop/fulfillment'

// POST /api/admin/giftcards/orders/[id] { action }
//   resend        → re-run delivery (emails/WhatsApp)
//   retry_mindbody→ reset registration and re-run fulfillment
//   mark_paid     → operator verified the payment in the Tilopay portal
//                   (lost-redirect case); requires typing the tpt id
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const action = body.action as string
  const supabase = giftshopAdminClient()

  const { data: order } = await supabase.from('gc_orders').select('id, status').eq('id', id).single()
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  try {
    if (action === 'resend') {
      await supabase
        .from('gc_orders')
        .update({ email_sent_at: null, whatsapp_sent_at: null })
        .eq('id', id)
      await deliverOrder(id)
      return NextResponse.json({ ok: true })
    }

    if (action === 'retry_mindbody') {
      await supabase.from('gc_orders').update({ mindbody_status: 'pending' }).eq('id', id)
      await fulfillOrder(id)
      return NextResponse.json({ ok: true })
    }

    if (action === 'mark_paid') {
      if (order.status !== 'pending' && order.status !== 'payment_failed') {
        return NextResponse.json({ error: `Order is ${order.status}` }, { status: 400 })
      }
      const tpt = String(body.tpt || '').trim()
      if (!tpt) {
        return NextResponse.json(
          { error: 'Se requiere el id de transacción de Tilopay (tpt)' },
          { status: 400 }
        )
      }
      await supabase
        .from('gc_orders')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          tilopay_tpt: tpt,
          tilopay_description: 'Verificado manualmente en el portal Tilopay',
        })
        .eq('id', id)
      await fulfillOrder(id)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Action failed' },
      { status: 500 }
    )
  }
}
