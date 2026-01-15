'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, Phone, ArrowRight, Loader2, User } from 'lucide-react'
import { usePortalStore, type PortalClient } from '@/lib/portal/store'

// Type for client selection list
interface ClientOption {
  Id: number
  FirstName: string
  LastName: string
  Email: string | null
  MobilePhone: string | null
}

export default function PortalLoginPage() {
  const router = useRouter()
  const { login, setError, error } = usePortalStore()

  const [identifier, setIdentifier] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [multipleClients, setMultipleClients] = useState<ClientOption[] | null>(null)

  const handleLookup = async () => {
    if (!identifier.trim()) {
      setError('Por favor ingresa tu correo electrónico o número de teléfono')
      return
    }

    // Validate phone format
    const isEmail = identifier.includes('@')
    const cleanedPhone = identifier.replace(/[\s\-\(\)]/g, '')
    const isPhone = /^\d+$/.test(cleanedPhone)

    if (!isEmail && !isPhone) {
      setError('Por favor ingresa un correo electrónico o número de teléfono válido')
      return
    }

    if (isPhone && cleanedPhone.length < 10) {
      setError('Recuerda incluir el código de país sin el signo + (ej: 50766124546)')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/portal/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al buscar cliente')
      }

      if (data.multiple) {
        // Multiple clients found - show selection
        setMultipleClients(data.clients)
      } else {
        // Single client - login and redirect
        login(data.client as PortalClient)
        router.push('/portal')
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectClient = (client: ClientOption) => {
    login(client as PortalClient)
    router.push('/portal')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLookup()
    }
  }

  // If showing client selection
  if (multipleClients) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
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
              Encontramos varias cuentas asociadas
            </p>
          </div>

          {/* Client List */}
          <div className="space-y-3 mb-6">
            {multipleClients.map((client) => (
              <button
                key={client.Id}
                onClick={() => handleSelectClient(client)}
                className="w-full p-4 bg-white border border-beige-200 rounded-xl
                         hover:border-gold hover:shadow-md transition-all
                         flex items-center gap-4 text-left"
              >
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-dark">
                    {client.FirstName} {client.LastName}
                  </p>
                  <p className="text-sm text-warm-gray">
                    {client.Email || client.MobilePhone}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Back Button */}
          <button
            onClick={() => setMultipleClients(null)}
            className="w-full py-3 text-warm-gray hover:text-dark transition-colors"
          >
            ← Usar otro correo o teléfono
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
            Mi Portal
          </h1>
          <p className="text-warm-gray">
            Accede a tu historial de citas y reservaciones
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-beige-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/60 rounded-full
                          flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-dark">
              Iniciar Sesión
            </h2>
            <p className="text-sm text-warm-gray mt-1">
              Ingresa tu correo o teléfono registrado
            </p>
          </div>

          {/* Input */}
          <div className="relative mb-4">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray">
              {identifier.includes('@') ? (
                <Mail className="w-5 h-5" />
              ) : (
                <Phone className="w-5 h-5" />
              )}
            </div>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-4 py-4 border-2 border-beige-200 rounded-xl
                       text-lg focus:outline-none focus:ring-2 focus:ring-gold/50
                       focus:border-gold transition-all"
              placeholder="correo@ejemplo.com o 50766124546"
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
            onClick={handleLookup}
            disabled={isLoading || !identifier.trim()}
            className="w-full py-4 bg-gradient-to-r from-gold to-gold/90 text-dark
                     font-semibold rounded-xl hover:shadow-lg transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          <a
            href="/es/reservar"
            className="block text-gold hover:text-gold/80 font-medium transition-colors"
          >
            Reservar una cita nueva
          </a>
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
