'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { Button, Card, Modal } from '@/components/ui'
import { cn } from '@/lib/utils'

// Sample promotions data
const initialPromotions = [
  {
    id: '1',
    title_es: 'Esencia de Paz',
    price: 79,
    duration_minutes: 65,
    is_active: true,
    valid_until: '2026-01-31',
  },
  {
    id: '2',
    title_es: 'Suspiro de Serenidad',
    price: 99,
    duration_minutes: 85,
    is_active: true,
    valid_until: '2026-01-31',
  },
  {
    id: '3',
    title_es: 'Calma Total',
    price: 129,
    duration_minutes: 110,
    is_active: true,
    valid_until: '2026-01-31',
  },
]

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState(initialPromotions)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<typeof initialPromotions[0] | null>(null)

  const filteredPromotions = promotions.filter((p) =>
    p.title_es.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (promotion: typeof initialPromotions[0]) => {
    setEditingPromotion(promotion)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta promoción?')) {
      setPromotions(promotions.filter((p) => p.id !== id))
    }
  }

  const handleCreate = () => {
    setEditingPromotion(null)
    setIsModalOpen(true)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold text-dark">Promociones</h1>
          <p className="text-warm-gray mt-1">Gestiona las promociones del mes</p>
        </div>
        <Button onClick={handleCreate} leftIcon={<Plus className="h-4 w-4" />}>
          Nueva Promoción
        </Button>
      </div>

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
                <th className="text-left p-4 font-medium text-dark">Duración</th>
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
                  <td className="p-4 text-dark">${promotion.price}</td>
                  <td className="p-4 text-warm-gray">{promotion.duration_minutes} min</td>
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
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Nombre (Español)</label>
              <input
                type="text"
                className="input"
                defaultValue={editingPromotion?.title_es}
                placeholder="Ej: Esencia de Paz"
              />
            </div>
            <div>
              <label className="label">Nombre (Inglés)</label>
              <input
                type="text"
                className="input"
                placeholder="Ej: Essence of Peace"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Precio ($)</label>
              <input
                type="number"
                className="input"
                defaultValue={editingPromotion?.price}
                placeholder="79"
              />
            </div>
            <div>
              <label className="label">Duración (min)</label>
              <input
                type="number"
                className="input"
                defaultValue={editingPromotion?.duration_minutes}
                placeholder="65"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Válida desde</label>
              <input type="date" className="input" />
            </div>
            <div>
              <label className="label">Válida hasta</label>
              <input
                type="date"
                className="input"
                defaultValue={editingPromotion?.valid_until}
              />
            </div>
          </div>
          <div>
            <label className="label">Servicios incluidos</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Un servicio por línea"
            />
          </div>
          <div>
            <label className="label">Imagen</label>
            <input type="file" accept="image/*" className="input" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_active" defaultChecked={editingPromotion?.is_active ?? true} />
            <label htmlFor="is_active" className="text-sm text-dark">
              Promoción activa
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-beige-200 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingPromotion ? 'Guardar Cambios' : 'Crear Promoción'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
