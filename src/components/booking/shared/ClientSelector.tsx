'use client'

import { User, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MindbodyClient } from '@/types/booking'

interface ClientSelectorProps {
  clients: MindbodyClient[]
  onSelect: (client: MindbodyClient) => void
  onCancel: () => void
}

export function ClientSelector({ clients, onSelect, onCancel }: ClientSelectorProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gold/20 to-gold/10 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dark">
              Selecciona tu perfil
            </h2>
            <button
              onClick={onCancel}
              className="text-warm-gray hover:text-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Description */}
          <div className="px-6 py-4 border-b border-beige-100">
            <p className="text-sm text-warm-gray">
              Encontramos varias cuentas asociadas a este contacto. 
              Por favor selecciona para quién deseas reservar:
            </p>
          </div>
          
          {/* Client List */}
          <div className="p-4 max-h-80 overflow-y-auto">
            <div className="space-y-3">
              {clients.map((client) => (
                <button
                  key={client.Id}
                  onClick={() => onSelect(client)}
                  className="w-full p-4 border border-beige-200 rounded-xl 
                           hover:border-gold hover:bg-gold/5 
                           transition-all duration-200 text-left
                           focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-gold/30 to-gold/10 
                                    rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-gold-600">
                        {client.FirstName?.[0]}{client.LastName?.[0]}
                      </span>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-dark truncate">
                        {client.FirstName} {client.LastName}
                      </p>
                      {client.Email && (
                        <p className="text-sm text-warm-gray truncate">
                          {client.Email}
                        </p>
                      )}
                      {client.MobilePhone && (
                        <p className="text-sm text-warm-gray">
                          {client.MobilePhone}
                        </p>
                      )}
                    </div>
                    
                    {/* Arrow */}
                    <div className="text-beige-300">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-beige-50 border-t border-beige-100">
            <button
              onClick={onCancel}
              className="w-full py-3 text-warm-gray hover:text-dark 
                       transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
