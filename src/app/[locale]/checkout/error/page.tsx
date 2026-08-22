import Link from 'next/link'
import { XCircle, Clock } from 'lucide-react'
import { WhatsAppBookingLink } from '@/components/shared/WhatsAppBookingLink'

export const metadata = { robots: { index: false, follow: false } }

export default async function CheckoutErrorPage({
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
    slot: {
      es: 'Justo se ocupó ese horario mientras pagabas — no se te cobró nada. Elige otro horario y vuelve a intentar.',
      en: 'That time was taken while you were paying — you were NOT charged. Pick another time and try again.',
    },
    pending: {
      es: 'Tu reserva quedó creada y estamos confirmando el pago. Te escribimos por WhatsApp en cuanto esté listo — no pagues de nuevo.',
      en: 'Your booking was created and we are confirming the payment. We will message you on WhatsApp shortly — do not pay again.',
    },
    invalid: {
      es: 'No pudimos verificar el pago. Si se te cobró, escríbenos por WhatsApp y lo resolvemos.',
      en: 'We could not verify the payment. If you were charged, message us on WhatsApp and we will sort it out.',
    },
    notfound: {
      es: 'No encontramos el pedido.',
      en: 'We could not find the order.',
    },
  }
  const msg = messages[reason || ''] || messages.declined
  const isPending = reason === 'pending'

  return (
    <div className="min-h-[70vh] bg-cream flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl shadow-card p-8 md:p-10 max-w-md w-full text-center">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${isPending ? 'bg-gold/15' : 'bg-red-50'}`}>
          {isPending ? (
            <Clock className="h-7 w-7 text-gold-600" />
          ) : (
            <XCircle className="h-7 w-7 text-red-500" />
          )}
        </div>
        <h1 className="text-2xl font-display font-semibold text-dark mb-2">
          {isPending
            ? en ? 'Almost there' : 'Casi listo'
            : en ? 'Something went wrong' : 'Algo salió mal'}
        </h1>
        <p className="text-sm text-warm-gray mb-6">{en ? msg.en : msg.es}</p>
        <div className="flex flex-col items-center gap-3">
          {reason === 'slot' ? (
            <Link href={`/${locale}/reservar`} className="btn-primary">
              {en ? 'Choose another time' : 'Elegir otro horario'}
            </Link>
          ) : !isPending ? (
            <Link href={`/${locale}/checkout`} className="btn-primary">
              {en ? 'Try again' : 'Intentar de nuevo'}
            </Link>
          ) : null}
          <WhatsAppBookingLink
            cta="checkout_error"
            variant="link"
            message={
              en
                ? 'Hi, I had a problem paying online.'
                : 'Hola, tuve un problema pagando en línea.'
            }
          />
        </div>
      </div>
    </div>
  )
}
