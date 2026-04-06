'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, KeyRound } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { Logo } from '@/components/layout/Logo'
import { useAuthStore } from '@/lib/auth/store'

export default function AdminLoginPage() {
  const router = useRouter()
  const { user, isLoading, error, otpEmail, sendOtp, verifyOtp, clearError } = useAuthStore()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')

  useEffect(() => {
    if (user) {
      router.replace('/admin')
    }
  }, [user, router])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    await sendOtp(email)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    const result = await verifyOtp(otpEmail!, otp)
    if (result.success) {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-spa flex items-center justify-center p-4">
      <Card variant="elevated" padding="none" className="w-full max-w-md">
        {/* Header */}
        <div className="p-8 bg-dark text-center flex flex-col items-center">
          <Logo theme="dark" size="lg" />
          <p className="text-cream/70 mt-4 text-sm">Panel de Administración</p>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-semibold text-dark">
              Iniciar Sesión
            </h1>
            <p className="text-warm-gray text-sm mt-1">
              {otpEmail
                ? `Ingresa el código enviado a ${otpEmail}`
                : 'Te enviaremos un código de acceso a tu correo'}
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {!otpEmail ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label htmlFor="email" className="label">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warm-gray" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-12"
                    placeholder="admin@mimosaretreat.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Enviar Código
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label htmlFor="otp" className="label">
                  Código de acceso
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warm-gray" />
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="input pl-12 tracking-widest text-center text-xl font-bold"
                    placeholder="000000"
                    maxLength={6}
                    required
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Ingresar
              </Button>

              <button
                type="button"
                onClick={() => { clearError(); useAuthStore.setState({ otpEmail: null }) }}
                className="w-full text-sm text-warm-gray hover:text-dark transition-colors"
              >
                Cambiar correo electrónico
              </button>
            </form>
          )}
        </div>
      </Card>
    </div>
  )
}
