import Link from 'next/link'
import { Gift } from 'lucide-react'
import { PAREJAS_COPY, OCCASIONS } from '@/content/pages'
import { getOffersForPage, offerName } from '@/lib/offers'
import { getSiteImages } from '@/lib/site-images'
import { PROGRAM_IDS } from '@/lib/booking/constants'
import { ServicesListServer } from '@/components/menu/ServicesListServer'
import { OfferCard } from '@/components/marketing/OfferCard'
import { SectionHeader } from '@/components/marketing/SectionHeader'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { LeadForm } from '@/components/shared/LeadForm'
import { WhatsAppBookingLink } from '@/components/shared/WhatsAppBookingLink'
import { ReviewsStrip } from '@/components/proof/ReviewsStrip'
import { JsonLd } from '@/components/seo/JsonLd'
import { serviceListSchema } from '@/lib/schema'
import { buildPageMetadata } from '@/lib/seo'
import { GIFT_CARDS_PATH, SITE_URL } from '@/lib/nav'

export const revalidate = 3600

const L = (locale: string) => (locale === 'en' ? 'en' : 'es') as 'es' | 'en'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = L(locale)
  return buildPageMetadata({
    locale,
    path: '/parejas',
    title: PAREJAS_COPY.heroTitle[l],
    description: PAREJAS_COPY.heroSubtitle[l],
  })
}

export default async function ParejasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = L(locale)
  const offers = await getOffersForPage('parejas')
  const images = await getSiteImages(offers.map((o) => o.image_key || '').filter(Boolean))

  return (
    <div className="min-h-screen bg-cream">
      <JsonLd
        data={serviceListSchema(
          offers.map((o) => ({
            name: offerName(o, locale),
            description: o.description_es,
            price: o.price,
          })),
          `${SITE_URL}/${locale}/parejas`
        )}
      />

      <MarketingHero
        imageKey="parejas_banner"
        title={PAREJAS_COPY.heroTitle[l]}
        subtitle={PAREJAS_COPY.heroSubtitle[l]}
      />

      {/* Rituals from marketing_offers */}
      <section className="section">
        <div className="container-spa">
          <SectionHeader
            eyebrow={l === 'en' ? 'For two' : 'Para dos'}
            title={PAREJAS_COPY.ritualsTitle[l]}
            lede={PAREJAS_COPY.ritualsIntro[l]}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                locale={locale}
                imageUrl={offer.image_key ? images[offer.image_key] : undefined}
                featured={!!offer.badge_es}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Couples menu from Mindbody programs 11 + 21 */}
      <section className="section bg-beige">
        <div className="container-spa max-w-5xl">
          <SectionHeader
            eyebrow={l === 'en' ? 'Classics' : 'Clásicos'}
            title={PAREJAS_COPY.menuTitle[l]}
          />
          <ServicesListServer
            programIds={[PROGRAM_IDS.TRATAMIENTOS_PAREJAS, PROGRAM_IDS.PAREJAS]}
            locale={locale}
            showTopPicks={false}
          />
        </div>
      </section>

      {/* Occasions */}
      <section className="section">
        <div className="container-spa">
          <SectionHeader
            eyebrow={l === 'en' ? 'Celebrate' : 'Celebra'}
            title={PAREJAS_COPY.occasionsTitle[l]}
            lede={PAREJAS_COPY.occasionsIntro[l]}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {OCCASIONS.map((occ) => (
              <div
                key={occ.key}
                className="bg-white rounded-2xl shadow-card hover:shadow-elevated transition-shadow duration-300 p-6 md:p-7 flex flex-col"
              >
                <h3 className="font-display text-xl font-semibold text-dark mb-2">
                  {occ.name[l]}
                </h3>
                <p className="text-sm text-dark/70 leading-relaxed mb-5 flex-1">
                  {occ.description[l]}
                </p>
                <WhatsAppBookingLink cta={`occasion_${occ.key}`} message={occ.whatsapp[l]} />
              </div>
            ))}
          </div>

          {/* Group inquiry */}
          <div className="max-w-2xl mx-auto mt-14 bg-white rounded-2xl shadow-card p-6 md:p-9">
            <SectionHeader
              align="left"
              title={PAREJAS_COPY.groupFormTitle[l]}
              lede={PAREJAS_COPY.groupFormIntro[l]}
              className="mb-6 md:mb-7"
            />
            <LeadForm
              source="parejas-grupo"
              withMessage
              whatsappFollowUp={
                l === 'en'
                  ? 'Hi, I just sent my details about a group occasion.'
                  : 'Hola, acabo de enviar mis datos sobre una ocasión en grupo.'
              }
            />
          </div>
        </div>
      </section>

      {/* Gifting cross-link */}
      <section className="section bg-dark">
        <div className="container-spa max-w-2xl text-center">
          <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-5">
            <Gift className="h-6 w-6 text-gold" />
          </div>
          <SectionHeader
            tone="light"
            title={PAREJAS_COPY.giftTitle[l]}
            lede={PAREJAS_COPY.giftBody[l]}
            className="mb-7"
          />
          <Link href={`/${locale}${GIFT_CARDS_PATH}`} className="btn-primary inline-flex">
            Gift Cards
          </Link>
        </div>
      </section>

      <ReviewsStrip />
    </div>
  )
}
