'use client'

import { useCallback, useEffect, useState } from 'react'
import { BedDouble, ChevronLeft, ChevronRight } from 'lucide-react'
import type { CapacityPayload, CapacityDay, CapacityWeekday } from '@/lib/kpis/capacity'
import { CardBox, Label, LoadingCard } from '../shared'
import { LangProvider, LangToggle, useLang, useT } from '../i18n'

// ===========================================
// Capacidad — bed/space occupancy vs the physical ceiling per location.
// CDE: 8 cabinas / 11 camas + 3 sillas → 14 espacios
// SFC: 10 cabinas / 14 camas + 5 sillas → 19 espacios
// ===========================================

// day names handled by lang directly — 'Mar' would collide with the month key in the t() map
const DAYS: Record<'es' | 'en', string[]> = {
  es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
}
const LOC_NAME: Record<number, string> = { 1: 'Costa del Este', 2: 'San Francisco' }
const LOC_DETAIL: Record<number, string> = {
  1: '8 cabinas · 11 camas · 3 sillas de pies',
  2: '10 cabinas · 14 camas · 5 sillas de pies',
}

function todayPanama(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Panama' })
}

function shiftDate(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function barColor(pct: number): string {
  if (pct >= 90) return 'bg-red-500'
  if (pct >= 70) return 'bg-gold'
  return 'bg-[#4C7351]'
}

export function CapacidadClient() {
  return (
    <LangProvider>
      <CapacidadInner />
    </LangProvider>
  )
}

function CapacidadInner() {
  const t = useT()
  const { lang } = useLang()
  const [date, setDate] = useState<string>(todayPanama())
  const [data, setData] = useState<CapacityPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (d: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/kpis/capacidad?date=${d}`, { cache: 'no-store' })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error || `Error ${res.status}`)
      }
      setData(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : t('No se pudo cargar'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => { load(date) }, [date, load])

  const dowLabel = `${DAYS[lang][new Date(`${date}T12:00:00`).getDay()]} ${date.slice(8, 10)}/${date.slice(5, 7)}`

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">
      <div className="flex items-center justify-between pt-5 mb-1">
        <h1 className="text-xl font-bold text-dark flex items-center gap-2">
          <BedDouble className="w-5 h-5 text-gold" />
          {t('Capacidad')}
        </h1>
        <LangToggle />
      </div>
      <p className="text-xs text-warm-gray-500 mb-4">
        {t('Espacios de tratamiento ocupados vs techo físico (camas + sillas), bloques de 30 min')}
      </p>

      {/* Date nav */}
      <div className="flex items-center justify-between mb-4 bg-white border border-beige-200 rounded-xl px-2 py-1.5">
        <button onClick={() => setDate(shiftDate(date, -1))} className="p-2 rounded-lg hover:bg-beige-100" aria-label="Anterior">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-sm font-semibold text-dark">{dowLabel}</div>
        <div className="flex items-center gap-1">
          {date !== todayPanama() && (
            <button onClick={() => setDate(todayPanama())} className="text-xs text-gold font-medium px-2 py-1 rounded-lg hover:bg-gold/10">
              {t('Hoy')}
            </button>
          )}
          <button onClick={() => setDate(shiftDate(date, 1))} className="p-2 rounded-lg hover:bg-beige-100" aria-label="Siguiente">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
      )}

      {loading && (<><LoadingCard tall /><div className="h-4" /><LoadingCard tall /></>)}

      {!loading && data && data.locations.map(locData => (
        <LocationCard key={locData.location} d={locData as CapacityDay & { weekly: CapacityWeekday[] }} />
      ))}
    </div>
  )
}

function LocationCard({ d }: { d: CapacityDay & { weekly: CapacityWeekday[] } }) {
  const t = useT()
  const { lang } = useLang()
  const peakPct = d.peakPct

  return (
    <CardBox className="mb-4">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="font-bold text-dark">{LOC_NAME[d.location]}</p>
          <p className="text-[11px] text-warm-gray-500">{LOC_DETAIL[d.location]} · {t('capacidad')} <b>{d.capacity}</b></p>
        </div>
        <div className="text-right">
          <Label>{t('Pico del día')}</Label>
          <p className={`text-lg font-bold ${peakPct >= 90 ? 'text-red-600' : peakPct >= 70 ? 'text-gold-600' : 'text-dark'}`}>
            {d.peak}/{d.capacity} <span className="text-xs font-semibold">({peakPct}%)</span>
          </p>
        </div>
      </div>

      {/* Occupancy timeline */}
      <div className="mt-3">
        <div className="flex items-end gap-[2px] h-24">
          {d.blocks.map((b, i) => {
            const pct = d.capacity ? (100 * b.occupied / d.capacity) : 0
            return (
              <div key={i} className="flex-1 flex flex-col justify-end h-full" title={`${b.time} · ${b.occupied}/${d.capacity}`}>
                <div
                  className={`${barColor(pct)} rounded-t-[3px] w-full transition-all`}
                  style={{ height: `${Math.max(pct, b.occupied > 0 ? 6 : 0)}%` }}
                />
              </div>
            )
          })}
        </div>
        <div className="border-t border-beige-200 mt-[2px] pt-1 flex justify-between text-[10px] text-warm-gray-500">
          <span>9am</span><span>11am</span><span>1pm</span><span>3pm</span><span>5pm</span><span>7pm</span>
        </div>
      </div>

      {/* Weekday peaks, last 4 weeks */}
      <div className="mt-4">
        <Label>{t('Pico promedio por día (últimas 4 semanas)')}</Label>
        <div className="mt-1.5 grid grid-cols-7 gap-1 text-center">
          {[1, 2, 3, 4, 5, 6, 0].map(dow => {
            const w = d.weekly.find(x => x.dow === dow)
            const peak = w ? Math.max(w.avgPeakAm, w.avgPeakPm) : 0
            const pct = d.capacity ? Math.round(100 * peak / d.capacity) : 0
            return (
              <div key={dow} className="rounded-lg bg-beige-50 py-1.5">
                <p className="text-[10px] text-warm-gray-500">{DAYS[lang][dow]}</p>
                <p className={`text-xs font-bold ${pct >= 90 ? 'text-red-600' : pct >= 70 ? 'text-gold-600' : 'text-dark'}`}>{pct}%</p>
              </div>
            )
          })}
        </div>
        <p className="text-[10px] text-warm-gray-500 mt-1.5">
          {t('≥90% = al tope físico: solo crece con combos, horario extendido o llenando valles')}
        </p>
      </div>
    </CardBox>
  )
}
