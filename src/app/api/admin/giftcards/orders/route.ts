import { NextRequest, NextResponse } from 'next/server'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'
import { giftshopAdminClient } from '@/lib/giftshop/data'

// GET /api/admin/giftcards/orders — online shop orders list.
export async function GET(request: NextRequest) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const qRaw = searchParams.get('q')
  const q = qRaw && /^[A-Za-z0-9-]{1,40}$/.test(qRaw) ? qRaw : null
  const limit = Math.min(Number(searchParams.get('limit') || 100), 500)

  const supabase = giftshopAdminClient()
  let query = supabase
    .from('gc_orders')
    .select(
      'id, order_number, status, item_name, item_kind, total_cents, buyer_name, buyer_email, recipient_name, mindbody_status, tilopay_method, mindbody_tender, email_sent_at, whatsapp_sent_at, scheduled_send_at, gift_card_id, created_at, paid_at, fulfillment_error, mindbody_error'
    )
    .order('created_at', { ascending: false })
    .limit(limit)
  if (status) query = query.eq('status', status)
  if (q) query = query.ilike('order_number', `%${q}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
