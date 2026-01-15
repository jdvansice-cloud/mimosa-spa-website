'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Calendar,
  Clock,
  ShoppingBag,
  User,
  LogOut,
  History,
  CalendarCheck,
  ArrowRight,
  Loader2,
  MapPin,
  RefreshCw,
  Settings
} from 'lucide-react'
import { usePortalStore, usePortalData } from '@/lib/portal/store'
import { PANAMA_TIMEZONE } from '@/lib/booking/constants'

// Format date for display
function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-PA', {
    timeZone: PANAMA_TIMEZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('es-PA', {
    timeZone: PANAMA_TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export default function PortalPage() {
  const router = useRouter()
  const {
    isAuthenticated,
    client,
    visits,
    purchases,
    upcomingAppointments,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    logout
  } = usePortalStore()
  const { fetchAllData } = usePortalData()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/portal/login')
    }
  }, [isAuthenticated, router])

  // Fetch data on mount
  useEffect(() => {
    if (isAuthenticated && client) {
      fetchAllData()
    }
  }, [isAuthenticated, client])

  const handleLogout = () => {
    logout()
    router.push('/portal/login')
  }

  if (!isAuthenticated || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-beige-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo.png"
              alt="Mimosa Spa Retreat"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
            <span className="hidden sm:block text-warm-gray">|</span>
            <span className="hidden sm:block text-dark font-medium">Mi Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-dark">
                {client.FirstName} {client.LastName}
              </p>
              <p className="text-xs text-warm-gray">
                {client.Email || client.MobilePhone}
              </p>
            </div>
            <button
              onClick={() => router.push('/portal/profile')}
              className="p-2 text-warm-gray hover:text-gold transition-colors"
              title="Editar perfil"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-warm-gray hover:text-red-500 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dark mb-2">
            Hola, {client.FirstName}
          </h1>
          <p className="text-warm-gray">
            Bienvenido a tu portal personal de Mimosa Spa Retreat
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <a
            href="/es/reservar"
            className="p-4 bg-gradient-to-br from-gold to-gold/80 rounded-xl
                     text-dark hover:shadow-lg transition-all flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">Reservar Cita</p>
              <p className="text-sm text-dark/70">Agenda un nuevo tratamiento</p>
            </div>
          </a>

          <button
            onClick={() => setActiveTab('upcoming')}
            className="p-4 bg-white border border-beige-200 rounded-xl
                     hover:border-gold hover:shadow-md transition-all flex items-center gap-3 text-left"
          >
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
              <CalendarCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-dark">Próximas Citas</p>
              <p className="text-sm text-warm-gray">
                {upcomingAppointments.length} cita{upcomingAppointments.length !== 1 ? 's' : ''} programada{upcomingAppointments.length !== 1 ? 's' : ''}
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className="p-4 bg-white border border-beige-200 rounded-xl
                     hover:border-gold hover:shadow-md transition-all flex items-center gap-3 text-left"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <History className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-dark">Historial</p>
              <p className="text-sm text-warm-gray">
                {visits.length} visita{visits.length !== 1 ? 's' : ''} registrada{visits.length !== 1 ? 's' : ''}
              </p>
            </div>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: 'Resumen', icon: User },
            { id: 'upcoming', label: 'Próximas Citas', icon: CalendarCheck },
            { id: 'history', label: 'Historial', icon: History },
            { id: 'purchases', label: 'Compras', icon: ShoppingBag },
            { id: 'profile', label: 'Mi Perfil', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                if (id === 'profile') {
                  router.push('/portal/profile')
                } else {
                  setActiveTab(id as typeof activeTab)
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap
                       transition-all ${
                         activeTab === id
                           ? 'bg-gold text-dark font-medium'
                           : 'bg-white border border-beige-200 text-warm-gray hover:border-gold'
                       }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}

          {/* Refresh Button */}
          <button
            onClick={fetchAllData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-full
                     bg-white border border-beige-200 text-warm-gray hover:border-gold
                     disabled:opacity-50 transition-all ml-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        )}

        {/* Tab Content */}
        {!isLoading && (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Upcoming Appointments Preview */}
                <div className="bg-white rounded-xl border border-beige-200 overflow-hidden">
                  <div className="p-4 border-b border-beige-200 flex items-center justify-between">
                    <h2 className="font-semibold text-dark flex items-center gap-2">
                      <CalendarCheck className="w-5 h-5 text-gold" />
                      Próximas Citas
                    </h2>
                    <button
                      onClick={() => setActiveTab('upcoming')}
                      className="text-sm text-gold hover:text-gold/80 flex items-center gap-1"
                    >
                      Ver todas <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    {upcomingAppointments.length === 0 ? (
                      <p className="text-warm-gray text-center py-4">
                        No tienes citas programadas
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {upcomingAppointments.slice(0, 3).map((apt) => (
                          <div
                            key={apt.AppointmentId}
                            className="flex items-center justify-between p-3 bg-beige-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-dark">{apt.Name}</p>
                              <p className="text-sm text-warm-gray flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(apt.StartDateTime)} - {formatTime(apt.StartDateTime)}
                              </p>
                            </div>
                            <div className="text-right">
                              {apt.Staff && (
                                <p className="text-sm text-dark">
                                  {apt.Staff.DisplayName || `${apt.Staff.FirstName} ${apt.Staff.LastName}`}
                                </p>
                              )}
                              {apt.Location && (
                                <p className="text-xs text-warm-gray flex items-center gap-1 justify-end">
                                  <MapPin className="w-3 h-3" />
                                  {apt.Location.Name}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Visits Preview */}
                <div className="bg-white rounded-xl border border-beige-200 overflow-hidden">
                  <div className="p-4 border-b border-beige-200 flex items-center justify-between">
                    <h2 className="font-semibold text-dark flex items-center gap-2">
                      <History className="w-5 h-5 text-gold" />
                      Visitas Recientes
                    </h2>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="text-sm text-gold hover:text-gold/80 flex items-center gap-1"
                    >
                      Ver todas <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    {visits.length === 0 ? (
                      <p className="text-warm-gray text-center py-4">
                        No hay visitas registradas
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {visits.slice(0, 3).map((visit) => (
                          <div
                            key={visit.AppointmentId}
                            className="flex items-center justify-between p-3 bg-beige-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-dark">{visit.Name}</p>
                              <p className="text-sm text-warm-gray">
                                {formatDate(visit.StartDateTime)}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${visit.SignedIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {visit.SignedIn ? 'Completada' : 'Pendiente'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Appointments Tab */}
            {activeTab === 'upcoming' && (
              <div className="bg-white rounded-xl border border-beige-200 overflow-hidden">
                <div className="p-4 border-b border-beige-200">
                  <h2 className="font-semibold text-dark">Próximas Citas</h2>
                </div>
                <div className="divide-y divide-beige-200">
                  {upcomingAppointments.length === 0 ? (
                    <div className="p-8 text-center">
                      <CalendarCheck className="w-12 h-12 text-beige-300 mx-auto mb-4" />
                      <p className="text-warm-gray mb-4">No tienes citas programadas</p>
                      <a
                        href="/es/reservar"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-dark
                                 font-medium rounded-lg hover:bg-gold/90 transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        Reservar una cita
                      </a>
                    </div>
                  ) : (
                    upcomingAppointments.map((apt) => (
                      <div key={apt.AppointmentId} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-dark text-lg">{apt.Name}</p>
                            <div className="mt-2 space-y-1">
                              <p className="text-warm-gray flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gold" />
                                {formatDate(apt.StartDateTime)}
                              </p>
                              <p className="text-warm-gray flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gold" />
                                {formatTime(apt.StartDateTime)} - {formatTime(apt.EndDateTime)}
                              </p>
                              {apt.Staff && (
                                <p className="text-warm-gray flex items-center gap-2">
                                  <User className="w-4 h-4 text-gold" />
                                  {apt.Staff.DisplayName || `${apt.Staff.FirstName} ${apt.Staff.LastName}`}
                                </p>
                              )}
                              {apt.Location && (
                                <p className="text-warm-gray flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-gold" />
                                  {apt.Location.Name}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            Confirmada
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-xl border border-beige-200 overflow-hidden">
                <div className="p-4 border-b border-beige-200">
                  <h2 className="font-semibold text-dark">Historial de Visitas</h2>
                </div>
                <div className="divide-y divide-beige-200">
                  {visits.length === 0 ? (
                    <div className="p-8 text-center">
                      <History className="w-12 h-12 text-beige-300 mx-auto mb-4" />
                      <p className="text-warm-gray">No hay visitas registradas</p>
                    </div>
                  ) : (
                    visits.map((visit) => (
                      <div key={visit.AppointmentId} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-dark">{visit.Name}</p>
                            <div className="mt-1 space-y-1">
                              <p className="text-sm text-warm-gray">
                                {formatDate(visit.StartDateTime)} - {formatTime(visit.StartDateTime)}
                              </p>
                              {visit.Staff && (
                                <p className="text-sm text-warm-gray">
                                  Terapeuta: {visit.Staff.DisplayName || `${visit.Staff.FirstName} ${visit.Staff.LastName}`}
                                </p>
                              )}
                              {visit.Location && (
                                <p className="text-sm text-warm-gray">
                                  {visit.Location.Name}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${visit.SignedIn ? 'bg-green-100 text-green-700' :
                              visit.LateCancelled ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-600'}`}>
                            {visit.SignedIn ? 'Completada' :
                             visit.LateCancelled ? 'Cancelada' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Purchases Tab */}
            {activeTab === 'purchases' && (
              <div className="bg-white rounded-xl border border-beige-200 overflow-hidden">
                <div className="p-4 border-b border-beige-200">
                  <h2 className="font-semibold text-dark">Historial de Compras</h2>
                </div>
                <div className="divide-y divide-beige-200">
                  {purchases.length === 0 ? (
                    <div className="p-8 text-center">
                      <ShoppingBag className="w-12 h-12 text-beige-300 mx-auto mb-4" />
                      <p className="text-warm-gray">No hay compras registradas</p>
                    </div>
                  ) : (
                    purchases.map((purchase) => (
                      <div key={purchase.Id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-dark">{purchase.Description}</p>
                            <p className="text-sm text-warm-gray mt-1">
                              {formatDate(purchase.Sale.SaleDateTime)}
                            </p>
                            {purchase.Quantity > 1 && (
                              <p className="text-sm text-warm-gray">
                                Cantidad: {purchase.Quantity}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-dark">
                              ${purchase.Price.toFixed(2)}
                            </p>
                            {purchase.Discount > 0 && (
                              <p className="text-sm text-green-600">
                                -${purchase.Discount.toFixed(2)} descuento
                              </p>
                            )}
                            <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium
                              ${purchase.Returned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {purchase.Returned ? 'Devuelto' : 'Pagado'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-beige-200 mt-auto py-6 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-warm-gray">
          <p>Mimosa Spa Retreat - Tu bienestar, nuestra prioridad</p>
          <div className="mt-2 space-x-4">
            <a href="/es" className="hover:text-dark transition-colors">Inicio</a>
            <a href="/es/reservar" className="hover:text-dark transition-colors">Reservar</a>
            <a href="/es/menu" className="hover:text-dark transition-colors">Servicios</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
