import { describe, it, expect, vi } from 'vitest'
import { executeTool } from './execute'
import { performHandoff } from '../handoff'

vi.mock('../handoff', () => ({ performHandoff: vi.fn(async () => {}) }))

const deps = (over: Partial<any> = {}) => ({
  store: { logEvent: vi.fn(async () => {}), upsertConversation: vi.fn(async (c: any) => c), getSetting: vi.fn(async (_k: string, f: any) => f), mergeProfile: vi.fn(async (_p: string, patch: any) => patch) },
  wati: { sendText: vi.fn(async () => ({ ok: true })), sendFile: vi.fn(async () => ({ ok: true })), sendButtons: vi.fn(async () => ({ ok: true })), updateChatStatus: vi.fn(async () => ({ ok: true })) },
  conv: { phone: '507', sucursal: 'cde', mindbody_client_id: 'C1', client_name: 'Ana', summary: null },
  origin: 'https://x', shadow: false, now: new Date('2026-09-05T08:00:00-05:00'), recentInbound: ['si, confirmo'],
  mediaBytes: vi.fn(async () => ({ bytes: new Uint8Array([1]), mime: 'image/png', filename: 'a.png' })),
  mb: { upcoming: vi.fn(async () => [{ id: 9, start: '2026-09-05T10:00:00', service: 'Relax', location: 'Costa del Este' }]), cancelAppointment: vi.fn(async () => true), listServices: vi.fn(async () => []) },
  ...over,
}) as any

