import { describe, it, expect, vi } from 'vitest'
import { runTurn } from './runner'

function fakeAnthropic(responses: any[]) {
  let i = 0
  return { messages: { create: vi.fn(async () => responses[i++]) } } as any
}
const text = (t: string) => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: t }], usage: {} })
const toolUse = (name: string, input: any) => ({ stop_reason: 'tool_use', content: [{ type: 'tool_use', id: 't1', name, input }], usage: {} })

function deps(anthropic: any, over: any = {}) {
  const sent: string[] = []
  return {
    anthropic, origin: 'https://x', now: new Date('2026-09-04T15:00:00-05:00'), styleGuide: 'G', sleep: async () => {},
    store: {
      getConversation: vi.fn(async () => ({ phone: '507', mode: 'agent', sucursal: null, mindbody_client_id: null, client_name: null, summary: null, audio_count: 0 })),
      recentMessages: vi.fn(async () => [{ phone: '507', direction: 'in', author: 'customer', type: 'text', text: 'hola', shadow: false }]),
      activeMedia: vi.fn(async () => []), getSetting: vi.fn(async (_k: string, f: any) => f),
      insertMessage: vi.fn(async () => ({ inserted: true })), logEvent: vi.fn(async () => {}), upsertConversation: vi.fn(async (c: any) => c),
      getProfile: vi.fn(async () => ({})), recentConversationLogs: vi.fn(async () => []),
      logConversation: vi.fn(async () => {}), mergeProfile: vi.fn(async () => ({})),
    },
    wati: { sendText: vi.fn(async (_p: string, t: string) => { sent.push(t); return { ok: true, messageId: 'm' } }) },
    mediaBytes: vi.fn(), mb: {}, sent, ...over,
  } as any
}

