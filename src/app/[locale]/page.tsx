import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Spinner } from '@/components/ui'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedCategories } from '@/components/home/FeaturedCategories'
import { PromotionsPreview } from '@/components/home/PromotionsPreview'
import { LocationsSection } from '@/components/home/LocationsSection'
import { BookingCTA } from '@/components/home/BookingCTA'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  await params // Just to consume the param
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Categories */}
      <section className="section bg-cream">
        <div className="container-spa">
          <FeaturedCategories />
        </div>
      </section>

      {/* Promotions Preview */}
      <section className="section bg-beige">
        <div className="container-spa">
          <Suspense fallback={<Spinner size="lg" className="py-12" />}>
            <PromotionsPreview />
          </Suspense>
        </div>
      </section>

      {/* Locations */}
      <section className="section bg-cream">
        <div className="container-spa">
          <LocationsSection />
        </div>
      </section>

      {/* Booking CTA */}
      <BookingCTA />
    </div>
  )
}
