import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Spinner } from '@/components/ui'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'

// Revalidate hourly; tagged caches (site-images/settings/treatments) refresh sooner on admin edits.
export const revalidate = 3600


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gallery' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gallery' })
  
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
          <p className="text-warm-gray mt-5 text-lg max-w-2xl mx-auto leading-relaxed">{t('subtitle')}</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section">
        <div className="container-spa">
          <Suspense fallback={<Spinner size="lg" className="py-12" />}>
            <GalleryGrid locale={locale} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
