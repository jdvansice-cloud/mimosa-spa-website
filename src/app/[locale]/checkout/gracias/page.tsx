import Link from 'next/link'
import { Check, Calendar, Gift, Clock } from 'lucide-react'
import { signOrderNumber } from '@/lib/giftshop/sign'
import { ordersAdminClient } from '@/lib/orders/pipeline'
import { ClearBagOnMount } from '@/components/checkout/ClearBagOnMount'
import { WhatsAppBookingLink } from '@/components/shared/WhatsAppBookingLink'
import { SITE_URL } from '@/lib/nav'
import { thankYouSentence, isSelfDelivery, isPaidStatus, giftForwardUrl } from '@/lib/giftshop/thankYou'

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

  type GcChild = {
    id: string
    order_number: string
    recipient_name: string
    recipient_email: string | null
    recipient_phone: string | null
    delivery_email: boolean
    delivery_whatsapp: boolean
    scheduled_send_at: string | null
    buyer_email: string | null
    gift_card_id: string | null
    item_name: string | null
  }
  let children: GcChild[] = []
  const tokens = new Map<string, string>()

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
      // Children are `<order>-G<n>`; escape LIKE wildcards in the number.
      const prefix = `${o}-G`.replace(/[\\%_]/g, c => `\\${c}`)
      const { data: kids, error: kidsError } = await supabase
        .from('gc_orders')
        .select('id, order_number, status, recipient_name, recipient_email, recipient_phone, delivery_email, delivery_whatsapp, scheduled_send_at, buyer_email, gift_card_id, item_name')
        .like('order_number', `${prefix}%`)
        .order('order_number')
      if (kidsError) console.error('gracias: children query failed', kidsError)
      children = (kids ?? []) as GcChild[]
      const cardIds = children.map(c => c.gift_card_id).filter((x): x is string => !!x)
      if (cardIds.length > 0) {
        const { data: cards } = await supabase
          .from('gift_cards')
          .select('id, view_token, serial')
          .in('id', cardIds)
        for (const c of cards ?? []) if (c.view_token) tokens.set(c.id, c.view_token)
      }
    }
  }

  const confirmation = order?.notes?.match(/MIM-[A-Z0-9]+/)?.[0]
  const services = items.filter(i => i.item_type === 'service')
  const giftCards = items.filter(i => i.item_type === 'gift_card')
  const slot = services[0]?.appointment_start
  const loc = en ? 'en' : 'es'

  // A real order that is not paid yet (authorized, cancelled, expired…):
  // never claim payment and never empty the bag.
  if (!order || !isPaidStatus(order.status)) {
    return (
      <div className="min-h-[70vh] bg-cream flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl shadow-card p-8 md:p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-7 w-7 text-gold-600" />
          </div>
          <h1 className="text-2xl font-display font-semibold text-dark mb-2">
            {en ? 'We are confirming your payment…' : 'Estamos confirmando tu pago…'}
          </h1>
          <p className="text-sm text-warm-gray mb-5">
            {en
              ? 'This can take a minute. Do not pay again — we will email you as soon as it is confirmed.'
              : 'Puede tardar un minuto. No pagues de nuevo — te escribimos por correo apenas se confirme.'}
          </p>
          {order && (
            <div className="bg-beige/60 rounded-xl p-4 text-sm text-left mb-6">
              <div className="flex justify-between">
                <span className="text-warm-gray">{en ? 'Order' : 'Pedido'}</span>
                <span className="font-mono">{order.order_number}</span>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center gap-3">
            <WhatsAppBookingLink
              cta="checkout_confirming"
              variant="link"
              message={
                en
                  ? `Hi, I paid online and my order${order ? ` ${order.order_number}` : ''} is still confirming.`
                  : `Hola, pagué en línea y mi pedido${order ? ` ${order.order_number}` : ''} sigue en confirmación.`
              }
            />
            <Link href={`/${locale}`} className="text-sm text-gold-600 hover:text-gold-700 font-medium inline-flex items-center min-h-[44px]">
              {en ? 'Back to home' : 'Volver al inicio'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
              <div className="space-y-3 mb-4 text-left">
                {children.map(child => {
                  const token = child.gift_card_id ? tokens.get(child.gift_card_id) : undefined
                  const giftUrl = token ? `${SITE_URL}/gift/${token}` : null
                  return (
                    <div key={child.id} className="border border-gold/30 rounded-xl p-4">
                      <p className="text-sm text-dark mb-3 break-words">{thankYouSentence(child, loc)}</p>
                      {token && giftUrl ? (
                        <div className="flex flex-col gap-1">
                          <Link
                            href={`/gift/${token}`}
                            className="text-sm text-gold-600 hover:text-gold-700 font-medium inline-flex items-center min-h-[44px]"
                          >
                            {en ? 'View gift card' : 'Ver gift card'}
                          </Link>
                          {isSelfDelivery(child) && (
                            <a
                              href={giftForwardUrl(giftUrl, loc)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-gold-600 hover:text-gold-700 font-medium inline-flex items-center min-h-[44px]"
                            >
                              {en ? 'Send by WhatsApp' : 'Enviar por WhatsApp'}
                            </a>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-warm-gray">
                          {en ? 'On its way in a few minutes.' : 'Te la enviamos en unos minutos.'}
                        </p>
                      )}
                    </div>
                  )
                })}
                {children.length === 0 && (
                  <p className="text-sm text-dark">
                    {en
                      ? 'Your gift cards are on their way; we send them in a few minutes.'
                      : 'Tus gift cards están en camino; te las enviamos en unos minutos.'}
                  </p>
                )}
                <p className="text-xs text-warm-gray">
                  {en
                    ? 'A receipt for the gift card goes to your email; the invoice is issued when it is redeemed.'
                    : 'Por la gift card recibes un recibo por correo; la factura se emite al canjearla.'}
                </p>
              </div>
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
