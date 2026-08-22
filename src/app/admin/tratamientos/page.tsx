'use client'

import { useState, useEffect } from 'react'
import { Search, Eye, EyeOff, Calendar, Loader2, Save, RefreshCw, Star, ChevronDown, ChevronRight, ChevronUp, ShoppingBag, GripVertical } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { AdminTable, CardField, type AdminColumn } from '@/components/admin/AdminTable'
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
  is_visible: boolean // Show on menu pages
  show_in_booking: boolean // Show in booking widget for direct selection
  show_booking_button: boolean
  is_top_pick: boolean
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
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())
  // Drag & drop ordering (disabled while searching — a filtered list would
  // produce a misleading order)
  const [dragged, setDragged] = useState<{ category: string; id: number } | null>(null)
  const [dropTarget, setDropTarget] = useState<number | null>(null)
  const canDrag = searchQuery.trim() === ''

  // Get unique categories from treatments
  const categories = Array.from(new Set(treatments.map(t => t.category))).sort()

  // Toggle category collapsed state
  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  // Expand all categories
  const expandAll = () => setCollapsedCategories(new Set())

  // Collapse all categories
  const collapseAll = () => setCollapsedCategories(new Set(categories))

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

  // Group treatments by category, ordered by sort_order (drag & drop)
  const groupedTreatments = filteredTreatments.reduce((acc, treatment) => {
    if (!acc[treatment.category]) {
      acc[treatment.category] = []
    }
    acc[treatment.category].push(treatment)
    return acc
  }, {} as Record<string, Treatment[]>)
  for (const list of Object.values(groupedTreatments)) {
    list.sort((a, b) => a.sort_order - b.sort_order || a.service_name.localeCompare(b.service_name))
  }

  // Drop the dragged treatment at the target's position within its category
  // and renumber that category's sort_order to match the new visual order.
  const handleDrop = (category: string, targetId: number) => {
    if (!dragged || dragged.category !== category || dragged.id === targetId) {
      setDragged(null); setDropTarget(null)
      return
    }
    const list = [...(groupedTreatments[category] || [])]
    const fromIdx = list.findIndex(t => t.mindbody_service_id === dragged.id)
    const toIdx = list.findIndex(t => t.mindbody_service_id === targetId)
    if (fromIdx === -1 || toIdx === -1) { setDragged(null); setDropTarget(null); return }
    const [moved] = list.splice(fromIdx, 1)
    list.splice(toIdx, 0, moved)
    const orderById = new Map(list.map((t, i) => [t.mindbody_service_id, i]))
    setTreatments(prev => prev.map(t =>
      orderById.has(t.mindbody_service_id)
        ? { ...t, sort_order: orderById.get(t.mindbody_service_id)! }
        : t
    ))
    setHasChanges(true)
    setDragged(null)
    setDropTarget(null)
  }

  /**
   * Move one treatment up or down inside its category. Drag-and-drop is
   * mouse-only, so this is the path that works on a phone and by keyboard.
   */
  const moveTreatment = (category: string, id: number, direction: -1 | 1) => {
    const list = [...(groupedTreatments[category] || [])]
    const fromIdx = list.findIndex(t => t.mindbody_service_id === id)
    const toIdx = fromIdx + direction
    if (fromIdx === -1 || toIdx < 0 || toIdx >= list.length) return
    const [moved] = list.splice(fromIdx, 1)
    list.splice(toIdx, 0, moved)
    const orderById = new Map(list.map((t, i) => [t.mindbody_service_id, i]))
    setTreatments(prev => prev.map(t =>
      orderById.has(t.mindbody_service_id)
        ? { ...t, sort_order: orderById.get(t.mindbody_service_id)! }
        : t
    ))
    setHasChanges(true)
  }

  // Toggle visibility (menu pages)
  const toggleVisibility = (mindbodyServiceId: number) => {
    setTreatments(prev => prev.map(t =>
      t.mindbody_service_id === mindbodyServiceId
        ? { ...t, is_visible: !t.is_visible }
        : t
    ))
    setHasChanges(true)
  }

  // Toggle show in booking widget
  const toggleShowInBooking = (mindbodyServiceId: number) => {
    setTreatments(prev => prev.map(t =>
      t.mindbody_service_id === mindbodyServiceId
        ? { ...t, show_in_booking: !t.show_in_booking }
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

  // Toggle top pick
  const toggleTopPick = (mindbodyServiceId: number) => {
    setTreatments(prev => prev.map(t =>
      t.mindbody_service_id === mindbodyServiceId
        ? { ...t, is_top_pick: !t.is_top_pick }
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
        console.error('Save error details:', data)
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
        <p className="text-warm-gray-500">Cargando tratamientos desde Mindbody...</p>
      </div>
    )
  }

  const reorderCell = (category: string, list: Treatment[], t: Treatment) => {
    const idx = list.findIndex(x => x.mindbody_service_id === t.mindbody_service_id)
    return (
      <div className="flex items-center gap-1">
        <GripVertical
          className={cn('w-4 h-4 text-warm-gray-500 shrink-0', canDrag ? 'cursor-grab active:cursor-grabbing' : 'opacity-30')}
          aria-hidden="true"
        />
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => moveTreatment(category, t.mindbody_service_id, -1)}
            disabled={!canDrag || idx <= 0}
            aria-label={`Subir ${t.service_name}`}
            className="p-1 rounded text-warm-gray-500 hover:text-dark hover:bg-beige disabled:opacity-25"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => moveTreatment(category, t.mindbody_service_id, 1)}
            disabled={!canDrag || idx === list.length - 1}
            aria-label={`Bajar ${t.service_name}`}
            className="p-1 rounded text-warm-gray-500 hover:text-dark hover:bg-beige disabled:opacity-25"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )
  }

  const onlineBadge = (t: Treatment) => (
    t.is_online_bookable ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
        <Calendar className="w-3 h-3 mr-1" /> Sí
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-beige-300 text-warm-gray-600">No</span>
    )
  )

  const visibilityBtn = (t: Treatment) => (
    <button
      onClick={() => toggleVisibility(t.mindbody_service_id)}
      className={cn('p-2 rounded-lg transition-colors',
        t.is_visible ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200')}
      title={t.is_visible ? 'Ocultar del menú' : 'Mostrar en el menú'}
      aria-label={`${t.is_visible ? 'Ocultar' : 'Mostrar'} ${t.service_name} en el menú`}
    >
      {t.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
    </button>
  )

  const widgetBtn = (t: Treatment) => (
    t.is_online_bookable ? (
      <button
        onClick={() => toggleShowInBooking(t.mindbody_service_id)}
        className={cn('p-2 rounded-lg transition-colors',
          t.show_in_booking ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' : 'bg-beige-200 text-warm-gray-500 hover:bg-beige-300')}
        title={t.show_in_booking ? 'Ocultar del widget de reservas' : 'Mostrar en el widget de reservas'}
        aria-label={`${t.show_in_booking ? 'Ocultar' : 'Mostrar'} ${t.service_name} en el widget`}
      >
        <ShoppingBag className="w-4 h-4" />
      </button>
    ) : (
      <span className="inline-flex items-center p-2 rounded-lg bg-beige-100 text-beige-400"><ShoppingBag className="w-4 h-4" /></span>
    )
  )

  const topPickBtn = (t: Treatment) => (
    <button
      onClick={() => toggleTopPick(t.mindbody_service_id)}
      className={cn('p-2 rounded-lg transition-colors',
        t.is_top_pick ? 'bg-gold-100 text-gold-700 hover:bg-gold-200' : 'bg-beige-100 text-beige-400 hover:bg-beige-200')}
      title={t.is_top_pick ? 'Quitar de Top Picks' : 'Agregar a Top Picks'}
      aria-label={`${t.is_top_pick ? 'Quitar de' : 'Agregar a'} Top Picks: ${t.service_name}`}
    >
      <Star className={cn('w-4 h-4', t.is_top_pick && 'fill-gold-500')} />
    </button>
  )

  const bookingBtn = (t: Treatment) => (
    t.is_online_bookable ? (
      <button
        onClick={() => toggleBookingButton(t.mindbody_service_id)}
        className={cn('px-3 py-2 rounded-lg text-xs font-medium transition-colors',
          t.show_booking_button ? 'bg-gold text-dark hover:bg-gold/80' : 'bg-beige-200 text-warm-gray-500 hover:bg-beige-300')}
        aria-label={`${t.show_booking_button ? 'Ocultar' : 'Mostrar'} botón de reservar en ${t.service_name}`}
      >
        {t.show_booking_button ? 'Activado' : 'Desactivado'}
      </button>
    ) : (
      <span className="px-3 py-2 rounded-lg text-xs font-medium bg-beige-100 text-beige-400">N/A</span>
    )
  )

  const treatmentColumns = (category: string, list: Treatment[]): Array<AdminColumn<Treatment>> => [
    { key: 'drag', header: '', srHeader: 'Reordenar', render: t => reorderCell(category, list, t) },
    {
      key: 'name',
      header: 'Tratamiento',
      render: t => (
        <div>
          <p className="font-medium text-dark">{t.service_name}</p>
          {t.description && (
            <p className="text-xs text-warm-gray-500 mt-1 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: t.description }} />
          )}
        </div>
      ),
    },
    { key: 'price', header: 'Precio', cellClassName: 'font-medium tabular-nums', render: t => `$${t.price}` },
    { key: 'duration', header: 'Duración', cellClassName: 'text-warm-gray-500', render: t => `${t.duration} min` },
    { key: 'online', header: 'Online', align: 'center', render: onlineBadge },
    { key: 'menu', header: 'Menú', align: 'center', render: visibilityBtn },
    { key: 'widget', header: 'Widget', align: 'center', render: widgetBtn },
    { key: 'top', header: 'Top Pick', align: 'center', render: topPickBtn },
    { key: 'book', header: 'Botón Reservar', align: 'center', render: bookingBtn },
  ]

  const treatmentCard = (category: string, list: Treatment[], t: Treatment) => (
    <div className={cn(!t.is_visible && 'opacity-60')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-dark">{t.service_name}</p>
          <p className="text-sm text-warm-gray-500 tabular-nums">${t.price} · {t.duration} min</p>
        </div>
        {reorderCell(category, list, t)}
      </div>
      {/* Labelled rather than a row of bare icons — five toggles with one
          trailing caption gave no way to tell which control was which. */}
      <dl className="mt-3 space-y-2">
        <CardField label="Online">{onlineBadge(t)}</CardField>
        <CardField label="Menú">{visibilityBtn(t)}</CardField>
        <CardField label="Widget">{widgetBtn(t)}</CardField>
        <CardField label="Top Pick">{topPickBtn(t)}</CardField>
        <CardField label="Reservar">{bookingBtn(t)}</CardField>
      </dl>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-dark">Tratamientos</h1>
          <p className="text-warm-gray-500 mt-1">
            Gestiona la visibilidad de los tratamientos en el menú y en el widget de reservas
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warm-gray-500" />
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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <Card variant="default" padding="md">
          <p className="text-sm text-warm-gray-500">Total</p>
          <p className="text-2xl font-semibold text-dark">{treatments.length}</p>
        </Card>
        <Card variant="default" padding="md">
          <p className="text-sm text-warm-gray-500">En Menú</p>
          <p className="text-2xl font-semibold text-green-600">
            {treatments.filter(t => t.is_visible).length}
          </p>
        </Card>
        <Card variant="default" padding="md">
          <p className="text-sm text-warm-gray-500">En Widget</p>
          <p className="text-2xl font-semibold text-purple-600">
            {treatments.filter(t => t.show_in_booking).length}
          </p>
        </Card>
        <Card variant="default" padding="md">
          <p className="text-sm text-warm-gray-500">Top Picks</p>
          <p className="text-2xl font-semibold text-gold-600">
            {treatments.filter(t => t.is_top_pick).length}
          </p>
        </Card>
        <Card variant="default" padding="md">
          <p className="text-sm text-warm-gray-500">Online</p>
          <p className="text-2xl font-semibold text-blue-600">
            {treatments.filter(t => t.is_online_bookable).length}
          </p>
        </Card>
        <Card variant="default" padding="md">
          <p className="text-sm text-warm-gray-500">Ocultos</p>
          <p className="text-2xl font-semibold text-red-600">
            {treatments.filter(t => !t.is_visible && !t.show_in_booking).length}
          </p>
        </Card>
      </div>

      {/* Expand/Collapse All */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={expandAll}
          className="text-sm text-warm-gray-500 hover:text-dark transition-colors"
        >
          Expandir todo
        </button>
        <span className="text-warm-gray-500">|</span>
        <button
          onClick={collapseAll}
          className="text-sm text-warm-gray-500 hover:text-dark transition-colors"
        >
          Colapsar todo
        </button>
      </div>

      {/* Treatments by Category */}
      {Object.entries(groupedTreatments).map(([category, categoryTreatments]) => {
        const isCollapsed = collapsedCategories.has(category)
        const topPicksInCategory = categoryTreatments.filter(t => t.is_top_pick).length

        return (
        <Card key={category} variant="default" padding="none" className="mb-6">
          <button
            onClick={() => toggleCategory(category)}
            className="w-full bg-beige px-4 py-3 border-b border-beige-300 flex items-center justify-between hover:bg-beige-200 transition-colors"
          >
            <h2 className="font-semibold text-dark flex items-center gap-2">
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-warm-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-warm-gray-500" />
              )}
              {category}
              <span className="text-sm font-normal text-warm-gray-500">
                ({categoryTreatments.length} tratamientos)
              </span>
              {topPicksInCategory > 0 && (
                <span className="flex items-center gap-1 text-sm font-normal text-gold-600">
                  <Star className="w-4 h-4 fill-gold-500" />
                  {topPicksInCategory}
                </span>
              )}
            </h2>
          </button>

          {!isCollapsed && (
            <AdminTable
              rows={categoryTreatments}
              columns={treatmentColumns(category, categoryTreatments)}
              rowKey={t => String(t.mindbody_service_id)}
              mobileCard={t => treatmentCard(category, categoryTreatments, t)}
              empty="No hay tratamientos en esta categoría."
              rowProps={t => ({
                draggable: canDrag,
                onDragStart: () => setDragged({ category, id: t.mindbody_service_id }),
                onDragOver: e => {
                  if (dragged?.category === category) {
                    e.preventDefault()
                    setDropTarget(t.mindbody_service_id)
                  }
                },
                onDrop: () => handleDrop(category, t.mindbody_service_id),
                onDragEnd: () => { setDragged(null); setDropTarget(null) },
                className: cn(
                  !t.is_visible && 'opacity-50',
                  dragged?.id === t.mindbody_service_id && 'opacity-30',
                  dropTarget === t.mindbody_service_id &&
                    dragged?.id !== t.mindbody_service_id &&
                    'border-t-2 border-gold',
                ),
              })}
            />
          )}
        </Card>
        )
      })}

      {filteredTreatments.length === 0 && (
        <Card variant="default" padding="lg" className="text-center">
          <p className="text-warm-gray-500">No se encontraron tratamientos</p>
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
