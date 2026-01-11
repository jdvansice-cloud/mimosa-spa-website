'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Card, Button } from '@/components/ui'
import { formatPrice, formatDate, getLocalizedContent } from '@/lib/utils'
import type { Promotion } from '@/types'

interface PromotionCardProps {
  promotion: Promotion
  locale: string
}

export function PromotionCard({ promotion, locale }: PromotionCardProps) {
  const t = useTranslations('promotions')

  const title = getLocalizedContent(promotion, 'title', locale)

  return (
    <Card
      variant="default"
      padding="none"
      hover
      className="group overflow-hidden bg-beige-100"
    >
      <div className="flex flex-col h-full">
        {/* Header with Title and Image */}
        <div className="flex">
          {/* Title Side */}
          <div className="flex-1 p-6 flex flex-col justify-center">
            <h3 className="text-xl md:text-2xl font-display font-semibold text-spa-brown uppercase tracking-wide">
              {title}
            </h3>
            <div className="w-12 h-0.5 bg-gold mt-3" />
          </div>
          
          {/* Image Side */}
          <div className="w-1/3 relative aspect-square">
            <Image
              src={promotion.image_url || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=400'}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 150px"
            />
          </div>
        </div>

        {/* Content Box */}
        <div className="mx-4 -mt-4 relative z-10">
          <div className="bg-warm-gray-500 text-cream p-5 rounded-lg">
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

            {/* Price and Duration */}
            <div className="mt-4 pt-4 border-t border-cream/20 flex items-center justify-center gap-2">
              <span className="text-2xl font-bold">{formatPrice(promotion.price)}</span>
              {promotion.duration_minutes && (
                <span className="text-sm text-cream/70">
                  /({promotion.duration_minutes}min)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 mt-auto">
          {/* Validity Note */}
          <p className="text-xs text-warm-gray mb-3">
            {t('validUntil')} {formatDate(promotion.valid_until, locale)}.
            <br />
            {t('priceNote')}.
          </p>

          {/* Book Button */}
          <Link href={`/${locale}/reservar`} className="block">
            <Button className="w-full" size="sm">
              {t('bookNow')}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
