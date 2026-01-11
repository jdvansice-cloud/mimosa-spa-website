'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GalleryGridProps {
  locale: string
}

// Sample gallery images - will be replaced with Supabase data
const galleryImages = [
  {
    id: '1',
    title_es: 'Sala de Masajes',
    title_en: 'Massage Room',
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200',
    category: 'facilities',
  },
  {
    id: '2',
    title_es: 'Tratamiento Facial',
    title_en: 'Facial Treatment',
    image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200',
    category: 'treatments',
  },
  {
    id: '3',
    title_es: 'Área de Relajación',
    title_en: 'Relaxation Area',
    image_url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=1200',
    category: 'spa',
  },
  {
    id: '4',
    title_es: 'Masaje de Piedras',
    title_en: 'Stone Massage',
    image_url: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1200',
    category: 'treatments',
  },
  {
    id: '5',
    title_es: 'Recepción',
    title_en: 'Reception',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200',
    category: 'facilities',
  },
  {
    id: '6',
    title_es: 'Ambiente Zen',
    title_en: 'Zen Ambiance',
    image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200',
    category: 'ambiance',
  },
]

const categories = ['all', 'spa', 'treatments', 'facilities', 'ambiance']

export function GalleryGrid({ locale }: GalleryGridProps) {
  const t = useTranslations('gallery.categories')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter((img) => img.category === selectedCategory)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  
  const goToPrevious = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1)
    }
  }
  
  const goToNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === filteredImages.length - 1 ? 0 : lightboxIndex + 1)
    }
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'px-6 py-2 rounded-full text-sm font-medium transition-all',
              selectedCategory === category
                ? 'bg-gold text-dark'
                : 'bg-beige text-warm-gray hover:bg-beige-300'
            )}
          >
            {t(category)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={image.image_url}
                alt={locale === 'es' ? image.title_es : image.title_en}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/40 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  {locale === 'es' ? image.title_es : image.title_en}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
              aria-label="Close"
            >
              <X className="h-8 w-8" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors z-10"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
            >
              <ChevronRight className="h-10 w-10" />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filteredImages[lightboxIndex].image_url}
                alt={locale === 'es' ? filteredImages[lightboxIndex].title_es : filteredImages[lightboxIndex].title_en}
                width={1200}
                height={800}
                className="object-contain max-h-[85vh] w-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
