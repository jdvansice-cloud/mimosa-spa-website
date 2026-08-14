'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { MapPin, Clock, Phone, MessageCircle, Star, Navigation } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui'

interface SiteSettings {
  phone_costa_del_este: string
  phone_san_francisco: string
  whatsapp_number: string
}

const defaultSettings: SiteSettings = {
  phone_costa_del_este: '398-5295',
  phone_san_francisco: '398-5295',
  whatsapp_number: '50764049464',
}

// Default fallback images
const DEFAULT_IMAGES = {
  costaDelEste: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800',
  sanFrancisco: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800',
}

export interface LocationRatingInfo {
  rating: number
  count: number
  url: string
}

interface LocationsSectionProps {
  /** Render each card's info open (dedicated /ubicaciones page) */
  expanded?: boolean
  /** Show a Waze navigation button per location */
  showWaze?: boolean
  /** Hide the section header (when the page provides its own) */
  hideTitle?: boolean
  images?: {
    costaDelEste?: string
    sanFrancisco?: string
  }
  /** Per-location Google ratings (from site_settings, passed by the server page) */
  ratings?: {
    costaDelEste?: LocationRatingInfo | null
    sanFrancisco?: LocationRatingInfo | null
  }
}

const getLocations = (images?: LocationsSectionProps['images']) => [
  {
    id: 1,
    nameKey: 'costaDelEste',
    phoneKey: 'phone_costa_del_este' as const,
    image: images?.costaDelEste || DEFAULT_IMAGES.costaDelEste,
    mapUrl: 'https://maps.app.goo.gl/5iX28mGH2mxUiJJ1A',
    wazeUrl: 'https://waze.com/ul?ll=9.022731,-79.461740&navigate=yes',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1970.5!2d-79.46174!3d9.022731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8facaa1a4be8b0d7%3A0xeea70492420826f4!2sMimosa%20Spa%20-%20Costa%20del%20Este!5e0!3m2!1ses!2spa!4v1700000000000!5m2!1ses!2spa',
  },
  {
    id: 2,
    nameKey: 'sanFrancisco',
    phoneKey: 'phone_san_francisco' as const,
    image: images?.sanFrancisco || DEFAULT_IMAGES.sanFrancisco,
    mapUrl: 'https://maps.app.goo.gl/sgT9VCx6DZBoy5wn6',
    wazeUrl: 'https://waze.com/ul?ll=8.993279,-79.505447&navigate=yes',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1970.5!2d-79.5054466!3d8.9932791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca91ce23320e9%3A0x15bbc21f0fa10701!2sMimosa%20Spa%20-%20San%20Francisco!5e0!3m2!1ses!2spa!4v1700000000000!5m2!1ses!2spa',
  },
]

// Format phone number for display
function formatPhoneDisplay(phone: string): string {
  // If it already looks formatted, return as-is
  if (phone.includes('-') || phone.includes(' ')) return phone
  // Otherwise format as XXX-XXXX
  if (phone.length === 7) return `${phone.slice(0, 3)}-${phone.slice(3)}`
  return phone
}

// Format WhatsApp number for display
function formatWhatsAppDisplay(number: string): string {
  // Remove any non-digit characters
  const digits = number.replace(/\D/g, '')
  // Format as +507 XXXX-XXXX
  if (digits.startsWith('507') && digits.length === 11) {
    return `+507 ${digits.slice(3, 7)}-${digits.slice(7)}`
  }
  return number
}

export function LocationsSection({ images, ratings, expanded = false, showWaze = false, hideTitle = false }: LocationsSectionProps) {
  const t = useTranslations('home.locations')
  const locale = useLocale()
  const tContact = useTranslations('contact')
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const { data } = await response.json()
          if (data) {
            setSettings({
              phone_costa_del_este: data.phone_costa_del_este || defaultSettings.phone_costa_del_este,
              phone_san_francisco: data.phone_san_francisco || defaultSettings.phone_san_francisco,
              whatsapp_number: data.whatsapp_number || defaultSettings.whatsapp_number,
            })
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const whatsappDisplay = formatWhatsAppDisplay(settings.whatsapp_number)
  const whatsappLink = `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`
  const locations = getLocations(images)

  return (
    <div>
      {/* Section Header */}
      {!hideTitle && (
      <div className="text-center mb-10 md:mb-14">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-dark text-balance">
          {t('title')}
        </h2>
        <span className="block h-[2px] w-12 bg-gold mt-5 mx-auto" aria-hidden />
      </div>
      )}

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {locations.map((location, index) => {
          const phoneNumber = settings[location.phoneKey]
          const phoneDisplay = formatPhoneDisplay(phoneNumber)
          const phoneLink = `tel:+507${phoneNumber.replace(/\D/g, '')}`
          const rating =
            location.nameKey === 'costaDelEste' ? ratings?.costaDelEste : ratings?.sanFrancisco

          return (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                variant="elevated"
                padding="none"
                hover
                className="overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${location.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />

                  {/* Location Name Overlay */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-display font-semibold">
                      {t(`${location.nameKey}.name`)}
                    </h3>
                    {rating && rating.count > 0 && (
                      <a
                        href={rating.url || location.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1.5 text-sm text-cream/90 hover:text-gold transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="flex" aria-hidden>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${i <= Math.round(rating.rating) ? 'fill-gold text-gold' : 'text-cream/40'}`}
                            />
                          ))}
                        </span>
                        <span className="font-medium">
                          {rating.rating.toFixed(1)} ({rating.count})
                        </span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Content — collapsed by default, expands on demand */}
                <details className="group/details" open={expanded}>
                  <summary className="list-none cursor-pointer p-4 flex items-center justify-between text-sm font-medium text-dark hover:text-gold-700 transition-colors [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gold" />
                      {locale === 'en' ? 'View info & map' : 'Ver información y mapa'}
                    </span>
                    <span className="text-warm-gray transition-transform group-open/details:rotate-180">▾</span>
                  </summary>
                <div className="px-6 pb-6 space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                    <a
                      href={location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dark hover:text-gold transition-colors"
                    >
                      {t(`${location.nameKey}.address`)}
                    </a>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                    <div className="text-warm-gray text-sm">
                      <p>{tContact('weekdays')}</p>
                      <p>{tContact('weekends')}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gold" />
                    <a
                      href={phoneLink}
                      className="text-dark hover:text-gold transition-colors"
                    >
                      {phoneDisplay}
                    </a>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-green-500" />
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dark hover:text-green-500 transition-colors"
                    >
                      {whatsappDisplay}
                    </a>
                  </div>

                  {/* Google Map */}
                  <div className="mt-4 rounded-lg overflow-hidden border border-beige-200">
                    <iframe
                      src={location.mapEmbed}
                      width="100%"
                      height="150"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Mapa de ${t(`${location.nameKey}.name`)}`}
                    />
                  </div>

                  {/* Waze navigation */}
                  {showWaze && (
                    <a
                      href={location.wazeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl
                               bg-[#33ccff] text-white font-semibold text-sm hover:brightness-95 transition-all"
                    >
                      <Navigation className="h-4 w-4" />
                      {locale === 'en' ? 'Drive there with Waze' : 'Ir con Waze'}
                    </a>
                  )}
                </div>
                </details>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
