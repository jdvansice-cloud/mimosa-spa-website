import * as XLSX from 'xlsx'

// ===========================================
// NGTeco Time export parsing (TC7 clock). The clock has no API, so staff
// punches arrive as Excel/CSV reports shared from the NGTeco Time app.
// Column layouts vary by report type and app version, so detection is
// header-synonym based and tolerant:
//  - timecard format: one row per employee/day with Clock In / Clock Out
//    columns (possibly several in/out pairs per row) and a total-hours column
//  - punch-log format: one row per punch with a single date-time column,
//    paired sequentially per employee/day (in, out, in, out…)
// ===========================================

export interface PunchRow {
  employeeName: string
  employeeCode: string | null
  workDate: string      // YYYY-MM-DD
  clockIn: string | null   // HH:MM
  clockOut: string | null  // HH:MM
  /** Worked minutes: the report's own total when present, else out − in. */
  minutes: number | null
  /** Shift index within the day (0, 1, …) — part of the idempotency key. */
  pairIndex: number
}

export interface ParsedExport {
  punches: PunchRow[]
  periodStart: string | null
  periodEnd: string | null
}

type Cell = string | number | boolean | Date | null | undefined
type Row = Cell[]

const s = (c: Cell): string => (c === null || c === undefined ? '' : String(c)).trim()
const norm = (c: Cell): string =>
  s(c).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()

const NAME_HEADERS = ['name', 'employee', 'employee name', 'full name', 'nombre', 'empleado']
const FIRST_HEADERS = ['first name', 'nombre']
const LAST_HEADERS = ['last name', 'apellido']
const CODE_HEADERS = ['id', 'employee id', 'person id', 'user id', 'no', 'emp id', 'codigo', 'attendance id']
const DATE_HEADERS = ['date', 'att date', 'attendance date', 'work date', 'fecha', 'day']
const IN_HEADERS = ['clock in', 'check in', 'in', 'time in', 'on duty', 'entrada', 'first punch', 'first in']
const OUT_HEADERS = ['clock out', 'check out', 'out', 'time out', 'off duty', 'salida', 'last punch', 'last out']
const HOURS_HEADERS = ['total', 'total hours', 'work hours', 'total time', 'worked', 'duration', 'horas', 'horas trabajadas', 'total work time', 'work time']
const DATETIME_HEADERS = ['time', 'date time', 'datetime', 'punch time', 'att time', 'hora']
const STATE_HEADERS = ['status', 'state', 'punch state', 'attendance status', 'estado', 'in out']

function headerIs(cell: Cell, list: string[]): boolean {
  return list.includes(norm(cell))
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

/** Excel serial / Date / string → YYYY-MM-DD, or null. */
function toDate(c: Cell): string | null {
  if (c instanceof Date && !isNaN(c.getTime())) {
    return `${c.getFullYear()}-${pad2(c.getMonth() + 1)}-${pad2(c.getDate())}`
  }
  if (typeof c === 'number' && c > 20000 && c < 80000) {
    const d = XLSX.SSF.parse_date_code(c)
    if (d) return `${d.y}-${pad2(d.m)}-${pad2(d.d)}`
  }
  const str = s(c)
  if (!str) return null
  let m = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/)
  if (m) return `${m[1]}-${pad2(+m[2])}-${pad2(+m[3])}`
  m = str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/)
  if (m) return `${m[3]}-${pad2(+m[1])}-${pad2(+m[2])}` // US order (NGTeco app default)
  return null
}

