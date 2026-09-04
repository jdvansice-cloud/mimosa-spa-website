import type { GlobalMode } from '../types'
import { cleanPhone } from '../phone'

export function env() {
  const mode = (process.env.WATI_AGENT_MODE || 'off') as GlobalMode
  return {
    watiUrl: process.env.WATI_API_URL || 'https://live-mt-server.wati.io',
    watiToken: process.env.WATI_ACCESS_TOKEN || process.env.WATI_API_KEY || '',
    webhookSecret: process.env.WATI_AGENT_WEBHOOK_SECRET || '',
    operatorEmail: (process.env.WATI_AGENT_OPERATOR_EMAIL || '').toLowerCase(),
    handoffChatbotId: process.env.WATI_HANDOFF_CHATBOT_ID || '',
    citasCdeEmail: process.env.WATI_CITAS_CDE_EMAIL || '',
    citasSfcEmail: process.env.WATI_CITAS_SFC_EMAIL || '',
    mode,
    whitelist: (process.env.WATI_AGENT_WHITELIST || '').split(',').map(s => cleanPhone(s)).filter(Boolean),
    model: process.env.WATI_AGENT_MODEL || 'claude-sonnet-5',
    channelPhone: process.env.WATI_CHANNEL_PHONE || '',
  }
}
