'use client'

import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Card } from '@/components/ui'
import { formatPrice, formatDate, getLocalizedContent } from '@/lib/utils'
import { PromotionBookingButton } from './PromotionBookingButton'
import type { Promotion } from '@/types'

interface PromotionCardProps {
  promotion: Promotion
  /** Render the details section expanded (promotions page); home stays collapsed */
  defaultOpen?: boolean
}

export function PromotionCard({ promotion, defaultOpen = false }: PromotionCardProps) {
  const t = useTranslations('promotions')
  const locale = useLocale()

  const title = getLocalizedContent(promotion, 'title', locale)

  return (
    <Card
      variant="default"
      padding="none"
      hover
      className="group overflow-hidden bg-beige-100"
    >
      <div className="flex flex-col h-full">
        {/* Header with Title and Image - Fixed height */}
        <div className="flex h-32">
          {/* Title Side */}
          <div className="flex-1 p-6 flex flex-col justify-center">
            <h3 className="text-xl md:text-2xl font-display font-semibold text-spa-brown uppercase tracking-wide line-clamp-2">
              {title}
            </h3>
            <div className="w-12 h-0.5 bg-gold mt-3" />
          </div>

          {/* Image Side - Fixed size */}
          <div className="w-32 h-32 relative flex-shrink-0">
            <Image
              src={promotion.image_url || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=400'}
              alt={title}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
        </div>

        {/* Price row — always visible; details collapsed below */}
        <details className="group/details mx-4 mt-2" open={defaultOpen}>
          <summary className="list-none cursor-pointer flex items-center justify-between bg-warm-gray-500 text-cream px-5 py-3 rounded-lg [&::-webkit-details-marker]:hidden">
            <span className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{formatPrice(promotion.price)}</span>
              {promotion.duration_minutes && (
                <span className="text-sm text-cream/70">
                  /({promotion.duration_minutes}min)
                </span>
              )}
            </span>
            <span className="flex items-center gap-1 text-xs text-cream/80">
              {locale === 'en' ? 'Details' : 'Ver detalles'}
              <span className="transition-transform group-open/details:rotate-180">▾</span>
            </span>
          </summary>
          <div className="bg-warm-gray-500 text-cream p-5 rounded-lg mt-1.5">
            {/* Services List */}
            <div className="space-y-1 text-center">
              {promotion.services.map((service, index) => (
                <div key={index}>
                  <p className="text-sm">{service}</p>
                  {index < promotion.services.length - 1 && (
                    <p className="text-gold text-xs my-1">+</p>
                  )}
                </div>
              ))}
            </div>
            {/* Validity Note */}
            <p className="text-xs text-cream/60 mt-4 pt-3 border-t border-cream/20 text-center">
              {t('validUntil')} {formatDate(promotion.valid_until, locale)}. {t('priceNote')}.
            </p>
          </div>
        </details>

        {/* Footer */}
        <div className="p-4 mt-auto">
          {/* Book Button */}
          <PromotionBookingButton
            promotion={promotion}
            locale={locale}
            label={t('bookNow')}
            className="w-full"
          />
        </div>
      </div>
    </Card>
  )
}
