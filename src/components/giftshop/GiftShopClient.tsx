'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2, Gift, ChevronLeft, ShoppingBag } from 'lucide-react'
import { track } from '@/lib/track'
import { WhatsAppBookingLink } from '@/components/shared/WhatsAppBookingLink'
import { PhoneInput } from '@/components/shared/PhoneInput'
import { FEATURES } from '@/lib/nav'
import { useBagStore } from '@/lib/bag/store'

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
  whatsappDeliveryEnabled?: boolean
  items: CatalogItem[]
}

type Step = 'pick' | 'details' | 'pay'

type DeliveryMethod = 'email' | 'whatsapp' | 'self'
type FieldErrors = Partial<Record<'recipientName' | 'recipientEmail' | 'recipientPhone' | 'buyerName' | 'buyerEmail', string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Label above, control, then hint or error below. Errors are linked to the
// control through aria-describedby so screen readers read them in place.
function Field({
  id,
  label,
  required,
  hint,
  error,
  labelFor = true,
  children,
}: {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  labelFor?: boolean
  children: ReactNode
}) {
  const LabelTag = labelFor ? 'label' : 'span'
  return (
    <div>
      <LabelTag {...(labelFor ? { htmlFor: id } : {})} className="block text-sm font-medium text-dark mb-1.5">
        {label}
        {required && <span className="text-gold-600"> *</span>}
      </LabelTag>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-warm-gray">{hint}</p>
      ) : null}
    </div>
  )
}

