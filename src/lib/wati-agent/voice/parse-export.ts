export interface ExportLine { ts: string; sender: string; text: string; kind: 'customer' | 'staff' | 'bot' | 'template' | 'media' }
export interface Exchange { sucursal: 'cde' | 'sfc' | null; customer: string[]; staff: string[]; ts: string }

const HEAD = /^\[(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2})\] (.+?): ?([\s\S]*)$/
const TEMPLATE = /^\[(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2})\] Template "/
const MEDIA = /^([0-9a-f-]{36}\.(jpg|jpeg|png|pdf|mp4)|\[(sticker|audio recorder)\])$/i
const STAFF: Record<string, 'cde' | 'sfc' | null> = { 'Citas Costa del Este': 'cde', 'Citas San Francisco': 'sfc', 'Mimosa Spa': null }

export function parseExport(raw: string, customerName: string): ExportLine[] {
  void customerName
  const out: ExportLine[] = []
  let cur: ExportLine | null = null
  for (const line of raw.split('\n')) {
    if (line.startsWith('[') && /^\[\d{2}\/\d{2}\/\d{4} /.test(line)) {
      if (cur) out.push(cur)
      if (TEMPLATE.test(line)) { cur = { ts: line.slice(1, 20), sender: 'Template', text: line, kind: 'template' }; continue }
      const m = line.match(HEAD)
      if (!m) { cur = null; continue }
      const [, ts, sender, text] = m
      const kind: ExportLine['kind'] = sender === 'Bot' ? 'bot' : sender in STAFF ? 'staff' : 'customer'
      cur = { ts, sender, text, kind }
    } else if (cur) {
      cur.text += '\n' + line
    }
  }
  if (cur) out.push(cur)
  for (const l of out) {
    l.text = l.text.trimEnd()
    if (MEDIA.test(l.text.trim())) l.kind = 'media'
  }
  return out
}

export function staffSucursal(sender: string): 'cde' | 'sfc' | null { return STAFF[sender] ?? null }

export function buildExchanges(lines: ExportLine[]): Exchange[] {
  const ex: Exchange[] = []
  let customer: string[] = []
  let i = 0
  while (i < lines.length) {
    const l = lines[i]
    if (l.kind === 'customer') { customer.push(l.text); if (customer.length > 4) customer.shift(); i++; continue }
    if (l.kind === 'staff') {
      const staff: string[] = []
      const sucursal = staffSucursal(l.sender)
      const ts = l.ts
      while (i < lines.length && lines[i].kind === 'staff') { staff.push(lines[i].text); i++ }
      if (customer.length) ex.push({ sucursal, customer: [...customer], staff, ts })
      customer = []
      continue
    }
    i++
  }
  return ex
}
