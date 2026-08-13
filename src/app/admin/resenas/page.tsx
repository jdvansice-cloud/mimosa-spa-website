'use client'

import { useState, useEffect, useCallback } from 'react'
import { Star, Pencil, Trash2, Save, Loader2, Eye, EyeOff } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent, Spinner } from '@/components/ui'

interface SiteReview {
  id: string
  kind: 'review' | 'press' | 'ugc'
  quote_es: string
  quote_en: string
  author_name: string
  rating: number
  source: string
  is_active: boolean
  sort_order: number
  location: 'cde' | 'sfc' | null
}

const EMPTY_FORM: Omit<SiteReview, 'id'> = {
  kind: 'review',
  quote_es: '',
  quote_en: '',
  author_name: '',
  rating: 5,
  source: 'google',
  is_active: true,
  sort_order: 0,
  location: null,
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<SiteReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/reviews')
      if (res.ok) {
        const { data } = await res.json()
        setReviews(data || [])
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const startEdit = (r: SiteReview) => {
    setEditingId(r.id)
    setForm({ ...r })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError(null)
  }

  const handleSave = async () => {
    if (!form.quote_es || !form.quote_en || !form.author_name) {
      setError('Cita (ES y EN) y autor son obligatorios')
      return
    }
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/reviews', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setError(body?.error || 'Error al guardar')
        return
      }
      resetForm()
      await load()
    } finally {
      setIsSaving(false)
    }
  }

  const toggleActive = async (r: SiteReview) => {
    await fetch('/api/admin/reviews', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: r.id, is_active: !r.is_active }),
    })
    await load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta reseña?')) return
    await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Reseñas</h1>
        <p className="text-warm-gray text-sm mt-1">
          Citas seleccionadas de Google que se muestran en el sitio público. El
          rating global (4.8 · 96) se edita en Configuración.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Editar reseña' : 'Nueva reseña'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Cita (Español)</label>
              <textarea
                className="w-full border border-beige rounded-lg p-3 text-sm"
                rows={3}
                value={form.quote_es}
                onChange={(e) => setForm({ ...form, quote_es: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Quote (English)</label>
              <textarea
                className="w-full border border-beige rounded-lg p-3 text-sm"
                rows={3}
                value={form.quote_en}
                onChange={(e) => setForm({ ...form, quote_en: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="label">Autor</label>
              <input
                className="w-full border border-beige rounded-lg p-2 text-sm"
                value={form.author_name}
                onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                placeholder="María G."
              />
            </div>
            <div>
              <label className="label">Rating</label>
              <select
                className="w-full border border-beige rounded-lg p-2 text-sm"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              >
                {[5, 4, 3].map((n) => (
                  <option key={n} value={n}>
                    {n} estrellas
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Ubicación</label>
              <select
                className="w-full border border-beige rounded-lg p-2 text-sm"
                value={form.location ?? ''}
                onChange={(e) =>
                  setForm({ ...form, location: (e.target.value || null) as SiteReview['location'] })
                }
              >
                <option value="">Ambas</option>
                <option value="cde">Costa del Este</option>
                <option value="sfc">San Francisco</option>
              </select>
            </div>
            <div>
              <label className="label">Orden</label>
              <input
                type="number"
                className="w-full border border-beige rounded-lg p-2 text-sm"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span className="ml-2">{editingId ? 'Guardar' : 'Agregar'}</span>
              </Button>
              {editingId && (
                <Button variant="secondary" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reseñas curadas ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Spinner className="py-8" />
          ) : reviews.length === 0 ? (
            <p className="text-warm-gray text-sm py-4">
              Aún no hay reseñas. Agrega 3–4 citas destacadas de Google.
            </p>
          ) : (
            <ul className="divide-y divide-beige">
              {reviews.map((r) => (
                <li key={r.id} className="py-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i <= r.rating ? 'fill-gold text-gold' : 'text-gold/30'}`}
                          />
                        ))}
                      </span>
                      <span className="font-medium text-sm text-dark">{r.author_name}</span>
                      {r.location && (
                        <span className="text-xs bg-gold/15 text-gold-700 rounded-full px-2 py-0.5">
                          {r.location === 'cde' ? 'CDE' : 'SFC'}
                        </span>
                      )}
                      {!r.is_active && (
                        <span className="text-xs bg-beige text-warm-gray rounded-full px-2 py-0.5">
                          Oculta
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-dark/70 mt-1 truncate">“{r.quote_es}”</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(r)}
                      className="p-2 text-warm-gray hover:text-dark"
                      title={r.is_active ? 'Ocultar' : 'Mostrar'}
                    >
                      {r.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => startEdit(r)}
                      className="p-2 text-warm-gray hover:text-dark"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-2 text-warm-gray hover:text-red-600"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
