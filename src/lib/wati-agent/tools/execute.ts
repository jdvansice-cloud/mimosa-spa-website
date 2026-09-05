import { BUSINESS, menuLink, type BusinessOverrides } from '../config/business'
import { loadActivePromotions, type PromoSuggestion } from '../promotions'
import { getKnowledge, findTreatment, TOPIC_KEYS, type Knowledge, type TopicKey } from '../knowledge'
import { requireConfirmation } from './validate'
import { performHandoff } from '../handoff'
import { env } from '../config/env'
import { panamaDate } from '../hours'
import type { AgentStore } from '../store'
import type { WatiClient } from '../wati-api'
import { isEmptyProfilePatch } from '../store'
import type { ClientProfile, Conversation, Sucursal } from '../types'

export interface ToolDeps { store: AgentStore; wati: WatiClient; conv: Conversation; origin: string; shadow: boolean; now: Date; mediaBytes: (p: string) => Promise<{ bytes: Uint8Array; mime: string; filename: string }>; mb: typeof import('./mindbody-adapter'); recentInbound: string[]; promotions?: (today: string) => Promise<PromoSuggestion[]>; knowledge?: () => Promise<Knowledge> }
export interface ToolOutcome { result: string; isError?: boolean; endTurn?: boolean; convPatch?: Partial<Conversation> }

const json = (v: unknown) => JSON.stringify(v)

/** The strict tool schema forces every profile field to be present; empty means "unchanged". */
function toProfilePatch(raw: unknown): Partial<ClientProfile> {
  const p = (raw ?? {}) as Record<string, unknown>
  const str = (v: unknown) => (typeof v === 'string' ? v : '')
  const arr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [])
  const suc = str(p.sucursal_preferida)
  return {
    nombre: str(p.nombre),
    correo: str(p.correo),
    ...(suc === 'cde' || suc === 'sfc' ? { sucursal_preferida: suc as Sucursal } : {}),
    tratamientos: arr(p.tratamientos),
    preferencias: arr(p.preferencias),
    notas: arr(p.notas),
  }
}

const sucursalPatch = (input: any, current: Conversation['sucursal']): Partial<Conversation> | undefined => {
  const suc = input?.sucursal
  if ((suc === 'cde' || suc === 'sfc') && suc !== current) return { sucursal: suc }
  return undefined
}

