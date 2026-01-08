'use client'

import { useState } from 'react'
import { Save, Globe, Phone, Clock, MessageCircle } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

export default function AdminConfigPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setIsSaving(false)
    alert('Configuración guardada correctamente')
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
                  defaultValue="+507 6000-0001"
                />
              </div>
              <div>
                <label className="label">Teléfono San Francisco</label>
                <input
                  type="tel"
                  className="input"
                  placeholder="+507 6000-0002"
                  defaultValue="+507 6000-0002"
                />
              </div>
            </div>
            <div>
              <label className="label">Correo Electrónico</label>
              <input
                type="email"
                className="input"
                placeholder="info@mimosaretreat.com"
                defaultValue="info@mimosaretreat.com"
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
                placeholder="507XXXXXXXX"
                defaultValue="507XXXXXXXX"
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
                defaultValue="Hola, me gustaría obtener información sobre sus servicios."
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
                  <input type="time" className="input" defaultValue="09:00" />
                  <span className="text-warm-gray">a</span>
                  <input type="time" className="input" defaultValue="20:00" />
                </div>
              </div>
              <div>
                <label className="label">Sábados y Domingos</label>
                <div className="flex items-center gap-2">
                  <input type="time" className="input" defaultValue="09:00" />
                  <span className="text-warm-gray">a</span>
                  <input type="time" className="input" defaultValue="18:00" />
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
                defaultValue="https://instagram.com/mimosasparetreat"
              />
            </div>
            <div>
              <label className="label">Facebook</label>
              <input
                type="url"
                className="input"
                placeholder="https://facebook.com/mimosasparetreat"
                defaultValue="https://facebook.com/mimosasparetreat"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
