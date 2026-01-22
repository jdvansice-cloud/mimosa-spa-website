import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Spinner } from '@/components/ui'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedCategories } from '@/components/home/FeaturedCategories'
import { PromotionsPreview } from '@/components/home/PromotionsPreview'
import { LocationsSection } from '@/components/home/LocationsSection'
import { BookingCTA } from '@/components/home/BookingCTA'
import { getSiteImages } from '@/lib/site-images'

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

  // Fetch all managed images for home page
  const images = await getSiteImages([
    'hero_banner',
    'category_body_treatments',
    'category_facial_treatments',
    'category_packages',
    'location_costa_del_este',
    'location_san_francisco',
  ])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection heroImage={images.hero_banner} />

      {/* Featured Categories */}
      <section className="section bg-cream">
        <div className="container-spa">
          <FeaturedCategories images={{
            body: images.category_body_treatments,
            facial: images.category_facial_treatments,
            packages: images.category_packages,
          }} />
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
          <LocationsSection images={{
            costaDelEste: images.location_costa_del_este,
            sanFrancisco: images.location_san_francisco,
          }} />
        </div>
      </section>

      {/* Booking CTA */}
      <BookingCTA />
    </div>
  )
}
