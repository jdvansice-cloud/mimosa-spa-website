'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MONTHS_ES_LONG } from '../shared'

// Single-calendar date-range picker (flight-search style):
// first tap = start, second tap = end; tapping before the start restarts.

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const MIN_DATE = '2024-07-01' // start of synced history

function ymd(y: number, m1: number, d: number): string {
  return `${y}-${String(m1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export function RangeCalendar({
  initial,
  maxDate,
  onApply,
  onClose,
}: {
  initial: { start: string; end: string }
  maxDate: string
  onApply: (range: { start: string; end: string }) => void
  onClose: () => void
}) {
  const [viewY, setViewY] = useState(Number(initial.end.slice(0, 4)))
  const [viewM, setViewM] = useState(Number(initial.end.slice(5, 7))) // 1-12
  const [selStart, setSelStart] = useState<string | null>(initial.start)
  const [selEnd, setSelEnd] = useState<string | null>(initial.end)

  const daysInMonth = new Date(Date.UTC(viewY, viewM, 0)).getUTCDate()
  // Monday-first offset for day 1
  const firstDow = (new Date(Date.UTC(viewY, viewM - 1, 1)).getUTCDay() + 6) % 7

  function pick(date: string) {
    if (!selStart || (selStart && selEnd)) {
      setSelStart(date)
      setSelEnd(null)
    } else if (date < selStart) {
      setSelStart(date)
    } else {
      setSelEnd(date)
    }
  }

  function nav(delta: number) {
    let m = viewM + delta
    let y = viewY
    if (m < 1) { m = 12; y-- }
    if (m > 12) { m = 1; y++ }
    setViewY(y)
    setViewM(m)
  }

  const cells: Array<string | null> = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => ymd(viewY, viewM, i + 1)),
  ]

  return (
    <div className="bg-white border border-beige-400 rounded-2xl p-4 shadow-lg w-full max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => nav(-1)} aria-label="Mes anterior" className="p-1.5 rounded-lg hover:bg-beige">
          <ChevronLeft className="h-4 w-4 text-dark" />
        </button>
        <p className="text-sm font-bold text-dark capitalize">{MONTHS_ES_LONG[viewM - 1]} {viewY}</p>
        <button onClick={() => nav(1)} aria-label="Mes siguiente" className="p-1.5 rounded-lg hover:bg-beige">
          <ChevronRight className="h-4 w-4 text-dark" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[10px] font-bold text-warm-gray mb-1">
        {WEEKDAYS.map((d, i) => <span key={i} className="py-1">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 text-center text-sm">
        {cells.map((date, i) => {
          if (!date) return <span key={i} />
          const disabled = date > maxDate || date < MIN_DATE
          const isStart = date === selStart
          const isEnd = date === selEnd
          const inRange = selStart && selEnd && date > selStart && date < selEnd
          return (
            <button
              key={i}
              disabled={disabled}
              onClick={() => pick(date)}
              aria-pressed={isStart || isEnd}
              className={[
                'py-1.5 my-0.5 text-sm transition-colors',
                disabled ? 'text-beige-400 cursor-default' : 'hover:bg-beige',
                inRange ? 'bg-spa-green/15 text-dark' : '',
                isStart || isEnd ? 'bg-spa-green text-white font-bold hover:bg-spa-green' : '',
                isStart ? 'rounded-l-full' : '',
                isEnd ? 'rounded-r-full' : '',
                isStart && (!selEnd || isEnd) ? 'rounded-full' : '',
                !isStart && !isEnd && !inRange ? 'rounded-full text-dark' : '',
              ].join(' ')}
            >
              {Number(date.slice(8, 10))}
            </button>
          )
        })}
      </div>

      <p className="text-xs text-warm-gray mt-2">
        {selStart && !selEnd && <>Desde <b className="text-dark">{selStart}</b> — elige la fecha final</>}
        {selStart && selEnd && <>Del <b className="text-dark">{selStart}</b> al <b className="text-dark">{selEnd}</b></>}
      </p>

      <div className="flex justify-end gap-2 mt-3">
        <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-sm font-medium text-warm-gray hover:bg-beige">
          Cancelar
        </button>
        <button
          disabled={!selStart || !selEnd}
          onClick={() => selStart && selEnd && onApply({ start: selStart, end: selEnd })}
          className="px-4 py-1.5 rounded-lg text-sm font-bold bg-spa-green text-white disabled:opacity-40"
        >
          Aplicar
        </button>
      </div>
    </div>
  )
}
