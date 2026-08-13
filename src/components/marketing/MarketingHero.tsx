import Image from 'next/image'
import { getSiteImage } from '@/lib/site-images'
import { RatingBadge } from '@/components/proof/RatingBadge'

// Full-bleed image hero for marketing pages. The image is admin-managed via
// site_images (imageKey) with a curated fallback, so photography drops in
// from /admin/imagenes with no deploy.
interface MarketingHeroProps {
  imageKey: string
  title: string
  subtitle?: string
  showRating?: boolean
  /** Compact variant for utility pages */
  size?: 'default' | 'compact'
  children?: React.ReactNode
}

export async function MarketingHero({
  imageKey,
  title,
  subtitle,
  showRating = true,
  size = 'default',
  children,
}: MarketingHeroProps) {
  const image = await getSiteImage(imageKey)
  const height =
    size === 'compact'
      ? 'min-h-[240px] md:min-h-[300px]'
      : 'min-h-[320px] md:min-h-[420px]'

  return (
    <section className={`relative ${height} flex items-center overflow-hidden`}>
      {image && (
        <Image
          src={image}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/50 to-dark/70" />
      <div className="relative container-spa w-full py-16 md:py-20 text-center text-cream">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold mb-4">
          Mimosa Spa Retreat
        </p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-balance max-w-3xl mx-auto">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 md:mt-5 text-base md:text-lg text-cream/85 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        {showRating && (
          <div className="mt-5 flex justify-center">
            <RatingBadge tone="light" />
          </div>
        )}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  )
}