// 3-step shop: Elige → Personaliza → Paga (hosted Tilopay redirect).
export function GiftShopClient({ locale }: { locale: string }) {
  const t = useTranslations('giftShop')
  const en = locale === 'en'
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null)
  const [step, setStep] = useState<Step>('pick')
  const [item, setItem] = useState<CatalogItem | null>(null)
  const [form, setForm] = useState({
    deliveryMethod: 'email' as DeliveryMethod,
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const addGiftCardToBag = useBagStore((s) => s.addGiftCard)
  const openBag = useBagStore((s) => s.openBag)

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
  const whatsappAvailable = !!catalog?.whatsappDeliveryEnabled
  const todayIso = new Date().toISOString().slice(0, 10)

  // With the unified bag on, "details" hands off to the bag instead of a
  // gift-card-only Tilopay redirect — so a card can ride along with a booking.
  const addToBag = () => {
    if (!item) return
    addGiftCardToBag({
      catalogItemId: item.id,
      name: name(item),
      amountCents: item.amount_cents + item.itbms_cents,
      recipientName: form.recipientName || undefined,
      recipientEmail: form.recipientEmail || undefined,
      message: form.message || undefined,
      deliveryDate: form.scheduledDate || undefined,
    })
    track('giftshop_add_to_bag', { locale, meta: { item: item.id } })
    setItem(null)
    setForm({ ...form, recipientName: '', recipientEmail: '', recipientPhone: '', message: '', scheduledDate: '' })
    setStep('pick')
    openBag()
  }

  const validateDetails = (): boolean => {
    const errs: FieldErrors = {}
    if (!form.recipientName.trim()) errs.recipientName = t('errRecipientName')
    if (form.deliveryMethod === 'email' && !EMAIL_RE.test(form.recipientEmail.trim())) errs.recipientEmail = t('errRecipientEmail')
    if (form.deliveryMethod === 'whatsapp' && form.recipientPhone.replace(/\D/g, '').length < 8) errs.recipientPhone = t('errRecipientPhone')
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const goToPay = () => {
    if (!validateDetails()) return
    setError(null)
    setStep('pay')
  }

  const validateBuyer = (): boolean => {
    const errs: FieldErrors = {}
    if (!form.buyerName.trim()) errs.buyerName = t('errBuyerName')
    if (!EMAIL_RE.test(form.buyerEmail.trim())) errs.buyerEmail = t('errBuyerEmail')
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const pay = async () => {
    if (!item || submitting) return
    setError(null)
    if (!validateBuyer()) return
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
    'w-full border border-beige rounded-lg px-3 py-3 min-h-[44px] text-base sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold aria-[invalid=true]:border-red-400'
  const selectCls =
    'w-24 shrink-0 border border-beige rounded-lg px-2 py-3 min-h-[44px] text-base sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold'

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
          onClick={() => {
            setFieldErrors({})
            setStep(step === 'pay' ? 'details' : 'pick')
          }}
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
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <p className="font-display font-semibold text-dark">
            {name(item)}
            {item.kind === 'experience' && <span className="text-gold-600"> · {money(item.amount_cents)}</span>}
          </p>
          <input type="text" name="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

          <Field id="recipientName" label={t('labelRecipientName')} required error={fieldErrors.recipientName}>
            <input
              id="recipientName"
              className={inputCls}
              placeholder={t('phRecipientName')}
              value={form.recipientName}
              autoComplete="off"
              aria-invalid={!!fieldErrors.recipientName}
              aria-describedby={fieldErrors.recipientName ? 'recipientName-error' : undefined}
              onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
            />
          </Field>

          <fieldset>
            <legend className="text-sm font-medium text-dark mb-2">{t('deliveryTitle')}</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="radiogroup" aria-label={t('deliveryTitle')}>
              {(
                [
                  { key: 'email', label: t('deliveryEmail'), show: true },
                  { key: 'whatsapp', label: t('deliveryWhatsapp'), show: whatsappAvailable },
                  { key: 'self', label: t('deliverySelf'), show: true },
                ] as Array<{ key: DeliveryMethod; label: string; show: boolean }>
              )
                .filter((o) => o.show)
                .map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    role="radio"
                    aria-checked={form.deliveryMethod === o.key}
                    onClick={() => {
                      setFieldErrors({})
                      setForm({ ...form, deliveryMethod: o.key })
                    }}
                    className={`rounded-lg border px-3 py-3 min-h-[44px] text-sm transition-colors ${
                      form.deliveryMethod === o.key
                        ? 'border-gold bg-gold/15 text-dark font-semibold'
                        : 'border-beige bg-white text-warm-gray hover:border-gold/60'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
            </div>
            <p className="text-xs text-warm-gray mt-2">
              {form.deliveryMethod === 'email' && t('deliveryEmailHint')}
              {form.deliveryMethod === 'whatsapp' && t('deliveryWhatsappHint')}
              {form.deliveryMethod === 'self' && t('deliverySelfHint')}
            </p>
          </fieldset>

          {form.deliveryMethod === 'email' && (
            <Field id="recipientEmail" label={t('labelRecipientEmail')} required error={fieldErrors.recipientEmail}>
              <input
                id="recipientEmail"
                type="email"
                inputMode="email"
                className={inputCls}
                placeholder={t('phEmail')}
                value={form.recipientEmail}
                autoComplete="off"
                aria-invalid={!!fieldErrors.recipientEmail}
                aria-describedby={fieldErrors.recipientEmail ? 'recipientEmail-error' : undefined}
                onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
              />
            </Field>
          )}
          {form.deliveryMethod === 'whatsapp' && (
            <Field id="recipientPhone" label={t('labelRecipientPhone')} required error={fieldErrors.recipientPhone} labelFor={false}>
              <PhoneInput
                value={form.recipientPhone}
                onChange={(recipientPhone) => setForm({ ...form, recipientPhone })}
                placeholder="6612 3456"
                showIcon={false}
                inputClassName={inputCls}
                selectClassName={selectCls}
              />
            </Field>
          )}

          <Field id="message" label={`${t('labelMessage')} ${t('optional')}`}>
            <textarea id="message" className={inputCls} rows={2} maxLength={300} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </Field>

          {form.deliveryMethod !== 'self' && (
            <Field id="scheduledDate" label={`${t('labelSendDate')} ${t('optional')}`} hint={t('sendDateHint')}>
              <input id="scheduledDate" className={inputCls} type="date" min={todayIso} value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
            </Field>
          )}

          {FEATURES.bag ? (
            <button
              onClick={addToBag}
              className="btn-primary w-full min-h-[44px] inline-flex items-center justify-center gap-2"
              disabled={!form.recipientName}
            >
              <ShoppingBag className="h-4 w-4" />
              {en ? 'Add to bag' : 'Agregar a la bolsa'}
            </button>
          ) : (
            <button onClick={goToPay} className="btn-primary w-full min-h-[44px]">
              {t('continue')}
            </button>
          )}
        </div>
      )}

      {/* Step 3: pay */}
      {step === 'pay' && item && (
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <Field id="buyerName" label={t('labelBuyerName')} required error={fieldErrors.buyerName}>
            <input
              id="buyerName"
              className={inputCls}
              autoComplete="name"
              value={form.buyerName}
              aria-invalid={!!fieldErrors.buyerName}
              aria-describedby={fieldErrors.buyerName ? 'buyerName-error' : undefined}
              onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
            />
          </Field>
          <Field id="buyerEmail" label={t('labelBuyerEmail')} required error={fieldErrors.buyerEmail} hint={en ? 'Your receipt goes here.' : 'Aquí llega tu comprobante.'}>
            <input
              id="buyerEmail"
              type="email"
              inputMode="email"
              className={inputCls}
              autoComplete="email"
              placeholder={t('phEmail')}
              value={form.buyerEmail}
              aria-invalid={!!fieldErrors.buyerEmail}
              aria-describedby={fieldErrors.buyerEmail ? 'buyerEmail-error' : undefined}
              onChange={(e) => setForm({ ...form, buyerEmail: e.target.value })}
            />
          </Field>
          <Field id="buyerPhone" label={`${t('labelBuyerPhone')} ${t('optional')}`} labelFor={false}>
            <PhoneInput
              value={form.buyerPhone}
              onChange={(buyerPhone) => setForm({ ...form, buyerPhone })}
              placeholder="6612 3456"
              showIcon={false}
              inputClassName={inputCls}
              selectClassName={selectCls}
            />
          </Field>

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
          <button onClick={pay} disabled={submitting} className="btn-primary w-full min-h-[44px] disabled:opacity-60">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : t('payCta')}
          </button>
          <p className="text-xs text-warm-gray text-center">{t('payNote')}</p>
        </div>
      )}
    </div>
  )
}
