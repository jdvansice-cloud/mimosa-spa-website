import Link from 'next/link'
import { XCircle } from 'lucide-react'
import { WhatsAppBookingLink } from '@/components/shared/WhatsAppBookingLink'

export const metadata = { robots: { index: false, follow: false } }

export default async function GiftErrorPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ reason?: string; o?: string }>
}) {
  const { locale } = await params
  const { reason } = await searchParams
  const en = locale === 'en'

  const messages: Record<string, { es: string; en: string }> = {
    declined: {
      es: 'El pago no fue aprobado. Puedes intentar de nuevo con otra tarjeta o con Yappy.',
      en: 'The payment was not approved. You can try again with another card or Yappy.',
    },
    invalid: {
      es: 'No pudimos verificar el pago. Si se te cobró, escríbenos por WhatsApp y lo resolvemos.',
      en: 'We could not verify the payment. If you were charged, message us on WhatsApp and we will sort it out.',
    },
    refunded: {
      es: 'Este pedido fue reembolsado.',
      en: 'This order was refunded.',
    },
    notfound: {
      es: 'No encontramos el pedido.',
      en: 'We could not find the order.',
    },
  }
  const msg = messages[reason || ''] || messages.declined

  return (
    <div className="min-h-[70vh] bg-cream flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl shadow-card p-8 md:p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="h-7 w-7 text-red-500" />
        </div>
        <h1 className="text-2xl font-display font-semibold text-dark mb-2">
          {en ? 'Something went wrong' : 'Algo salió mal'}
        </h1>
        <p className="text-sm text-warm-gray mb-6">{en ? msg.en : msg.es}</p>
        <div className="flex flex-col items-center gap-3">
          <Link href={`/${locale}/giftcards`} className="btn-primary">
            {en ? 'Try again' : 'Intentar de nuevo'}
          </Link>
          <WhatsAppBookingLink
            cta="giftshop_error"
            variant="link"
            message={
              en
                ? 'Hi, I had a problem buying a gift card online.'
                : 'Hola, tuve un problema comprando una gift card en línea.'
            }
          />
        </div>
      </div>
    </div>
  )
}
