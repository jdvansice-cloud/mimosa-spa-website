'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { Logo } from '@/components/layout/Logo'
import { useAuthStore } from '@/lib/auth/store'

export default function AdminLoginPage() {
  const router = useRouter()
  const { user, isLoading, error, signIn, clearError } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.replace('/admin')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    const result = await signIn(email, password)
    
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
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-semibold text-dark">
              Iniciar Sesión
            </h1>
            <p className="text-warm-gray text-sm mt-1">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Email Field */}
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

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="label">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warm-gray" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-12 pr-12"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray hover:text-dark transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Iniciar Sesión
          </Button>

          {/* Help Text */}
          <p className="text-center text-xs text-warm-gray">
            ¿Olvidaste tu contraseña? Contacta al administrador.
          </p>
        </form>
      </Card>
    </div>
  )
}
