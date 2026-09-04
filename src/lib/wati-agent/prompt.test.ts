import { describe, it, expect } from 'vitest'
import { buildSystem } from './prompt'

describe('buildSystem', () => {
  const blocks = buildSystem({
    personaName: 'Camila',
    now: new Date('2026-09-04T15:00:00-05:00'),
    sucursal: 'cde',
    clientName: 'Ana',
    mindbodyHistory: null,
    summary: null,
    media: [{ key: 'promo_mes', description: 'Promo septiembre', caption: '', storage_path: 'x', valid_from: null, valid_until: null, active: true }],
    intent: 'promo',
    styleGuide: 'GUIA',
  })

  it('first block is cached and stable', () => {
    expect(blocks[0].cache_control).toEqual({ type: 'ephemeral' })
    expect((blocks[0] as any).text).toContain('GUIA')
    expect((blocks[0] as any).text).not.toContain('2026')
  })

  it('second block carries date, client, media keys', () => {
    expect((blocks[1] as any).text).toContain('Ana')
    expect((blocks[1] as any).text).toContain('promo_mes')
    expect((blocks[1] as any).text).toContain('Muy buenas tardes')
  })

  it('states the tightened voice rules in the stable block', () => {
    const t = (blocks[0] as any).text
    expect(t).toContain('≤ 2 líneas cortas')
    expect(t).toContain('Nunca uses listas')
    expect(t).toContain('máximo 3 en una sola frase')
    expect(t).toContain('Precios solo si el cliente pregunta')
    expect(t).toContain('le esperamos 🌼')
  })

  it('requires knowing the sucursal before handoff, except for urgent cases', () => {
    const t = (blocks[0] as any).text
    expect(t).toContain('Antes de llamar a handoff necesitas saber la sucursal')
    expect(t).toContain('¿Para Costa del Este o San Francisco?')
    expect(t).toContain('EXCEPTO en quejas, comprobantes de pago o errores de sistema')
  })

  it('describes what the handoff resumen must contain', () => {
    const t = (blocks[0] as any).text
    expect(t).toContain('El resumen que le pasas a handoff debe ser de una o dos líneas en español')
    expect(t).toContain('qué quiere el cliente')
    expect(t).toContain('los datos ya recopilados (nombre, correo)')
    expect(t).toContain('evita jerga interna y nombres de herramientas')
  })

  it('volatile block ends with the Recuerda section', () => {
    const t = (blocks[1] as any).text
    expect(t).toContain('## Recuerda')
    expect(t.trimEnd().endsWith('Precios solo si preguntan.')).toBe(true)
  })

  it('states the confirmation and handoff rules', () => {
    expect((blocks[0] as any).text).toMatch(/customer_confirmation/)
    expect((blocks[0] as any).text).toMatch(/handoff/)
  })
})

describe('exemplar placeholders', () => {
  const blocks = buildSystem({
    personaName: 'Camila',
    now: new Date('2026-09-04T15:00:00-05:00'),
    sucursal: 'cde',
    clientName: null,
    mindbodyHistory: null,
    summary: null,
    media: [],
    intent: 'reservar',
    styleGuide: 'Con mucho gusto sra {nombre}',
  })

  it('renders [nombre del cliente] and never a raw {nombre}', () => {
    const all = blocks.map(b => (b as any).text).join('\n')
    expect(all).not.toContain('{nombre}')
    expect(all).toContain('[nombre del cliente]')
  })

  it('never leaks a raw {correo} placeholder', () => {
    const all = blocks.map(b => (b as any).text).join('\n')
    expect(all).not.toContain('{correo}')
  })

  it('explains the placeholder and routes payment data through the tool', () => {
    const t = (blocks[0] as any).text
    expect(t).toContain('[nombre del cliente] representa el nombre real del cliente')
    expect(t).toContain('get_payment_info')
  })
})
