'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Mail, ArrowRight, Loader2, User, UserPlus, Phone, RefreshCw } from 'lucide-react'
import { OtpInput } from '@/components/ui'
import { useBookingStore } from '@/lib/booking/store'
import type { MindbodyClient, PromotionWithServices } from '@/types/booking'

type AuthState = 'email' | 'sending' | 'otp' | 'verifying' | 'select-client' | 'register'

interface ClientOption {
  Id: number
  FirstName: string
  LastName: string
  Email: string | null
  MobilePhone: string | null
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

  const [email, setEmail] = useState('')
  const [authState, setAuthState] = useState<AuthState>('email')
  const [isVerifying, setIsVerifying] = useState(false)
  const [clientData, setClientData] = useState<{ clientId: number; firstName?: string; lastName?: string } | null>(null)
  const [availableClients, setAvailableClients] = useState<ClientOption[]>([])
  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  // Lazy load Supabase client
  const getSupabase = (): SupabaseClient => {
    if (!supabaseRef.current) {
      const { getClient } = require('@/lib/supabase/client')
      supabaseRef.current = getClient()
    }
    return supabaseRef.current as SupabaseClient
  }

  // Check for existing session on mount and handle magic link callback
  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()

      // Check for clientId in URL (from magic link callback)
      const urlClientId = searchParams.get('clientId')
      // Check for serviceId in URL (pre-selected service from menu)
      const serviceId = searchParams.get('serviceId')
      // Check for promotionId in URL (pre-selected promotion)
      const promotionId = searchParams.get('promotionId')

