'use client'

import { useTranslations } from 'next-intl'
import { MessageCircle } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/utils'
import { track } from '@/lib/track'
import { cn } from '@/lib/utils'

interface WhatsAppBookingLinkProps {
  /** Prefilled message; defaults to the generic booking ask */
  message?: string
  /** Analytics label for where this CTA lives */
  cta: string
  className?: string
  variant?: 'button' | 'link'
}

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '50764049464'

// The always-available booking escape hatch: no login, straight to WhatsApp.
export function WhatsAppBookingLink({
  message,
  cta,
  className,
  variant = 'button',
}: WhatsAppBookingLinkProps) {
  const t = useTranslations('whatsapp')
  const text = message || 'Hola, quiero reservar una cita.'

  const handleClick = () => {
    track('whatsapp_click', { meta: { cta } })
  }

  if (variant === 'link') {
    return (
      <a
        href={getWhatsAppUrl(PHONE, text)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={cn(
          'inline-flex items-center gap-2 text-sm font-medium text-dark/70 hover:text-dark underline underline-offset-4 transition-colors',
          className
        )}
      >
        <MessageCircle className="h-4 w-4 text-[#25D366]" />
        {t('bookAction')}
      </a>
    )
  }

  return (
    <a
      href={getWhatsAppUrl(PHONE, text)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full',
        'border-2 border-[#25D366] text-[#128C7E] hover:bg-[#25D366] hover:text-white',
        'text-sm font-medium transition-colors',
        className
      )}
    >
      <MessageCircle className="h-4 w-4" />
      {t('bookAction')}
    </a>
  )
}
