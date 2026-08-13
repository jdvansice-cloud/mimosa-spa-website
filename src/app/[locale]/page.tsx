import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Spinner } from '@/components/ui'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedCategories } from '@/components/home/FeaturedCategories'
import { PromotionsPreview } from '@/components/home/PromotionsPreview'
import { LocationsSection } from '@/components/home/LocationsSection'
import { BookingCTA } from '@/components/home/BookingCTA'
import { getSiteImages } from '@/lib/site-images'
import { getServerSettings, aggregateRating } from '@/lib/settings'
import { daySpaNodes } from '@/lib/schema'
import { JsonLd } from '@/components/seo/JsonLd'
import { ReviewsStrip } from '@/components/proof/ReviewsStrip'
import { GiftingCouplesSection } from '@/components/home/GiftingCouplesSection'
import { FirstVisitBanner } from '@/components/home/FirstVisitBanner'
import { buildPageMetadata } from '@/lib/seo'

// Revalidate hourly; tagged caches (site-images/settings/treatments) refresh sooner on admin edits.
export const revalidate = 3600


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })
  return buildPageMetadata({
    locale,
    path: '',
    title: t('title'),
    description: t('description'),
  })
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [settings, tLoc] = await Promise.all([
    getServerSettings(),
    getTranslations({ locale, namespace: 'home.locations' }),
  ])

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
      <JsonLd
        data={daySpaNodes(settings, {
          costaDelEste: tLoc('costaDelEste.address'),
          sanFrancisco: tLoc('sanFrancisco.address'),
        })}
      />

      {/* Hero Section */}
      <HeroSection heroImage={images.hero_banner} />

      {/* Social proof */}
      <ReviewsStrip className="bg-white" />

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

      {/* Gifting + Couples feature cards */}
      <section className="section bg-cream pt-0">
        <div className="container-spa">
          <GiftingCouplesSection />
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

      {/* First visit offer */}
      <FirstVisitBanner />

      {/* Locations */}
      <section className="section bg-cream">
        <div className="container-spa">
          <LocationsSection
            images={{
              costaDelEste: images.location_costa_del_este,
              sanFrancisco: images.location_san_francisco,
            }}
            ratings={{
              costaDelEste: aggregateRating(settings).cde,
              sanFrancisco: aggregateRating(settings).sfc,
            }}
          />
        </div>
      </section>

      {/* Booking CTA */}
      <BookingCTA />
    </div>
  )
}
