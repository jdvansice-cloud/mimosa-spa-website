'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, Edit, Trash2, Search, Loader2, RefreshCw, Check, X, Download, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import { Button, Card, Modal } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Promotion } from '@/types'

interface MindbodyService {
  Id: number
  ProductId: number
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
  promo_code: string
  discount_type: 'Percent' | 'Amount' | null
  discount_amount: number | null
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
  promo_code: '',
  discount_type: null,
  discount_amount: null,
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
  const [showPromoResults, setShowPromoResults] = useState(false)
  const promoSearchRef = useRef<HTMLInputElement>(null)
  const promoResultsRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
        // Include ALL services for promo matching (ProductId lookup)
        // The promo's ApplicableItems can include add-ons and offline services
        setMindbodyServices(data.services)
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

  // Search Mindbody promo codes with debounce
  const searchPromoCodes = useCallback(async (searchText: string) => {
    if (!searchText.trim() || searchText.length < 2) {
      setPromoCodeResults([])
      setPromoCodeError(null)
      setShowPromoResults(false)
      return
    }

    setIsPromoCodeLoading(true)
    setPromoCodeError(null)
    setShowPromoResults(true)

    try {
      const response = await fetch(`/api/mindbody/promocodes?search=${encodeURIComponent(searchText)}&activeOnly=true`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al buscar códigos promocionales')
      }

      const results = data.promoCodes || []
      setPromoCodeResults(results)
      if (results.length === 0) {
        setPromoCodeError('No se encontraron promociones con ese texto')
      }
    } catch (err) {
      setPromoCodeError(err instanceof Error ? err.message : 'Error de conexión')
      setPromoCodeResults([])
    } finally {
      setIsPromoCodeLoading(false)
    }
  }, [])

