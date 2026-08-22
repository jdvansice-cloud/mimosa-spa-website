import Link from 'next/link'
import {
  AlertTriangle, ArrowRight, BarChart3, CalendarDays, Gift, Plus, Receipt,
  ShoppingBag, Sparkles, Users,
} from 'lucide-react'
import { getDashboardData } from '@/lib/admin/dashboard'

export const dynamic = 'force-dynamic'

const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

/** "2026-08-17" → "17 de agosto" (Panama has no DST, so a UTC parse is safe). */
function formatDayEs(date: string): string {
  const d = new Date(`${date}T00:00:00Z`)
  return `${d.getUTCDate()} de ${MONTHS_ES[d.getUTCMonth()]}`
}

function money(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

function money2(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function deltaPct(cur: number, ly: number): number | null {
  if (!ly) return null
  return (cur - ly) / ly
}

function DeltaChip({ delta }: { delta: number | null }) {
  if (delta === null) {
    return (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-beige-200 text-warm-gray-600">
        sin dato
      </span>
    )
  }
  const up = delta >= 0
  return (
    <span
      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
        up ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
      }`}
    >
      {up ? '+' : ''}{Math.round(delta * 100)}% vs año pasado
    </span>
  )
}

function Stat({ label, value, sub, delta }: {
  label: string
  value: string
  sub?: string
  delta: number | null
}) {
  return (
    <div className="bg-white border border-beige-400 rounded-2xl p-4">
      <p className="text-[11px] font-bold tracking-widest uppercase text-warm-gray-500">{label}</p>
      <p className="text-2xl font-bold text-dark tabular-nums mt-1">{value}</p>
      {sub && <p className="text-[11px] text-warm-gray-500 tabular-nums">{sub}</p>}
      <div className="mt-2"><DeltaChip delta={delta} /></div>
    </div>
  )
}

const QUICK_LINKS = [
  { href: '/admin/kpis/agenda', label: 'Agenda de hoy', icon: CalendarDays },
  { href: '/admin/giftcards/issue', label: 'Emitir Gift Card', icon: Plus },
  { href: '/admin/kpis/ventas', label: 'Reporte de Ventas', icon: Receipt },
  { href: '/admin/kpis', label: 'KPIs completos', icon: BarChart3 },
  { href: '/admin/tratamientos', label: 'Tratamientos', icon: Sparkles },
  { href: '/admin/promociones', label: 'Promociones', icon: Gift },
]

export default async function AdminDashboard() {
  // Only full admins reach this page — middleware.ts redirects mobile managers
  // to /admin/kpis and location-restricted staff to /admin/giftcards/issue.
  const { kpis, kpisError, attention } = await getDashboardData()

  const alerts = [
    attention.ordersNeedingAttention > 0 && {
      href: '/admin/pedidos',
      icon: ShoppingBag,
      label: attention.ordersNeedingAttention === 1
        ? '1 pedido requiere atención'
        : `${attention.ordersNeedingAttention} pedidos requieren atención`,
      detail: 'Pagos fallidos o pedidos que cobraron y no completaron.',
    },
    attention.giftCardsPending > 0 && {
      href: '/admin/giftcards/issued?status=emitida',
      icon: Gift,
      label: attention.giftCardsPending === 1
        ? '1 Gift Card emitida sin registrar en Mindbody'
        : `${attention.giftCardsPending} Gift Cards emitidas sin registrar en Mindbody`,
      detail: 'El serial se generó aquí, pero Mindbody todavía no reporta la venta.',
    },
  ].filter(Boolean) as Array<{
    href: string; icon: React.ComponentType<{ className?: string }>; label: string; detail: string
  }>

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-semibold text-dark">Dashboard</h1>
        {kpis ? (
          <p className="text-warm-gray-500 mt-1">
            Mes a la fecha · días completos hasta el {formatDayEs(kpis.asOf)}.
            {' '}Ventas netas sin ITBMS, comparadas con las mismas fechas del año pasado.
          </p>
        ) : (
          <p className="text-warm-gray-500 mt-1">Panel de administración</p>
        )}
      </div>

      {/* Needs attention — only rendered when something actually does. */}
      {alerts.length > 0 && (
        <section className="mb-6" aria-labelledby="atencion">
          <h2 id="atencion" className="sr-only">Requiere atención</h2>
          <ul className="space-y-2">
            {alerts.map(({ href, icon: Icon, label, detail }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 hover:border-amber-400 transition-colors group"
                >
                  <span className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-dark">{label}</span>
                    <span className="block text-sm text-warm-gray-500">{detail}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 text-amber-700 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Month-to-date performance */}
      {kpisError ? (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          No se pudieron cargar los KPIs: {kpisError}
        </div>
      ) : kpis ? (
        <section className="mb-8" aria-labelledby="mes">
          <h2 id="mes" className="text-sm font-bold tracking-widest uppercase text-warm-gray-500 mb-3">
            Mes a la fecha
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat
              label="Ventas netas"
              value={money(kpis.sales.net)}
              sub={`${kpis.sales.saleCount.toLocaleString('en-US')} ventas`}
              delta={deltaPct(kpis.sales.net, kpis.sales.lyNet)}
            />
            <Stat
              label="Visitas"
              value={kpis.visits.count.toLocaleString('en-US')}
              sub={`${kpis.treatments.count.toLocaleString('en-US')} tratamientos`}
              delta={deltaPct(kpis.visits.count, kpis.visits.lyCount)}
            />
            <Stat
              label="Ticket promedio"
              value={money2(kpis.sales.avgTicket)}
              delta={deltaPct(kpis.sales.avgTicket, kpis.sales.lyAvgTicket)}
            />
            <Stat
              label="Clientes nuevos"
              value={kpis.newClients.count.toLocaleString('en-US')}
              delta={deltaPct(kpis.newClients.count, kpis.newClients.lyCount)}
            />
          </div>
          <Link
            href="/admin/kpis"
            className="inline-flex items-center gap-1 min-h-[44px] text-sm font-medium text-gold-700 hover:underline mt-2"
          >
            Ver KPIs completos <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      ) : null}

      {/* Quick links */}
      <section aria-labelledby="accesos">
        <h2 id="accesos" className="text-sm font-bold tracking-widest uppercase text-warm-gray-500 mb-3">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 p-4 rounded-xl bg-white border border-beige-400 hover:border-gold transition-colors group"
            >
              <span className="p-2 rounded-lg bg-gold/10 text-gold-700 shrink-0">
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-medium text-dark flex-1">{label}</span>
              <ArrowRight className="h-4 w-4 text-warm-gray-500 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {kpis?.updatedAt && (
        <p className="mt-6 text-xs text-warm-gray-500">
          Datos sincronizados desde Mindbody: {new Date(kpis.updatedAt).toLocaleString('es-PA')}
        </p>
      )}
    </div>
  )
}
