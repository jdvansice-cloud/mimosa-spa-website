'use client'

import { useCallback, useEffect, useState } from 'react'
import type { MarketingPayload } from '@/lib/kpis/marketing'
import type { KpiPeriod } from '@/lib/kpis/queries'
import { CardBox, Label, LoadingCard, DualLine, pct } from '../shared'
import { LangProvider, LangToggle, formatDateLang, useLang, useT } from '../i18n'
import { DictionaryLink } from '../explain'
import { prefetchStaffKpis } from '../prefetch'

// ===========================================
// Marketing — first-party web analytics: traffic, acquisition channels
// and the online booking funnel. Live data (includes today).
// ===========================================

type LocationKey = 'all' | '1' | '2'

const PERIODS: Array<{ key: KpiPeriod; label: string }> = [
  { key: 'mtd', label: 'Mes' },
  { key: 'lastmonth', label: 'Mes pasado' },
  { key: 'ytd', label: 'Año' },
]

const LOCATIONS: Array<{ key: LocationKey; label: string }> = [
  { key: 'all', label: 'Todas' },
  { key: '1', label: 'Costa del Este' },
  { key: '2', label: 'San Francisco' },
]

const STEP_LABELS: Record<string, string> = {
  booking_start: 'Abren la reserva',
  booking_step_auth: 'Inician sesión',
  booking_step_location: 'Eligen sucursal',
  booking_step_services: 'Eligen servicio',
  booking_step_addons: 'Extras',
  booking_step_staff: 'Eligen terapeuta',
  booking_step_datetime: 'Eligen fecha y hora',
  booking_step_confirm: 'Confirmación',
  booking_completed: 'Reserva completada',
}

export function MarketingClient() {
  return (
    <LangProvider>
      <MarketingInner />
    </LangProvider>
  )
}

