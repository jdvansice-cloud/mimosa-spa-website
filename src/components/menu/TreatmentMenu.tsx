'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Clock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { ServiceCategory, MindbodyService } from '@/types/booking'

export function TreatmentMenu() {
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openCategories, setOpenCategories] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/mindbody/services?grouped=true')
      const data = await res.json()
      setCategories(data.categories || [])
      
      // Open first category by default
      if (data.categories?.length > 0) {
        setOpenCategories(new Set([data.categories[0].id]))
      }
    } catch (err) {
      console.error('Error fetching services:', err)
      setError('Error cargando tratamientos')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCategory = (categoryId: number) => {
    setOpenCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
        <button onClick={fetchServices} className="btn-secondary mt-4">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <CategorySection
          key={category.id}
          category={category}
          isOpen={openCategories.has(category.id)}
          onToggle={() => toggleCategory(category.id)}
        />
      ))}
      
      {categories.length === 0 && (
        <div className="text-center py-20 text-warm-gray">
          No hay tratamientos disponibles en este momento.
        </div>
      )}
    </div>
  )
}

function CategorySection({
  category,
  isOpen,
  onToggle,
}: {
  category: ServiceCategory
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-soft" id={category.name.toLowerCase().replace(/\s+/g, '-')}>
      {/* Category Header */}
      <button
        onClick={onToggle}
        className={`
          w-full flex items-center justify-between p-6 
          transition-colors duration-200
          ${isOpen ? 'bg-gold-50' : 'hover:bg-beige-50'}
        `}
      >
        <div className="flex items-center gap-4">
          <span className="font-serif text-2xl font-semibold text-dark">
            {category.name}
          </span>
          <span className="text-sm text-warm-gray bg-beige-100 px-3 py-1 rounded-full">
            {category.services.length} tratamientos
          </span>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className={`w-6 h-6 ${isOpen ? 'text-gold-600' : 'text-warm-gray'}`} />
        </motion.div>
      </button>
      
      {/* Services List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-t border-beige-100">
              {category.services.map((service, index) => (
                <TreatmentItem
                  key={service.Id}
                  service={service}
                  isLast={index === category.services.length - 1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TreatmentItem({
  service,
  isLast,
}: {
  service: MindbodyService
  isLast: boolean
}) {
  return (
    <div className={`p-6 ${!isLast ? 'border-b border-beige-100' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-dark mb-1">
            {service.Name}
          </h3>
          {service.Description && (
            <p className="text-warm-gray text-sm leading-relaxed">
              {service.Description}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-6 md:flex-shrink-0">
          {service.Duration && (
            <span className="flex items-center gap-1.5 text-sm text-warm-gray">
              <Clock className="w-4 h-4" />
              {service.Duration} min
            </span>
          )}
          <span className="text-2xl font-bold text-gold-600">
            ${service.Price}
          </span>
          <Link
            href={`/reservar?service=${service.Id}`}
            className="btn-primary text-sm py-2 px-4"
          >
            Reservar
          </Link>
        </div>
      </div>
    </div>
  )
}