describe('executeTool', () => {
  it('book rejects a confirmation the customer never wrote', async () => {
    const d = deps({ recentInbound: ['a que hora abren?'] })
    const r = await executeTool('book', { customer_confirmation: 'si' }, d)
    expect(r.isError).toBe(true)
    expect(r.result).toBe('La confirmación debe ser el texto exacto que escribió el cliente')
  })
  it('book accepts a confirmation quoted from a recent inbound message', async () => {
    const d = deps({
      recentInbound: ['cuanto cuesta?', 'Sí, confírmelo por favor'],
      mb: { book: vi.fn(async () => ({ appointmentIds: [1], therapist: 'Ana' })), listServices: vi.fn(async () => []) },
    })
    const r = await executeTool('book', { sucursal: 'cde', date: '2026-09-06', time: '10:00', service_ids: [10], people: 1, customer_confirmation: 'sí, confírmelo por favor' }, d)
    expect(r.isError).toBeUndefined()
    expect(d.mb.book).toHaveBeenCalled()
  })
  it('book without confirmation is an error', async () => {
    const r = await executeTool('book', { customer_confirmation: '' }, deps())
    expect(r.isError).toBe(true)
  })
  it('cancel inside 24h succeeds', async () => {
    const d = deps(); const r = await executeTool('cancel', { appointment_id: 9, customer_confirmation: 'si' }, d)
    expect(d.mb.cancelAppointment).toHaveBeenCalled(); expect(r.result).toBe('cancelada')
  })
  it('create_client reports a newly created client', async () => {
    const d = deps({ mb: { createClient: vi.fn(async () => ({ id: 'C2' })), listServices: vi.fn(async () => []) } })
    const r = await executeTool('create_client', { first_name: 'Ana', last_name: 'Ruiz', email: 'a@x.com' }, d)
    expect(r.result).toContain('cliente creado')
    expect(r.convPatch).toMatchObject({ mindbody_client_id: 'C2' })
  })
  it('create_client reports an existing client found by email', async () => {
    const d = deps({ mb: { createClient: vi.fn(async () => ({ id: 'C1', existing: true })), listServices: vi.fn(async () => []) } })
    const r = await executeTool('create_client', { first_name: 'Ana', last_name: 'Ruiz', email: 'a@x.com' }, d)
    expect(r.result).toContain('cliente existente encontrado por correo')
  })
  it('get_location_info returns waze', async () => {
    const r = await executeTool('get_location_info', { sucursal: 'sfc' }, deps())
    expect(r.result).toContain('waze')
  })
  it('get_location_info merges business_overrides over the bundled defaults', async () => {
    const d = deps({
      store: {
        logEvent: vi.fn(async () => {}),
        upsertConversation: vi.fn(async (c: any) => c),
        getSetting: vi.fn(async (k: string, f: any) =>
          k === 'business_overrides' ? { sfc: { address: 'Calle 74 este detrás de la delta de Calle 50', parking: 'Estacionamiento propio' } } : f
        ),
      },
    })
    const r = JSON.parse((await executeTool('get_location_info', { sucursal: 'sfc' }, d)).result)
    expect(r.direccion).toBe('Calle 74 este detrás de la delta de Calle 50')
    expect(r.estacionamiento).toBe('Estacionamiento propio')
    // Unset fields fall back to BUSINESS.
    expect(r.waze).toContain('waze.com')
    expect(r.nombre).toBe('San Francisco')
  })
  it('get_location_info is unaffected by an override for the other location', async () => {
    const d = deps({
      store: {
        logEvent: vi.fn(async () => {}),
        upsertConversation: vi.fn(async (c: any) => c),
        getSetting: vi.fn(async (k: string, f: any) => (k === 'business_overrides' ? { sfc: { address: 'X' } } : f)),
      },
    })
    const r = JSON.parse((await executeTool('get_location_info', { sucursal: 'cde' }, d)).result)
    expect(r.direccion).toContain('Star Plaza')
  })
  it('get_payment_info returns the payment text from BUSINESS', async () => {
    const r = await executeTool('get_payment_info', {}, deps())
    expect(r.isError).toBeUndefined()
    expect(r.result).toContain('YAPPY')
    expect(r.result).toContain('Banco General')
  })
  it('send_image in shadow does not send', async () => {
    const d = deps({ shadow: true, store: { logEvent: vi.fn(async () => {}), activeMedia: vi.fn(async () => [{ key: 'promo', storage_path: 'p', caption: 'c', description: '', active: true, valid_from: null, valid_until: null }]) } })
    await executeTool('send_image', { key: 'promo' }, d)
    expect(d.wati.sendFile).not.toHaveBeenCalled()
  })
  it('send_buttons ends the turn like close_chat, so the model cannot repeat the question in a text bubble', async () => {
    const d = deps()
    const r = await executeTool('send_buttons', { body: '¿Correcto?', buttons: ['Sí, confirmar', 'Cambiar hora'] }, d)
    expect(d.wati.sendButtons).toHaveBeenCalled()
    expect(r.endTurn).toBe(true)
  })
  it('send_buttons in shadow also ends the turn', async () => {
    const d = deps({ shadow: true, store: { logEvent: vi.fn(async () => {}) } })
    const r = await executeTool('send_buttons', { body: '¿Correcto?', buttons: ['Sí, confirmar', 'Cambiar hora'] }, d)
    expect(r.endTurn).toBe(true)
  })
  it('reschedule keeps the original appointment when booking the new slot fails', async () => {
    const d = deps({
      mb: {
        upcoming: vi.fn(async () => [{ id: 9, start: '2026-09-10T10:00:00', service: 'Relax', location: 'Costa del Este', sessionTypeId: 1 }]),
        cancelAppointment: vi.fn(async () => true),
        book: vi.fn(async () => { throw new Error('slot gone') }),
        listServices: vi.fn(async () => []),
      },
    })
    const r = await executeTool('reschedule', { appointment_id: 9, date: '2026-09-11', time: '10:00', customer_confirmation: 'si' }, d)
    expect(d.mb.cancelAppointment).not.toHaveBeenCalled()
    expect(r.isError).toBe(true)
    expect(r.result).toContain('sigue en pie')
  })
  it('reschedule books the new slot before cancelling the old one', async () => {
    const order: string[] = []
    const d = deps({
      mb: {
        upcoming: vi.fn(async () => [{ id: 9, start: '2026-09-10T10:00:00', service: 'Relax', location: 'Costa del Este', sessionTypeId: 1 }]),
        cancelAppointment: vi.fn(async () => { order.push('cancel'); return true }),
        book: vi.fn(async () => { order.push('book'); return { id: 42, start: '2026-09-11T10:00:00' } }),
        listServices: vi.fn(async () => []),
      },
    })
    const r = await executeTool('reschedule', { appointment_id: 9, date: '2026-09-11', time: '10:00', customer_confirmation: 'si' }, d)
    expect(order).toEqual(['book', 'cancel'])
    expect(r.isError).toBeUndefined()
    expect(r.result).toContain('42')
  })
  it('list_services returns convPatch.sucursal when a valid sucursal differs from the conversation', async () => {
    const d = deps({ conv: { phone: '507', sucursal: null, mindbody_client_id: 'C1', client_name: 'Ana', summary: null } })
    const r = await executeTool('list_services', { sucursal: 'sfc', query: 'masaje' }, d)
    expect(r.convPatch).toEqual({ sucursal: 'sfc' })
  })
  it('list_services omits convPatch when the sucursal matches the conversation', async () => {
    const r = await executeTool('list_services', { sucursal: 'cde', query: 'masaje' }, deps())
    expect(r.convPatch).toBeUndefined()
  })
  it('handoff upserts the sucursal before calling performHandoff when it was unknown', async () => {
    const d = deps({ conv: { phone: '507', sucursal: null, mindbody_client_id: 'C1', client_name: 'Ana', summary: null } })
    const r = await executeTool('handoff', { motivo: 'queja', resumen: 'resumen', sucursal: 'sfc' }, d)
    expect(d.store.upsertConversation).toHaveBeenCalledWith(expect.objectContaining({ phone: '507', sucursal: 'sfc' }))
    expect(performHandoff).toHaveBeenCalledWith(expect.objectContaining({ conv: expect.objectContaining({ sucursal: 'sfc' }) }))
    expect(r.convPatch).toEqual({ sucursal: 'sfc' })
    expect(r.endTurn).toBe(true)
  })
  it('handoff does not touch the sucursal when it is already known', async () => {
    const d = deps()
    await executeTool('handoff', { motivo: 'queja', resumen: 'resumen', sucursal: '' }, d)
    expect(d.store.upsertConversation).not.toHaveBeenCalled()
    expect(performHandoff).toHaveBeenCalledWith(expect.objectContaining({ conv: expect.objectContaining({ sucursal: 'cde' }) }))
  })
})

