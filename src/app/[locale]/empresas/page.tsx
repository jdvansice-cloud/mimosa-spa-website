import { Gift, Armchair, PartyPopper } from 'lucide-react'
import { EMPRESAS_COPY } from '@/content/pages'
import { MarketingHero } from '@/components/marketing/MarketingHero'
import { SectionHeader } from '@/components/marketing/SectionHeader'
import { LeadForm } from '@/components/shared/LeadForm'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 3600

const L = (locale: string) => (locale === 'en' ? 'en' : 'es') as 'es' | 'en'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = L(locale)
  return buildPageMetadata({
    locale,
    path: '/empresas',
    title: EMPRESAS_COPY.heroTitle[l],
    description: EMPRESAS_COPY.heroSubtitle[l],
  })
}

export default async function EmpresasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = L(locale)

  const blocks = [
    { icon: Gift, title: EMPRESAS_COPY.giftingTitle[l], body: EMPRESAS_COPY.giftingBody[l] },
    { icon: Armchair, title: EMPRESAS_COPY.wellnessTitle[l], body: EMPRESAS_COPY.wellnessBody[l] },
    { icon: PartyPopper, title: EMPRESAS_COPY.eventsTitle[l], body: EMPRESAS_COPY.eventsBody[l] },
  ]

  return (
    <div className="min-h-screen bg-cream">
      <MarketingHero
        imageKey="empresas_banner"
        title={EMPRESAS_COPY.heroTitle[l]}
        subtitle={EMPRESAS_COPY.heroSubtitle[l]}
      />

      {/* Offer blocks */}
      <section className="section">
        <div className="container-spa">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {blocks.map((b) => (
              <div
                key={b.title}
                className="bg-white rounded-2xl shadow-card hover:shadow-elevated transition-shadow duration-300 p-7"
              >
                <div className="w-12 h-12 bg-gold/15 rounded-full flex items-center justify-center mb-5">
                  <b.icon className="h-5 w-5 text-gold-600" />
                </div>
                <h2 className="font-display text-xl font-semibold text-dark mb-2.5">
                  {b.title}
                </h2>
                <p className="text-sm text-dark/70 leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry */}
      <section className="section bg-beige">
        <div className="container-spa max-w-2xl">
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-9">
            <SectionHeader
              align="left"
              title={EMPRESAS_COPY.formTitle[l]}
              lede={EMPRESAS_COPY.formIntro[l]}
              className="mb-6 md:mb-7"
            />
            <LeadForm
              source="empresas"
              corporate
              withMessage
              whatsappFollowUp={
                l === 'en'
                  ? 'Hi, I just sent a corporate inquiry through the website.'
                  : 'Hola, acabo de enviar una consulta corporativa desde el sitio web.'
              }
            />
          </div>
        </div>
      </section>
    </div>
  )
}
