'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Loader2, Check } from 'lucide-react'
import { getSessionId, captureAttribution, track } from '@/lib/track'
import { getWhatsAppUrl } from '@/lib/utils'
import { PhoneInput } from '@/components/shared/PhoneInput'

interface LeadFormProps {
  source: 'primera-visita' | 'empresas' | 'club-waitlist' | 'parejas-grupo' | 'referidos'
  /** Show company + email fields (corporate variant) */
  corporate?: boolean
  /** Free-text message field */
  withMessage?: boolean
  /** WhatsApp prefill offered after successful submit */
  whatsappFollowUp?: string
  submitLabel?: string
  className?: string
}

const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '50764049464'

export function LeadForm({
  source,
  corporate = false,
  withMessage = false,
  whatsappFollowUp,
  submitLabel,
  className = '',
}: LeadFormProps) {
  const locale = useLocale()
  const t = useTranslations('leadForm')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    message: '',
    website: '', // honeypot
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setError(null)
    try {
      const attr = captureAttribution()
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source,
          ...form,
          locale,
          path: window.location.pathname,
          session_id: getSessionId(),
          ...attr,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error || t('error'))
        setStatus('error')
        return
      }
      track('lead_submit', { meta: { source } })
      setStatus('done')
    } catch {
      setError(t('error'))
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className={`bg-white rounded-xl shadow-card p-6 text-center ${className}`}>
        <div className="w-12 h-12 bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-3">
          <Check className="h-6 w-6 text-gold-600" />
        </div>
        <p className="font-semibold text-dark mb-1">{t('successTitle')}</p>
        <p className="text-sm text-warm-gray mb-4">{t('successBody')}</p>
        {whatsappFollowUp && (
          <a
            href={getWhatsAppUrl(PHONE, whatsappFollowUp)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
            onClick={() => track('whatsapp_click', { meta: { cta: `lead_${source}` } })}
          >
            {t('whatsappNow')}
          </a>
        )}
      </div>
    )
  }

  const inputCls =
    'w-full border border-beige rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white'

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      {/* Honeypot — hidden from humans */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          className={inputCls}
          placeholder={t('name')}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <PhoneInput
          value={form.phone}
          onChange={(phone) => setForm({ ...form, phone })}
          required
          showIcon={false}
          inputClassName={inputCls}
          selectClassName={`${inputCls} w-20 px-2`}
        />
      </div>
      {corporate && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className={inputCls}
            placeholder={t('company')}
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <input
            className={inputCls}
            type="email"
            placeholder={t('email')}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      )}
      {withMessage && (
        <textarea
          className={inputCls}
          rows={3}
          placeholder={t('message')}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      )}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary w-full md:w-auto disabled:opacity-60"
      >
        {status === 'sending' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          submitLabel || t('submit')
        )}
      </button>
    </form>
  )
}