describe('note_to_self profile memory', () => {
  const empty = { nombre: '', correo: '', sucursal_preferida: '', tratamientos: [], preferencias: [], notas: [] }

  it('appends to the summary and does not touch the profile when the patch is empty', async () => {
    const d = deps()
    const r = await executeTool('note_to_self', { text: 'prefiere la tarde', perfil: empty }, d)
    expect(r.convPatch).toMatchObject({ summary: 'prefiere la tarde' })
    expect(d.store.mergeProfile).not.toHaveBeenCalled()
  })

  it('merges the non-empty profile fields', async () => {
    const d = deps()
    await executeTool('note_to_self', { text: 'nota', perfil: { ...empty, nombre: 'Ana Ruiz', sucursal_preferida: 'sfc', notas: ['alergia al eucalipto'] } }, d)
    expect(d.store.mergeProfile).toHaveBeenCalledWith('507', expect.objectContaining({
      nombre: 'Ana Ruiz', sucursal_preferida: 'sfc', notas: ['alergia al eucalipto'],
    }))
  })

  it('drops an invalid sucursal_preferida instead of storing it', async () => {
    const d = deps()
    await executeTool('note_to_self', { text: 'n', perfil: { ...empty, sucursal_preferida: 'panama', notas: ['x'] } }, d)
    expect(d.store.mergeProfile.mock.calls[0][1].sucursal_preferida).toBeUndefined()
  })

  it('tolerates a missing perfil object', async () => {
    const d = deps()
    const r = await executeTool('note_to_self', { text: 'solo texto' }, d)
    expect(r.result).toBe('anotado')
    expect(d.store.mergeProfile).not.toHaveBeenCalled()
  })
})

describe('client lookup feeds the profile', () => {
  it('find_client remembers name and email', async () => {
    const d = deps({ mb: { findClientByPhone: vi.fn(async () => ({ id: 'C1', name: 'Ana Ruiz', email: 'a@x.com', lastVisits: [] })) } })
    await executeTool('find_client', {}, d)
    expect(d.store.mergeProfile).toHaveBeenCalledWith('507', { nombre: 'Ana Ruiz', correo: 'a@x.com' })
  })
  it('create_client remembers name and email', async () => {
    const d = deps({ mb: { createClient: vi.fn(async () => ({ id: 'C2' })) } })
    await executeTool('create_client', { first_name: 'Ana', last_name: 'Ruiz', email: 'a@x.com' }, d)
    expect(d.store.mergeProfile).toHaveBeenCalledWith('507', { nombre: 'Ana Ruiz', correo: 'a@x.com' })
  })
})

