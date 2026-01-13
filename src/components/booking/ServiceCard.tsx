'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Plus, Check } from 'lucide-react'
import type { MindbodyService } from '@/types/booking'

interface ServiceCardProps {
  service: MindbodyService
  isSelected: boolean
  onSelect: () => void
  onDeselect: () => void
}

export function ServiceCard({ service, isSelected, onSelect, onDeselect }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (isSelected) {
      onDeselect()
    } else {
      onSelect()
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        w-full text-left p-4 rounded-xl border-2 transition-all duration-200
        ${isSelected 
          ? 'border-gold bg-gold-50 shadow-gold' 
          : 'border-beige-200 bg-white hover:border-gold-300 hover:shadow-soft'
        }
      `}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Service name */}
          <h4 className="font-semibold text-dark text-base mb-1 line-clamp-2">
            {service.Name}
          </h4>
          
          {/* Description if available */}
          {service.Description && (
            <p className="text-sm text-warm-gray line-clamp-2 mb-2">
              {service.Description}
            </p>
          )}
          
          {/* Duration and Price */}
          <div className="flex items-center gap-4 mt-2">
            {service.Duration && (
              <span className="flex items-center gap-1 text-sm text-warm-gray">
                <Clock className="w-4 h-4" />
                {service.Duration} min
              </span>
            )}
            <span className="text-lg font-bold text-gold-600">
              ${service.Price}
            </span>
          </div>
        </div>
        
        {/* Selection indicator */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          transition-all duration-200
          ${isSelected 
            ? 'bg-gold text-dark' 
            : 'bg-beige-100 text-warm-gray group-hover:bg-gold-100'
          }
        `}>
          {isSelected ? (
            <Check className="w-5 h-5" />
          ) : (
            <Plus className={`w-5 h-5 transition-transform ${isHovered ? 'scale-110' : ''}`} />
          )}
        </div>
      </div>
    </motion.button>
  )
}

// Compact version for addons
export function AddonCard({ service, isSelected, onSelect, onDeselect }: ServiceCardProps) {
  const handleClick = () => {
    if (isSelected) {
      onDeselect()
    } else {
      onSelect()
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`
        w-full text-left p-3 rounded-lg border transition-all duration-200
        ${isSelected 
          ? 'border-gold bg-gold-50' 
          : 'border-beige-200 bg-white hover:border-gold-300'
        }
      `}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-dark text-sm truncate">
            {service.Name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            {service.Duration && (
              <span className="text-xs text-warm-gray flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {service.Duration}min
              </span>
            )}
            <span className="text-sm font-semibold text-gold-600">
              +${service.Price}
            </span>
          </div>
        </div>
        
        <div className={`
          w-6 h-6 rounded-full flex items-center justify-center
          ${isSelected ? 'bg-gold text-dark' : 'bg-beige-100 text-warm-gray'}
        `}>
          {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </div>
    </motion.button>
  )
}
