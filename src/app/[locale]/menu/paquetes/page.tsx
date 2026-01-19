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
  const t = await getTranslations({ locale, namespace: 'menuPages.paquetes' })
  return {
    title: t('title'),
    description: t('intro'),
  }
}

export default async function PaquetesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'menuPages.paquetes' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const bannerImage = await getSiteImage('menu_paquetes_banner')

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section with Image - Compact on mobile */}
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
        </div>
      </section>

      {/* Services List - Compact padding on mobile */}
      <section className="py-3 md:py-12">
        <div className="container-spa px-3 md:px-4">
          <Suspense fallback={<Spinner size="lg" className="py-12" />}>
            <ServicesList
              programIds={[PROGRAM_IDS.PAQUETES_MASAJES]}
              locale={locale}
            />
          </Suspense>
        </div>
      </section>

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
            {tCommon('back')} al Menú
          </Link>
        </div>
      </section>
    </div>
  )
}
