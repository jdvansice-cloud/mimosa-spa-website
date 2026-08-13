import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Spinner } from '@/components/ui'
import { MenuCategories } from '@/components/menu/MenuCategories'
import { getSiteImages } from '@/lib/site-images'
import { RatingBadge } from '@/components/proof/RatingBadge'
import { buildPageMetadata } from '@/lib/seo'

// Revalidate hourly; tagged caches (site-images/settings/treatments) refresh sooner on admin edits.
export const revalidate = 3600


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'menu' })
  return buildPageMetadata({
    locale,
    path: '/menu',
    title: t('title'),
    description: t('subtitle'),
  })
}

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'menu' })

  // Fetch category images from database
  const categoryImages = await getSiteImages([
    'category_body_treatments',
    'category_facial_treatments',
    'category_parejas',
    'category_packages',
    'category_giftcards',
    'category_membership',
    'category_promotions',
  ])

  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header */}
      <section className="py-16 bg-beige text-center">
        <div className="container-spa">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-600 mb-4">
            Mimosa Spa Retreat
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-dark text-balance">{t('title')}</h1>
          <span className="block h-[2px] w-12 bg-gold mt-5 mx-auto" aria-hidden />
          <div className="mt-5 flex justify-center">
            <RatingBadge />
          </div>
        </div>
      </section>

      {/* Menu Content */}
      <section className="section">
        <div className="container-spa">
          <Suspense fallback={<Spinner size="lg" className="py-12" />}>
            <MenuCategories locale={locale} categoryImages={categoryImages} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