function MarketingInner() {
  const { lang } = useLang()
  const t = useT()
  const [period, setPeriod] = useState<KpiPeriod>('mtd')
  const [location, setLocation] = useState<LocationKey>('all')
  const [data, setData] = useState<MarketingPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (p: KpiPeriod, l: LocationKey) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/kpis/marketing?period=${p}&location=${l}`, { cache: 'no-store' })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error || `Error ${res.status}`)
      }
      setData(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(period, location) }, [period, location, load])
  useEffect(() => { prefetchStaffKpis() }, [])

  const maxFunnel = data ? Math.max(...data.funnel.steps.map(s => s.sessions), 1) : 1

  return (
    <div className="max-w-xl">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-display font-semibold text-dark">Marketing</h1>
          <LangToggle />
          <DictionaryLink />
        </div>
        <p className="text-sm text-warm-gray-500 mt-1">{t('Tráfico del sitio, canales de adquisición y embudo de reservas online')}</p>
        {data?.firstEventDate && (
          <p className="text-xs font-bold text-spa-green mt-1">
            {t('Datos en vivo desde el')} {formatDateLang(data.firstEventDate, lang)}
          </p>
        )}
      </div>

      {/* Sticky filters */}
      <div className="sticky top-14 lg:top-0 z-20 -mx-2 px-2 pt-2 pb-3 mb-4 bg-cream/95 backdrop-blur-sm border-b border-beige-300">
        <div className="flex flex-wrap gap-2 mb-2" role="group" aria-label="Período">
          {PERIODS.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              aria-pressed={period === p.key}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                period === p.key ? 'bg-spa-green text-white border-spa-green' : 'bg-white text-warm-gray-500 border-beige-400 hover:bg-beige'
              }`}
            >
              {t(p.label)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Sucursal">
          {LOCATIONS.map(l => (
            <button
              key={l.key}
              onClick={() => setLocation(l.key)}
              aria-pressed={location === l.key}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                location === l.key ? 'bg-dark text-white border-dark' : 'bg-white text-warm-gray-500 border-beige-400 hover:bg-beige'
              }`}
            >
              {t(l.label)}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      {loading || !data ? (
        <div className="space-y-4" aria-busy="true">
          <div className="grid grid-cols-2 gap-3"><LoadingCard /><LoadingCard /><LoadingCard /><LoadingCard /></div>
          <LoadingCard tall />
          <LoadingCard tall />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Traffic tiles */}
          <div className="grid grid-cols-2 gap-3">
            <CardBox>
              <Label info="sesiones">{t('Sesiones')}</Label>
              <p className="text-2xl font-bold text-dark tabular-nums mt-1">{data.traffic.sessions.toLocaleString('en-US')}</p>
              {data.traffic.mobilePct !== null && (
                <p className="text-xs text-warm-gray-500 tabular-nums">{pct(data.traffic.mobilePct)} {t('desde móvil')}</p>
              )}
            </CardBox>
            <CardBox>
              <Label info="paginas">{t('Vistas de página')}</Label>
              <p className="text-2xl font-bold text-dark tabular-nums mt-1">{data.traffic.pageViews.toLocaleString('en-US')}</p>
              {data.traffic.viewsPerSession !== null && (
                <p className="text-xs text-warm-gray-500 tabular-nums">{data.traffic.viewsPerSession} {t('por sesión')}</p>
              )}
            </CardBox>
            <CardBox>
              <Label info="reservas_online">{t('Reservas online')}</Label>
              <p className="text-2xl font-bold text-dark tabular-nums mt-1">{data.funnel.completed.toLocaleString('en-US')}</p>
              <p className="text-xs text-warm-gray-500 tabular-nums">
                {pct(data.funnel.visitToComplete)} {t('de las sesiones')}
              </p>
            </CardBox>
            <CardBox>
              <Label info="conversion">{t('Conversión del embudo')}</Label>
              <p className="text-2xl font-bold text-dark tabular-nums mt-1">{pct(data.funnel.startToComplete)}</p>
              <p className="text-xs text-warm-gray-500">{t('de quienes abren la reserva, completan')}</p>
            </CardBox>
          </div>

          {/* Daily page views */}
          <CardBox>
            <Label info="vistas_dia">{t('Vistas de página por día')}</Label>
            <div className="mt-2">
              <DualLine series={data.traffic.series} formatY={v => String(Math.round(v))} />
            </div>
          </CardBox>

          {/* Booking funnel */}
          <CardBox>
            <Label info="embudo">{t('Embudo de reserva online')}</Label>
            <div className="mt-3 space-y-2">
              {data.funnel.steps.map((s, i) => {
                const prev = i > 0 ? data.funnel.steps[i - 1].sessions : null
                const drop = prev && prev > 0 ? s.sessions / prev : null
                const isLast = i === data.funnel.steps.length - 1
                return (
                  <div key={s.step}>
                    <div className="flex items-baseline justify-between text-xs">
                      <span className={isLast ? 'font-bold text-dark' : 'text-warm-gray-500'}>{t(STEP_LABELS[s.step])}</span>
                      <span className="tabular-nums text-dark">
                        <b>{s.sessions}</b>
                        {drop !== null && <span className="text-warm-gray-500"> · {pct(drop)}</span>}
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-beige-200 mt-0.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isLast ? 'bg-gold' : 'bg-spa-green'}`}
                        style={{ width: `${Math.max(2, (100 * s.sessions) / maxFunnel)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-[10px] text-warm-gray-500 mt-3">
              {t('Sesiones únicas que llegan a cada paso · el % es respecto al paso anterior')}
            </p>
          </CardBox>

          {/* Channels */}
          <CardBox className="p-0 overflow-hidden">
            <div className="px-4 pt-4"><Label info="canales">{t('Canales de adquisición')}</Label></div>
            {data.channels.length === 0 ? (
              <p className="text-sm text-warm-gray-500 px-4 py-3">{t('Aún no hay sesiones en el período.')}</p>
            ) : (
              <table className="w-full text-sm mt-2">
                <thead>
                  <tr className="text-[10px] text-left border-b border-beige-300 bg-beige-100/60 uppercase tracking-wider text-warm-gray-500">
                    <th className="py-1.5 pl-4 pr-2 font-bold">{t('Canal')}</th>
                    <th className="py-1.5 px-2 font-bold text-right">{t('Sesiones')}</th>
                    <th className="py-1.5 px-2 font-bold text-right">{t('Inician reserva')}</th>
                    <th className="py-1.5 pl-2 pr-4 font-bold text-right">{t('Reservan')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed divide-beige-300">
                  {data.channels.map(c => (
                    <tr key={c.channel}>
                      <td className="py-2 pl-4 pr-2 font-medium text-dark break-all">{c.channel === 'direct' ? t('directo') : c.channel}</td>
                      <td className="py-2 px-2 text-right tabular-nums">{c.sessions}</td>
                      <td className="py-2 px-2 text-right tabular-nums">{c.bookingStarts}</td>
                      <td className="py-2 pl-2 pr-4 text-right tabular-nums font-bold text-dark">{c.bookings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p className="text-[10px] text-warm-gray-500 px-4 py-2 border-t border-beige-200">
              {t('Canal = utm_source del enlace, o el sitio de origen · usa enlaces con UTM en redes para medir')}
            </p>
          </CardBox>

          {/* Top pages */}
          <CardBox>
            <Label info="top_paginas">{t('Páginas más vistas')}</Label>
            {data.traffic.topPages.length === 0 ? (
              <p className="text-sm text-warm-gray-500 mt-2">{t('Aún no hay vistas en el período.')}</p>
            ) : (
              <ol className="mt-2 space-y-1.5 text-sm">
                {data.traffic.topPages.map(p => (
                  <li key={p.path} className="flex justify-between gap-3">
                    <span className="text-dark truncate">{p.path}</span>
                    <span className="tabular-nums text-warm-gray-500 shrink-0">{p.views.toLocaleString('en-US')}</span>
                  </li>
                ))}
              </ol>
            )}
          </CardBox>

          {/* Online share */}
          <CardBox>
            <Label info="online_share">{t('Reservas online vs citas del período')}</Label>
            <p className="text-2xl font-bold text-dark tabular-nums mt-1">{pct(data.onlineShare.pct)}</p>
            <p className="text-xs text-warm-gray-500 tabular-nums">
              {data.onlineShare.completed.toLocaleString('en-US')} {t('reservas online')} · {data.onlineShare.appointments.toLocaleString('en-US')} {t('citas')}
            </p>
          </CardBox>
        </div>
      )}
    </div>
  )
}
