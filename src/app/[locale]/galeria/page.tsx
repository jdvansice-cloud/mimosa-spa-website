import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Spinner } from '@/components/ui'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'gallery' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default function GalleryPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header */}
      <section className="py-16 bg-beige text-center">
        <div className="container-spa">
          <h1 className="title-decorated">GALERÍA</h1>
          <p className="text-warm-gray mt-4 text-lg">Descubre nuestros espacios</p>
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
