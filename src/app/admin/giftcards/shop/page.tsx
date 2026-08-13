'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, Loader2, Eye, EyeOff } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent, Spinner } from '@/components/ui'

interface ShopSettings {
  shop_enabled: boolean
  occasion_slug: string | null
  default_mindbody_location_id: number
  whatsapp_delivery_enabled: boolean
  notify_email: string | null
}

interface CatalogItem {
  id: string
  kind: string
  name_es: string
  amount_cents: number
  mindbody_giftcard_id: number | null
  mindbody_layout_id: number | null
  sort_order: number
  is_active: boolean
}

export default function AdminGcShopPage() {
  const [settings, setSettings] = useState<ShopSettings | null>(null)
  const [catalog, setCatalog] = useState<CatalogItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/giftcards/shop')
      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings)
        setCatalog(data.catalog || [])
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const saveSettings = async () => {
    if (!settings) return
    setIsSaving(true)
    setStatus(null)
    try {
      const res = await fetch('/api/admin/giftcards/shop', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })
      setStatus(res.ok ? 'Guardado' : 'Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  const patchItem = async (id: string, patch: Partial<CatalogItem>) => {
    await fetch('/api/admin/giftcards/shop', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: { id, ...patch } }),
    })
    await load()
  }

  if (isLoading || !settings) return <Spinner className="py-12" />

  const inputCls = 'w-full border border-beige rounded-lg p-2 text-sm'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Tienda Online de Gift Cards</h1>
        <p className="text-warm-gray text-sm mt-1">
          La tienda se publica cuando el interruptor está activo Y las credenciales
          de Tilopay están configuradas en Vercel.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajustes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={settings.shop_enabled}
              onChange={(e) => setSettings({ ...settings, shop_enabled: e.target.checked })}
            />
            Tienda activa (visible y comprable en el sitio)
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={settings.whatsapp_delivery_enabled}
              onChange={(e) =>
                setSettings({ ...settings, whatsapp_delivery_enabled: e.target.checked })
              }
            />
            Entrega por WhatsApp activa (requiere plantilla WATI aprobada)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="label">Campaña de temporada</label>
              <select
                className={inputCls}
                value={settings.occasion_slug ?? ''}
                onChange={(e) =>
                  setSettings({ ...settings, occasion_slug: e.target.value || null })
                }
              >
                <option value="">Ninguna</option>
                <option value="navidad">Navidad</option>
                <option value="dic8">Día de la Madre (8 dic)</option>
                <option value="feb14">San Valentín</option>
              </select>
            </div>
            <div>
              <label className="label">Location ID (registro Mindbody)</label>
              <input
                type="number"
                className={inputCls}
                value={settings.default_mindbody_location_id}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    default_mindbody_location_id: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="label">Correo de notificaciones</label>
              <input
                type="email"
                className={inputCls}
                value={settings.notify_email ?? ''}
                onChange={(e) => setSettings({ ...settings, notify_email: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={saveSettings} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span className="ml-2">Guardar ajustes</span>
            </Button>
            {status && <span className="text-sm text-warm-gray">{status}</span>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo ({catalog.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-warm-gray mb-4">
            Activa cada artículo cuando exista su producto de Gift Card en Mindbody y
            hayas anotado su ID (necesario para el registro automático de la venta).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-warm-gray border-b border-beige">
                  <th className="py-2 pr-3">Artículo</th>
                  <th className="py-2 pr-3">Tipo</th>
                  <th className="py-2 pr-3">Precio</th>
                  <th className="py-2 pr-3">Mindbody GC ID</th>
                  <th className="py-2">Visible</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {catalog.map((i) => (
                  <tr key={i.id}>
                    <td className="py-2.5 pr-3 font-medium">{i.name_es}</td>
                    <td className="py-2.5 pr-3 text-warm-gray">
                      {i.kind === 'monetary' ? 'Monto' : 'Experiencia'}
                    </td>
                    <td className="py-2.5 pr-3">${(i.amount_cents / 100).toFixed(0)}</td>
                    <td className="py-2.5 pr-3">
                      <input
                        type="number"
                        className="w-28 border border-beige rounded p-1.5 text-sm"
                        defaultValue={i.mindbody_giftcard_id ?? ''}
                        onBlur={(e) =>
                          patchItem(i.id, {
                            mindbody_giftcard_id:
                              e.target.value === '' ? null : Number(e.target.value),
                          })
                        }
                      />
                    </td>
                    <td className="py-2.5">
                      <button
                        onClick={() => patchItem(i.id, { is_active: !i.is_active })}
                        className="p-1.5 text-warm-gray hover:text-dark"
                        title={i.is_active ? 'Ocultar' : 'Mostrar'}
                      >
                        {i.is_active ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
