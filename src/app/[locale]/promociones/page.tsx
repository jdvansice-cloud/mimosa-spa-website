import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Spinner } from '@/components/ui'
import { PromotionsList } from '@/components/promotions/PromotionsList'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'promotions' })
  return {
    title: t('title'),
    description: 'Descubre nuestras promociones especiales del mes',
  }
}

export default async function PromotionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  
  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header */}
      <section className="py-16 bg-beige text-center">
        <div className="container-spa">
          <h1 className="title-decorated">PROMOCIONES</h1>
          <p className="text-warm-gray mt-4 text-lg">Enero 2026</p>
        </div>
      </section>

      {/* Promotions List */}
      <section className="section">
        <div className="container-spa">
          <Suspense fallback={<Spinner size="lg" className="py-12" />}>
            <PromotionsList locale={locale} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
