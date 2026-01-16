'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Mail, ArrowRight, Loader2, CheckCircle, User, UserPlus, Phone } from 'lucide-react'
import { useBookingStore } from '@/lib/booking/store'
import type { MindbodyClient } from '@/types/booking'

type AuthState = 'email' | 'sending' | 'sent' | 'verifying' | 'select-client' | 'register'

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
    setLoading,
    setError,
    isLoading,
    error,
  } = useBookingStore()

  type SupabaseClient = ReturnType<typeof import('@/lib/supabase/client').getClient>
  const supabaseRef = useRef<SupabaseClient | null>(null)

  const [email, setEmail] = useState('')
  const [authState, setAuthState] = useState<AuthState>('email')
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
  }, [setClientInfo, nextStep, searchParams])

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

      // Single client found - send magic link
      await sendMagicLink(email, data.clientId, data.firstName, data.lastName)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
      setAuthState('email')
      setLoading(false)
    }
  }

  const sendMagicLink = async (
    userEmail: string,
    clientId: number,
    firstName?: string,
    lastName?: string
  ) => {
    try {
      const supabase = getSupabase()
      // Redirect to auth callback which saves clientId to profile, then redirects to /reservar
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: userEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/${locale}/portal/auth/callback?clientId=${clientId}&next=/${locale}/reservar`,
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

      setAuthState('sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar enlace')
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
    await sendMagicLink(client.Email, client.Id, client.FirstName, client.LastName)
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

      // Client created - now send magic link
      await sendMagicLink(regEmail, data.client.Id, firstName, lastName)

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

  // Success state - magic link sent
  if (authState === 'sent') {
    return (
      <div className="auth-step max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-dark mb-3">
          Revisa tu correo
        </h2>

        <p className="text-warm-gray mb-6">
          Hemos enviado un enlace de acceso a<br />
          <span className="font-semibold text-dark">{email}</span>
        </p>

        <div className="bg-gold/10 rounded-xl p-4 text-sm text-dark/80">
          <p>Haz clic en el enlace del correo para continuar con tu reserva.</p>
          <p className="mt-2 text-warm-gray">El enlace expira en 1 hora.</p>
        </div>

        <button
          onClick={() => {
            setAuthState('email')
            setEmail('')
          }}
          className="mt-6 text-gold hover:text-gold/80 font-medium transition-colors"
        >
          Usar otro correo
        </button>
      </div>
    )
  }

  // Multiple clients selection
  if (authState === 'select-client') {
    return (
      <div className="auth-step max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/60 rounded-full
                        flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2">
            Selecciona tu Perfil
          </h2>
          <p className="text-warm-gray">
            Encontramos varias cuentas asociadas a este correo
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          {availableClients.map((client) => (
            <button
              key={client.Id}
              onClick={() => handleSelectClient(client)}
              disabled={!client.Email || isLoading}
              className={`w-full p-4 bg-white border rounded-xl transition-all
                       flex items-center gap-4 text-left
                       ${client.Email
                         ? 'border-beige-200 hover:border-gold hover:shadow-md cursor-pointer'
                         : 'border-gray-200 opacity-50 cursor-not-allowed'}`}
            >
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="font-semibold text-dark">
                  {client.FirstName} {client.LastName}
                </p>
                <p className="text-sm text-warm-gray">
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
          className="w-full py-3 text-warm-gray hover:text-dark transition-colors"
        >
          ← Usar otro correo
        </button>
      </div>
    )
  }

  // Registration form
  if (authState === 'register') {
    return (
      <div className="auth-step max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/60 rounded-full
                        flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2">
            Crear Cuenta
          </h2>
          <p className="text-warm-gray">
            No encontramos una cuenta con ese correo. Completa tus datos para continuar.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={registrationData.firstName}
                onChange={(e) => setRegistrationData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-4 py-3 border border-beige-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                         transition-all"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Apellido
              </label>
              <input
                type="text"
                value={registrationData.lastName}
                onChange={(e) => setRegistrationData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-4 py-3 border border-beige-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                         transition-all"
                placeholder="Tu apellido"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
              <input
                type="email"
                value={registrationData.email}
                onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-12 pr-4 py-3 border border-beige-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                         transition-all"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Teléfono / WhatsApp
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
              <input
                type="tel"
                value={registrationData.phone}
                onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full pl-12 pr-4 py-3 border border-beige-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                         transition-all"
                placeholder="50766124546"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-3">
          <button
            onClick={handleRegistration}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-gold to-gold/90 text-dark
                     font-semibold rounded-xl hover:shadow-lg transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              <>
                Crear Cuenta y Continuar
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <button
            onClick={() => {
              setAuthState('email')
              setError(null)
            }}
            className="w-full py-3 text-warm-gray hover:text-dark transition-colors"
          >
            ← Volver
          </button>
        </div>
      </div>
    )
  }

  // Main email input form
  return (
    <div className="auth-step max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/60 rounded-full
                      flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-dark mb-2">
          ¡Bienvenido!
        </h2>
        <p className="text-warm-gray">
          Ingresa tu correo electrónico para comenzar tu reserva
        </p>
      </div>

      {/* Benefits */}
      <div className="mb-6 p-4 bg-beige-50 rounded-xl">
        <p className="text-sm font-medium text-dark mb-2">Al iniciar sesión podrás:</p>
        <ul className="text-sm text-warm-gray space-y-1">
          <li>• Ver tu historial de citas y compras</li>
          <li>• Gestionar tus próximas reservaciones</li>
          <li>• Recibir ofertas exclusivas</li>
          <li>• Agilizar futuras reservas</li>
        </ul>
      </div>

      {/* Email Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray">
          <Mail className="w-5 h-5" />
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={authState === 'sending'}
          className="w-full pl-12 pr-4 py-4 border-2 border-beige-200 rounded-xl
                   text-lg focus:outline-none focus:ring-2 focus:ring-gold/50
                   focus:border-gold transition-all disabled:opacity-50"
          placeholder="correo@ejemplo.com"
          autoFocus
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={handleEmailSubmit}
        disabled={authState === 'sending' || !email.trim()}
        className="w-full mt-6 py-4 bg-gradient-to-r from-gold to-gold/90 text-dark
                 font-semibold rounded-xl hover:shadow-lg transition-all
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2"
      >
        {authState === 'sending' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Verificando...
          </>
        ) : (
          <>
            Continuar
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Info text */}
      <p className="mt-4 text-center text-sm text-warm-gray">
        Te enviaremos un enlace seguro a tu correo para verificar tu identidad
      </p>
    </div>
  )
}

// Loading fallback
function AuthStepLoading() {
  return (
    <div className="auth-step max-w-md mx-auto text-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
      <p className="text-warm-gray">Cargando...</p>
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
