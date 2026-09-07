export interface WatiResult {
  ok: boolean
  error?: string
}

export interface WatiClient {
  sendText(phone: string, text: string): Promise<{ ok: boolean; messageId?: string; whatsappMessageId?: string; error?: string }>
  sendFile(phone: string, file: { bytes: Uint8Array; filename: string; mime: string }, caption?: string): Promise<{ ok: boolean; error?: string }>
  sendButtons(phone: string, body: string, buttons: string[], footer?: string): Promise<{ ok: boolean; error?: string }>
  updateAttributes(phone: string, attrs: Record<string, string>): Promise<{ ok: boolean; error?: string }>
  assignOperator(phone: string, email: string | null): Promise<{ ok: boolean; error?: string }>
  assignTeams(phone: string, teams: string[]): Promise<{ ok: boolean; error?: string }>
  startChatbot(phone: string, chatbotId: string): Promise<{ ok: boolean; error?: string }>
  updateChatStatus(phone: string, status: 'OPEN' | 'SOLVED' | 'PENDING'): Promise<{ ok: boolean; error?: string }>
  getMedia(fileName: string): Promise<{ ok: boolean; bytes?: Uint8Array; mime?: string; error?: string }>
}

interface WatiCallResult {
  ok: boolean
  data?: unknown
  error?: string
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

// Duplicated (not imported) to avoid a dependency cycle with src/lib/booking/wati.ts.
// Reception stores 6000-0000 on Mindbody clients with no real phone; sending
// there lands on whoever actually owns that WhatsApp number — a data leak.
function isPlaceholderWatiPhone(phone: string): boolean {
  if (!phone) return true

  let cleaned = phone.replace(/\D/g, '')
  if (!cleaned.startsWith('507') && cleaned.length === 8) {
    cleaned = '507' + cleaned
  }

  if (cleaned === '50760000000' || cleaned === '60000000') return true
  if (cleaned.length < 11) return true

  const last7 = cleaned.slice(-7)
  if (/^(\d)\1{6}$/.test(last7)) return true

  return false
}

export function createWatiClient(opts: { baseUrl: string; token: string; channelPhone?: string; fetchImpl?: typeof fetch }): WatiClient {
  const base = opts.baseUrl.replace(/\/$/, '')
  const root = base.replace(/\/\d+$/, '')
  const f = opts.fetchImpl ?? fetch
  const auth = { Authorization: `Bearer ${opts.token}` }

  async function call(path: string, init: RequestInit & { json?: unknown } = {}): Promise<WatiCallResult> {
    const headers: Record<string, string> = { ...auth, ...(init.headers as Record<string, string> | undefined) }
    let body = init.body
    if (init.json !== undefined) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(init.json)
    }
    const origin = path.startsWith('/api/ext/') ? root : base
    try {
      const res = await f(`${origin}${path}`, { ...init, headers, body })
      const text = await res.text()
      let data: unknown = null
      try {
        data = text ? JSON.parse(text) : null
      } catch {
        data = text
      }
      if (!res.ok) {
        return { ok: false, error: `HTTP ${res.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}` }
      }
      if (isRecord(data) && data.result === false) {
        return { ok: false, error: (data.info as string) || (data.message as string) || 'result=false', data }
      }
      return { ok: true, data }
    } catch (e) {
      return { ok: false, error: String(e) }
    }
  }

