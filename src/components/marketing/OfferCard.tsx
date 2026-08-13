import Image from 'next/image'
import { Check } from 'lucide-react'
import type { MarketingOffer } from '@/lib/offers'
import {
  offerBadge,
  offerDescription,
  offerIncludes,
  offerName,
  offerWhatsappText,
} from '@/lib/offers'
import { WhatsAppBookingLink } from '@/components/shared/WhatsAppBookingLink'

interface OfferCardProps {
  offer: MarketingOffer
  locale: string
  imageUrl?: string
  /** Price suffix, e.g. '/mes' for memberships */
  priceSuffix?: string
  /** Visually emphasize this card (e.g. most-requested tier) */
  featured?: boolean
}

// Server card for a marketing_offers row: image (admin-managed), serif price,
// includes list and a WhatsApp CTA with the per-SKU prefilled message.
export function OfferCard({
  offer,
  locale,
  imageUrl,
  priceSuffix = '',
  featured = false,
}: OfferCardProps) {
  const badge = offerBadge(offer, locale)
  const includes = offerIncludes(offer, locale)
  const description = offerDescription(offer, locale)

  return (
    <article
      className={`group bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${
        featured
          ? 'shadow-elevated ring-2 ring-gold'
          : 'shadow-card hover:shadow-elevated'
      }`}
    >
      {imageUrl && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={offerName(offer, locale)}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {badge && (
            <span className="absolute top-3 right-3 text-[11px] font-semibold uppercase tracking-wider bg-gold text-dark rounded-full px-3 py-1 shadow-sm">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl md:text-2xl font-semibold text-dark text-balance">
            {offerName(offer, locale)}
          </h3>
          {!imageUrl && badge && (
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-gold/15 text-gold-700 rounded-full px-3 py-1 whitespace-nowrap">
              {badge}
            </span>
          )}
        </div>
        {offer.price != null && offer.price > 0 && (
          <p className="mt-2 font-display text-3xl text-gold-600">
            ${Number(offer.price).toFixed(0)}
            {priceSuffix && (
              <span className="font-body text-sm font-medium text-warm-gray">
                {' '}
                {priceSuffix}
              </span>
            )}
          </p>
        )}
        {description && (
          <p className="mt-3 text-sm text-dark/70 leading-relaxed">{description}</p>
        )}
        {includes.length > 0 && (
          <ul className="mt-4 space-y-2 border-t border-beige pt-4">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-dark/75">
                <Check className="h-4 w-4 text-gold-600 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-6">
          <WhatsAppBookingLink
            cta={`offer_${offer.key}`}
            message={offerWhatsappText(offer, locale)}
            className="w-full"
          />
        </div>
      </div>
    </article>
  )
}
