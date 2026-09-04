import { describe, it, expect } from 'vitest'
import { createStore } from './store'

function fakeSupabase(responses: Record<string, any>) {
  const chain = (table: string) => {
    const q: any = {}
    const self = () => q
    for (const m of ['select','insert','upsert','update','eq','gte','order','limit','in','lte','or','is']) q[m] = self
    q.single = async () => responses[table] ?? { data: null, error: null }
    q.maybeSingle = q.single
    q.then = (res: any) => Promise.resolve(responses[table] ?? { data: [], error: null }).then(res)
    return q
  }
  return { from: (t: string) => chain(t) } as any
}

describe('store', () => {
  it('insertMessage reports duplicate on unique violation', async () => {
    const s = createStore(fakeSupabase({ wati_agent_messages: { data: null, error: { code: '23505', message: 'dup' } } }))
    expect(await s.insertMessage({ phone: '1', wati_message_id: 'a', direction: 'in', author: 'customer', type: 'text', text: 'x', media_ref: null, shadow: false })).toEqual({ inserted: false })
  })
  it('getSetting falls back', async () => {
    const s = createStore(fakeSupabase({ wati_agent_settings: { data: null, error: null } }))
    expect(await s.getSetting('enabled', true)).toBe(true)
  })
})
