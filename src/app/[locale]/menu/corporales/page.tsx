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
  const t = await getTranslations({ locale, namespace: 'menuPages.corporales' })
  return buildPageMetadata({
    locale,
    path: '/menu/corporales',
    title: t('title'),
    description: t('intro'),
  })
}

export default async function CorporalesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'menuPages.corporales' })
  const tDeluxe = await getTranslations({ locale, namespace: 'menuPages.corporalesDeluxe' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const [bannerImage, schemaServices] = await Promise.all([
    getSiteImage('menu_corporales_banner'),
    getVisibleTreatments([
      PROGRAM_IDS.PAQUETES_DELUXE,
      PROGRAM_IDS.TRATAMIENTOS_CORPORALES,
      PROGRAM_IDS.TAI,
    ]),
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
          `${SITE_URL}/${locale}/menu/corporales`
        )}
      />

      {/* Hero Section with Image - compact on mobile */}
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
            <h1 className="text-xl md:text-5xl font-display font-semibold tracking-wide">
              {t('title')}
            </h1>
          </div>
        </div>
      </section>

      {/* Intro Section - compact on mobile */}
      <section className="py-3 md:py-16 bg-beige">
        <div className="container-spa max-w-3xl text-center px-4">
          <p className="text-xs md:text-xl text-warm-gray-700 leading-relaxed">
            {t('intro')}
          </p>
          <div className="mt-3 flex justify-center">
            <RatingBadge />
          </div>
        </div>
      </section>

      {/* Recommended Section - Top Picks from both programs */}
      <section className="py-3 md:py-12">
        <div className="container-spa px-3 md:px-4">
          <ServicesListServer
            programIds={[PROGRAM_IDS.PAQUETES_DELUXE, PROGRAM_IDS.TRATAMIENTOS_CORPORALES]}
            locale={locale}
            onlyTopPicks={true}
          />
        </div>
      </section>

      {/* Divider */}
      <div className="container-spa px-4">
        <hr className="border-beige-300" />
      </div>

      {/* Deluxe Services Section - without top picks */}
      <section className="py-3 md:py-12">
        <div className="container-spa px-3 md:px-4">
          <h2 className="text-lg md:text-2xl font-display font-semibold text-dark mb-4 md:mb-6 text-center">
            {tDeluxe('title')}
          </h2>
          <ServicesListServer
            programIds={[PROGRAM_IDS.PAQUETES_DELUXE]}
            locale={locale}
            showTopPicks={false}
          />
        </div>
      </section>

      {/* Divider */}
      <div className="container-spa px-4">
        <hr className="border-beige-300" />
      </div>

      {/* Regular Corporales Services Section - without top picks */}
      <section className="py-3 md:py-12">
        <div className="container-spa px-3 md:px-4">
          <h2 className="text-lg md:text-2xl font-display font-semibold text-dark mb-4 md:mb-6 text-center">
            {t('title')}
          </h2>
          <ServicesListServer
            programIds={[PROGRAM_IDS.TRATAMIENTOS_CORPORALES]}
            locale={locale}
            showTopPicks={false}
          />
        </div>
      </section>

      {/* TAI rituals (rendered only when the admin has made them visible) */}
      <section className="py-3 md:py-12">
        <div className="container-spa px-3 md:px-4">
          <ServicesListServer
            programIds={[PROGRAM_IDS.TAI]}
            locale={locale}
            showTopPicks={false}
            hideEmptyFallback
          />
        </div>
      </section>

      {/* Social proof */}
      <ReviewsStrip />

      {/* Back to Menu */}
      <section className="pb-6 md:pb-12">
        <div className="container-spa text-center">
          <Link
            href={`/${locale}/menu`}
            className="inline-flex items-center text-gold-600 hover:text-gold-700 font-medium transition-colors text-sm md:text-base"
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
