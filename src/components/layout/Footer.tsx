import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageCircle, Star } from 'lucide-react'
import { Logo } from './Logo'
import { getServerSettings, aggregateRating } from '@/lib/settings'
import { GIFT_CARDS_PATH, FEATURES } from '@/lib/nav'

// Format phone number for display
function formatPhoneDisplay(phone: string): string {
  // If it already looks formatted with +507, return as-is
  if (phone.startsWith('+507')) return phone
  // If it already has dashes/spaces, add +507 prefix
  if (phone.includes('-') || phone.includes(' ')) return `+507 ${phone}`
  // Otherwise format as +507 XXX-XXXX
  if (phone.length === 7) return `+507 ${phone.slice(0, 3)}-${phone.slice(3)}`
  return phone
}

export async function Footer() {
  const locale = await getLocale()
  const [t, tNav, tContact, tHome, settings] = await Promise.all([
    getTranslations('footer'),
    getTranslations('navigation'),
    getTranslations('contact'),
    getTranslations('home.locations'),
    getServerSettings(),
  ])

  const agg = aggregateRating(settings)
  const currentYear = new Date().getFullYear()
  const phoneDisplay = formatPhoneDisplay(settings.phone_costa_del_este)
  const phoneLink = `tel:+507${settings.phone_costa_del_este.replace(/\D/g, '')}`

  const navLinks = [
    { href: `/${locale}`, label: tNav('home') },
    { href: `/${locale}/menu`, label: tNav('menu') },
    ...(FEATURES.parejas ? [{ href: `/${locale}/parejas`, label: tNav('couples') }] : []),
    ...(FEATURES.giftShop
      ? [{ href: `/${locale}${GIFT_CARDS_PATH}`, label: tNav('giftcards') }]
      : []),
    { href: `/${locale}/promociones`, label: tNav('promotions') },
    { href: `/${locale}/empresas`, label: 'Empresas' },
    { href: `/${locale}/club-mimosa`, label: 'Club Mimosa' },
    { href: `/${locale}/primera-visita`, label: locale === 'en' ? 'First Visit' : 'Primera Visita' },
    { href: `/${locale}/nosotros`, label: tNav('about') },
    { href: `/${locale}/galeria`, label: tNav('gallery') },
    { href: `/${locale}/reservar`, label: tNav('book') },
  ]

  return (
    <footer className="bg-dark text-cream">
      <div className="container-spa py-7 md:py-16">
        {/* Compact mobile footer */}
        <div className="md:hidden flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-2">
            <Logo variant="icon" size="sm" />
            <span className="font-display text-lg font-semibold text-cream">Mimosa Spa Retreat</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
               className="p-2 rounded-full bg-cream/10 hover:bg-gold hover:text-dark transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
               className="p-2 rounded-full bg-cream/10 hover:bg-gold hover:text-dark transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={phoneLink} aria-label="Teléfono"
               className="p-2 rounded-full bg-cream/10 hover:bg-gold hover:text-dark transition-colors">
              <Phone className="h-4 w-4" />
            </a>
            <a href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
               className="p-2 rounded-full bg-cream/10 hover:bg-gold hover:text-dark transition-colors">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
          <p className="text-cream/50 text-xs">
            © {currentYear} Mimosa Spa Retreat ·{' '}
            <Link href={`/${locale}/privacidad`} className="hover:text-gold">{t('privacy')}</Link> ·{' '}
            <Link href={`/${locale}/terminos`} className="hover:text-gold">{t('terms')}</Link>
          </p>
        </div>

        {/* Full footer — tablet/desktop */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <Logo variant="icon" size="lg" />
              <div className="flex flex-col">
                <span className="font-display text-2xl font-semibold text-cream">
                  Mimosa
                </span>
                <span className="text-xs tracking-[0.2em] uppercase text-cream/70">
                  Spa Retreat
                </span>
              </div>
            </div>
            <p className="text-cream/70 text-sm mt-4">{t('tagline')}</p>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-cream/10 hover:bg-gold hover:text-dark transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={settings.facebook_url}
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
                  {agg.cde && agg.cde.count > 0 && (
                    <a
                      href={agg.cde.url || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-cream/60 hover:text-gold transition-colors mt-0.5"
                    >
                      <Star className="h-3 w-3 fill-gold text-gold" />
                      {agg.cde.rating.toFixed(1)} · {agg.cde.count} Google
                    </a>
                  )}
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{tHome('sanFrancisco.name')}</p>
                  <p className="text-cream/70 text-sm">{tHome('sanFrancisco.address')}</p>
                  {agg.sfc && agg.sfc.count > 0 && (
                    <a
                      href={agg.sfc.url || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-cream/60 hover:text-gold transition-colors mt-0.5"
                    >
                      <Star className="h-3 w-3 fill-gold text-gold" />
                      {agg.sfc.rating.toFixed(1)} · {agg.sfc.count} Google
                    </a>
                  )}
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
                  href={phoneLink}
                  className="text-cream/70 hover:text-gold transition-colors"
                >
                  {phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-gold" />
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/70 hover:text-gold transition-colors"
                >
                  +{settings.whatsapp_number.replace(/\D/g, '')}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold" />
                <a
                  href={`mailto:${settings.email}`}
                  className="text-cream/70 hover:text-gold transition-colors"
                >
                  {settings.email}
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
        <div className="hidden md:flex mt-12 pt-8 border-t border-cream/10 flex-col md:flex-row justify-between items-center gap-4">
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
            <Link
              href={`/${locale}/politica-de-cancelacion`}
              className="text-cream/50 hover:text-gold transition-colors"
            >
              {t('cancellation')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
