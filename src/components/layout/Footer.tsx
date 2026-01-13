'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { MapPin, Phone, Mail, Instagram, Facebook, Clock } from 'lucide-react'

export function Footer() {
  const t = useTranslations('footer')
  const tLocations = useTranslations('locations')

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white">
      <div className="container-spa py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <span className="font-display text-3xl font-semibold text-gold">
                Mimosa
              </span>
              <span className="block text-sm tracking-widest text-beige-300 uppercase">
                Spa Retreat
              </span>
            </div>
            <p className="text-beige-300 text-sm leading-relaxed">
              Tu santuario de paz y renovación en Panamá.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://instagram.com/mimosasparetreat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-dark transition-all duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/mimosasparetreat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-dark transition-all duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Costa del Este Location */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-gold">
              {tLocations('costaDelEste.name')}
            </h4>
            <div className="space-y-3 text-sm text-beige-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span>{tLocations('costaDelEste.address')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <span>+507 6000-0000</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold flex-shrink-0" />
                <span>Lun-Vie: 9am-8pm | Sáb-Dom: 9am-6pm</span>
              </div>
            </div>
          </div>

          {/* San Francisco Location */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-gold">
              {tLocations('sanFrancisco.name')}
            </h4>
            <div className="space-y-3 text-sm text-beige-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span>{tLocations('sanFrancisco.address')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <span>+507 6000-0001</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold flex-shrink-0" />
                <span>Lun-Vie: 9am-8pm | Sáb-Dom: 9am-6pm</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-gold">
              Enlaces
            </h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/menu" className="text-beige-300 hover:text-gold transition-colors">
                Tratamientos
              </Link>
              <Link href="/promociones" className="text-beige-300 hover:text-gold transition-colors">
                Promociones
              </Link>
              <Link href="/nosotros" className="text-beige-300 hover:text-gold transition-colors">
                Nosotros
              </Link>
              <Link href="/galeria" className="text-beige-300 hover:text-gold transition-colors">
                Galería
              </Link>
              <Link href="/reservar" className="text-beige-300 hover:text-gold transition-colors">
                Reservar
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-spa py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-beige-400">
            <p>© {currentYear} Mimosa Spa Retreat. {t('rights')}.</p>
            <div className="flex gap-6">
              <Link href="/privacidad" className="hover:text-gold transition-colors">
                Privacidad
              </Link>
              <Link href="/terminos" className="hover:text-gold transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
