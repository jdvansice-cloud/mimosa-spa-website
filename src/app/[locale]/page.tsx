import { Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react'
import { Button, Card, Spinner } from '@/components/ui'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedCategories } from '@/components/home/FeaturedCategories'
import { PromotionsPreview } from '@/components/home/PromotionsPreview'
import { LocationsSection } from '@/components/home/LocationsSection'
import { BookingCTA } from '@/components/home/BookingCTA'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'metadata' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection locale={locale} />

      {/* Featured Categories */}
      <section className="section bg-cream">
        <div className="container-spa">
          <FeaturedCategories locale={locale} />
        </div>
      </section>

      {/* Promotions Preview */}
      <section className="section bg-beige">
        <div className="container-spa">
          <Suspense fallback={<Spinner size="lg" className="py-12" />}>
            <PromotionsPreview locale={locale} />
          </Suspense>
        </div>
      </section>

      {/* Locations */}
      <section className="section bg-cream">
        <div className="container-spa">
          <LocationsSection locale={locale} />
        </div>
      </section>

      {/* Booking CTA */}
      <BookingCTA locale={locale} />
    </div>
  )
}
