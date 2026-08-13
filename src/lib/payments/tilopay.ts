import crypto from 'crypto'

// Tilopay hosted-checkout client (https://app.tilopay.com/api/v1/).
// Inert until TILOPAY_API_KEY / TILOPAY_API_USER / TILOPAY_PASSWORD are set.

const TILOPAY_BASE = process.env.TILOPAY_API_URL || 'https://app.tilopay.com/api/v1/'

function creds() {
  const key = process.env.TILOPAY_API_KEY
  const user = process.env.TILOPAY_API_USER
  const password = process.env.TILOPAY_PASSWORD
  if (!key || !user || !password) return null
  return { key, user, password }
}

export function isTilopayConfigured(): boolean {
  return creds() !== null
}

async function tilopayLogin(): Promise<string> {
  const c = creds()
  if (!c) throw new Error('Tilopay not configured')
  const res = await fetch(`${TILOPAY_BASE}login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiuser: c.user, password: c.password }),
  })
  if (!res.ok) throw new Error(`Tilopay login failed: ${res.status}`)
  const data = await res.json()
  if (!data?.access_token) throw new Error('Tilopay login: no access_token')
  return data.access_token as string
}

export interface TilopayPaymentInput {
  orderNumber: string
  amountCents: number
  redirectUrl: string
  buyerName: string
  buyerEmail: string
  buyerPhone?: string
  buyerCountry?: string
  returnData?: string
}

/** Create a hosted-checkout payment; returns the URL to redirect the customer to. */
export async function createTilopayPayment(input: TilopayPaymentInput): Promise<string> {
  const c = creds()
  if (!c) throw new Error('Tilopay not configured')
  const token = await tilopayLogin()

  const [firstName, ...rest] = input.buyerName.trim().split(/\s+/)
  const lastName = rest.join(' ') || firstName

  const res = await fetch(`${TILOPAY_BASE}processPayment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      key: c.key,
      amount: (input.amountCents / 100).toFixed(2),
      currency: 'USD',
      orderNumber: input.orderNumber,
      capture: 1,
      redirect: input.redirectUrl,
      billToFirstName: firstName,
      billToLastName: lastName,
      billToEmail: input.buyerEmail,
      billToTelephone: input.buyerPhone || '00000000',
      billToCountry: input.buyerCountry || 'PA',
      billToAddress: 'Panamá',
      billToCity: 'Panamá',
      billToState: 'PA',
      billToZipPostCode: '0000',
      hashVersion: 'V2',
      ...(input.returnData ? { returnData: input.returnData } : {}),
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Tilopay processPayment failed: ${res.status} ${text.slice(0, 300)}`)
  }
  const data = await res.json()
  if (!data?.url) throw new Error('Tilopay processPayment: no url in response')
  return data.url as string
}

// PHP http_build_query-compatible serialization (Tilopay computes the hash
// server-side with PHP): urlencoded k=v joined by &, spaces as +.
function phpHttpBuildQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(
      ([k, v]) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(v).replace(/%20/g, '+')}`
    )
    .join('&')
}

export interface TilopayCallbackParams {
  code?: string | null
  description?: string | null
  auth?: string | null
  order?: string | null
  tpt?: string | null
  crd?: string | null
  OrderHash?: string | null
  /** Our order_number as sent in processPayment */
  orderNumber: string
  amountCents: number
  buyerEmail: string
}

/**
 * Validate the OrderHash on the browser redirect. NEVER trust callback params
 * without this: OrderHash = HMAC-SHA256 over the PHP-serialized param set,
 * keyed with `orderId|apiKey|password`.
 */
export function verifyTilopayHash(p: TilopayCallbackParams): boolean {
  const c = creds()
  if (!c || !p.OrderHash || !p.tpt) return false

  const hashKey = `${p.tpt}|${c.key}|${c.password}`
  const payload = phpHttpBuildQuery({
    api_Key: c.key,
    api_user: c.user,
    orderId: p.tpt,
    external_orden_id: p.orderNumber,
    amount: (p.amountCents / 100).toFixed(2),
    currency: 'USD',
    responseCode: p.code ?? '',
    auth: p.auth ?? '',
    email: p.buyerEmail,
  })
  const computed = crypto.createHmac('sha256', hashKey).update(payload).digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, 'utf8'),
      Buffer.from(String(p.OrderHash), 'utf8')
    )
  } catch {
    return false
  }
}

/** Refund (type 2) or same-day reversal (type 3). */
export async function refundTilopayPayment(
  orderNumber: string,
  amountCents: number,
  type: 2 | 3 = 2
): Promise<{ ok: boolean; raw: unknown }> {
  const c = creds()
  if (!c) throw new Error('Tilopay not configured')
  const token = await tilopayLogin()

  const res = await fetch(`${TILOPAY_BASE}processModification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      orderNumber,
      key: c.key,
      amount: (amountCents / 100).toFixed(2),
      type,
      hashVersion: 'V2',
    }),
  })
  const raw = await res.json().catch(() => null)
  return { ok: res.ok, raw }
}
