'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Gift, ArrowLeft, Loader2 } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

type Format = 'gift_card' | 'certificado'

const DEFAULT_ITBMS_PERCENT = 7

interface MindbodyService {
  Id: number
  Name: string
  Price: number
  Category: string
}

interface FormState {
  format: Format
  buyer_name: string
  buyer_email: string
  buyer_phone: string
  recipient_name: string
  recipient_email: string
  // gift_card
  gift_card_amount: string
  // certificado
  treatment_mindbody_id: string
  treatment_name: string
  certificado_base: string
  certificado_itbms_percent: string
  // shared
  message: string
  print_amount: boolean
  print_message: boolean
  print_recipient: boolean
}

const initial: FormState = {
  format: 'gift_card',
  buyer_name: '',
  buyer_email: '',
  buyer_phone: '',
  recipient_name: '',
  recipient_email: '',
  gift_card_amount: '',
  treatment_mindbody_id: '',
  treatment_name: '',
  certificado_base: '',
  certificado_itbms_percent: String(DEFAULT_ITBMS_PERCENT),
  message: '',
  print_amount: true,
  print_message: true,
  print_recipient: true,
}

function toCents(value: string): number {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.round(n * 100)
}

export default function AdminGiftCardIssuePage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(initial)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mindbody catalog (loaded once when the user switches to Certificado)
  const [services, setServices] = useState<MindbodyService[] | null>(null)
  const [servicesLoading, setServicesLoading] = useState(false)
  const [servicesError, setServicesError] = useState<string | null>(null)

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  useEffect(() => {
    if (form.format !== 'certificado' || services !== null || servicesLoading) return
    let cancelled = false
    setServicesLoading(true)
    setServicesError(null)
    ;(async () => {
      try {
        const res = await fetch('/api/mindbody/services?type=all&includeOffline=true')
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Error al cargar tratamientos')
        if (!cancelled) setServices(data.services ?? [])
      } catch (e) {
        if (!cancelled) setServicesError(e instanceof Error ? e.message : 'Error al cargar tratamientos')
      } finally {
        if (!cancelled) setServicesLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [form.format, services, servicesLoading])

  const servicesByCategory = useMemo(() => {
    const groups: Record<string, MindbodyService[]> = {}
    for (const s of services ?? []) {
      const cat = s.Category || 'General'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(s)
    }
    for (const cat of Object.keys(groups)) {
      groups[cat].sort((a, b) => a.Name.localeCompare(b.Name))
    }
    return groups
  }, [services])

  const sortedCategories = useMemo(
    () => Object.keys(servicesByCategory).sort((a, b) => a.localeCompare(b)),
    [servicesByCategory],
  )

  const certificadoCalc = useMemo(() => {
    const base = Number(form.certificado_base)
    const pct = Number(form.certificado_itbms_percent)
    if (!Number.isFinite(base) || base <= 0) return null
    const tax = base * (Number.isFinite(pct) ? pct : 0) / 100
    const total = base + tax
    return {
      base_cents: Math.round(base * 100),
      tax_cents: Math.round(tax * 100),
      total_cents: Math.round(total * 100),
      total,
    }
  }, [form.certificado_base, form.certificado_itbms_percent])

  const computedAmountCents = form.format === 'gift_card'
    ? toCents(form.gift_card_amount)
    : (certificadoCalc?.total_cents ?? 0)

  const handleSelectTreatment = (mindbodyId: string) => {
    if (!mindbodyId) {
      setForm(prev => ({
        ...prev,
        treatment_mindbody_id: '',
        treatment_name: '',
        certificado_base: '',
      }))
      return
    }
    const svc = services?.find(s => String(s.Id) === mindbodyId)
    if (!svc) return
    setForm(prev => ({
      ...prev,
      treatment_mindbody_id: String(svc.Id),
      treatment_name: svc.Name,
      certificado_base: svc.Price.toFixed(2),
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.buyer_name.trim()) return setError('Nombre del comprador requerido')
    if (!form.recipient_name.trim()) return setError('Nombre del destinatario requerido')
    if (form.format === 'certificado' && !form.treatment_mindbody_id) {
      return setError('Selecciona un tratamiento')
    }
    if (computedAmountCents <= 0) return setError('Monto inválido')

    const payload = {
      format: form.format,
      buyer_name: form.buyer_name.trim(),
      buyer_email: form.buyer_email.trim() || null,
      buyer_phone: form.buyer_phone.trim() || null,
      recipient_name: form.recipient_name.trim(),
      recipient_email: form.recipient_email.trim() || null,
      amount_cents: computedAmountCents,
      base_amount_cents: form.format === 'certificado' ? certificadoCalc?.base_cents ?? null : null,
      tax_cents: form.format === 'certificado' ? certificadoCalc?.tax_cents ?? null : null,
      treatment_mindbody_id: form.format === 'certificado' ? form.treatment_mindbody_id || null : null,
      treatment_name: form.format === 'certificado' ? form.treatment_name.trim() || null : null,
      message: form.message.trim() || null,
      print_amount: form.print_amount,
      print_message: form.print_message,
      print_recipient: form.print_recipient,
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/giftcards/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error al emitir')
      router.push(`/admin/giftcards/issued/${data.id}/print`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al emitir')
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/giftcards"
          className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-dark mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> Gift Cards
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gold/10 rounded-lg">
            <Gift className="h-6 w-6 text-gold" />
          </div>
          <h1 className="text-3xl font-display font-semibold text-dark">Emitir Gift Card</h1>
        </div>
        <p className="text-warm-gray">
          Genera el serial e imprime la etiqueta. Después escanea el serial en Mindbody al momento de la venta.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Format */}
        <Card variant="default" padding="md">
          <CardHeader><CardTitle>Formato</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <label className={`flex gap-3 p-4 rounded-lg border-2 cursor-pointer ${form.format === 'gift_card' ? 'border-gold bg-gold/5' : 'border-beige-300'}`}>
                <input
                  type="radio"
                  name="format"
                  checked={form.format === 'gift_card'}
                  onChange={() => update('format', 'gift_card')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-dark">Gift Card</div>
                  <div className="text-sm text-warm-gray">Monto fijo, definido por el comprador.</div>
                </div>
              </label>
              <label className={`flex gap-3 p-4 rounded-lg border-2 cursor-pointer ${form.format === 'certificado' ? 'border-gold bg-gold/5' : 'border-beige-300'}`}>
                <input
                  type="radio"
                  name="format"
                  checked={form.format === 'certificado'}
                  onChange={() => update('format', 'certificado')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-dark">Certificado de Regalo</div>
                  <div className="text-sm text-warm-gray">Por tratamiento o paquete, incluye ITBMS.</div>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Buyer */}
        <Card variant="default" padding="md">
          <CardHeader><CardTitle>Comprador</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Nombre <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="input"
                  value={form.buyer_name}
                  onChange={e => update('buyer_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  value={form.buyer_email}
                  onChange={e => update('buyer_email', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Teléfono</label>
                <input
                  type="tel"
                  className="input"
                  value={form.buyer_phone}
                  onChange={e => update('buyer_phone', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recipient */}
        <Card variant="default" padding="md">
          <CardHeader><CardTitle>Destinatario</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Nombre <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="input"
                  value={form.recipient_name}
                  onChange={e => update('recipient_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Email (opcional)</label>
                <input
                  type="email"
                  className="input"
                  value={form.recipient_email}
                  onChange={e => update('recipient_email', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amount */}
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle>{form.format === 'gift_card' ? 'Monto' : 'Tratamiento e Importe'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.format === 'gift_card' ? (
              <div className="max-w-xs">
                <label className="label">Monto (USD) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="input"
                  value={form.gift_card_amount}
                  onChange={e => update('gift_card_amount', e.target.value)}
                  required
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="label">Tratamiento (desde Mindbody) <span className="text-red-500">*</span></label>
                  {servicesLoading ? (
                    <div className="input flex items-center gap-2 text-warm-gray">
                      <Loader2 className="h-4 w-4 animate-spin" /> Cargando tratamientos…
                    </div>
                  ) : servicesError ? (
                    <div className="text-red-600 text-sm">{servicesError}</div>
                  ) : (
                    <select
                      className="input"
                      value={form.treatment_mindbody_id}
                      onChange={e => handleSelectTreatment(e.target.value)}
                    >
                      <option value="">— Selecciona un tratamiento —</option>
                      {sortedCategories.map(cat => (
                        <optgroup key={cat} label={cat}>
                          {servicesByCategory[cat].map(svc => (
                            <option key={svc.Id} value={String(svc.Id)}>
                              {svc.Name} — ${svc.Price.toFixed(2)}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  )}
                  <p className="text-xs text-warm-gray mt-1">
                    Los precios de Mindbody no incluyen ITBMS.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="label">Precio base (sin ITBMS)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="input"
                      value={form.certificado_base}
                      onChange={e => update('certificado_base', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">ITBMS (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="input"
                      value={form.certificado_itbms_percent}
                      onChange={e => update('certificado_itbms_percent', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Total (con ITBMS)</label>
                    <div className="input bg-beige-100 text-dark font-medium">
                      {certificadoCalc
                        ? `$${certificadoCalc.total.toFixed(2)}`
                        : '—'}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Message + Print */}
        <Card variant="default" padding="md">
          <CardHeader><CardTitle>Detalles para impresión</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="label">Mensaje / Dedicatoria</label>
              <textarea
                rows={3}
                className="input"
                value={form.message}
                onChange={e => update('message', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.print_amount}
                  onChange={e => update('print_amount', e.target.checked)}
                  className="w-4 h-4 text-gold focus:ring-gold rounded"
                />
                <span className="text-dark">Imprimir el monto</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.print_message}
                  onChange={e => update('print_message', e.target.checked)}
                  className="w-4 h-4 text-gold focus:ring-gold rounded"
                />
                <span className="text-dark">Imprimir el mensaje</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.print_recipient}
                  onChange={e => update('print_recipient', e.target.checked)}
                  className="w-4 h-4 text-gold focus:ring-gold rounded"
                />
                <span className="text-dark">Imprimir el nombre del destinatario</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4">
          {error && <span className="text-red-600 text-sm">{error}</span>}
          <Button type="submit" isLoading={submitting} leftIcon={submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />}>
            Emitir e imprimir
          </Button>
        </div>
      </form>
    </div>
  )
}
