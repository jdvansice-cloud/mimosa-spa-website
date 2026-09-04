import { describe, it, expect, vi } from 'vitest'
import { closeAndRemember, parseMemory } from './memory'

const reply = (t: string) => ({ content: [{ type: 'text', text: t }], usage: {} })
const fakeAnthropic = (t: string) => ({ messages: { create: vi.fn(async () => reply(t)) } }) as any

const fakeStore = (over: any = {}) => ({
  recentConversationLogs: vi.fn(async () => []),
  recentMessages: vi.fn(async () => [
    { phone: '507', direction: 'in', author: 'customer', type: 'text', text: 'quiero un masaje', shadow: false, created_at: '2026-09-04T14:00:00Z' },
    { phone: '507', direction: 'out', author: 'camila', type: 'text', text: 'con gusto', shadow: false, created_at: '2026-09-04T14:01:00Z' },
  ]),
  logConversation: vi.fn(async () => {}),
  mergeProfile: vi.fn(async () => ({})),
  logEvent: vi.fn(async () => {}),
  ...over,
}) as any

const now = new Date('2026-09-04T15:00:00Z')

describe('parseMemory', () => {
  it('parses a plain JSON object', () => {
    expect(parseMemory('{"resumen":"Reservó un masaje","perfil":{"nombre":"Ana","tratamientos":["Masaje"]}}'))
      .toMatchObject({ resumen: 'Reservó un masaje', perfil: { nombre: 'Ana', tratamientos: ['Masaje'] } })
  })
  it('parses through a code fence and surrounding prose', () => {
    const r = parseMemory('Aquí tienes:\n```json\n{"resumen":"x","perfil":{}}\n```\nlisto')
    expect(r?.resumen).toBe('x')
  })
  it('drops an invalid sucursal_preferida', () => {
    const r = parseMemory('{"resumen":"x","perfil":{"sucursal_preferida":"panama"}}')
    expect(r?.perfil.sucursal_preferida).toBeUndefined()
  })
  it('keeps a valid sucursal_preferida', () => {
    expect(parseMemory('{"resumen":"x","perfil":{"sucursal_preferida":"cde"}}')?.perfil.sucursal_preferida).toBe('cde')
  })
  it('returns null for junk or a missing resumen', () => {
    expect(parseMemory('lo siento, no puedo')).toBeNull()
    expect(parseMemory('{"perfil":{}}')).toBeNull()
    expect(parseMemory('{no es json}')).toBeNull()
  })
})

describe('closeAndRemember', () => {
  it('logs the conversation and merges the profile', async () => {
    const store = fakeStore()
    const r = await closeAndRemember({
      anthropic: fakeAnthropic('{"resumen":"Reservó masaje el viernes","perfil":{"nombre":"Ana Ruiz","correo":"","sucursal_preferida":"cde","tratamientos":["Masaje relajante"],"preferencias":[],"notas":[]}}'),
      store, phone: '507', outcome: 'booked', now,
    })
    expect(r).toEqual({ logged: true })
    expect(store.logConversation).toHaveBeenCalledWith({
      phone: '507', started_at: '2026-09-04T14:00:00Z', outcome: 'booked', summary: 'Reservó masaje el viernes',
    })
    expect(store.mergeProfile).toHaveBeenCalledWith('507', expect.objectContaining({ nombre: 'Ana Ruiz', sucursal_preferida: 'cde' }))
  })

  it('skips a second close within 10 minutes', async () => {
    const store = fakeStore({
      recentConversationLogs: vi.fn(async () => [{ phone: '507', started_at: 'a', ended_at: '2026-09-04T14:55:00Z', outcome: 'booked', summary: 's' }]),
    })
    const anthropic = fakeAnthropic('{"resumen":"x","perfil":{}}')
    expect(await closeAndRemember({ anthropic, store, phone: '507', outcome: 'closed', now })).toEqual({ logged: false })
    expect(anthropic.messages.create).not.toHaveBeenCalled()
    expect(store.logConversation).not.toHaveBeenCalled()
  })

  it('logs again when the previous close is older than 10 minutes', async () => {
    const store = fakeStore({
      recentConversationLogs: vi.fn(async () => [{ phone: '507', started_at: 'a', ended_at: '2026-09-04T14:30:00Z', outcome: 'booked', summary: 's' }]),
    })
    const r = await closeAndRemember({ anthropic: fakeAnthropic('{"resumen":"y","perfil":{}}'), store, phone: '507', outcome: 'closed', now })
    expect(r).toEqual({ logged: true })
  })

  it('does not merge an all-empty profile', async () => {
    const store = fakeStore()
    await closeAndRemember({
      anthropic: fakeAnthropic('{"resumen":"solo preguntó el horario","perfil":{"nombre":"","correo":"","sucursal_preferida":"","tratamientos":[],"preferencias":[],"notas":[]}}'),
      store, phone: '507', outcome: 'closed', now,
    })
    expect(store.logConversation).toHaveBeenCalled()
    expect(store.mergeProfile).not.toHaveBeenCalled()
  })

  it('logs an error event and gives up when the model answers junk', async () => {
    const store = fakeStore()
    const r = await closeAndRemember({ anthropic: fakeAnthropic('no puedo hacer eso'), store, phone: '507', outcome: 'handoff', now })
    expect(r).toEqual({ logged: false })
    expect(store.logConversation).not.toHaveBeenCalled()
    expect(store.logEvent).toHaveBeenCalledWith('507', 'error', expect.objectContaining({ where: 'closeAndRemember' }))
  })

  it('swallows an Anthropic failure', async () => {
    const store = fakeStore()
    const anthropic = { messages: { create: vi.fn(async () => { throw new Error('boom') }) } } as any
    expect(await closeAndRemember({ anthropic, store, phone: '507', outcome: 'closed', now })).toEqual({ logged: false })
    expect(store.logEvent).toHaveBeenCalledWith('507', 'error', expect.objectContaining({ where: 'closeAndRemember' }))
  })

  it('does nothing when there is no transcript', async () => {
    const store = fakeStore({ recentMessages: vi.fn(async () => []) })
    const anthropic = fakeAnthropic('{"resumen":"x","perfil":{}}')
    expect(await closeAndRemember({ anthropic, store, phone: '507', outcome: 'idle', now })).toEqual({ logged: false })
    expect(anthropic.messages.create).not.toHaveBeenCalled()
  })
})
