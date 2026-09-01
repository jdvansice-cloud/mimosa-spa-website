'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Gift, ArrowLeft, Loader2, Plus, X , ChevronRight, ChevronDown } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { ClientLookupInput, type ClientSuggestion } from '@/components/admin/ClientLookupInput'

interface Treatment {
  mindbody_service_id: number
  service_name: string
  price: number
  program_id: number | null
  category: string | null
}

type TreatmentGroup = 'body' | 'facial' | 'addon'

interface ActivePromo {
  id: string
  title_es: string
  services: string[]
  price: number
}

const GROUP_LABEL: Record<TreatmentGroup, string> = {
  body: 'Masajes',
  facial: 'Faciales',
  addon: 'Adicionales',
}

interface TreatmentsResponse {
  data: Treatment[]
  grouped: Record<TreatmentGroup, Treatment[]>
  count: number
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
  const [services, setServices] = useState<Treatment[] | null>(null)
  const [groupedServices, setGroupedServices] = useState<Record<TreatmentGroup, Treatment[]>>({
    body: [], facial: [], addon: [],
  })
  const [servicesLoading, setServicesLoading] = useState(false)
  const [servicesError, setServicesError] = useState<string | null>(null)

  const [amountMode, setAmountMode] = useState<AmountMode>('amount')
  const [openAmount, setOpenAmount] = useState('')
  const [selectedTreatmentIds, setSelectedTreatmentIds] = useState<number[]>([])
  const [itbmsPercent, setItbmsPercent] = useState(String(DEFAULT_ITBMS_PERCENT))
  const [treatmentsSearch, setTreatmentsSearch] = useState('')
  // Categories start COLLAPSED — reception scans headers, opens the one they
  // need. An active search overrides this and shows only matching items.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const [promos, setPromos] = useState<ActivePromo[]>([])
  const [promosOpen, setPromosOpen] = useState(false)
  const [selectedPromo, setSelectedPromo] = useState<ActivePromo | null>(null)

  useEffect(() => {
    fetch('/api/promotions')
      .then(r => r.json())
      .then(d => {
        const rows = (Array.isArray(d) ? d : d.data ?? []) as Array<Record<string, unknown>>
        setPromos(rows.map(r => ({
          id: String(r.id),
          title_es: String(r.title_es ?? ''),
          services: Array.isArray(r.services) ? (r.services as string[]) : [],
          price: Number(r.price) || 0,
        })).filter(p => p.price > 0))
      })
      .catch(() => { /* promos are optional — the picker still works without them */ })
  }, [])

