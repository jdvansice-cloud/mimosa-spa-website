// Editorial section header: small-caps gold eyebrow → serif title → gold
// hairline → optional lede. Replaces ad-hoc .section-title usage (whose
// absolute ::after underline collides with following content).
interface SectionHeaderProps {
  eyebrow?: string
  title: string
  lede?: string
  /** 'light' for dark backgrounds */
  tone?: 'dark' | 'light'
  align?: 'center' | 'left'
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  lede,
  tone = 'dark',
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const centered = align === 'center'
  return (
    <header
      className={`${centered ? 'text-center' : 'text-left'} mb-10 md:mb-14 ${className}`}
    >
      {eyebrow && (
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.28em] mb-3 ${
            tone === 'light' ? 'text-gold' : 'text-gold-600'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display text-3xl md:text-4xl font-semibold text-balance ${
          tone === 'light' ? 'text-cream' : 'text-dark'
        }`}
      >
        {title}
      </h2>
      <span
        className={`block h-[2px] w-12 bg-gold mt-5 ${centered ? 'mx-auto' : ''}`}
        aria-hidden
      />
      {lede && (
        <p
          className={`mt-5 leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''} ${
            tone === 'light' ? 'text-cream/75' : 'text-warm-gray'
          }`}
        >
          {lede}
        </p>
      )}
    </header>
  )
}
