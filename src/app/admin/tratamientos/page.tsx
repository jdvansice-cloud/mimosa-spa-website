'use client'

import { useState, useEffect } from 'react'
import { Search, Eye, EyeOff, Calendar, Loader2, Save, RefreshCw } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { cn } from '@/lib/utils'
import { PROGRAM_NAMES } from '@/lib/booking/constants'

interface Treatment {
  id?: string
  mindbody_service_id: number
  service_name: string
  program_id: number
  category: string
  price: number
  duration: number
  description: string
  is_visible: boolean
  show_booking_button: boolean
  sort_order: number
  is_online_bookable?: boolean
}

export default function AdminTreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [hasChanges, setHasChanges] = useState(false)

  // Get unique categories from treatments
  const categories = Array.from(new Set(treatments.map(t => t.category))).sort()

  // Fetch treatments on mount
  useEffect(() => {
    fetchTreatments()
  }, [])

  async function fetchTreatments() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/treatments')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar tratamientos')
      }

      setTreatments(data.treatments)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter treatments
  const filteredTreatments = treatments.filter(t => {
    const matchesSearch = t.service_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Group treatments by category
  const groupedTreatments = filteredTreatments.reduce((acc, treatment) => {
    if (!acc[treatment.category]) {
      acc[treatment.category] = []
    }
    acc[treatment.category].push(treatment)
    return acc
  }, {} as Record<string, Treatment[]>)

  // Toggle visibility
  const toggleVisibility = (mindbodyServiceId: number) => {
    setTreatments(prev => prev.map(t =>
      t.mindbody_service_id === mindbodyServiceId
        ? { ...t, is_visible: !t.is_visible }
        : t
    ))
    setHasChanges(true)
  }

  // Toggle booking button
  const toggleBookingButton = (mindbodyServiceId: number) => {
    setTreatments(prev => prev.map(t =>
      t.mindbody_service_id === mindbodyServiceId
        ? { ...t, show_booking_button: !t.show_booking_button }
        : t
    ))
    setHasChanges(true)
  }

  // Save changes
  async function saveChanges() {
    setIsSaving(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/treatments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treatments })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar')
      }

      setHasChanges(false)
      alert('Cambios guardados exitosamente')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
        <p className="text-warm-gray">Cargando tratamientos desde Mindbody...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-dark">Tratamientos</h1>
          <p className="text-warm-gray mt-1">
            Gestiona la visibilidad de los tratamientos en el menú del sitio web
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchTreatments}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Actualizar
          </Button>
          <Button
            onClick={saveChanges}
            disabled={!hasChanges || isSaving}
            leftIcon={isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      {error && (
        <Card variant="default" padding="md" className="mb-6 border-red-200 bg-red-50">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {/* Filters */}
      <Card variant="default" padding="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warm-gray" />
            <input
              type="text"
              placeholder="Buscar tratamientos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input w-full md:w-64"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card variant="default" padding="md">
          <p className="text-sm text-warm-gray">Total</p>
          <p className="text-2xl font-semibold text-dark">{treatments.length}</p>
        </Card>
        <Card variant="default" padding="md">
          <p className="text-sm text-warm-gray">Visibles</p>
          <p className="text-2xl font-semibold text-green-600">
            {treatments.filter(t => t.is_visible).length}
          </p>
        </Card>
        <Card variant="default" padding="md">
          <p className="text-sm text-warm-gray">Ocultos</p>
          <p className="text-2xl font-semibold text-red-600">
            {treatments.filter(t => !t.is_visible).length}
          </p>
        </Card>
        <Card variant="default" padding="md">
          <p className="text-sm text-warm-gray">Reservables Online</p>
          <p className="text-2xl font-semibold text-blue-600">
            {treatments.filter(t => t.is_online_bookable).length}
          </p>
        </Card>
      </div>

      {/* Treatments by Category */}
      {Object.entries(groupedTreatments).map(([category, categoryTreatments]) => (
        <Card key={category} variant="default" padding="none" className="mb-6">
          <div className="bg-beige px-4 py-3 border-b border-beige-300">
            <h2 className="font-semibold text-dark flex items-center gap-2">
              {category}
              <span className="text-sm font-normal text-warm-gray">
                ({categoryTreatments.length} tratamientos)
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-beige-100 border-b border-beige-200">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-dark">Tratamiento</th>
                  <th className="text-left p-3 text-sm font-medium text-dark">Precio</th>
                  <th className="text-left p-3 text-sm font-medium text-dark">Duración</th>
                  <th className="text-center p-3 text-sm font-medium text-dark">Online</th>
                  <th className="text-center p-3 text-sm font-medium text-dark">Visible</th>
                  <th className="text-center p-3 text-sm font-medium text-dark">Botón Reservar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-100">
                {categoryTreatments.map((treatment) => (
                  <tr
                    key={treatment.mindbody_service_id}
                    className={cn(
                      "hover:bg-beige-50 transition-colors",
                      !treatment.is_visible && "opacity-50"
                    )}
                  >
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-dark">{treatment.service_name}</p>
                        {treatment.description && (
                          <p
                            className="text-xs text-warm-gray mt-1 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: treatment.description }}
                          />
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-dark font-medium">${treatment.price}</td>
                    <td className="p-3 text-warm-gray">{treatment.duration} min</td>
                    <td className="p-3 text-center">
                      {treatment.is_online_bookable ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                          <Calendar className="w-3 h-3 mr-1" />
                          Sí
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500">
                          No
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleVisibility(treatment.mindbody_service_id)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          treatment.is_visible
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        )}
                        title={treatment.is_visible ? 'Ocultar del menú' : 'Mostrar en el menú'}
                      >
                        {treatment.is_visible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleBookingButton(treatment.mindbody_service_id)}
                        disabled={!treatment.is_online_bookable}
                        className={cn(
                          "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
                          !treatment.is_online_bookable
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : treatment.show_booking_button
                              ? "bg-gold text-dark hover:bg-gold/80"
                              : "bg-beige-200 text-warm-gray hover:bg-beige-300"
                        )}
                        title={
                          !treatment.is_online_bookable
                            ? 'No disponible para reservas online'
                            : treatment.show_booking_button
                              ? 'Ocultar botón de reservar'
                              : 'Mostrar botón de reservar'
                        }
                      >
                        {treatment.show_booking_button ? 'Reservar' : 'Sin botón'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}

      {filteredTreatments.length === 0 && (
        <Card variant="default" padding="lg" className="text-center">
          <p className="text-warm-gray">No se encontraron tratamientos</p>
        </Card>
      )}

      {/* Floating Save Button when changes exist */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={saveChanges}
            disabled={isSaving}
            size="lg"
            className="shadow-lg"
            leftIcon={isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      )}
    </div>
  )
}
