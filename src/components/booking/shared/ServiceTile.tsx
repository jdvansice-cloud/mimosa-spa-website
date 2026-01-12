'use client'

import { useState } from 'react'
import { Plus, Check, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MindbodyService } from '@/types/booking'

interface ServiceTileProps {
  service: MindbodyService
  isSelected: boolean
  onToggle: () => void
}

export function ServiceTile({ service, isSelected, onToggle }: ServiceTileProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Use setTimeout to prevent UI stalling
    setTimeout(() => onToggle(), 0)
  }
  
  const handleInfoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDetails(!showDetails)
  }
  
  return (
    <div className="relative">
      {/* Main Tile */}
      <div
        className={`
          relative rounded-xl border-2 transition-all duration-200 overflow-hidden
          ${isSelected 
            ? 'border-gold bg-gold/5 shadow-md ring-2 ring-gold/20' 
            : 'border-beige-200 bg-white hover:border-gold/50 hover:shadow-sm'
          }
        `}
      >
        {/* Selected Badge */}
        {isSelected && (
          <div className="absolute top-2 right-2 z-10">
            <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center shadow-sm">
              <Check className="w-4 h-4 text-dark" />
            </div>
          </div>
        )}
        
        {/* Tile Content */}
        <div className="p-4">
          {/* Service Name - LARGER FONT */}
          <div className="pr-8 mb-3">
            <h4 className="font-semibold text-dark text-base sm:text-lg leading-snug">
              {service.Name}
            </h4>
          </div>
          
          {/* Price & Duration Row */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`
              text-xl font-bold
              ${isSelected ? 'text-gold-600' : 'text-dark'}
            `}>
              {service.Price > 0 ? `$${service.Price.toFixed(0)}` : 'Consultar'}
            </span>
            {service.Duration > 0 && (
              <span className="flex items-center gap-1 text-sm text-warm-gray bg-beige-100 px-2 py-0.5 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                {service.Duration} min
              </span>
            )}
          </div>
          
          {/* Brief Description Preview (if available) */}
          {service.Description && !showDetails && (
            <p className="text-sm text-warm-gray mb-3 line-clamp-2">
              {service.Description}
            </p>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Add/Remove Button */}
            <button
              type="button"
              onClick={handleToggle}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg
                font-medium text-sm transition-all duration-200
                ${isSelected
                  ? 'bg-gold text-dark hover:bg-gold/90'
                  : 'bg-beige-100 text-dark hover:bg-beige-200'
                }
              `}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4" />
                  Agregado
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Agregar
                </>
              )}
            </button>
            
            {/* Expand/Collapse Button (if description exists) */}
            {service.Description && (
              <button
                type="button"
                onClick={handleInfoClick}
                className={`
                  p-2.5 rounded-lg transition-all duration-200
                  ${showDetails 
                    ? 'bg-gold/20 text-gold-600' 
                    : 'bg-beige-100 text-warm-gray hover:bg-beige-200'
                  }
                `}
                aria-label="Ver detalles"
              >
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
        
        {/* Expandable Full Description */}
        <AnimatePresence>
          {showDetails && service.Description && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-2 border-t border-beige-100 bg-beige-50/50">
                <p className="text-sm text-warm-gray leading-relaxed">
                  {service.Description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Compact version for add-ons
export function AddonTile({ service, isSelected, onToggle }: ServiceTileProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setTimeout(() => onToggle(), 0)
  }
  
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        w-full p-3 rounded-xl border-2 text-left transition-all duration-200
        ${isSelected 
          ? 'border-gold bg-gold/10' 
          : 'border-beige-200 bg-white hover:border-gold/50'
        }
      `}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Selection Indicator */}
        <div className={`
          w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
          transition-all duration-200
          ${isSelected 
            ? 'bg-gold text-dark' 
            : 'border-2 border-beige-300'
          }
        `}>
          {isSelected && <Check className="w-4 h-4" />}
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-dark text-base truncate">{service.Name}</p>
        </div>
        
        {/* Price */}
        <span className={`
          font-bold text-lg whitespace-nowrap
          ${isSelected ? 'text-gold-600' : 'text-dark'}
        `}>
          +${service.Price.toFixed(0)}
        </span>
      </div>
    </button>
  )
}
