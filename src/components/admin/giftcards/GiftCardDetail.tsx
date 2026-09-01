'use client'

/**
 * The full record of one gift card, shared by the inline expansion in the
 * issued list and the standalone /admin/giftcards/issued/[id] page — one
 * source of truth for what "the card's details" means.
 */

export interface GiftCardDetailData {
  id: string
  serial: string
  format: string
  channel: string | null
  buyer_name: string
  buyer_email: string | null
  buyer_phone: string | null
  buyer_mindbody_client_id: number | null
  recipient_name: string
  recipient_email: string | null
  recipient_mindbody_client_id: number | null
  amount_cents: number
  base_amount_cents: number | null
  tax_cents: number | null
  treatment_name: string | null
  gift_treatment_names: string[] | null
  message: string | null
  print_amount: boolean
  print_message: boolean
  print_recipient: boolean
  print_treatments: boolean | null
  issued_at: string
  issued_by_email: string | null
  location_label: string | null
  expires_at: string | null
  sold_at: string | null
  redeemed_at: string | null
  voided_at: string | null
  void_reason: string | null
  notes: string | null
  promotion_id: string | null
  promotion_name: string | null
  mindbody_barcode_id: string | null
  mindbody_sale_id: string | null
  sold_payment_method: string | null
  mindbody_location_id: number | null
  mindbody_remaining_balance_cents: number | null
  mindbody_synced_at: string | null
}

const money = (cents: number | null) => (cents == null ? null : `$${(cents / 100).toFixed(2)}`)

// Month spelled out, always: es-PA's dateStyle "medium" renders numeric
// 09/01/2026 in some engines, which a reader here parses day-first.
const when = (iso: string | null) => {
  if (!iso) return null
  const d = new Date(iso)
  const date = d.toLocaleDateString('es-PA', { day: 'numeric', month: 'short', year: 'numeric' })
  const time = d.toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${date}, ${time}`
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-beige-300 rounded-lg p-4">
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-gold-700 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-x-8 gap-y-3">{children}</div>
    </section>
  )
}

/**
 * Stacked label-over-value block, left aligned. The first design put labels
 * left and values flush right, which on a wide card meant a ~700px eye jump
 * per row — staff reported they couldn't read it. Values now sit directly
 * under their labels and wrap as a row of compact facts.
 */
function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  if (children == null || children === '') return null
  return (
    <div className={wide ? 'w-full' : 'min-w-[10rem]'}>
      <div className="text-[11px] uppercase tracking-wide text-warm-gray-500">{label}</div>
      <div className="text-sm text-dark mt-0.5 break-words">{children}</div>
    </div>
  )
}

export function GiftCardDetail({ card }: { card: GiftCardDetailData }) {
  const printFlags = [
    card.print_amount && 'monto',
    card.print_recipient && 'destinatario',
    card.print_message && 'mensaje',
    card.print_treatments && 'tratamientos',
  ].filter(Boolean).join(' · ')

  return (
    <div className="space-y-4">
      {/* The three facts staff actually come for, big and first. */}
      <div className="flex flex-wrap items-end gap-x-10 gap-y-3 bg-white border border-beige-300 rounded-lg p-4">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-warm-gray-500">Monto</div>
          <div className="text-3xl font-display font-semibold text-dark tabular-nums">{money(card.amount_cents)}</div>
          {card.base_amount_cents != null && (
            <div className="text-xs text-warm-gray-500 mt-0.5">
              {money(card.base_amount_cents)} + {money(card.tax_cents ?? 0)} ITBMS
            </div>
          )}
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-warm-gray-500">Saldo en Mindbody</div>
          <div className="text-3xl font-display font-semibold tabular-nums text-dark">
            {card.mindbody_remaining_balance_cents != null
              ? money(card.mindbody_remaining_balance_cents)
              : <span className="text-lg font-body font-normal text-warm-gray-500">Sin sincronizar</span>}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-warm-gray-500">Para</div>
          <div className="text-xl font-display text-dark">{card.recipient_name}</div>
          <div className="text-xs text-warm-gray-500 mt-0.5">de {card.buyer_name}</div>
        </div>
      </div>

      {card.notes && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
          <div className="text-[11px] font-bold uppercase tracking-widest text-amber-700">Nota del personal</div>
          <div className="text-sm text-dark mt-1 whitespace-pre-wrap">{card.notes}</div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Tarjeta">
          <Field label="Formato">{card.format === 'certificado' ? 'Certificado' : 'Gift card'}</Field>
          <Field label="Canal">{card.channel}</Field>
          <Field label="Sede">{card.location_label}</Field>
          <Field label="Vence">{when(card.expires_at)}</Field>
          <Field label="Promoción">{card.promotion_name}</Field>
          <Field label="Tratamientos" wide>
            {card.gift_treatment_names?.length ? card.gift_treatment_names.join(' · ') : card.treatment_name}
          </Field>
        </Section>

        <Section title="Mindbody">
          <Field label="Barcode ID">{card.mindbody_barcode_id && <span className="font-mono">{card.mindbody_barcode_id}</span>}</Field>
          <Field label="Venta">{card.mindbody_sale_id}</Field>
          <Field label="Forma de pago">{card.sold_payment_method}</Field>
          <Field label="Vendida">{when(card.sold_at)}</Field>
          <Field label="Usada">{when(card.redeemed_at)}</Field>
          <Field label="Sincronizada">{when(card.mindbody_synced_at)}</Field>
        </Section>

        <Section title="Comprador">
          <Field label="Nombre">{card.buyer_name}</Field>
          <Field label="Correo">{card.buyer_email}</Field>
          <Field label="Teléfono">{card.buyer_phone}</Field>
          <Field label="Cliente Mindbody">{card.buyer_mindbody_client_id && `#${card.buyer_mindbody_client_id}`}</Field>
        </Section>

        <Section title="Destinatario">
          <Field label="Nombre">{card.recipient_name}</Field>
          <Field label="Correo">{card.recipient_email}</Field>
          <Field label="Cliente Mindbody">{card.recipient_mindbody_client_id && `#${card.recipient_mindbody_client_id}`}</Field>
          <Field label="Mensaje" wide>{card.message && <span className="italic">“{card.message}”</span>}</Field>
          <Field label="En la etiqueta">{printFlags || 'nada opcional'}</Field>
        </Section>

        <Section title="Registro">
          <Field label="Emitida">{when(card.issued_at)}</Field>
          <Field label="Emitida por">{card.issued_by_email}</Field>
          {card.voided_at && <Field label="Anulada">{when(card.voided_at)}</Field>}
          {card.voided_at && <Field label="Motivo">{card.void_reason}</Field>}
        </Section>
      </div>
    </div>
  )
}
