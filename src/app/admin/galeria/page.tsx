'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Trash2, Star, Upload } from 'lucide-react'
import { Button, Card, Modal } from '@/components/ui'
import { cn } from '@/lib/utils'

// Sample gallery images
const initialImages = [
  { id: '1', title_es: 'Sala de Masajes', image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400', is_featured: true, category: 'facilities' },
  { id: '2', title_es: 'Tratamiento Facial', image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=400', is_featured: false, category: 'treatments' },
  { id: '3', title_es: 'Área de Relajación', image_url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=400', is_featured: true, category: 'spa' },
  { id: '4', title_es: 'Masaje de Piedras', image_url: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=400', is_featured: false, category: 'treatments' },
]

const categories = [
  { value: 'all', label: 'Todas' },
  { value: 'spa', label: 'Spa' },
  { value: 'treatments', label: 'Tratamientos' },
  { value: 'facilities', label: 'Instalaciones' },
  { value: 'ambiance', label: 'Ambiente' },
]

export default function AdminGalleryPage() {
  const [images, setImages] = useState(initialImages)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter((img) => img.category === selectedCategory)

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta imagen?')) {
      setImages(images.filter((img) => img.id !== id))
    }
  }

  const toggleFeatured = (id: string) => {
    setImages(
      images.map((img) =>
        img.id === id ? { ...img, is_featured: !img.is_featured } : img
      )
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-dark">Galería</h1>
          <p className="text-warm-gray mt-1">Gestiona las imágenes de la galería</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)} leftIcon={<Upload className="h-4 w-4" />}>
          Subir Imágenes
        </Button>
      </div>

      {/* Category Filter */}
      <Card variant="default" padding="md" className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                selectedCategory === category.value
                  ? 'bg-gold text-dark'
                  : 'bg-beige text-warm-gray hover:bg-beige-300'
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredImages.map((image) => (
          <Card key={image.id} variant="default" padding="none" className="group relative">
            <div className="aspect-square relative overflow-hidden rounded-t-2xl">
              <Image
                src={image.image_url}
                alt={image.title_es}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => toggleFeatured(image.id)}
                  className={cn(
                    'p-2 rounded-full transition-colors',
                    image.is_featured
                      ? 'bg-gold text-dark'
                      : 'bg-white/90 text-warm-gray hover:text-gold'
                  )}
                  aria-label={image.is_featured ? 'Quitar de destacados' : 'Marcar como destacado'}
                >
                  <Star className="h-4 w-4" fill={image.is_featured ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-2 rounded-full bg-white/90 text-warm-gray hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Featured Badge */}
              {image.is_featured && (
                <div className="absolute top-2 right-2 p-1.5 rounded-full bg-gold text-dark">
                  <Star className="h-3 w-3" fill="currentColor" />
                </div>
              )}
            </div>
            
            <div className="p-3">
              <p className="text-sm font-medium text-dark truncate">{image.title_es}</p>
              <p className="text-xs text-warm-gray capitalize">{image.category}</p>
            </div>
          </Card>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-warm-gray">No hay imágenes en esta categoría</p>
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Subir Imágenes"
        size="lg"
      >
        <form className="space-y-4">
          <div className="border-2 border-dashed border-beige-300 rounded-xl p-8 text-center">
            <Upload className="h-12 w-12 text-warm-gray mx-auto mb-4" />
            <p className="text-dark font-medium mb-1">
              Arrastra tus imágenes aquí
            </p>
            <p className="text-sm text-warm-gray mb-4">
              o haz clic para seleccionar archivos
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="secondary" as="span" className="cursor-pointer">
                Seleccionar Archivos
              </Button>
            </label>
          </div>

          <div>
            <label className="label">Categoría</label>
            <select className="input">
              <option value="spa">Spa</option>
              <option value="treatments">Tratamientos</option>
              <option value="facilities">Instalaciones</option>
              <option value="ambiance">Ambiente</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsUploadModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Subir Imágenes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