describe('runTurn', () => {
  it('sends bubbles live', async () => {
    const d = deps(fakeAnthropic([text('Hola\n---\n¿En qué le ayudo?')]))
    const r = await runTurn('507', false, d)
    expect(r.bubbles).toEqual(['Hola', '¿En qué le ayudo?']); expect(d.sent).toEqual(['Hola', '¿En qué le ayudo?'])
  })
  it('shadow stores but does not send', async () => {
    const d = deps(fakeAnthropic([text('Hola')]))
    await runTurn('507', true, d)
    expect(d.sent).toEqual([]); expect(d.store.insertMessage.mock.calls[0][0]).toMatchObject({ shadow: true, author: 'camila' })
  })
  it('runs a tool then answers', async () => {
    const d = deps(fakeAnthropic([toolUse('get_hours', {}), text('Abrimos 9am')]))
    const r = await runTurn('507', false, d)
    expect(r.bubbles).toEqual(['Abrimos 9am']); expect(d.anthropic.messages.create).toHaveBeenCalledTimes(2)
    const second = d.anthropic.messages.create.mock.calls[1][0]
    expect(second.messages.at(-1).content[0]).toMatchObject({ type: 'tool_result', tool_use_id: 't1' })
  })
  it('returns empty and logs error when conversation is missing', async () => {
    const d = deps(fakeAnthropic([text('Hola')]), { store: undefined })
    d.store = {
      getConversation: vi.fn(async () => null),
      recentMessages: vi.fn(async () => []),
      activeMedia: vi.fn(async () => []), getSetting: vi.fn(async (_k: string, f: any) => f),
      insertMessage: vi.fn(async () => ({ inserted: true })), logEvent: vi.fn(async () => {}), upsertConversation: vi.fn(async (c: any) => c),
      getProfile: vi.fn(async () => ({})), recentConversationLogs: vi.fn(async () => []),
      logConversation: vi.fn(async () => {}), mergeProfile: vi.fn(async () => ({})),
    }
    const r = await runTurn('507', false, d)
    expect(r).toEqual({ bubbles: [], handedOff: false })
    expect(d.store.logEvent).toHaveBeenCalledWith('507', 'error', expect.objectContaining({}))
    const call = d.store.logEvent.mock.calls.find((c: any) => c[1] === 'error')
    expect(call).toBeTruthy()
  })
  it('stops sending and does not store the message when sendText fails', async () => {
    const d = deps(fakeAnthropic([text('Hola\n---\n¿En qué le ayudo?')]))
    d.wati.sendText = vi.fn(async () => ({ ok: false, error: 'x' }))
    const r = await runTurn('507', false, d)
    expect(r.bubbles).toEqual([])
    expect(d.store.insertMessage).not.toHaveBeenCalled()
    const call = d.store.logEvent.mock.calls.find((c: any) => c[1] === 'error' && c[2]?.where === 'sendText')
    expect(call).toBeTruthy()
  })
  it('never leaves the customer in silence when the model replies with nothing', async () => {
    const d = deps(fakeAnthropic([{ stop_reason: 'end_turn', content: [], usage: {} }]))
    d.wati.updateAttributes = vi.fn(async () => ({ ok: true }))
    d.wati.assignOperator = vi.fn(async () => ({ ok: true }))
    d.wati.sendButtons = vi.fn(async () => ({ ok: true }))
    d.wati.startChatbot = vi.fn(async () => ({ ok: true }))
    const r = await runTurn('507', false, d)
    expect(r.handedOff).toBe(true)
    expect(r.bubbles).toEqual([])
    expect(d.sent).toHaveLength(1)
    expect(d.sent[0]).toContain('compañera')
    const call = d.store.logEvent.mock.calls.find((c: any) => c[1] === 'error' && c[2]?.error === 'empty reply')
    expect(call).toBeTruthy()
  })

  it('a bookkeeping failure after a successful send does not apologise or hand off', async () => {
    const d = deps(fakeAnthropic([text('Hola')]))
    d.wati.updateAttributes = vi.fn(async () => ({ ok: true }))
    d.wati.assignOperator = vi.fn(async () => ({ ok: true }))
    d.wati.startChatbot = vi.fn(async () => ({ ok: true }))
    d.store.upsertConversation = vi.fn(async () => { throw new Error('supabase blip') })

    const r = await runTurn('507', false, d)

    expect(r).toEqual({ bubbles: ['Hola'], handedOff: false })
    expect(d.sent).toEqual(['Hola'])
    expect(d.wati.assignOperator).not.toHaveBeenCalled()
    const bookkeeping = d.store.logEvent.mock.calls.find((c: any) => c[2]?.where === 'runTurn/bookkeeping')
    expect(bookkeeping).toBeTruthy()
  })

  it('passes only the last 3 customer texts to the tools as recentInbound', async () => {
    const d = deps(fakeAnthropic([
      toolUse('book', { sucursal: 'cde', date: '2026-09-06', time: '10:00', service_ids: [10], people: 1, customer_confirmation: 'si confirmo' }),
      text('listo'),
    ]))
    d.store.getConversation = vi.fn(async () => ({ phone: '507', mode: 'agent', sucursal: 'cde', mindbody_client_id: 'C1', client_name: 'Ana', summary: null, audio_count: 0 }))
    d.mb = { book: vi.fn(async () => ({ appointmentIds: [1], therapist: 'Ana' })), listServices: vi.fn(async () => []) }
    d.store.recentMessages = vi.fn(async () => [
      { phone: '507', direction: 'in', author: 'customer', type: 'text', text: 'si confirmo', shadow: false },
      { phone: '507', direction: 'in', author: 'customer', type: 'text', text: 'uno', shadow: false },
      { phone: '507', direction: 'in', author: 'customer', type: 'text', text: 'dos', shadow: false },
      { phone: '507', direction: 'in', author: 'customer', type: 'text', text: 'tres', shadow: false },
    ])

    await runTurn('507', false, d)

    // The "si confirmo" is older than the 3-message window, so the guard must reject it.
    expect(d.mb.book).not.toHaveBeenCalled()
    const rejected = d.store.logEvent.mock.calls.find((c: any) => c[1] === 'tool_result' && String(c[2]?.result).includes('texto exacto'))
    expect(rejected).toBeTruthy()
  })

  it('refreshes summary when camila message count crosses a multiple of 6', async () => {
    const d = deps(fakeAnthropic([text('Hola\n---\n¿En qué le ayudo?'), text('Resumen actualizado')]))
    d.store.recentMessages = vi.fn(async () => [
      ...Array.from({ length: 5 }, (_, i) => ({ phone: '507', direction: 'out', author: 'camila', type: 'text', text: `msg${i}`, shadow: false })),
      { phone: '507', direction: 'in', author: 'customer', type: 'text', text: 'hola', shadow: false },
    ])
    const r = await runTurn('507', false, d)
    expect(r.bubbles).toEqual(['Hola', '¿En qué le ayudo?'])
    expect(d.anthropic.messages.create).toHaveBeenCalledTimes(2)
    expect(d.store.upsertConversation).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Resumen actualizado' }))
  })
})

