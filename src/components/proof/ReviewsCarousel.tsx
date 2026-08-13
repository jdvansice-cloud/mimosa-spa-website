'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Star } from 'lucide-react'
import type { SiteReview } from '@/lib/reviews'

interface ReviewsCarouselProps {
  reviews: SiteReview[]
  locale: string
  /** Cards visible at once on desktop */
  visible?: number
  /** Day-seeded starting offset (from the server) so each day leads differently */
  startOffset?: number
}

const ROTATE_MS = 7000

// Gently cycling quote cards: every few seconds the window advances by one
// with a crossfade, so the proof section never feels frozen. Pauses on hover
// and respects prefers-reduced-motion.
export function ReviewsCarousel({
  reviews,
  locale,
  visible = 3,
  startOffset = 0,
}: ReviewsCarouselProps) {
  const [offset, setOffset] = useState(startOffset % Math.max(reviews.length, 1))
  const [fading, setFading] = useState(false)
  const pausedRef = useRef(false)
  const reduceMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  )

  useEffect(() => {
    if (reviews.length <= visible || reduceMotion) return
    const id = setInterval(() => {
      if (pausedRef.current) return
      setFading(true)
      setTimeout(() => {
        setOffset((o) => (o + 1) % reviews.length)
        setFading(false)
      }, 350)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [reviews.length, visible, reduceMotion])

  if (reviews.length === 0) return null

  const window_ = Array.from(
    { length: Math.min(visible, reviews.length) },
    (_, i) => reviews[(offset + i) % reviews.length]
  )

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto transition-opacity duration-300 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      aria-live="polite"
    >
      {window_.map((r, i) => (
        <figure
          key={r.id}
          className={`bg-white rounded-xl shadow-card p-6 flex flex-col ${
            i > 0 ? 'hidden md:flex' : ''
          }`}
        >
          <div className="flex mb-3" aria-label={`${r.rating}/5`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-4 w-4 ${n <= r.rating ? 'fill-gold text-gold' : 'text-gold/30'}`}
              />
            ))}
          </div>
          <blockquote className="text-dark/80 text-sm leading-relaxed flex-1">
            “{locale === 'en' ? r.quote_en : r.quote_es}”
          </blockquote>
          <figcaption className="mt-4 text-sm font-medium text-dark">
            {r.author_name}
            <span className="text-warm-gray font-normal">
              {' '}
              · Google
              {r.location === 'cde' && ' · Costa del Este'}
              {r.location === 'sfc' && ' · San Francisco'}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
