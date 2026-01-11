'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react'
import { Logo } from './Logo'

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('navigation')
  const tContact = useTranslations('contact')
  const tHome = useTranslations('home.locations')
  const params = useParams()
  const locale = params.locale as string

  const currentYear = new Date().getFullYear()

  const navLinks = [
    { href: `/${locale}`, label: tNav('home') },
    { href: `/${locale}/menu`, label: tNav('menu') },
    { href: `/${locale}/promociones`, label: tNav('promotions') },
    { href: `/${locale}/nosotros`, label: tNav('about') },
    { href: `/${locale}/galeria`, label: tNav('gallery') },
    { href: `/${locale}/reservar`, label: tNav('book') },
  ]

  return (
    <footer className="bg-dark text-cream">
      <div className="container-spa py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Logo theme="dark" size="md" />
            <p className="text-cream/70 text-sm mt-4">{t('tagline')}</p>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/mimosasparetreat"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-cream/10 hover:bg-gold hover:text-dark transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/mimosasparetreat"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-cream/10 hover:bg-gold hover:text-dark transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-lg font-display font-semibold mb-4">{t('links')}</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations Column */}
          <div>
            <h4 className="text-lg font-display font-semibold mb-4">
              {tHome('title')}
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{tHome('costaDelEste.name')}</p>
                  <p className="text-cream/70 text-sm">{tHome('costaDelEste.address')}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{tHome('sanFrancisco.name')}</p>
                  <p className="text-cream/70 text-sm">{tHome('sanFrancisco.address')}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-display font-semibold mb-4">{t('contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold" />
                <a
                  href="tel:+5076000000"
                  className="text-cream/70 hover:text-gold transition-colors"
                >
                  +507 6000-0000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold" />
                <a
                  href="mailto:info@mimosaretreat.com"
                  className="text-cream/70 hover:text-gold transition-colors"
                >
                  info@mimosaretreat.com
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <div className="text-cream/70 text-sm">
                  <p>{tContact('weekdays')}</p>
                  <p>{tContact('weekends')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/50 text-sm">
            © {currentYear} Mimosa Spa Retreat. {t('rights')}.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href={`/${locale}/privacidad`}
              className="text-cream/50 hover:text-gold transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href={`/${locale}/terminos`}
              className="text-cream/50 hover:text-gold transition-colors"
            >
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
