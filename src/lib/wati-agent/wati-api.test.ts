import { describe, it, expect, vi } from 'vitest'
import { createWatiClient } from './wati-api'

function mockFetch(status = 200, body: unknown = { result: true }) {
  const calls: Array<{ url: string; init: RequestInit }> = []
  const f = vi.fn(async (url: string, init: RequestInit) => {
    calls.push({ url, init })
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
  }) as unknown as typeof fetch
  return { f, calls }
}

describe('wati client', () => {
  it('sendText posts to ext/v3 with bearer', async () => {
    const { f, calls } = mockFetch()
    const c = createWatiClient({ baseUrl: 'https://x.wati.io/123', token: 'T', fetchImpl: f })
    const r = await c.sendText('50766124546', 'Hola')
    expect(r.ok).toBe(true)
    expect(calls[0].url).toBe('https://x.wati.io/api/ext/v3/conversations/messages/text')
    expect((calls[0].init.headers as Record<string, string>).Authorization).toBe('Bearer T')
    expect(JSON.parse(String(calls[0].init.body))).toEqual({ target: '50766124546', text: 'Hola' })
  })
  it('assignOperator without email assigns to bot', async () => {
    const { f, calls } = mockFetch()
    const c = createWatiClient({ baseUrl: 'https://x', token: 'T', fetchImpl: f })
    await c.assignOperator('507', null)
    expect(calls[0].url).toBe('https://x/api/v1/assignOperator?whatsappNumber=507')
  })
  it('assignOperator keeps the account id path under v1', async () => {
    const { f, calls } = mockFetch()
    const c = createWatiClient({ baseUrl: 'https://x.wati.io/123', token: 'T', fetchImpl: f })
    await c.assignOperator('507', null)
    expect(calls[0].url).toBe('https://x.wati.io/123/api/v1/assignOperator?whatsappNumber=507')
  })
  it('startChatbot strips the account id path for ext/v3', async () => {
    const { f, calls } = mockFetch()
    const c = createWatiClient({ baseUrl: 'https://x.wati.io/123', token: 'T', fetchImpl: f })
    await c.startChatbot('507', 'abc')
    expect(calls[0].url).toBe('https://x.wati.io/api/ext/v3/chatbots/start')
    expect(JSON.parse(String(calls[0].init.body))).toEqual({ chatbot_id: 'abc', target: '507' })
  })
  it('baseUrl without an account segment is unchanged for ext/v3', async () => {
    const { f, calls } = mockFetch()
    const c = createWatiClient({ baseUrl: 'https://x', token: 'T', fetchImpl: f })
    await c.startChatbot('507', 'abc')
    expect(calls[0].url).toBe('https://x/api/ext/v3/chatbots/start')
  })
  it('non-2xx returns ok:false with error', async () => {
    const { f } = mockFetch(401, { error: 'nope' })
    const c = createWatiClient({ baseUrl: 'https://x', token: 'T', fetchImpl: f })
    const r = await c.sendText('507', 'x')
    expect(r.ok).toBe(false)
    expect(r.error).toContain('401')
  })
})
