'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const menuCategories = [
  {
    title: 'TRATAMIENTOS CORPORALES',
    href: '/menu#corporales',
    image: '/images/menu/corporales.jpg',
    gradient: 'from-dark/60 to-dark/30',
  },
  {
    title: 'TRATAMIENTOS FACIALES',
    href: '/menu#faciales',
    image: '/images/menu/faciales.jpg',
    gradient: 'from-dark/60 to-dark/30',
  },
  {
    title: 'TRATAMIENTOS EN PAQUETES',
    href: '/menu#paquetes',
    image: '/images/menu/paquetes.jpg',
    gradient: 'from-dark/60 to-dark/30',
  },
  {
    title: 'MEMBRESÍA PRIVILEGE',
    href: '/menu#membresia',
    image: '/images/menu/membresia.jpg',
    gradient: 'from-dark/60 to-dark/30',
  },
  {
    title: 'GIFTCARDS',
    href: '/giftcards',
    image: '/images/menu/giftcards.jpg',
    gradient: 'from-dark/60 to-dark/30',
  },
  {
    title: 'PROMOCIONES',
    href: '/promociones',
    image: '/images/menu/promociones.jpg',
    subtitle: 'Descuentos del MES',
    gradient: 'from-dark/60 to-dark/30',
  },
]

export function MenuSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-spa">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">—MENU—</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={category.href} className="group block relative aspect-[4/3] overflow-hidden rounded-lg">
                {/* Background placeholder - in production, use actual images */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-b ${category.gradient}`}
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${category.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                
                {/* Fallback background color */}
                <div className="absolute inset-0 bg-gradient-to-br from-spa-sage/80 to-beige-400/80" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                  {category.subtitle && (
                    <span className="font-display text-2xl text-white/80 italic mb-2">
                      {category.subtitle}
                    </span>
                  )}
                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-white tracking-wide mb-4">
                    {category.title}
                  </h3>
                  <span className="inline-block px-6 py-2 border-2 border-white text-white text-sm font-medium 
                                   group-hover:bg-white group-hover:text-dark transition-all duration-300">
                    VER
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
