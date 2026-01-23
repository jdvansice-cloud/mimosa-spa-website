import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Spinner } from '@/components/ui'
import { MenuCategories } from '@/components/menu/MenuCategories'
import { getSiteImages } from '@/lib/site-images'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'menu' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // Fetch category images from database
  const categoryImages = await getSiteImages([
    'category_body_treatments',
    'category_facial_treatments',
    'category_giftcards',
    'category_membership',
    'category_promotions',
  ])

  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header */}
      <section className="py-16 bg-beige text-center">
        <div className="container-spa">
          <h1 className="title-decorated">MENU</h1>
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
