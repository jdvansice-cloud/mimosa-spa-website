import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { Spinner } from '@/components/ui'
import { ServicesList } from '@/components/menu/ServicesList'
import { PROGRAM_IDS } from '@/lib/booking/constants'
import { getSiteImage } from '@/lib/site-images'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'menuPages.corporales' })
  return {
    title: t('title'),
    description: t('intro'),
  }
}

export default async function CorporalesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'menuPages.corporales' })
  const tDeluxe = await getTranslations({ locale, namespace: 'menuPages.corporalesDeluxe' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const bannerImage = await getSiteImage('menu_corporales_banner')

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section with Image - compact on mobile */}
      <section className="relative h-[12vh] md:h-[30vh] overflow-hidden">
        <Image
          src={bannerImage}
          alt={t('title')}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-dark/50" />
        <div className="absolute inset-0 flex items-center justify-center">
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
        </div>
      </section>

      {/* Recommended Section - Top Picks from both programs */}
      <section className="py-3 md:py-12">
        <div className="container-spa px-3 md:px-4">
          <Suspense fallback={<Spinner size="lg" className="py-12" />}>
            <ServicesList
              programIds={[PROGRAM_IDS.PAQUETES_DELUXE, PROGRAM_IDS.TRATAMIENTOS_CORPORALES]}
              locale={locale}
              onlyTopPicks={true}
            />
          </Suspense>
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
          <Suspense fallback={<Spinner size="lg" className="py-12" />}>
            <ServicesList
              programIds={[PROGRAM_IDS.PAQUETES_DELUXE]}
              locale={locale}
              showTopPicks={false}
              hideTopPicksFromList={true}
            />
          </Suspense>
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
          <Suspense fallback={<Spinner size="lg" className="py-12" />}>
            <ServicesList
              programIds={[PROGRAM_IDS.TRATAMIENTOS_CORPORALES]}
              locale={locale}
              showTopPicks={false}
              hideTopPicksFromList={true}
            />
          </Suspense>
        </div>
      </section>

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
            {tCommon('back')} al Menú
          </Link>
        </div>
      </section>
    </div>
  )
}
