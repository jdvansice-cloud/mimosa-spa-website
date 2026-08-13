import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { ServicesListServer } from '@/components/menu/ServicesListServer'
import { PROGRAM_IDS } from '@/lib/booking/constants'
import { getSiteImage } from '@/lib/site-images'
import { getVisibleTreatments } from '@/lib/treatments'
import { RatingBadge } from '@/components/proof/RatingBadge'
import { ReviewsStrip } from '@/components/proof/ReviewsStrip'
import { JsonLd } from '@/components/seo/JsonLd'
import { serviceListSchema } from '@/lib/schema'
import { buildPageMetadata } from '@/lib/seo'
import { SITE_URL } from '@/lib/nav'

// Revalidate hourly; tagged caches (site-images/settings/treatments) refresh sooner on admin edits.
export const revalidate = 3600


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'menuPages.faciales' })
  return buildPageMetadata({
    locale,
    path: '/menu/faciales',
    title: t('title'),
    description: t('intro'),
  })
}

export default async function FacialesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'menuPages.faciales' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const [bannerImage, schemaServices] = await Promise.all([
    getSiteImage('menu_faciales_banner'),
    getVisibleTreatments([PROGRAM_IDS.TRATAMIENTOS_FACIALES]),
  ])

  return (
    <div className="min-h-screen bg-cream">
      <JsonLd
        data={serviceListSchema(
          schemaServices.map((s) => ({
            name: s.service_name,
            description: s.description,
            price: s.price,
          })),
          `${SITE_URL}/${locale}/menu/faciales`
        )}
      />
      {/* Hero Section with Image - Compact on mobile */}
      <section className="relative min-h-[160px] md:min-h-[280px] flex items-center overflow-hidden">
        <Image
          src={bannerImage}
          alt={t('title')}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/45 to-dark/60" />
        <div className="relative w-full flex items-center justify-center py-8">
          <div className="text-center text-white px-4">
            <h1 className="text-xl md:text-5xl font-display font-semibold tracking-wide mb-0 md:mb-4">
              {t('title')}
            </h1>
          </div>
        </div>
      </section>

      {/* Intro Section - Compact on mobile */}
      <section className="py-3 md:py-16 bg-beige">
        <div className="container-spa max-w-3xl text-center px-3 md:px-4">
          <p className="text-xs md:text-xl text-warm-gray-700 leading-relaxed">
            {t('intro')}
          </p>
          <div className="mt-3 flex justify-center">
            <RatingBadge />
          </div>
        </div>
      </section>

      {/* Services List - Compact padding on mobile */}
      <section className="py-3 md:py-12">
        <div className="container-spa px-3 md:px-4">
          <ServicesListServer
            programIds={[PROGRAM_IDS.TRATAMIENTOS_FACIALES]}
            locale={locale}
          />
        </div>
      </section>

      {/* Social proof */}
      <ReviewsStrip />

      {/* Back to Menu */}
      <section className="pb-12">
        <div className="container-spa text-center">
          <Link
            href={`/${locale}/menu`}
            className="inline-flex items-center text-gold-600 hover:text-gold-700 font-medium transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {tCommon('backToMenu')}
          </Link>
        </div>
      </section>
    </div>
  )
}
