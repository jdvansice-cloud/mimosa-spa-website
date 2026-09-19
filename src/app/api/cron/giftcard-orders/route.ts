import { NextRequest, NextResponse } from 'next/server'
import { giftshopAdminClient, getShopSettings } from '@/lib/giftshop/data'
import { fulfillOrder, deliverOrder } from '@/lib/giftshop/fulfillment'

// Reconciliation cron for the online gift-card shop:
// (a) complete stuck paid orders, (b) send due scheduled deliveries,
// (c) retry failed Mindbody registrations, (d) expire abandoned orders.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = giftshopAdminClient()
  const now = Date.now()
  const summary = { refulfilled: 0, scheduledSent: 0, whatsappSent: 0, mindbodyRetried: 0, abandoned: 0, flagged: 0 }

  // (a) paid > 5 min and not fulfilled → re-run pipeline
  const fiveMinAgo = new Date(now - 5 * 60 * 1000).toISOString()
  const { data: stuck } = await supabase
    .from('gc_orders')
    .select('id')
    .eq('status', 'paid')
    .lte('paid_at', fiveMinAgo)
    .limit(25)
  for (const o of stuck || []) {
    try {
      await fulfillOrder(o.id)
      summary.refulfilled++
    } catch (e) {
      console.error('cron fulfill failed', o.id, e)
    }
  }

  // (b) scheduled deliveries now due (fulfilled but never emailed)
  const { data: due } = await supabase
    .from('gc_orders')
    .select('id')
    .eq('status', 'fulfilled')
    .is('email_sent_at', null)
    .lte('scheduled_send_at', new Date(now).toISOString())
    .limit(25)
  for (const o of due || []) {
    try {
      await deliverOrder(o.id)
      summary.scheduledSent++
    } catch (e) {
      console.error('cron delivery failed', o.id, e)
    }
  }

  // (f) WhatsApp deliveries that were waiting for the template approval:
  // exactly one automatic attempt per order once the setting is on. A failed
  // attempt writes whatsapp_error and is left for manual follow-up in
  // /admin/giftcards/orders (the buyer's receipt carries the forward link).
  const settings = await getShopSettings()
  if (settings.whatsapp_delivery_enabled) {
    const nowIso = new Date(now).toISOString()
    const { data: waPending } = await supabase
      .from('gc_orders')
      .select('id')
      .eq('status', 'fulfilled')
      .eq('delivery_whatsapp', true)
      .not('recipient_phone', 'is', null)
      .is('whatsapp_sent_at', null)
      .is('whatsapp_error', null)
      .or(`scheduled_send_at.is.null,scheduled_send_at.lte.${nowIso}`)
      .limit(20)
    for (const o of waPending || []) {
      try {
        await deliverOrder(o.id)
        summary.whatsappSent++
      } catch (e) {
        console.error('cron whatsapp delivery failed', o.id, e)
      }
    }
  }

  // (c) retry failed Mindbody registrations (≤5 attempts) via full pipeline
  const { data: mbFailed } = await supabase
    .from('gc_orders')
    .select('id')
    .eq('status', 'fulfilled')
    .eq('mindbody_status', 'failed')
    .lt('mindbody_attempts', 5)
    .limit(10)
  for (const o of mbFailed || []) {
    try {
      await supabase.from('gc_orders').update({ mindbody_status: 'pending' }).eq('id', o.id)
      await fulfillOrder(o.id)
      summary.mindbodyRetried++
    } catch (e) {
      console.error('cron mindbody retry failed', o.id, e)
    }
  }

  // (d) pending > 24h → abandoned
  const dayAgo = new Date(now - 24 * 3600 * 1000).toISOString()
  const { data: old } = await supabase
    .from('gc_orders')
    .update({ status: 'abandoned', updated_at: new Date().toISOString() })
    .eq('status', 'pending')
    .lte('created_at', dayAgo)
    .select('id')
  summary.abandoned = old?.length ?? 0

  // (e) flag paid > 1h unfulfilled (should never happen after (a))
  const hourAgo = new Date(now - 3600 * 1000).toISOString()
  const { count } = await supabase
    .from('gc_orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'paid')
    .lte('paid_at', hourAgo)
  summary.flagged = count ?? 0
  if (summary.flagged > 0) {
    console.error(`ALERT: ${summary.flagged} paid gift-card orders unfulfilled > 1h`)
  }

  return NextResponse.json({ ok: true, ...summary })
}
