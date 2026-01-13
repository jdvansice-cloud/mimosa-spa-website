'use client'

import { useTranslations } from 'next-intl'
import { MapPin, Clock, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui'

const locations = [
  {
    id: 1,
    nameKey: 'costaDelEste',
    phone: '+507 6000-0001',
    hours: '9:00 AM - 8:00 PM',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800',
  },
  {
    id: 2,
    nameKey: 'sanFrancisco',
    phone: '+507 6000-0002',
    hours: '9:00 AM - 8:00 PM',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800',
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
                  <p className="text-dark">{t(`${location.nameKey}.address`)}</p>
                </div>

                {/* Hours */}
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gold" />
                  <p className="text-warm-gray">{location.hours}</p>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gold" />
                  <a
                    href={`tel:${location.phone.replace(/\s/g, '')}`}
                    className="text-dark hover:text-gold transition-colors"
                  >
                    {location.phone}
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
