'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Menu, X, Calendar, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GIFT_CARDS_PATH } from '@/lib/nav'
import { LanguageSwitcher } from '@/components/ui'
import { HomeBookingButton } from '@/components/shared/HomeBookingButton'

// Button styles for sm and md sizes (matches Button component)
const smButtonStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gold text-dark hover:bg-gold-600 active:bg-gold-700 focus:ring-gold-500 shadow-sm hover:shadow-md px-4 py-2 text-sm gap-1.5"
const mdButtonStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gold text-dark hover:bg-gold-600 active:bg-gold-700 focus:ring-gold-500 shadow-sm hover:shadow-md px-6 py-3 text-base gap-2"

export function Header() {
  const t = useTranslations('navigation')
  const params = useParams()
  const locale = params.locale as string
  
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [locale])

  const navItems = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/menu`, label: t('menu') },
    { href: `/${locale}/parejas`, label: t('couples') },
    { href: `/${locale}${GIFT_CARDS_PATH}`, label: t('giftcards') },
    { href: `/${locale}/promociones`, label: t('promotions') },
    { href: `/${locale}/nosotros`, label: t('about') },
    { href: `/${locale}/galeria`, label: t('gallery') },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-dark/95 backdrop-blur-md shadow-lg'
          : 'bg-dark'
      )}
    >
      <div className="container-spa">
        <nav className="flex items-center justify-between h-20">
          {/* Logo - Full logo image */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            <div className="relative h-12 w-40">
              <Image
                src="/Logo_mimosa.png"
                alt="Mimosa Spa Retreat"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-cream/90 hover:text-gold font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher variant="dark" />
            <Link
              href={`/${locale}/portal`}
              className="p-2 rounded-lg text-cream/80 hover:text-gold hover:bg-cream/10 transition-colors"
              title={t('portal')}
            >
              <User className="h-5 w-5" />
            </Link>
            <HomeBookingButton locale={locale} className={smButtonStyles}>
              <Calendar className="h-4 w-4 flex-shrink-0" />
              {t('book')}
            </HomeBookingButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-cream/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-cream" />
            ) : (
              <Menu className="h-6 w-6 text-cream" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu - z-[60] to appear above BookingNav which has z-50 */}
      <div
        className={cn(
          'lg:hidden fixed inset-x-0 top-20 z-[60] bg-dark/98 backdrop-blur-md',
          'border-b border-cream/10 shadow-lg',
          'transition-all duration-300 ease-in-out',
          isMobileMenuOpen
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-4'
        )}
      >
        <div className="container-spa py-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-3 text-lg font-medium text-cream/90 hover:text-gold transition-colors border-b border-cream/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href={`/${locale}/portal`}
            className="block py-3 text-lg font-medium text-cream/90 hover:text-gold transition-colors border-b border-cream/10"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t('portal')}
          </Link>

          <div className="pt-4 flex items-center justify-between">
            <LanguageSwitcher variant="dark" />
            <HomeBookingButton
              locale={locale}
              className={mdButtonStyles}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Calendar className="h-4 w-4 flex-shrink-0" />
              {t('book')}
            </HomeBookingButton>
          </div>
        </div>
      </div>
    </header>
  )
}
