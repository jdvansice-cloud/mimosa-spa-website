// scripts/wati-agent/replace-staff-names.ts
// Deterministically replaces real receptionist first names (leaked into mined
// voice data as greetings/signatures) with the assistant persona name Camila.
// No API calls — pure regex substitution. Run standalone or import
// replaceStaffNames() to call from mine-chats.ts after redactNames().
import fs from 'node:fs'

const STAFF_NAMES = ['Karen', 'Nilka', 'Adriana', 'Yasi', 'Mary', 'Maritza']

type Turn = { customer: string[]; staff: string[] }
type Case = { id: string; sucursal: string; turns: Turn[] }
type Exemplar = { intent: string; sucursal: string; customer: string[]; staff: string[] }

function buildPattern(name: string): RegExp {
  // Unicode-aware boundary: not preceded/followed by a letter, tolerant of an
  // emoji or punctuation immediately after the name (e.g. "Adriana🌼"), and of
  // a customer drawing out the final letter (e.g. "Nilkaaaaa").
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const lastChar = name.slice(-1)
  const lastCharEscaped = lastChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?<![\\p{L}])${escaped}${lastCharEscaped}*(?![\\p{L}])`, 'giu')
}

const PATTERNS = STAFF_NAMES.map(name => ({ name, re: buildPattern(name) }))

export function replaceStaffNamesInString(text: string, counts: Record<string, number>): string {
  let out = text
  for (const { name, re } of PATTERNS) {
    out = out.replace(re, () => {
      counts[name] = (counts[name] ?? 0) + 1
      return 'Camila'
    })
  }
  return out
}

export function replaceStaffNames<T extends { customer: string[]; staff: string[] }>(
  items: T[],
  counts: Record<string, number>
): T[] {
  return items.map(item => ({
    ...item,
    customer: item.customer.map(t => replaceStaffNamesInString(t, counts)),
    staff: item.staff.map(t => replaceStaffNamesInString(t, counts)),
  }))
}

export function replaceStaffNamesInCases(cases: Case[], counts: Record<string, number>): Case[] {
  return cases.map(c => ({ ...c, turns: replaceStaffNames(c.turns, counts) }))
}

export function replaceStaffNamesInExemplars(exemplars: Exemplar[], counts: Record<string, number>): Exemplar[] {
  return replaceStaffNames(exemplars, counts)
}

function main() {
  const casesPath = 'scripts/wati-agent/evals/cases.json'
  const exemplarsPath = 'src/lib/wati-agent/voice/exemplars.json'

  const cases = JSON.parse(fs.readFileSync(casesPath, 'utf8')) as Case[]
  const exemplars = JSON.parse(fs.readFileSync(exemplarsPath, 'utf8')) as Exemplar[]

  const counts: Record<string, number> = {}
  const newCases = replaceStaffNamesInCases(cases, counts)
  const newExemplars = replaceStaffNamesInExemplars(exemplars, counts)

  fs.writeFileSync(casesPath, JSON.stringify(newCases, null, 2))
  fs.writeFileSync(exemplarsPath, JSON.stringify(newExemplars, null, 2))

  console.log('replace-staff-names: counts per name:')
  for (const name of STAFF_NAMES) console.log(`  ${name}: ${counts[name] ?? 0}`)
  console.log(`  total: ${Object.values(counts).reduce((a, b) => a + b, 0)}`)
}

if (process.argv[1]?.endsWith('replace-staff-names.ts')) {
  main()
}
