import { NextRequest, NextResponse } from 'next/server'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'
import { ordersAdminClient } from '@/lib/orders/pipeline'

// GET /api/admin/orders — unified checkout orders (services + gift cards).
export async function GET(request: NextRequest) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const attention = searchParams.get('attention') === '1'
  const limit = Math.min(Number(searchParams.get('limit') || 100), 500)

  const supabase = ordersAdminClient()
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) query = query.eq('status', status)
  // "Needs attention": any failure, or stuck in-flight (paid but not finished).
  if (attention) query = query.or('failure_code.not.is.null,status.in.(authorized,booked,captured)')

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const orders = (data ?? []) as Array<Record<string, unknown> & { id: string }>
  const ids = orders.map(o => o.id)
  if (ids.length === 0) return NextResponse.json({ data: [] })

  const [itemsRes, paymentsRes] = await Promise.all([
    supabase
      .from('order_items')
      .select('order_id, item_type, name_es, total_cents, appointment_start, gc_serial, mindbody_appointment_ids')
      .in('order_id', ids)
      .order('sort_order'),
    supabase
      .from('order_payments')
      .select('order_id, kind, amount_cents, status, tilopay_tpt, mindbody_tender, gc_barcode')
      .in('order_id', ids),
  ])
  const items = itemsRes.data ?? []
  const payments = paymentsRes.data ?? []

  return NextResponse.json({
    data: orders.map(o => ({
      ...o,
      items: items.filter(i => i.order_id === o.id),
      payments: payments.filter(p => p.order_id === o.id),
    })),
  })
}
