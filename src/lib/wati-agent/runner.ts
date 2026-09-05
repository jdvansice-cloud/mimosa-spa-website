import type Anthropic from '@anthropic-ai/sdk'
import { TOOLS } from './tools/definitions'
import { executeTool, type ToolDeps } from './tools/execute'
import { buildSystem } from './prompt'
import { detectIntent } from './voice/select'
import { splitBubbles } from './bubbles'
import { performHandoff } from './handoff'
import { panamaDate } from './hours'
import { env } from './config/env'
import type { AgentStore } from './store'
import type { WatiClient } from './wati-api'
import { closeAndRemember } from './memory'
import type { ClientProfile, ConversationOutcome, StoredMessage } from './types'

export interface RunDeps {
  anthropic: Pick<Anthropic, 'messages'>
  store: AgentStore
  wati: WatiClient
  origin: string
  now: Date
  mediaBytes: ToolDeps['mediaBytes']
  mb: ToolDeps['mb']
  styleGuide: string
  sleep?: (ms: number) => Promise<void>
}

function toMessages(history: StoredMessage[]): Anthropic.MessageParam[] {
  const out: Anthropic.MessageParam[] = []
  for (const m of history) {
    const role: 'user' | 'assistant' =
      m.direction === 'in' || m.author === 'human' || m.author === 'bot' || m.author === 'template' ? 'user' : 'assistant'
    let text = m.text || ''
    if (m.direction === 'in' && m.type !== 'text') text = `[${m.type}] ${text}`.trim()
    if (m.author === 'human') text = `[compañera humana escribió]: ${text}`
    if (m.author === 'bot' || m.author === 'template') text = `[mensaje automático del sistema]: ${text}`
    if (!text) continue
    const last = out.at(-1)
    if (last && last.role === role && typeof last.content === 'string') last.content += '\n' + text
    else out.push({ role, content: text })
  }
  while (out.length && out[0].role !== 'user') out.shift()
  return out
}

/**
 * One Mindbody lookup per turn, and only when we have a reason to believe the
 * contact exists — an unknown number is the common case and must stay cheap.
 */
async function mindbodyHistoryFor(
  phone: string,
  conv: { mindbody_client_id: string | null; client_name: string | null },
  profile: ClientProfile,
  d: RunDeps,
): Promise<{ line: string | null; patch: Partial<{ client_name: string; mindbody_client_id: string }> }> {
  if (!conv.mindbody_client_id && !profile.correo) return { line: null, patch: {} }
  try {
    const byPhone = await d.mb.findClientByPhone(phone)
    const c = byPhone ?? (profile.correo ? await d.mb.findClientByEmail(profile.correo) : null)
    if (!c) return { line: null, patch: {} }
    const lastVisits = (c as { lastVisits?: string[] }).lastVisits ?? []
    const visits = lastVisits.length ? `, últimas visitas: ${lastVisits.slice(0, 3).join(' | ')}` : ''
    const patch: Partial<{ client_name: string; mindbody_client_id: string }> = {}
    if (!conv.mindbody_client_id) patch.mindbody_client_id = c.id
    if (!conv.client_name && c.name) patch.client_name = c.name
    return { line: `Cliente Mindbody: ${c.name}${visits}`, patch }
  } catch (e) {
    await d.store.logEvent(phone, 'error', { where: 'mindbodyHistory', error: String(e) }).catch(() => {})
    return { line: null, patch: {} }
  }
}

