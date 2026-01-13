'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { ServiceCard } from './ServiceCard'
import type { ServiceCategory, MindbodyService } from '@/types/booking'

interface CategoryAccordionProps {
  category: ServiceCategory
  selectedServiceIds: Set<string>
  onServiceSelect: (service: MindbodyService) => void
  onServiceDeselect: (serviceId: string) => void
  defaultOpen?: boolean
}

export function CategoryAccordion({
  category,
  selectedServiceIds,
  onServiceSelect,
  onServiceDeselect,
  defaultOpen = false,
}: CategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  const selectedCount = category.services.filter(s => selectedServiceIds.has(s.Id)).length
  const hasSelections = selectedCount > 0

  return (
    <div className="border border-beige-200 rounded-xl overflow-hidden bg-white">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between p-4 
          transition-colors duration-200
          ${isOpen 
            ? 'bg-gold-50' 
            : hasSelections 
              ? 'bg-gold-50/50' 
              : 'bg-beige-50 hover:bg-beige-100'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <span className="font-serif font-semibold text-lg text-dark">
            {category.name}
          </span>
          {hasSelections && (
            <span className="bg-gold text-dark text-xs font-bold px-2 py-0.5 rounded-full">
              {selectedCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-warm-gray">
            {category.services.length} tratamientos
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-gold-600' : 'text-warm-gray'}`} />
          </motion.div>
        </div>
      </button>
      
      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-4 pt-2 grid gap-3">
              {category.services.map((service) => (
                <ServiceCard
                  key={service.Id}
                  service={service}
                  isSelected={selectedServiceIds.has(service.Id)}
                  onSelect={() => onServiceSelect(service)}
                  onDeselect={() => onServiceDeselect(service.Id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