      if (session?.user) {
        // User is logged in
        let mindbodyClientId: number | null = null

        // Priority 1: URL clientId (from magic link)
        if (urlClientId) {
          const parsed = parseInt(urlClientId, 10)
          if (!isNaN(parsed)) {
            mindbodyClientId = parsed
          }
        }

        // Priority 2: Fetch from Supabase profile (authoritative source)
        if (!mindbodyClientId) {
          try {
            const clientIdResponse = await fetch('/api/portal/client-id')
            if (clientIdResponse.ok) {
              const clientIdData = await clientIdResponse.json()
              if (clientIdData.clientId) {
                mindbodyClientId = clientIdData.clientId
                console.log('AuthStep: Got clientId from Supabase profile:', mindbodyClientId)
              }
            }
          } catch (err) {
            console.error('Error fetching client ID from profile:', err)
          }
        }

        // Priority 3: User metadata
        if (!mindbodyClientId && session.user.user_metadata?.mindbody_client_id) {
          mindbodyClientId = session.user.user_metadata.mindbody_client_id
        }

        if (mindbodyClientId) {
          // Fetch client info and proceed
          try {
            const response = await fetch(`/api/portal/profile?clientId=${mindbodyClientId}`)
            if (response.ok) {
              const data = await response.json()
              setClientInfo(data.client as MindbodyClient)

              // If there's a pre-selected promotionId, fetch and load the promotion
              if (promotionId) {
                try {
                  const promotionResponse = await fetch(`/api/promotions/${promotionId}/with-services`)
                  if (promotionResponse.ok) {
                    const promotionData = await promotionResponse.json()
                    const promotionWithServices = promotionData.data as PromotionWithServices
                    if (promotionWithServices && promotionWithServices.services && promotionWithServices.services.length > 0) {
                      loadPromotion(promotionWithServices)
                      // loadPromotion sets step to 'addons', but we need location first
                      setStep('location')
                      return
                    }
                  }
                } catch (err) {
                  console.error('Error fetching promotion for pre-selection:', err)
                }
              }

              // If there's a pre-selected serviceId, fetch and add the service
              if (serviceId) {
                try {
                  const servicesResponse = await fetch('/api/mindbody/services?type=all&includeOffline=true')
                  const servicesData = await servicesResponse.json()
                  if (servicesData.services) {
                    const parsedServiceId = parseInt(serviceId, 10)
                    const service = servicesData.services.find((s: { Id: number }) => s.Id === parsedServiceId)
                    if (service) {
                      addService(service)
                      // Skip to location step (auth is done, service is pre-selected)
                      setStep('location')
                      return
                    }
                  }
                } catch (err) {
                  console.error('Error fetching service for pre-selection:', err)
                }
              }

              nextStep()
              return
            }
          } catch (err) {
            console.error('Error fetching client:', err)
          }
        }

        // Has session but no linked client - pre-fill email
        if (session.user.email) {
          setEmail(session.user.email)
        }
      }
    }

    checkSession()
  }, [setClientInfo, nextStep, setStep, addService, loadPromotion, searchParams])

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico')
      return
    }

    if (!email.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido')
      return
    }

    setAuthState('sending')
    setError(null)
    setLoading(true)

    try {
      // First verify the email exists in Mindbody
      const response = await fetch('/api/portal/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.notFound) {
          // Client not found - show registration
          setRegistrationData(prev => ({ ...prev, email }))
          setAuthState('register')
          setLoading(false)
          return
        }
        throw new Error(data.error || 'Error al verificar correo')
      }

      if (data.multiple) {
        // Multiple clients found - show selection
        setAvailableClients(data.clients)
        setAuthState('select-client')
        setLoading(false)
        return
      }

      // Single client found - send OTP code
      setClientData({ clientId: data.clientId, firstName: data.firstName, lastName: data.lastName })
      await sendOtp(email, data.clientId, data.firstName, data.lastName)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
      setAuthState('email')
      setLoading(false)
    }
  }

  const sendOtp = async (
    userEmail: string,
    clientId: number,
    firstName?: string,
    lastName?: string
  ) => {
    try {
      const supabase = getSupabase()

      const { error: authError } = await supabase.auth.signInWithOtp({
        email: userEmail,
        options: {
          data: {
            mindbody_client_id: clientId,
            first_name: firstName,
            last_name: lastName
          }
        }
      })

      if (authError) {
        throw new Error(authError.message)
      }

      setAuthState('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar código')
      setAuthState('email')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectClient = async (client: ClientOption) => {
    if (!client.Email) {
      setError('Este cliente no tiene correo electrónico registrado')
      return
    }

    setLoading(true)
    setError(null)
    setClientData({ clientId: client.Id, firstName: client.FirstName, lastName: client.LastName })
    await sendOtp(client.Email, client.Id, client.FirstName, client.LastName)
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
      // Create client in Mindbody
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
          searchType: 'email'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar')
      }

      // Client created - now send OTP code
      setClientData({ clientId: data.client.Id, firstName, lastName })
      await sendOtp(regEmail, data.client.Id, firstName, lastName)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEmailSubmit()
    }
  }

  const handleVerifyOtp = async (code: string) => {
    setIsVerifying(true)
    setError(null)

    try {
      const supabase = getSupabase()
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      })

      if (verifyError) {
        throw new Error(verifyError.message)
      }

      // Save profile with mindbody_client_id (fire-and-forget)
      if (clientData?.clientId) {
        fetch('/api/portal/auth/save-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientId: clientData.clientId }),
        }).catch(err => console.error('Error saving profile:', err))
      }

      // Fetch client info from Mindbody and proceed to next step
      if (clientData?.clientId) {
        const response = await fetch(`/api/portal/profile?clientId=${clientData.clientId}`)
        if (response.ok) {
          const data = await response.json()
          setClientInfo(data.client as MindbodyClient)

          // Check for pre-selected promotion
          const promotionId = searchParams.get('promotionId')
          if (promotionId) {
            try {
              const promotionResponse = await fetch(`/api/promotions/${promotionId}/with-services`)
              if (promotionResponse.ok) {
                const promotionData = await promotionResponse.json()
                const promotionWithServices = promotionData.data as PromotionWithServices
                if (promotionWithServices && promotionWithServices.services && promotionWithServices.services.length > 0) {
                  loadPromotion(promotionWithServices)
                  setStep('location')
                  return
                }
              }
            } catch (err) {
              console.error('Error fetching promotion:', err)
            }
          }

          // Check for pre-selected service
          const serviceId = searchParams.get('serviceId')
          if (serviceId) {
            try {
              const servicesResponse = await fetch('/api/mindbody/services?type=all&includeOffline=true')
              const servicesData = await servicesResponse.json()
              if (servicesData.services) {
                const parsedServiceId = parseInt(serviceId, 10)
                const service = servicesData.services.find((s: { Id: number }) => s.Id === parsedServiceId)
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
          return
        }
      }

      // Fallback - proceed to next step
      nextStep()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido')
      setIsVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    setError(null)
    setIsVerifying(false)

    try {
      const supabase = getSupabase()
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: clientData ? {
            mindbody_client_id: clientData.clientId,
            first_name: clientData.firstName,
            last_name: clientData.lastName
          } : undefined
        }
      })

      if (authError) {
        throw new Error(authError.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reenviar código')
    }
  }

  // OTP verification step
  if (authState === 'otp') {
    return (
      <div className="auth-step flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pb-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-gold" />
            </div>

            <h2 className="text-lg font-bold text-dark mb-2">
              Ingresa tu código
            </h2>

            <p className="text-sm text-warm-gray mb-4">
              Enviamos un código de 6 dígitos a<br />
              <span className="font-semibold text-dark">{email}</span>
            </p>

            <OtpInput
              onComplete={handleVerifyOtp}
              disabled={isVerifying}
              error={!!error}
            />

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
                  setAuthState('email')
                  setEmail('')
                  setError(null)
                  setIsVerifying(false)
                  setClientData(null)
                }}
                className="text-warm-gray hover:text-dark transition-colors text-sm"
              >
                ← Usar otro correo
              </button>
            </div>
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
              <h2 className="text-lg font-bold text-dark mb-0.5">
                Selecciona tu Perfil
              </h2>
              <p className="text-xs text-warm-gray">
                Encontramos varias cuentas asociadas a este correo
              </p>
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
                  disabled={!client.Email || isLoading}
                  className={`w-full p-3 bg-white border rounded-xl transition-all
                           flex items-center gap-3 text-left
                           ${client.Email
                             ? 'border-beige-200 hover:border-gold hover:shadow-md cursor-pointer'
                             : 'border-gray-200 opacity-50 cursor-not-allowed'}`}
                >
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">
                      {client.FirstName} {client.LastName}
                    </p>
                    <p className="text-xs text-warm-gray">
                      {client.Email || 'Sin correo registrado'}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setAvailableClients([])
                setAuthState('email')
                setError(null)
              }}
              className="w-full py-2 text-sm text-warm-gray hover:text-dark transition-colors"
            >
              ← Usar otro correo
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
              <h2 className="text-lg font-bold text-dark mb-0.5">
                Crear Cuenta
              </h2>
              <p className="text-xs text-warm-gray">
                No encontramos una cuenta con ese correo. Completa tus datos.
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-dark mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={registrationData.firstName}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-beige-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                             transition-all"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={registrationData.lastName}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-beige-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                             transition-all"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-dark mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                  <input
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2.5 border border-beige-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                             transition-all"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-dark mb-1">
                  Teléfono / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                  <input
                    type="tel"
                    value={registrationData.phone}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2.5 border border-beige-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                             transition-all"
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
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    Crear Cuenta y Continuar
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setAuthState('email')
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

  // Main email input form
  return (
    <div className="auth-step flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full
                          flex items-center justify-center mx-auto mb-2 shadow-md">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-dark mb-0.5">
              ¡Bienvenido!
            </h2>
            <p className="text-xs text-warm-gray">
              Ingresa tu correo electrónico para comenzar tu reserva
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-4 p-3 bg-beige-50 rounded-xl">
            <p className="text-xs font-medium text-dark mb-1.5">Al iniciar sesión podrás:</p>
            <ul className="text-xs text-warm-gray space-y-0.5">
              <li>• Ver tu historial de citas y compras</li>
              <li>• Gestionar tus próximas reservaciones</li>
              <li>• Recibir ofertas exclusivas</li>
              <li>• Agilizar futuras reservas</li>
            </ul>
          </div>

          {/* Email Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={authState === 'sending'}
              className="w-full pl-10 pr-3 py-3 border-2 border-beige-200 rounded-xl
                       text-sm focus:outline-none focus:ring-2 focus:ring-gold/50
                       focus:border-gold transition-all disabled:opacity-50"
              placeholder="correo@ejemplo.com"
              autoFocus
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleEmailSubmit}
            disabled={authState === 'sending' || !email.trim()}
            className="w-full mt-4 py-3 bg-gradient-to-r from-gold to-gold/90 text-dark
                     font-semibold rounded-xl hover:shadow-lg transition-all text-sm
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {authState === 'sending' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Info text */}
          <p className="mt-3 text-center text-xs text-warm-gray">
            Te enviaremos un código de verificación a tu correo
          </p>
        </div>
      </div>
    </div>
  )
}

// Loading fallback
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

// Export with Suspense wrapper for useSearchParams
export function AuthStep() {
  return (
    <Suspense fallback={<AuthStepLoading />}>
      <AuthStepContent />
    </Suspense>
  )
}
