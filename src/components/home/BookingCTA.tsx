'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Calendar, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { HomeBookingButton } from '@/components/shared/HomeBookingButton'

// Button styles for HomeBookingButton (matches Button component's lg primary variant)
const bookingButtonStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gold text-dark hover:bg-gold-600 active:bg-gold-700 focus:ring-gold-500 shadow-sm hover:shadow-md px-8 py-4 text-lg gap-2.5"

export function BookingCTA() {
  const t = useTranslations('home.cta')
  const locale = useLocale()

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070')`,
          }}
        />
        <div className="absolute inset-0 bg-dark/70" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-gold/20">
        <Sparkles className="w-24 h-24" />
      </div>
      <div className="absolute bottom-10 right-10 text-gold/20">
        <Sparkles className="w-32 h-32" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-spa">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold mb-6">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-10">
            {t('subtitle')}
          </p>
          <HomeBookingButton
            locale={locale}
            className={`${bookingButtonStyles} shadow-lg`}
          >
            <Calendar className="h-5 w-5 flex-shrink-0" />
            {t('button')}
          </HomeBookingButton>
        </motion.div>
      </div>
    </section>
  )
}
