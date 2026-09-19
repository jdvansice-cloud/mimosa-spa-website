import Link from 'next/link'
import { Check } from 'lucide-react'
import { giftshopAdminClient } from '@/lib/giftshop/data'
import { signOrderNumber } from '@/lib/giftshop/sign'
import { SITE_URL } from '@/lib/nav'
import { thankYouSentence, isSelfDelivery } from '@/lib/giftshop/thankYou'

export const dynamic = 'force-dynamic'
export const metadata = { robots: { index: false, follow: false } }

// Post-payment confirmation. Order details load only with a valid HMAC (?k=).
export default async function GraciasPage({
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
    item_name: string | null
    total_cents: number
    recipient_name: string
    recipient_email: string | null
    recipient_phone: string | null
    delivery_email: boolean
    delivery_whatsapp: boolean
    buyer_email: string
    scheduled_send_at: string | null
    gift_card_id: string | null
  } | null = null
  let giftUrl: string | null = null

  if (o && k && k === signOrderNumber(o)) {
    const supabase = giftshopAdminClient()
    const { data } = await supabase
      .from('gc_orders')
      .select('order_number, status, item_name, total_cents, recipient_name, recipient_email, recipient_phone, delivery_email, delivery_whatsapp, buyer_email, scheduled_send_at, gift_card_id')
      .eq('order_number', o)
      .single()
    order = data
    if (order?.gift_card_id) {
      const { data: card } = await supabase
        .from('gift_cards')
        .select('view_token')
        .eq('id', order.gift_card_id)
        .single()
      if (card?.view_token) giftUrl = `${SITE_URL}/gift/${card.view_token}`
    }
  }

  return (
    <div className="min-h-[70vh] bg-cream flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl shadow-card p-8 md:p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-7 w-7 text-gold-600" />
        </div>
        <h1 className="text-2xl font-display font-semibold text-dark mb-2">
          {en ? 'Payment received!' : '¡Pago recibido!'}
        </h1>
        {order ? (
          <>
            <p className="text-sm text-dark mb-2">{thankYouSentence(order, en ? 'en' : 'es')}</p>
            <p className="text-sm text-warm-gray mb-5">
              {en ? `We sent your receipt to ${order.buyer_email}.` : `Enviamos tu comprobante a ${order.buyer_email}.`}
            </p>
            <div className="bg-beige/60 rounded-xl p-4 text-sm text-left space-y-1 mb-6">
              <div className="flex justify-between">
                <span className="text-warm-gray">{en ? 'Order' : 'Pedido'}</span>
                <span className="font-mono">{order.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray">{order.item_name}</span>
                <span className="font-bold">${(order.total_cents / 100).toFixed(2)}</span>
              </div>
              {order.scheduled_send_at && (
                <div className="flex justify-between">
                  <span className="text-warm-gray">{en ? 'Delivery' : 'Entrega'}</span>
                  <span>
                    {new Date(order.scheduled_send_at).toLocaleDateString(
                      en ? 'en-US' : 'es-PA'
                    )}
                  </span>
                </div>
              )}
            </div>
            {giftUrl && (isSelfDelivery(order) || !order.scheduled_send_at) && (
              <div className="flex flex-col sm:flex-row gap-2 justify-center mb-3">
                <a href={giftUrl} className="btn-primary inline-flex justify-center">
                  {en ? 'View the gift card' : 'Ver la gift card'}
                </a>
                {isSelfDelivery(order) && (
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      en ? `A Mimosa Spa gift for you 🎁 ${giftUrl}` : `Un regalo de Mimosa Spa para ti 🎁 ${giftUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center items-center rounded-full border border-dark/20 px-6 py-3 text-sm font-medium text-dark hover:bg-dark/5"
                  >
                    {en ? 'Send by WhatsApp' : 'Enviar por WhatsApp'}
                  </a>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-warm-gray mb-6">
            {en
              ? 'Your payment was processed. Check your email for the receipt and gift card.'
              : 'Tu pago fue procesado. Revisa tu correo para el comprobante y la gift card.'}
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
