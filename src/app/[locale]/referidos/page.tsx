import { Gift } from 'lucide-react'
import { REFERIDOS_COPY } from '@/content/pages'
import { LeadForm } from '@/components/shared/LeadForm'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 3600

const L = (locale: string) => (locale === 'en' ? 'en' : 'es') as 'es' | 'en'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = L(locale)
  return buildPageMetadata({
    locale,
    path: '/referidos',
    title: REFERIDOS_COPY.heroTitle[l],
    description: REFERIDOS_COPY.heroSubtitle[l],
  })
}

// Shell page: the referral credit mechanics ship with the gifting engine
// fast-follow; until then this collects interest.
export default async function ReferidosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = L(locale)

  return (
    <div className="min-h-screen bg-cream">
      <section className="py-16 md:py-24 bg-beige text-center">
        <div className="container-spa max-w-2xl">
          <div className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <Gift className="h-7 w-7 text-gold-600" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-dark text-balance">
            {REFERIDOS_COPY.heroTitle[l]}
          </h1>
          <span className="block h-[2px] w-12 bg-gold mt-5 mx-auto" aria-hidden />
          <p className="text-warm-gray mt-5 text-lg leading-relaxed">{REFERIDOS_COPY.heroSubtitle[l]}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-spa max-w-2xl">
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold text-dark mb-1">
              {REFERIDOS_COPY.notifyTitle[l]}
            </h2>
            <p className="text-sm text-warm-gray mb-5">{REFERIDOS_COPY.notifyIntro[l]}</p>
            <LeadForm source="referidos" />
          </div>
        </div>
      </section>
    </div>
  )
}
