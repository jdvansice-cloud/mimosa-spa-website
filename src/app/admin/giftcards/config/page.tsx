'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Hash, Save, Loader2 } from 'lucide-react'
import { Button, Card, CardContent } from '@/components/ui'

interface Config {
  prefix: string
  serial_length: number
  next_sequence_value: number
}

export default function GiftCardConfigPage() {
  const [config, setConfig] = useState<Config | null>(null)
  const [prefix, setPrefix] = useState('')
  const [serialLength, setSerialLength] = useState(6)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const load = async () => {
    try {
      const res = await fetch('/api/admin/giftcards/config')
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error al cargar')
      setConfig(data.data)
      setPrefix(data.data.prefix)
      setSerialLength(data.data.serial_length)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/giftcards/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefix, serial_length: serialLength }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error al guardar')
      setConfig(data.data)
      setToast('Configuración guardada.')
      setTimeout(() => setToast(null), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const previewSerial = config
    ? prefix + String(config.next_sequence_value).padStart(serialLength, '0')
    : ''

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
            <Hash className="h-6 w-6 text-gold" />
          </div>
          <h1 className="text-3xl font-display font-semibold text-dark">Configuración de Serial</h1>
        </div>
        <p className="text-warm-gray">
          Prefijo y longitud del número de serial. Cada Gift Card emitida toma el siguiente valor del contador.
        </p>
      </div>

      {toast && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-beige-100 text-dark text-sm">{toast}</div>
      )}

      <Card variant="default" padding="md">
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5 max-w-md">
              <div>
                <label className="label">Prefijo <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="input font-mono uppercase"
                  maxLength={8}
                  value={prefix}
                  onChange={e => setPrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  required
                />
                <p className="text-xs text-warm-gray mt-1">1–8 caracteres en mayúsculas o dígitos.</p>
              </div>

              <div>
                <label className="label">Longitud del número <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min={4}
                  max={12}
                  className="input w-32"
                  value={serialLength}
                  onChange={e => setSerialLength(Number(e.target.value))}
                  required
                />
                <p className="text-xs text-warm-gray mt-1">Entre 4 y 12 dígitos con relleno de ceros.</p>
              </div>

              {config && (
                <div className="rounded-lg bg-beige-100 p-4">
                  <div className="text-xs uppercase tracking-widest text-warm-gray">Próximo serial</div>
                  <div className="text-2xl font-mono font-semibold text-dark mt-1">{previewSerial}</div>
                  <div className="text-xs text-warm-gray mt-2">
                    Contador actual: {config.next_sequence_value}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                {error && <span className="text-red-600 text-sm">{error}</span>}
                <Button type="submit" isLoading={saving} leftIcon={<Save className="h-4 w-4" />}>
                  Guardar
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
