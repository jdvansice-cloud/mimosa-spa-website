'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Image as ImageIcon, Upload,
  Trash2,
  Images, Check, X, Loader2, AlertCircle , ChevronDown, ChevronUp} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import Image from 'next/image'

interface SiteImage {
  id: string
  key: string
  name: string
  description: string | null
  image_url: string
  recommended_width: number | null
  recommended_height: number | null
  aspect_ratio: string | null
  category: string
  is_active: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  hero: 'Banners / Heroes',
  categories: 'Tarjetas de Categorías',
  locations: 'Tarjetas de Ubicaciones',
  promotions: 'Promociones',
  general: 'General',
}

const CATEGORY_ORDER = ['hero', 'categories', 'locations', 'promotions', 'general']

function ImageCard({
  image,
  onUpload,
}: {
  image: SiteImage
  onUpload: (key: string, file: File) => Promise<void>
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)
    setIsUploading(true)

    // Show preview
    const reader = new FileReader()
    reader.onload = () => setPreviewUrl(reader.result as string)
    reader.readAsDataURL(file)

    try {
      await onUpload(image.key, file)
      setPreviewUrl(null)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error al subir')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const [showVariants, setShowVariants] = useState(false)
  const [variants, setVariants] = useState<{ id: string; image_url: string }[] | null>(null)
  const [variantBusy, setVariantBusy] = useState(false)
  const variantInputRef = useRef<HTMLInputElement>(null)

  const loadVariants = useCallback(async () => {
    const res = await fetch(`/api/admin/site-images/variants?key=${image.key}`)
    if (res.ok) {
      const { data } = await res.json()
      setVariants(data || [])
    }
  }, [image.key])

  const toggleVariants = async () => {
    const next = !showVariants
    setShowVariants(next)
    if (next && variants === null) await loadVariants()
  }

  const handleVariantUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setVariantBusy(true)
    try {
      const fd = new FormData()
      fd.append('key', image.key)
      fd.append('file', file)
      const res = await fetch('/api/admin/site-images/variants', { method: 'POST', body: fd })
      if (res.ok) await loadVariants()
    } finally {
      setVariantBusy(false)
      if (variantInputRef.current) variantInputRef.current.value = ''
    }
  }

  const handleVariantDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta variante?')) return
    await fetch(`/api/admin/site-images/variants?id=${id}`, { method: 'DELETE' })
    await loadVariants()
  }

  const sizeText = image.recommended_width && image.recommended_height
    ? `${image.recommended_width} x ${image.recommended_height}px`
    : 'Sin tamaño específico'

  return (
    <div className="bg-white rounded-xl border border-beige-200 overflow-hidden">
      {/* Image Preview */}
      <div className="relative aspect-video bg-beige-100">
        <Image
          src={previewUrl || image.image_url}
          alt={image.name}
          fill
          className="object-cover"
          unoptimized
        />
        {isUploading && (
          <div className="absolute inset-0 bg-dark/50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-dark mb-1">{image.name}</h3>
        {image.description && (
          <p className="text-sm text-warm-gray-500 mb-2">{image.description}</p>
        )}

        {/* Size Reference */}
        <div className="flex items-center gap-2 text-xs text-warm-gray-500 mb-3">
          <span className="px-2 py-1 bg-beige-100 rounded">
            {sizeText}
          </span>
          {image.aspect_ratio && (
            <span className="px-2 py-1 bg-beige-100 rounded">
              {image.aspect_ratio}
            </span>
          )}
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="flex items-center gap-2 text-sm text-red-600 mb-3">
            <AlertCircle className="w-4 h-4" />
            {uploadError}
          </div>
        )}

        {/* Upload Button */}
        <label className="block">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <div
            className={`
              flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg
              border-2 border-dashed border-beige-300 text-warm-gray-500
              hover:border-gold hover:text-gold transition-colors cursor-pointer
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isUploading ? 'Subiendo...' : 'Cambiar imagen'}
            </span>
          </div>
        </label>

        {/* Rotation variants: extra photos this slot alternates between daily */}
        <button
          onClick={toggleVariants}
          className="mt-3 w-full flex items-center justify-between text-xs text-warm-gray-500 hover:text-dark transition-colors"
        >
          <span className="inline-flex items-center gap-1.5">
            <Images className="w-3.5 h-3.5" />
            Variantes de rotación{variants !== null ? ` (${variants.length})` : ''}
          </span>
          {showVariants ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {showVariants && (
          <div className="mt-2 space-y-2">
            <p className="text-[11px] text-warm-gray-500 leading-snug">
              Si agregas fotos aquí, el sitio alterna entre la principal y estas
              variantes (cambia cada día automáticamente).
            </p>
            <div className="grid grid-cols-4 gap-2">
              {(variants || []).map((v) => (
                <div key={v.id} className="relative group aspect-square rounded overflow-hidden bg-beige-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.image_url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleVariantDelete(v.id)}
                    className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    title="Eliminar variante"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded border-2 border-dashed border-beige-300 flex items-center justify-center cursor-pointer hover:border-gold text-warm-gray-500 hover:text-gold transition-colors">
                <input
                  ref={variantInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleVariantUpload}
                  className="hidden"
                  disabled={variantBusy}
                />
                {variantBusy ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ImageManagementPage() {
  const [images, setImages] = useState<SiteImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/admin/site-images')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar imágenes')
      }

      setImages(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (key: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('key', key)

    const response = await fetch('/api/admin/site-images/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error al subir imagen')
    }

    // Update local state with new URL
    setImages(prev =>
      prev.map(img =>
        img.key === key ? { ...img, image_url: data.url } : img
      )
    )
  }

  // Group images by category
  const imagesByCategory = images.reduce((acc, img) => {
    const category = img.category || 'general'
    if (!acc[category]) acc[category] = []
    acc[category].push(img)
    return acc
  }, {} as Record<string, SiteImage[]>)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gold/10 rounded-lg">
            <ImageIcon className="h-6 w-6 text-gold" />
          </div>
          <h1 className="text-3xl font-display font-semibold text-dark">
            Gestión de Imágenes
          </h1>
        </div>
        <p className="text-warm-gray-500">
          Administra las imágenes del sitio web. Sube nuevas imágenes para reemplazar las actuales.
        </p>
      </div>

      {/* Instructions */}
      <Card variant="default" padding="md" className="mb-8">
        <CardContent>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div className="text-sm text-warm-gray-500">
              <p className="font-medium text-dark mb-1">Recomendaciones:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Usa los tamaños recomendados para cada imagen para mejor calidad</li>
                <li>Formatos aceptados: JPEG, PNG, WebP, GIF</li>
                <li>Tamaño máximo: 5MB por imagen</li>
                <li>Las imágenes se actualizan automáticamente en todo el sitio</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card variant="default" padding="md" className="bg-red-50 border-red-200">
          <CardContent>
            <div className="flex items-center gap-3 text-red-600">
              <X className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Images by Category */}
      {!isLoading && !error && (
        <div className="space-y-8">
          {CATEGORY_ORDER.map(category => {
            const categoryImages = imagesByCategory[category]
            if (!categoryImages || categoryImages.length === 0) return null

            return (
              <div key={category}>
                <h2 className="text-xl font-semibold text-dark mb-4">
                  {CATEGORY_LABELS[category] || category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryImages.map(image => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      onUpload={handleUpload}
                    />
                  ))}
                </div>
              </div>
            )
          })}

          {/* Empty State */}
          {images.length === 0 && (
            <Card variant="default" padding="lg">
              <CardContent>
                <div className="text-center py-8">
                  <ImageIcon className="w-12 h-12 text-beige-300 mx-auto mb-4" />
                  <p className="text-warm-gray-500">
                    No hay imágenes configuradas. Ejecuta la migración de base de datos.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
