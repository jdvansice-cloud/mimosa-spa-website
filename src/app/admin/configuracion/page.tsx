'use client'

import { useState, useEffect } from 'react'
import { Save, Globe, Phone, Clock, MessageCircle, Mail, Bell, Check, Loader2, Tag } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

interface SiteSettings {
  phone_costa_del_este: string
  phone_san_francisco: string
  email: string
  whatsapp_number: string
  whatsapp_message: string
  weekday_open: string
  weekday_close: string
  weekend_open: string
  weekend_close: string
  instagram_url: string
  facebook_url: string
  whatsapp_dual_channel: boolean
  online_discount_active: boolean
  online_discount_percent: number
  google_rating?: number
  google_review_count?: number
  google_reviews_url?: string
  google_rating_cde?: number | null
  google_review_count_cde?: number | null
  google_reviews_url_cde?: string | null
  google_rating_sfc?: number | null
  google_review_count_sfc?: number | null
  google_reviews_url_sfc?: string | null
}

const defaultSettings: SiteSettings = {
  phone_costa_del_este: '+507 6000-0001',
  phone_san_francisco: '+507 6000-0002',
  email: 'info@mimosaretreat.com',
  whatsapp_number: '50764049464',
  whatsapp_message: 'Hola, me gustaría obtener información sobre sus servicios.',
  weekday_open: '09:00',
  weekday_close: '20:00',
  weekend_open: '09:00',
  weekend_close: '18:00',
  instagram_url: 'https://instagram.com/mimosaretreat',
  facebook_url: 'https://facebook.com/mimosaretreat',
  whatsapp_dual_channel: true,
  online_discount_active: false,
  online_discount_percent: 0,
  google_rating: 4.8,
  google_review_count: 96,
  google_reviews_url: '',
  google_rating_cde: null,
  google_review_count_cde: null,
  google_reviews_url_cde: null,
  google_rating_sfc: null,
  google_review_count_sfc: null,
  google_reviews_url_sfc: null,
}