export async function executeTool(name: string, input: any, d: ToolDeps): Promise<ToolOutcome> {
  const phone = d.conv.phone
  try {
    switch (name) {
      case 'get_location_info': {
        const suc = input.sucursal as 'cde' | 'sfc'
        const l = BUSINESS.locations[suc]
        // Owner-editable overrides win over the bundled defaults.
        const o = (await d.store.getSetting<BusinessOverrides>('business_overrides', {}))?.[suc] ?? {}
        return { result: json({ nombre: l.name, plaza: l.plaza, direccion: o.address || l.address, waze: o.wazeUrl || l.wazeUrl, maps: o.mapsUrl || l.mapsUrl, estacionamiento: o.parking || l.parking }), convPatch: sucursalPatch(input, d.conv.sucursal) }
      }
      case 'get_hours': return { result: BUSINESS.hours.text }
      case 'get_payment_info': return { result: json({ yappy: BUSINESS.payment.yappyText, transferencia: BUSINESS.payment.transferText }) }
      case 'list_services': return { result: json(await d.mb.listServices(input.sucursal, input.query)), convPatch: sucursalPatch(input, d.conv.sucursal) }
      case 'get_suggestions': {
        const suc = input.sucursal as Sucursal
        // The promo's treatments are named from treatment_settings, with the live
        // Mindbody catalogue as a fallback for ids the CMS does not carry.
        const load = d.promotions ?? ((today: string) => loadActivePromotions(today, undefined, () => d.mb.listServices(suc)))
        const [promos, ids] = await Promise.all([
          load(panamaDate(d.now)).catch(async e => { await d.store.logEvent(phone, 'error', { tool: 'get_suggestions', error: String(e) }); return [] as PromoSuggestion[] }),
          d.store.getSetting<number[]>('best_sellers', []),
        ])
        const mas_pedidos = (await d.mb.bestSellers(suc, (ids ?? []).map(Number).filter(Boolean))).map(s2 => ({ id: s2.id, nombre: s2.name, minutos: s2.minutes, precio: s2.price }))
        const promociones = promos.map(p => ({
          id: p.id ?? '',
          titulo: p.titulo,
          precio: p.precio,
          precio_original: p.precio_original,
          minutos: p.duracion_total || p.minutos,
          servicios: p.servicios,
          incluye: (p.incluye ?? []).map(t => t.nombre),
          valido_hasta: p.valido_hasta,
        }))
        return { result: json({ promociones, mas_pedidos }), convPatch: sucursalPatch(input, d.conv.sucursal) }
      }
      case 'list_addons': return { result: json(await d.mb.listAddons(input.sucursal)), convPatch: sucursalPatch(input, d.conv.sucursal) }
      case 'list_therapists': {
        const t = await d.mb.listTherapists({ sucursal: input.sucursal, date: input.date, serviceIds: input.service_ids, origin: d.origin, phone })
        if (!t.length) return { result: 'No hay terapeutas disponibles ese día; ofrece otra fecha.' }
        return { result: json(t), convPatch: sucursalPatch(input, d.conv.sucursal) }
      }
      case 'get_treatment_details': {
        const k = await (d.knowledge ?? (() => getKnowledge()))()
        const { match, similar } = findTreatment(String(input.name ?? ''), k.treatments)
        if (!match) return { result: json({ encontrado: false, parecidos: similar, nota: 'No existe ese tratamiento en el catálogo; ofrece los parecidos o el enlace del menú.' }) }
        return { result: json({ encontrado: true, nombre: match.name, categoria: match.category, minutos: match.minutes, precio: match.price, descripcion: match.description, mas_pedido: match.topPick }) }
      }
      case 'get_site_info': {
        const tema = String(input.tema ?? '') as TopicKey
        if (!(TOPIC_KEYS as readonly string[]).includes(tema)) return { result: `Tema desconocido "${tema}". Temas: ${TOPIC_KEYS.join(', ')}.`, isError: true }
        const k = await (d.knowledge ?? (() => getKnowledge()))()
        return { result: k.topics[tema] }
      }
      case 'get_menu_link': return { result: menuLink(String(input.seccion ?? 'menu')) }
      case 'send_image': {
        const asset = (await d.store.activeMedia(panamaDate(d.now))).find(m => m.key === input.key)
        if (!asset) return { result: `No existe la imagen "${input.key}"`, isError: true }
        if (d.shadow) { await d.store.logEvent(phone, 'shadow_reply', { image: asset.key }); return { result: 'enviado (shadow)' } }
        const f = await d.mediaBytes(asset.storage_path)
        const r = await d.wati.sendFile(phone, f, asset.caption || undefined)
        return r.ok ? { result: 'enviado' } : { result: `Error enviando imagen: ${r.error}`, isError: true }
      }
      case 'send_buttons': {
        // Like close_chat, this ends the turn: the buttons already ask the question, so the
        // model must not follow up with a text bubble repeating it.
        if (d.shadow) { await d.store.logEvent(phone, 'shadow_reply', { buttons: input }); return { result: 'enviado (shadow)', endTurn: true } }
        const r = await d.wati.sendButtons(phone, input.body, input.buttons); return r.ok ? { result: 'enviado', endTurn: true } : { result: `Error: ${r.error}`, isError: true }
      }
      case 'find_client': {
        const c = await d.mb.findClientByPhone(phone)
        if (!c) return { result: 'Cliente no encontrado en Mindbody. Pide nombre, apellido y correo y usa create_client.' }
        await d.store.mergeProfile(phone, { nombre: c.name, correo: c.email })
        return { result: json(c), convPatch: { mindbody_client_id: c.id, client_name: c.name } }
      }
      case 'create_client': {
        const c = await d.mb.createClient({ first: input.first_name, last: input.last_name, email: input.email, phone })
        const note = c.existing ? 'cliente existente encontrado por correo' : 'cliente creado'
        const nombre = `${input.first_name} ${input.last_name}`.trim()
        await d.store.mergeProfile(phone, { nombre, correo: input.email })
        return { result: json({ ...c, nota: note }), convPatch: { mindbody_client_id: c.id, client_name: nombre } }
      }
      case 'check_availability': { const s = await d.mb.availability({ sucursal: input.sucursal, date: input.date, serviceIds: input.service_ids, people: input.people, origin: d.origin, phone }); return { result: json({ horas: s.map(x => x.time).slice(0, 12) }), convPatch: sucursalPatch(input, d.conv.sucursal) } }
      case 'book': {
        const err = requireConfirmation(input, d.recentInbound); if (err) return { result: err, isError: true }
        if (!d.conv.mindbody_client_id) return { result: 'Primero identifica al cliente con find_client o create_client.', isError: true }
        const r = await d.mb.book({ clientId: d.conv.mindbody_client_id, sucursal: input.sucursal, date: input.date, time: input.time, serviceIds: input.service_ids, addonIds: Array.isArray(input.addon_ids) ? input.addon_ids : [], staffId: Number(input.staff_id) || undefined, people: input.people, origin: d.origin, clientName: d.conv.client_name ?? '', phone, promoTitle: typeof input.promo_title === 'string' ? input.promo_title : '', promoServiceIds: Array.isArray(input.promo_service_ids) ? input.promo_service_ids.map(Number).filter(Boolean) : [] })
        return { result: json(r), convPatch: { sucursal: input.sucursal } }
      }
      case 'list_my_appointments': { if (!d.conv.mindbody_client_id) return { result: 'Cliente no identificado; usa find_client.' }; return { result: json(await d.mb.upcoming(d.conv.mindbody_client_id)) } }
      case 'reschedule':
      case 'cancel': {
        const err = requireConfirmation(input, d.recentInbound); if (err) return { result: err, isError: true }
        const appts = d.conv.mindbody_client_id ? await d.mb.upcoming(d.conv.mindbody_client_id) : []
        const a = appts.find(x => x.id === input.appointment_id)
        if (!a) return { result: 'Cita no encontrada.', isError: true }
        if (name === 'cancel') {
          const ok = await d.mb.cancelAppointment(a.id); if (!ok) return { result: 'Mindbody no pudo cancelar.', isError: true }
          return { result: 'cancelada' }
        }
        let r
        try {
          r = await d.mb.book({ clientId: d.conv.mindbody_client_id!, sucursal: d.conv.sucursal ?? (a.location === 'Costa del Este' ? 'cde' : 'sfc'), date: input.date, time: input.time, serviceIds: [a.sessionTypeId], people: 1, origin: d.origin, clientName: d.conv.client_name ?? '', phone })
        } catch (e) {
          return { result: `No se pudo mover la cita; su cita original sigue en pie. ${String(e)}`, isError: true }
        }
        const ok = await d.mb.cancelAppointment(a.id)
        if (!ok) return { result: `Se creó la nueva cita pero no se pudo liberar la anterior. Nueva cita: ${json(r)}`, isError: true }
        return { result: json(r) }
      }
      case 'handoff': {
        let conv = d.conv
        const patch = sucursalPatch(input, d.conv.sucursal)
        if (patch?.sucursal && !d.conv.sucursal) {
          conv = await d.store.upsertConversation({ ...d.conv, ...patch, phone })
        }
        await performHandoff({ store: d.store, wati: d.wati, conv, motivo: input.motivo || 'modelo', resumen: input.resumen || '', shadow: d.shadow, env: env(), now: d.now })
        return { result: 'handoff hecho', endTurn: true, convPatch: patch }
      }
      case 'close_chat': { if (!d.shadow) await d.wati.updateChatStatus(phone, 'SOLVED'); return { result: 'cerrado', endTurn: true } }
      case 'note_to_self': {
        const patch = toProfilePatch(input.perfil)
        if (!isEmptyProfilePatch(patch)) await d.store.mergeProfile(phone, patch)
        return { result: 'anotado', convPatch: { summary: [d.conv.summary, input.text].filter(Boolean).join(' · ').slice(-800) } }
      }
      default: return { result: `Herramienta desconocida ${name}`, isError: true }
    }
  } catch (e) {
    await d.store.logEvent(phone, 'error', { tool: name, input, error: String(e) })
    return { result: `ERROR: ${String(e)}`, isError: true }
  }
}
