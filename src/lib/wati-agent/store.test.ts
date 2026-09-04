import { describe, it, expect } from 'vitest'
import { createStore, isEmptyProfilePatch, mergeProfiles } from './store'

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
  it('recentOutboundExists true when a matching row is found', async () => {
    const s = createStore(fakeSupabase({ wati_agent_messages: { data: [{ id: 1 }], error: null } }))
    expect(await s.recentOutboundExists('507123', 'hola', 5 * 60_000)).toBe(true)
  })
  it('recentOutboundExists false when no matching row is found', async () => {
    const s = createStore(fakeSupabase({ wati_agent_messages: { data: [], error: null } }))
    expect(await s.recentOutboundExists('507123', 'hola', 5 * 60_000)).toBe(false)
  })
})

describe('mergeProfiles', () => {
  it('unions arrays without duplicates and keeps order', () => {
    const r = mergeProfiles({ tratamientos: ['Masaje relajante', 'Facial'] }, { tratamientos: ['facial', 'Pedicura'] }, '2026-09-05T00:00:00Z')
    expect(r.tratamientos).toEqual(['Masaje relajante', 'Facial', 'Pedicura'])
  })
  it('overwrites strings and stamps ultima_actualizacion', () => {
    const r = mergeProfiles({ nombre: 'Ana', correo: 'a@x.com' }, { nombre: 'Ana Ruiz' }, '2026-09-05T00:00:00Z')
    expect(r).toMatchObject({ nombre: 'Ana Ruiz', correo: 'a@x.com', ultima_actualizacion: '2026-09-05T00:00:00Z' })
  })
  it('treats empty strings and arrays as "no change"', () => {
    const r = mergeProfiles({ nombre: 'Ana', notas: ['alergia al eucalipto'] }, { nombre: '', correo: '  ', notas: [], preferencias: [] }, 'T')
    expect(r.nombre).toBe('Ana')
    expect(r.correo).toBeUndefined()
    expect(r.notas).toEqual(['alergia al eucalipto'])
    expect(r.preferencias).toBeUndefined()
  })
  it('trims incoming values', () => {
    expect(mergeProfiles({}, { nombre: ' Ana ', preferencias: [' cama caliente ', ''] }, 'T'))
      .toMatchObject({ nombre: 'Ana', preferencias: ['cama caliente'] })
  })
  it('isEmptyProfilePatch recognises an all-empty patch', () => {
    expect(isEmptyProfilePatch({ nombre: '', correo: '', tratamientos: [], notas: [] })).toBe(true)
    expect(isEmptyProfilePatch({ notas: ['x'] })).toBe(false)
  })
})

describe('profile store methods', () => {
  it('getProfile returns {} when the row has none', async () => {
    const s = createStore(fakeSupabase({ wati_agent_conversations: { data: null, error: null } }))
    expect(await s.getProfile('507')).toEqual({})
  })
  it('mergeProfile merges onto the stored profile', async () => {
    const s = createStore(fakeSupabase({ wati_agent_conversations: { data: { profile: { nombre: 'Ana', tratamientos: ['Facial'] } }, error: null } }))
    const r = await s.mergeProfile('507', { tratamientos: ['Masaje'], sucursal_preferida: 'cde' })
    expect(r.nombre).toBe('Ana')
    expect(r.tratamientos).toEqual(['Facial', 'Masaje'])
    expect(r.sucursal_preferida).toBe('cde')
    expect(r.ultima_actualizacion).toBeTruthy()
  })
  it('recentConversationLogs returns the rows', async () => {
    const s = createStore(fakeSupabase({ wati_agent_conversation_log: { data: [{ id: 1, phone: '507', started_at: 'a', outcome: 'booked', summary: 's' }], error: null } }))
    expect(await s.recentConversationLogs('507')).toHaveLength(1)
  })
})