export default function AdminConfigPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Fetch settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/admin/settings')
        if (response.ok) {
          const { data } = await response.json()
          if (data) {
            setSettings(data)
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleChange = (field: keyof SiteSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setSaveStatus('idle')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveStatus('idle')

    try {
      const response = await fetch('/api/admin/settings', {
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
      console.error('Error saving settings:', error)
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
        <h1 className="text-3xl font-display font-semibold text-dark">Configuración</h1>
        <p className="text-warm-gray-500 mt-1">Ajustes generales del sitio</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact Information */}
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-gold" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Teléfono Costa del Este</label>
                <input
                  type="tel"
                  className="input"
                  placeholder="+507 6000-0001"
                  value={settings.phone_costa_del_este}
                  onChange={(e) => handleChange('phone_costa_del_este', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Teléfono San Francisco</label>
                <input
                  type="tel"
                  className="input"
                  placeholder="+507 6000-0002"
                  value={settings.phone_san_francisco}
                  onChange={(e) => handleChange('phone_san_francisco', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label">Correo Electrónico</label>
              <input
                type="email"
                className="input"
                placeholder="info@mimosaretreat.com"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp */}
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-500" />
              WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="label">Número de WhatsApp</label>
              <input
                type="tel"
                className="input"
                placeholder="50764049464"
                value={settings.whatsapp_number}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
              />
              <p className="text-xs text-warm-gray-500 mt-1">
                Formato: código de país + número (sin + ni espacios)
              </p>
            </div>
            <div>
              <label className="label">Mensaje Predeterminado</label>
              <textarea
                className="input"
                rows={2}
                placeholder="Hola, me gustaría obtener información..."
                value={settings.whatsapp_message}
                onChange={(e) => handleChange('whatsapp_message', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gold" />
              Horario de Atención
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Lunes a Viernes</label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    className="input"
                    value={settings.weekday_open}
                    onChange={(e) => handleChange('weekday_open', e.target.value)}
                  />
                  <span className="text-warm-gray-500">a</span>
                  <input
                    type="time"
                    className="input"
                    value={settings.weekday_close}
                    onChange={(e) => handleChange('weekday_close', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="label">Sábados y Domingos</label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    className="input"
                    value={settings.weekend_open}
                    onChange={(e) => handleChange('weekend_open', e.target.value)}
                  />
                  <span className="text-warm-gray-500">a</span>
                  <input
                    type="time"
                    className="input"
                    value={settings.weekend_close}
                    onChange={(e) => handleChange('weekend_close', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-gold" />
              Redes Sociales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="label">Instagram</label>
              <input
                type="url"
                className="input"
                placeholder="https://instagram.com/mimosaretreat"
                value={settings.instagram_url}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Facebook</label>
              <input
                type="url"
                className="input"
                placeholder="https://facebook.com/mimosaretreat"
                value={settings.facebook_url}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Google Reviews (proof shown on the public site) */}
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-gold" />
              Reseñas de Google (por ubicación)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-xs text-warm-gray-500 -mt-2">
              El sitio muestra el total combinado de ambas ubicaciones; cada
              tarjeta de ubicación muestra su propio rating.
            </p>
            {([
              ['Costa del Este', 'google_rating_cde', 'google_review_count_cde', 'google_reviews_url_cde'],
              ['San Francisco', 'google_rating_sfc', 'google_review_count_sfc', 'google_reviews_url_sfc'],
            ] as const).map(([label, rKey, cKey, uKey]) => (
              <div key={label} className="border border-beige rounded-xl p-4 space-y-3">
                <p className="font-medium text-sm text-dark">{label}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      className="input"
                      value={settings[rKey] ?? ''}
                      onChange={(e) =>
                        handleChange(rKey, e.target.value === '' ? '' : Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <label className="label"># de reseñas</label>
                    <input
                      type="number"
                      min="0"
                      className="input"
                      value={settings[cKey] ?? ''}
                      onChange={(e) =>
                        handleChange(cKey, e.target.value === '' ? '' : Number(e.target.value))
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Enlace a reseñas de Google</label>
                  <input
                    type="url"
                    className="input"
                    placeholder="https://g.page/r/..."
                    value={settings[uKey] ?? ''}
                    onChange={(e) => handleChange(uKey, e.target.value)}
                  />
                </div>
              </div>
            ))}
            <details>
              <summary className="text-xs text-warm-gray-500 cursor-pointer">
                Valores globales (respaldo si faltan los de ubicación)
              </summary>
              <div className="mt-3 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Rating (ej. 4.8)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  className="input"
                  value={settings.google_rating ?? 4.8}
                  onChange={(e) => handleChange('google_rating', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label"># de reseñas</label>
                <input
                  type="number"
                  min="0"
                  className="input"
                  value={settings.google_review_count ?? 96}
                  onChange={(e) => handleChange('google_review_count', Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="label">Enlace a las reseñas en Google</label>
              <input
                type="url"
                className="input"
                placeholder="https://g.page/r/..."
                value={settings.google_reviews_url ?? ''}
                onChange={(e) => handleChange('google_reviews_url', e.target.value)}
              />
            </div>
              </div>
            </details>
          </CardContent>
        </Card>

        {/* Communication Channels */}
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-gold" />
              Canales de Comunicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-warm-gray-500 mb-6">
              Configura cómo se envían los códigos de verificación y notificaciones a los clientes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Email Channel */}
              <div className="border-2 border-beige-200 rounded-xl p-5 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark">Correo Electrónico</h3>
                    <span className="text-xs text-warm-gray-500">Siempre activo</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm text-dark">
                    <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                    <span>Código de verificación por correo (6 dígitos)</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-dark">
                    <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                    <span>Solo se usa cuando el cliente elige este canal</span>
                  </div>
                </div>

                <div className="rounded-lg bg-gold/5 border border-gold/20 p-3">
                  <p className="text-xs text-warm-gray-500">
                    Sin opciones adicionales. El cliente recibe únicamente el código por correo.
                  </p>
                </div>
              </div>

              {/* WhatsApp Channel */}
              <div className={`border-2 rounded-xl p-5 bg-white transition-colors ${
                settings.whatsapp_dual_channel ? 'border-green-400' : 'border-beige-200'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark">WhatsApp</h3>
                    <span className="text-xs text-warm-gray-500">Canal principal</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm text-dark">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Código de verificación por WhatsApp (6 dígitos)</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-dark">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Confirmación de cita al reservar</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-dark">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Recordatorio 24 horas antes</span>
                  </div>
                </div>

                {/* Dual channel toggle */}
                <div className={`rounded-lg border p-3 transition-colors ${
                  settings.whatsapp_dual_channel
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-dark">También enviar por correo</p>
                      <p className="text-xs text-warm-gray-500 mt-0.5">
                        {settings.whatsapp_dual_channel
                          ? 'El código llega por WhatsApp y por correo como respaldo'
                          : 'El código llega únicamente por WhatsApp'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSettings(prev => ({ ...prev, whatsapp_dual_channel: !prev.whatsapp_dual_channel }))
                        setSaveStatus('idle')
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
                        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                        settings.whatsapp_dual_channel ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow
                          transform transition duration-200 ${
                          settings.whatsapp_dual_channel ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-4 p-4 bg-beige-50 rounded-xl border border-beige-200">
              <p className="text-xs font-medium text-dark mb-2">Comportamiento actual:</p>
              <div className="space-y-1">
                <p className="text-xs text-warm-gray-500">
                  <span className="font-medium text-dark">Cliente elige correo →</span>{' '}
                  Recibe solo el código por correo electrónico
                </p>
                <p className="text-xs text-warm-gray-500">
                  <span className="font-medium text-dark">Cliente elige WhatsApp →</span>{' '}
                  {settings.whatsapp_dual_channel
                    ? 'Recibe el código por WhatsApp y también por correo como respaldo'
                    : 'Recibe el código únicamente por WhatsApp'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Online Discount */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-gold" />
              Descuento Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <p className="text-sm text-dark font-medium mb-1">
                  Descuento para reservas en línea
                </p>
                <p className="text-xs text-warm-gray-500 mb-4">
                  Se aplica automáticamente a todos los servicios que no estén dentro de una promoción activa.
                </p>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-warm-gray-500">Porcentaje:</label>
                  <div className="relative w-28">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={settings.online_discount_percent}
                      onChange={e => setSettings(prev => ({
                        ...prev,
                        online_discount_percent: Math.min(100, Math.max(0, Number(e.target.value)))
                      }))}
                      disabled={!settings.online_discount_active}
                      className="input pr-8 text-center disabled:opacity-40"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray-500 text-sm">%</span>
                  </div>
                </div>
              </div>

              {/* Toggle */}
              <div className="flex flex-col items-center gap-2 pt-1">
                <span className="text-xs text-warm-gray-500">
                  {settings.online_discount_active ? 'Activo' : 'Inactivo'}
                </span>
                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, online_discount_active: !prev.online_discount_active }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.online_discount_active ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    settings.online_discount_active ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* Preview */}
            {settings.online_discount_active && settings.online_discount_percent > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800">
                Los clientes verán un <strong>{settings.online_discount_percent}% de descuento</strong> aplicado
                automáticamente al confirmar una reserva sin promoción activa.
              </div>
            )}
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
