'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Hash, Plus, Loader2, Trash2 } from 'lucide-react'
import { Button, Card, CardContent } from '@/components/ui'
import { AdminTable, CardField, type AdminColumn } from '@/components/admin/AdminTable'

interface LocationConfig {
  id: string
  mindbody_location_id: number
  location_name: string
  prefix: string
  serial_length: number
  next_sequence_value: number
  is_active: boolean
}

function previewNext(c: LocationConfig): string {
  return c.prefix + String(c.next_sequence_value).padStart(c.serial_length, '0')
}

export default function GiftCardConfigPage() {
  const [rows, setRows] = useState<LocationConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLocation, setNewLocation] = useState({
    mindbody_location_id: '',
    location_name: '',
    prefix: '',
    serial_length: 6,
  })

  const load = async () => {
    try {
      const res = await fetch('/api/admin/giftcards/config')
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error al cargar')
      setRows(data.data ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const updateLocal = (id: string, patch: Partial<LocationConfig>) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r))
  }

  const saveRow = async (row: LocationConfig, patch: Partial<LocationConfig>) => {
    setSavingId(row.id)
    try {
      const res = await fetch(`/api/admin/giftcards/config/${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error al guardar')
      updateLocal(row.id, data.data)
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al guardar')
      await load()
    } finally {
      setSavingId(null)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/admin/giftcards/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mindbody_location_id: Number(newLocation.mindbody_location_id),
          location_name: newLocation.location_name,
          prefix: newLocation.prefix,
          serial_length: newLocation.serial_length,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error al crear')
      showToast('Ubicación creada.')
      setShowAddForm(false)
      setNewLocation({ mindbody_location_id: '', location_name: '', prefix: '', serial_length: 6 })
      await load()
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al crear')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (row: LocationConfig) => {
    if (!confirm(`Eliminar la ubicación "${row.location_name}"?`)) return
    try {
      const res = await fetch(`/api/admin/giftcards/config/${row.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error al eliminar')
      showToast('Eliminada.')
      await load()
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al eliminar')
    }
  }

  const nameInput = (row: LocationConfig) => (
    <input
      type="text"
      className="input w-48"
      aria-label={`Nombre de ${row.location_name}`}
      value={row.location_name}
      onChange={e => updateLocal(row.id, { location_name: e.target.value })}
      onBlur={() => saveRow(row, { location_name: row.location_name })}
    />
  )

  const prefixInput = (row: LocationConfig) => (
    <input
      type="text"
      className="input font-mono uppercase w-28"
      maxLength={8}
      aria-label={`Prefijo de ${row.location_name}`}
      value={row.prefix}
      onChange={e => updateLocal(row.id, {
        prefix: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''),
      })}
      onBlur={() => saveRow(row, { prefix: row.prefix })}
    />
  )

  const lengthInput = (row: LocationConfig) => (
    <input
      type="number"
      min={4}
      max={12}
      className="input w-20"
      aria-label={`Longitud del serial de ${row.location_name}`}
      value={row.serial_length}
      onChange={e => updateLocal(row.id, { serial_length: Number(e.target.value) })}
      onBlur={() => saveRow(row, { serial_length: row.serial_length })}
    />
  )

  const activeToggle = (row: LocationConfig) => (
    <span className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        className="w-4 h-4 text-gold focus:ring-gold rounded"
        aria-label={`Activar ${row.location_name}`}
        checked={row.is_active}
        onChange={e => {
          const next = e.target.checked
          updateLocal(row.id, { is_active: next })
          saveRow(row, { is_active: next })
        }}
      />
      {savingId === row.id && <Loader2 className="h-3 w-3 animate-spin text-warm-gray-500" />}
    </span>
  )

  const deleteButton = (row: LocationConfig) => (
    <button
      onClick={() => handleDelete(row)}
      className="h-11 w-11 inline-flex items-center justify-center rounded-lg text-warm-gray-500 hover:text-red-500 hover:bg-beige"
      title="Eliminar"
      aria-label={`Eliminar ${row.location_name}`}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )

  const columns: Array<AdminColumn<LocationConfig>> = [
    { key: 'name', header: 'Ubicación', render: nameInput },
    { key: 'mbid', header: 'Mindbody ID', cellClassName: 'font-mono', render: row => row.mindbody_location_id },
    { key: 'prefix', header: 'Prefijo', render: prefixInput },
    { key: 'length', header: 'Longitud', render: lengthInput },
    { key: 'next', header: 'Próximo serial', cellClassName: 'font-mono', render: previewNext },
    { key: 'active', header: 'Activa', render: activeToggle },
    { key: 'delete', header: '', srHeader: 'Eliminar', align: 'right', render: deleteButton },
  ]

  const mobileCard = (row: LocationConfig) => (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="font-mono text-lg font-semibold text-dark">{row.prefix}</div>
        {deleteButton(row)}
      </div>
      <p className="font-mono text-sm text-warm-gray-500">Próximo: {previewNext(row)}</p>
      <dl className="mt-3 space-y-2">
        <CardField label="Nombre">{nameInput(row)}</CardField>
        <CardField label="Mindbody">{row.mindbody_location_id}</CardField>
        <CardField label="Prefijo">{prefixInput(row)}</CardField>
        <CardField label="Longitud">{lengthInput(row)}</CardField>
        <CardField label="Activa">{activeToggle(row)}</CardField>
      </dl>
    </>
  )

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/giftcards"
          className="inline-flex items-center gap-1 text-sm text-warm-gray-500 hover:text-dark mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> Gift Cards
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Hash className="h-6 w-6 text-gold" />
              </div>
              <h1 className="text-3xl font-display font-semibold text-dark">Ubicaciones y Seriales</h1>
            </div>
            <p className="text-warm-gray-500">
              Cada ubicación tiene su propio prefijo y contador. Asigna usuarios admin a una ubicación en Supabase
              (campo <code className="font-mono text-xs">profiles.gift_card_location_config_id</code>) para
              restringir su acceso a esa página.
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(v => !v)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            {showAddForm ? 'Cancelar' : 'Nueva ubicación'}
          </Button>
        </div>
      </div>

      {toast && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-beige-100 text-dark text-sm">{toast}</div>
      )}

      {showAddForm && (
        <Card variant="default" padding="md" className="mb-6">
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Nombre <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="input"
                  required
                  value={newLocation.location_name}
                  onChange={e => setNewLocation({ ...newLocation, location_name: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Mindbody Location ID <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  className="input"
                  required
                  min={1}
                  value={newLocation.mindbody_location_id}
                  onChange={e => setNewLocation({ ...newLocation, mindbody_location_id: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Prefijo (1–8, A–Z/0–9) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="input font-mono uppercase"
                  required
                  maxLength={8}
                  value={newLocation.prefix}
                  onChange={e => setNewLocation({
                    ...newLocation,
                    prefix: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''),
                  })}
                />
              </div>
              <div>
                <label className="label">Longitud del número (4–12)</label>
                <input
                  type="number"
                  className="input"
                  min={4}
                  max={12}
                  value={newLocation.serial_length}
                  onChange={e => setNewLocation({ ...newLocation, serial_length: Number(e.target.value) })}
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" isLoading={creating} leftIcon={<Plus className="h-4 w-4" />}>
                  Crear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <AdminTable
        rows={rows}
        columns={columns}
        rowKey={row => row.id}
        mobileCard={mobileCard}
        loading={loading}
        error={error}
        empty={'No hay ubicaciones todavía. Crea la primera con el botón "Nueva ubicación".'}
      />

    </div>
  )
}
