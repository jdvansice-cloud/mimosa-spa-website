'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

interface FeaturedCategoriesProps {
  locale: string
}

const categories = [
  {
    id: 'body',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800',
    titleKey: 'body',
  },
  {
    id: 'facial',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800',
    titleKey: 'facial',
  },
  {
    id: 'packages',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800',
    titleKey: 'packages',
  },
]

export function FeaturedCategories({ locale }: FeaturedCategoriesProps) {
  const t = useTranslations('home.featured')
  const tMenu = useTranslations('menu.categories')

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
          {t('title')}
        </h2>
        <p className="text-warm-gray max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              href={`/${locale}/menu?category=${category.id}`}
              className="group block relative aspect-[4/5] rounded-2xl overflow-hidden"
            >
              {/* Image */}
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={tMenu(category.titleKey)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/40 to-transparent transition-opacity group-hover:opacity-90" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-white">
                <h3 className="text-xl md:text-2xl font-display font-semibold text-center mb-4">
                  {tMenu(category.titleKey).toUpperCase()}
                </h3>
                <span className="inline-flex items-center px-6 py-2 border-2 border-white rounded-full text-sm font-medium transition-colors group-hover:bg-white group-hover:text-dark">
                  VER
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
