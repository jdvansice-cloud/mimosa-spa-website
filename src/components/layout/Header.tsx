'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Menu, X, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, LanguageSwitcher } from '@/components/ui'
import { Logo } from './Logo'

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
    { href: `/${locale}/promociones`, label: t('promotions') },
    { href: `/${locale}/nosotros`, label: t('about') },
    { href: `/${locale}/galeria`, label: t('gallery') },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-cream/95 backdrop-blur-md shadow-soft'
          : 'bg-transparent'
      )}
    >
      <div className="container-spa">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            <Logo className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-dark hover:text-gold-600 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <Link href={`/${locale}/reservar`}>
              <Button size="sm" leftIcon={<Calendar className="h-4 w-4" />}>
                {t('book')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-beige transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-dark" />
            ) : (
              <Menu className="h-6 w-6 text-dark" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'lg:hidden fixed inset-x-0 top-20 bg-cream/98 backdrop-blur-md',
          'border-b border-beige-300 shadow-lg',
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
              className="block py-3 text-lg font-medium text-dark hover:text-gold-600 transition-colors border-b border-beige-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          
          <div className="pt-4 flex items-center justify-between">
            <LanguageSwitcher variant="compact" />
            <Link href={`/${locale}/reservar`} onClick={() => setIsMobileMenuOpen(false)}>
              <Button size="md" leftIcon={<Calendar className="h-4 w-4" />}>
                {t('book')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
