import { Star } from 'lucide-react'
import { getLocale } from 'next-intl/server'
import { getServerSettings, aggregateRating } from '@/lib/settings'

interface RatingBadgeProps {
  className?: string
  /** 'light' for dark backgrounds */
  tone?: 'dark' | 'light'
}

/** Static star row shared by the badge and the location cards. */
export function Stars({ rating, size = 'h-4 w-4' }: { rating: number; size?: string }) {
  return (
    <span className="flex" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${size} ${i <= Math.round(rating) ? 'fill-gold text-gold' : 'text-gold/40'}`}
        />
      ))}
    </span>
  )
}

// Server component: "★★★★★ 4.8 · 143 reseñas en Google" — the combined
// count across BOTH locations, rating weighted by review count.
export async function RatingBadge({ className = '', tone = 'dark' }: RatingBadgeProps) {
  const [settings, locale] = await Promise.all([getServerSettings(), getLocale()])
  const agg = aggregateRating(settings)
  if (!agg.rating || !agg.count) return null

  const label =
    locale === 'en' ? `${agg.count} reviews on Google` : `${agg.count} reseñas en Google`
  const text = tone === 'light' ? 'text-cream/90' : 'text-dark/80'

  const inner = (
    <span className={`inline-flex items-center gap-2 ${text} ${className}`}>
      <Stars rating={agg.rating} />
      <span className="text-sm font-medium">
        {agg.rating.toFixed(1)} · {label}
      </span>
    </span>
  )

  if (agg.url) {
    return (
      <a
        href={agg.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity"
        aria-label={`Google: ${agg.rating.toFixed(1)} — ${label}`}
      >
        {inner}
      </a>
    )
  }
  return inner
}
