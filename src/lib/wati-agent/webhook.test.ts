import { describe, it, expect } from 'vitest'
import { authorized, parseInbound, parseSent, isHumanOperator, shouldDebounceSkip, fallbackMessageId } from './webhook'

describe('webhook', () => {
  it('authorizes by token query', () => expect(authorized('https://x/api?token=abc', 'abc')).toBe(true))
  it('rejects wrong token', () => expect(authorized('https://x/api?token=zzz', 'abc')).toBe(false))
  it('parses inbound text', () => {
    const e = parseInbound({ waId: '50766124546', senderName: 'Ana', whatsappMessageId: 'w1', text: 'hola', type: 'text', owner: false, ticketId: 't', data: null })
    expect(e).toMatchObject({ phone: '50766124546', messageId: 'w1', text: 'hola', type: 'text', owner: false })
  })
  it('parses inbound image with data filename', () => {
    const e = parseInbound({ waId: '507', whatsappMessageId: 'w2', type: 'image', data: { fileName: 'data/images/a.jpg' }, owner: false })
    expect(e?.mediaRef).toBe('data/images/a.jpg')
  })
  it('returns null without waId', () => expect(parseInbound({})).toBeNull())
  it('human operator detection', () => {
    const e = parseSent({ waId: '507', whatsappMessageId: 'w3', operatorEmail: 'karen@mimosa.com', owner: true })!
    expect(isHumanOperator(e, 'asistente@mimosa.com', [''])).toBe(true)
    expect(isHumanOperator({ ...e, operatorEmail: 'asistente@mimosa.com' }, 'asistente@mimosa.com', [''])).toBe(false)
    expect(isHumanOperator({ ...e, operatorEmail: null }, 'asistente@mimosa.com', [''])).toBe(false)
  })
  it('debounce skip when newer exists', () => { expect(shouldDebounceSkip(10, 9)).toBe(true); expect(shouldDebounceSkip(9, 9)).toBe(false) })
  it('parses Connect AI Agents fallback shape (no waId)', () => {
    const e = parseInbound({ contact: { phone: '50766124546' }, messageType: 'text', text: 'hola', id: 'm1' })
    expect(e).toMatchObject({ phone: '50766124546', type: 'text', text: 'hola' })
  })
  it('fallbackMessageId is stable for identical input and differs when text changes', () => {
    const base = { phone: '50766124546', text: 'hola', type: 'text', timestamp: '123' }
    expect(fallbackMessageId(base)).toBe(fallbackMessageId({ ...base }))
    expect(fallbackMessageId(base)).not.toBe(fallbackMessageId({ ...base, text: 'adios' }))
  })
  it('parseSent falls back to contact.waId / contact.phone / phone when waId is missing', () => {
    expect(parseSent({ contact: { waId: '50766124546' }, whatsappMessageId: 'w1', owner: true })).toMatchObject({ phone: '50766124546' })
    expect(parseSent({ contact: { phone: '50766124546' }, whatsappMessageId: 'w2', owner: true })).toMatchObject({ phone: '50766124546' })
    expect(parseSent({ phone: '50766124546', whatsappMessageId: 'w3', owner: true })).toMatchObject({ phone: '50766124546' })
  })
})
