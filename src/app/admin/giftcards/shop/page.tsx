'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, Loader2, Eye, EyeOff } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent, Spinner } from '@/components/ui'
import { AdminTable, CardField, type AdminColumn } from '@/components/admin/AdminTable'

interface ShopSettings {
  shop_enabled: boolean
  occasion_slug: string | null
  default_mindbody_location_id: number
  serial_config_id: string | null
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

interface SerialConfig {
  id: string
  location_name: string
  prefix: string
  mindbody_location_id: number
  is_active: boolean
}

export default function AdminGcShopPage() {
  const [settings, setSettings] = useState<ShopSettings | null>(null)
  const [catalog, setCatalog] = useState<CatalogItem[]>([])
  const [serialConfigs, setSerialConfigs] = useState<SerialConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const cfgRes = await fetch('/api/admin/giftcards/config')
      const cfgJson = await cfgRes.json().catch(() => ({}))
      setSerialConfigs(cfgJson.data ?? [])
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

  const mbIdInput = (i: CatalogItem) => (
    <input
      type="number"
      className="w-28 border border-beige-400 rounded p-1.5 text-sm"
      aria-label={`Mindbody Gift Card ID de ${i.name_es}`}
      defaultValue={i.mindbody_giftcard_id ?? ''}
      onBlur={e =>
        patchItem(i.id, {
          mindbody_giftcard_id: e.target.value === '' ? null : Number(e.target.value),
        })
      }
    />
  )

  const visibilityToggle = (i: CatalogItem) => (
    <button
      onClick={() => patchItem(i.id, { is_active: !i.is_active })}
      className="h-11 w-11 inline-flex items-center justify-center rounded-lg text-warm-gray-500 hover:text-dark hover:bg-beige"
      title={i.is_active ? 'Ocultar' : 'Mostrar'}
      aria-label={`${i.is_active ? 'Ocultar' : 'Mostrar'} ${i.name_es}`}
    >
      {i.is_active ? <Eye className="h-4 w-4 text-green-700" /> : <EyeOff className="h-4 w-4" />}
    </button>
  )

  const catalogColumns: Array<AdminColumn<CatalogItem>> = [
    { key: 'name', header: 'Artículo', cellClassName: 'font-medium', render: i => i.name_es },
    {
      key: 'kind',
      header: 'Tipo',
      cellClassName: 'text-warm-gray-500',
      render: i => (i.kind === 'monetary' ? 'Monto' : 'Experiencia'),
    },
    {
      key: 'price',
      header: 'Precio',
      cellClassName: 'tabular-nums',
      render: i => `$${(i.amount_cents / 100).toFixed(0)}`,
    },
    { key: 'mbid', header: 'Mindbody GC ID', render: mbIdInput },
    { key: 'visible', header: 'Visible', render: visibilityToggle },
  ]

  const catalogCard = (i: CatalogItem) => (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-dark">{i.name_es}</p>
          <p className="text-sm text-warm-gray-500">
            {i.kind === 'monetary' ? 'Monto' : 'Experiencia'}
          </p>
        </div>
        {visibilityToggle(i)}
      </div>
      <p className="mt-1 text-2xl font-display font-semibold text-dark tabular-nums">
        ${(i.amount_cents / 100).toFixed(0)}
      </p>
      <dl className="mt-3 space-y-1">
        <CardField label="Mindbody">{mbIdInput(i)}</CardField>
        <CardField label="Estado">{i.is_active ? 'Visible' : 'Oculto'}</CardField>
      </dl>
    </>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Tienda Online de Gift Cards</h1>
        <p className="text-warm-gray-500 text-sm mt-1">
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
              <label className="label">Secuencia de seriales</label>
              <select
                className={inputCls}
                value={settings.serial_config_id ?? ''}
                onChange={(e) =>
                  setSettings({ ...settings, serial_config_id: e.target.value || null })
                }
              >
                <option value="">Serie heredada (MW-000001)</option>
                {serialConfigs
                  .filter((c) => c.is_active)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.location_name} ({c.prefix}) · Mindbody {c.mindbody_location_id}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-warm-gray-500 mt-1">
                Las ubicaciones se crean en Gift Cards → Configuración. La venta
                se registra en la sucursal Mindbody indicada arriba.
              </p>
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
            {status && <span className="text-sm text-warm-gray-500">{status}</span>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo ({catalog.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-warm-gray-500 mb-4">
            Activa cada artículo cuando exista su producto de Gift Card en Mindbody y
            hayas anotado su ID (necesario para el registro automático de la venta).
          </p>
          <AdminTable
            rows={catalog}
            columns={catalogColumns}
            rowKey={i => i.id}
            mobileCard={catalogCard}
            empty="El catálogo está vacío."
          />
        </CardContent>
      </Card>
    </div>
  )
}
