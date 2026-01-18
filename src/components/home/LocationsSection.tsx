'use client'

import { useTranslations } from 'next-intl'
import { MapPin, Clock, Phone, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui'

const WHATSAPP_NUMBER = '+507 6404-9464'
const PHONE_NUMBER = '398-5295'

const locations = [
  {
    id: 1,
    nameKey: 'costaDelEste',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800',
    mapUrl: 'https://maps.app.goo.gl/5iX28mGH2mxUiJJ1A',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1970.5!2d-79.46174!3d9.022731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8facaa1a4be8b0d7%3A0xeea70492420826f4!2sMimosa%20Spa%20-%20Costa%20del%20Este!5e0!3m2!1ses!2spa!4v1700000000000!5m2!1ses!2spa',
  },
  {
    id: 2,
    nameKey: 'sanFrancisco',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800',
    mapUrl: 'https://maps.app.goo.gl/sgT9VCx6DZBoy5wn6',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1970.5!2d-79.5054466!3d8.9932791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca91ce23320e9%3A0x15bbc21f0fa10701!2sMimosa%20Spa%20-%20San%20Francisco!5e0!3m2!1ses!2spa!4v1700000000000!5m2!1ses!2spa',
  },
]

export function LocationsSection() {
  const t = useTranslations('home.locations')

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
          {t('title')}
        </h2>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {locations.map((location, index) => (
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
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
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
                    <p>Lun - Vie: 9:00 AM - 8:00 PM</p>
                    <p>Sáb - Dom: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gold" />
                  <a
                    href={`tel:+507${PHONE_NUMBER.replace(/-/g, '')}`}
                    className="text-dark hover:text-gold transition-colors"
                  >
                    {PHONE_NUMBER}
                  </a>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER.replace(/[\s+-]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark hover:text-green-500 transition-colors"
                  >
                    {WHATSAPP_NUMBER}
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
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
