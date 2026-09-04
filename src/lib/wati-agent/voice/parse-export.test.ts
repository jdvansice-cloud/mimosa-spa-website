import { describe, it, expect } from 'vitest'
import { parseExport, buildExchanges } from './parse-export'

const raw = `[06/01/2026 16:36:08] Nabiha: Hola quería reservar
[06/01/2026 16:36:10] Bot: ¡Hola! Bienvenid@
Seleccione sucursal
[06/01/2026 16:36:56] Citas Costa del Este: ✨ Muy buenos días
Mi nombre es Adriana🌼
[06/01/2026 16:37:00] Citas Costa del Este: que masaje desean?
[06/01/2026 16:38:00] Nabiha: relajante
[06/02/2026 22:44:58] Template "Hola Nabiha" was sent.
[06/03/2026 12:57:29] Bot: b5be14fd-f04a-4863-bf30-82c58179744e.png
`

describe('parseExport', () => {
  it('parses multi-line bodies and kinds', () => {
    const lines = parseExport(raw, 'Nabiha')
    expect(lines.map(l => l.kind)).toEqual(['customer', 'bot', 'staff', 'staff', 'customer', 'template', 'media'])
    expect(lines[2].text).toBe('✨ Muy buenos días\nMi nombre es Adriana🌼')
  })
  it('builds exchanges with preceding customer context', () => {
    const ex = buildExchanges(parseExport(raw, 'Nabiha'))
    expect(ex).toHaveLength(1)
    expect(ex[0].sucursal).toBe('cde')
    expect(ex[0].customer).toEqual(['Hola quería reservar'])
    expect(ex[0].staff).toHaveLength(2)
  })
})
