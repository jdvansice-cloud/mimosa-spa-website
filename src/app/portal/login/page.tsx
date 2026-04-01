'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Mail, MessageCircle, ArrowRight, Loader2, User, UserPlus, Phone, RefreshCw } from 'lucide-react'
import { OtpInput } from '@/components/ui'
import { OtpChannelChoice } from '@/components/auth'

type LoginStep =
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

  const getSupabase = (): SupabaseClient => {
    if (!supabaseRef.current) {
      const { getClient } = require('@/lib/supabase/client')
      supabaseRef.current = getClient()
    }
    return supabaseRef.current as SupabaseClient
  }

  const [credential, setCredential] = useState('')
  const [step, setStep] = useState<LoginStep>('credential')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [availableClients, setAvailableClients] = useState<ClientOption[]>([])
  const [selectedClient, setSelectedClient] = useState<SelectedClient | null>(null)
  const [otpChannel, setOtpChannel] = useState<OtpChannel | null>(null)
  const [emailAlsoSent, setEmailAlsoSent] = useState(false)
  const [countryCode, setCountryCode] = useState('+507')
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const redirectUrl = searchParams.get('redirect')

  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const destination = redirectUrl ? decodeURIComponent(redirectUrl) : '/portal'
        router.push(destination)
      }
    }
    checkSession()
  }, [router, redirectUrl])

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) setError(decodeURIComponent(errorParam))
  }, [searchParams])

  const handleCredentialSubmit = async () => {
    const trimmed = credential.trim()
    if (!trimmed) {
      setError('Ingresa tu correo o número de teléfono')
      return
    }

    const isEmail = trimmed.includes('@')
    if (isEmail && !trimmed.includes('.')) {
      setError('Correo electrónico inválido')
      return
    }
    if (!isEmail && trimmed.replace(/\D/g, '').length < 8) {
      setError('Número de teléfono inválido (mínimo 8 dígitos)')
      return
    }

    setStep('sending')
    setError(null)
    setIsLoading(true)

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
        setRegistrationData(prev => ({
          ...prev,
          email: isEmail ? trimmed : '',
          phone: isEmail ? '' : trimmed.replace(/\D/g, ''),
        }))
        setStep('register')
        return
      }

      if (data.clients.length > 1) {
        setAvailableClients(data.clients)
        setStep('select-client')
        return
      }

      const client = data.clients[0]
      setSelectedClient({
        clientId: client.Id,
        clientName: client.displayName || `${client.FirstName} ${client.LastName}`.trim(),
        email: client.Email,
        phone: client.MobilePhone,
      })
      setStep('channel-choice')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
      setStep('credential')
    } finally {
      setIsLoading(false)
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
    setStep('channel-choice')
  }

  const handleChooseEmail = async () => {
    if (!selectedClient?.email) return
    setIsLoading(true)
    setError(null)

    try {
      const supabase = getSupabase()
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: selectedClient.email,
        options: { data: { mindbody_client_id: selectedClient.clientId } },
      })
      if (authError) throw new Error(authError.message)
      setOtpChannel('email')
      setStep('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar código')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChooseWhatsApp = async () => {
    if (!selectedClient?.phone) return
    setIsLoading(true)
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

      // Also send email OTP as backup if client has an email
      let emailSent = false
      if (selectedClient.email) {
        try {
          const supabase = getSupabase()
          await supabase.auth.signInWithOtp({
            email: selectedClient.email,
            options: { data: { mindbody_client_id: selectedClient.clientId } },
          })
          emailSent = true
        } catch {
          // Email send failure is non-fatal — WhatsApp is the primary channel
        }
      }

      setEmailAlsoSent(emailSent)
      setOtpChannel('whatsapp')
      setStep('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar código por WhatsApp')
    } finally {
      setIsLoading(false)
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

        await Promise.all([
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
        ])
      } else {
        // WhatsApp OTP: try our server-side code first
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

        if (response.ok) {
          const supabase = getSupabase()
          const { error: sessionError } = await supabase.auth.verifyOtp({
            token_hash: data.token_hash,
            type: 'magiclink',
          })
          if (sessionError) throw new Error(sessionError.message)
        } else if (emailAlsoSent && selectedClient.email) {
          // WhatsApp code failed — try the email OTP code as fallback
          const supabase = getSupabase()
          const { error: emailVerifyError } = await supabase.auth.verifyOtp({
            email: selectedClient.email,
            token: code,
            type: 'email',
          })
          if (emailVerifyError) throw new Error('Código incorrecto')

          await fetch('/api/portal/auth/link-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              credential: selectedClient.email,
              credentialType: 'email',
              clientId: selectedClient.clientId,
              clientName: selectedClient.clientName,
            }),
          })
        } else {
          throw new Error(data.error || 'Código incorrecto')
        }
      }

      const destination = redirectUrl ? decodeURIComponent(redirectUrl) : '/portal'
      router.push(destination)

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

    setIsLoading(true)
    setError(null)

    try {
      const cleanCountryCode = countryCode.replace('+', '')
      const cleanPhone = phone.replace(/\D/g, '')
      const fullPhone = `${cleanCountryCode}${cleanPhone}`

      const response = await fetch('/api/mindbody/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          firstName,
          lastName,
          email: regEmail,
          phone: fullPhone,
          searchText: regEmail,
          searchType: 'email',
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        const msg = data.details ? `${data.error}: ${data.details}` : data.error || 'Error al registrar'
        throw new Error(msg)
      }

      setSelectedClient({
        clientId: data.client.Id,
        clientName: `${firstName} ${lastName}`.trim(),
        email: regEmail,
        phone: fullPhone,
      })
      setStep('channel-choice')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCredentialSubmit()
  }

  // OTP step
  if (step === 'otp') {
    const channelLabel = otpChannel === 'email' ? selectedClient?.email : selectedClient?.phone
    const channelIcon = otpChannel === 'email'
      ? <Mail className="w-10 h-10 text-gold" />
      : <MessageCircle className="w-10 h-10 text-green-600" />
    const channelBg = otpChannel === 'email' ? 'bg-gold/10' : 'bg-green-50'

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-cream to-white">
        <div className="w-full max-w-md text-center">
          <Image src="/logo.png" alt="Mimosa Spa Retreat" width={180} height={60} className="mx-auto mb-8" />

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-beige-200">
            <div className={`w-20 h-20 ${channelBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
              {channelIcon}
            </div>
            <h1 className="text-2xl font-bold text-dark mb-3">Ingresa tu código</h1>
            <p className="text-warm-gray mb-6">
              {otpChannel === 'email'
                ? <>Enviamos un código de 6 dígitos a<br /><span className="font-semibold text-dark">{channelLabel}</span></>
                : emailAlsoSent
                  ? <>Enviamos un código por WhatsApp a <span className="font-semibold text-dark">{channelLabel}</span><br /><span className="text-sm">También enviamos un código a {selectedClient?.email}</span></>
                  : <>Enviamos un código por WhatsApp a<br /><span className="font-semibold text-dark">{channelLabel}</span></>
              }
            </p>

            <OtpInput onComplete={handleVerifyOtp} disabled={isVerifying} error={!!error} />

            {isVerifying && (
              <div className="mt-4 flex items-center justify-center gap-2 text-warm-gray">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Verificando...</span>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-3">
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
                  setStep('channel-choice')
                  setOtpChannel(null)
                  setEmailAlsoSent(false)
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
  if (step === 'channel-choice' && selectedClient) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-cream to-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image src="/logo.png" alt="Mimosa Spa Retreat" width={180} height={60} className="mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-dark mb-2">Verificar identidad</h1>
            <p className="text-warm-gray">
              Hola <span className="font-semibold text-dark">{selectedClient.clientName}</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-beige-200">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
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
          </div>

          <button
            onClick={() => {
              setStep('credential')
              setSelectedClient(null)
              setError(null)
            }}
            className="w-full mt-4 py-3 text-warm-gray hover:text-dark transition-colors"
          >
            ← Usar otro correo o teléfono
          </button>
        </div>
      </div>
    )
  }

  // Multiple clients selection
  if (step === 'select-client') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-cream to-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image src="/logo.png" alt="Mimosa Spa Retreat" width={180} height={60} className="mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-dark mb-2">Selecciona tu Perfil</h1>
            <p className="text-warm-gray">Encontramos varias cuentas asociadas a este dato</p>
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
                className="w-full p-4 bg-white border border-beige-200 rounded-xl transition-all
                         flex items-center gap-4 text-left hover:border-gold hover:shadow-md cursor-pointer"
              >
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-dark">{client.displayName}</p>
                  <p className="text-sm text-warm-gray">{client.Email || client.MobilePhone || '—'}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setAvailableClients([])
              setStep('credential')
              setError(null)
            }}
            className="w-full py-3 text-warm-gray hover:text-dark transition-colors"
          >
            ← Usar otro correo o teléfono
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
          <div className="text-center mb-8">
            <Image src="/logo.png" alt="Mimosa Spa Retreat" width={180} height={60} className="mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-dark mb-2">Regístrate para Reservar</h1>
            <p className="text-warm-gray">Crea tu cuenta para poder reservar citas y acceder a tu portal</p>
          </div>

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
                  <label className="block text-sm font-medium text-dark mb-1">Nombre</label>
                  <input
                    type="text"
                    value={registrationData.firstName}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-beige-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Apellido</label>
                  <input
                    type="text"
                    value={registrationData.lastName}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-beige-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                  <input
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 border-2 border-beige-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1">Teléfono / WhatsApp</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-24 px-2 py-3 border-2 border-beige-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all bg-white text-sm"
                  >
                    <option value="+507">+507</option>
                    <option value="+1">+1</option>
                    <option value="+52">+52</option>
                    <option value="+57">+57</option>
                    <option value="+506">+506</option>
                    <option value="+593">+593</option>
                    <option value="+51">+51</option>
                    <option value="+58">+58</option>
                    <option value="+34">+34</option>
                  </select>
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                    <input
                      type="tel"
                      value={registrationData.phone}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3 border-2 border-beige-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                      placeholder="6000-0000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleRegistration}
              disabled={isLoading}
              className="w-full mt-6 py-4 bg-gradient-to-r from-gold to-gold/90 text-dark
                       font-semibold rounded-xl hover:shadow-lg transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Creando cuenta...</>
              ) : (
                <>Crear Cuenta y Continuar<ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>

          <button
            onClick={() => {
              setStep('credential')
              setError(null)
              setCountryCode('+507')
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

  // Main credential input form
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-cream to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Mimosa Spa Retreat" width={180} height={60} className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-dark mb-2">Bienvenido</h1>
          <p className="text-warm-gray">Inicia sesión para reservar una cita o acceder a tu portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-beige-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/60 rounded-full
                          flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-dark">Iniciar Sesión</h2>
            <p className="text-sm text-warm-gray mt-1">Ingresa tu correo electrónico o número de teléfono</p>
          </div>

          <div className="relative mb-4">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray">
              {credential.includes('@') ? <Mail className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
            </div>
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={step === 'sending'}
              className="w-full pl-12 pr-4 py-4 border-2 border-beige-200 rounded-xl
                       text-lg focus:outline-none focus:ring-2 focus:ring-gold/50
                       focus:border-gold transition-all disabled:opacity-50"
              placeholder="correo@ejemplo.com  o  60001234"
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleCredentialSubmit}
            disabled={step === 'sending' || !credential.trim()}
            className="w-full py-4 bg-gradient-to-r from-gold to-gold/90 text-dark
                     font-semibold rounded-xl hover:shadow-lg transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {step === 'sending' ? (
              <><Loader2 className="w-5 h-5 animate-spin" />Buscando...</>
            ) : (
              <>Continuar<ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>

        <div className="mt-6 text-center space-y-2">
          <button
            onClick={() => {
              setRegistrationData({ firstName: '', lastName: '', email: '', phone: '' })
              setStep('register')
              setError(null)
            }}
            className="block w-full text-gold hover:text-gold/80 font-medium transition-colors"
          >
            ¿Cliente nuevo? Regístrate para reservar
          </button>
          <a href="/" className="block text-warm-gray hover:text-dark text-sm transition-colors">
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}

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

export default function PortalLoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <PortalLoginContent />
    </Suspense>
  )
}
