'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Calendar, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'

export function HeroSection() {
  const t = useTranslations('home.hero')
  const locale = useLocale()

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: 'smooth',
    })
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070')`,
          }}
        />
        {/* Stronger Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/50 to-dark/70" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gold/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container-spa text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl mx-auto"
        >
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="w-16 h-px bg-gold" />
            <span className="text-gold text-sm tracking-[0.3em] uppercase font-medium drop-shadow-lg">
              Mimosa Spa Retreat
            </span>
            <span className="w-16 h-px bg-gold" />
          </div>

          {/* Main Title */}
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-semibold leading-tight mb-6"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
          >
            {t('title')}
          </h1>

          {/* Subtitle */}
          <p 
            className="text-xl md:text-2xl text-white/90 mb-10 font-light"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}
          >
            {t('subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`/${locale}/reservar`}>
              <Button
                size="lg"
                leftIcon={<Calendar className="h-5 w-5" />}
                className="w-full sm:w-auto shadow-lg"
              >
                {t('cta')}
              </Button>
            </Link>
            <Link href={`/${locale}/menu`}>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-dark shadow-lg"
              >
                Ver Tratamientos
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator - just the arrow */}
        <motion.button
          onClick={scrollToContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/80 hover:text-white transition-colors cursor-pointer"
          aria-label="Scroll down"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-8 w-8" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  )
}
