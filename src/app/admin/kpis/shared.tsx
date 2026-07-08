'use client'

import { useState } from 'react'
import type { KpiSeries } from '@/lib/kpis/queries'

// Shared UI pieces for the KPIs section (dashboard + sales report).

export const GREEN = '#4C7351'
export const GOLD = '#D4AD00'

export const MONTHS_ES_LONG = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

export const DAYS_ES_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']

export function money(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

export function money2(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function moneyCompact(n: number): string {
  if (Math.abs(n) >= 10000) return '$' + (n / 1000).toFixed(0) + 'k'
  if (Math.abs(n) >= 1000) return '$' + (n / 1000).toFixed(1) + 'k'
  return '$' + Math.round(n)
}

export function pct(n: number | null): string {
  return n === null ? '—' : Math.round(n * 100) + '%'
}

export function pct1(n: number): string {
  return (n * 100).toFixed(1) + '%'
}

export function deltaPct(cur: number, ly: number): number | null {
  if (!ly) return null
  return (cur - ly) / ly
}

/** "2026-07-06" → "lun 6 julio 2026" (Panama has no DST; UTC parse is safe). */
export function formatDateEs(date: string): string {
  const d = new Date(`${date}T00:00:00Z`)
  return `${DAYS_ES_SHORT[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS_ES_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

export function BlackSpinner() {
  return (
    <span
      className="inline-block h-6 w-6 rounded-full border-2 border-dark border-t-transparent animate-spin motion-reduce:animate-none"
      role="status"
      aria-label="Cargando"
    />
  )
}

export function LoadingCard({ tall = false }: { tall?: boolean }) {
  return (
    <div className={`bg-white border border-beige-400 rounded-2xl flex items-center justify-center ${tall ? 'h-44' : 'h-28'}`}>
      <BlackSpinner />
    </div>
  )
}

export function DeltaChip({ delta, invert = false, suffix }: { delta: number | null; invert?: boolean; suffix?: string }) {
  if (delta === null) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-beige text-warm-gray">sin dato {suffix}</span>
  const up = delta >= 0
  const good = invert ? !up : up
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${good ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
      {up ? '+' : ''}{Math.round(delta * 100)}% {suffix}
    </span>
  )
}

export function Legend({ curLabel, prevLabel }: { curLabel: string; prevLabel: string }) {
  return (
    <div className="flex gap-4 text-[11px] text-warm-gray mt-1">
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-3 h-0.5 rounded" style={{ background: GREEN }} /> {curLabel}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-3 h-0.5 rounded" style={{ background: GOLD }} /> {prevLabel}
      </span>
    </div>
  )
}

/**
 * Two-line comparison chart (current year vs previous year).
 * Tap or hover to read the exact values for a point.
 */
export function DualLine({
  series,
  formatY,
  formatValue,
}: {
  series: KpiSeries
  formatY: (v: number) => string
  /** Formatter for the tap readout (defaults to formatY). */
  formatValue?: (v: number) => string
}) {
  const [sel, setSel] = useState<number | null>(null)
  const fmtV = formatValue ?? formatY
  const W = 320, H = 110, PAD_X = 6, PAD_TOP = 14, PAD_BOT = 16
  const all = [...series.current, ...series.previous].filter((v): v is number => v !== null)
  const max = Math.max(...all, 1)
  const innerH = H - PAD_TOP - PAD_BOT
  const stepX = (W - 2 * PAD_X) / Math.max(series.labels.length - 1, 1)
  const y = (v: number) => PAD_TOP + innerH - (v / max) * innerH

  const toPoints = (vals: Array<number | null>) =>
    vals
      .map((v, i) => (v === null ? null : `${(PAD_X + i * stepX).toFixed(1)},${y(v).toFixed(1)}`))
      .filter((p): p is string => p !== null)
      .join(' ')

  const curPts = toPoints(series.current)
  const prevPts = toPoints(series.previous)

  const every = Math.ceil(series.labels.length / 8)
  const lastCurIdx = series.current.reduce<number>((acc, v, i) => (v !== null ? i : acc), -1)

  function pick(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const xSvg = ((e.clientX - rect.left) / rect.width) * W
    const idx = Math.round((xSvg - PAD_X) / stepX)
    setSel(Math.max(0, Math.min(series.labels.length - 1, idx)))
  }

  const selLabel = sel !== null
    ? series.unit === 'day' ? `Día ${series.labels[sel]}` : series.labels[sel]
    : null
  const selCur = sel !== null ? series.current[sel] : null
  const selPrev = sel !== null ? series.previous[sel] : null

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="block w-full h-32 mt-2 touch-pan-y cursor-crosshair"
        onPointerDown={pick}
        onPointerMove={e => { if (e.pointerType === 'mouse' || e.buttons > 0) pick(e) }}
        aria-hidden="true"
      >
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={PAD_X} y1={y(max * f)} x2={W - PAD_X} y2={y(max * f)} stroke="#EFE8DB" strokeWidth="1" />
        ))}
        <text x={PAD_X} y={y(max) - 4} fontSize="8" fill="#8A8478">{formatY(max)}</text>
        {prevPts && <polyline points={prevPts} fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />}
        {curPts && <polyline points={curPts} fill="none" stroke={GREEN} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />}
        {lastCurIdx >= 0 && series.current[lastCurIdx] !== null && (
          <circle cx={PAD_X + lastCurIdx * stepX} cy={y(series.current[lastCurIdx] as number)} r="3.2" fill={GREEN} />
        )}
        {sel !== null && (
          <>
            <line x1={PAD_X + sel * stepX} y1={PAD_TOP - 6} x2={PAD_X + sel * stepX} y2={H - PAD_BOT + 4} stroke="#333333" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
            {selPrev !== null && <circle cx={PAD_X + sel * stepX} cy={y(selPrev)} r="3.2" fill={GOLD} />}
            {selCur !== null && <circle cx={PAD_X + sel * stepX} cy={y(selCur)} r="3.5" fill={GREEN} stroke="#fff" strokeWidth="1" />}
          </>
        )}
        {series.labels.map((l, i) =>
          i % every === 0 ? (
            <text key={i} x={PAD_X + i * stepX} y={H - 4} fontSize="8" fill="#8A8478" textAnchor="middle">{l}</text>
          ) : null
        )}
      </svg>
      <p className="text-[11px] tabular-nums text-warm-gray h-4 mt-0.5">
        {sel === null ? (
          <span className="italic">Toca el gráfico para ver valores</span>
        ) : (
          <>
            <b className="text-dark">{selLabel}</b>
            {' — '}
            <span style={{ color: GREEN }} className="font-bold">{selCur !== null ? fmtV(selCur) : '—'}</span>
            {' · '}
            <span style={{ color: GOLD }} className="font-bold">{selPrev !== null ? fmtV(selPrev) : '—'}</span>
          </>
        )}
      </p>
    </div>
  )
}

export function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold tracking-widest uppercase text-warm-gray">{children}</p>
}

export function CardBox({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white border border-beige-400 rounded-2xl p-4 ${className}`}>{children}</div>
}
