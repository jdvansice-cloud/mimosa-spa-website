'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2, Gift, ChevronLeft } from 'lucide-react'
import { track } from '@/lib/track'
import { WhatsAppBookingLink } from '@/components/shared/WhatsAppBookingLink'
import { PhoneInput } from '@/components/shared/PhoneInput'

interface CatalogItem {
  id: string
  kind: 'monetary' | 'experience'
  name_es: string
  name_en: string
  description_es: string | null
  description_en: string | null
  amount_cents: number
  itbms_cents: number
  image_url: string | null
  badge_es: string | null
  badge_en: string | null
}

interface CatalogResponse {
  shopEnabled: boolean
  items: CatalogItem[]
}

type Step = 'pick' | 'details' | 'pay'

// 3-step shop: Elige → Personaliza → Paga (hosted Tilopay redirect).
export function GiftShopClient({ locale }: { locale: string }) {
  const t = useTranslations('giftShop')
  const en = locale === 'en'
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null)
  const [step, setStep] = useState<Step>('pick')
  const [item, setItem] = useState<CatalogItem | null>(null)
  const [form, setForm] = useState({
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    message: '',
    scheduledDate: '',
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    website: '', // honeypot
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/giftcards/catalog')
      .then((r) => r.json())
      .then((data) => {
        setCatalog(data)
        track('giftshop_view', { locale })
      })
      .catch(() => setCatalog({ shopEnabled: false, items: [] }))
  }, [locale])

  const name = (i: CatalogItem) => (en ? i.name_en : i.name_es)
  const description = (i: CatalogItem) => (en ? i.description_en : i.description_es)
  const badge = (i: CatalogItem) => (en ? i.badge_en : i.badge_es)
  const money = (cents: number) => `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`

  const pay = async () => {
    if (!item || submitting) return
    setError(null)
    if (!form.buyerName || !form.buyerEmail || !form.recipientName) {
      setError(t('errRequired'))
      return
    }
    setSubmitting(true)
    track('giftshop_checkout', { locale, meta: { item: item.id } })
    try {
      const res = await fetch('/api/giftcards/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, locale, ...form }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.url) {
        setError(data?.error || t('errCheckout'))
        setSubmitting(false)
        return
      }
      window.location.href = data.url
    } catch {
      setError(t('errCheckout'))
      setSubmitting(false)
    }
  }

  if (!catalog) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 text-gold animate-spin" />
      </div>
    )
  }

  // Shop not live yet (no Tilopay creds / disabled): keep the page useful.
  if (!catalog.shopEnabled || catalog.items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-card px-6">
        <div className="w-14 h-14 bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="h-7 w-7 text-gold-600" />
        </div>
        <h2 className="text-xl font-display font-semibold text-dark mb-2">
          {t('comingSoonTitle')}
        </h2>
        <p className="text-warm-gray text-sm mb-6 max-w-md mx-auto">{t('comingSoonBody')}</p>
        <WhatsAppBookingLink
          cta="giftshop_coming_soon"
          message={en ? 'Hi, I would like to buy a gift card.' : 'Hola, quiero comprar una gift card.'}
        />
      </div>
    )
  }

  const inputCls =
    'w-full border border-beige rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold'

  const stepTitles: Record<Step, string> = {
    pick: t('step1'),
    details: t('step2'),
    pay: t('step3'),
  }

  return (
    <div>
      {/* Step header */}
      <div className="flex items-center justify-center gap-2 mb-8 text-sm">
        {(['pick', 'details', 'pay'] as Step[]).map((s, i) => (
          <span
            key={s}
            className={`px-3 py-1 rounded-full ${
              step === s ? 'bg-gold text-dark font-semibold' : 'bg-beige text-warm-gray'
            }`}
          >
            {i + 1}. {stepTitles[s]}
          </span>
        ))}
      </div>

      {step !== 'pick' && (
        <button
          onClick={() => setStep(step === 'pay' ? 'details' : 'pick')}
          className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-dark mb-4"
        >
          <ChevronLeft className="h-4 w-4" /> {t('back')}
        </button>
      )}

      {/* Step 1: pick */}
      {step === 'pick' && (
        <div className="space-y-8">
          {(['monetary', 'experience'] as const).map((kind) => {
            const items = catalog.items.filter((i) => i.kind === kind)
            if (items.length === 0) return null
            return (
              <div key={kind}>
                <h2 className="text-lg font-display font-semibold text-dark mb-4">
                  {kind === 'monetary' ? t('monetary') : t('experiences')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {items.map((i) => (
                    <button
                      key={i.id}
                      onClick={() => {
                        setItem(i)
                        setStep('details')
                      }}
                      className="bg-white rounded-xl shadow-card p-4 text-left hover:ring-2 hover:ring-gold transition-all"
                    >
                      {badge(i) && (
                        <span className="text-[10px] font-medium bg-gold/15 text-gold-700 rounded-full px-2 py-0.5">
                          {badge(i)}
                        </span>
                      )}
                      <p className="font-semibold text-dark text-sm mt-1">{name(i)}</p>
                      <p className="text-gold-600 font-bold text-lg">{money(i.amount_cents)}</p>
                      {description(i) && (
                        <p className="text-xs text-warm-gray mt-1 line-clamp-2">{description(i)}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Step 2: details */}
      {step === 'details' && item && (
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <p className="font-display font-semibold text-dark">
            {name(item)} · <span className="text-gold-600">{money(item.amount_cents)}</span>
          </p>
          <input type="text" name="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className={inputCls} placeholder={t('recipientName')} value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} required />
            <input className={inputCls} type="email" placeholder={t('recipientEmail')} value={form.recipientEmail} onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })} />
          </div>
          <PhoneInput
            value={form.recipientPhone}
            onChange={(recipientPhone) => setForm({ ...form, recipientPhone })}
            placeholder={t('recipientPhone')}
            showIcon={false}
            inputClassName={inputCls}
            selectClassName={`${inputCls} w-20 px-2`}
          />
          <textarea className={inputCls} rows={2} maxLength={300} placeholder={t('message')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <div>
            <label className="text-xs text-warm-gray block mb-1">{t('sendDate')}</label>
            <input className={inputCls} type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
          </div>
          <button onClick={() => setStep('pay')} className="btn-primary w-full" disabled={!form.recipientName}>
            {t('continue')}
          </button>
        </div>
      )}

      {/* Step 3: pay */}
      {step === 'pay' && item && (
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className={inputCls} placeholder={t('buyerName')} value={form.buyerName} onChange={(e) => setForm({ ...form, buyerName: e.target.value })} required />
            <input className={inputCls} type="email" placeholder={t('buyerEmail')} value={form.buyerEmail} onChange={(e) => setForm({ ...form, buyerEmail: e.target.value })} required />
          </div>
          <PhoneInput
            value={form.buyerPhone}
            onChange={(buyerPhone) => setForm({ ...form, buyerPhone })}
            placeholder={t('buyerPhone')}
            showIcon={false}
            inputClassName={inputCls}
            selectClassName={`${inputCls} w-20 px-2`}
          />

          <div className="bg-beige/60 rounded-xl p-4 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-warm-gray">{name(item)}</span>
              <span>{money(item.amount_cents)}</span>
            </div>
            {item.itbms_cents > 0 && (
              <div className="flex justify-between text-warm-gray">
                <span>ITBMS (7%)</span>
                <span>{money(item.itbms_cents)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-dark border-t border-beige pt-1">
              <span>Total</span>
              <span>{money(item.amount_cents + item.itbms_cents)}</span>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button onClick={pay} disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : t('payCta')}
          </button>
          <p className="text-xs text-warm-gray text-center">{t('payNote')}</p>
        </div>
      )}
    </div>
  )
}
