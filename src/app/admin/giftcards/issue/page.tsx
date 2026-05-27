'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Gift, ArrowLeft, Loader2, Plus, X } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

type Category = 'gift_card' | 'certificado' | 'privilege'

interface GiftCardType {
  id: string
  name: string
  value_cents: number | null
  category: Category
  prefix: string
  serial_length: number
  is_active: boolean
}

interface MindbodyService {
  Id: number
  Name: string
  Price: number
  Category: string
}

type AmountMode = 'treatments' | 'amount'

const DEFAULT_ITBMS_PERCENT = 7

const CATEGORY_LABEL: Record<Category, string> = {
  gift_card: 'Gift Card',
  certificado: 'Certificado',
  privilege: 'Privilege',
}

function formatMoney(cents: number | null | undefined): string {
  if (cents == null) return '—'
  return `$${(cents / 100).toFixed(2)}`
}

function toCents(value: string): number {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.round(n * 100)
}

export default function AdminGiftCardIssuePage() {
  const router = useRouter()

  // Types catalog
  const [types, setTypes] = useState<GiftCardType[]>([])
  const [typesLoading, setTypesLoading] = useState(true)
  const [typesError, setTypesError] = useState<string | null>(null)

  // Mindbody treatments (loaded lazily when treatments mode is opened)
  const [services, setServices] = useState<MindbodyService[] | null>(null)
  const [servicesLoading, setServicesLoading] = useState(false)
  const [servicesError, setServicesError] = useState<string | null>(null)

  // Form state
  const [typeId, setTypeId] = useState('')
  const [amountMode, setAmountMode] = useState<AmountMode>('amount')
  const [openAmount, setOpenAmount] = useState('')
  const [selectedTreatmentIds, setSelectedTreatmentIds] = useState<number[]>([])
  const [itbmsPercent, setItbmsPercent] = useState(String(DEFAULT_ITBMS_PERCENT))
  const [treatmentsSearch, setTreatmentsSearch] = useState('')

  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [message, setMessage] = useState('')
  const [printAmount, setPrintAmount] = useState(true)
  const [printMessage, setPrintMessage] = useState(true)
  const [printRecipient, setPrintRecipient] = useState(true)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load types
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/giftcards/types?activeOnly=true')
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Error al cargar tipos')
        setTypes(data.data ?? [])
      } catch (e) {
        setTypesError(e instanceof Error ? e.message : 'Error al cargar tipos')
      } finally {
        setTypesLoading(false)
      }
    })()
  }, [])

  const selectedType = useMemo(
    () => types.find(t => t.id === typeId) ?? null,
    [types, typeId],
  )

  const isOpenAmount = selectedType
    ? !selectedType.value_cents || selectedType.value_cents === 0
    : false

  // Reset amount-related state when type changes
  useEffect(() => {
    setOpenAmount('')
    setSelectedTreatmentIds([])
    setAmountMode('amount')
    setError(null)
  }, [typeId])

  // Lazy load Mindbody services when entering treatments mode
  useEffect(() => {
    if (amountMode !== 'treatments' || services !== null || servicesLoading) return
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
  }, [amountMode, services, servicesLoading])

  const selectedTreatments = useMemo(
    () => selectedTreatmentIds
      .map(id => services?.find(s => s.Id === id))
      .filter((s): s is MindbodyService => !!s),
    [selectedTreatmentIds, services],
  )

  const treatmentSubtotalCents = useMemo(
    () => selectedTreatments.reduce((acc, s) => acc + Math.round(s.Price * 100), 0),
    [selectedTreatments],
  )

  const treatmentItbmsCents = useMemo(() => {
    const pct = Number(itbmsPercent)
    if (!Number.isFinite(pct)) return 0
    return Math.round(treatmentSubtotalCents * pct / 100)
  }, [treatmentSubtotalCents, itbmsPercent])

  const treatmentTotalCents = treatmentSubtotalCents + treatmentItbmsCents

  // The effective amount the gift card will be issued for.
  const computedAmountCents = useMemo(() => {
    if (!selectedType) return 0
    if (!isOpenAmount) return selectedType.value_cents ?? 0
    if (amountMode === 'treatments') return treatmentTotalCents
    return toCents(openAmount)
  }, [selectedType, isOpenAmount, amountMode, treatmentTotalCents, openAmount])

  // Filtered treatments for the picker
  const treatmentsByCategory = useMemo(() => {
    const groups: Record<string, MindbodyService[]> = {}
    const query = treatmentsSearch.trim().toLowerCase()
    for (const s of services ?? []) {
      if (selectedTreatmentIds.includes(s.Id)) continue // already picked
      if (query && !s.Name.toLowerCase().includes(query)) continue
      const cat = s.Category || 'General'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(s)
    }
    for (const cat of Object.keys(groups)) {
      groups[cat].sort((a, b) => a.Name.localeCompare(b.Name))
    }
    return groups
  }, [services, selectedTreatmentIds, treatmentsSearch])

  const sortedTreatmentCategories = useMemo(
    () => Object.keys(treatmentsByCategory).sort((a, b) => a.localeCompare(b)),
    [treatmentsByCategory],
  )

  const addTreatment = (id: number) => {
    setSelectedTreatmentIds(prev => prev.includes(id) ? prev : [...prev, id])
  }
  const removeTreatment = (id: number) => {
    setSelectedTreatmentIds(prev => prev.filter(x => x !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedType) return setError('Selecciona un tipo de tarjeta')
    if (!buyerName.trim()) return setError('Nombre del comprador requerido')
    if (!recipientName.trim()) return setError('Nombre del destinatario requerido')

    let amountOverride: number | null = null
    if (isOpenAmount) {
      if (computedAmountCents <= 0) {
        return setError(amountMode === 'treatments'
          ? 'Selecciona al menos un tratamiento'
          : 'Monto inválido')
      }
      amountOverride = computedAmountCents
    }

    const payload = {
      gift_card_type_id: selectedType.id,
      buyer_name: buyerName.trim(),
      buyer_email: buyerEmail.trim() || null,
      buyer_phone: buyerPhone.trim() || null,
      recipient_name: recipientName.trim(),
      recipient_email: recipientEmail.trim() || null,
      amount_cents_override: amountOverride,
      message: message.trim() || null,
      print_amount: printAmount,
      print_message: printMessage,
      print_recipient: printRecipient,
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
          Selecciona el tipo de tarjeta, define el monto (por tratamientos o directo)
          y genera el serial para imprimir.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: type */}
        <Card variant="default" padding="md">
          <CardHeader><CardTitle>1. Tipo de Tarjeta</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {typesLoading ? (
              <div className="input flex items-center gap-2 text-warm-gray">
                <Loader2 className="h-4 w-4 animate-spin" /> Cargando tipos…
              </div>
            ) : typesError ? (
              <div className="text-red-600 text-sm">{typesError}</div>
            ) : types.length === 0 ? (
              <div className="text-sm text-warm-gray">
                No hay tipos activos.{' '}
                <Link href="/admin/giftcards/types" className="text-gold hover:underline">
                  Sincronizar desde Mindbody
                </Link>
              </div>
            ) : (
              <>
                <select
                  className="input"
                  value={typeId}
                  onChange={e => setTypeId(e.target.value)}
                  required
                >
                  <option value="">— Selecciona un tipo —</option>
                  {(['gift_card', 'certificado', 'privilege'] as Category[]).map(cat => {
                    const inCat = types.filter(t => t.category === cat)
                    if (inCat.length === 0) return null
                    return (
                      <optgroup key={cat} label={CATEGORY_LABEL[cat]}>
                        {inCat
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map(t => (
                            <option key={t.id} value={t.id}>
                              {t.name} — {t.value_cents && t.value_cents > 0 ? formatMoney(t.value_cents) : 'Abierto'}
                            </option>
                          ))}
                      </optgroup>
                    )
                  })}
                </select>
                {selectedType && (
                  <div className="text-xs text-warm-gray">
                    Prefijo: <span className="font-mono text-dark">{selectedType.prefix}</span>
                    {' · '}Longitud: {selectedType.serial_length}
                    {' · '}Categoría: {CATEGORY_LABEL[selectedType.category]}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Step 2: amount — only when a type is selected */}
        {selectedType && (
          <Card variant="default" padding="md">
            <CardHeader>
              <CardTitle>2. Monto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isOpenAmount ? (
                <div>
                  <div className="text-xs uppercase tracking-widest text-warm-gray">
                    Valor fijo del tipo seleccionado
                  </div>
                  <div className="text-2xl font-display font-semibold text-gold mt-1">
                    {formatMoney(selectedType.value_cents)}
                  </div>
                </div>
              ) : (
                <>
                  {/* Mode toggle */}
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className={`flex gap-3 p-4 rounded-lg border-2 cursor-pointer ${amountMode === 'amount' ? 'border-gold bg-gold/5' : 'border-beige-300'}`}>
                      <input
                        type="radio"
                        name="amountMode"
                        checked={amountMode === 'amount'}
                        onChange={() => setAmountMode('amount')}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-dark">Monto directo</div>
                        <div className="text-sm text-warm-gray">Ingresa el valor de la tarjeta.</div>
                      </div>
                    </label>
                    <label className={`flex gap-3 p-4 rounded-lg border-2 cursor-pointer ${amountMode === 'treatments' ? 'border-gold bg-gold/5' : 'border-beige-300'}`}>
                      <input
                        type="radio"
                        name="amountMode"
                        checked={amountMode === 'treatments'}
                        onChange={() => setAmountMode('treatments')}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-dark">Por tratamientos</div>
                        <div className="text-sm text-warm-gray">Suma tratamientos + ITBMS — referencia para el cliente.</div>
                      </div>
                    </label>
                  </div>

                  {amountMode === 'amount' ? (
                    <div className="max-w-xs">
                      <label className="label">Monto (USD) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="input"
                        value={openAmount}
                        onChange={e => setOpenAmount(e.target.value)}
                        required={amountMode === 'amount'}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Selected treatments */}
                      <div>
                        <div className="text-xs uppercase tracking-widest text-warm-gray mb-2">
                          Tratamientos seleccionados
                        </div>
                        {selectedTreatments.length === 0 ? (
                          <div className="text-sm text-warm-gray italic">Ninguno todavía.</div>
                        ) : (
                          <ul className="divide-y divide-beige-200 border border-beige-200 rounded-lg overflow-hidden">
                            {selectedTreatments.map(s => (
                              <li key={s.Id} className="flex items-center justify-between px-3 py-2 text-sm">
                                <div className="flex-1">
                                  <div className="text-dark">{s.Name}</div>
                                  <div className="text-xs text-warm-gray">{s.Category}</div>
                                </div>
                                <div className="text-dark font-medium mr-3">
                                  ${s.Price.toFixed(2)}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeTreatment(s.Id)}
                                  className="p-1 text-warm-gray hover:text-red-500"
                                  aria-label="Quitar"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Treatment picker */}
                      <div>
                        <div className="text-xs uppercase tracking-widest text-warm-gray mb-2">
                          Agregar tratamiento
                        </div>
                        {servicesLoading ? (
                          <div className="input flex items-center gap-2 text-warm-gray">
                            <Loader2 className="h-4 w-4 animate-spin" /> Cargando tratamientos…
                          </div>
                        ) : servicesError ? (
                          <div className="text-red-600 text-sm">{servicesError}</div>
                        ) : (
                          <>
                            <input
                              type="search"
                              placeholder="Buscar por nombre…"
                              className="input mb-2"
                              value={treatmentsSearch}
                              onChange={e => setTreatmentsSearch(e.target.value)}
                            />
                            <div className="max-h-72 overflow-y-auto border border-beige-200 rounded-lg">
                              {sortedTreatmentCategories.length === 0 ? (
                                <div className="px-3 py-4 text-sm text-warm-gray text-center">
                                  No hay resultados.
                                </div>
                              ) : (
                                sortedTreatmentCategories.map(cat => (
                                  <div key={cat}>
                                    <div className="px-3 py-1 bg-beige-100 text-xs uppercase tracking-widest text-warm-gray sticky top-0">
                                      {cat}
                                    </div>
                                    {treatmentsByCategory[cat].map(s => (
                                      <button
                                        key={s.Id}
                                        type="button"
                                        onClick={() => addTreatment(s.Id)}
                                        className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-beige-50 border-t border-beige-200"
                                      >
                                        <span className="text-dark text-left flex-1">{s.Name}</span>
                                        <span className="text-warm-gray mr-3">${s.Price.toFixed(2)}</span>
                                        <Plus className="h-4 w-4 text-gold" />
                                      </button>
                                    ))}
                                  </div>
                                ))
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Totals */}
                      <div className="grid gap-4 md:grid-cols-3 pt-2 border-t border-beige-200">
                        <div>
                          <div className="text-xs uppercase tracking-widest text-warm-gray">Subtotal</div>
                          <div className="text-dark font-medium mt-1">{formatMoney(treatmentSubtotalCents)}</div>
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest text-warm-gray">ITBMS (%)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="input mt-1"
                            value={itbmsPercent}
                            onChange={e => setItbmsPercent(e.target.value)}
                          />
                          <div className="text-xs text-warm-gray mt-1">
                            = {formatMoney(treatmentItbmsCents)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-widest text-warm-gray">Total</div>
                          <div className="text-2xl font-display font-semibold text-gold mt-1">
                            {formatMoney(treatmentTotalCents)}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-warm-gray">
                        Solo para referencia del cliente. La Gift Card se emite por el monto total — no se vincula al tratamiento.
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3+: only after a type is picked */}
        {selectedType && (
          <>
            <Card variant="default" padding="md">
              <CardHeader><CardTitle>3. Comprador</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="label">Nombre <span className="text-red-500">*</span></label>
                    <input type="text" className="input" value={buyerName} onChange={e => setBuyerName(e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input type="email" className="input" value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Teléfono</label>
                    <input type="tel" className="input" value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="default" padding="md">
              <CardHeader><CardTitle>4. Destinatario</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="label">Nombre <span className="text-red-500">*</span></label>
                    <input type="text" className="input" value={recipientName} onChange={e => setRecipientName(e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">Email (opcional)</label>
                    <input type="email" className="input" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="default" padding="md">
              <CardHeader><CardTitle>5. Detalles de impresión</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="label">Mensaje / Dedicatoria</label>
                  <textarea rows={3} className="input" value={message} onChange={e => setMessage(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-gold focus:ring-gold rounded"
                      checked={printAmount} onChange={e => setPrintAmount(e.target.checked)} />
                    <span className="text-dark">Imprimir el monto</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-gold focus:ring-gold rounded"
                      checked={printMessage} onChange={e => setPrintMessage(e.target.checked)} />
                    <span className="text-dark">Imprimir el mensaje</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-gold focus:ring-gold rounded"
                      checked={printRecipient} onChange={e => setPrintRecipient(e.target.checked)} />
                    <span className="text-dark">Imprimir el nombre del destinatario</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-warm-gray">
                {computedAmountCents > 0
                  ? <>Se emitirá por <span className="text-dark font-medium">{formatMoney(computedAmountCents)}</span></>
                  : '—'}
              </div>
              <div className="flex items-center gap-4">
                {error && <span className="text-red-600 text-sm">{error}</span>}
                <Button type="submit" isLoading={submitting} leftIcon={submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />}>
                  Emitir e imprimir
                </Button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
