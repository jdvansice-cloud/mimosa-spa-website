'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Award, Upload, Loader2, Plus, Trash2, AlertCircle } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import Image from 'next/image'

interface MembershipTier {
  name: string
  price: number
  value: number
  validity_months: number
  guests_per_visit: number
  benefit_percent: number
}

interface MembershipSettings {
  id?: string
  title_es: string
  title_en: string
  subtitle_es: string
  subtitle_en: string
  intro_es: string
  intro_en: string
  image_url: string
  what_is_title_es: string
  what_is_title_en: string
  what_is_content_es: string
  what_is_content_en: string
  benefits_title_es: string
  benefits_title_en: string
  benefits_es: string[]
  benefits_en: string[]
  who_is_for_title_es: string
  who_is_for_title_en: string
  who_is_for_es: string[]
  who_is_for_en: string[]
  group_use_title_es: string
  group_use_title_en: string
  group_use_es: string[]
  group_use_en: string[]
  options_title_es: string
  options_title_en: string
  options_es: string[]
  options_en: string[]
  tiers: MembershipTier[]
  cta_es: string
  cta_en: string
  table_note_es: string
  table_note_en: string
  is_active: boolean
}

const defaultSettings: MembershipSettings = {
  title_es: 'Membresía Privilege',
  title_en: 'Privilege Membership',
  subtitle_es: 'Mimosa Privilege Membership',
  subtitle_en: 'Mimosa Privilege Membership',
  intro_es: '',
  intro_en: '',
  image_url: '',
  what_is_title_es: '¿Qué es Mimosa Privilege?',
  what_is_title_en: 'What is Mimosa Privilege?',
  what_is_content_es: '',
  what_is_content_en: '',
  benefits_title_es: 'Beneficios que te encantarán',
  benefits_title_en: 'Benefits you will love',
  benefits_es: [],
  benefits_en: [],
  who_is_for_title_es: '¿Para quién es?',
  who_is_for_title_en: 'Who is it for?',
  who_is_for_es: [],
  who_is_for_en: [],
  group_use_title_es: 'Uso en grupo',
  group_use_title_en: 'Group use',
  group_use_es: [],
  group_use_en: [],
  options_title_es: 'Opciones de Membresía',
  options_title_en: 'Membership Options',
  options_es: [],
  options_en: [],
  tiers: [],
  cta_es: '',
  cta_en: '',
  table_note_es: '* Precios no incluyen ITBMS',
  table_note_en: '* Prices do not include ITBMS',
  is_active: true,
}

const defaultImage = 'https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=800'

