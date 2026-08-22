'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Info } from 'lucide-react'
import { useLang } from './i18n'

// ===========================================
// Single source of truth for metric explanations: powers the ⓘ info
// icons on every data box AND the in-app data dictionary page.
// ===========================================

export interface ExplainEntry { es: string; en: string }

export const EXPLAIN: Record<string, ExplainEntry> = {
  // core concepts
  visita: {
    es: 'Una visita = un ID de cliente con tratamientos CONTINUOS con UNA terapeuta en el día. Si el mismo ID atiende con 2+ terapeutas (pareja bajo una cuenta) o regresa con más de 1 h de separación, son visitas separadas. Cancelaciones y no-shows no cuentan.',
    en: 'A visit = one client ID with a CONTINUOUS block of treatments with ONE therapist that day. If the same ID is served by 2+ therapists (a couple under one account) or returns after a gap of over 1 h, those are separate visits. Cancellations and no-shows don\'t count.',
  },
  tratamiento: {
    es: 'Un tratamiento = una cita en el calendario (un servicio realizado). Una visita promedia ~1.5–2 tratamientos porque los paquetes agendan cada servicio por separado.',
    en: 'A treatment = one appointment on the schedule (one service performed). A visit averages ~1.5–2 treatments because packages book each service separately.',
  },
  neto: {
    es: 'Ventas sin ITBMS y sin propinas, en método de caja: dinero recibido en caja. La porción pagada con gift card o cortesía se excluye (ese dinero entró cuando se vendió la gift card). Cuadra al centavo con el reporte de pagos de Mindbody.',
    en: 'Sales excluding ITBMS and tips, on a cash basis: money received at the register. The portion paid with a gift card or cortesía is excluded (that money came in when the gift card was sold). Reconciles to the cent with Mindbody\'s payments report.',
  },
  meta: {
    es: 'La meta es el período completo del año pasado (p. ej. todo julio 2025). Los % siempre comparan las mismas fechas: 1–15 de julio vs 1–15 de julio, nunca un mes parcial contra uno completo.',
    en: 'The goal is last year\'s complete period (e.g. all of July 2025). The % deltas always compare the same dates: July 1–15 vs July 1–15, never a partial month vs a full one.',
  },
  presupuesto: {
    es: 'Presupuestos mensuales reales 2026 por sucursal ("Budget Mimosa 2026"). El marcador dorado indica dónde debería ir el mes a ritmo de presupuesto.',
    en: 'Real 2026 monthly budgets per location ("Budget Mimosa 2026"). The gold marker shows where the month should be at budget pace.',
  },
  ticket: {
    es: 'Ventas netas del período ÷ visitas (no tratamientos): cuánto gasta en promedio cada visita al spa. Sube con extras y venta en cabina; baja con descuentos.',
    en: 'Period net sales ÷ visits (not treatments): how much an average visit to the spa spends. Rises with add-ons and cabin sales; falls with discounts.',
  },
  visitas_tile: {
    es: 'Visitas del período: bloques continuos de tratamientos de un ID con una terapeuta. Un mismo ID con 2 terapeutas a la vez (pareja) o que regresa horas después cuenta visitas separadas. Debajo, los tratamientos: servicios realizados.',
    en: 'Period visits: continuous treatment blocks of one client ID with one therapist. The same ID with 2 therapists at once (a couple) or returning hours later counts as separate visits. Underneath, treatments: services performed.',
  },
  primeras: {
    es: 'Citas que Mindbody marca como la primera visita del cliente a Mimosa (cualquier sucursal). Es la base de adquisición y de las cohortes de retención.',
    en: 'Appointments Mindbody flags as the client\'s first-ever visit to Mimosa (any location). The base for acquisition and retention cohorts.',
  },
  noshows: {
    es: 'Citas marcadas No-Show o cancelación tardía. La tasa las divide entre las citas intentadas (tratamientos + perdidas). Las cancelaciones normales desaparecen de Mindbody y se eliminan de nuestros datos en minutos.',
    en: 'Appointments marked No-Show or Late-Cancelled. The rate divides them by attempted appointments (treatments + missed). Plain cancellations disappear from Mindbody and are removed from our data within minutes.',
  },
  retencion: {
    es: 'De los clientes nuevos de hace ~4 meses, el % que regresó dentro de 90 días de su primera visita. Referencia de la industria 35%, nuestra meta 50%.',
    en: 'Of the new clients from ~4 months ago, the % who returned within 90 days of their first visit. Industry reference 35%, our goal 50%.',
  },
  prebooked: {
    es: '% de los clientes del período que ya tienen su próxima cita agendada. Meta ≥50% — es la palanca más barata de retención.',
    en: '% of this period\'s clients who already have their next appointment booked. Goal ≥50% — the cheapest retention lever.',
  },
  adquisicion: {
    es: 'Primeras visitas por mes, este año (verde) vs el pasado (dorado). Mide cuántos clientes nuevos atrae el spa cada mes.',
    en: 'First visits per month, this year (green) vs last (gold). Measures how many new clients the spa attracts monthly.',
  },
  mezcla: {
    es: 'Servicios vs retail vs gift cards vendidas. Ojo: la venta de gift cards es dinero recibido pero se vuelve ingreso del negocio cuando se redime (ver Negocio).',
    en: 'Services vs retail vs gift cards sold. Note: a gift-card sale is money in, but it becomes business revenue when redeemed (see Negocio).',
  },
  sucursal: {
    es: 'Ventas netas del período por sucursal, con el % del total y (en Año) el avance del presupuesto de cada gerente.',
    en: 'Period net sales per location, with share of total and (on Year) each manager\'s budget progress.',
  },
  top_servicios: {
    es: 'Servicios con mayor neto del período, con su cantidad vendida. Útil para decidir qué promover o reforzar.',
    en: 'Services with the highest net this period, with units sold. Useful for deciding what to promote or reinforce.',
  },
  top_clientes: {
    es: 'Los clientes que más gastaron en el período (por ID de cliente, no por nombre). Visitas = sus sesiones de visita en el período.',
    en: 'The clients who spent the most this period (by client ID, not name). Visits = their visit sessions in the period.',
  },
  top_terapeutas: {
    es: 'Neto atribuido por la cita del mismo día del cliente. Si el cliente vio a varias terapeutas ese día, el ticket se reparte proporcional a los minutos de cada una.',
    en: 'Net attributed via the client\'s same-day appointment. If the client saw several therapists that day, the ticket splits proportionally to each one\'s minutes.',
  },
  // ventas
  ventas_chart: {
    es: 'Ventas netas por día (método de caja) comparadas con las mismas fechas del año pasado. Toca el gráfico para leer valores exactos.',
    en: 'Net sales by day (cash method) compared with the same dates last year. Tap the chart to read exact values.',
  },
  ventas_dias: {
    es: 'Cada fila es un día: visitas (sesiones de cliente) y neto del día, con el mismo día de 2025 debajo. Toca para ver las transacciones con nombre de cliente.',
    en: 'Each row is a day: visits (client sessions) and the day\'s net, with the same 2025 day underneath. Tap to see the transactions with client names.',
  },
  // staff
  equipo: {
    es: 'Totales del equipo en el período: horas trabajadas, visitas (clientes-día), tratamientos, neto atribuido, propinas, % solicitadas y venta en cabina.',
    en: 'Team totals for the period: hours worked, visits (client-days), treatments, attributed net, tips, requested % and cabin sales.',
  },
  staff_tabla: {
    es: 'Toca una fila para ver el detalle: visitas, promedio por tratamiento, primeras visitas, no-shows, propina %, ocupación, fidelidad y venta en cabina. Toca un encabezado para ordenar.',
    en: 'Tap a row for the detail: visits, average per treatment, first visits, no-shows, tip %, utilization, loyalty and cabin sales. Tap a header to sort.',
  },
  podium: {
    es: 'Reconocimientos del período (mínimo 10 tratamientos): la más solicitada por clientes, la mejor propina relativa a su neto, más horas trabajadas y la mejor venta en cabina.',
    en: 'Period highlights (minimum 10 treatments): most requested by clients, best tips relative to net, most hours worked, and top cabin sales.',
  },
  // agenda
  agenda_hero: {
    es: 'Citas del mes (tratamientos, igual que el calendario de Mindbody) comparadas con las mismas fechas del año pasado. El ingreso esperado estima el neto de las reservas restantes: $/minuto reciente × minutos reservados.',
    en: 'Appointments this month (treatments, same as the Mindbody calendar) compared with the same dates last year. Expected income estimates the net of remaining bookings: recent $/minute × booked minutes.',
  },
  agenda_grid: {
    es: 'Citas por día: más intenso = más citas; píldora verde = reservas futuras; el disco dorado es hoy. Toca un día para ver el horario por terapeuta con colores de estado.',
    en: 'Appointments per day: darker = more appointments; green pill = future bookings; the gold disc is today. Tap a day for the per-therapist schedule with status colors.',
  },
  // marketing
  sesiones: {
    es: 'Una sesión = un navegador visitando el sitio (no una persona: el mismo cliente en celular y laptop son 2 sesiones).',
    en: 'A session = one browser visiting the site (not a person: the same client on phone and laptop is 2 sessions).',
  },
  paginas: {
    es: 'Páginas vistas en el sitio público durante el período, con el promedio por sesión.',
    en: 'Pages viewed on the public site during the period, with the per-session average.',
  },
  reservas_online: {
    es: 'Reservas completadas en el sitio web. El % es sobre todas las sesiones del sitio (referencia industria: 2–5%).',
    en: 'Bookings completed on the website. The % is of all site sessions (industry reference: 2–5%).',
  },
  conversion: {
    es: 'De quienes abren el flujo de reserva, el % que llega a completarla. Referencia: 30–50%.',
    en: 'Of those who open the booking flow, the % who complete it. Reference: 30–50%.',
  },
  embudo: {
    es: 'Sesiones únicas que llegan a cada paso de la reserva. El % de cada barra es respecto al paso anterior — ahí se ve exactamente dónde se pierde la gente.',
    en: 'Unique sessions reaching each booking step. Each bar\'s % is vs the previous step — it shows exactly where people drop off.',
  },
  canales: {
    es: 'De dónde vienen las sesiones: el UTM del enlace (instagram, whatsapp…) o el sitio de origen; "directo" = escribió la URL o desconocido. Enlaces sin UTM cuentan como directo.',
    en: 'Where sessions come from: the link\'s UTM tag (instagram, whatsapp…) or the referring site; "direct" = typed the URL or unknown. Links without a UTM count as direct.',
  },
  top_paginas: {
    es: 'Las páginas más vistas del sitio en el período (idiomas combinados).',
    en: 'The most-viewed site pages this period (languages combined).',
  },
  online_share: {
    es: 'Reservas online completadas comparadas con las citas del período — qué parte de la agenda ya llega por el sitio web.',
    en: 'Completed online bookings vs the period\'s appointments — how much of the schedule already arrives via the website.',
  },
  vistas_dia: {
    es: 'Vistas de página por día del período. Sirve para ver el efecto de publicaciones y campañas.',
    en: 'Page views per day for the period. Useful to see the effect of posts and campaigns.',
  },
  // negocio
  ingresos_negocio: {
    es: 'Ingreso del cierre de caja de Mindbody, sin ITBMS. Las gift cards vendidas NO son ingreso aquí: son dinero que debemos en servicios (pasivo) y se vuelven ingreso al redimirse.',
    en: 'Revenue from the Mindbody register closeout, net of ITBMS. Gift cards sold are NOT revenue here: they\'re money we owe in services (a liability) and become revenue when redeemed.',
  },
  gastos: {
    es: 'Débitos bancarios clasificados por regla + gastos pagados por los socios. Se excluyen movimientos internos: transferencias entre cuentas propias, pagos a la Visa, reembolsos a socios, depósitos en garantía y el pago de propinas de tarjeta.',
    en: 'Bank debits classified by rule + partner-paid expenses. Internal movements are excluded: transfers between our own accounts, Visa payments, partner reimbursements, security deposits and card-tip payouts.',
  },
  margen: {
    es: '(Ingresos − gastos) ÷ ingresos del mes. Referencia de la industria de spas: 8–15%.',
    en: '(Revenue − expenses) ÷ revenue for the month. Spa industry reference: 8–15%.',
  },
  ratios: {
    es: 'Las bandas verdes son referencias de la industria de spas/salones; el marcador es el mes de Mimosa. Planilla+CSS 40–60%, alquiler 8–15%, insumos 8–12%, margen 8–15%.',
    en: 'Green bands are spa/salon industry references; the marker is Mimosa\'s month. Payroll+CSS 40–60%, rent 8–15%, supplies 8–12%, margin 8–15%.',
  },
  categorias: {
    es: 'Gastos por categoría según reglas de clasificación (con las notas de propósito del ACH). "Sin clasificar" queda visible a propósito para revisarlo — nada se esconde.',
    en: 'Expenses by category via classification rules (enriched with ACH purpose notes). "Unclassified" stays visible on purpose so it gets reviewed — nothing is hidden.',
  },
  propinas_negocio: {
    es: 'Propinas cobradas con tarjeta según la liquidación de St. Georges. No son ingreso del negocio: se pagan a las terapeutas. Las propinas en efectivo no pasan por ningún sistema.',
    en: 'Tips collected by card per the St. Georges settlement. Not business revenue: they\'re paid out to therapists. Cash tips never enter any system.',
  },
  gc_flujo: {
    es: 'Gift cards vendidas menos redimidas en el mes. Positivo = crece el pasivo (dinero adelantado); negativo = se está redimiendo más de lo que se vende.',
    en: 'Gift cards sold minus redeemed this month. Positive = the liability grows (money in advance); negative = redemptions outpace sales.',
  },
  itbms_pos: {
    es: 'ITBMS cobrado en ventas − retenido por St. Georges en ventas con tarjeta − crédito de compras = lo que aún se debe a la DGI.',
    en: 'ITBMS collected on sales − withheld by St. Georges on card sales − purchase credit = what\'s still owed to DGI.',
  },
  comisiones: {
    es: 'Comisiones bancarias del mes (tarjetas, Yappy, Clave) y su % sobre las ventas con tarjeta.',
    en: 'Bank commissions for the month (cards, Yappy, Clave) and their % of card sales.',
  },
  saldos: {
    es: 'Saldo de cada cuenta al último movimiento del mes, según los estados de cuenta importados.',
    en: 'Each account\'s balance at the month\'s last movement, from the imported statements.',
  },
  verificaciones: {
    es: 'Cruces automáticos entre fuentes independientes (cierre vs API de Mindbody, gift cards vs tender Misc, liquidación vs ventas con tarjeta…). Un ⚠ significa que dos documentos no cuadran — investigar antes de confiar en el mes.',
    en: 'Automatic cross-checks between independent sources (closeout vs Mindbody API, gift cards vs Misc tender, settlement vs card sales…). A ⚠ means two documents disagree — investigate before trusting the month.',
  },
  importar: {
    es: 'Arrastra todos los archivos del paquete contable a la vez. El tipo se detecta por el contenido (el nombre puede cambiar); duplicados se omiten y re-subir un reporte reemplaza al anterior.',
    en: 'Drag the whole accounting packet at once. Type is detected from content (names can change); duplicates are skipped and re-uploading a report replaces the previous one.',
  },
}

