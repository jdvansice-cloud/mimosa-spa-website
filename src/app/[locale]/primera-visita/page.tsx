import { PRIMERA_VISITA_COPY } from '@/content/pages'
import { getOfferByKey } from '@/lib/offers'
import { OfferCard } from '@/components/marketing/OfferCard'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { LeadForm } from '@/components/shared/LeadForm'
import { ReviewsStrip } from '@/components/proof/ReviewsStrip'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 3600

const L = (locale: string) => (locale === 'en' ? 'en' : 'es') as 'es' | 'en'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = L(locale)
  return buildPageMetadata({
    locale,
    path: '/primera-visita',
    title: PRIMERA_VISITA_COPY.heroTitle[l],
    description: PRIMERA_VISITA_COPY.heroSubtitle[l],
  })
}

export default async function PrimeraVisitaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = L(locale)
  const offer = await getOfferByKey('first_visit')

  return (
    <div className="min-h-screen bg-cream">
      <MarketingHero
        imageKey="primera_visita_banner"
        title={PRIMERA_VISITA_COPY.heroTitle[l]}
        subtitle={PRIMERA_VISITA_COPY.heroSubtitle[l]}
      />

      <section className="section">
        <div className="container-spa grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          {/* The offer */}
          <div>
            {offer && <OfferCard offer={offer} locale={locale} />}
            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold text-dark mb-4">
                {PRIMERA_VISITA_COPY.stepsTitle[l]}
              </h2>
              <ol className="space-y-3">
                {PRIMERA_VISITA_COPY.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-gold text-dark text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-dark/80 pt-0.5 text-sm">{step[l]}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Lead capture */}
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-dark mb-6">
              {PRIMERA_VISITA_COPY.formTitle[l]}
            </h2>
            <LeadForm
              source="primera-visita"
              whatsappFollowUp={
                l === 'en'
                  ? 'Hi, I would like my first Mimosa Ritual ($79).'
                  : 'Hola, quiero mi primer Ritual Mimosa ($79).'
              }
            />
          </div>
        </div>
      </section>

      <ReviewsStrip className="bg-beige" />
    </div>
  )
}
