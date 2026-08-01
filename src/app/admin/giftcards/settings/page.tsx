'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Gift, Upload, Loader2, Plus, Trash2, AlertCircle } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import Image from 'next/image'

interface GiftCardSettings {
  id?: string
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  image_url: string
  conditions_es: string[]
  conditions_en: string[]
  is_active: boolean
}

const defaultSettings: GiftCardSettings = {
  title_es: 'Tarjetas de Regalo',
  title_en: 'Gift Cards',
  description_es: '',
  description_en: '',
  image_url: '',
  conditions_es: [],
  conditions_en: [],
  is_active: true,
}

const defaultImage = 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=800'

export default function AdminGiftCardsPage() {
  const [settings, setSettings] = useState<GiftCardSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/giftcards')
        if (response.ok) {
          const { data } = await response.json()
          if (data) {
            setSettings(data)
          }
        }
      } catch (error) {
        console.error('Error fetching gift card settings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleChange = (field: keyof GiftCardSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setSaveStatus('idle')
  }

  const handleConditionChange = (lang: 'es' | 'en', index: number, value: string) => {
    const field = lang === 'es' ? 'conditions_es' : 'conditions_en'
    const conditions = [...settings[field]]
    conditions[index] = value
    setSettings(prev => ({ ...prev, [field]: conditions }))
    setSaveStatus('idle')
  }

  const addCondition = (lang: 'es' | 'en') => {
    const field = lang === 'es' ? 'conditions_es' : 'conditions_en'
    setSettings(prev => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  const removeCondition = (lang: 'es' | 'en', index: number) => {
    const field = lang === 'es' ? 'conditions_es' : 'conditions_en'
    setSettings(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
    setSaveStatus('idle')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('key', 'giftcard_image')

      const response = await fetch('/api/admin/site-images/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.url) {
        setSettings(prev => ({ ...prev, image_url: data.url }))
        setSaveStatus('idle')
      } else {
        console.error('Upload error:', data.error)
        alert('Error al subir la imagen')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error al subir la imagen')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveStatus('idle')

    try {
      const response = await fetch('/api/giftcards', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setSaveStatus('success')
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
      }
    } catch (error) {
      console.error('Error saving gift card settings:', error)
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gold/10 rounded-lg">
            <Gift className="h-6 w-6 text-gold" />
          </div>
          <h1 className="text-3xl font-display font-semibold text-dark">Gift Cards</h1>
        </div>
        <p className="text-warm-gray">Gestiona el contenido de la página de Gift Cards</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Active Toggle */}
        <Card variant="default" padding="md">
          <CardContent>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                className="w-5 h-5 rounded border-beige-300 text-gold focus:ring-gold"
              />
              <span className="text-dark font-medium">Página activa</span>
              <span className="text-sm text-warm-gray">
                (Si está desactivada, la página mostrará un mensaje de no disponible)
              </span>
            </label>
          </CardContent>
        </Card>

        {/* Image */}
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-gold" />
              Imagen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Preview */}
              <div className="relative w-full md:w-64 aspect-[4/3] rounded-lg overflow-hidden bg-beige-100">
                <Image
                  src={settings.image_url || defaultImage}
                  alt="Gift Card Preview"
                  fill
                  className="object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-dark/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload Area */}
              <div className="flex-1">
                <label className="block cursor-pointer">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <div className={`
                    flex flex-col items-center justify-center p-6 rounded-lg
                    border-2 border-dashed border-beige-300 text-warm-gray
                    hover:border-gold hover:text-gold transition-colors
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}>
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="font-medium">
                      {isUploading ? 'Subiendo...' : 'Haz clic para subir una imagen'}
                    </span>
                    <span className="text-sm mt-1">JPG, PNG, WebP (max. 5MB)</span>
                  </div>
                </label>
                <p className="text-xs text-warm-gray mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Tamaño recomendado: 800 x 600 px
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spanish Content */}
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle>Contenido en Español</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="label">Título</label>
              <input
                type="text"
                className="input"
                placeholder="Tarjetas de Regalo"
                value={settings.title_es}
                onChange={(e) => handleChange('title_es', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Descripción</label>
              <textarea
                className="input"
                rows={5}
                placeholder="Describe las gift cards..."
                value={settings.description_es}
                onChange={(e) => handleChange('description_es', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Condiciones de Compra</label>
              <div className="space-y-2">
                {settings.conditions_es.map((condition, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      className="input flex-1"
                      placeholder={`Condición ${index + 1}`}
                      value={condition}
                      onChange={(e) => handleConditionChange('es', index, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeCondition('es', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addCondition('es')}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Agregar Condición
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* English Content */}
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle>English Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="label">Title</label>
              <input
                type="text"
                className="input"
                placeholder="Gift Cards"
                value={settings.title_en}
                onChange={(e) => handleChange('title_en', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                className="input"
                rows={5}
                placeholder="Describe the gift cards..."
                value={settings.description_en}
                onChange={(e) => handleChange('description_en', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Purchase Conditions</label>
              <div className="space-y-2">
                {settings.conditions_en.map((condition, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      className="input flex-1"
                      placeholder={`Condition ${index + 1}`}
                      value={condition}
                      onChange={(e) => handleConditionChange('en', index, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeCondition('en', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addCondition('en')}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Condition
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4">
          {saveStatus === 'success' && (
            <span className="text-green-600 text-sm">Configuración guardada correctamente</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-600 text-sm">Error al guardar. Intente de nuevo.</span>
          )}
          <Button type="submit" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
