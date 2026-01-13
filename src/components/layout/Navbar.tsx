'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const t = useTranslations('nav')
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/menu', label: t('menu') },
    { href: '/promociones', label: t('promotions') },
    { href: '/nosotros', label: t('about') },
    { href: '/galeria', label: t('gallery') },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="container-spa">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-36">
              {/* Replace with actual logo */}
              <span className="font-display text-2xl font-semibold text-gold">
                Mimosa
              </span>
              <span className="block text-xs tracking-widest text-warm-gray uppercase">
                Spa Retreat
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isScrolled
                    ? 'text-dark hover:text-gold'
                    : 'text-dark hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/reservar"
              className="btn-primary text-sm"
            >
              {t('book')}
            </Link>
          </div>

          {/* Language Switcher */}
          <div className="hidden lg:flex items-center gap-2 ml-4">
            <LanguageSwitcher isScrolled={isScrolled} />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-beige-100 transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-dark" />
            ) : (
              <Menu className="w-6 h-6 text-dark" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-beige-200"
          >
            <div className="container-spa py-4">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 text-dark hover:bg-beige-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-beige-200 mt-2">
                  <Link
                    href="/reservar"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary w-full text-center"
                  >
                    {t('book')}
                  </Link>
                </div>
                <div className="pt-4 flex justify-center">
                  <LanguageSwitcher isScrolled={true} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function LanguageSwitcher({ isScrolled }: { isScrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLocale, setCurrentLocale] = useState('es')

  useEffect(() => {
    // Get current locale from cookie
    const locale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1] || 'es'
    setCurrentLocale(locale)
  }, [])

  const changeLocale = (locale: string) => {
    document.cookie = `locale=${locale};path=/;max-age=31536000`
    setCurrentLocale(locale)
    setIsOpen(false)
    window.location.reload()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isScrolled
            ? 'text-dark hover:bg-beige-100'
            : 'text-dark hover:bg-white/20'
        }`}
      >
        {currentLocale.toUpperCase()}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-24 bg-white rounded-lg shadow-medium border border-beige-200 overflow-hidden"
          >
            <button
              onClick={() => changeLocale('es')}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-beige-50 ${
                currentLocale === 'es' ? 'text-gold font-semibold' : 'text-dark'
              }`}
            >
              Español
            </button>
            <button
              onClick={() => changeLocale('en')}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-beige-50 ${
                currentLocale === 'en' ? 'text-gold font-semibold' : 'text-dark'
              }`}
            >
              English
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
