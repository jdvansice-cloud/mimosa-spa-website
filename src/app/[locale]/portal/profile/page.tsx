'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  ArrowLeft,
  Loader2,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { usePortalStore } from '@/lib/portal/store'

// Client profile data from API
interface ClientProfile {
  Id: string
  FirstName: string
  LastName: string
  Email: string
  MobilePhone: string
  HomePhone: string | null
  BirthDate: string | null
  AddressLine1: string | null
  AddressLine2: string | null
  City: string | null
  State: string | null
  PostalCode: string | null
  Country: string | null
  EmergencyContactInfoName: string | null
  EmergencyContactInfoPhone: string | null
  EmergencyContactInfoEmail: string | null
  CustomClientFields: Array<{
    Id: number
    DataType: string
    Name: string
    Value: string
  }>
}

// Custom field definition from Mindbody
interface CustomFieldDefinition {
  Id: number
  DataType: string
  Name: string
}

export default function ProfileEditPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string || 'es'

  type SupabaseClient = ReturnType<typeof import('@/lib/supabase/client').getClient>
  const supabaseRef = useRef<SupabaseClient | null>(null)
  const { session, client, mindbodyClientId, logout } = usePortalStore()

  // Lazy load Supabase client
  const getSupabase = (): SupabaseClient => {
    if (!supabaseRef.current) {
      const { getClient } = require('@/lib/supabase/client')
      supabaseRef.current = getClient()
    }
    return supabaseRef.current as SupabaseClient
  }

  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [resolvedClientId, setResolvedClientId] = useState<number | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    MobilePhone: '',
    HomePhone: '',
    AddressLine1: '',
    AddressLine2: '',
    City: '',
    State: '',
    PostalCode: '',
    Country: 'Panama',
    // Electronic invoicing fields (RUC and DV)
    RUC: '',
    DV: ''
  })

  // Check auth and resolve client ID
  useEffect(() => {
    const initializeProfile = async () => {
      const supabase = getSupabase()
      const { data: { session: currentSession } } = await supabase.auth.getSession()

      if (!currentSession) {
        router.push(`/${locale}/portal/login`)
        return
      }

      // Resolve the client ID - first check store, then fetch from Supabase
      let clientId = mindbodyClientId

      if (!clientId) {
        console.log('Profile page: No clientId in store, fetching from Supabase...')
        try {
          const response = await fetch('/api/portal/client-id')
          if (response.ok) {
            const data = await response.json()
            if (data.clientId) {
              clientId = data.clientId
              console.log('Profile page: Got clientId from Supabase:', clientId)
            }
          }
        } catch (err) {
          console.error('Error fetching client ID:', err)
        }
      }

      if (clientId) {
        setResolvedClientId(clientId)
      } else {
        setError('No se encontró ID de cliente. Por favor inicia sesión nuevamente.')
        setIsLoading(false)
      }
    }

    initializeProfile()
  }, [router, locale, mindbodyClientId])

  // Fetch profile data when we have a resolved client ID
  useEffect(() => {
    if (resolvedClientId) {
      fetchProfileWithId(resolvedClientId)
    }
  }, [resolvedClientId])

  const fetchProfileWithId = async (clientId: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/portal/profile?clientId=${clientId}&includeCustomFields=true`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar perfil')
      }

      console.log('Profile page - Received client data:', {
        Id: data.client?.Id,
        FirstName: data.client?.FirstName,
        LastName: data.client?.LastName,
        Email: data.client?.Email,
        MobilePhone: data.client?.MobilePhone,
        AddressLine1: data.client?.AddressLine1
      })

      setProfile(data.client)
      setCustomFields(data.customFieldDefinitions || [])

      // Populate form with profile data
      const p = data.client as ClientProfile

      // Find RUC and DV from custom fields
      const rucField = p.CustomClientFields?.find(f =>
        f.Name.toLowerCase().includes('ruc')
      )
      const dvField = p.CustomClientFields?.find(f =>
        f.Name.toLowerCase().includes('dv')
      )

      setFormData({
        FirstName: p.FirstName || '',
        LastName: p.LastName || '',
        Email: p.Email || '',
        MobilePhone: p.MobilePhone || '',
        HomePhone: p.HomePhone || '',
        AddressLine1: p.AddressLine1 || '',
        AddressLine2: p.AddressLine2 || '',
        City: p.City || '',
        State: p.State || '',
        PostalCode: p.PostalCode || '',
        Country: p.Country || 'Panama',
        RUC: rucField?.Value || '',
        DV: dvField?.Value || ''
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resolvedClientId || !profile) return

    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Find custom field IDs for RUC and DV
      const rucFieldDef = customFields.find(f =>
        f.Name.toLowerCase().includes('ruc')
      )
      const dvFieldDef = customFields.find(f =>
        f.Name.toLowerCase().includes('dv')
      )

      // Build custom fields array for update
      const customClientFields: Array<{ Id: number; Value: string }> = []

      if (rucFieldDef && formData.RUC) {
        customClientFields.push({ Id: rucFieldDef.Id, Value: formData.RUC })
      }
      if (dvFieldDef && formData.DV) {
        customClientFields.push({ Id: dvFieldDef.Id, Value: formData.DV })
      }

      const updates = {
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email,
        MobilePhone: formData.MobilePhone,
        HomePhone: formData.HomePhone || undefined,
        AddressLine1: formData.AddressLine1 || undefined,
        AddressLine2: formData.AddressLine2 || undefined,
        City: formData.City || undefined,
        State: formData.State || undefined,
        PostalCode: formData.PostalCode || undefined,
        Country: formData.Country || undefined,
        CustomClientFields: customClientFields.length > 0 ? customClientFields : undefined
      }

      const response = await fetch('/api/portal/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: resolvedClientId,
          updates
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar perfil')
      }

      setSuccess('Perfil actualizado correctamente')

      // Refresh profile data
      if (resolvedClientId) {
        await fetchProfileWithId(resolvedClientId)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear success message on edit
    setSuccess(null)
  }

  // Loading state while resolving client ID
  if (!resolvedClientId && isLoading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cream to-white">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-beige-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/${locale}/portal`)}
              className="p-2 hover:bg-beige-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-warm-gray" />
            </button>
            <Image
              src="/logo.png"
              alt="Mimosa Spa Retreat"
              width={100}
              height={33}
              className="h-8 w-auto"
            />
          </div>
          <h1 className="text-lg font-semibold text-dark">Editar Perfil</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                {success}
              </div>
            )}

            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-beige-200 overflow-hidden">
              <div className="p-4 border-b border-beige-200 bg-beige-50">
                <h2 className="font-semibold text-dark flex items-center gap-2">
                  <User className="w-5 h-5 text-gold" />
                  Información Personal
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="FirstName"
                      value={formData.FirstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-beige-200 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      name="LastName"
                      value={formData.LastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-beige-200 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-beige-200 overflow-hidden">
              <div className="p-4 border-b border-beige-200 bg-beige-50">
                <h2 className="font-semibold text-dark flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gold" />
                  Contacto
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">
                      Correo Electrónico *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                      <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-beige-200 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">
                      Teléfono Móvil / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                      <input
                        type="tel"
                        name="MobilePhone"
                        value={formData.MobilePhone}
                        onChange={handleChange}
                        required
                        placeholder="50766124546"
                        className="w-full pl-12 pr-4 py-3 border border-beige-200 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">
                      Teléfono de Casa
                    </label>
                    <input
                      type="tel"
                      name="HomePhone"
                      value={formData.HomePhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-beige-200 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl border border-beige-200 overflow-hidden">
              <div className="p-4 border-b border-beige-200 bg-beige-50">
                <h2 className="font-semibold text-dark flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold" />
                  Dirección
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">
                    Dirección Línea 1
                  </label>
                  <input
                    type="text"
                    name="AddressLine1"
                    value={formData.AddressLine1}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-beige-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">
                    Dirección Línea 2
                  </label>
                  <input
                    type="text"
                    name="AddressLine2"
                    value={formData.AddressLine2}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-beige-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="City"
                      value={formData.City}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-beige-200 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">
                      Provincia / Estado
                    </label>
                    <input
                      type="text"
                      name="State"
                      value={formData.State}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-beige-200 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      name="PostalCode"
                      value={formData.PostalCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-beige-200 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Electronic Invoicing - RUC/DV */}
            <div className="bg-white rounded-xl border border-beige-200 overflow-hidden">
              <div className="p-4 border-b border-beige-200 bg-gradient-to-r from-gold/10 to-gold/5">
                <h2 className="font-semibold text-dark flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gold" />
                  Facturación Electrónica
                </h2>
                <p className="text-sm text-warm-gray mt-1">
                  Complete estos datos si requiere factura electrónica
                </p>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">
                      RUC (Registro Único de Contribuyente)
                    </label>
                    <input
                      type="text"
                      name="RUC"
                      value={formData.RUC}
                      onChange={handleChange}
                      placeholder="Ej: 8-123-456"
                      className="w-full px-4 py-3 border border-beige-200 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    />
                    <p className="text-xs text-warm-gray mt-1">
                      Número de identificación fiscal
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">
                      DV (Dígito Verificador)
                    </label>
                    <input
                      type="text"
                      name="DV"
                      value={formData.DV}
                      onChange={handleChange}
                      placeholder="Ej: 12"
                      maxLength={2}
                      className="w-full px-4 py-3 border border-beige-200 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                    />
                    <p className="text-xs text-warm-gray mt-1">
                      Dígito de verificación (2 dígitos)
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Nota:</strong> El RUC y DV son requeridos para la emisión de facturas electrónicas
                    según la normativa de la DGI de Panamá.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => router.push(`/${locale}/portal`)}
                className="px-6 py-3 text-warm-gray hover:text-dark transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-gold text-dark font-semibold
                         rounded-xl hover:bg-gold/90 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
