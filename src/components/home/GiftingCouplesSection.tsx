import Link from 'next/link'
import Image from 'next/image'
import { getLocale } from 'next-intl/server'
import { getSiteImages } from '@/lib/site-images'
import { GIFT_CARDS_PATH } from '@/lib/nav'

const COPY = {
  es: {
    couplesTitle: 'Parejas y Ocasiones',
    couplesBody: 'Cabinas dobles, rituales para dos y celebraciones en grupo.',
    couplesCta: 'Descubrir',
    giftTitle: 'Gift Cards',
    giftBody: 'El regalo que siempre queda bien: una experiencia Mimosa.',
    giftCta: 'Regalar',
  },
  en: {
    couplesTitle: 'Couples & Occasions',
    couplesBody: 'Double cabins, rituals for two and group celebrations.',
    couplesCta: 'Discover',
    giftTitle: 'Gift Cards',
    giftBody: 'The gift that always fits: a Mimosa experience.',
    giftCta: 'Gift it',
  },
}

// Homepage feature cards for the two FY2027 growth levers.
export async function GiftingCouplesSection() {
  const locale = await getLocale()
  const c = COPY[locale === 'en' ? 'en' : 'es']
  const images = await getSiteImages(['category_parejas', 'category_giftcards'])

  const cards = [
    {
      title: c.couplesTitle,
      body: c.couplesBody,
      cta: c.couplesCta,
      href: `/${locale}/parejas`,
      image: images.category_parejas,
    },
    {
      title: c.giftTitle,
      body: c.giftBody,
      cta: c.giftCta,
      href: `/${locale}${GIFT_CARDS_PATH}`,
      image: images.category_giftcards,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-card"
        >
          <Image
            src={card.image}
            alt={card.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <h3 className="text-2xl font-display font-semibold mb-1">{card.title}</h3>
            <p className="text-cream/80 text-sm mb-4 max-w-xs">{card.body}</p>
            <span className="inline-flex items-center px-6 py-2 border-2 border-white rounded-full text-sm font-medium w-fit transition-colors group-hover:bg-white group-hover:text-dark">
              {card.cta}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
