'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

// ===========================================
// Lightweight EN/ES toggle for the Mobile Manager section.
// Spanish literals are the keys; missing entries fall back to Spanish,
// so an untranslated string can never render blank. Default: English.
// ===========================================

export type Lang = 'en' | 'es'

const STORAGE_KEY = 'mm_lang'

const EN: Record<string, string> = {
  // shared
  'sin dato': 'no data',
  'Cargando': 'Loading',
  'Toca el gráfico para ver valores': 'Tap the chart to see values',
  'Día': 'Day',
  'Ene': 'Jan', 'Feb': 'Feb', 'Mar': 'Mar', 'Abr': 'Apr', 'May': 'May', 'Jun': 'Jun',
  'Jul': 'Jul', 'Ago': 'Aug', 'Sep': 'Sep', 'Oct': 'Oct', 'Nov': 'Nov', 'Dic': 'Dec',
  // filters
  'Ayer': 'Yesterday', 'Mes': 'Month', 'Mes pasado': 'Last month', 'Año': 'Year',
  'Este mes': 'This month', 'Este año': 'This year', 'Rango': 'Range',
  'Todas': 'All', 'Uso de gift cards': 'Gift card usage',
  // dashboard
  'Ventas netas sin ITBMS, método de caja · comparado con las mismas fechas del año pasado':
    'Net sales excl. ITBMS, cash method · compared to the same dates last year',
  'Solo días completos — datos hasta el': 'Complete days only — data through',
  'Actualizar': 'Refresh', 'Sincronizando…': 'Syncing…',
  'No se pudo cargar': 'Could not load',
  'La sincronización falló': 'Sync failed',
  'Ventas netas · sin ITBMS': 'Net sales · excl. ITBMS',
  'Gift cards redimidas · neto sin ITBMS': 'Gift cards redeemed · net excl. ITBMS',
  'en las mismas fechas de': 'on the same dates of',
  'sin datos de': 'no data from',
  'para comparar': 'to compare against',
  'Meta —': 'Goal —',
  'completo': 'full',
  'usos': 'redemptions',
  'promedio': 'avg',
  'por uso': 'per redemption',
  'por día': 'by day', 'por mes': 'by month',
  'Ticket promedio': 'Average ticket',
  'Visitas': 'Visits',
  'Primeras visitas': 'First visits',
  'No-shows + canc. tardías': 'No-shows + late cancels',
  'Por mes': 'By month',
  'Retención · clientes nuevos': 'Retention · new clients',
  'De': 'Of', 'clientes nuevos': 'new clients', 'en': 'in',
  'regresaron': 'returned', 'dentro de 90 días.': 'within 90 days.',
  'regresaron dentro de': 'returned within',
  '90 días · cohorte de': '90 days · cohort of',
  'mismo cohorte de': 'same cohort of',
  'de': 'of',
  'sin cohorte comparable en': 'no comparable cohort in',
  'Industria 35%': 'Industry 35%', 'Meta 50%': 'Goal 50%', 'Meta ≥50%': 'Goal ≥50%',
  'Aún no hay datos del cohorte.': 'No cohort data yet.',
  'Ya reagendados': 'Pre-booked',
  'clientes del período': 'clients this period',
  'ya tienen su próxima cita': 'already have their next appointment',
  'Adquisición · primeras visitas por mes': 'Acquisition · first visits by month',
  'Mezcla de ingresos': 'Revenue mix',
  'Servicios': 'Services', 'Retail': 'Retail', 'Gift cards': 'Gift cards',
  'Sin ventas en el período.': 'No sales in this period.',
  'Por sucursal': 'By location',
  'Top servicios · neto del período': 'Top services · period net',
  'Top servicios pagados con gift card': 'Top services paid with gift card',
  'Sin servicios en el período.': 'No services in this period.',
  'Ver top 25': 'Show top 25', 'Ver top 10': 'Show top 10', 'Ver top 5': 'Show top 5',
  'Top clientes · neto del período': 'Top clients · period net',
  'Top clientes · gift cards redimidas': 'Top clients · gift cards redeemed',
  'Sin clientes en el período.': 'No clients in this period.',
  'Cliente': 'Client', 'Neto': 'Net',
  'Top 10 terapeutas · neto atribuido': 'Top 10 therapists · attributed net',
  'Terapeuta': 'Therapist', 'Horas': 'Hours',
  'Sin visitas en el período.': 'No visits in this period.',
  'visitas': 'visits', 'ventas': 'sales',
  'Resto del equipo': 'Rest of the team', 'Sin asignar': 'Unassigned',
  'Sin cita asociada': 'No linked appointment',
  'Ingreso de servicios atribuido a la terapeuta de la cita del mismo día del cliente.':
    "Service revenue attributed to the therapist of the client's same-day appointment.",
  '“Resto del equipo” incluye a las demás terapeutas y ventas sin cita asociada.':
    '“Rest of the team” includes the remaining therapists and sales without a linked appointment.',
  'comparado con': 'compared to',
  'vs': 'vs',
  // sales report
  'Reporte de Ventas': 'Sales Report',
  'Ventas netas por día, sin ITBMS ni propinas · comparado con el año pasado':
    'Net sales by day, excl. ITBMS and tips · compared to last year',
  'Ventas netas · comparativo': 'Net sales · comparative',
  'Gift cards redimidas · comparativo': 'Gift cards redeemed · comparative',
  'en las mismas fechas': 'on the same dates',
  'mes completo': 'full month',
  'Total del período': 'Period total',
  'mismas fechas': 'same dates',
  'Sin transacciones este día.': 'No transactions this day.',
  'No se pudieron cargar las transacciones.': 'Could not load the transactions.',
  'Sin cliente': 'No client',
  'propina': 'tip',
  'pagado con gift card': 'paid with gift card',
  'Porción de ventas pagada con gift cards · neto sin ITBMS ni propinas':
    'Portion of sales paid with gift cards · net excl. ITBMS and tips',
  'Método de caja: dinero recibido, porción pagada con gift card excluida · neto sin ITBMS ni propinas':
    'Cash method: money received, gift-card-paid portion excluded · net excl. ITBMS and tips',
  'hoy se actualiza al entrar y cada 5 min': 'today refreshes on entry and every 5 min',
  // range calendar
  'Mes anterior': 'Previous month', 'Mes siguiente': 'Next month',
  'Cancelar': 'Cancel', 'Aplicar': 'Apply',
  'Desde': 'From', 'elige la fecha final': 'pick the end date',
  'Del': 'From', 'al': 'to',
  // agenda
  'Agenda': 'Schedule',
  'Toca un día para ver el horario por terapeuta': 'Tap a day to see the schedule by therapist',
  'Sucursal': 'Location', 'Período': 'Period',
  'Citas del mes': 'Appointments this month',
  'citas en las mismas fechas de': 'appointments on the same dates of',
  'reservas futuras este mes': 'future bookings this month',
  'más intenso = más citas': 'darker = more appointments',
  'verde': 'green', '= reservas futuras': '= future bookings',
  'Reservas futuras sincronizadas ~60 días adelante': 'Future bookings synced ~60 days ahead',
  'Hoy se actualiza al entrar y cada 5 min mientras la página esté abierta · reservas futuras ~60 días adelante':
    'Today refreshes on entry and every 5 min while the page is open · future bookings ~60 days ahead',
  'citas': 'appointments',
  'no-shows': 'no-shows',
  'reservas': 'bookings',
  'canceladas': 'cancelled',
  'Sin citas este día.': 'No appointments this day.',
  'No se pudo cargar el día.': 'Could not load the day.',
  'sin llegar': 'not arrived', 'llegó': 'arrived', 'completada': 'completed',
}

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'es' || saved === 'en') setLangState(saved)
    } catch { /* default stays en */ }
  }, [])
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try { localStorage.setItem(STORAGE_KEY, l) } catch { /* non-fatal */ }
  }, [])
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>
}

