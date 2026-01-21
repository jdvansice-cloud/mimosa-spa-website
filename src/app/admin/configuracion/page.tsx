'use client'

import { useState, useEffect } from 'react'
import { Save, Globe, Phone, Clock, MessageCircle, Loader2 } from 'lucide-react'
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
  instagram_url: 'https://instagram.com/mimosasparetreat',
  facebook_url: 'https://facebook.com/mimosasparetreat',
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

  const handleChange = (field: keyof SiteSettings, value: string) => {
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
        <p className="text-warm-gray mt-1">Ajustes generales del sitio</p>
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
              <p className="text-xs text-warm-gray mt-1">
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
                  <span className="text-warm-gray">a</span>
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
                  <span className="text-warm-gray">a</span>
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
                placeholder="https://instagram.com/mimosasparetreat"
                value={settings.instagram_url}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Facebook</label>
              <input
                type="url"
                className="input"
                placeholder="https://facebook.com/mimosasparetreat"
                value={settings.facebook_url}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
              />
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
