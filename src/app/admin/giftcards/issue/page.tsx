'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Gift, ArrowLeft, Loader2, Plus, X } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

interface MindbodyService {
  Id: number
  Name: string
  Price: number
  Category: string
}

interface LocationConfig {
  id: string
  mindbody_location_id: number
  location_name: string
  prefix: string
  serial_length: number
  next_sequence_value: number
  is_active: boolean
}

interface MeResponse {
  locationConfigId: string | null
  locationName: string | null
  isSuperAdmin: boolean
}

type AmountMode = 'amount' | 'treatments'

const DEFAULT_ITBMS_PERCENT = 7

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

  // Scope (location restriction) + available locations
  const [me, setMe] = useState<MeResponse | null>(null)
  const [locations, setLocations] = useState<LocationConfig[]>([])
  const [scopeLoading, setScopeLoading] = useState(true)
  const [scopeError, setScopeError] = useState<string | null>(null)
  const [configId, setConfigId] = useState<string>('')

  // Mindbody treatments (loaded lazily when treatments mode is opened)
  const [services, setServices] = useState<MindbodyService[] | null>(null)
  const [servicesLoading, setServicesLoading] = useState(false)
  const [servicesError, setServicesError] = useState<string | null>(null)

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
  const [printTreatments, setPrintTreatments] = useState(true)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load my scope + the location configs I can use.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [meRes, cfgRes] = await Promise.all([
          fetch('/api/admin/giftcards/me'),
          fetch('/api/admin/giftcards/config'),
        ])
        const meData = await meRes.json()
        const cfgData = await cfgRes.json()
        if (!meRes.ok) throw new Error(meData?.error || 'Error al cargar permisos')
        if (!cfgRes.ok) throw new Error(cfgData?.error || 'Error al cargar ubicaciones')
        if (cancelled) return

        const meTyped: MeResponse = meData
        const activeConfigs: LocationConfig[] = (cfgData.data ?? []).filter((c: LocationConfig) => c.is_active)

        setMe(meTyped)
        setLocations(activeConfigs)

        // Location-restricted admins: lock to their config.
        // Super admins: preselect the only one if there's just one.
        if (meTyped.locationConfigId) {
          setConfigId(meTyped.locationConfigId)
        } else if (activeConfigs.length === 1) {
          setConfigId(activeConfigs[0].id)
        }
      } catch (e) {
        if (!cancelled) setScopeError(e instanceof Error ? e.message : 'Error')
      } finally {
        if (!cancelled) setScopeLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

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

  const computedAmountCents = useMemo(() => {
    if (amountMode === 'treatments') return treatmentTotalCents
    return toCents(openAmount)
  }, [amountMode, treatmentTotalCents, openAmount])

  const treatmentsByCategory = useMemo(() => {
    const groups: Record<string, MindbodyService[]> = {}
    const query = treatmentsSearch.trim().toLowerCase()
    for (const s of services ?? []) {
      if (selectedTreatmentIds.includes(s.Id)) continue
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

    if (!configId) return setError('Selecciona una ubicación')
    if (!buyerName.trim()) return setError('Nombre del comprador requerido')
    if (!recipientName.trim()) return setError('Nombre del destinatario requerido')
    if (computedAmountCents <= 0) {
      return setError(amountMode === 'treatments'
        ? 'Selecciona al menos un tratamiento'
        : 'Monto inválido')
    }

    const includeTreatments = amountMode === 'treatments' && selectedTreatments.length > 0

    const payload = {
      gift_card_serial_config_id: configId,
      buyer_name: buyerName.trim(),
      buyer_email: buyerEmail.trim() || null,
      buyer_phone: buyerPhone.trim() || null,
      recipient_name: recipientName.trim(),
      recipient_email: recipientEmail.trim() || null,
      amount_cents: computedAmountCents,
      gift_treatment_names: includeTreatments
        ? selectedTreatments.map(s => s.Name)
        : null,
      base_amount_cents: includeTreatments ? treatmentSubtotalCents : null,
      tax_cents: includeTreatments ? treatmentItbmsCents : null,
      message: message.trim() || null,
      print_amount: printAmount,
      print_message: printMessage,
      print_recipient: false,
      print_treatments: includeTreatments && printTreatments,
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

  if (scopeLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  if (scopeError) {
    return <div className="p-8 text-red-600">{scopeError}</div>
  }

  const isLocationLocked = !!me?.locationConfigId
  const selectedLocation = locations.find(l => l.id === configId)

  return (
    <div>
      <div className="mb-8">
        {!isLocationLocked && (
          <Link
            href="/admin/giftcards"
            className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-dark mb-3"
          >
            <ArrowLeft className="h-4 w-4" /> Gift Cards
          </Link>
        )}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gold/10 rounded-lg">
            <Gift className="h-6 w-6 text-gold" />
          </div>
          <h1 className="text-3xl font-display font-semibold text-dark">Emitir Gift Card</h1>
        </div>
        <p className="text-warm-gray">
          {isLocationLocked
            ? `Ubicación: ${me?.locationName ?? '—'}. Define el monto, genera el serial e imprime la etiqueta.`
            : 'Selecciona la ubicación, define el monto y genera el serial para imprimir.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location picker — super admin only */}
        {!isLocationLocked && (
          <Card variant="default" padding="md">
            <CardHeader><CardTitle>Ubicación</CardTitle></CardHeader>
            <CardContent>
              {locations.length === 0 ? (
                <div className="text-sm text-warm-gray">
                  No hay ubicaciones activas.{' '}
                  <Link href="/admin/giftcards/config" className="text-gold hover:underline">
                    Crear una ubicación
                  </Link>
                </div>
              ) : (
                <select
                  className="input"
                  value={configId}
                  onChange={e => setConfigId(e.target.value)}
                  required
                >
                  <option value="">— Selecciona una ubicación —</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.location_name} ({loc.prefix})
                    </option>
                  ))}
                </select>
              )}
              {selectedLocation && (
                <div className="text-xs text-warm-gray mt-2">
                  Prefijo: <span className="font-mono text-dark">{selectedLocation.prefix}</span>
                  {' · '}Próximo serial:{' '}
                  <span className="font-mono text-dark">
                    {selectedLocation.prefix}
                    {String(selectedLocation.next_sequence_value).padStart(selectedLocation.serial_length, '0')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 1: amount */}
        <Card variant="default" padding="md">
          <CardHeader><CardTitle>1. Monto</CardTitle></CardHeader>
          <CardContent className="space-y-4">
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
                  required
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
                          <div className="text-dark font-medium mr-3">${s.Price.toFixed(2)}</div>
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

                {/* Picker */}
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
                  Solo para referencia. La Gift Card se emite por el monto total —
                  los tratamientos seleccionados se imprimen en la etiqueta si lo deseas.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Buyer */}
        <Card variant="default" padding="md">
          <CardHeader><CardTitle>2. Comprador</CardTitle></CardHeader>
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

        {/* Recipient */}
        <Card variant="default" padding="md">
          <CardHeader><CardTitle>3. Destinatario</CardTitle></CardHeader>
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

        {/* Print details */}
        <Card variant="default" padding="md">
          <CardHeader><CardTitle>4. Detalles de impresión</CardTitle></CardHeader>
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
              {amountMode === 'treatments' && selectedTreatments.length > 0 && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-gold focus:ring-gold rounded"
                    checked={printTreatments} onChange={e => setPrintTreatments(e.target.checked)} />
                  <span className="text-dark">Imprimir los tratamientos incluidos</span>
                </label>
              )}
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
      </form>
    </div>
  )
}
