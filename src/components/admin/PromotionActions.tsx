'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Modal } from '@/components/ui'
import { Edit, Trash2, MoreHorizontal } from 'lucide-react'
import type { Promotion } from '@/types'

interface PromotionActionsProps {
  promotion: Promotion
}

export function PromotionActions({ promotion }: PromotionActionsProps) {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotion.id)

      if (error) throw error

      setShowDeleteModal(false)
      router.refresh()
    } catch (error) {
      console.error('Error deleting promotion:', error)
      alert('Error al eliminar la promoción')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Link href={`/admin/promociones/${promotion.id}`}>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar Promoción"
      >
        <div className="space-y-4">
          <p className="text-dark">
            ¿Estás seguro de que deseas eliminar la promoción{' '}
            <span className="font-semibold">{promotion.title_es}</span>?
          </p>
          <p className="text-warm-gray text-sm">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              isLoading={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
