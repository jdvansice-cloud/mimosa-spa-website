'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function AboutSection() {
  const t = useTranslations('about')

  return (
    <section className="py-20 bg-white">
      <div className="container-spa">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Main image */}
              <div className="col-span-2 aspect-[4/3] rounded-2xl overflow-hidden bg-beige-200">
                <div className="w-full h-full bg-gradient-to-br from-spa-sage/40 to-beige-300" />
              </div>
              {/* Secondary images */}
              <div className="aspect-square rounded-xl overflow-hidden bg-beige-200">
                <div className="w-full h-full bg-gradient-to-br from-spa-lavender/40 to-beige-200" />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden bg-beige-200">
                <div className="w-full h-full bg-gradient-to-br from-gold/20 to-beige-200" />
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:pl-8"
          >
            <h2 className="section-title">{t('title')}</h2>
            <div className="section-divider" />
            
            <div className="space-y-4 text-warm-gray leading-relaxed">
              <p>
                Mimosa Spa Retreat es un lugar único para descansar, relajarse y 
                rejuvenecer. Ofrecemos una amplia variedad de servicios de spa. 
                Disfrutarás de una atmósfera tranquila y relajante en un entorno 
                natural y hermoso.
              </p>
              <p>
                Nuestro personal profesionalmente entrenado está listo para 
                cuidar de su bienestar y satisfacción. Visítenos para una 
                experiencia inolvidable que le hará sentirse como en casa. 
                ¡Ven a Mimosa Spa Retreat y disfruta de una experiencia única!
              </p>
              <p className="font-medium text-dark">
                Subscríbete para recibir nuestras ofertas.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                href="/nosotros"
                className="btn-primary inline-flex items-center gap-2 group"
              >
                Conocer más
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/reservar"
                className="btn-secondary"
              >
                Reservar cita
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
