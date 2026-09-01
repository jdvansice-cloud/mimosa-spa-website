'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Gift, Printer, Loader2, RefreshCw } from 'lucide-react'
import { AdminPage } from '@/components/admin/AdminPage'
import { StatusPill } from '@/components/admin/AdminTable'
import { Button } from '@/components/ui'

/**
 * Full record of one gift card — everything captured at creation plus the
 * Mindbody lifecycle. This is the answer to "a customer is at the counter
 * with a question about this card": one screen, no digging.
 */

interface CardDetail {
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
  currency: string
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

function status(card: CardDetail): { label: string; tone: 'green' | 'amber' | 'gray' | 'red' } {
  if (card.voided_at) return { label: 'Anulada', tone: 'red' }
  if (card.redeemed_at) return { label: 'Usada', tone: 'gray' }
  if (card.sold_at) return { label: 'Vendida', tone: 'green' }
  return { label: 'Emitida', tone: 'amber' }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-beige-300 rounded-lg p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-warm-gray-500 mb-3">{title}</h2>
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

export default function GiftCardDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [card, setCard] = useState<CardDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    try {
      const res = await fetch(`/api/admin/giftcards/issued/${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'No encontrada')
      setCard(data.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No encontrada')
    }
  }, [id])

  useEffect(() => { load() }, [load])

  const handleSync = async () => {
    if (!id) return
    setSyncing(true)
    setToast(null)
    try {
      const res = await fetch(`/api/admin/giftcards/issued/${id}/sync`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error al sincronizar')
      setToast(data.status === 'not_found_in_mindbody'
        ? (data.message || 'No encontrada en Mindbody todavía.')
        : 'Sincronizada con Mindbody.')
      await load()
    } catch (e) {
      setToast(e instanceof Error ? e.message : 'Error al sincronizar')
    } finally {
      setSyncing(false)
      setTimeout(() => setToast(null), 4000)
    }
  }

  if (error) {
    return (
      <AdminPage title="Gift card" icon={Gift} breadcrumb={{ href: '/admin/giftcards/issued', label: 'Emitidas' }}>
        <div className="p-6 rounded-lg bg-red-50 border border-red-200 text-red-700" role="alert">{error}</div>
      </AdminPage>
    )
  }

  if (!card) {
    return (
      <AdminPage title="Gift card" icon={Gift} breadcrumb={{ href: '/admin/giftcards/issued', label: 'Emitidas' }}>
        <div className="flex justify-center py-12" aria-busy="true">
          <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
        </div>
      </AdminPage>
    )
  }

  const st = status(card)
  const printFlags = [
    card.print_amount && 'monto',
    card.print_recipient && 'destinatario',
    card.print_message && 'mensaje',
    card.print_treatments && 'tratamientos',
  ].filter(Boolean).join(' · ')

  return (
    <AdminPage
      title={card.serial}
      icon={Gift}
      breadcrumb={{ href: '/admin/giftcards/issued', label: 'Emitidas' }}
      description={<StatusPill tone={st.tone}>{st.label}</StatusPill>}
      actions={
        <>
          <Button variant="secondary" onClick={handleSync} disabled={syncing}
            leftIcon={syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}>
            Sincronizar
          </Button>
          <Link href={`/admin/giftcards/issued/${card.id}/print`}>
            <Button leftIcon={<Printer className="h-4 w-4" />}>Imprimir etiqueta</Button>
          </Link>
        </>
      }
    >
      {toast && (
        <div className="mb-4 p-3 rounded-lg bg-beige-100 border border-beige-300 text-warm-gray-700">{toast}</div>
      )}

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
    </AdminPage>
  )
}
