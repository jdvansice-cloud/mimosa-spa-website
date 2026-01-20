'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

interface MenuCategoriesProps {
  locale: string
}

const categories = [
  {
    id: 'body',
    titleKey: 'body',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800',
    href: '/menu/corporales',
  },
  {
    id: 'facial',
    titleKey: 'facial',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800',
    href: '/menu/faciales',
  },
  {
    id: 'packages',
    titleKey: 'packages',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800',
    href: '/menu/paquetes',
  },
  {
    id: 'membership',
    titleKey: 'membership',
    image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=800',
    href: '/menu/membresia',
  },
  {
    id: 'giftcards',
    titleKey: 'giftcards',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800',
    href: '/menu/giftcards',
  },
  {
    id: 'promotions',
    titleKey: 'promotions',
    image: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?q=80&w=800',
    href: '/promociones',
    special: true,
  },
]

export function MenuCategories({ locale }: MenuCategoriesProps) {
  const t = useTranslations('menu.categories')
  const tNav = useTranslations('navigation')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link
            href={`/${locale}${category.href}`}
            className="group block relative aspect-[4/3] rounded-lg overflow-hidden"
          >
            {/* Image */}
            <Image
              src={category.image}
              alt={category.special ? tNav('promotions') : t(category.titleKey)}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/50 transition-colors" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
              {category.special && (
                <span className="text-sm font-light italic mb-2 text-gold-100">
                  Descuentos del MES
                </span>
              )}
              <h3 className="text-xl md:text-2xl font-display font-semibold text-center mb-4 tracking-wide">
                {category.special ? 'PROMOCIONES' : t(category.titleKey).toUpperCase()}
              </h3>
              <span className="inline-flex items-center px-6 py-2 bg-warm-gray-500/80 hover:bg-gold hover:text-dark rounded text-sm font-medium transition-all">
                VER
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
