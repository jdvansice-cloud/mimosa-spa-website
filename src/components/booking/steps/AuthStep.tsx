'use client'

import { useState } from 'react'
import { Mail, Phone, ArrowRight, UserPlus, Loader2 } from 'lucide-react'
import { useBookingStore } from '@/lib/booking/store'
import type { MindbodyClient } from '@/types/booking'

export function AuthStep() {
  const {
    clientIdentifier,
    setClientIdentifier,
    setClientInfo,
    setAvailableClients,
    showClientSelectorModal,
    nextStep,
    setLoading,
    setError,
    isLoading,
    error,
  } = useBookingStore()
  
  const [showRegistration, setShowRegistration] = useState(false)
  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  
  const handleLookup = async () => {
    if (!clientIdentifier.trim()) {
      setError('Por favor ingresa tu correo electrónico o número de teléfono')
      return
    }

    // Determine search type
    const isEmail = clientIdentifier.includes('@')
    const cleanedPhone = clientIdentifier.replace(/[\s\-\(\)]/g, '')
    const isPhone = /^\d+$/.test(cleanedPhone)

    if (!isEmail && !isPhone) {
      setError('Por favor ingresa un correo electrónico o número de teléfono válido')
      return
    }

    // Validate phone number format - must start with country code (e.g., 507)
    if (isPhone && cleanedPhone.length < 10) {
      setError('Recuerda incluir el código de país sin el signo + (ej: 50766124546)')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/mindbody/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchText: clientIdentifier,
          searchType: isEmail ? 'email' : 'phone'
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al buscar cliente')
      }
      
      const clients: MindbodyClient[] = data.clients || []
      
      if (clients.length === 0) {
        // No client found - show registration
        setShowRegistration(true)
        setRegistrationData(prev => ({
          ...prev,
          email: isEmail ? clientIdentifier : '',
          phone: isPhone ? clientIdentifier : ''
        }))
      } else if (clients.length === 1) {
        // Single client found - proceed
        setClientInfo(clients[0])
        nextStep()
      } else {
        // Multiple clients - show selector
        setAvailableClients(clients)
        showClientSelectorModal(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }
  
  const handleRegistration = async () => {
    const { firstName, lastName, email, phone } = registrationData
    
    if (!firstName || !lastName || !email || !phone) {
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
          email,
          phone,
          searchText: email,
          searchType: 'email'
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar')
      }
      
      setClientInfo(data.client)
      nextStep()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLookup()
    }
  }
  
  if (showRegistration) {
    return (
      <div className="auth-step max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/60 rounded-full 
                        flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2">
            Crear Cuenta
          </h2>
          <p className="text-warm-gray">
            Completa tus datos para continuar con la reserva
          </p>
        </div>
        
        {/* Registration Form */}
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
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}
        
        {/* Actions */}
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
            onClick={() => setShowRegistration(false)}
            className="w-full py-3 text-warm-gray hover:text-dark transition-colors"
          >
            ← Volver
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="auth-step max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/60 rounded-full 
                      flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-dark mb-2">
          ¡Bienvenido!
        </h2>
        <p className="text-warm-gray">
          Ingresa tu correo electrónico o número de teléfono para comenzar
        </p>
      </div>
      
      {/* Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray">
          {clientIdentifier.includes('@') ? (
            <Mail className="w-5 h-5" />
          ) : (
            <Phone className="w-5 h-5" />
          )}
        </div>
        <input
          type="text"
          value={clientIdentifier}
          onChange={(e) => setClientIdentifier(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full pl-12 pr-4 py-4 border-2 border-beige-200 rounded-xl 
                   text-lg focus:outline-none focus:ring-2 focus:ring-gold/50 
                   focus:border-gold transition-all"
          placeholder="correo@ejemplo.com o 50766124546"
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
        onClick={handleLookup}
        disabled={isLoading || !clientIdentifier.trim()}
        className="w-full mt-6 py-4 bg-gradient-to-r from-gold to-gold/90 text-dark 
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
      
      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-beige-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-warm-gray">¿Primera vez?</span>
        </div>
      </div>
      
      {/* Create Account */}
      <button
        onClick={() => setShowRegistration(true)}
        className="w-full py-3 border-2 border-beige-200 text-dark 
                 font-medium rounded-xl hover:border-gold hover:bg-gold/5 
                 transition-all flex items-center justify-center gap-2"
      >
        <UserPlus className="w-5 h-5" />
        Crear una cuenta
      </button>
    </div>
  )
}
