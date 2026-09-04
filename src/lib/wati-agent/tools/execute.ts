import { BUSINESS } from '../config/business'
import { requireConfirmation, checkNoticePolicy } from './validate'
import { performHandoff } from '../handoff'
import { env } from '../config/env'
import { panamaDate } from '../hours'
import type { AgentStore } from '../store'
import type { WatiClient } from '../wati-api'
import type { Conversation } from '../types'

export interface ToolDeps { store: AgentStore; wati: WatiClient; conv: Conversation; origin: string; shadow: boolean; now: Date; mediaBytes: (p: string) => Promise<{ bytes: Uint8Array; mime: string; filename: string }>; mb: typeof import('./mindbody-adapter') }
export interface ToolOutcome { result: string; isError?: boolean; endTurn?: boolean; convPatch?: Partial<Conversation> }

const json = (v: unknown) => JSON.stringify(v)

export async function executeTool(name: string, input: any, d: ToolDeps): Promise<ToolOutcome> {
  const phone = d.conv.phone
  try {
    switch (name) {
      case 'get_location_info': { const l = BUSINESS.locations[input.sucursal as 'cde' | 'sfc']; return { result: json({ nombre: l.name, plaza: l.plaza, direccion: l.address, waze: l.wazeUrl, maps: l.mapsUrl, estacionamiento: l.parking }) } }
      case 'get_hours': return { result: BUSINESS.hours.text }
      case 'list_services': return { result: json(await d.mb.listServices(input.sucursal, input.query)) }
      case 'send_image': {
        const asset = (await d.store.activeMedia(panamaDate(d.now))).find(m => m.key === input.key)
        if (!asset) return { result: `No existe la imagen "${input.key}"`, isError: true }
        if (d.shadow) { await d.store.logEvent(phone, 'shadow_reply', { image: asset.key }); return { result: 'enviado (shadow)' } }
        const f = await d.mediaBytes(asset.storage_path)
        const r = await d.wati.sendFile(phone, f, asset.caption || undefined)
        return r.ok ? { result: 'enviado' } : { result: `Error enviando imagen: ${r.error}`, isError: true }
      }
      case 'send_buttons': {
        if (d.shadow) { await d.store.logEvent(phone, 'shadow_reply', { buttons: input }); return { result: 'enviado (shadow)' } }
        const r = await d.wati.sendButtons(phone, input.body, input.buttons); return r.ok ? { result: 'enviado' } : { result: `Error: ${r.error}`, isError: true }
      }
      case 'find_client': {
        const c = await d.mb.findClientByPhone(phone)
        if (!c) return { result: 'Cliente no encontrado en Mindbody. Pide nombre, apellido y correo y usa create_client.' }
        return { result: json(c), convPatch: { mindbody_client_id: c.id, client_name: c.name } }
      }
      case 'create_client': { const c = await d.mb.createClient({ first: input.first_name, last: input.last_name, email: input.email, phone }); return { result: json(c), convPatch: { mindbody_client_id: c.id, client_name: `${input.first_name} ${input.last_name}` } } }
      case 'check_availability': { const s = await d.mb.availability({ sucursal: input.sucursal, date: input.date, serviceIds: input.service_ids, people: input.people, origin: d.origin }); return { result: json({ horas: s.map(x => x.time).slice(0, 12) }) } }
      case 'book': {
        const err = requireConfirmation(input); if (err) return { result: err, isError: true }
        if (!d.conv.mindbody_client_id) return { result: 'Primero identifica al cliente con find_client o create_client.', isError: true }
        const r = await d.mb.book({ clientId: d.conv.mindbody_client_id, sucursal: input.sucursal, date: input.date, time: input.time, serviceIds: input.service_ids, people: input.people, origin: d.origin, clientName: d.conv.client_name ?? '', phone })
        return { result: json(r), convPatch: { sucursal: input.sucursal } }
      }
      case 'list_my_appointments': { if (!d.conv.mindbody_client_id) return { result: 'Cliente no identificado; usa find_client.' }; return { result: json(await d.mb.upcoming(d.conv.mindbody_client_id)) } }
      case 'reschedule':
      case 'cancel': {
        const err = requireConfirmation(input); if (err) return { result: err, isError: true }
        const appts = d.conv.mindbody_client_id ? await d.mb.upcoming(d.conv.mindbody_client_id) : []
        const a = appts.find(x => x.id === input.appointment_id)
        if (!a) return { result: 'Cita no encontrada.', isError: true }
        const pol = checkNoticePolicy(a.start, d.now); if (pol) return { result: pol, isError: true }
        const ok = await d.mb.cancelAppointment(a.id); if (!ok) return { result: 'Mindbody no pudo cancelar.', isError: true }
        if (name === 'cancel') return { result: 'cancelada' }
        const r = await d.mb.book({ clientId: d.conv.mindbody_client_id!, sucursal: d.conv.sucursal ?? (a.location === 'Costa del Este' ? 'cde' : 'sfc'), date: input.date, time: input.time, serviceIds: [a.sessionTypeId], people: 1, origin: d.origin, clientName: d.conv.client_name ?? '', phone })
        return { result: json(r) }
      }
      case 'handoff': { await performHandoff({ store: d.store, wati: d.wati, conv: d.conv, motivo: input.motivo || 'modelo', resumen: input.resumen || '', shadow: d.shadow, env: env() }); return { result: 'handoff hecho', endTurn: true } }
      case 'close_chat': { if (!d.shadow) await d.wati.updateChatStatus(phone, 'SOLVED'); return { result: 'cerrado', endTurn: true } }
      case 'note_to_self': return { result: 'anotado', convPatch: { summary: [d.conv.summary, input.text].filter(Boolean).join(' · ').slice(-800) } }
      default: return { result: `Herramienta desconocida ${name}`, isError: true }
    }
  } catch (e) {
    await d.store.logEvent(phone, 'error', { tool: name, input, error: String(e) })
    return { result: `ERROR: ${String(e)}`, isError: true }
  }
}
