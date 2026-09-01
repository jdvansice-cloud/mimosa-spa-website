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
  mindbody_barcode_id: string | null
  mindbody_sale_id: string | null
  sold_payment_method: string | null
  mindbody_location_id: number | null
  mindbody_remaining_balance_cents: number | null
  mindbody_synced_at: string | null
}

const money = (cents: number | null) => (cents == null ? null : `$${(cents / 100).toFixed(2)}`)

const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('es-PA', { dateStyle: 'medium', timeStyle: 'short' }) : null

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-beige-300 rounded-lg p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-warm-gray-500 mb-3">{title}</h3>
      <dl className="space-y-2">{children}</dl>
    </section>
  )
}

/** One label/value row; hidden entirely when there is no value. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  if (children == null || children === '') return null
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-sm text-warm-gray-500 shrink-0">{label}</dt>
      <dd className="text-sm text-dark text-right break-words min-w-0">{children}</dd>
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
    <div className="grid gap-4 md:grid-cols-2">
      <Section title="Tarjeta">
        <Row label="Monto">
          <span className="text-lg font-display font-semibold tabular-nums">{money(card.amount_cents)}</span>
        </Row>
        <Row label="Base + ITBMS">
          {card.base_amount_cents != null
            ? `${money(card.base_amount_cents)} + ${money(card.tax_cents ?? 0)}`
            : null}
        </Row>
        <Row label="Formato">{card.format === 'certificado' ? 'Certificado' : 'Gift card'}</Row>
        <Row label="Canal">{card.channel}</Row>
        <Row label="Sede">{card.location_label}</Row>
        <Row label="Tratamientos">
          {card.gift_treatment_names?.length ? card.gift_treatment_names.join(' · ') : card.treatment_name}
        </Row>
        <Row label="Vence">{when(card.expires_at)}</Row>
      </Section>

      <Section title="Mindbody">
        <Row label="Saldo">
          {card.mindbody_remaining_balance_cents != null
            ? <span className="tabular-nums">{money(card.mindbody_remaining_balance_cents)}</span>
            : 'Sin sincronizar'}
        </Row>
        <Row label="Barcode ID">{card.mindbody_barcode_id && <span className="font-mono">{card.mindbody_barcode_id}</span>}</Row>
        <Row label="Venta">{card.mindbody_sale_id}</Row>
        <Row label="Forma de pago">{card.sold_payment_method}</Row>
        <Row label="Sede Mindbody">{card.mindbody_location_id}</Row>
        <Row label="Vendida">{when(card.sold_at)}</Row>
        <Row label="Usada">{when(card.redeemed_at)}</Row>
        <Row label="Última sincronización">{when(card.mindbody_synced_at)}</Row>
      </Section>

      <Section title="Comprador">
        <Row label="Nombre">{card.buyer_name}</Row>
        <Row label="Correo">{card.buyer_email}</Row>
        <Row label="Teléfono">{card.buyer_phone}</Row>
        <Row label="Cliente Mindbody">{card.buyer_mindbody_client_id}</Row>
      </Section>

      <Section title="Destinatario">
        <Row label="Nombre">{card.recipient_name}</Row>
        <Row label="Correo">{card.recipient_email}</Row>
        <Row label="Cliente Mindbody">{card.recipient_mindbody_client_id}</Row>
        <Row label="Mensaje">{card.message && <span className="italic">“{card.message}”</span>}</Row>
        <Row label="En la etiqueta">{printFlags || 'nada opcional'}</Row>
      </Section>

      <Section title="Registro">
        <Row label="Emitida">{when(card.issued_at)}</Row>
        <Row label="Emitida por">{card.issued_by_email}</Row>
        <Row label="Notas">{card.notes}</Row>
        {card.voided_at && (
          <>
            <Row label="Anulada">{when(card.voided_at)}</Row>
            <Row label="Motivo">{card.void_reason}</Row>
          </>
        )}
      </Section>
    </div>
  )
}
