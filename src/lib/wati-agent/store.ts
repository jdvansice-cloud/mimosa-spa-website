import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Conversation, ConversationMode, EventKind, MediaAsset, StoredMessage } from './types'

export interface AgentStore {
  getConversation(phone: string): Promise<Conversation | null>
  upsertConversation(c: Partial<Conversation> & { phone: string }): Promise<Conversation>
  insertMessage(m: StoredMessage): Promise<{ inserted: boolean }>
  recentMessages(phone: string, opts: { sinceHours: number; limit: number }): Promise<StoredMessage[]>
  newestInboundId(phone: string): Promise<number | null>
  logEvent(phone: string | null, kind: EventKind, payload: unknown): Promise<void>
  activeMedia(today: string): Promise<MediaAsset[]>
  getSetting<T>(key: string, fallback: T): Promise<T>
  setSetting(key: string, value: unknown): Promise<void>
  listConversations(opts: { mode?: ConversationMode; limit: number }): Promise<Conversation[]>
  eventsFor(phone: string, limit: number): Promise<Array<{ id: number; kind: EventKind; payload: unknown; created_at: string }>>
  stats(sinceIso: string): Promise<{ handled: number; booked: number; handoffs: Record<string, number>; shadow: number }>
  recentOutboundExists(phone: string, text: string, withinMs: number): Promise<boolean>
}

export function createStore(sb: SupabaseClient): AgentStore {
  const fail = (ctx: string, error: { message: string } | null) => { if (error) throw new Error(`${ctx}: ${error.message}`) }
  return {
    async getConversation(phone) {
      const { data, error } = await sb.from('wati_agent_conversations').select('*').eq('phone', phone).maybeSingle()
      fail('getConversation', error); return (data as Conversation) ?? null
    },
    async upsertConversation(c) {
      const { data, error } = await sb.from('wati_agent_conversations').upsert({ ...c, updated_at: new Date().toISOString() }, { onConflict: 'phone' }).select('*').single()
      fail('upsertConversation', error); return data as Conversation
    },
    async insertMessage(m) {
      const { error } = await sb.from('wati_agent_messages').insert(m)
      if (error?.code === '23505') return { inserted: false }
      fail('insertMessage', error); return { inserted: true }
    },
    async recentMessages(phone, { sinceHours, limit }) {
      const since = new Date(Date.now() - sinceHours * 3600_000).toISOString()
      const { data, error } = await sb.from('wati_agent_messages').select('*').eq('phone', phone).eq('shadow', false).gte('created_at', since).order('created_at', { ascending: false }).limit(limit)
      fail('recentMessages', error); return ((data ?? []) as StoredMessage[]).reverse()
    },
    async newestInboundId(phone) {
      const { data, error } = await sb.from('wati_agent_messages').select('id').eq('phone', phone).eq('direction', 'in').order('id', { ascending: false }).limit(1).maybeSingle()
      fail('newestInboundId', error); return data?.id ?? null
    },
    async logEvent(phone, kind, payload) {
      const { error } = await sb.from('wati_agent_events').insert({ phone, kind, payload })
      if (error) console.error('logEvent failed', error.message)
    },
    async activeMedia(today) {
      const { data, error } = await sb.from('wati_agent_media').select('*').eq('active', true).or(`valid_from.is.null,valid_from.lte.${today}`).or(`valid_until.is.null,valid_until.gte.${today}`)
      fail('activeMedia', error); return (data ?? []) as MediaAsset[]
    },
    async getSetting(key, fallback) {
      const { data, error } = await sb.from('wati_agent_settings').select('value').eq('key', key).maybeSingle()
      fail('getSetting', error); return data ? (data.value as typeof fallback) : fallback
    },
    async setSetting(key, value) {
      const { error } = await sb.from('wati_agent_settings').upsert({ key, value, updated_at: new Date().toISOString() })
      fail('setSetting', error)
    },
    async listConversations({ mode, limit }) {
      let q = sb.from('wati_agent_conversations').select('*').order('last_inbound_at', { ascending: false, nullsFirst: false }).limit(limit)
      if (mode) q = q.eq('mode', mode)
      const { data, error } = await q; fail('listConversations', error); return (data ?? []) as Conversation[]
    },
    async eventsFor(phone, limit) {
      const { data, error } = await sb.from('wati_agent_events').select('id, kind, payload, created_at').eq('phone', phone).order('id', { ascending: false }).limit(limit)
      fail('eventsFor', error); return (data ?? []) as Array<{ id: number; kind: EventKind; payload: unknown; created_at: string }>
    },
    async stats(sinceIso) {
      const { data, error } = await sb.from('wati_agent_events').select('kind, payload, phone').gte('created_at', sinceIso).in('kind', ['handoff', 'tool_result', 'llm', 'shadow_reply'])
      fail('stats', error)
      const rows = (data ?? []) as Array<{ kind: string; payload: any; phone: string }>
      const handled = new Set(rows.filter(r => r.kind === 'llm').map(r => r.phone)).size
      const booked = rows.filter(r => r.kind === 'tool_result' && r.payload?.tool === 'book' && r.payload?.ok).length
      const handoffs: Record<string, number> = {}
      for (const r of rows.filter(r => r.kind === 'handoff')) handoffs[r.payload?.motivo ?? '?'] = (handoffs[r.payload?.motivo ?? '?'] ?? 0) + 1
      return { handled, booked, handoffs, shadow: rows.filter(r => r.kind === 'shadow_reply').length }
    },
    async recentOutboundExists(phone, text, withinMs) {
      const since = new Date(Date.now() - withinMs).toISOString()
      const { data, error } = await sb.from('wati_agent_messages').select('id').eq('phone', phone).eq('direction', 'out').eq('text', text).gte('created_at', since).limit(1)
      fail('recentOutboundExists', error); return (data ?? []).length > 0
    },
  }
}

export function storeFromEnv(): AgentStore {
  return createStore(createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!))
}