describe('suggestions, addons, therapists and menu links', () => {
  it('get_suggestions combines active promotions with the best sellers', async () => {
    const d = deps({
      promotions: vi.fn(async () => [{ id: 'p1', titulo: 'Promo 2x1', precio: 99, precio_original: 150, minutos: 90, servicios: [10, 12], incluye: [{ id: 10, nombre: 'Mimosa Relax - 60 min', minutos: 60 }, { id: 12, nombre: 'Extra Piedras Calientes', minutos: 30 }], duracion_total: 90, valido_hasta: '2026-09-30' }]),
      mb: { bestSellers: vi.fn(async () => [{ id: 10, name: 'Mimosa Relax - 60 min', minutes: 60, price: 75, category: 'Masajes' }]) },
    })
    d.store.getSetting = vi.fn(async (k: string, f: any) => (k === 'best_sellers' ? [10] : f))
    const r = await executeTool('get_suggestions', { sucursal: 'cde' }, d)
    expect(r.isError).toBeUndefined()
    expect(d.mb.bestSellers).toHaveBeenCalledWith('cde', [10])
    const out = JSON.parse(r.result)
    expect(out.promociones[0].titulo).toBe('Promo 2x1')
    expect(out.promociones[0].id).toBe('p1')
    expect(out.promociones[0].incluye).toEqual(['Mimosa Relax - 60 min', 'Extra Piedras Calientes'])
    expect(out.promociones[0].servicios).toEqual([10, 12])
    expect(out.promociones[0].minutos).toBe(90)
    expect(out.mas_pedidos).toEqual([{ id: 10, nombre: 'Mimosa Relax - 60 min', minutos: 60, precio: 75 }])
  })

  it('get_suggestions still answers when the promotions query fails', async () => {
    const d = deps({
      promotions: vi.fn(async () => { throw new Error('supabase down') }),
      mb: { bestSellers: vi.fn(async () => []) },
    })
    const r = await executeTool('get_suggestions', { sucursal: 'cde' }, d)
    expect(r.isError).toBeUndefined()
    expect(JSON.parse(r.result).promociones).toEqual([])
    expect(d.store.logEvent).toHaveBeenCalled()
  })

  it('list_addons returns the mapped extras', async () => {
    const d = deps({ mb: { listAddons: vi.fn(async () => [{ id: 90, name: 'Piedras calientes', minutes: 15, price: 15 }]) } })
    const r = await executeTool('list_addons', { sucursal: 'sfc' }, d)
    expect(JSON.parse(r.result)[0].name).toBe('Piedras calientes')
    expect(r.convPatch).toMatchObject({ sucursal: 'sfc' })
  })

  it('list_therapists says so when nobody is free', async () => {
    const d = deps({ mb: { listTherapists: vi.fn(async () => []) } })
    const r = await executeTool('list_therapists', { sucursal: 'cde', date: '2026-09-06', service_ids: [10] }, d)
    expect(r.result).toContain('ofrece otra fecha')
  })

  it('get_menu_link returns the public URL', async () => {
    const r = await executeTool('get_menu_link', { seccion: 'faciales' }, deps())
    expect(r.result).toBe('https://www.mimosaretreat.com/es/menu/faciales')
  })

  it('book passes add-ons and the requested therapist through', async () => {
    const d = deps({
      recentInbound: ['si, confirmo'],
      mb: { book: vi.fn(async () => ({ appointmentIds: [1], therapist: 'Lucía' })), listServices: vi.fn(async () => []) },
    })
    await executeTool('book', { sucursal: 'cde', date: '2026-09-06', time: '10:00', service_ids: [10], addon_ids: [90], staff_id: 2, people: 1, customer_confirmation: 'si, confirmo' }, d)
    expect(d.mb.book).toHaveBeenCalledWith(expect.objectContaining({ addonIds: [90], staffId: 2 }))
  })

  it('book passes the chosen promotion through to the adapter', async () => {
    const d = deps({
      conv: { phone: '507', sucursal: 'cde', mindbody_client_id: 'C1', client_name: 'Ana' },
      mb: { book: vi.fn(async () => ({ appointmentIds: [1, 2], therapist: 'Lucía' })), listServices: vi.fn(async () => []) },
    })
    await executeTool('book', { sucursal: 'cde', date: '2026-09-06', time: '10:00', service_ids: [49, 170], addon_ids: [], staff_id: 0, people: 1, promo_title: 'Escape Mimosa', promo_service_ids: [49, 170], customer_confirmation: 'si, confirmo' }, d)
    expect(d.mb.book).toHaveBeenCalledWith(expect.objectContaining({ promoTitle: 'Escape Mimosa', promoServiceIds: [49, 170] }))
  })

  it('book without a promotion sends empty promo fields', async () => {
    const d = deps({
      conv: { phone: '507', sucursal: 'cde', mindbody_client_id: 'C1', client_name: 'Ana' },
      mb: { book: vi.fn(async () => ({ appointmentIds: [1], therapist: 'Ana' })), listServices: vi.fn(async () => []) },
    })
    await executeTool('book', { sucursal: 'cde', date: '2026-09-06', time: '10:00', service_ids: [10], addon_ids: [], staff_id: 0, people: 1, promo_title: '', promo_service_ids: [], customer_confirmation: 'si, confirmo' }, d)
    expect(d.mb.book).toHaveBeenCalledWith(expect.objectContaining({ promoTitle: '', promoServiceIds: [] }))
  })

  it('book with staff_id 0 books with any available therapist', async () => {
    const d = deps({
      recentInbound: ['si, confirmo'],
      mb: { book: vi.fn(async () => ({ appointmentIds: [1], therapist: 'Ana' })), listServices: vi.fn(async () => []) },
    })
    await executeTool('book', { sucursal: 'cde', date: '2026-09-06', time: '10:00', service_ids: [10], addon_ids: [], staff_id: 0, people: 1, customer_confirmation: 'si, confirmo' }, d)
    expect(d.mb.book).toHaveBeenCalledWith(expect.objectContaining({ addonIds: [], staffId: undefined }))
  })

  it('book surfaces the adapter error when the therapist is taken', async () => {
    const d = deps({
      recentInbound: ['si, confirmo'],
      mb: { book: vi.fn(async () => { throw new Error('Esa terapeuta no está disponible a esa hora; ofrécele otra hora u otra terapeuta') }), listServices: vi.fn(async () => []) },
    })
    const r = await executeTool('book', { sucursal: 'cde', date: '2026-09-06', time: '10:00', service_ids: [10], addon_ids: [], staff_id: 2, people: 1, customer_confirmation: 'si, confirmo' }, d)
    expect(r.isError).toBe(true)
    expect(r.result).toContain('Esa terapeuta no está disponible')
  })
})

