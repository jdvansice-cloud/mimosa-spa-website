'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Calendar, Gift, Trash2, ShoppingBag, Plus } from 'lucide-react'
import { GIFT_CARDS_PATH } from '@/lib/nav'
import { bagDisplayTotals, selectBagCount, useBagStore } from '@/lib/bag/store'

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`

function formatSlot(startDateTime: string, locale: string): string {
  const hasOffset = /Z$|[+-]\d{2}:\d{2}$/.test(startDateTime)
  const d = new Date(hasOffset ? startDateTime : `${startDateTime}-05:00`)
  const date = d.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-PA', {
    timeZone: 'America/Panama', weekday: 'long', day: 'numeric', month: 'long',
  })
  const time = d.toLocaleTimeString(locale === 'en' ? 'en-US' : 'es-PA', {
    timeZone: 'America/Panama', hour: 'numeric', minute: '2-digit', hour12: true,
  })
  return `${date} · ${time}`
}

export function BagDrawer({ locale }: { locale: string }) {
  const router = useRouter()
  const { session, giftCards, isOpen, closeBag, clearSession, removeGiftCard } = useBagStore()
  const count = selectBagCount({ session, giftCards })
  const totals = bagDisplayTotals({ session, giftCards })
  const en = locale === 'en'

  // ESC to close + body scroll lock while open
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeBag()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [isOpen, closeBag])

  const goCheckout = () => {
    closeBag()
    router.push(`/${locale}/checkout`)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="bag-backdrop"
            className="fixed inset-0 z-[70] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBag}
          />
          <motion.aside
            key="bag-panel"
            className="fixed right-0 top-0 z-[80] h-dvh w-full max-w-md bg-white shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={en ? 'Bag' : 'Bolsa'}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-dark">
                <ShoppingBag className="h-5 w-5 text-gold" />
                {en ? 'Your bag' : 'Tu bolsa'}
                {count > 0 && <span className="text-sm font-normal text-gray-500">({count})</span>}
              </h2>
              <button
                onClick={closeBag}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-dark"
                aria-label={en ? 'Close bag' : 'Cerrar bolsa'}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {count === 0 && (
                <div className="py-16 text-center text-gray-500">
                  <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                  <p className="mb-6">{en ? 'Your bag is empty.' : 'Tu bolsa está vacía.'}</p>
                  <div className="flex flex-col items-center gap-3">
                    <Link
                      href={`/${locale}/reservar`}
                      onClick={closeBag}
                      className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-dark hover:bg-gold-600"
                    >
                      <Calendar className="h-4 w-4" />
                      {en ? 'Book a service' : 'Reservar un servicio'}
                    </Link>
                    <Link
                      href={`/${locale}${GIFT_CARDS_PATH}`}
                      onClick={closeBag}
                      className="inline-flex items-center gap-2 text-sm font-medium text-gold-700 hover:underline"
                    >
                      <Gift className="h-4 w-4" />
                      {en ? 'Buy a gift card' : 'Comprar una gift card'}
                    </Link>
                  </div>
                </div>
              )}

              {session && (
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-700">
                        <Calendar className="h-3.5 w-3.5" />
                        {session.locationName}
                      </p>
                      <p className="mt-1 text-sm font-medium capitalize text-dark">
                        {formatSlot(session.startDateTime, locale)}
                      </p>
                      {session.staffName && (
                        <p className="text-xs text-gray-500">
                          {en ? 'Therapist' : 'Terapeuta'}: {session.staffName}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={clearSession}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      aria-label={en ? 'Remove booking' : 'Quitar reserva'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {session.services.map((s, i) => (
                      <li key={i} className="flex items-center justify-between py-2 text-sm">
                        <span className="text-dark">
                          {s.name}
                          {s.isAddon && (
                            <span className="ml-1.5 text-xs text-gray-400">
                              {en ? 'add-on' : 'adicional'}
                            </span>
                          )}
                        </span>
                        <span className="font-medium text-dark">{money(s.priceCents)}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${locale}/reservar`}
                    onClick={closeBag}
                    className="mt-2 inline-block text-xs font-medium text-gold-700 hover:underline"
                  >
                    {en ? 'Edit booking' : 'Editar reserva'}
                  </Link>
                </div>
              )}

              {giftCards.map((g) => (
                <div key={g.key} className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <Gift className="h-5 w-5 text-gold" />
                    <div>
                      <p className="text-sm font-medium text-dark">{g.name}</p>
                      {g.recipientName && (
                        <p className="text-xs text-gray-500">
                          {en ? 'For' : 'Para'} {g.recipientName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-dark">{money(g.amountCents)}</span>
                    <button
                      onClick={() => removeGiftCard(g.key)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      aria-label={en ? 'Remove gift card' : 'Quitar gift card'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {count > 0 && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {!session && (
                    <Link
                      href={`/${locale}/reservar`}
                      onClick={closeBag}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-700 hover:underline"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {en ? 'Add a service' : 'Agregar un servicio'}
                    </Link>
                  )}
                  <Link
                    href={`/${locale}${GIFT_CARDS_PATH}`}
                    onClick={closeBag}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-700 hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {en ? 'Add a gift card' : 'Agregar una gift card'}
                  </Link>
                </div>
              )}
            </div>

            {count > 0 && (
              <div className="border-t border-gray-200 px-5 py-4">
                <dl className="mb-3 space-y-1 text-sm">
                  {totals.servicesNetCents > 0 && (
                    <>
                      <div className="flex justify-between text-gray-600">
                        <dt>{en ? 'Services' : 'Servicios'}</dt>
                        <dd>{money(totals.servicesNetCents)}</dd>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <dt>ITBMS (7%)</dt>
                        <dd>{money(totals.itbmsCents)}</dd>
                      </div>
                    </>
                  )}
                  {totals.giftCardsCents > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <dt>Gift cards</dt>
                      <dd>{money(totals.giftCardsCents)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold text-dark">
                    <dt>Total</dt>
                    <dd>{money(totals.totalCents)}</dd>
                  </div>
                </dl>
                <button
                  onClick={goCheckout}
                  className="w-full rounded-lg bg-gold px-6 py-3 text-base font-semibold text-dark shadow-sm transition-colors hover:bg-gold-600"
                >
                  {en ? 'Checkout' : 'Pagar'}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