export function useLang() {
  return useContext(LangCtx)
}

/** t('texto en español') → English (or the Spanish original when lang = es / unmapped). */
export function useT() {
  const { lang } = useLang()
  return useCallback((es: string) => (lang === 'es' ? es : EN[es] ?? es), [lang])
}

export function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex rounded-full border border-beige-400 bg-white overflow-hidden text-xs font-bold" role="group" aria-label="Language">
      {(['en', 'es'] as const).map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-2.5 py-1 transition-colors ${lang === l ? 'bg-dark text-cream' : 'text-warm-gray hover:bg-beige'}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

// ---------- dates ----------

export const MONTHS_LONG: Record<Lang, string[]> = {
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
}

export const WEEKDAYS_SHORT: Record<Lang, string[]> = {
  es: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
}

/** Monday-first single letters for calendar grids. */
export const WEEKDAY_LETTERS: Record<Lang, string[]> = {
  es: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
  en: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
}

/** "2026-07-06" → "lun 6 julio 2026" / "Mon 6 July 2026" (Panama has no DST). */
export function formatDateLang(date: string, lang: Lang): string {
  const d = new Date(`${date}T00:00:00Z`)
  return `${WEEKDAYS_SHORT[lang][d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS_LONG[lang][d.getUTCMonth()]} ${d.getUTCFullYear()}`
}