/** Book icon in every Mobile Manager header → the in-app data dictionary. */
export function DictionaryLink() {
  const { lang } = useLang()
  return (
    <Link
      href="/admin/kpis/diccionario"
      aria-label={lang === 'es' ? 'Diccionario de datos' : 'Data dictionary'}
      title={lang === 'es' ? 'Diccionario de datos' : 'Data dictionary'}
      className="p-1.5 rounded-full border border-beige-400 bg-white text-warm-gray-500 hover:text-dark hover:bg-beige transition-colors"
    >
      <BookOpen className="h-4 w-4" />
    </Link>
  )
}

/** Plain explanation paragraph (used inside expanded stat tiles + the dictionary). */
export function ExplainText({ k, className = '' }: { k: string; className?: string }) {
  const { lang } = useLang()
  const entry = EXPLAIN[k]
  if (!entry) return null
  return (
    <p className={`text-[10px] leading-snug text-dark bg-beige-100 rounded-lg px-2.5 py-1.5 ${className}`}>
      {entry[lang]}
    </p>
  )
}

/** ⓘ toggle that reveals the explanation for a metric, right inside the card. */
export function InfoTip({ k }: { k: string }) {
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const entry = EXPLAIN[k]
  if (!entry) return null
  return (
    <>
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
        aria-expanded={open}
        aria-label="Info"
        className="inline-flex align-middle ml-1.5 text-warm-gray-500/70 hover:text-dark"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {open && (
        <span className="block text-[10px] font-normal normal-case tracking-normal leading-snug text-dark bg-beige-100 rounded-lg px-2.5 py-1.5 mt-1.5">
          {entry[lang]}
        </span>
      )}
    </>
  )
}