  const [buyerName, setBuyerName] = useState('')
  // Set only by picking from the lookup; any manual edit of the name clears
  // it, so a card never claims a Mindbody identity the staff typed over.
  const [buyerClientId, setBuyerClientId] = useState<number | null>(null)
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientClientId, setRecipientClientId] = useState<number | null>(null)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [message, setMessage] = useState('')
  const [staffNote, setStaffNote] = useState('')
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

  // Lazy load treatments from Supabase (treatment_settings) when entering
  // treatments mode. This is the same source the public menu + booking app
  // use, so it stays consistent with what staff sees elsewhere.
  //
  // NOTE: servicesLoading is intentionally NOT in the dep array — including
  // it would cause this effect to re-run after we flip the flag to true,
  // cancelling the in-flight fetch and leaving the spinner stuck on.
  useEffect(() => {
    if (amountMode !== 'treatments' || services !== null) return
    let cancelled = false
    setServicesLoading(true)
    setServicesError(null)
    ;(async () => {
      try {
        const res = await fetch('/api/admin/giftcards/treatments')
        const data = await res.json() as TreatmentsResponse | { error?: string }
        if (!res.ok) {
          throw new Error('error' in data && data.error ? data.error : 'Error al cargar tratamientos')
        }
        if (!cancelled) {
          const typed = data as TreatmentsResponse
          setServices(typed.data ?? [])
          setGroupedServices(typed.grouped ?? { body: [], facial: [], addon: [] })
        }
      } catch (e) {
        if (!cancelled) setServicesError(e instanceof Error ? e.message : 'Error al cargar tratamientos')
      } finally {
        if (!cancelled) setServicesLoading(false)
      }
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountMode, services])

  const selectedTreatments = useMemo(
    () => selectedTreatmentIds
      .map(id => services?.find(s => s.mindbody_service_id === id))
      .filter((s): s is Treatment => !!s),
    [selectedTreatmentIds, services],
  )

  const treatmentSubtotalCents = useMemo(
    () =>
      selectedTreatments.reduce((acc, s) => acc + Math.round(s.price * 100), 0) +
      (selectedPromo ? Math.round(selectedPromo.price * 100) : 0),
    [selectedTreatments, selectedPromo],
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

  // Three fixed buckets in display order (Body / Facial / Addon).
  // Filter out already-selected rows and apply the search query.
  const groupOrder: TreatmentGroup[] = ['body', 'facial', 'addon']
  const visibleGroups = useMemo(() => {
    const query = treatmentsSearch.trim().toLowerCase()
    return groupOrder
      .map(g => ({
        group: g,
        items: (groupedServices[g] ?? [])
          .filter(s => !selectedTreatmentIds.includes(s.mindbody_service_id))
          .filter(s => !query || s.service_name.toLowerCase().includes(query)),
      }))
      .filter(g => g.items.length > 0)
  }, [groupedServices, selectedTreatmentIds, treatmentsSearch])

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
      buyer_mindbody_client_id: buyerClientId,
      buyer_email: buyerEmail.trim() || null,
      buyer_phone: buyerPhone.trim() || null,
      recipient_name: recipientName.trim(),
      recipient_mindbody_client_id: recipientClientId,
      recipient_email: recipientEmail.trim() || null,
      amount_cents: computedAmountCents,
      gift_treatment_names: includeTreatments
        ? [...(selectedPromo?.services ?? []), ...selectedTreatments.map(s => s.service_name)]
        : null,
      base_amount_cents: includeTreatments ? treatmentSubtotalCents : null,
      tax_cents: includeTreatments ? treatmentItbmsCents : null,
      message: message.trim() || null,
      print_amount: printAmount,
      print_message: printMessage,
      print_recipient: false,
      print_treatments: includeTreatments && printTreatments,
      notes: staffNote.trim() || null,
      promotion_id: selectedPromo?.id ?? null,
      promotion_name: selectedPromo?.title_es ?? null,
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
            className="inline-flex items-center gap-1 text-sm text-warm-gray-500 hover:text-dark mb-3"
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
        <p className="text-warm-gray-500">
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
                <div className="text-sm text-warm-gray-500">
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
                <div className="text-xs text-warm-gray-500 mt-2">
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
                  <div className="text-sm text-warm-gray-500">Ingresa el valor de la tarjeta.</div>
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
                  <div className="text-sm text-warm-gray-500">Suma tratamientos + ITBMS — referencia para el cliente.</div>
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
                  <div className="text-xs uppercase tracking-widest text-warm-gray-500 mb-2">
                    Tratamientos seleccionados
                  </div>
                  {selectedPromo && (
                    <div className="mb-2 flex items-start justify-between rounded-lg border border-gold/40 bg-gold/5 px-3 py-2 text-sm">
                      <div className="flex-1">
                        <div className="text-dark font-medium">{selectedPromo.title_es}
                          <span className="ml-2 text-[10px] uppercase tracking-wide text-gold-700 bg-gold/10 rounded px-1.5 py-0.5">Promo</span>
                        </div>
                        {selectedPromo.services.length > 0 && (
                          <div className="text-xs text-warm-gray-500 mt-0.5">{selectedPromo.services.join(' · ')}</div>
                        )}
                      </div>
                      <div className="text-dark font-medium mr-3">${selectedPromo.price.toFixed(2)}</div>
                      <button type="button" onClick={() => setSelectedPromo(null)}
                        className="p-1 text-warm-gray-500 hover:text-red-500" aria-label="Quitar promoción">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {selectedTreatments.length === 0 && !selectedPromo ? (
                    <div className="text-sm text-warm-gray-500 italic">Ninguno todavía.</div>
                  ) : (
                    <ul className="divide-y divide-beige-200 border border-beige-200 rounded-lg overflow-hidden">
                      {selectedTreatments.map(s => (
                        <li key={s.mindbody_service_id} className="flex items-center justify-between px-3 py-2 text-sm">
                          <div className="flex-1">
                            <div className="text-dark">{s.service_name}</div>
                            {s.category && (
                              <div className="text-xs text-warm-gray-500">{s.category}</div>
                            )}
                          </div>
                          <div className="text-dark font-medium mr-3">${s.price.toFixed(2)}</div>
                          <button
                            type="button"
                            onClick={() => removeTreatment(s.mindbody_service_id)}
                            className="p-1 text-warm-gray-500 hover:text-red-500"
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
                  <div className="text-xs uppercase tracking-widest text-warm-gray-500 mb-2">
                    Agregar tratamiento
                  </div>
                  {servicesLoading ? (
                    <div className="input flex items-center gap-2 text-warm-gray-500">
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
                      <div className="max-h-96 overflow-y-auto border border-beige-200 rounded-lg">
                        {/* Active site promotions: their treatments at the promo price. */}
                        {!treatmentsSearch.trim() && promos.length > 0 && !selectedPromo && (
                          <div>
                            <button
                              type="button"
                              onClick={() => setPromosOpen(o => !o)}
                              aria-expanded={promosOpen}
                              className="w-full flex items-center justify-between px-3 py-2 bg-gold/10 text-xs uppercase tracking-widest text-gold-700 font-bold"
                            >
                              <span>Promociones activas ({promos.length})</span>
                              {promosOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>
                            {promosOpen && promos.map(promo => (
                              <button
                                key={promo.id}
                                type="button"
                                onClick={() => { setSelectedPromo(promo); setPromosOpen(false) }}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gold/5 border-t border-beige-200"
                              >
                                <span className="text-left flex-1 min-w-0">
                                  <span className="block text-dark">{promo.title_es}</span>
                                  {promo.services.length > 0 && (
                                    <span className="block text-xs text-warm-gray-500 truncate">{promo.services.join(' · ')}</span>
                                  )}
                                </span>
                                <span className="text-warm-gray-500 mx-3 shrink-0">${promo.price.toFixed(2)}</span>
                                <Plus className="h-4 w-4 text-gold shrink-0" />
                              </button>
                            ))}
                          </div>
                        )}
                        {visibleGroups.length === 0 ? (
                          <div className="px-3 py-4 text-sm text-warm-gray-500 text-center">
                            No hay resultados.
                          </div>
                        ) : (
                          visibleGroups.map(({ group, items }) => {
                            // Searching shows matches directly; otherwise each
                            // category opens on demand so the list starts short.
                            const searching = !!treatmentsSearch.trim()
                            const open = searching || !!openGroups[group]
                            return (
                            <div key={group}>
                              <button
                                type="button"
                                onClick={() => setOpenGroups(g => ({ ...g, [group]: !g[group] }))}
                                aria-expanded={open}
                                disabled={searching}
                                className="w-full flex items-center justify-between px-3 py-2 bg-beige-100 text-xs uppercase tracking-widest text-warm-gray-500 font-bold sticky top-0"
                              >
                                <span>{GROUP_LABEL[group]} ({items.length})</span>
                                {!searching && (open
                                  ? <ChevronDown className="h-4 w-4" />
                                  : <ChevronRight className="h-4 w-4" />)}
                              </button>
                              {open && items.map(s => (
                                <button
                                  key={s.mindbody_service_id}
                                  type="button"
                                  onClick={() => addTreatment(s.mindbody_service_id)}
                                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-beige-50 border-t border-beige-200"
                                >
                                  <span className="text-dark text-left flex-1">{s.service_name}</span>
                                  <span className="text-warm-gray-500 mr-3">${s.price.toFixed(2)}</span>
                                  <Plus className="h-4 w-4 text-gold" />
                                </button>
                              ))}
                            </div>
                            )
                          })
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Totals */}
                <div className="grid gap-4 md:grid-cols-3 pt-2 border-t border-beige-200">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-warm-gray-500">Subtotal</div>
                    <div className="text-dark font-medium mt-1">{formatMoney(treatmentSubtotalCents)}</div>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-warm-gray-500">ITBMS (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="input mt-1"
                      value={itbmsPercent}
                      onChange={e => setItbmsPercent(e.target.value)}
                    />
                    <div className="text-xs text-warm-gray-500 mt-1">
                      = {formatMoney(treatmentItbmsCents)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-warm-gray-500">Total</div>
                    <div className="text-2xl font-bold text-gold mt-1 tabular-nums">
                      {formatMoney(treatmentTotalCents)}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-warm-gray-500">
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
                <label className="label" htmlFor="buyer-name">Nombre <span className="text-red-500">*</span></label>
                <ClientLookupInput
                  id="buyer-name"
                  value={buyerName}
                  onChange={v => { setBuyerName(v); setBuyerClientId(null) }}
                  onSelect={(c: ClientSuggestion) => {
                    setBuyerClientId(Number(c.id) || null)
                    if (c.email) setBuyerEmail(prev => prev || c.email!)
                    if (c.phone) setBuyerPhone(prev => prev || c.phone!)
                  }}
                  required
                  placeholder="Buscar cliente o escribir un nombre"
                />
                {buyerClientId && (
                  <p className="mt-1 text-xs text-warm-gray-500">Cliente Mindbody #{buyerClientId}</p>
                )}
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
                <label className="label" htmlFor="recipient-name">Nombre <span className="text-red-500">*</span></label>
                <ClientLookupInput
                  id="recipient-name"
                  value={recipientName}
                  onChange={v => { setRecipientName(v); setRecipientClientId(null) }}
                  onSelect={(c: ClientSuggestion) => {
                    setRecipientClientId(Number(c.id) || null)
                    if (c.email) setRecipientEmail(prev => prev || c.email!)
                  }}
                  required
                  placeholder="Buscar cliente o escribir un nombre"
                />
                {recipientClientId && (
                  <p className="mt-1 text-xs text-warm-gray-500">Cliente Mindbody #{recipientClientId}</p>
                )}
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
            <div>
              <label className="label">Nota interna</label>
              <textarea
                rows={2}
                className="input"
                value={staffNote}
                onChange={e => setStaffNote(e.target.value)}
                placeholder="Solo la ve el personal — nunca se imprime ni se envía al cliente."
              />
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
          <div className="text-sm text-warm-gray-500">
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
