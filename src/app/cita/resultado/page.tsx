'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'

function ResultContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const message = searchParams.get('message')
  
  const isConfirmed = status === 'confirmada'
  const isCancelled = status === 'cancelada'
  const isError = status === 'error'
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/logo.png"
            alt="Mimosa Spa Retreat"
            width={180}
            height={60}
            className="mx-auto"
          />
        </div>
        
        {/* Status Icon */}
        <div className="mb-6">
          {isConfirmed && (
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {isCancelled && (
            <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          {isError && (
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isConfirmed && '¡Cita Confirmada!'}
          {isCancelled && 'Cita Cancelada'}
          {isError && 'Error'}
        </h1>
        
        {/* Message */}
        <p className="text-gray-600 mb-8">
          {isConfirmed && (
            <>
              Gracias por confirmar tu asistencia. 
              <br />
              <span className="text-sm">Te esperamos en Mimosa Spa Retreat.</span>
            </>
          )}
          {isCancelled && (
            <>
              Tu cita ha sido cancelada exitosamente.
              <br />
              <span className="text-sm">Esperamos verte pronto.</span>
            </>
          )}
          {isError && (
            <>
              {message || 'Ocurrió un error al procesar tu solicitud.'}
              <br />
              <span className="text-sm">Por favor contacta con nosotros.</span>
            </>
          )}
        </p>
        
        {/* Actions */}
        <div className="space-y-3">
          <a
            href="/"
            className="block w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
          >
            Ir al Inicio
          </a>
          
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '50760001234'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
          >
            💬 Contactar por WhatsApp
          </a>
          
          {isCancelled && (
            <a
              href="/es/reservar"
              className="block w-full py-3 px-4 border border-amber-500 text-amber-600 hover:bg-amber-50 font-medium rounded-lg transition-colors"
            >
              Reservar Nueva Cita
            </a>
          )}
        </div>
        
        {/* Footer */}
        <p className="mt-8 text-xs text-gray-400">
          Mimosa Spa Retreat • Costa del Este & San Francisco
        </p>
      </div>
    </div>
  )
}

export default function CitaResultadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  )
}