export default function AdminMembresiaPage() {
  const [settings, setSettings] = useState<MembershipSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/membership')
        if (response.ok) {
          const { data } = await response.json()
          if (data) {
            setSettings(data)
          }
        }
      } catch (error) {
        console.error('Error fetching membership settings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleChange = (field: keyof MembershipSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setSaveStatus('idle')
  }

  const handleArrayChange = (field: keyof MembershipSettings, index: number, value: string) => {
    const arr = [...(settings[field] as string[])]
    arr[index] = value
    setSettings(prev => ({ ...prev, [field]: arr }))
    setSaveStatus('idle')
  }

  const addArrayItem = (field: keyof MembershipSettings) => {
    const arr = [...(settings[field] as string[])]
    arr.push('')
    setSettings(prev => ({ ...prev, [field]: arr }))
  }

  const removeArrayItem = (field: keyof MembershipSettings, index: number) => {
    const arr = [...(settings[field] as string[])]
    arr.splice(index, 1)
    setSettings(prev => ({ ...prev, [field]: arr }))
    setSaveStatus('idle')
  }

  const handleTierChange = (index: number, field: keyof MembershipTier, value: string | number) => {
    const tiers = [...settings.tiers]
    tiers[index] = { ...tiers[index], [field]: value }
    setSettings(prev => ({ ...prev, tiers }))
    setSaveStatus('idle')
  }

  const addTier = () => {
    setSettings(prev => ({
      ...prev,
      tiers: [...prev.tiers, {
        name: '',
        price: 0,
        value: 0,
        validity_months: 12,
        guests_per_visit: 4,
        benefit_percent: 25
      }]
    }))
  }

  const removeTier = (index: number) => {
    setSettings(prev => ({
      ...prev,
      tiers: prev.tiers.filter((_, i) => i !== index)
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
      formData.append('key', 'membership_image')

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
      const response = await fetch('/api/membership', {
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
      console.error('Error saving membership settings:', error)
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

  const renderArraySection = (
    titleEs: string,
    titleEn: string,
    fieldEs: keyof MembershipSettings,
    fieldEn: keyof MembershipSettings,
    labelEs: string,
    labelEn: string
  ) => (
    <Card variant="default" padding="md">
      <CardHeader>
        <CardTitle>{titleEs} / {titleEn}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Spanish */}
        <div>
          <label className="label">{labelEs}</label>
          <div className="space-y-2">
            {(settings[fieldEs] as string[])?.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  className="input flex-1"
                  value={item}
                  onChange={(e) => handleArrayChange(fieldEs, index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(fieldEs, index)}
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
              onClick={() => addArrayItem(fieldEs)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Agregar
            </Button>
          </div>
        </div>

        {/* English */}
        <div>
          <label className="label">{labelEn}</label>
          <div className="space-y-2">
            {(settings[fieldEn] as string[])?.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  className="input flex-1"
                  value={item}
                  onChange={(e) => handleArrayChange(fieldEn, index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(fieldEn, index)}
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
              onClick={() => addArrayItem(fieldEn)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gold/10 rounded-lg">
            <Award className="h-6 w-6 text-gold" />
          </div>
          <h1 className="text-3xl font-display font-semibold text-dark">Membresía Privilege</h1>
        </div>
        <p className="text-warm-gray-500">Gestiona el contenido de la página de Membresía</p>
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
              <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-beige-100">
                <Image
                  src={settings.image_url || defaultImage}
                  alt="Membership Preview"
                  fill
                  className="object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-dark/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

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
                    border-2 border-dashed border-beige-300 text-warm-gray-500
                    hover:border-gold hover:text-gold transition-colors
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}>
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="font-medium">
                      {isUploading ? 'Subiendo...' : 'Subir imagen'}
                    </span>
                    <span className="text-sm mt-1">JPG, PNG, WebP (max. 5MB)</span>
                  </div>
                </label>
                <p className="text-xs text-warm-gray-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Tamaño recomendado: 400 x 400 px (cuadrada)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info - Spanish */}
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle>Información Básica (Español)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="label">Título</label>
              <input
                type="text"
                className="input"
                value={settings.title_es}
                onChange={(e) => handleChange('title_es', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Subtítulo</label>
              <input
                type="text"
                className="input"
                value={settings.subtitle_es}
                onChange={(e) => handleChange('subtitle_es', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Introducción</label>
              <textarea
                className="input"
                rows={4}
                value={settings.intro_es}
                onChange={(e) => handleChange('intro_es', e.target.value)}
              />
            </div>
            <div>
              <label className="label">¿Qué es? - Título</label>
              <input
                type="text"
                className="input"
                value={settings.what_is_title_es}
                onChange={(e) => handleChange('what_is_title_es', e.target.value)}
              />
            </div>
            <div>
              <label className="label">¿Qué es? - Contenido</label>
              <textarea
                className="input"
                rows={4}
                value={settings.what_is_content_es}
                onChange={(e) => handleChange('what_is_content_es', e.target.value)}
              />
            </div>
            <div>
              <label className="label">CTA (Llamada a la acción)</label>
              <input
                type="text"
                className="input"
                value={settings.cta_es}
                onChange={(e) => handleChange('cta_es', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Nota de tabla</label>
              <input
                type="text"
                className="input"
                value={settings.table_note_es}
                onChange={(e) => handleChange('table_note_es', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Basic Info - English */}
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle>Basic Information (English)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="label">Title</label>
              <input
                type="text"
                className="input"
                value={settings.title_en}
                onChange={(e) => handleChange('title_en', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Subtitle</label>
              <input
                type="text"
                className="input"
                value={settings.subtitle_en}
                onChange={(e) => handleChange('subtitle_en', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Introduction</label>
              <textarea
                className="input"
                rows={4}
                value={settings.intro_en}
                onChange={(e) => handleChange('intro_en', e.target.value)}
              />
            </div>
            <div>
              <label className="label">What is it? - Title</label>
              <input
                type="text"
                className="input"
                value={settings.what_is_title_en}
                onChange={(e) => handleChange('what_is_title_en', e.target.value)}
              />
            </div>
            <div>
              <label className="label">What is it? - Content</label>
              <textarea
                className="input"
                rows={4}
                value={settings.what_is_content_en}
                onChange={(e) => handleChange('what_is_content_en', e.target.value)}
              />
            </div>
            <div>
              <label className="label">CTA (Call to action)</label>
              <input
                type="text"
                className="input"
                value={settings.cta_en}
                onChange={(e) => handleChange('cta_en', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Table note</label>
              <input
                type="text"
                className="input"
                value={settings.table_note_en}
                onChange={(e) => handleChange('table_note_en', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        {renderArraySection(
          'Beneficios', 'Benefits',
          'benefits_es', 'benefits_en',
          'Beneficios (Español)', 'Benefits (English)'
        )}

        {/* Who is it for */}
        {renderArraySection(
          '¿Para quién es?', 'Who is it for?',
          'who_is_for_es', 'who_is_for_en',
          'Lista (Español)', 'List (English)'
        )}

        {/* Group use */}
        {renderArraySection(
          'Uso en grupo', 'Group use',
          'group_use_es', 'group_use_en',
          'Descripción (Español)', 'Description (English)'
        )}

        {/* Options */}
        {renderArraySection(
          'Opciones de membresía', 'Membership options',
          'options_es', 'options_en',
          'Opciones (Español)', 'Options (English)'
        )}

        {/* Pricing Tiers */}
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle>Niveles de Membresía / Membership Tiers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.tiers?.map((tier, index) => (
              <div key={index} className="p-4 border border-beige-200 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-dark">Tier {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeTier(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="col-span-2 md:col-span-3">
                    <label className="label text-xs">Nombre / Name</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Mimosa Privilege $500"
                      value={tier.name}
                      onChange={(e) => handleTierChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Precio / Price ($)</label>
                    <input
                      type="number"
                      className="input"
                      value={tier.price}
                      onChange={(e) => handleTierChange(index, 'price', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Valor / Value ($)</label>
                    <input
                      type="number"
                      className="input"
                      value={tier.value}
                      onChange={(e) => handleTierChange(index, 'value', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Validez (meses)</label>
                    <input
                      type="number"
                      className="input"
                      value={tier.validity_months}
                      onChange={(e) => handleTierChange(index, 'validity_months', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Huéspedes / Guests</label>
                    <input
                      type="number"
                      className="input"
                      value={tier.guests_per_visit}
                      onChange={(e) => handleTierChange(index, 'guests_per_visit', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Beneficio (%)</label>
                    <input
                      type="number"
                      className="input"
                      value={tier.benefit_percent}
                      onChange={(e) => handleTierChange(index, 'benefit_percent', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addTier}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Agregar Nivel / Add Tier
            </Button>
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