/** Excel fraction / Date / "9:03 AM" / "09:03" → HH:MM, or null. */
function toTime(c: Cell): string | null {
  if (c instanceof Date && !isNaN(c.getTime())) {
    return `${pad2(c.getHours())}:${pad2(c.getMinutes())}`
  }
  if (typeof c === 'number') {
    const frac = c % 1
    if (c >= 0 && c < 1) {
      const mins = Math.round(c * 24 * 60)
      return `${pad2(Math.floor(mins / 60) % 24)}:${pad2(mins % 60)}`
    }
    if (frac > 0) {
      const mins = Math.round(frac * 24 * 60)
      return `${pad2(Math.floor(mins / 60) % 24)}:${pad2(mins % 60)}`
    }
    return null
  }
  const str = s(c)
  const m = str.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])?/)
  if (!m) return null
  let h = +m[1]
  const min = +m[2]
  const ap = m[3]?.toLowerCase()
  if (ap === 'pm' && h < 12) h += 12
  if (ap === 'am' && h === 12) h = 0
  if (h > 23 || min > 59) return null
  return `${pad2(h)}:${pad2(min)}`
}

/** "8:30", "8.5", Excel fraction or Date → minutes, or null. */
function toMinutes(c: Cell): number | null {
  if (c === null || c === undefined || c === '') return null
  if (c instanceof Date) return c.getHours() * 60 + c.getMinutes()
  if (typeof c === 'number') {
    if (c >= 0 && c < 1.5) return Math.round(c * 24 * 60) // Excel time fraction
    if (c < 24) return Math.round(c * 60)                 // decimal hours
    return null
  }
  const str = s(c)
  let m = str.match(/^(\d{1,2}):(\d{2})/)
  if (m) return +m[1] * 60 + +m[2]
  m = str.match(/^(\d+(?:\.\d+)?)\s*h?/i)
  if (m && +m[1] < 24) return Math.round(+m[1] * 60)
  return null
}

function diffMinutes(clockIn: string, clockOut: string): number {
  const [ih, im] = clockIn.split(':').map(Number)
  const [oh, om] = clockOut.split(':').map(Number)
  let d = oh * 60 + om - (ih * 60 + im)
  if (d < 0) d += 24 * 60 // overnight shift
  return d
}

interface HeaderMap {
  row: number
  name: number | null
  first: number | null
  last: number | null
  code: number | null
  date: number | null
  ins: number[]
  outs: number[]
  hours: number | null
  datetime: number | null
  state: number | null
}

function findHeader(rows: Row[]): HeaderMap | null {
  for (let r = 0; r < Math.min(rows.length, 30); r++) {
    const row = rows[r] ?? []
    const map: HeaderMap = {
      row: r, name: null, first: null, last: null, code: null, date: null,
      ins: [], outs: [], hours: null, datetime: null, state: null,
    }
    row.forEach((cell, i) => {
      if (map.name === null && headerIs(cell, NAME_HEADERS)) map.name = i
      else if (map.first === null && headerIs(cell, FIRST_HEADERS)) map.first = i
      else if (map.last === null && headerIs(cell, LAST_HEADERS)) map.last = i
      else if (map.code === null && headerIs(cell, CODE_HEADERS)) map.code = i
      else if (map.date === null && headerIs(cell, DATE_HEADERS)) map.date = i
      else if (headerIs(cell, IN_HEADERS)) map.ins.push(i)
      else if (headerIs(cell, OUT_HEADERS)) map.outs.push(i)
      else if (map.hours === null && headerIs(cell, HOURS_HEADERS)) map.hours = i
      else if (map.datetime === null && headerIs(cell, DATETIME_HEADERS)) map.datetime = i
      else if (map.state === null && headerIs(cell, STATE_HEADERS)) map.state = i
    })
    const hasName = map.name !== null || map.first !== null
    const timecard = hasName && map.date !== null && map.ins.length > 0
    const punchLog = hasName && (map.datetime !== null || (map.date !== null && map.ins.length + map.outs.length === 0 && map.hours === null))
    if (timecard || punchLog) return map
  }
  return null
}

function employeeName(row: Row, h: HeaderMap, carry: string): string {
  let name = ''
  if (h.name !== null) name = s(row[h.name])
  if (!name && h.first !== null) name = [s(row[h.first]), h.last !== null ? s(row[h.last]) : ''].filter(Boolean).join(' ')
  return name || carry
}

