'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Mail, ArrowRight, Loader2, User, CheckCircle, UserPlus, Phone } from 'lucide-react'

type LoginStep = 'email' | 'sending' | 'sent' | 'verifying' | 'register'

interface ClientOption {
  Id: number
  FirstName: string
  LastName: string
  Email: string | null
  MobilePhone: string | null
}

interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

function PortalLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  type SupabaseClient = ReturnType<typeof import('@/lib/supabase/client').getClient>
  const supabaseRef = useRef<SupabaseClient | null>(null)

  // Lazy load Supabase client
  const getSupabase = (): SupabaseClient => {
    if (!supabaseRef.current) {
      const { getClient } = require('@/lib/supabase/client')
      supabaseRef.current = getClient()
    }
    return supabaseRef.current as SupabaseClient
  }

  const [email, setEmail] = useState('')
  const [step, setStep] = useState<LoginStep>('email')
  const [error, setError] = useState<string | null>(null)
  const [multipleClients, setMultipleClients] = useState<ClientOption[] | null>(null)
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // User is already authenticated, redirect to portal
        router.push('/portal')
      }
    }
    checkSession()
  }, [router])

  // Handle error from callback
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
  }, [searchParams])

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico')
      return
    }

    if (!email.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido')
      return
    }

    setStep('sending')
    setError(null)

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
          // Email not found - show registration form
          setRegistrationData(prev => ({ ...prev, email }))
          setStep('register')
          return
        }
        throw new Error(data.error || 'Error al verificar correo')
      }

      if (data.multiple) {
        // Multiple clients found - show selection
        setMultipleClients(data.clients)
        setStep('email')
        return
      }

      // Store client ID for linking after auth
      const clientId = data.clientId
      setSelectedClientId(clientId)

      // Send magic link via Supabase
      const supabase = getSupabase()
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/portal/auth/callback?clientId=${clientId}`,
          data: {
            mindbody_client_id: clientId,
            first_name: data.firstName,
            last_name: data.lastName
          }
        }
      })

      if (authError) {
        throw new Error(authError.message)
      }

      setStep('sent')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
      setStep('email')
    }
  }

  const handleSelectClient = async (client: ClientOption) => {
    if (!client.Email) {
      setError('Este cliente no tiene correo electrónico registrado')
      return
    }

    setEmail(client.Email)
    setSelectedClientId(client.Id)
    setMultipleClients(null)
    setStep('sending')

    try {
      // Send magic link via Supabase
      const supabase = getSupabase()
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: client.Email,
        options: {
          emailRedirectTo: `${window.location.origin}/portal/auth/callback?clientId=${client.Id}`,
          data: {
            mindbody_client_id: client.Id,
            first_name: client.FirstName,
            last_name: client.LastName
          }
        }
      })

      if (authError) {
        throw new Error(authError.message)
      }

      setStep('sent')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
      setStep('email')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEmailSubmit()
    }
  }

  const handleRegistration = async () => {
    const { firstName, lastName, email: regEmail, phone } = registrationData

    if (!firstName || !lastName || !regEmail || !phone) {
      setError('Por favor completa todos los campos')
      return
    }

    setIsRegistering(true)
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
      const clientId = data.client.Id
      setSelectedClientId(clientId)

      const supabase = getSupabase()
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: regEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/portal/auth/callback?clientId=${clientId}`,
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

      setEmail(regEmail)
      setStep('sent')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setIsRegistering(false)
    }
  }

  // Success state - magic link sent
  if (step === 'sent') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-cream to-white">
        <div className="w-full max-w-md text-center">
          {/* Logo */}
          <Image
            src="/images/logo.png"
            alt="Mimosa Spa Retreat"
            width={180}
            height={60}
            className="mx-auto mb-8"
          />

          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-beige-200">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-dark mb-3">
              Revisa tu correo
            </h1>

            <p className="text-warm-gray mb-6">
              Hemos enviado un enlace de acceso a<br />
              <span className="font-semibold text-dark">{email}</span>
            </p>

            <div className="bg-gold/10 rounded-xl p-4 text-sm text-dark/80">
              <p>Haz clic en el enlace del correo para acceder a tu portal.</p>
              <p className="mt-2 text-warm-gray">El enlace expira en 1 hora.</p>
            </div>

            <button
              onClick={() => {
                setStep('email')
                setEmail('')
              }}
              className="mt-6 text-gold hover:text-gold/80 font-medium transition-colors"
            >
              Usar otro correo
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Multiple clients selection
  if (multipleClients) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-cream to-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/images/logo.png"
              alt="Mimosa Spa Retreat"
              width={180}
              height={60}
              className="mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-dark mb-2">
              Selecciona tu Perfil
            </h1>
            <p className="text-warm-gray">
              Encontramos varias cuentas asociadas a este correo
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Client List */}
          <div className="space-y-3 mb-6">
            {multipleClients.map((client) => (
              <button
                key={client.Id}
                onClick={() => handleSelectClient(client)}
                disabled={!client.Email}
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

          {/* Back Button */}
          <button
            onClick={() => {
              setMultipleClients(null)
              setError(null)
            }}
            className="w-full py-3 text-warm-gray hover:text-dark transition-colors"
          >
            ← Usar otro correo
          </button>
        </div>
      </div>
    )
  }

  // Registration form
  if (step === 'register') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-cream to-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/images/logo.png"
              alt="Mimosa Spa Retreat"
              width={180}
              height={60}
              className="mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-dark mb-2">
              Regístrate para Reservar
            </h1>
            <p className="text-warm-gray">
              Crea tu cuenta para poder reservar citas y acceder a tu portal
            </p>
          </div>

          {/* Registration Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-beige-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/60 rounded-full
                            flex items-center justify-center mx-auto mb-4 shadow-lg">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
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
                    className="w-full px-4 py-3 border-2 border-beige-200 rounded-xl
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
                    className="w-full px-4 py-3 border-2 border-beige-200 rounded-xl
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
                    className="w-full pl-12 pr-4 py-3 border-2 border-beige-200 rounded-xl
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
                    className="w-full pl-12 pr-4 py-3 border-2 border-beige-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                             transition-all"
                    placeholder="50766124546"
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleRegistration}
              disabled={isRegistering}
              className="w-full mt-6 py-4 bg-gradient-to-r from-gold to-gold/90 text-dark
                       font-semibold rounded-xl hover:shadow-lg transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {isRegistering ? (
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
          </div>

          {/* Back Button */}
          <button
            onClick={() => {
              setStep('email')
              setError(null)
              setRegistrationData({ firstName: '', lastName: '', email: '', phone: '' })
            }}
            className="w-full mt-4 py-3 text-warm-gray hover:text-dark transition-colors"
          >
            ← Volver a iniciar sesión
          </button>
        </div>
      </div>
    )
  }

  // Main login form
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-cream to-white">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/logo.png"
            alt="Mimosa Spa Retreat"
            width={180}
            height={60}
            className="mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-dark mb-2">
            Bienvenido
          </h1>
          <p className="text-warm-gray">
            Inicia sesión para reservar una cita o acceder a tu portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-beige-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/60 rounded-full
                          flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-dark">
              Iniciar Sesión
            </h2>
            <p className="text-sm text-warm-gray mt-1">
              Ingresa tu correo para continuar
            </p>
          </div>

          {/* Email Input */}
          <div className="relative mb-4">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={step === 'sending'}
              className="w-full pl-12 pr-4 py-4 border-2 border-beige-200 rounded-xl
                       text-lg focus:outline-none focus:ring-2 focus:ring-gold/50
                       focus:border-gold transition-all disabled:opacity-50"
              placeholder="correo@ejemplo.com"
              autoFocus
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleEmailSubmit}
            disabled={step === 'sending' || !email.trim()}
            className="w-full py-4 bg-gradient-to-r from-gold to-gold/90 text-dark
                     font-semibold rounded-xl hover:shadow-lg transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {step === 'sending' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                Enviar enlace de acceso
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          <button
            onClick={() => {
              setRegistrationData({ firstName: '', lastName: '', email: email, phone: '' })
              setStep('register')
              setError(null)
            }}
            className="block w-full text-gold hover:text-gold/80 font-medium transition-colors"
          >
            ¿Cliente nuevo? Regístrate para reservar
          </button>
          <a
            href="/es"
            className="block text-warm-gray hover:text-dark text-sm transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-cream to-white">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
        <p className="text-warm-gray">Cargando...</p>
      </div>
    </div>
  )
}

// Export with Suspense wrapper for useSearchParams
export default function PortalLoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <PortalLoginContent />
    </Suspense>
  )
}
