import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import { getOfferByKey, offerName } from '@/lib/offers'

const COPY = {
  es: { eyebrow: 'Nuevos clientes', cta: 'Reclamar mi primera visita' },
  en: { eyebrow: 'New clients', cta: 'Claim my first visit' },
}

// Homepage banner for the first-visit offer (price lives in marketing_offers).
export async function FirstVisitBanner() {
  const [locale, offer] = await Promise.all([getLocale(), getOfferByKey('first_visit')])
  if (!offer) return null
  const c = COPY[locale === 'en' ? 'en' : 'es']

  return (
    <section className="py-12 bg-dark text-cream">
      <div className="container-spa flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl">
        <div className="text-center md:text-left">
          <p className="text-gold text-xs font-medium uppercase tracking-widest mb-1">
            {c.eyebrow}
          </p>
          <p className="text-2xl md:text-3xl font-display font-semibold">
            {offerName(offer, locale)}
            {offer.price != null && (
              <span className="text-gold"> · ${Number(offer.price).toFixed(0)}</span>
            )}
          </p>
        </div>
        <Link href={`/${locale}/primera-visita`} className="btn-primary whitespace-nowrap">
          {c.cta}
        </Link>
      </div>
    </section>
  )
}
