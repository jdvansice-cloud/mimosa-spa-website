'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'

// Static promotions - in production, these would come from Supabase
const promotions = [
  {
    id: '1',
    title: 'ESENCIA DE PAZ',
    treatments: ['Masaje de Piernas Cansadas', 'Masaje Craneo-Facial'],
    price: 79,
    duration: 65,
    image: '/images/promo-1.jpg',
  },
  {
    id: '2',
    title: 'SUSPIRO DE SERENIDAD',
    treatments: ['Masaje Liberador de Tensión', 'Masaje de Pies en Camilla', 'Masaje Craneofacial'],
    price: 99,
    duration: 85,
    image: '/images/promo-2.jpg',
  },
  {
    id: '3',
    title: 'CALMA TOTAL',
    treatments: ['Masaje Relajante', 'Exfoliación Corporal', 'Masaje de Piedras Calientes', 'Mascarilla Hidratante'],
    price: 129,
    duration: 110,
    image: '/images/promo-3.jpg',
  },
]

export function PromotionsSection() {
  const currentMonth = new Date().toLocaleDateString('es-PA', { month: 'long', year: 'numeric' })

  return (
    <section className="py-20 bg-beige-50">
      <div className="container-spa">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">—PROMOCIONES—</h2>
          <p className="text-warm-gray mt-2 capitalize flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            {currentMonth}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow"
            >
              {/* Promo image/card */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-beige-200 to-beige-100 flex items-center">
                <div className="w-full p-6">
                  {/* Title */}
                  <h3 className="font-serif text-2xl font-semibold text-dark mb-4">
                    {promo.title}
                  </h3>
                  
                  {/* Treatments list */}
                  <div className="bg-dark/80 text-white p-4 rounded-lg mb-4">
                    {promo.treatments.map((treatment, i) => (
                      <div key={i} className="text-center">
                        <span className="text-sm">{treatment}</span>
                        {i < promo.treatments.length - 1 && (
                          <div className="text-gold text-xs my-1">+</div>
                        )}
                      </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-white/20 flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-gold">${promo.price}</span>
                      <span className="text-sm text-white/80">/({promo.duration}min)</span>
                    </div>
                  </div>
                  
                  {/* Logo placeholder */}
                  <div className="text-center">
                    <span className="font-display text-xl text-gold">Mimosa</span>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 text-center text-sm text-warm-gray">
                <p>Promoción válida hasta el 31 de enero del 2026.</p>
                <p>Precio no incluye ITBM.</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link 
            href="/promociones"
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            Ver todas las promociones
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
