'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, Loader2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent, Spinner } from '@/components/ui'

interface MarketingOffer {
  id: string
  key: string
  page: string
  name_es: string
  name_en: string
  description_es: string | null
  description_en: string | null
  price: number | null
  includes_es: string[]
  includes_en: string[]
  whatsapp_text_es: string | null
  whatsapp_text_en: string | null
  image_key: string | null
  mindbody_service_id: number | null
  badge_es: string | null
  badge_en: string | null
  is_active: boolean
  sort_order: number
}

const PAGE_LABELS: Record<string, string> = {
  parejas: 'Parejas y Ocasiones',
  'club-mimosa': 'Club Mimosa',
  'primera-visita': 'Primera Visita',
  empresas: 'Empresas',
}

// One generic editor for all marketing offers (couples rituals, club tiers,
// first-visit offer): prices and copy change without deploys.
export default function AdminOfertasPage() {
  const [offers, setOffers] = useState<MarketingOffer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, MarketingOffer>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/offers')
      if (res.ok) {
        const { data } = await res.json()
        setOffers(data || [])
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const draftFor = (o: MarketingOffer) => drafts[o.id] ?? o
  const setDraft = (id: string, patch: Partial<MarketingOffer>) => {
    setDrafts((d) => ({ ...d, [id]: { ...(d[id] ?? offers.find((o) => o.id === id)!), ...patch } }))
  }

  const save = async (id: string) => {
    const draft = drafts[id]
    if (!draft) return
    setSavingId(id)
    setError(null)
    try {
      const res = await fetch('/api/admin/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setError(body?.error || 'Error al guardar')
        return
      }
      setDrafts((d) => {
        const next = { ...d }
        delete next[id]
        return next
      })
      await load()
    } finally {
      setSavingId(null)
    }
  }

  const toggleActive = async (o: MarketingOffer) => {
    await fetch('/api/admin/offers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: o.id, is_active: !o.is_active }),
    })
    await load()
  }

  const pages = Array.from(new Set(offers.map((o) => o.page)))

  const inputCls = 'w-full border border-beige rounded-lg p-2 text-sm'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Ofertas y Precios</h1>
        <p className="text-warm-gray-500 text-sm mt-1">
          Rituales de pareja, planes del Club Mimosa y la oferta de primera visita.
          Los cambios se publican al instante, sin deploy.
        </p>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {isLoading ? (
        <Spinner className="py-12" />
      ) : (
        pages.map((page) => (
          <Card key={page}>
            <CardHeader>
              <CardTitle>{PAGE_LABELS[page] || page}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-beige">
                {offers
                  .filter((o) => o.page === page)
                  .map((o) => {
                    const d = draftFor(o)
                    const open = openId === o.id
                    return (
                      <li key={o.id} className="py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setOpenId(open ? null : o.id)}
                            className="flex-1 flex items-center gap-3 text-left"
                          >
                            {open ? (
                              <ChevronUp className="h-4 w-4 text-warm-gray-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-warm-gray-500" />
                            )}
                            <span className="font-medium text-sm text-dark">{o.name_es}</span>
                            {o.price != null && (
                              <span className="text-sm font-semibold text-gold-600">
                                ${Number(o.price).toFixed(0)}
                              </span>
                            )}
                            {!o.is_active && (
                              <span className="text-xs bg-beige text-warm-gray-500 rounded-full px-2 py-0.5">
                                Oculta
                              </span>
                            )}
                          </button>
                          <button
                            onClick={() => toggleActive(o)}
                            className="p-2 text-warm-gray-500 hover:text-dark"
                            title={o.is_active ? 'Ocultar' : 'Mostrar'}
                          >
                            {o.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                        </div>

                        {open && (
                          <div className="mt-4 space-y-3 pl-7">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="label">Nombre (ES)</label>
                                <input
                                  className={inputCls}
                                  value={d.name_es}
                                  onChange={(e) => setDraft(o.id, { name_es: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="label">Name (EN)</label>
                                <input
                                  className={inputCls}
                                  value={d.name_en}
                                  onChange={(e) => setDraft(o.id, { name_en: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              <div>
                                <label className="label">Precio ($)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  className={inputCls}
                                  value={d.price ?? ''}
                                  onChange={(e) =>
                                    setDraft(o.id, {
                                      price: e.target.value === '' ? null : Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="label">Mindbody Service ID</label>
                                <input
                                  type="number"
                                  className={inputCls}
                                  value={d.mindbody_service_id ?? ''}
                                  onChange={(e) =>
                                    setDraft(o.id, {
                                      mindbody_service_id:
                                        e.target.value === '' ? null : Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="label">Orden</label>
                                <input
                                  type="number"
                                  className={inputCls}
                                  value={d.sort_order}
                                  onChange={(e) =>
                                    setDraft(o.id, { sort_order: Number(e.target.value) })
                                  }
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="label">Descripción (ES)</label>
                                <textarea
                                  className={inputCls}
                                  rows={2}
                                  value={d.description_es ?? ''}
                                  onChange={(e) => setDraft(o.id, { description_es: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="label">Description (EN)</label>
                                <textarea
                                  className={inputCls}
                                  rows={2}
                                  value={d.description_en ?? ''}
                                  onChange={(e) => setDraft(o.id, { description_en: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="label">Incluye (ES, una línea por ítem)</label>
                                <textarea
                                  className={inputCls}
                                  rows={3}
                                  value={(d.includes_es || []).join('\n')}
                                  onChange={(e) =>
                                    setDraft(o.id, {
                                      includes_es: e.target.value.split('\n').filter(Boolean),
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="label">Includes (EN, one per line)</label>
                                <textarea
                                  className={inputCls}
                                  rows={3}
                                  value={(d.includes_en || []).join('\n')}
                                  onChange={(e) =>
                                    setDraft(o.id, {
                                      includes_en: e.target.value.split('\n').filter(Boolean),
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="label">Mensaje WhatsApp (ES)</label>
                                <input
                                  className={inputCls}
                                  value={d.whatsapp_text_es ?? ''}
                                  onChange={(e) =>
                                    setDraft(o.id, { whatsapp_text_es: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <label className="label">WhatsApp message (EN)</label>
                                <input
                                  className={inputCls}
                                  value={d.whatsapp_text_en ?? ''}
                                  onChange={(e) =>
                                    setDraft(o.id, { whatsapp_text_en: e.target.value })
                                  }
                                />
                              </div>
                            </div>
                            <Button
                              onClick={() => save(o.id)}
                              disabled={savingId === o.id || !drafts[o.id]}
                            >
                              {savingId === o.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                              <span className="ml-2">Guardar</span>
                            </Button>
                          </div>
                        )}
                      </li>
                    )
                  })}
              </ul>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
