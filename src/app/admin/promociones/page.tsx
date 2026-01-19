'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit, Trash2, Search, Loader2, RefreshCw, Check, X, Download, Tag } from 'lucide-react'
import { Button, Card, Modal } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Promotion } from '@/types'

interface MindbodyService {
  Id: number
  Name: string
  Price: number
  Duration: number
  Category: string
  OnlineBooking: boolean
}

interface MindbodyPromoCode {
  Id: number
  Code: string
  Name: string
  DiscountType: 'Percent' | 'Amount'
  DiscountAmount: number
  IsActive: boolean
  ActivationDate: string
  ExpirationDate: string
  MaxUses: number | null
  TimesUsed: number
  AllowOnlineRedemption: boolean
  ApplicableItems: Array<{
    Id: number
    Name: string
    Type: string
  }>
}

interface PromotionFormData {
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  price: number
  original_price: number | null
  duration_minutes: number
  valid_from: string
  valid_until: string
  is_active: boolean
  sort_order: number
  services: string[]
  mindbody_service_ids: number[]
}

const defaultFormData: PromotionFormData = {
  title_es: '',
  title_en: '',
  description_es: '',
  description_en: '',
  price: 0,
  original_price: null,
  duration_minutes: 0,
  valid_from: new Date().toISOString().split('T')[0],
  valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  is_active: true,
  sort_order: 0,
  services: [],
  mindbody_service_ids: [],
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [mindbodyServices, setMindbodyServices] = useState<MindbodyService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isServicesLoading, setIsServicesLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [formData, setFormData] = useState<PromotionFormData>(defaultFormData)
  const [serviceSearch, setServiceSearch] = useState('')

  // Promo code lookup state
  const [promoCodeSearch, setPromoCodeSearch] = useState('')
  const [isPromoCodeLoading, setIsPromoCodeLoading] = useState(false)
  const [promoCodeResults, setPromoCodeResults] = useState<MindbodyPromoCode[]>([])
  const [promoCodeError, setPromoCodeError] = useState<string | null>(null)
  const [showPromoLookup, setShowPromoLookup] = useState(false)

  // Fetch promotions from API
  const fetchPromotions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/promotions?active=false')
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Error al cargar promociones')
      setPromotions(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch Mindbody services
  const fetchMindbodyServices = useCallback(async () => {
    setIsServicesLoading(true)
    try {
      const response = await fetch('/api/mindbody/services?type=all&includeOffline=true')
      const data = await response.json()
      if (response.ok && data.services) {
        // Filter only online bookable services for promotions
        const bookableServices = data.services.filter((s: MindbodyService) => s.OnlineBooking)
        setMindbodyServices(bookableServices)
      }
    } catch (err) {
      console.error('Error fetching Mindbody services:', err)
    } finally {
      setIsServicesLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPromotions()
    fetchMindbodyServices()
  }, [fetchPromotions, fetchMindbodyServices])

  // Search Mindbody promo codes
  const searchPromoCodes = async () => {
    if (!promoCodeSearch.trim()) return

    setIsPromoCodeLoading(true)
    setPromoCodeError(null)
    setPromoCodeResults([])

    try {
      const response = await fetch(`/api/mindbody/promocodes?search=${encodeURIComponent(promoCodeSearch)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al buscar códigos promocionales')
      }

      setPromoCodeResults(data.promoCodes || [])
      if ((data.promoCodes || []).length === 0) {
        setPromoCodeError('No se encontraron códigos promocionales')
      }
    } catch (err) {
      setPromoCodeError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setIsPromoCodeLoading(false)
    }
  }

  // Import promo code data into form
  const importPromoCode = (promoCode: MindbodyPromoCode) => {
    // Find the service IDs from the applicable items
    const serviceIds = promoCode.ApplicableItems
      .filter(item => item.Type === 'Service')
      .map(item => item.Id)

    // Calculate totals from the applicable services
    const { totalPrice, totalDuration, serviceNames } = calculateTotals(serviceIds)

    // Calculate the promotional price based on discount type
    let promoPrice = totalPrice
    if (promoCode.DiscountType === 'Percent') {
      promoPrice = totalPrice * (1 - promoCode.DiscountAmount / 100)
    } else {
      promoPrice = totalPrice - promoCode.DiscountAmount
    }

    setFormData({
      ...formData,
      title_es: promoCode.Name,
      title_en: promoCode.Name,
      description_es: `${promoCode.DiscountType === 'Percent' ? promoCode.DiscountAmount + '%' : '$' + promoCode.DiscountAmount} de descuento. Código: ${promoCode.Code}`,
      description_en: `${promoCode.DiscountType === 'Percent' ? promoCode.DiscountAmount + '%' : '$' + promoCode.DiscountAmount} off. Code: ${promoCode.Code}`,
      price: Math.round(promoPrice * 100) / 100,
      original_price: totalPrice,
      duration_minutes: totalDuration,
      // Keep existing dates - don't import from Mindbody
      // valid_from and valid_until are set manually for website availability
      services: serviceNames,
      mindbody_service_ids: serviceIds,
    })

    setShowPromoLookup(false)
    setPromoCodeSearch('')
    setPromoCodeResults([])
  }

  // Filter promotions by search
  const filteredPromotions = promotions.filter((p) =>
    p.title_es.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter available services by search
  const filteredServices = mindbodyServices.filter((s) =>
    s.Name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    s.Category.toLowerCase().includes(serviceSearch.toLowerCase())
  )

  // Calculate totals from selected services
  const calculateTotals = (serviceIds: number[]) => {
    const selectedServices = mindbodyServices.filter(s => serviceIds.includes(s.Id))
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.Price, 0)
    const totalDuration = selectedServices.reduce((sum, s) => sum + s.Duration, 0)
    const serviceNames = selectedServices.map(s => s.Name)
    return { totalPrice, totalDuration, serviceNames }
  }

  // Handle service selection toggle
  const toggleService = (serviceId: number) => {
    setFormData(prev => {
      const newIds = prev.mindbody_service_ids.includes(serviceId)
        ? prev.mindbody_service_ids.filter(id => id !== serviceId)
        : [...prev.mindbody_service_ids, serviceId]

      const { totalPrice, totalDuration, serviceNames } = calculateTotals(newIds)

      return {
        ...prev,
        mindbody_service_ids: newIds,
        original_price: totalPrice,
        duration_minutes: totalDuration,
        services: serviceNames,
        // Auto-set description if empty
        description_es: prev.description_es || serviceNames.join(' + '),
      }
    })
  }

  // Open create modal
  const handleCreate = () => {
    setEditingPromotion(null)
    setFormData(defaultFormData)
    setServiceSearch('')
    setIsModalOpen(true)
  }

  // Open edit modal
  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion)
    setFormData({
      title_es: promotion.title_es,
      title_en: promotion.title_en || '',
      description_es: promotion.description_es || '',
      description_en: promotion.description_en || '',
      price: promotion.price,
      original_price: promotion.original_price,
      duration_minutes: promotion.duration_minutes || 0,
      valid_from: promotion.valid_from,
      valid_until: promotion.valid_until,
      is_active: promotion.is_active,
      sort_order: promotion.sort_order,
      services: promotion.services || [],
      mindbody_service_ids: promotion.mindbody_service_ids || [],
    })
    setServiceSearch('')
    setIsModalOpen(true)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const method = editingPromotion ? 'PUT' : 'POST'
      const body = editingPromotion
        ? { id: editingPromotion.id, ...formData }
        : formData

      const response = await fetch('/api/promotions', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin', // Simple auth for now
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Error al guardar')

      setIsModalOpen(false)
      fetchPromotions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta promoción?')) return

    try {
      const response = await fetch(`/api/promotions?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer admin' },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al eliminar')
      }

      fetchPromotions()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
        <p className="text-warm-gray">Cargando promociones...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-dark">Promociones</h1>
          <p className="text-warm-gray mt-1">Gestiona las promociones con servicios de Mindbody</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchPromotions}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Actualizar
          </Button>
          <Button onClick={handleCreate} leftIcon={<Plus className="h-4 w-4" />}>
            Nueva Promoción
          </Button>
        </div>
      </div>

      {error && (
        <Card variant="default" padding="md" className="mb-6 border-red-200 bg-red-50">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {/* Search Bar */}
      <Card variant="default" padding="md" className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warm-gray" />
          <input
            type="text"
            placeholder="Buscar promociones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12"
          />
        </div>
      </Card>

      {/* Promotions Table */}
      <Card variant="default" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-beige border-b border-beige-300">
              <tr>
                <th className="text-left p-4 font-medium text-dark">Nombre</th>
                <th className="text-left p-4 font-medium text-dark">Precio</th>
                <th className="text-left p-4 font-medium text-dark">Precio Original</th>
                <th className="text-left p-4 font-medium text-dark">Servicios</th>
                <th className="text-left p-4 font-medium text-dark">Válida hasta</th>
                <th className="text-left p-4 font-medium text-dark">Estado</th>
                <th className="text-right p-4 font-medium text-dark">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-200">
              {filteredPromotions.map((promotion) => (
                <tr key={promotion.id} className="hover:bg-beige-100 transition-colors">
                  <td className="p-4">
                    <span className="font-medium text-dark">{promotion.title_es}</span>
                  </td>
                  <td className="p-4 text-gold font-semibold">${promotion.price}</td>
                  <td className="p-4 text-warm-gray">
                    {promotion.original_price ? (
                      <span className="line-through">${promotion.original_price}</span>
                    ) : '-'}
                  </td>
                  <td className="p-4 text-warm-gray text-sm">
                    {promotion.mindbody_service_ids?.length || 0} servicios
                  </td>
                  <td className="p-4 text-warm-gray">{promotion.valid_until}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        'px-2 py-1 text-xs rounded-full',
                        promotion.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      )}
                    >
                      {promotion.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(promotion)}
                        className="p-2 rounded-lg hover:bg-beige transition-colors text-warm-gray hover:text-dark"
                        aria-label="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(promotion.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors text-warm-gray hover:text-red-600"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPromotions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-warm-gray">No se encontraron promociones</p>
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPromotion ? 'Editar Promoción' : 'Nueva Promoción'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mindbody Promo Code Lookup */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <button
              type="button"
              onClick={() => setShowPromoLookup(!showPromoLookup)}
              className="flex items-center gap-2 text-blue-700 font-medium w-full"
            >
              <Tag className="w-4 h-4" />
              <span>Importar desde Mindbody</span>
              <span className="text-xs text-blue-500 ml-auto">
                {showPromoLookup ? '▲ Ocultar' : '▼ Mostrar'}
              </span>
            </button>

            {showPromoLookup && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-blue-600">
                  Busca un código promocional de Mindbody para importar sus datos automáticamente.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input flex-1"
                    value={promoCodeSearch}
                    onChange={(e) => setPromoCodeSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), searchPromoCodes())}
                    placeholder="Buscar por código o nombre..."
                  />
                  <Button
                    type="button"
                    onClick={searchPromoCodes}
                    disabled={isPromoCodeLoading || !promoCodeSearch.trim()}
                    leftIcon={isPromoCodeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  >
                    Buscar
                  </Button>
                </div>

                {promoCodeError && (
                  <p className="text-sm text-red-600">{promoCodeError}</p>
                )}

                {promoCodeResults.length > 0 && (
                  <div className="bg-white border border-blue-200 rounded-lg max-h-64 overflow-y-auto">
                    {promoCodeResults.map((pc) => (
                      <div
                        key={pc.Id}
                        className="p-3 border-b border-blue-100 last:border-b-0 hover:bg-blue-50 cursor-pointer"
                        onClick={() => importPromoCode(pc)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-dark">{pc.Name}</p>
                            <p className="text-sm text-warm-gray">
                              Código: <span className="font-mono bg-gray-100 px-1 rounded">{pc.Code}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              {pc.DiscountType === 'Percent' ? `${pc.DiscountAmount}%` : `$${pc.DiscountAmount}`} OFF
                            </p>
                            <span className={cn(
                              'text-xs px-2 py-0.5 rounded-full',
                              pc.IsActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            )}>
                              {pc.IsActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-warm-gray">
                          <span>Válido: {pc.ActivationDate.split('T')[0]} - {pc.ExpirationDate.split('T')[0]}</span>
                          {pc.MaxUses && <span className="ml-2">| Máx. usos: {pc.MaxUses}</span>}
                          <span className="ml-2">| Usado: {pc.TimesUsed} veces</span>
                        </div>
                        {pc.ApplicableItems.length > 0 && (
                          <div className="mt-2 text-xs text-blue-600">
                            Servicios: {pc.ApplicableItems.map(i => i.Name).join(', ')}
                          </div>
                        )}
                        <div className="mt-2 flex justify-end">
                          <span className="text-xs text-blue-600 flex items-center gap-1">
                            <Download className="w-3 h-3" /> Click para importar
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Nombre (Español) *</label>
              <input
                type="text"
                className="input"
                value={formData.title_es}
                onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
                placeholder="Ej: Esencia de Paz"
                required
              />
            </div>
            <div>
              <label className="label">Nombre (Inglés)</label>
              <input
                type="text"
                className="input"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                placeholder="Ej: Essence of Peace"
              />
            </div>
          </div>

          {/* Service Selection */}
          <div>
            <label className="label">Servicios de Mindbody *</label>
            <p className="text-sm text-warm-gray mb-2">
              Selecciona los servicios que incluye esta promoción
            </p>

            {/* Selected services summary */}
            {formData.mindbody_service_ids.length > 0 && (
              <div className="mb-3 p-3 bg-gold/10 rounded-lg">
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.mindbody_service_ids.map(id => {
                    const service = mindbodyServices.find(s => s.Id === id)
                    return service ? (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gold/20 text-dark text-sm rounded-full"
                      >
                        {service.Name}
                        <button
                          type="button"
                          onClick={() => toggleService(id)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : null
                  })}
                </div>
                <div className="text-sm text-dark">
                  <span className="font-medium">Precio original: </span>
                  <span className="line-through">${formData.original_price}</span>
                  {' | '}
                  <span className="font-medium">Duración: </span>
                  {formData.duration_minutes} min
                </div>
              </div>
            )}

            {/* Service search */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-gray" />
              <input
                type="text"
                className="input pl-9 py-2 text-sm"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Buscar servicios..."
              />
            </div>

            {/* Service list */}
            <div className="max-h-48 overflow-y-auto border border-beige-200 rounded-lg">
              {isServicesLoading ? (
                <div className="p-4 text-center text-warm-gray">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                  Cargando servicios...
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="p-4 text-center text-warm-gray">
                  No se encontraron servicios
                </div>
              ) : (
                filteredServices.map(service => {
                  const isSelected = formData.mindbody_service_ids.includes(service.Id)
                  return (
                    <button
                      key={service.Id}
                      type="button"
                      onClick={() => toggleService(service.Id)}
                      className={cn(
                        "w-full p-3 text-left flex items-center justify-between hover:bg-beige-50 transition-colors border-b border-beige-100 last:border-b-0",
                        isSelected && "bg-gold/10"
                      )}
                    >
                      <div>
                        <p className="font-medium text-dark text-sm">{service.Name}</p>
                        <p className="text-xs text-warm-gray">
                          {service.Category} | ${service.Price} | {service.Duration} min
                        </p>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-gold" />}
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Precio Promocional ($) *</label>
              <input
                type="number"
                className="input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="79"
                min="0"
                step="0.01"
                required
              />
              {formData.original_price && formData.price < formData.original_price && (
                <p className="text-sm text-green-600 mt-1">
                  Descuento: ${(formData.original_price - formData.price).toFixed(0)} ({Math.round((1 - formData.price / formData.original_price) * 100)}%)
                </p>
              )}
            </div>
            <div>
              <label className="label">Duración (min)</label>
              <input
                type="number"
                className="input bg-beige-50"
                value={formData.duration_minutes}
                readOnly
                placeholder="Auto-calculado"
              />
              <p className="text-xs text-warm-gray mt-1">Calculado automáticamente</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Válida desde *</label>
              <input
                type="date"
                className="input"
                value={formData.valid_from}
                onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Válida hasta *</label>
              <input
                type="date"
                className="input"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Descripción (Español)</label>
              <textarea
                className="input"
                rows={2}
                value={formData.description_es}
                onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                placeholder="Descripción de la promoción..."
              />
            </div>
            <div>
              <label className="label">Descripción (Inglés)</label>
              <textarea
                className="input"
                rows={2}
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                placeholder="Promotion description..."
              />
            </div>
          </div>

          {/* Active checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
            <label htmlFor="is_active" className="text-sm text-dark">
              Promoción activa
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-beige-200">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving || formData.mindbody_service_ids.length === 0}
              leftIcon={isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
            >
              {isSaving ? 'Guardando...' : editingPromotion ? 'Guardar Cambios' : 'Crear Promoción'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
