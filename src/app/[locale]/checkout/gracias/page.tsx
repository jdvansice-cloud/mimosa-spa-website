import Link from 'next/link'
import { Check, Calendar, Gift } from 'lucide-react'
import { signOrderNumber } from '@/lib/giftshop/sign'
import { ordersAdminClient } from '@/lib/orders/pipeline'
import { ClearBagOnMount } from '@/components/checkout/ClearBagOnMount'

export const dynamic = 'force-dynamic'
export const metadata = { robots: { index: false, follow: false } }

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`

// Unified-order confirmation. Details load only with a valid HMAC (?k=).
export default async function CheckoutGraciasPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ o?: string; k?: string }>
}) {
  const { locale } = await params
  const { o, k } = await searchParams
  const en = locale === 'en'

  let order: {
    order_number: string
    status: string
    buyer_email: string | null
    total_cents: number
    notes: string | null
    location_id: number
  } | null = null
  let items: Array<{
    item_type: string
    name_es: string
    name_en: string | null
    total_cents: number
    appointment_start: string | null
    gc_recipient_name: string | null
  }> = []

  if (o && k && k === signOrderNumber(o)) {
    const supabase = ordersAdminClient()
    const { data } = await supabase
      .from('orders')
      .select('id, order_number, status, buyer_email, total_cents, notes, location_id')
      .eq('order_number', o)
      .single()
    order = data
    if (data) {
      const { data: rows } = await supabase
        .from('order_items')
        .select('item_type, name_es, name_en, total_cents, appointment_start, gc_recipient_name')
        .eq('order_id', data.id)
        .order('sort_order')
      items = rows ?? []
    }
  }

  const confirmation = order?.notes?.match(/MIM-[A-Z0-9]+/)?.[0]
  const services = items.filter(i => i.item_type === 'service')
  const giftCards = items.filter(i => i.item_type === 'gift_card')
  const slot = services[0]?.appointment_start

  return (
    <div className="min-h-[70vh] bg-cream flex items-center justify-center px-4 py-16">
      <ClearBagOnMount
        orderNumber={order?.order_number}
        valueCents={order?.total_cents}
        locale={locale}
      />
      <div className="bg-white rounded-3xl shadow-card p-8 md:p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-7 w-7 text-gold-600" />
        </div>
        <h1 className="text-2xl font-display font-semibold text-dark mb-2">
          {en ? 'Payment received!' : '¡Pago recibido!'}
        </h1>
        {order ? (
          <>
            <p className="text-sm text-warm-gray mb-5">
              {services.length > 0
                ? en
                  ? 'Your appointment is confirmed — we also sent it to your WhatsApp.'
                  : 'Tu cita está confirmada — también la enviamos a tu WhatsApp.'
                : en
                  ? `We sent the receipt to ${order.buyer_email}.`
                  : `Enviamos el comprobante a ${order.buyer_email}.`}
            </p>
            <div className="bg-beige/60 rounded-xl p-4 text-sm text-left space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-warm-gray">{en ? 'Order' : 'Pedido'}</span>
                <span className="font-mono">{order.order_number}</span>
              </div>
              {confirmation && (
                <div className="flex justify-between">
                  <span className="text-warm-gray">{en ? 'Booking' : 'Reserva'}</span>
                  <span className="font-mono">{confirmation}</span>
                </div>
              )}
              {slot && (
                <div className="flex items-center gap-2 text-dark">
                  <Calendar className="h-4 w-4 text-gold-600 shrink-0" />
                  <span className="capitalize">
                    {new Date(slot).toLocaleString(en ? 'en-US' : 'es-PA', {
                      timeZone: 'America/Panama',
                      weekday: 'long', day: 'numeric', month: 'long',
                      hour: 'numeric', minute: '2-digit', hour12: true,
                    })}
                  </span>
                </div>
              )}
              {items.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-warm-gray flex items-center gap-1.5">
                    {i.item_type === 'gift_card' && <Gift className="h-3.5 w-3.5 text-gold-600" />}
                    {en && i.name_en ? i.name_en : i.name_es}
                    {i.gc_recipient_name ? ` · ${i.gc_recipient_name}` : ''}
                  </span>
                  <span>{money(i.total_cents)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-dark/10 pt-2 font-bold">
                <span>Total</span>
                <span>{money(order.total_cents)}</span>
              </div>
            </div>
            {giftCards.length > 0 && (
              <p className="text-xs text-warm-gray mb-4">
                {en
                  ? 'Gift cards are delivered by email (a sales receipt is issued for gift cards — the invoice comes with the service).'
                  : 'Las gift cards se entregan por correo (por la gift card se emite un recibo — la factura se genera con el servicio).'}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-warm-gray mb-6">
            {en
              ? 'Your payment was processed. Check your email for the details.'
              : 'Tu pago fue procesado. Revisa tu correo para los detalles.'}
          </p>
        )}
        <div>
          <Link href={`/${locale}`} className="text-sm text-gold-600 hover:text-gold-700 font-medium">
            {en ? 'Back to home' : 'Volver al inicio'}
          </Link>
        </div>
      </div>
    </div>
  )
}
