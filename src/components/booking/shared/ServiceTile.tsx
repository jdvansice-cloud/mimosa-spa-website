'use client'

import { useState } from 'react'
import { Plus, Check, Info, X, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MindbodyService } from '@/types/booking'

interface ServiceTileProps {
  service: MindbodyService
  isSelected: boolean
  onToggle: () => void
}

export function ServiceTile({ service, isSelected, onToggle }: ServiceTileProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  return (
    <div className="relative">
      {/* Main Tile */}
      <div
        className={`
          relative rounded-xl border-2 transition-all duration-200 overflow-hidden
          ${isSelected 
            ? 'border-gold bg-gold/5 shadow-md' 
            : 'border-beige-200 bg-white hover:border-gold/50 hover:shadow-sm'
          }
        `}
      >
        {/* Tile Content */}
        <div className="p-4">
          {/* Top Row: Name & Price */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-medium text-dark text-sm leading-tight flex-1">
              {service.Name}
            </h4>
            <span className={`
              text-lg font-bold whitespace-nowrap
              ${isSelected ? 'text-gold-600' : 'text-dark'}
            `}>
              {service.Price > 0 ? `$${service.Price.toFixed(0)}` : 'Consultar'}
            </span>
          </div>
          
          {/* Duration (if available) */}
          {service.Duration > 0 && (
            <div className="flex items-center gap-1 text-xs text-warm-gray mb-3">
              <Clock className="w-3 h-3" />
              <span>{service.Duration} min</span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Add/Remove Button */}
            <button
              onClick={onToggle}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg
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
            
            {/* Info Button (if description exists) */}
            {service.Description && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${showDetails 
                    ? 'bg-gold/20 text-gold-600' 
                    : 'bg-beige-100 text-warm-gray hover:bg-beige-200'
                  }
                `}
                aria-label="Ver detalles"
              >
                <Info className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* Expandable Description */}
        <AnimatePresence>
          {showDetails && service.Description && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-2 border-t border-beige-100">
                <p className="text-sm text-warm-gray leading-relaxed">
                  {service.Description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-dark" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Compact version for add-ons
export function AddonTile({ service, isSelected, onToggle }: ServiceTileProps) {
  return (
    <button
      onClick={onToggle}
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
          <p className="font-medium text-dark text-sm truncate">{service.Name}</p>
        </div>
        
        {/* Price */}
        <span className={`
          font-bold text-sm whitespace-nowrap
          ${isSelected ? 'text-gold-600' : 'text-dark'}
        `}>
          +${service.Price.toFixed(0)}
        </span>
      </div>
    </button>
  )
}
