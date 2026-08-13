import { getTranslations } from 'next-intl/server'
import { ServicesListServer } from '@/components/menu/ServicesListServer'
import { PROGRAM_IDS } from '@/lib/booking/constants'
import { buildPageMetadata } from '@/lib/seo'
import Image from 'next/image'
import Link from 'next/link'
import { getSiteImage } from '@/lib/site-images'

// Revalidate hourly; tagged caches (site-images/settings/treatments) refresh sooner on admin edits.
export const revalidate = 3600


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'menuPages.paquetes' })
  return buildPageMetadata({
    locale,
    path: '/menu/paquetes',
    title: t('title'),
    description: t('intro'),
  })
}

// Hardcoded package data from the Mimosa Spa pricing
const PACKAGES = [
  {
    name: 'Masaje Moldeador',
    duration: '45min c/u',
    options: [
      { sessions: 5, price: 299 },
      { sessions: 10, price: 499 },
    ],
  },
  {
    name: 'Masaje Deportivo',
    duration: '45min c/u',
    options: [
      { sessions: 5, price: 299 },
      { sessions: 10, price: 499 },
    ],
  },
  {
    name: 'Mimosa Relax',
    duration: '60min c/u',
    options: [
      { sessions: 5, price: 350 },
      { sessions: 10, price: 599 },
    ],
  },
  {
    name: 'Masaje Detox',
    duration: '60min c/u',
    options: [
      { sessions: 5, price: 350 },
      { sessions: 10, price: 599 },
    ],
  },
  {
    name: 'Mimosa Tai',
    duration: '60min c/u',
    options: [
      { sessions: 5, price: 350 },
      { sessions: 10, price: 599 },
    ],
  },
  {
    name: 'Masaje Piedras Calientes',
    duration: '60min c/u',
    options: [
      { sessions: 5, price: 350 },
      { sessions: 10, price: 599 },
    ],
  },
  {
    name: 'Masaje de Pies Oriental',
    duration: '60min c/u',
    options: [
      { sessions: 5, price: 350 },
      { sessions: 10, price: 599 },
    ],
  },
  {
    name: 'Mimosa Profundo',
    duration: '60min c/u',
    options: [
      { sessions: 5, price: 399 },
      { sessions: 10, price: 750 },
    ],
  },
]

export default async function PaquetesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'menuPages.paquetes' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tHeaders = await getTranslations({ locale, namespace: 'menuPages.paquetes.tableHeaders' })
  const bannerImage = await getSiteImage('menu_paquetes_banner')

  return (
    <div className="min-h-screen bg-cream">
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
        </div>
      </section>

      {/* Packages List */}
      <section className="py-6 md:py-12">
        <div className="container-spa px-3 md:px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Table Header - Desktop only */}
            <div className="hidden md:grid md:grid-cols-[1fr_auto_auto] gap-4 px-6 py-4 bg-beige-100 border-b border-beige-200">
              <span className="font-semibold text-dark">{tHeaders('treatment')}</span>
              <span className="font-semibold text-dark text-center w-32">{tHeaders('sessions')}</span>
              <span className="font-semibold text-dark text-right w-24">{tHeaders('price')}</span>
            </div>

            {/* Package Items */}
            <div className="divide-y divide-beige-100">
              {PACKAGES.map((pkg, index) => (
                <div key={index} className="px-4 md:px-6 py-4 md:py-5">
                  {/* Treatment Name with Duration */}
                  <div className="mb-3 md:mb-0">
                    <h3 className="font-semibold text-dark text-base md:text-lg">
                      {pkg.name}
                    </h3>
                    <span className="text-sm text-warm-gray">({pkg.duration})</span>
                  </div>

                  {/* Options Grid */}
                  <div className="mt-2 md:mt-3 space-y-2">
                    {pkg.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className="flex items-center justify-between md:grid md:grid-cols-[1fr_auto_auto] md:gap-4 py-1"
                      >
                        <span className="md:hidden" />
                        <span className="text-warm-gray text-sm md:text-base md:text-center md:w-32">
                          {option.sessions} sesiones
                        </span>
                        <span className="font-semibold text-gold-600 text-base md:text-lg md:text-right md:w-24">
                          ${option.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Individual session bookings for massage packs (when seeded in admin) */}
      <section className="py-3 md:py-12">
        <div className="container-spa px-3 md:px-4">
          <ServicesListServer
            programIds={[PROGRAM_IDS.PAQUETES_MASAJES]}
            locale={locale}
            showTopPicks={false}
            hideEmptyFallback
          />
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
            {tCommon('backToMenu')}
          </Link>
        </div>
      </section>
    </div>
  )
}
