'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Calendar, Gift, Loader2, ShoppingBag, Tag, X } from 'lucide-react'
import { bagDisplayTotals, useBagStore } from '@/lib/bag/store'
import { track } from '@/lib/track'

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`

interface CheckoutConfig {
  enabled: boolean
  onlineDiscountActive: boolean
  onlineDiscountPercent: number
}

interface AppliedGc {
  barcode: string
  balanceCents: number
}

/**
 * Unified checkout: one page, two lanes.
 *  - Bags with services require the verified Mindbody client (the widget's
 *    auth step already ran — we read /api/portal/client-id like ConfirmStep).
 *  - Gift-card-only bags check out as guests.
 * Payment is ALWAYS prepay here (Tilopay authorize → book → capture);
 * "paga en el spa" lives in the booking widget, not on this page.
 */
export function CheckoutClient({ locale }: { locale: string }) {
  const en = locale === 'en'
  const { session, giftCards, clearBag } = useBagStore()
  const [mounted, setMounted] = useState(false)
  const [config, setConfig] = useState<CheckoutConfig | null>(null)
  const [clientId, setClientId] = useState<number | null>(null)
  const [clientChecked, setClientChecked] = useState(false)

  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [marketingOptIn, setMarketingOptIn] = useState(false)

  const [gcInput, setGcInput] = useState('')
  const [gcLoading, setGcLoading] = useState(false)
  const [appliedGcs, setAppliedGcs] = useState<AppliedGc[]>([])
  const [gcError, setGcError] = useState<string | null>(null)

  const [promoOpen, setPromoOpen] = useState(false)
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState<{ code: string; discountCents: number } | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slotLost, setSlotLost] = useState(false)

  useEffect(() => setMounted(true), [])

  // Funnel top for the checkout step. Fired once the bag is hydrated so the
  // item counts are real (mount alone would report an empty bag).
  const [startTracked, setStartTracked] = useState(false)
  useEffect(() => {
    if (!mounted || startTracked) return
    if ((session?.services.length ?? 0) + giftCards.length === 0) return
    setStartTracked(true)
    track('checkout_start', {
      locale,
      locationId: session?.locationId,
      meta: {
        services: session?.services.length ?? 0,
        giftCards: giftCards.length,
        valueCents: bagDisplayTotals({ session, giftCards }).totalCents,
      },
    })
  }, [mounted, startTracked, session, giftCards, locale])

  // Auto-apply a campaign code captured by /reservar?promo=CODE
  useEffect(() => {
    if (!mounted || promo) return
    try {
      const stored = sessionStorage.getItem('mimosa-promo')
      if (stored) {
        setPromoInput(stored)
        setPromoOpen(true)
      }
    } catch {
      // storage unavailable — nothing to restore
    }
  }, [mounted, promo])

  useEffect(() => {
    fetch('/api/checkout/config')
      .then(r => r.json())
      .then(setConfig)
      .catch(() => setConfig({ enabled: false, onlineDiscountActive: false, onlineDiscountPercent: 0 }))
  }, [])

  const hasServices = !!session && session.services.length > 0

  // Auto-apply the gift card the recipient arrived with (/reservar?gc=SERIAL)
  const [gcAutoTried, setGcAutoTried] = useState(false)
  useEffect(() => {
    if (!mounted || gcAutoTried || !hasServices || appliedGcs.length > 0) return
    let stored: string | null = null
    try {
      stored = sessionStorage.getItem('mimosa-gc')
    } catch {
      stored = null
    }
    if (!stored) return
    setGcAutoTried(true)
    fetch('/api/checkout/gc-balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barcode: stored }),
    })
      .then(r => (r.ok ? r.json() : null))
      .then(j => {
        if (j?.balanceCents > 0) {
          setAppliedGcs(prev =>
            prev.some(g => g.barcode === j.barcode)
              ? prev
              : [...prev, { barcode: j.barcode, balanceCents: j.balanceCents }]
          )
        }
      })
      .catch(() => {})
  }, [mounted, gcAutoTried, hasServices, appliedGcs.length])


  useEffect(() => {
    if (!mounted) return
    if (!hasServices) {
      setClientChecked(true)
      return
    }
    fetch('/api/portal/client-id')
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        const id = d?.clientId ?? d?.mindbodyClientId ?? null
        setClientId(typeof id === 'number' ? id : id ? Number(id) : null)
      })
      .catch(() => setClientId(null))
      .finally(() => setClientChecked(true))
  }, [mounted, hasServices])

  // Prefill buyer fields for signed-in clients.
  useEffect(() => {
    if (!clientId) return
    fetch(`/api/portal/profile?clientId=${clientId}`)
      .then(r => (r.ok ? r.json() : null))
      .then(p => {
        // The endpoint wraps the record: { client: {...} }. Reading the fields
        // off the top level silently prefills nothing.
        const c = p?.client ?? p
        if (!c) return
        const first = c.FirstName ?? c.firstName ?? ''
        const last = c.LastName ?? c.lastName ?? ''
        if (!buyerName && (first || last)) setBuyerName(`${first} ${last}`.trim())
        const email = c.Email ?? c.email
        if (!buyerEmail && email) setBuyerEmail(String(email))
        const phone = c.MobilePhone ?? c.mobilePhone ?? c.phone
        if (!buyerPhone && phone) setBuyerPhone(String(phone).replace(/\D/g, ''))
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId])

  const totals = bagDisplayTotals({ session, giftCards })
  const servicesInclusiveCents = totals.servicesNetCents + totals.itbmsCents

  // Display-side discount: promo (server preview) wins over the automatic
  // online discount — mirrors the server rule in POST /api/checkout.
  const autoDiscountCents = useMemo(() => {
    if (promo || !config?.onlineDiscountActive || !hasServices) return 0
    return Math.round((servicesInclusiveCents * config.onlineDiscountPercent) / 100)
  }, [promo, config, hasServices, servicesInclusiveCents])

  const discountCents = promo?.discountCents ?? autoDiscountCents
  const orderTotalCents = Math.max(0, totals.totalCents - discountCents)
  const serviceDueCents = Math.max(0, servicesInclusiveCents - discountCents)
  const gcTenderCents = Math.min(
    appliedGcs.reduce((s, g) => s + g.balanceCents, 0),
    serviceDueCents
  )
  const cardDueCents = orderTotalCents - gcTenderCents

  const promoItemsPayload = useMemo(
    () => [
      ...(session?.services.map(s => ({
        itemType: 'service' as const,
        unitPriceCents: Math.round(s.priceCents * 1.07),
        sessionTypeId: s.sessionTypeId,
      })) ?? []),
      ...giftCards.map(g => ({ itemType: 'gift_card' as const, unitPriceCents: g.amountCents })),
    ],
    [session, giftCards]
  )

  const applyPromo = useCallback(async () => {
    const code = promoInput.trim()
    if (!code) return
    setPromoLoading(true)
    setPromoError(null)
    try {
      const res = await fetch('/api/checkout/validate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          items: promoItemsPayload,
          customerKey: clientId ? String(clientId) : buyerEmail || undefined,
        }),
      })
      const json = await res.json()
      if (json.ok) {
        setPromo({ code: json.code, discountCents: json.discountCents })
      } else {
        const reasons: Record<string, { es: string; en: string }> = {
          not_found: { es: 'Código no válido', en: 'Invalid code' },
          inactive: { es: 'Código no válido', en: 'Invalid code' },
          not_started: { es: 'Este código aún no está activo', en: 'This code is not active yet' },
          expired: { es: 'Este código ya venció', en: 'This code has expired' },
          exhausted: { es: 'Este código ya alcanzó su límite de usos', en: 'This code has reached its usage limit' },
          customer_limit: { es: 'Ya usaste este código', en: 'You already used this code' },
          below_minimum: { es: 'Tu compra no alcanza el mínimo para este código', en: 'Your order does not reach the minimum for this code' },
          no_eligible_items: { es: 'Este código no aplica a los artículos de tu bolsa', en: 'This code does not apply to the items in your bag' },
        }
        const r = reasons[json.rejection] ?? reasons.not_found
        setPromoError(en ? r.en : r.es)
      }
    } catch {
      setPromoError(en ? 'Could not validate the code' : 'No pudimos validar el código')
    } finally {
      setPromoLoading(false)
    }
  }, [promoInput, promoItemsPayload, clientId, buyerEmail, en])

  const applyGiftCard = useCallback(async () => {
    const barcode = gcInput.trim().toUpperCase()
    if (!barcode) return
    if (appliedGcs.some(g => g.barcode === barcode)) {
      setGcError(en ? 'That card is already applied' : 'Esa tarjeta ya está aplicada')
      return
    }
    if (!hasServices) {
      setGcError(
        en
          ? 'Gift cards can pay for services, not for buying new gift cards.'
          : 'Las gift cards pagan servicios, no la compra de nuevas gift cards.'
      )
      return
    }
    setGcLoading(true)
    setGcError(null)
    try {
      const res = await fetch('/api/checkout/gc-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode }),
      })
      const json = await res.json()
      if (!res.ok) {
        setGcError(json.error ?? (en ? 'Card not found' : 'Tarjeta no encontrada'))
      } else if (json.balanceCents <= 0) {
        setGcError(en ? 'That card has no remaining balance' : 'Esa tarjeta no tiene saldo disponible')
      } else {
        setAppliedGcs(prev => [...prev, { barcode: json.barcode, balanceCents: json.balanceCents }])
        setGcInput('')
      }
    } catch {
      setGcError(en ? 'Could not check the balance' : 'No pudimos consultar el saldo')
    } finally {
      setGcLoading(false)
    }
  }, [gcInput, appliedGcs, hasServices, en])

  const submit = useCallback(async () => {
    setError(null)
    setSlotLost(false)
    if (!buyerName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
      setError(en ? 'Enter your name and a valid email.' : 'Ingresa tu nombre y un correo válido.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          locationId: session?.locationId ?? 1,
          clientId: clientId ?? undefined,
          buyerName,
          buyerEmail,
          buyerPhone: buyerPhone || undefined,
          marketingOptIn,
          session: session
            ? {
                services: session.services.map(s => ({
                  sessionTypeId: s.sessionTypeId,
                  isAddon: !!s.isAddon,
                })),
                staffId: session.staffId,
                staffRequested: !!session.staffRequested,
                startDateTime: session.startDateTime,
              }
            : null,
          giftCards: giftCards.map(g => ({
            catalogItemId: g.catalogItemId,
            recipientName: g.recipientName,
            recipientEmail: g.recipientEmail,
            message: g.message,
            deliveryDate: g.deliveryDate,
          })),
          redemptions: appliedGcs.map(g => ({ barcode: g.barcode })),
          promoCode: promo?.code,
          website: '',
        }),
      })
      const json = await res.json()
      if (res.status === 409 && json.timeUnavailable) {
        setSlotLost(true)
        return
      }
      if (!res.ok) {
        setError(json.error ?? (en ? 'Something went wrong.' : 'Algo salió mal.'))
        return
      }
      if (json.paid && json.redirect) {
        clearBag()
        window.location.href = json.redirect
        return
      }
      if (json.url) {
        // Bag survives until the gracias page confirms — an abandoned Tilopay
        // tab shouldn't empty it.
        window.location.href = json.url
        return
      }
      setError(en ? 'Unexpected response.' : 'Respuesta inesperada.')
    } catch {
      setError(en ? 'Connection error. Try again.' : 'Error de conexión. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }, [buyerName, buyerEmail, buyerPhone, marketingOptIn, session, giftCards, appliedGcs, promo, clientId, locale, clearBag, en])

  if (!mounted || !config) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    )
  }

  if (!config.enabled) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-10 w-10 text-gray-300" />}
        title={en ? 'Online payment is not available yet' : 'El pago en línea no está disponible todavía'}
        cta={<Link href={`/${locale}/reservar`} className="btn-primary">{en ? 'Book now' : 'Reservar'}</Link>}
      />
    )
  }

  const count = (session?.services.length ?? 0) + giftCards.length
  if (count === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-10 w-10 text-gray-300" />}
        title={en ? 'Your bag is empty' : 'Tu bolsa está vacía'}
        cta={<Link href={`/${locale}/reservar`} className="btn-primary">{en ? 'Book a service' : 'Reservar un servicio'}</Link>}
      />
    )
  }

  if (hasServices && clientChecked && !clientId) {
    return (
      <EmptyState
        icon={<Calendar className="h-10 w-10 text-gray-300" />}
        title={en ? 'Verify your account to continue' : 'Verifica tu cuenta para continuar'}
        subtitle={
          en
            ? 'Your booking needs a verified account. Continue in the booking flow — your selections are saved.'
            : 'Tu reserva necesita una cuenta verificada. Continúa en el flujo de reserva — tus selecciones están guardadas.'
        }
        cta={<Link href={`/${locale}/reservar`} className="btn-primary">{en ? 'Continue' : 'Continuar'}</Link>}
      />
    )
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_360px]">
      {/* Left: identity + payment options */}
      <div className="space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="mb-4 text-lg font-display font-semibold text-dark">
            {en ? 'Your details' : 'Tus datos'}
          </h2>
          <div className="space-y-3">
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-dark focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder={en ? 'Full name' : 'Nombre completo'}
              value={buyerName}
              onChange={e => setBuyerName(e.target.value)}
              autoComplete="name"
            />
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-dark focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder={en ? 'Email' : 'Correo electrónico'}
              type="email"
              value={buyerEmail}
              onChange={e => setBuyerEmail(e.target.value)}
              autoComplete="email"
            />
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-dark focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder={en ? 'WhatsApp (optional)' : 'WhatsApp (opcional)'}
              type="tel"
              value={buyerPhone}
              onChange={e => setBuyerPhone(e.target.value)}
              autoComplete="tel"
            />
            <label className="flex items-start gap-2 text-xs text-warm-gray">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={marketingOptIn}
                onChange={e => setMarketingOptIn(e.target.checked)}
              />
              {en
                ? 'You can message me on WhatsApp about my order and offers.'
                : 'Pueden escribirme por WhatsApp sobre mi pedido y ofertas.'}
            </label>
          </div>
        </section>

        {hasServices && (
          <section className="rounded-2xl bg-white p-6 shadow-card">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-display font-semibold text-dark">
              <Gift className="h-5 w-5 text-gold" />
              {en ? 'Pay with a gift card' : 'Paga con una gift card'}
            </h2>
            <p className="mb-3 text-xs text-warm-gray">
              {en
                ? 'Enter the card number — the balance applies to your services.'
                : 'Ingresa el número de la tarjeta — el saldo se aplica a tus servicios.'}
            </p>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-dark focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                placeholder={en ? 'Card number' : 'Número de tarjeta'}
                value={gcInput}
                onChange={e => setGcInput(e.target.value)}
              />
              <button
                onClick={applyGiftCard}
                disabled={gcLoading || !gcInput.trim()}
                className="rounded-lg bg-dark px-4 py-2 text-sm font-semibold text-cream disabled:opacity-50"
              >
                {gcLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : en ? 'Apply' : 'Aplicar'}
              </button>
            </div>
            {gcError && <p className="mt-2 text-xs text-red-600">{gcError}</p>}
            {appliedGcs.map(g => (
              <div key={g.barcode} className="mt-2 flex items-center justify-between rounded-lg bg-beige/60 px-3 py-2 text-sm">
                <span className="font-mono">{g.barcode}</span>
                <span className="flex items-center gap-2">
                  {en ? 'Balance' : 'Saldo'} {money(g.balanceCents)}
                  <button
                    onClick={() => setAppliedGcs(prev => prev.filter(x => x.barcode !== g.barcode))}
                    className="text-gray-400 hover:text-red-600"
                    aria-label={en ? 'Remove card' : 'Quitar tarjeta'}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              </div>
            ))}
          </section>
        )}

        <section className="rounded-2xl bg-white p-6 shadow-card">
          {!promoOpen && !promo ? (
            <button
              onClick={() => setPromoOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-gold-700 hover:underline"
            >
              <Tag className="h-4 w-4" />
              {en ? 'Have a discount code?' : '¿Tienes un código de descuento?'}
            </button>
          ) : promo ? (
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-dark">
                <Tag className="h-4 w-4 text-gold" />
                {promo.code}
              </span>
              <span className="flex items-center gap-2">
                −{money(promo.discountCents)}
                <button
                  onClick={() => { setPromo(null); setPromoInput('') }}
                  className="text-gray-400 hover:text-red-600"
                  aria-label={en ? 'Remove code' : 'Quitar código'}
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm uppercase text-dark focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder={en ? 'Code' : 'Código'}
                  value={promoInput}
                  onChange={e => setPromoInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && applyPromo()}
                />
                <button
                  onClick={applyPromo}
                  disabled={promoLoading || !promoInput.trim()}
                  className="rounded-lg bg-dark px-4 py-2 text-sm font-semibold text-cream disabled:opacity-50"
                >
                  {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : en ? 'Apply' : 'Aplicar'}
                </button>
              </div>
              {promoError && <p className="mt-2 text-xs text-red-600">{promoError}</p>}
            </div>
          )}
        </section>
      </div>

      {/* Right: order summary + pay */}
      <aside className="h-fit rounded-2xl bg-white p-6 shadow-card lg:sticky lg:top-24">
        <h2 className="mb-4 text-lg font-display font-semibold text-dark">
          {en ? 'Summary' : 'Resumen'}
        </h2>
        <dl className="space-y-2 text-sm">
          {session?.services.map((s, i) => (
            <div key={i} className="flex justify-between text-warm-gray">
              <dt>{s.name}</dt>
              <dd>{money(s.priceCents)}</dd>
            </div>
          ))}
          {totals.itbmsCents > 0 && (
            <div className="flex justify-between text-warm-gray">
              <dt>ITBMS (7%)</dt>
              <dd>{money(totals.itbmsCents)}</dd>
            </div>
          )}
          {giftCards.map(g => (
            <div key={g.key} className="flex justify-between text-warm-gray">
              <dt>{g.name}</dt>
              <dd>{money(g.amountCents)}</dd>
            </div>
          ))}
          {discountCents > 0 && (
            <div className="flex justify-between font-medium text-green-700">
              <dt>
                {promo
                  ? promo.code
                  : en
                    ? `Online discount (${config.onlineDiscountPercent}%)`
                    : `Descuento online (${config.onlineDiscountPercent}%)`}
              </dt>
              <dd>−{money(discountCents)}</dd>
            </div>
          )}
          {gcTenderCents > 0 && (
            <div className="flex justify-between font-medium text-green-700">
              <dt>{en ? 'Gift card' : 'Gift card'}</dt>
              <dd>−{money(gcTenderCents)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-dark">
            <dt>{en ? 'To pay now' : 'A pagar ahora'}</dt>
            <dd>{money(cardDueCents)}</dd>
          </div>
        </dl>

        {slotLost && (
          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
            {en
              ? 'That time was just taken — you were not charged. '
              : 'Ese horario se acaba de ocupar — no se te cobró. '}
            <Link href={`/${locale}/reservar`} className="font-semibold underline">
              {en ? 'Pick another time' : 'Elige otro horario'}
            </Link>
          </div>
        )}
        {error && <p className="mt-4 text-xs text-red-600">{error}</p>}

        <button
          onClick={submit}
          disabled={submitting || (hasServices && !clientChecked)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-base font-semibold text-dark shadow-sm transition-colors hover:bg-gold-600 disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {cardDueCents > 0
            ? en ? `Pay ${money(cardDueCents)}` : `Pagar ${money(cardDueCents)}`
            : en ? 'Complete order' : 'Completar pedido'}
        </button>
        <p className="mt-3 text-center text-[11px] text-warm-gray">
          {cardDueCents > 0 &&
            (en
              ? 'Secure payment via Tilopay — Visa, Mastercard, AMEX, Yappy or Apple Pay. Your card is only charged once the booking is confirmed.'
              : 'Pago seguro con Tilopay — Visa, Mastercard, AMEX, Yappy o Apple Pay. Tu tarjeta solo se cobra cuando la reserva queda confirmada.')}
        </p>
      </aside>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  subtitle,
  cta,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  cta: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mb-3 flex justify-center">{icon}</div>
      <h1 className="mb-2 text-xl font-display font-semibold text-dark">{title}</h1>
      {subtitle && <p className="mb-6 text-sm text-warm-gray">{subtitle}</p>}
      <div className="flex justify-center">{cta}</div>
    </div>
  )
}
