'use client'

import { CardBox, Label } from '../shared'
import { LangProvider, LangToggle, useLang } from '../i18n'
import { EXPLAIN } from '../explain'

// ===========================================
// In-app data dictionary: every Mobile Manager label explained, in the
// user's language. Single source of truth: the EXPLAIN map that also
// powers the ⓘ icons on each data box.
// ===========================================

interface Term { k: string; es: string; en: string }
interface Section { es: string; en: string; terms: Term[] }

const SECTIONS: Section[] = [
  {
    es: 'Conceptos clave', en: 'Key concepts',
    terms: [
      { k: 'visita', es: 'Visita', en: 'Visit' },
      { k: 'tratamiento', es: 'Tratamiento', en: 'Treatment' },
      { k: 'neto', es: 'Neto · método de caja', en: 'Net · cash method' },
      { k: 'meta', es: 'Meta y comparaciones', en: 'Goal & comparisons' },
      { k: 'presupuesto', es: 'Presupuesto', en: 'Budget' },
      { k: 'primeras', es: 'Primeras visitas', en: 'First visits' },
      { k: 'noshows', es: 'No-shows + canc. tardías', en: 'No-shows + late cancels' },
    ],
  },
  {
    es: 'KPIs y Reporte de Ventas', en: 'KPIs & Sales Report',
    terms: [
      { k: 'ticket', es: 'Ticket promedio', en: 'Average ticket' },
      { k: 'visitas_tile', es: 'Visitas (tile)', en: 'Visits (tile)' },
      { k: 'retencion', es: 'Retención', en: 'Retention' },
      { k: 'prebooked', es: 'Ya reagendados', en: 'Pre-booked' },
      { k: 'adquisicion', es: 'Adquisición', en: 'Acquisition' },
      { k: 'mezcla', es: 'Mezcla de ingresos', en: 'Revenue mix' },
      { k: 'sucursal', es: 'Por sucursal', en: 'By location' },
      { k: 'top_servicios', es: 'Top servicios', en: 'Top services' },
      { k: 'top_clientes', es: 'Top clientes', en: 'Top clients' },
      { k: 'ventas_chart', es: 'Ventas · comparativo', en: 'Sales · comparative' },
      { k: 'ventas_dias', es: 'Filas por día', en: 'Day rows' },
    ],
  },
  {
    es: 'Staff', en: 'Staff',
    terms: [
      { k: 'top_terapeutas', es: 'Neto atribuido', en: 'Attributed net' },
      { k: 'equipo', es: 'Equipo', en: 'Team' },
      { k: 'staff_tabla', es: 'Tabla por terapeuta', en: 'Per-therapist table' },
      { k: 'podium', es: 'Destacadas', en: 'Highlights' },
    ],
  },
  {
    es: 'Agenda', en: 'Schedule',
    terms: [
      { k: 'agenda_hero', es: 'Citas del mes e ingreso esperado', en: 'Month appointments & expected income' },
      { k: 'agenda_grid', es: 'Calendario', en: 'Calendar grid' },
    ],
  },
  {
    es: 'Marketing', en: 'Marketing',
    terms: [
      { k: 'sesiones', es: 'Sesiones', en: 'Sessions' },
      { k: 'paginas', es: 'Vistas de página', en: 'Page views' },
      { k: 'reservas_online', es: 'Reservas online', en: 'Online bookings' },
      { k: 'conversion', es: 'Conversión del embudo', en: 'Funnel conversion' },
      { k: 'embudo', es: 'Embudo', en: 'Funnel' },
      { k: 'canales', es: 'Canales', en: 'Channels' },
      { k: 'top_paginas', es: 'Páginas más vistas', en: 'Top pages' },
      { k: 'online_share', es: 'Reservas online vs citas', en: 'Online share' },
    ],
  },
  {
    es: 'Negocio', en: 'Business',
    terms: [
      { k: 'ingresos_negocio', es: 'Ingresos', en: 'Revenue' },
      { k: 'gastos', es: 'Gastos', en: 'Expenses' },
      { k: 'margen', es: 'Margen operativo', en: 'Operating margin' },
      { k: 'ratios', es: 'Ratios vs industria', en: 'Ratios vs industry' },
      { k: 'categorias', es: 'Gastos por categoría', en: 'Expenses by category' },
      { k: 'propinas_negocio', es: 'Propinas · tarjeta', en: 'Tips · card' },
      { k: 'gc_flujo', es: 'Gift cards · flujo', en: 'Gift cards · flow' },
      { k: 'itbms_pos', es: 'Posición ITBMS', en: 'ITBMS position' },
      { k: 'comisiones', es: 'Comisiones bancarias', en: 'Bank commissions' },
      { k: 'saldos', es: 'Saldos bancarios', en: 'Bank balances' },
      { k: 'verificaciones', es: 'Verificaciones cruzadas', en: 'Cross-checks' },
      { k: 'importar', es: 'Importar archivos', en: 'Import files' },
    ],
  },
]

export function DiccionarioClient() {
  return (
    <LangProvider>
      <DiccionarioInner />
    </LangProvider>
  )
}

function DiccionarioInner() {
  const { lang } = useLang()
  return (
    <div className="max-w-xl">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-display font-semibold text-dark">
            {lang === 'es' ? 'Diccionario' : 'Data dictionary'}
          </h1>
          <LangToggle />
        </div>
        <p className="text-sm text-warm-gray mt-1">
          {lang === 'es'
            ? 'Qué significa cada dato del Mobile Manager · el ⓘ en cada tarjeta muestra esta misma explicación'
            : 'What every Mobile Manager number means · the ⓘ on each card shows this same explanation'}
        </p>
      </div>

      <div className="space-y-4">
        {SECTIONS.map(section => (
          <CardBox key={section.en}>
            <Label>{lang === 'es' ? section.es : section.en}</Label>
            <dl className="mt-2 divide-y divide-dashed divide-beige-300">
              {section.terms.map(term => (
                <div key={term.k} className="py-2">
                  <dt className="text-sm font-bold text-dark">{lang === 'es' ? term.es : term.en}</dt>
                  <dd className="text-xs text-warm-gray leading-snug mt-0.5">
                    {EXPLAIN[term.k]?.[lang]}
                  </dd>
                </div>
              ))}
            </dl>
          </CardBox>
        ))}
        <p className="text-center text-xs text-warm-gray pb-4">
          {lang === 'es'
            ? 'Resumen: una visita es un cliente-día, un tratamiento es una cita, los clientes se identifican por ID, el dinero es neto sin ITBMS en método de caja y toda comparación es contra las mismas fechas del año pasado.'
            : 'Summary: a visit is a client-day, a treatment is an appointment, clients are identified by ID, money is net of ITBMS on a cash basis, and every comparison is against the same dates last year.'}
        </p>
      </div>
    </div>
  )
}
