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

  it('describes the booking flow and the suggestion tools', () => {
    const t = (blocks[0] as any).text
    expect(t).toContain('Flujo de reserva')
    expect(t).toContain('get_suggestions')
    expect(t).toContain('get_menu_link')
    expect(t).toContain('cualquiera disponible')
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

  it('never sends its own confirmation card; the system template handles it', () => {
    const t = (blocks[0] as any).text
    expect(t).toContain('confirmación del sistema')
    expect(t).toMatch(/NUNCA env[ií]e?s? una tarjeta de confirmaci[oó]n/)
  })

  it('states the location reply is a short line plus Google Maps and Waze links, in two bubbles', () => {
    const t = (blocks[0] as any).text
    expect(t).toContain('Google Maps')
    expect(t).toContain('Waze')
    expect(t).toContain('dos burbujas')
  })

  it('does not repeat the send_buttons question in a text bubble', () => {
    expect((blocks[0] as any).text).toContain('send_buttons')
  })

  it('states Camila always helps outside opening hours', () => {
    const t = (blocks[0] as any).text
    expect(t).toContain('las 24 horas')
    expect(t).toContain('Nunca digas que no puedes ayudar por la hora')
  })

  it('states scope and manipulation guardrails', () => {
    const t = (blocks[0] as any).text
    expect(t).toContain('Alcance y límites')
    expect(t).toContain('manipulacion')
    expect(t).toContain('no lo manejo por aquí')
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

describe('client memory in the prompt', () => {
  const build = (over: any = {}) => buildSystem({
    personaName: 'Camila',
    now: new Date('2026-09-04T15:00:00-05:00'),
    sucursal: 'cde',
    clientName: 'Ana',
    mindbodyHistory: null,
    summary: null,
    media: [],
    intent: 'reservar',
    styleGuide: 'G',
    ...over,
  })

  it('states the memory rule in the stable block', () => {
    const t = (build()[0] as any).text
    expect(t).toContain('Si el perfil o el historial te dicen quién es el cliente')
    expect(t).toContain('en vez de pedir la tarjeta 📌')
  })

  it('renders Perfil and Conversaciones anteriores in the volatile block', () => {
    const t = (build({
      profile: { nombre: 'Ana Ruiz', correo: 'a@x.com', sucursal_preferida: 'sfc', tratamientos: ['Masaje relajante'], notas: ['alergia al eucalipto'] },
      historial: [{ phone: '507', started_at: '2026-08-01T10:00:00Z', ended_at: '2026-08-01T11:00:00Z', outcome: 'booked', summary: 'Reservó masaje' }],
    })[1] as any).text
    expect(t).toContain('Perfil: nombre Ana Ruiz')
    expect(t).toContain('sucursal habitual San Francisco')
    expect(t).toContain('alergia al eucalipto')
    expect(t).toContain('Conversaciones anteriores:')
    expect(t).toContain('- 2026-08-01 (booked): Reservó masaje')
  })

  it('omits both sections when there is nothing remembered', () => {
    const t = (build({ profile: {}, historial: [] })[1] as any).text
    expect(t).not.toContain('Perfil:')
    expect(t).not.toContain('Conversaciones anteriores')
  })
})
