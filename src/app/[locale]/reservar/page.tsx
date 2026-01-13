import { getTranslations } from 'next-intl/server'
import { BookingWidget } from '@/components/booking/BookingWidget'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'booking' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function BookingPage({ params }: { params: Promise<{ locale: string }> }) {
  await params // Resolve params even if not used directly
  
  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header - Compact */}
      <section className="py-4 md:py-6 bg-beige text-center">
        <div className="container-spa">
          <h1 className="text-2xl md:text-3xl font-display font-semibold mb-1">
            Reservar Cita
          </h1>
          <p className="text-sm text-warm-gray">Agenda tu próxima visita</p>
        </div>
      </section>

      {/* Booking Widget */}
      <section className="py-4 md:py-6">
        <div className="container-spa max-w-4xl">
          <BookingWidget />
        </div>
      </section>
    </div>
  )
}
