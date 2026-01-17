import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { Spinner } from '@/components/ui'
import { ServicesList } from '@/components/menu/ServicesList'
import { PROGRAM_IDS } from '@/lib/booking/constants'

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
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section with Image */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <Image
          src="/Tratamientos Corporales.png"
          alt={t('title')}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-dark/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl md:text-5xl font-display font-semibold tracking-wide mb-4">
              {t('title')}
            </h1>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-12 md:py-16 bg-beige">
        <div className="container-spa max-w-3xl text-center">
          <p className="text-lg md:text-xl text-warm-gray-700 leading-relaxed">
            {t('intro')}
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="section">
        <div className="container-spa">
          <Suspense fallback={<Spinner size="lg" className="py-12" />}>
            <ServicesList
              programIds={[PROGRAM_IDS.TRATAMIENTOS_CORPORALES]}
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