export async function runTurn(phone: string, shadow: boolean, d: RunDeps): Promise<{ bubbles: string[]; handedOff: boolean }> {
  const sleep = d.sleep ?? ((ms: number) => new Promise<void>(r => setTimeout(r, ms)))
  let conv: Awaited<ReturnType<AgentStore['getConversation']>> | undefined
  try {
    conv = await d.store.getConversation(phone)
    if (!conv) {
      await d.store.logEvent(phone, 'error', { where: 'runTurn', error: 'conversation not found' })
      return { bubbles: [], handedOff: false }
    }
    const history = await d.store.recentMessages(phone, { sinceHours: 48, limit: 60 })
    const lastIn = [...history].reverse().find(m => m.direction === 'in')
    const recentInbound = history.filter(m => m.direction === 'in' && m.text).slice(-3).map(m => m.text as string)
    const messages = toMessages(history)
    if (!messages.length) return { bubbles: [], handedOff: false }

    const [media, personaName, profile, historial] = await Promise.all([
      d.store.activeMedia(panamaDate(d.now)),
      d.store.getSetting('persona_name', 'Camila'),
      d.store.getProfile(phone).catch(() => ({} as ClientProfile)),
      d.store.recentConversationLogs(phone, 3).catch(() => []),
    ])
    const mbHistory = await mindbodyHistoryFor(phone, conv, profile, d)
    if (Object.keys(mbHistory.patch).length) conv = await d.store.upsertConversation({ phone, ...mbHistory.patch })
    const system = buildSystem({
      personaName,
      now: d.now,
      sucursal: conv.sucursal,
      clientName: conv.client_name,
      mindbodyHistory: mbHistory.line,
      summary: conv.summary,
      profile,
      historial,
      media,
      intent: detectIntent(lastIn?.text || ''),
      styleGuide: d.styleGuide,
    })

    const texts: string[] = []
    let handedOff = false
    let endedByTool = false
    let outcome: ConversationOutcome | null = null

    for (let round = 0; round < 8; round++) {
      const res = await d.anthropic.messages.create({
        model: env().model,
        max_tokens: 4000,
        output_config: { effort: 'medium' },
        system,
        tools: TOOLS,
        messages,
      } as Anthropic.MessageCreateParamsNonStreaming)
      await d.store.logEvent(phone, 'llm', { round, stop: res.stop_reason, usage: res.usage })

      for (const b of res.content) if (b.type === 'text' && b.text.trim()) texts.push(b.text)

      if (res.stop_reason !== 'tool_use') break

      messages.push({ role: 'assistant', content: res.content })
      const results: Anthropic.ToolResultBlockParam[] = []
      let end = false
      for (const b of res.content) {
        if (b.type !== 'tool_use') continue
        await d.store.logEvent(phone, 'tool_call', { tool: b.name, input: b.input })
        const o = await executeTool(b.name, b.input, {
          store: d.store,
          wati: d.wati,
          conv,
          origin: d.origin,
          shadow,
          now: d.now,
          mediaBytes: d.mediaBytes,
          mb: d.mb,
          recentInbound,
        })
        await d.store.logEvent(phone, 'tool_result', { tool: b.name, ok: !o.isError, result: o.result.slice(0, 500) })
        if (o.convPatch) conv = await d.store.upsertConversation({ phone, ...o.convPatch })
        if (b.name === 'handoff') { handedOff = true; outcome = 'handoff' }
        if (b.name === 'close_chat') outcome = 'closed'
        if (b.name === 'book' && !o.isError) outcome = 'booked'
        if (o.endTurn) end = true
        results.push({ type: 'tool_result', tool_use_id: b.id, content: o.result, is_error: o.isError || undefined })
      }
      messages.push({ role: 'user', content: results })
      if (end) { endedByTool = true; break }
    }

    if (!texts.length && !handedOff && !endedByTool) {
      await d.store.logEvent(phone, 'error', { where: 'runTurn', error: 'empty reply' })
      if (!shadow) {
        // performHandoff sends its own "le comunico con mi compañera" bubble; a second one here reads as a stutter.
        await performHandoff({ store: d.store, wati: d.wati, conv, motivo: 'respuesta_vacia', resumen: conv.summary ?? '', shadow, env: env(), now: d.now }).catch(() => {})
        await closeAndRemember({ anthropic: d.anthropic, store: d.store, phone, outcome: 'handoff', now: d.now })
      }
      return { bubbles: [], handedOff: true }
    }

    const candidateBubbles = handedOff ? [] : splitBubbles(texts.join('\n'))
    const bubbles: string[] = []
    for (const [i, bubbleText] of candidateBubbles.entries()) {
      if (shadow) {
        await d.store.insertMessage({ phone, wati_message_id: null, direction: 'out', author: 'camila', type: 'text', text: bubbleText, media_ref: null, shadow: true })
        await d.store.logEvent(phone, 'shadow_reply', { text: bubbleText })
        bubbles.push(bubbleText)
      } else {
        const r = await d.wati.sendText(phone, bubbleText)
        if (!r.ok) {
          await d.store.logEvent(phone, 'error', { where: 'sendText', error: r.error })
          break
        }
        await d.store.insertMessage({ phone, wati_message_id: r.messageId ?? null, direction: 'out', author: 'camila', type: 'text', text: bubbleText, media_ref: null, shadow: false })
        bubbles.push(bubbleText)
        if (i < candidateBubbles.length - 1) await sleep(1500 + 500 * i)
      }
    }

    // Bookkeeping only. The customer already has their answer, so a failure here
    // must never reach the apology/handoff path below.
    try {
      if (bubbles.length && !shadow) await d.store.upsertConversation({ phone, last_outbound_at: new Date().toISOString() })

      const before = history.filter(m => m.author === 'camila').length
      const after = before + bubbles.length
      if (handedOff || Math.floor(after / 6) > Math.floor(before / 6)) {
        const summaryMessages = messages.filter(m => typeof m.content === 'string')
        if (texts.length) summaryMessages.push({ role: 'assistant', content: texts.join('\n') })
        const s = await d.anthropic.messages.create({
          model: env().model,
          max_tokens: 600,
          system: 'Resume la conversación en máximo 4 líneas en español: qué quiere el cliente, qué datos ya dio (nombre, correo, sucursal, fecha/hora, tratamiento), qué falta.',
          messages: [...summaryMessages, { role: 'user', content: 'Resumen:' }],
        })
        const summary = s.content.find((b: Anthropic.ContentBlock) => b.type === 'text')?.text
        if (summary) await d.store.upsertConversation({ phone, summary })
      }
    } catch (e) {
      await d.store.logEvent(phone, 'error', { where: 'runTurn/bookkeeping', error: String(e) }).catch(() => {})
    }

    // The conversation ended: write its log entry and fold what we learned into the profile.
    if (outcome && !shadow) await closeAndRemember({ anthropic: d.anthropic, store: d.store, phone, outcome, now: d.now })

    return { bubbles, handedOff }
  } catch (e) {
    await d.store.logEvent(phone, 'error', { where: 'runTurn', error: String(e) })
    if (!shadow) {
      await d.wati.sendText(phone, 'Disculpe, un momento por favor 🌼').catch(() => {})
      if (conv) {
        await performHandoff({ store: d.store, wati: d.wati, conv, motivo: 'error_sistema', resumen: conv?.summary ?? '', shadow, env: env(), now: d.now }).catch(() => {})
      }
    }
    return { bubbles: [], handedOff: true }
  }
}