describe('runTurn client memory', () => {
  it('puts the stored profile and history in the system prompt', async () => {
    const d = deps(fakeAnthropic([text('Hola señora Ana')]))
    d.store.getProfile = vi.fn(async () => ({ nombre: 'Ana Ruiz', tratamientos: ['Masaje relajante'] }))
    d.store.recentConversationLogs = vi.fn(async () => [{ phone: '507', started_at: 'a', ended_at: '2026-08-01T00:00:00Z', outcome: 'booked', summary: 'Reservó masaje' }])
    await runTurn('507', false, d)
    const system = d.anthropic.messages.create.mock.calls[0][0].system
    const volatile = system[1].text
    expect(volatile).toContain('Perfil: nombre Ana Ruiz')
    expect(volatile).toContain('Reservó masaje')
  })

  it('skips the Mindbody lookup for an unknown contact', async () => {
    const d = deps(fakeAnthropic([text('Hola')]))
    d.mb = { findClientByPhone: vi.fn(async () => null), findClientByEmail: vi.fn(async () => null) }
    await runTurn('507', false, d)
    expect(d.mb.findClientByPhone).not.toHaveBeenCalled()
    expect(d.anthropic.messages.create.mock.calls[0][0].system[1].text).not.toContain('Cliente Mindbody')
  })

  it('looks the client up once and caches the id when the profile has an email', async () => {
    const d = deps(fakeAnthropic([text('Hola')]))
    d.store.getProfile = vi.fn(async () => ({ correo: 'a@x.com' }))
    d.mb = {
      findClientByPhone: vi.fn(async () => ({ id: 'C1', name: 'Ana Ruiz', email: 'a@x.com', lastVisits: ['2026-08-01 Masaje', '2026-07-02 Facial'] })),
      findClientByEmail: vi.fn(async () => null),
    }
    await runTurn('507', false, d)
    expect(d.mb.findClientByPhone).toHaveBeenCalledTimes(1)
    expect(d.anthropic.messages.create.mock.calls[0][0].system[1].text).toContain('Cliente Mindbody: Ana Ruiz, últimas visitas: 2026-08-01 Masaje')
    expect(d.store.upsertConversation).toHaveBeenCalledWith(expect.objectContaining({ mindbody_client_id: 'C1', client_name: 'Ana Ruiz' }))
  })

  it('a failing Mindbody lookup does not break the turn', async () => {
    const d = deps(fakeAnthropic([text('Hola')]))
    d.store.getProfile = vi.fn(async () => ({ correo: 'a@x.com' }))
    d.mb = { findClientByPhone: vi.fn(async () => { throw new Error('mindbody caído') }), findClientByEmail: vi.fn() }
    const r = await runTurn('507', false, d)
    expect(r.bubbles).toEqual(['Hola'])
  })

  it('remembers the conversation after close_chat', async () => {
    const d = deps(fakeAnthropic([]))
    d.wati.updateChatStatus = vi.fn(async () => ({ ok: true }))
    let calls = 0
    d.anthropic.messages.create = vi.fn(async () => {
      calls++
      if (calls === 1) return toolUse('close_chat', {})
      return { stop_reason: 'end_turn', content: [{ type: 'text', text: '{"resumen":"Solo preguntó el horario","perfil":{}}' }], usage: {} }
    }) as any
    await runTurn('507', false, d)
    expect(d.store.logConversation).toHaveBeenCalledWith(expect.objectContaining({ outcome: 'closed', summary: 'Solo preguntó el horario' }))
  })

  it('does not write a conversation log in shadow mode', async () => {
    const d = deps(fakeAnthropic([toolUse('close_chat', {}), text('ok')]))
    d.wati.updateChatStatus = vi.fn(async () => ({ ok: true }))
    await runTurn('507', true, d)
    expect(d.store.logConversation).not.toHaveBeenCalled()
  })
})
