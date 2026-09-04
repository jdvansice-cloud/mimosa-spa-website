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
})
