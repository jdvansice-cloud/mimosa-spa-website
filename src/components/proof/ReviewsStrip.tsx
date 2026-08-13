import { getLocale } from 'next-intl/server'
import { getActiveReviews } from '@/lib/reviews'
import { RatingBadge } from './RatingBadge'
import { ReviewsCarousel } from './ReviewsCarousel'

interface ReviewsStripProps {
  /** Cards visible at once (desktop) */
  limit?: number
  className?: string
}

// Server component: curated review quotes with the combined rating badge.
// All active quotes feed a gently rotating client carousel, with a day-seeded
// starting offset so the section leads with different voices each day.
// Renders nothing when no reviews are curated yet.
export async function ReviewsStrip({ limit = 3, className = '' }: ReviewsStripProps) {
  const [reviews, locale] = await Promise.all([getActiveReviews(), getLocale()])
  const quotes = reviews.filter((r) => r.kind === 'review')
  if (quotes.length === 0) return null

  // Deterministic per-day offset (ISR republishes hourly, shifts daily).
  const startOffset = Math.floor(Date.now() / 86_400_000) % quotes.length

  return (
    <section className={`py-12 ${className}`}>
      <div className="container-spa">
        <div className="flex justify-center mb-8">
          <RatingBadge />
        </div>
        <ReviewsCarousel
          reviews={quotes}
          locale={locale}
          visible={limit}
          startOffset={startOffset}
        />
      </div>
    </section>
  )
}
