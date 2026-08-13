import { getTranslations } from 'next-intl/server'
import { BookingPageContent } from '@/components/booking/BookingPageContent'
import { RatingBadge } from '@/components/proof/RatingBadge'
import { WhatsAppBookingLink } from '@/components/shared/WhatsAppBookingLink'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'booking' })
  return buildPageMetadata({
    locale,
    path: '/reservar',
    title: t('title'),
    description: t('subtitle'),
  })
}

export default async function BookingPage({ params }: { params: Promise<{ locale: string }> }) {
  await params // Resolve params even if not used directly

  const t = await getTranslations('whatsapp')

  return (
    <>
      {/* Proof + WhatsApp strip: desktop only — on mobile the steps bar sits
          directly below the header so the widget gets the full viewport */}
      <div className="hidden sm:flex container-spa pt-6 flex-col items-center gap-3">
        <RatingBadge />
        <div className="flex items-center gap-3 text-sm text-warm-gray">
          <span>{t('bookPrompt')}</span>
          <WhatsAppBookingLink cta="booking_page_strip" variant="link" />
        </div>
      </div>
      <BookingPageContent />
    </>
  )
}
