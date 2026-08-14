import { getTranslations } from 'next-intl/server'
import { LocationsSection } from '@/components/home/LocationsSection'
import { getSiteImages } from '@/lib/site-images'
import { getServerSettings, aggregateRating } from '@/lib/settings'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isEn = locale === 'en'
  return buildPageMetadata({
    locale,
    path: '/ubicaciones',
    title: isEn ? 'Our Locations' : 'Nuestras Ubicaciones',
    description: isEn
      ? 'Find Mimosa Spa Retreat in Costa del Este and San Francisco, Panama — addresses, hours, phones and directions.'
      : 'Encuentra Mimosa Spa Retreat en Costa del Este y San Francisco, Panamá — direcciones, horarios, teléfonos y cómo llegar.',
  })
}

export default async function UbicacionesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isEn = locale === 'en'
  const [t, images, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'home.locations' }),
    getSiteImages(['location_costa_del_este', 'location_san_francisco']),
    getServerSettings(),
  ])
  const agg = aggregateRating(settings)

  return (
    <div className="min-h-screen bg-cream">
      <section className="section">
        <div className="container-spa">
          <div className="text-center mb-10 md:mb-14">
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-dark text-balance">
              {t('title')}
            </h1>
            <span className="block h-[2px] w-12 bg-gold mt-5 mx-auto" aria-hidden />
            <p className="text-warm-gray max-w-2xl mx-auto mt-5 leading-relaxed">
              {isEn
                ? 'Two retreats in Panama City — choose the one closest to you.'
                : 'Dos refugios en la Ciudad de Panamá — elige el más cercano a ti.'}
            </p>
          </div>

          <LocationsSection
            hideTitle
            expanded
            showWaze
            images={{
              costaDelEste: images.location_costa_del_este,
              sanFrancisco: images.location_san_francisco,
            }}
            ratings={{ costaDelEste: agg.cde, sanFrancisco: agg.sfc }}
          />
        </div>
      </section>
    </div>
  )
}