  return {
    async sendText(phone, text) {
      if (isPlaceholderWatiPhone(phone)) {
        console.warn(`WATI agent send blocked: placeholder phone "${phone}" (sendText)`)
        return { ok: false, error: 'placeholder phone' }
      }
      const r = await call('/api/ext/v3/conversations/messages/text', { method: 'POST', json: { target: phone, text } })
      let messageId: string | undefined
      let whatsappMessageId: string | undefined
      if (isRecord(r.data)) {
        if (typeof r.data.id === 'string') messageId = r.data.id
        else if (isRecord(r.data.message) && typeof r.data.message.id === 'string') messageId = r.data.message.id
        if (typeof r.data.whatsappMessageId === 'string') whatsappMessageId = r.data.whatsappMessageId
        else if (isRecord(r.data.message) && typeof r.data.message.whatsappMessageId === 'string') whatsappMessageId = r.data.message.whatsappMessageId
        else if (typeof r.data.messageId === 'string') whatsappMessageId = r.data.messageId
      }
      return { ok: r.ok, messageId: whatsappMessageId ?? messageId, whatsappMessageId, error: r.error }
    },
    async sendFile(phone, file, caption) {
      if (isPlaceholderWatiPhone(phone)) {
        console.warn(`WATI agent send blocked: placeholder phone "${phone}" (sendFile)`)
        return { ok: false, error: 'placeholder phone' }
      }
      const fd = new FormData()
      fd.append('file', new Blob([file.bytes as BlobPart], { type: file.mime }), file.filename)
      const q = caption ? `?caption=${encodeURIComponent(caption)}` : ''
      const r = await call(`/api/v1/sendSessionFile/${phone}${q}`, { method: 'POST', body: fd })
      return { ok: r.ok, error: r.error }
    },
    async sendButtons(phone, body, buttons, footer) {
      if (isPlaceholderWatiPhone(phone)) {
        console.warn(`WATI agent send blocked: placeholder phone "${phone}" (sendButtons)`)
        return { ok: false, error: 'placeholder phone' }
      }
      const r = await call(`/api/v1/sendInteractiveButtonsMessage?whatsappNumber=${phone}`, {
        method: 'POST',
        json: { body, footer: footer ?? '', buttons: buttons.slice(0, 3).map(text => ({ text: text.slice(0, 20) })) },
      })
      return { ok: r.ok, error: r.error }
    },
    async updateAttributes(phone, attrs) {
      const r = await call(`/api/v1/updateContactAttributes/${phone}`, {
        method: 'POST',
        json: { customParams: Object.entries(attrs).map(([name, value]) => ({ name, value })) },
      })
      return { ok: r.ok, error: r.error }
    },
    async assignOperator(phone, email) {
      const q = email ? `email=${encodeURIComponent(email)}&whatsappNumber=${phone}` : `whatsappNumber=${phone}`
      const r = await call(`/api/v1/assignOperator?${q}`, { method: 'POST' })
      return { ok: r.ok, error: r.error }
    },
    async assignTeams(phone, teams) {
      const r = await call('/api/ext/v3/contacts/teams', { method: 'PUT', json: { target: phone, teams } })
      return { ok: r.ok, error: r.error }
    },
    async startChatbot(phone, chatbotId) {
      const r = await call('/api/ext/v3/chatbots/start', { method: 'POST', json: { chatbot_id: chatbotId, target: phone } })
      return { ok: r.ok, error: r.error }
    },
    async updateChatStatus(phone, status) {
      const r = await call('/api/v1/updateChatStatus', {
        method: 'POST',
        json: { whatsappNumber: phone, ticketStatus: status, channelPhoneNumber: opts.channelPhone ?? '' },
      })
      return { ok: r.ok, error: r.error }
    },
    async getMedia(fileName) {
      try {
        const res = await f(`${base}/api/v1/getMedia?fileName=${encodeURIComponent(fileName)}`, { headers: auth })
        if (!res.ok) return { ok: false, error: `HTTP ${res.status}` }
        return { ok: true, bytes: new Uint8Array(await res.arrayBuffer()), mime: res.headers.get('content-type') ?? undefined }
      } catch (e) {
        return { ok: false, error: String(e) }
      }
    },
  }
}

export function watiFromEnv(): WatiClient {
  return createWatiClient({
    baseUrl: process.env.WATI_API_URL || 'https://live-mt-server.wati.io',
    token: process.env.WATI_ACCESS_TOKEN || process.env.WATI_API_KEY || '',
    channelPhone: process.env.WATI_CHANNEL_PHONE || '',
  })
}
