'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Mail, MessageCircle, ArrowRight, Loader2, User, UserPlus, Phone, RefreshCw } from 'lucide-react'
import { OtpInput } from '@/components/ui'
import { OtpChannelChoice } from '@/components/auth'
import { useBookingStore } from '@/lib/booking/store'
import type { MindbodyClient, PromotionWithServices } from '@/types/booking'

type AuthState =
  | 'credential'
  | 'sending'
  | 'select-client'
  | 'channel-choice'
  | 'otp'
  | 'verifying'
  | 'register'

type OtpChannel = 'email' | 'whatsapp'

interface ClientOption {
  Id: number
  FirstName: string
  LastName: string
  displayName: string
  Email: string | null
  MobilePhone: string | null
}

interface SelectedClient {
  clientId: number
  clientName: string
  email: string | null
  phone: string | null
}

function AuthStepContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = params.locale as string || 'es'

  const {
    setClientInfo,
    nextStep,
    setStep,
    addService,
    loadPromotion,
    setLoading,
    setError,
    isLoading,
    error,
  } = useBookingStore()

  type SupabaseClient = ReturnType<typeof import('@/lib/supabase/client').getClient>
  const supabaseRef = useRef<SupabaseClient | null>(null)

  const [credential, setCredential] = useState('')
  const [authState, setAuthState] = useState<AuthState>('credential')
  const [isVerifying, setIsVerifying] = useState(false)
  const [availableClients, setAvailableClients] = useState<ClientOption[]>([])
  const [selectedClient, setSelectedClient] = useState<SelectedClient | null>(null)
  const [otpChannel, setOtpChannel] = useState<OtpChannel | null>(null)
  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const getSupabase = (): SupabaseClient => {
    if (!supabaseRef.current) {
      const { getClient } = require('@/lib/supabase/client')
      supabaseRef.current = getClient()
    }
    return supabaseRef.current as SupabaseClient
  }

  // Handle pre-selected service/promotion and proceed to next step after auth
  const proceedAfterAuth = async (clientId: number) => {
    const promotionId = searchParams.get('promotionId')
    const serviceId = searchParams.get('serviceId')

    if (promotionId) {
      try {
        const response = await fetch(`/api/promotions/${promotionId}/with-services`)
        if (response.ok) {
          const data = await response.json()
          const promo = data.data as PromotionWithServices
          if (promo && promo.services && promo.services.length > 0) {
            loadPromotion(promo)
            setStep('location')
            return
          }
        }
      } catch (err) {
        console.error('Error fetching promotion:', err)
      }
    }

    if (serviceId) {
      try {
        const response = await fetch('/api/mindbody/services?type=all&includeOffline=true')
        const data = await response.json()
        if (data.services) {
          const parsedId = parseInt(serviceId, 10)
          const service = data.services.find((s: { Id: number }) => s.Id === parsedId)
          if (service) {
            addService(service)
            setStep('location')
            return
          }
        }
      } catch (err) {
        console.error('Error fetching service:', err)
      }
    }

    nextStep()
  }

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        let mindbodyClientId: number | null = null

        // Fetch from Supabase profile (authoritative)
        try {
          const response = await fetch('/api/portal/client-id')
          if (response.ok) {
            const data = await response.json()
            if (data.clientId) mindbodyClientId = data.clientId
          }
        } catch (err) {
          console.error('Error fetching client ID:', err)
        }

        // Fallback to user metadata
        if (!mindbodyClientId && session.user.user_metadata?.mindbody_client_id) {
          mindbodyClientId = session.user.user_metadata.mindbody_client_id
        }

        if (mindbodyClientId) {
          try {
            const response = await fetch(`/api/portal/profile?clientId=${mindbodyClientId}`)
            if (response.ok) {
              const data = await response.json()
              setClientInfo(data.client as MindbodyClient)
              await proceedAfterAuth(mindbodyClientId)
              return
            }
          } catch (err) {
            console.error('Error fetching client:', err)
          }
        }

        if (session.user.email) {
          setCredential(session.user.email)
        }
      }
    }

    checkSession()
  }, [setClientInfo, nextStep, setStep, addService, loadPromotion, searchParams])

  const handleCredentialSubmit = async () => {
    const trimmed = credential.trim().replace(/\D/g, '')
    if (!trimmed) {
      setError('Ingresa tu número de teléfono')
      return
    }
    if (trimmed.length < 10) {
      setError('Escribe el número completo con código de país sin el + (ej: Panamá 50766124546 · EE.UU. 12125551234)')
      return
    }

    setAuthState('sending')
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/portal/auth/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: trimmed }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al buscar cuenta')
      }

      if (data.notFound || data.clients.length === 0) {
        setError('Número no encontrado. Escribe el número completo con código de país sin el + (ej: Panamá 50766124546 · EE.UU. 12125551234)')
        setAuthState('credential')
        return
      }

      if (data.clients.length > 1) {
        setAvailableClients(data.clients)
        setAuthState('select-client')
        return
      }

      const client = data.clients[0]
      setSelectedClient({
        clientId: client.Id,
        clientName: client.displayName || `${client.FirstName} ${client.LastName}`.trim(),
        email: client.Email,
        phone: client.MobilePhone,
      })
      setAuthState('channel-choice')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
      setAuthState('credential')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectClient = (client: ClientOption) => {
    setSelectedClient({
      clientId: client.Id,
      clientName: client.displayName || `${client.FirstName} ${client.LastName}`.trim(),
      email: client.Email,
      phone: client.MobilePhone,
    })
    setAvailableClients([])
    setAuthState('channel-choice')
  }

  const handleChooseEmail = async () => {
    if (!selectedClient?.email) return
    setLoading(true)
    setError(null)

    try {
      const supabase = getSupabase()
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: selectedClient.email,
        options: { data: { mindbody_client_id: selectedClient.clientId } },
      })
      if (authError) throw new Error(authError.message)
      setOtpChannel('email')
      setAuthState('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar código')
    } finally {
      setLoading(false)
    }
  }

  const handleChooseWhatsApp = async () => {
    if (!selectedClient?.phone) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/portal/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: selectedClient.phone,
          clientId: selectedClient.clientId,
          clientName: selectedClient.clientName,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Error al enviar código')
      setOtpChannel('whatsapp')
      setAuthState('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar código por WhatsApp')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (code: string) => {
    if (!selectedClient) return
    setIsVerifying(true)
    setError(null)

    try {
      if (otpChannel === 'email') {
        const supabase = getSupabase()
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email: selectedClient.email!,
          token: code,
          type: 'email',
        })
        if (verifyError) throw new Error(verifyError.message)

        // Save profile and link (fire-and-forget)
        Promise.all([
          fetch('/api/portal/auth/save-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId: selectedClient.clientId }),
          }),
          fetch('/api/portal/auth/link-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              credential: selectedClient.email,
              credentialType: 'email',
              clientId: selectedClient.clientId,
              clientName: selectedClient.clientName,
            }),
          }),
        ]).catch(err => console.error('Error saving profile/link:', err))

      } else {
        const response = await fetch('/api/portal/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: selectedClient.phone,
            otp_code: code,
            email: selectedClient.email,
            clientId: selectedClient.clientId,
            clientName: selectedClient.clientName,
          }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Código incorrecto')

        const supabase = getSupabase()
        const { error: sessionError } = await supabase.auth.verifyOtp({
          token_hash: data.token_hash,
          type: 'magiclink',
        })
        if (sessionError) throw new Error(sessionError.message)
      }

      // Fetch client info and proceed
      const profileResponse = await fetch(`/api/portal/profile?clientId=${selectedClient.clientId}`)
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setClientInfo(profileData.client as MindbodyClient)
      }

      await proceedAfterAuth(selectedClient.clientId)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido')
      setIsVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    if (!selectedClient) return
    setError(null)
    setIsVerifying(false)

    try {
      if (otpChannel === 'email') {
        const supabase = getSupabase()
        const { error: authError } = await supabase.auth.signInWithOtp({
          email: selectedClient.email!,
          options: { data: { mindbody_client_id: selectedClient.clientId } },
        })
        if (authError) throw new Error(authError.message)
      } else {
        const response = await fetch('/api/portal/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: selectedClient.phone,
            clientId: selectedClient.clientId,
            clientName: selectedClient.clientName,
          }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Error al reenviar')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reenviar código')
    }
  }

  const handleRegistration = async () => {
    const { firstName, lastName, email: regEmail, phone } = registrationData

    if (!firstName || !lastName || !regEmail || !phone) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/mindbody/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          firstName,
          lastName,
          email: regEmail,
          phone,
          searchText: regEmail,
          searchType: 'email',
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Error al registrar')

      setSelectedClient({
        clientId: data.client.Id,
        clientName: `${firstName} ${lastName}`.trim(),
        email: regEmail,
        phone,
      })
      setAuthState('channel-choice')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCredentialSubmit()
  }

  // OTP step
  if (authState === 'otp') {
    const channelLabel = otpChannel === 'email' ? selectedClient?.email : selectedClient?.phone
    const channelBg = otpChannel === 'email' ? 'bg-gold/10' : 'bg-green-50'
    const ChannelIcon = otpChannel === 'email'
      ? <Mail className="w-7 h-7 text-gold" />
      : <MessageCircle className="w-7 h-7 text-green-600" />

    return (
      <div className="auth-step flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pb-4">
          <div className="max-w-md mx-auto text-center">
            <div className={`w-14 h-14 ${channelBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
              {ChannelIcon}
            </div>

            <h2 className="text-lg font-bold text-dark mb-2">Ingresa tu código</h2>

            <p className="text-sm text-warm-gray mb-4">
              {otpChannel === 'email' ? 'Enviamos un código de 6 dígitos a' : 'Enviamos un código por WhatsApp a'}<br />
              <span className="font-semibold text-dark">{channelLabel}</span>
            </p>

            <OtpInput onComplete={handleVerifyOtp} disabled={isVerifying} error={!!error} />

            {isVerifying && (
              <div className="mt-4 flex items-center justify-center gap-2 text-warm-gray">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Verificando...</span>
              </div>
            )}

            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="mt-4 space-y-2">
              <button
                onClick={handleResendOtp}
                disabled={isVerifying}
                className="flex items-center justify-center gap-1.5 mx-auto text-gold hover:text-gold/80 font-medium transition-colors text-sm disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reenviar código
              </button>
              <button
                onClick={() => {
                  setAuthState('channel-choice')
                  setOtpChannel(null)
                  setError(null)
                  setIsVerifying(false)
                }}
                className="text-warm-gray hover:text-dark transition-colors text-sm"
              >
                ← Cambiar canal
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Channel choice step
  if (authState === 'channel-choice' && selectedClient) {
    return (
      <div className="auth-step flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pb-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full
                            flex items-center justify-center mx-auto mb-2 shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-dark mb-0.5">Verificar identidad</h2>
              <p className="text-xs text-warm-gray">
                Hola <span className="font-medium text-dark">{selectedClient.clientName}</span>
              </p>
            </div>

            {error && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <OtpChannelChoice
              email={selectedClient.email}
              phone={selectedClient.phone}
              isLoading={isLoading}
              onChooseEmail={handleChooseEmail}
              onChooseWhatsApp={handleChooseWhatsApp}
            />

            <button
              onClick={() => {
                setAuthState('credential')
                setSelectedClient(null)
                setError(null)
              }}
              className="w-full mt-3 py-2 text-sm text-warm-gray hover:text-dark transition-colors"
            >
              ← Usar otro correo o teléfono
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Multiple clients selection
  if (authState === 'select-client') {
    return (
      <div className="auth-step flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pb-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full
                            flex items-center justify-center mx-auto mb-2 shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-dark mb-0.5">Selecciona tu Perfil</h2>
              <p className="text-xs text-warm-gray">Encontramos varias cuentas asociadas a este dato</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3 mb-4">
              {availableClients.map((client) => (
                <button
                  key={client.Id}
                  onClick={() => handleSelectClient(client)}
                  disabled={isLoading}
                  className="w-full p-3 bg-white border border-beige-200 rounded-xl transition-all
                           flex items-center gap-3 text-left hover:border-gold hover:shadow-md cursor-pointer"
                >
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">{client.displayName}</p>
                    <p className="text-xs text-warm-gray">{client.Email || client.MobilePhone || '—'}</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setAvailableClients([])
                setAuthState('credential')
                setError(null)
              }}
              className="w-full py-2 text-sm text-warm-gray hover:text-dark transition-colors"
            >
              ← Usar otro correo o teléfono
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Registration form
  if (authState === 'register') {
    return (
      <div className="auth-step flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pb-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full
                            flex items-center justify-center mx-auto mb-2 shadow-md">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-dark mb-0.5">Crear Cuenta</h2>
              <p className="text-xs text-warm-gray">No encontramos una cuenta con ese dato. Completa tus datos.</p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-dark mb-1">Nombre</label>
                  <input
                    type="text"
                    value={registrationData.firstName}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-beige-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark mb-1">Apellido</label>
                  <input
                    type="text"
                    value={registrationData.lastName}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-beige-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-dark mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                  <input
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2.5 border border-beige-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-dark mb-1">Teléfono / WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                  <input
                    type="tel"
                    value={registrationData.phone}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2.5 border border-beige-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                    placeholder="50766124546"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="mt-4 space-y-2">
              <button
                onClick={handleRegistration}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-gold to-gold/90 text-dark
                         font-semibold rounded-xl hover:shadow-lg transition-all text-sm
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Creando cuenta...</>
                ) : (
                  <>Crear Cuenta y Continuar<ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <button
                onClick={() => {
                  setAuthState('credential')
                  setError(null)
                }}
                className="w-full py-2 text-sm text-warm-gray hover:text-dark transition-colors"
              >
                ← Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main credential input form
  return (
    <div className="auth-step flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full
                          flex items-center justify-center mx-auto mb-2 shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-dark mb-0.5">¡Bienvenido!</h2>
            <p className="text-xs text-warm-gray">
              Ingresa tu número de teléfono para comenzar tu reserva
            </p>
          </div>

          <div className="mb-4 p-3 bg-beige-50 rounded-xl">
            <p className="text-xs font-medium text-dark mb-1.5">Al iniciar sesión podrás:</p>
            <ul className="text-xs text-warm-gray space-y-0.5">
              <li>• Ver tu historial de citas y compras</li>
              <li>• Gestionar tus próximas reservaciones</li>
              <li>• Recibir ofertas exclusivas</li>
              <li>• Agilizar futuras reservas</li>
            </ul>
          </div>

          <div>
            <label className="block text-xs font-medium text-dark mb-1.5">
              Número de teléfono con código de país
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
              <input
                type="tel"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={authState === 'sending'}
                className="w-full pl-10 pr-3 py-3 border-2 border-beige-200 rounded-xl
                         text-sm focus:outline-none focus:ring-2 focus:ring-gold/50
                         focus:border-gold transition-all disabled:opacity-50"
                placeholder="50766124546"
                autoFocus
              />
            </div>
            <p className="mt-1 text-xs text-warm-gray">Sin el signo + · Panamá: 50766124546 · EE.UU.: 12125551234</p>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleCredentialSubmit}
            disabled={authState === 'sending' || !credential.trim()}
            className="w-full mt-4 py-3 bg-gradient-to-r from-gold to-gold/90 text-dark
                     font-semibold rounded-xl hover:shadow-lg transition-all text-sm
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {authState === 'sending' ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Buscando...</>
            ) : (
              <>Continuar<ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          <p className="mt-3 text-center text-xs text-warm-gray">
            Te enviaremos un código de verificación
          </p>
        </div>
      </div>
    </div>
  )
}

function AuthStepLoading() {
  return (
    <div className="auth-step flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="max-w-md mx-auto text-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gold mx-auto mb-3" />
          <p className="text-sm text-warm-gray">Cargando...</p>
        </div>
      </div>
    </div>
  )
}

export function AuthStep() {
  return (
    <Suspense fallback={<AuthStepLoading />}>
      <AuthStepContent />
    </Suspense>
  )
}
