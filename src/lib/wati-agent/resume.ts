import type { ConversationMode } from './types'
import { STICKY_HANDOFF_REASONS } from './handoff'

export interface ShouldResumeInput {
  mode: ConversationMode
  handoffReason: string | null
  humanSince: string | null
  lastHumanOutboundAt: string | null
  now: Date
  idleHours: number
}

const HARD_RESUME_HOURS = 24

/**
 * Decides whether Camila should resume answering while a conversation is
 * marked `human`. Two independent triggers, either one is enough:
 *  - the conversation has been idle (no human outbound message) for at
 *    least `idleHours`, unless the handoff reason is "sticky" (queja,
 *    manipulacion, medico, certificado, comprobante_o_imagen) — those stay
 *    with a human until solved or until the hard 24h bound below.
 *  - the conversation has been in human mode for 24h or more, regardless
 *    of reason.
 */
export function shouldResume(i: ShouldResumeInput): boolean {
  if (i.mode !== 'human') return false

  if (i.humanSince) {
    const hoursSinceHandoff = (i.now.getTime() - new Date(i.humanSince).getTime()) / 3600_000
    if (hoursSinceHandoff >= HARD_RESUME_HOURS) return true
  }

  if (i.handoffReason && (STICKY_HANDOFF_REASONS as readonly string[]).includes(i.handoffReason)) return false

  const referenceIso = i.lastHumanOutboundAt ?? i.humanSince
  if (!referenceIso) return false
  const idleHoursElapsed = (i.now.getTime() - new Date(referenceIso).getTime()) / 3600_000
  return idleHoursElapsed >= i.idleHours
}