  // Handle promo code search input change with debounce
  const handlePromoSearchChange = (value: string) => {
    setPromoCodeSearch(value)

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchPromoCodes(value)
    }, 400)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        promoResultsRef.current &&
        !promoResultsRef.current.contains(event.target as Node) &&
        promoSearchRef.current &&
        !promoSearchRef.current.contains(event.target as Node)
      ) {
        setShowPromoResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Import promo code data into form
  const importPromoCode = (promoCode: MindbodyPromoCode) => {
    // Get the applicable items from the promo code (can be Service or Item type)
    const applicableItems = promoCode.ApplicableItems || []

    // Match services by ProductId (ApplicableItems.Id matches service.ProductId)
    const matchedServiceIds: number[] = []
    const matchedServiceNames: string[] = []

    for (const applicable of applicableItems) {
      // Find service where ProductId matches the applicable item's Id
      const matchedService = mindbodyServices.find(s => s.ProductId === applicable.Id)
      if (matchedService) {
        matchedServiceIds.push(matchedService.Id)
        matchedServiceNames.push(matchedService.Name)
      }
    }

    console.log('Promo code applicable items:', applicableItems.map(s => ({ Id: s.Id, Name: s.Name, Type: s.Type })))
    console.log('Available services with ProductIds:', mindbodyServices.slice(0, 5).map(s => ({ Id: s.Id, ProductId: s.ProductId, Name: s.Name })))
    console.log('Matched service IDs:', matchedServiceIds)
    console.log('Matched service names:', matchedServiceNames)

    // Calculate totals from the matched services
    const { totalPrice, totalDuration } = calculateTotals(matchedServiceIds)

    // Calculate the promotional price based on discount type
    let promoPrice = 0
    if (matchedServiceIds.length > 0 && totalPrice > 0) {
      if (promoCode.DiscountType === 'Percent') {
        promoPrice = totalPrice * (1 - promoCode.DiscountAmount / 100)
      } else {
        promoPrice = Math.max(0, totalPrice - promoCode.DiscountAmount)
      }
    }

    // Build description including the Mindbody services for reference
    const applicableServicesList = applicableItems.map(s => s.Name).join(', ')
    const descriptionNote = matchedServiceIds.length === 0 && applicableItems.length > 0
      ? `\n\n[Servicios en Mindbody: ${applicableServicesList}]`
      : ''

    setFormData({
      ...formData,
      title_es: promoCode.Name,
      title_en: promoCode.Name,
      description_es: `${promoCode.DiscountType === 'Percent' ? promoCode.DiscountAmount + '%' : '$' + promoCode.DiscountAmount} de descuento. Código: ${promoCode.Code}${descriptionNote}`,
      description_en: `${promoCode.DiscountType === 'Percent' ? promoCode.DiscountAmount + '%' : '$' + promoCode.DiscountAmount} off. Code: ${promoCode.Code}`,
      price: promoPrice > 0 ? Math.round(promoPrice * 100) / 100 : formData.price,
      original_price: totalPrice > 0 ? totalPrice : formData.original_price,
      duration_minutes: totalDuration > 0 ? totalDuration : formData.duration_minutes,
      services: matchedServiceNames.length > 0 ? matchedServiceNames : applicableItems.map(s => s.Name),
      mindbody_service_ids: matchedServiceIds,
      promo_code: promoCode.Code,
      discount_type: promoCode.DiscountType,
      discount_amount: promoCode.DiscountAmount,
    })

    // If no services matched, pre-fill the service search to help user find services manually
    if (matchedServiceIds.length === 0 && applicableItems.length > 0) {
      // Try to extract a useful search term from the first applicable item
      const firstService = applicableItems[0].Name
      const searchTerm = firstService
        .split(/[-–]/)[0]  // Get text before dash
        .replace(/\d+\s*min(utos?)?/gi, '') // Remove duration
        .trim()
        .split(' ')[0] // Get first word

      if (searchTerm.length > 2) {
        setServiceSearch(searchTerm)
      }
    }

    setShowPromoLookup(false)
    setPromoCodeSearch('')
    setPromoCodeResults([])
    setShowPromoResults(false)
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
      promo_code: promotion.promo_code || '',
      discount_type: promotion.discount_type || null,
      discount_amount: promotion.discount_amount || null,
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
              onClick={() => {
                setShowPromoLookup(!showPromoLookup)
                if (!showPromoLookup) {
                  // Focus the search input when opening
                  setTimeout(() => promoSearchRef.current?.focus(), 100)
                }
              }}
              className="flex items-center gap-2 text-blue-700 font-medium w-full"
            >
              <Tag className="w-4 h-4" />
              <span>Importar desde Mindbody</span>
              <span className="text-xs text-blue-500 ml-auto flex items-center gap-1">
                {showPromoLookup ? (
                  <>
                    <ChevronUp className="w-4 h-4" /> Ocultar
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" /> Mostrar
                  </>
                )}
              </span>
            </button>

            {showPromoLookup && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-blue-600">
                  Busca un código promocional de Mindbody para importar sus datos automáticamente.
                </p>

                {/* Search input with dropdown results */}
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-gray" />
                    <input
                      ref={promoSearchRef}
                      type="text"
                      className="input pl-10 pr-10"
                      value={promoCodeSearch}
                      onChange={(e) => handlePromoSearchChange(e.target.value)}
                      onFocus={() => {
                        if (promoCodeResults.length > 0) {
                          setShowPromoResults(true)
                        }
                      }}
                      placeholder="Ej: 2026, Día de la Madre, Especial..."
                      autoComplete="off"
                    />
                    {isPromoCodeLoading && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin" />
                    )}
                  </div>

                  {/* Results dropdown */}
                  {showPromoResults && (promoCodeResults.length > 0 || promoCodeError) && (
                    <div
                      ref={promoResultsRef}
                      className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-blue-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
                    >
                      {promoCodeError && promoCodeResults.length === 0 ? (
                        <div className="p-4 text-center text-sm">
                          {promoCodeError.includes('API error') || promoCodeError.includes('404') || promoCodeError.includes('500') ? (
                            <div className="text-amber-600">
                              <p className="font-medium mb-1">La API de Mindbody no está disponible</p>
                              <p className="text-xs text-warm-gray">
                                Ingresa los datos de la promoción manualmente usando los campos abajo.
                              </p>
                            </div>
                          ) : (
                            <span className="text-warm-gray">{promoCodeError}</span>
                          )}
                        </div>
                      ) : (
                        promoCodeResults.map((pc) => (
                          <div
                            key={pc.Id}
                            className="p-3 border-b border-blue-100 last:border-b-0 hover:bg-blue-50 cursor-pointer transition-colors"
                            onClick={() => importPromoCode(pc)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-dark truncate">{pc.Name}</p>
                                <p className="text-sm text-warm-gray">
                                  Código: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">{pc.Code}</span>
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="font-semibold text-green-600">
                                  {pc.DiscountType === 'Percent' ? `${pc.DiscountAmount}%` : `$${pc.DiscountAmount}`} OFF
                                </p>
                                <span className={cn(
                                  'text-xs px-2 py-0.5 rounded-full inline-block',
                                  pc.IsActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                )}>
                                  {pc.IsActive ? 'Activo' : 'Inactivo'}
                                </span>
                              </div>
                            </div>

                            {pc.ApplicableItems.length > 0 && (
                              <div className="mt-2 text-xs text-blue-600 line-clamp-2">
                                <span className="font-medium">Servicios:</span> {pc.ApplicableItems.map(i => i.Name).join(', ')}
                              </div>
                            )}

                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs text-warm-gray">
                                {pc.ActivationDate.split('T')[0]} → {pc.ExpirationDate.split('T')[0]}
                              </span>
                              <span className="text-xs text-blue-600 flex items-center gap-1 font-medium">
                                <Download className="w-3 h-3" /> Seleccionar
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {promoCodeSearch.length > 0 && promoCodeSearch.length < 2 && (
                  <p className="text-xs text-warm-gray">Escribe al menos 2 caracteres para buscar</p>
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

          {/* Promo Code and Discount Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Código Promocional</label>
              <input
                type="text"
                className="input font-mono"
                value={formData.promo_code}
                onChange={(e) => setFormData({ ...formData, promo_code: e.target.value })}
                placeholder="Ej: 26ene129"
              />
            </div>
            <div>
              <label className="label">Tipo de Descuento</label>
              <select
                className="input"
                value={formData.discount_type || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  discount_type: e.target.value as 'Percent' | 'Amount' | null || null
                })}
              >
                <option value="">Sin descuento</option>
                <option value="Percent">Porcentaje (%)</option>
                <option value="Amount">Monto fijo ($)</option>
              </select>
            </div>
            <div>
              <label className="label">
                {formData.discount_type === 'Percent' ? 'Porcentaje (%)' : 'Monto ($)'}
              </label>
              <input
                type="number"
                className="input"
                value={formData.discount_amount || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  discount_amount: e.target.value ? parseFloat(e.target.value) : null
                })}
                placeholder={formData.discount_type === 'Percent' ? 'Ej: 15' : 'Ej: 20'}
                min="0"
                step={formData.discount_type === 'Percent' ? '0.01' : '0.01'}
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
