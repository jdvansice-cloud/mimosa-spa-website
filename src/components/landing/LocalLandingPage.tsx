import Link from 'next/link'
import { MapPin, Check } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { LandingContent } from '@/content/landings'
import { getServerSettings, aggregateRating } from '@/lib/settings'
import { ServicesListServer } from '@/components/menu/ServicesListServer'
import { WhatsAppBookingLink } from '@/components/shared/WhatsAppBookingLink'
import { RatingBadge, Stars } from '@/components/proof/RatingBadge'
import { ReviewsStrip } from '@/components/proof/ReviewsStrip'
import { getSiteImage } from '@/lib/site-images'
import { FEATURES } from '@/lib/nav'
import Image from 'next/image'
import { SectionHeader } from '@/components/marketing/SectionHeader'

const L = (locale: string) => (locale === 'en' ? 'en' : 'es') as 'es' | 'en'

// Shared server template for the local-SEO landing pages.
export async function LocalLandingPage({
  content,
  locale,
}: {
  content: LandingContent
  locale: string
}) {
  const l = L(locale)
  const heroKey =
    content.location === 'cde'
      ? 'location_costa_del_este'
      : content.location === 'sfc'
        ? 'location_san_francisco'
        : content.slug.includes('parejas')
          ? 'parejas_banner'
          : 'category_body_treatments'
  const [settings, tHome, tNav, heroImage] = await Promise.all([
    getServerSettings(),
    getTranslations({ locale, namespace: 'home.locations' }),
    getTranslations({ locale, namespace: 'navigation' }),
    getSiteImage(heroKey),
  ])

  const agg = aggregateRating(settings)
  const locations = [
    content.location !== 'sfc' && {
      name: tHome('costaDelEste.name'),
      address: tHome('costaDelEste.address'),
      phone: settings.phone_costa_del_este,
      mapUrl: 'https://maps.app.goo.gl/5iX28mGH2mxUiJJ1A',
      rating: agg.cde,
    },
    content.location !== 'cde' && {
      name: tHome('sanFrancisco.name'),
      address: tHome('sanFrancisco.address'),
      phone: settings.phone_san_francisco,
      mapUrl: 'https://maps.app.goo.gl/sgT9VCx6DZBoy5wn6',
      rating: agg.sfc,
    },
  ].filter(Boolean) as {
    name: string
    address: string
    phone: string
    mapUrl: string
    rating: { rating: number; count: number; url: string } | null
  }[]

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative min-h-[300px] md:min-h-[380px] flex items-center overflow-hidden">
        {heroImage && (
          <Image src={heroImage} alt="" fill priority className="object-cover" sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/50 to-dark/70" />
        <div className="relative container-spa w-full py-14 text-center text-cream">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold mb-4">
            Mimosa Spa Retreat
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-balance max-w-3xl mx-auto">
            {content.h1[l]}
          </h1>
          <div className="mt-5 flex justify-center">
            <RatingBadge tone="light" />
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href={`/${locale}/reservar`} className="btn-primary">
              {tNav('book')}
            </Link>
            <WhatsAppBookingLink cta={`landing_${content.slug}`} />
          </div>
        </div>
      </section>

      {/* Intro copy */}
      <section className="section">
        <div className="container-spa max-w-3xl">
          {content.intro.map((p, i) => (
            <p key={i} className="text-dark/80 leading-relaxed mb-4">
              {p[l]}
            </p>
          ))}
          <ul className="mt-6 space-y-2">
            {content.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-dark/80">
                <Check className="h-5 w-5 text-gold-600 flex-shrink-0 mt-0.5" />
                {h[l]}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Embedded services */}
      <section className="section bg-beige">
        <div className="container-spa">
          <SectionHeader title={content.servicesTitle[l]} />
          <ServicesListServer
            programIds={content.programIds}
            locale={locale}
            showTopPicks={false}
          />
        </div>
      </section>

      {/* NAP */}
      <section className="section">
        <div className="container-spa max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {locations.map((loc) => (
              <div key={loc.name} className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gold-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-display font-semibold text-dark">
                      Mimosa Spa Retreat — {loc.name}
                    </h3>
                    {loc.rating && loc.rating.count > 0 && (
                      <a
                        href={loc.rating.url || loc.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1.5 text-sm text-dark/70 hover:text-gold-700"
                      >
                        <Stars rating={loc.rating.rating} size="h-3.5 w-3.5" />
                        <span className="font-medium">
                          {loc.rating.rating.toFixed(1)} ({loc.rating.count})
                        </span>
                      </a>
                    )}
                    <p className="text-sm text-dark/70 mt-1">{loc.address}</p>
                    <p className="text-sm text-dark/70">+507 {loc.phone.replace(/^\+?507\s?/, '')}</p>
                    <a
                      href={loc.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gold-600 hover:text-gold-700 font-medium mt-2 inline-block"
                    >
                      Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ (on-page only, no FAQPage schema) */}
      <section className="section bg-beige">
        <div className="container-spa max-w-3xl">
          {content.faqs.map((f, i) => (
            <div key={i} className="mb-6">
              <h3 className="font-display font-semibold text-dark text-lg mb-2">{f.q[l]}</h3>
              <p className="text-dark/70 leading-relaxed">{f.a[l]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <section className="py-10">
        <div className="container-spa max-w-3xl flex flex-wrap gap-3 justify-center text-sm">
          <Link href={`/${locale}/menu`} className="text-gold-600 hover:text-gold-700 font-medium">
            {tNav('menu')}
          </Link>
          {FEATURES.parejas && (
            <>
              <span className="text-warm-gray">·</span>
              <Link href={`/${locale}/parejas`} className="text-gold-600 hover:text-gold-700 font-medium">
                {tNav('couples')}
              </Link>
            </>
          )}
          <span className="text-warm-gray">·</span>
          <Link href={`/${locale}/promociones`} className="text-gold-600 hover:text-gold-700 font-medium">
            {tNav('promotions')}
          </Link>
          <span className="text-warm-gray">·</span>
          <Link href={`/${locale}/reservar`} className="text-gold-600 hover:text-gold-700 font-medium">
            {tNav('book')}
          </Link>
        </div>
      </section>

      <ReviewsStrip />
    </div>
  )
}