describe('website knowledge tools', () => {
  const knowledge = async () => ({
    catalogText: '## Catálogo de tratamientos',
    treatments: [
      { id: 10, name: 'Masaje Mimosa Relax', category: 'Masajes', minutes: 60, price: 75, description: 'Masaje sueco suave.', topPick: true },
      { id: 12, name: 'Liberador de Tensión', category: 'Masajes', minutes: 60, price: 80, description: 'Presión profunda.', topPick: false },
    ],
    topics: {
      parejas: 'Parejas y Ocasiones: cabinas dobles.',
      club: 'Club Mimosa: ritual mensual.',
      empresas: 'Empresas: bienestar corporativo.',
      primera_visita: 'Primera visita.',
      referidos: 'Referidos: próximamente.',
      giftcards: 'Certificados: mimosaretreat.com/giftcards.',
      politicas: 'Cambios y cancelaciones sin penalidad.',
      ubicaciones: 'Costa del Este y San Francisco.',
    },
    builtAt: '2026-09-01T00:00:00.000Z',
  })

  it('get_treatment_details returns the full entry for a fuzzy name', async () => {
    const r = await executeTool('get_treatment_details', { name: 'liberador de tension' }, deps({ knowledge }))
    expect(r.isError).toBeUndefined()
    const out = JSON.parse(r.result)
    expect(out).toMatchObject({ encontrado: true, nombre: 'Liberador de Tensión', minutos: 60, precio: 80, descripcion: 'Presión profunda.' })
  })

  it('get_treatment_details suggests alternatives when nothing matches', async () => {
    const r = await executeTool('get_treatment_details', { name: 'reflexología podal' }, deps({ knowledge }))
    const out = JSON.parse(r.result)
    expect(out.encontrado).toBe(false)
    expect(out.parecidos.length).toBeGreaterThan(0)
    expect(out.parecidos.length).toBeLessThanOrEqual(3)
  })

  it('get_site_info returns the topic text', async () => {
    const r = await executeTool('get_site_info', { tema: 'politicas' }, deps({ knowledge }))
    expect(r.result).toContain('sin penalidad')
    const g = await executeTool('get_site_info', { tema: 'giftcards' }, deps({ knowledge }))
    expect(g.result).toContain('mimosaretreat.com/giftcards')
  })

  it('get_site_info rejects an unknown topic', async () => {
    const r = await executeTool('get_site_info', { tema: 'menu' }, deps({ knowledge }))
    expect(r.isError).toBe(true)
    expect(r.result).toContain('Tema desconocido')
  })

  it('reports a knowledge failure as a tool error instead of throwing', async () => {
    const d = deps({ knowledge: async () => { throw new Error('sin conocimiento') } })
    const r = await executeTool('get_site_info', { tema: 'club' }, d)
    expect(r.isError).toBe(true)
    expect(r.result).toContain('sin conocimiento')
  })
})

