import { describe, it, expect, vi } from 'vitest'
import { performHandoff } from './handoff'

const wati = () => ({ sendText: vi.fn(async () => ({ ok: true })), updateAttributes: vi.fn(async () => ({ ok: true })), startChatbot: vi.fn(async () => ({ ok: true })), assignOperator: vi.fn(async () => ({ ok: true })), sendButtons: vi.fn(async () => ({ ok: true })) }) as any
const store = () => ({ upsertConversation: vi.fn(async (c: any) => c), logEvent: vi.fn(async () => {}) }) as any
const conv = { phone: '507', sucursal: 'cde', mode: 'agent' } as any
const e = { handoffChatbotId: 'bot1', citasCdeEmail: 'cde@x', citasSfcEmail: 'sfc@x' } as any

describe('performHandoff', () => {
  it('starts the flow and flips mode', async () => {
    const w = wati(), s = store()
    await performHandoff({ store: s, wati: w, conv, motivo: 'queja', resumen: 'x', shadow: false, env: e })
    expect(w.startChatbot).toHaveBeenCalledWith('507', 'bot1')
    expect(w.updateAttributes.mock.calls[0][1]).toMatchObject({ ai_modo: 'humano', ai_motivo: 'queja', sucursal: 'cde' })
    expect(s.upsertConversation.mock.calls[0][0]).toMatchObject({ mode: 'human', handoff_reason: 'queja' })
  })
  it('falls back to assignOperator when flow fails', async () => {
    const w = wati(); w.startChatbot = vi.fn(async () => ({ ok: false, error: 'x' }))
    await performHandoff({ store: store(), wati: w, conv, motivo: 'queja', resumen: 'x', shadow: false, env: e })
    expect(w.assignOperator).toHaveBeenCalledWith('507', 'cde@x')
  })
  it('shadow sends nothing and keeps agent mode', async () => {
    const w = wati(), s = store()
    await performHandoff({ store: s, wati: w, conv, motivo: 'queja', resumen: 'x', shadow: true, env: e })
    expect(w.sendText).not.toHaveBeenCalled(); expect(w.startChatbot).not.toHaveBeenCalled()
    expect(s.upsertConversation).not.toHaveBeenCalled()
  })
})
