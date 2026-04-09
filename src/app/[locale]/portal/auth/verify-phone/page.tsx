'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function VerifyPhonePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token de verificación no encontrado')
      return
    }

    // Verify the token
    async function verifyToken() {
      try {
        const response = await fetch('/api/portal/auth/whatsapp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setStatus('success')
          setMessage('Tu número de WhatsApp ha sido verificado correctamente')
          setRedirectUrl(data.redirectUrl || '/es/portal')

          // Auto-redirect after 3 seconds
          setTimeout(() => {
            router.push(data.redirectUrl || '/es/portal')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Error al verificar el token')
        }
      } catch {
        setStatus('error')
        setMessage('Error de conexión. Por favor intenta nuevamente.')
      }
    }

    verifyToken()
  }, [token, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/logo.png"
            alt="Mimosa Spa"
            width={180}
            height={60}
            className="mx-auto"
          />
        </div>

        {/* Status Icon */}
        <div className="mb-6">
          {status === 'loading' && (
            <div className="w-20 h-20 mx-auto bg-gold/10 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-gold animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          )}
          {status === 'error' && (
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-serif text-dark mb-4">
          {status === 'loading' && 'Verificando...'}
          {status === 'success' && 'Verificación Exitosa'}
          {status === 'error' && 'Error de Verificación'}
        </h1>

        {/* Message */}
        <p className="text-warm-gray mb-6">{message}</p>

        {/* Actions */}
        {status === 'success' && redirectUrl && (
          <p className="text-sm text-warm-gray">
            Serás redirigido automáticamente...
          </p>
        )}

        {status === 'error' && (
          <button
            onClick={() => router.push('/es/portal/login')}
            className="px-6 py-3 bg-gold text-dark font-semibold rounded-xl hover:bg-gold/90 transition-colors"
          >
            Volver al inicio
          </button>
        )}
      </div>
    </div>
  )
}
