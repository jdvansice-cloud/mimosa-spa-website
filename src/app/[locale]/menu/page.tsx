import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Spinner } from '@/components/ui'
import { MenuCategories } from '@/components/menu/MenuCategories'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'menu' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default function MenuPage({ params: { locale } }: { params: { locale: string } }) {
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
            <MenuCategories locale={locale} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
