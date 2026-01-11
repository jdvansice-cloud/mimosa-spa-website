'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { Globe } from 'lucide-react'

interface LanguageSwitcherProps {
  className?: string
  variant?: 'default' | 'compact' | 'dark'
}

const languages = [
  { code: 'es', label: 'Español', flag: '🇵🇦' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
]

export function LanguageSwitcher({
  className,
  variant = 'default',
}: LanguageSwitcherProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLocale: string) => {
    // Replace the current locale in the pathname with the new one
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPathname)
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              'px-2 py-1 text-sm rounded transition-colors',
              locale === lang.code
                ? 'bg-gold text-dark font-semibold'
                : 'text-warm-gray hover:text-dark hover:bg-beige'
            )}
            aria-label={`Switch to ${lang.label}`}
            aria-current={locale === lang.code ? 'true' : undefined}
          >
            {lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'dark') {
    return (
      <div className={cn('relative group', className)}>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cream/10 transition-colors"
          aria-label="Select language"
          aria-haspopup="listbox"
        >
          <Globe className="h-4 w-4 text-cream/70" />
          <span className="text-sm font-medium text-cream/90">
            {languages.find((l) => l.code === locale)?.flag}
            <span className="ml-1">
              {languages.find((l) => l.code === locale)?.code.toUpperCase()}
            </span>
          </span>
        </button>

        {/* Dropdown */}
        <div
          className={cn(
            'absolute right-0 top-full mt-1 py-1 w-32',
            'bg-dark rounded-lg shadow-elevated border border-cream/20',
            'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
            'transition-all duration-200'
          )}
          role="listbox"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                'w-full px-3 py-2 text-left text-sm flex items-center gap-2',
                'transition-colors hover:bg-cream/10 text-cream/90',
                locale === lang.code && 'bg-gold/20 text-gold font-medium'
              )}
              role="option"
              aria-selected={locale === lang.code}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative group', className)}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-beige transition-colors"
        aria-label="Select language"
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4 text-warm-gray" />
        <span className="text-sm font-medium">
          {languages.find((l) => l.code === locale)?.flag}
          <span className="ml-1">
            {languages.find((l) => l.code === locale)?.code.toUpperCase()}
          </span>
        </span>
      </button>

      {/* Dropdown */}
      <div
        className={cn(
          'absolute right-0 top-full mt-1 py-1 w-32',
          'bg-white rounded-lg shadow-elevated border border-beige-200',
          'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
          'transition-all duration-200'
        )}
        role="listbox"
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              'w-full px-3 py-2 text-left text-sm flex items-center gap-2',
              'transition-colors hover:bg-beige',
              locale === lang.code && 'bg-gold/10 text-dark font-medium'
            )}
            role="option"
            aria-selected={locale === lang.code}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
