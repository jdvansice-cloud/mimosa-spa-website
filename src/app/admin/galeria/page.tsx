'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Trash2, Star, Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button, Card, Modal } from '@/components/ui'
import { cn } from '@/lib/utils'

interface GalleryImage {
  id: string
  title_es: string
  title_en?: string
  description_es?: string
  description_en?: string
  image_url: string
  thumbnail_url?: string
  category: string
  is_featured: boolean
  is_active: boolean
  sort_order: number
}

interface FilePreview {
  file: File
  preview: string
  id: string
}

const categories = [
  { value: 'all', label: 'Todas' },
  { value: 'spa', label: 'Spa' },
  { value: 'treatments', label: 'Tratamientos' },
  { value: 'facilities', label: 'Instalaciones' },
  { value: 'ambiance', label: 'Ambiente' },
]

const uploadCategories = categories.filter(c => c.value !== 'all')

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([])
  const [uploadCategory, setUploadCategory] = useState('spa')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{ success: number; errors: string[] } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch gallery images from API
  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch('/api/gallery')
      if (response.ok) {
        const { data } = await response.json()
        setImages(data || [])
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter((img) => img.category === selectedCategory)

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles: FilePreview[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith('image/')) {
        newFiles.push({
          file,
          preview: URL.createObjectURL(file),
          id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 9)}`
        })
      }
    }
    setSelectedFiles(prev => [...prev, ...newFiles])
    setUploadStatus(null)
  }

  // Remove a file from selection
  const removeFile = (id: string) => {
    setSelectedFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  // Clear all selected files
  const clearFiles = () => {
    selectedFiles.forEach(f => URL.revokeObjectURL(f.preview))
    setSelectedFiles([])
    setUploadStatus(null)
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  // Upload files
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    setUploadStatus(null)

    const formData = new FormData()
    selectedFiles.forEach(f => formData.append('files', f.file))
    formData.append('category', uploadCategory)

    try {
      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        setUploadStatus({
          success: result.uploaded?.length || 0,
          errors: result.errors?.map((e: { file: string; error: string }) => `${e.file}: ${e.error}`) || []
        })

        // Refresh gallery
        await fetchImages()

        // Clear files after successful upload
        if (!result.errors || result.errors.length === 0) {
          clearFiles()
          setTimeout(() => {
            setIsUploadModalOpen(false)
            setUploadStatus(null)
          }, 1500)
        }
      } else {
        setUploadStatus({
          success: 0,
          errors: [result.error || 'Error uploading files']
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus({
        success: 0,
        errors: ['Error de conexión al subir archivos']
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Close modal and cleanup
  const handleCloseModal = () => {
    clearFiles()
    setIsUploadModalOpen(false)
    setUploadStatus(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setImages(images.filter((img) => img.id !== id))
      } else {
        alert('Error al eliminar la imagen')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error al eliminar la imagen')
    }
  }

  const toggleFeatured = async (id: string) => {
    const image = images.find(img => img.id === id)
    if (!image) return

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: !image.is_featured })
      })

      if (response.ok) {
        setImages(
          images.map((img) =>
            img.id === id ? { ...img, is_featured: !img.is_featured } : img
          )
        )
      }
    } catch (error) {
      console.error('Toggle featured error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-dark">Galería</h1>
          <p className="text-warm-gray mt-1">Gestiona las imágenes de la galería ({images.length} imágenes)</p>
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
        onClose={handleCloseModal}
        title="Subir Imágenes"
        size="lg"
      >
        <div className="space-y-4">
          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
              isDragging
                ? 'border-gold bg-gold/10'
                : 'border-beige-300 hover:border-gold/50'
            )}
          >
            <Upload className={cn(
              'h-12 w-12 mx-auto mb-4 transition-colors',
              isDragging ? 'text-gold' : 'text-warm-gray'
            )} />
            <p className="text-dark font-medium mb-1">
              Arrastra tus imágenes aquí
            </p>
            <p className="text-sm text-warm-gray mb-4">
              o haz clic para seleccionar archivos (máx. 10MB por imagen)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              id="file-upload"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-dark font-semibold rounded-lg border-2 border-dark hover:bg-dark hover:text-cream transition-all duration-200 cursor-pointer"
            >
              Seleccionar Archivos
            </label>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-dark">
                  {selectedFiles.length} {selectedFiles.length === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}
                </p>
                <button
                  type="button"
                  onClick={clearFiles}
                  className="text-sm text-warm-gray hover:text-red-600 transition-colors"
                >
                  Limpiar todo
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                {selectedFiles.map((file) => (
                  <div key={file.id} className="relative aspect-square group">
                    {/* Use regular img for blob URLs - Next.js Image doesn't support blob: protocol */}
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 truncate rounded-b-lg">
                      {file.file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Status */}
          {uploadStatus && (
            <div className={cn(
              'p-3 rounded-lg flex items-start gap-2',
              uploadStatus.errors.length > 0 ? 'bg-red-50' : 'bg-green-50'
            )}>
              {uploadStatus.errors.length > 0 ? (
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-sm">
                {uploadStatus.success > 0 && (
                  <p className="text-green-700">
                    {uploadStatus.success} {uploadStatus.success === 1 ? 'imagen subida' : 'imágenes subidas'} correctamente
                  </p>
                )}
                {uploadStatus.errors.length > 0 && (
                  <div className="text-red-700">
                    <p>Errores:</p>
                    <ul className="list-disc list-inside">
                      {uploadStatus.errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Category Selection */}
          <div>
            <label className="label">Categoría</label>
            <select
              className="input"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
            >
              {uploadCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-beige-200 mt-4">
            <Button type="button" variant="ghost" onClick={handleCloseModal} disabled={isUploading}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Subiendo...
                </>
              ) : (
                `Subir ${selectedFiles.length > 0 ? selectedFiles.length : ''} ${selectedFiles.length === 1 ? 'Imagen' : 'Imágenes'}`
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
