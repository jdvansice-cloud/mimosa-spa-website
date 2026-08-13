import Link from 'next/link'
import { Crown } from 'lucide-react'
import { CLUB_COPY } from '@/content/pages'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { SectionHeader } from '@/components/marketing/SectionHeader'
import { getOffersForPage } from '@/lib/offers'
import { OfferCard } from '@/components/marketing/OfferCard'
import { LeadForm } from '@/components/shared/LeadForm'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 3600

const L = (locale: string) => (locale === 'en' ? 'en' : 'es') as 'es' | 'en'
const PER_MONTH = { es: '/mes', en: '/month' }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = L(locale)
  return buildPageMetadata({
    locale,
    path: '/club-mimosa',
    title: CLUB_COPY.heroTitle[l],
    description: CLUB_COPY.heroSubtitle[l],
  })
}

export default async function ClubMimosaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = L(locale)
  const offers = await getOffersForPage('club-mimosa')
  const tiers = offers.filter((o) => o.key !== 'club_founding')
  const founding = offers.find((o) => o.key === 'club_founding')

  return (
    <div className="min-h-screen bg-cream">
      <MarketingHero
        imageKey="club_banner"
        title={CLUB_COPY.heroTitle[l]}
        subtitle={CLUB_COPY.heroSubtitle[l]}
      />

      {/* Founding banner */}
      {founding && (
        <section className="py-8 bg-dark text-cream">
          <div className="container-spa max-w-3xl text-center">
            <p className="text-gold font-medium text-sm uppercase tracking-widest mb-2">
              {CLUB_COPY.foundingTitle[l]}
            </p>
            <p className="text-lg md:text-xl font-display">
              {l === 'en' ? founding.description_en : founding.description_es}
            </p>
          </div>
        </section>
      )}

      {/* Tiers */}
      <section className="section">
        <div className="container-spa">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {tiers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                locale={locale}
                priceSuffix={PER_MONTH[l]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section bg-beige">
        <div className="container-spa max-w-3xl">
          <SectionHeader title={CLUB_COPY.howTitle[l]} />
          <ol className="space-y-4">
            {CLUB_COPY.how.map((step, i) => (
              <li key={i} className="flex items-start gap-4 bg-white rounded-xl shadow-card p-4">
                <span className="w-8 h-8 rounded-full bg-gold text-dark font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-dark/80 pt-1">{step[l]}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Privilege VIP */}
      <section className="section">
        <div className="container-spa max-w-3xl">
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="w-12 h-12 bg-gold/15 rounded-full flex items-center justify-center flex-shrink-0">
              <Crown className="h-6 w-6 text-gold-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-display font-semibold text-dark mb-1">
                {CLUB_COPY.vipTitle[l]}
              </h2>
              <p className="text-sm text-dark/70">{CLUB_COPY.vipBody[l]}</p>
            </div>
            <Link href={`/${locale}/menu/membresia`} className="btn-secondary whitespace-nowrap">
              {CLUB_COPY.vipCta[l]}
            </Link>
          </div>
        </div>
      </section>

      {/* Founding waitlist */}
      <section className="section bg-beige">
        <div className="container-spa max-w-2xl">
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-dark mb-1">
              {CLUB_COPY.waitlistTitle[l]}
            </h2>
            <p className="text-sm text-warm-gray mb-5">{CLUB_COPY.waitlistIntro[l]}</p>
            <LeadForm
              source="club-waitlist"
              whatsappFollowUp={
                l === 'en'
                  ? 'Hi, I want to be a Club Mimosa founding member.'
                  : 'Hola, quiero ser Miembro Fundador del Club Mimosa.'
              }
            />
          </div>
        </div>
      </section>
    </div>
  )
}
