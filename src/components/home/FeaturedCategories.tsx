'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'

import { DEFAULT_IMAGES as SHARED_DEFAULTS } from '@/lib/default-images'

// Short-key view over the shared fallback map
const DEFAULT_IMAGES = {
  body: SHARED_DEFAULTS.category_body_treatments,
  facial: SHARED_DEFAULTS.category_facial_treatments,
  packages: SHARED_DEFAULTS.category_packages,
}

interface FeaturedCategoriesProps {
  images?: {
    body?: string
    facial?: string
    packages?: string
  }
}

export function FeaturedCategories({ images }: FeaturedCategoriesProps) {
  const t = useTranslations('home.featured')
  const tMenu = useTranslations('menu.categories')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  const categories = [
    {
      id: 'body',
      image: images?.body || DEFAULT_IMAGES.body,
      titleKey: 'body',
      href: '/menu/corporales',
    },
    {
      id: 'facial',
      image: images?.facial || DEFAULT_IMAGES.facial,
      titleKey: 'facial',
      href: '/menu/faciales',
    },
    {
      id: 'packages',
      image: images?.packages || DEFAULT_IMAGES.packages,
      titleKey: 'packages',
      href: '/menu/paquetes',
    },
  ]

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-10 md:mb-14">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-dark text-balance">
          {t('title')}
        </h2>
        <span className="block h-[2px] w-12 bg-gold mt-5 mx-auto" aria-hidden />
        <p className="text-warm-gray max-w-2xl mx-auto mt-5 leading-relaxed">
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
              href={`/${locale}${category.href}`}
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
                  {tCommon('view').toUpperCase()}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