export function parseNgtecoExport(buffer: Buffer): ParsedExport {
  // CSV (no xlsx/xls magic bytes): decode as UTF-8 ourselves — XLSX's
  // codepage guess turns accented names into mojibake.
  const isZip = buffer[0] === 0x50 && buffer[1] === 0x4b
  const isCfb = buffer[0] === 0xd0 && buffer[1] === 0xcf
  const wb = isZip || isCfb
    ? XLSX.read(buffer, { type: 'buffer', cellDates: true })
    : XLSX.read(buffer.toString('utf8').replace(/^﻿/, ''), { type: 'string', cellDates: true })
  const punches: PunchRow[] = []

  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json<Row>(sheet, { header: 1, raw: true, defval: null })
    const h = findHeader(rows)
    if (!h) continue

    if (h.ins.length > 0 && h.date !== null) {
      // ---- timecard format: one row per employee/day ----
      const pairs = h.ins.map((inCol, i) => ({ inCol, outCol: h.outs[i] ?? null }))
      let carry = ''
      const perDay = new Map<string, number>() // employee|date → next pair index
      for (let r = h.row + 1; r < rows.length; r++) {
        const row = rows[r] ?? []
        const name = employeeName(row, h, carry)
        const date = toDate(row[h.date])
        if (!name || !date) continue
        carry = name
        const code = h.code !== null ? s(row[h.code]) || null : null
        const reported = h.hours !== null ? toMinutes(row[h.hours]) : null
        const dayKey = `${name}|${date}`
        for (const p of pairs) {
          const clockIn = toTime(row[p.inCol])
          const clockOut = p.outCol !== null ? toTime(row[p.outCol]) : null
          if (!clockIn && !clockOut) continue
          const idx = perDay.get(dayKey) ?? 0
          perDay.set(dayKey, idx + 1)
          punches.push({
            employeeName: name,
            employeeCode: code,
            workDate: date,
            clockIn,
            clockOut,
            // the report total belongs to the whole day → only trust it on single-pair rows
            minutes: pairs.length === 1 && reported !== null
              ? reported
              : clockIn && clockOut ? diffMinutes(clockIn, clockOut) : null,
            pairIndex: idx,
          })
        }
      }
    } else {
      // ---- punch-log format: one row per punch ----
      const timeCol = h.datetime ?? h.date
      if (timeCol === null) continue
      const log = new Map<string, Array<{ time: string; state: string | null; code: string | null }>>()
      let carry = ''
      for (let r = h.row + 1; r < rows.length; r++) {
        const row = rows[r] ?? []
        const name = employeeName(row, h, carry)
        const date = toDate(h.date !== null ? row[h.date] : row[timeCol]) ?? toDate(row[timeCol])
        const time = toTime(row[timeCol])
        if (!name || !date || !time) continue
        carry = name
        const key = `${name}|${date}`
        if (!log.has(key)) log.set(key, [])
        log.get(key)!.push({
          time,
          state: h.state !== null ? norm(row[h.state]) || null : null,
          code: h.code !== null ? s(row[h.code]) || null : null,
        })
      }
      for (const [key, list] of log) {
        const [name, date] = [key.slice(0, key.lastIndexOf('|')), key.slice(key.lastIndexOf('|') + 1)]
        list.sort((a, b) => a.time.localeCompare(b.time))
        let idx = 0
        for (let i = 0; i < list.length; i += 2) {
          const first = list[i]
          const second = list[i + 1] ?? null
          punches.push({
            employeeName: name,
            employeeCode: first.code,
            workDate: date,
            clockIn: first.time,
            clockOut: second?.time ?? null,
            minutes: second ? diffMinutes(first.time, second.time) : null,
            pairIndex: idx++,
          })
        }
      }
    }
    if (punches.length > 0) break // first sheet with data wins
  }

  if (punches.length === 0) {
    throw new Error(
      'No reconocí el formato del reporte. Exporta desde la app NGTeco Time el reporte de asistencia (Excel) con columnas de nombre, fecha y hora de entrada/salida.'
    )
  }
  const dates = punches.map(p => p.workDate).sort()
  return { punches, periodStart: dates[0], periodEnd: dates[dates.length - 1] }
}
