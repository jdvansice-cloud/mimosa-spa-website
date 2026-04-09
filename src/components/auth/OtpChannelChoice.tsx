'use client'

import { Mail, MessageCircle, Loader2 } from 'lucide-react'

interface OtpChannelChoiceProps {
  email: string | null
  phone: string | null
  isLoading: boolean
  onChooseEmail: () => void
  onChooseWhatsApp: () => void
}

/**
 * Channel selection step: lets the user choose whether to receive
 * their OTP via email or WhatsApp.
 * Hides options that aren't available (e.g. no email = email button hidden).
 */
export function OtpChannelChoice({
  email,
  phone,
  isLoading,
  onChooseEmail,
  onChooseWhatsApp,
}: OtpChannelChoiceProps) {
  const hasEmail = Boolean(email)
  const hasPhone = Boolean(phone)

  return (
    <div className="space-y-3">
      <p className="text-sm text-warm-gray text-center mb-4">
        ¿Cómo quieres recibir tu código de verificación?
      </p>

      {hasEmail && (
        <button
          onClick={onChooseEmail}
          disabled={isLoading}
          className="w-full p-4 bg-white border-2 border-beige-200 rounded-xl
                   hover:border-gold hover:shadow-md transition-all text-left
                   flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
            {isLoading ? (
              <Loader2 className="w-6 h-6 text-gold animate-spin" />
            ) : (
              <Mail className="w-6 h-6 text-gold" />
            )}
          </div>
          <div>
            <p className="font-semibold text-dark">Correo electrónico</p>
            <p className="text-sm text-warm-gray">{email}</p>
          </div>
        </button>
      )}

      {hasPhone && (
        <button
          onClick={onChooseWhatsApp}
          disabled={isLoading}
          className="w-full p-4 bg-white border-2 border-beige-200 rounded-xl
                   hover:border-green-500 hover:shadow-md transition-all text-left
                   flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
            {isLoading ? (
              <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
            ) : (
              <MessageCircle className="w-6 h-6 text-green-600" />
            )}
          </div>
          <div>
            <p className="font-semibold text-dark">WhatsApp</p>
            <p className="text-sm text-warm-gray">{phone}</p>
          </div>
        </button>
      )}
    </div>
  )
}
