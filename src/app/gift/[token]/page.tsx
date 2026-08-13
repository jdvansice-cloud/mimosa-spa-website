import { notFound } from 'next/navigation'
import Link from 'next/link'
import { giftshopAdminClient } from '@/lib/giftshop/data'
import { GiftBarcode } from '@/components/giftshop/GiftBarcode'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Tu Gift Card | Mimosa Spa Retreat',
  robots: { index: false, follow: false },
}

// The canonical digital gift card. Non-localized route (like /cita) so the
// URL in delivery emails and WATI template buttons is stable. The redemption
// code late-binds: Mindbody barcode when registered, our serial otherwise.
export default async function GiftViewPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  if (!token || token.length < 8) notFound()

  const supabase = giftshopAdminClient()
  const { data: card } = await supabase
    .from('gift_cards')
    .select(
      'serial, recipient_name, buyer_name, amount_cents, gift_treatment_names, message, mindbody_barcode_id, expires_at, voided_at, redeemed_at'
    )
    .eq('view_token', token)
    .single()
  if (!card) notFound()

  const { data: settings } = await supabase
    .from('giftcard_settings')
    .select('conditions_es')
    .eq('is_active', true)
    .limit(1)
    .single()

  const code = card.mindbody_barcode_id || card.serial
  const amount = `$${(card.amount_cents / 100).toFixed(0)}`
  const voided = !!card.voided_at
  const redeemed = !!card.redeemed_at
  const expiry = card.expires_at
    ? new Date(card.expires_at).toLocaleDateString('es-PA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-elevated overflow-hidden">
            {/* Header */}
            <div className="bg-dark text-center py-6">
              <p className="font-display text-3xl text-cream">Mimosa</p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-cream/60">
                Spa Retreat
              </p>
            </div>

            <div className="p-8 text-center">
              {voided ? (
                <div className="py-8">
                  <p className="text-xl font-display font-semibold text-dark mb-2">
                    Tarjeta no válida
                  </p>
                  <p className="text-sm text-warm-gray">
                    Esta gift card fue anulada. Escríbenos por WhatsApp si crees que es
                    un error. · This gift card was voided.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-warm-gray mb-1">Un regalo para · A gift for</p>
                  <p className="text-2xl font-display font-semibold text-dark mb-5">
                    {card.recipient_name}
                  </p>

                  <div className="bg-cream border-2 border-gold rounded-2xl p-6 mb-5">
                    {card.gift_treatment_names && card.gift_treatment_names.length > 0 ? (
                      <>
                        <p className="text-sm text-warm-gray mb-1">Incluye · Includes</p>
                        <p className="font-display text-xl text-dark mb-2">
                          {card.gift_treatment_names.join(' · ')}
                        </p>
                      </>
                    ) : null}
                    <p className="font-display text-4xl text-gold-600">{amount}</p>
                  </div>

                  {card.message && (
                    <p className="italic text-dark/70 text-sm mb-1">“{card.message}”</p>
                  )}
                  <p className="text-sm text-warm-gray mb-6">— {card.buyer_name}</p>

                  {redeemed ? (
                    <p className="text-sm font-medium text-warm-gray bg-beige rounded-xl py-3 mb-4">
                      Esta gift card ya fue canjeada · Already redeemed
                    </p>
                  ) : (
                    <div className="bg-beige/60 rounded-2xl p-5 mb-4">
                      <p className="text-xs text-warm-gray mb-3">
                        Muestra este código el día de tu visita · Show this code at your visit
                      </p>
                      <GiftBarcode code={code} />
                      <p className="font-mono text-lg font-bold tracking-widest text-dark mt-2">
                        {code}
                      </p>
                    </div>
                  )}

                  {expiry && !redeemed && (
                    <p className="text-xs text-warm-gray mb-4">
                      Válida hasta · Valid until: {expiry}
                    </p>
                  )}

                  <Link
                    href="/es/reservar"
                    className="inline-flex items-center justify-center px-8 py-3 bg-gold text-dark font-semibold rounded-full hover:bg-gold/90 transition-colors"
                  >
                    Reservar mi cita
                  </Link>
                </>
              )}
            </div>

            {/* Conditions */}
            {settings?.conditions_es && settings.conditions_es.length > 0 && !voided && (
              <div className="px-8 pb-6">
                <ul className="text-[11px] text-warm-gray space-y-1 border-t border-beige pt-4">
                  {settings.conditions_es.map((c: string, i: number) => (
                    <li key={i}>· {c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        <p className="text-center text-xs text-warm-gray mt-4">
          Mimosa Spa Retreat · Costa del Este & San Francisco ·{' '}
          <a href="https://www.mimosaretreat.com" className="underline">
            mimosaretreat.com
          </a>
        </p>
      </div>
    </main>
  )
}
