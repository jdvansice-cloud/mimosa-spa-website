import type { SupabaseClient } from '@supabase/supabase-js'
import type { InvoiceRequest } from './types'

/**
 * efacturapty (IDEATI, S.A.) HTTP client — the PAC that signs our documents,
 * assigns the CUFE and transmits to the DGI.
 *
 * Auth is a static API key sent as a bearer token (their Swagger advertises
 * OAuth2, but the key is what the API actually accepts). Test vs production is
 * a property of the ACCOUNT, not a different host — the same base URL serves
 * both; test documents come back with iAmb=2 and carry no fiscal value.
 */

export const PAC_BASE = process.env.EFACTURA_API_URL || 'https://api.efacturapty.com/api/v1'

/** location_id 0 = the ONLINE channel (not a Mindbody location). */
export const ONLINE_CHANNEL_ID = 0

export interface EfacturaConfig {
  location_id: number
  api_key: string
  environment: 'test' | 'prod'
  punto_facturacion: string
  /** 4-digit DGI branch: '0000' CDE · '0001' SF · '0002' Mimosa Online. */
  codigo_sucursal: string | null
  label: string | null
  default_cpbs_code_short: number | null
  enabled: boolean
}

export async function loadEfacturaConfig(
  supabase: SupabaseClient,
  locationId: number
): Promise<EfacturaConfig | null> {
  const { data } = await supabase
    .from('efactura_config')
    .select('*')
    .eq('location_id', locationId)
    .maybeSingle<EfacturaConfig>()
  if (!data?.api_key || !data.enabled) return null
  return data
}

async function pacRequest(
  config: EfacturaConfig,
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  return fetch(`${PAC_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.api_key}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })
}

export interface PacInvoiceResult {
  autorizada: boolean
  cufe?: string
  protocoloAutorizacion?: string
  fechaAutorizacion?: string
  qrContent?: string
  secuence?: number
  invoice?: string
  id?: string
  raw: unknown
  httpStatus: number
  error?: string
}

/**
 * POST /Invoices — creates AND authorizes the document through the PAC.
 * NOTE: a DGI rejection arrives as HTTP 200 with `autorizada: false`, so the
 * status code alone is never a success signal.
 */
export async function emitInvoice(
  config: EfacturaConfig,
  payload: InvoiceRequest
): Promise<PacInvoiceResult> {
  const res = await pacRequest(config, '/Invoices', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const raw = await res.json().catch(() => ({}))
  const autorizada = res.ok && (raw as { autorizada?: boolean })?.autorizada === true
  const r = raw as Record<string, unknown>

  return {
    autorizada,
    cufe: typeof r.cufe === 'string' ? r.cufe : undefined,
    protocoloAutorizacion:
      typeof r.protocoloAutorizacion === 'string' ? r.protocoloAutorizacion : undefined,
    fechaAutorizacion: typeof r.fechaAutorizacion === 'string' ? r.fechaAutorizacion : undefined,
    qrContent: typeof r.qrContent === 'string' ? r.qrContent : undefined,
    secuence: typeof r.secuence === 'number' ? r.secuence : undefined,
    invoice: typeof r.invoice === 'string' ? r.invoice : undefined,
    id: typeof r.id === 'string' ? r.id : undefined,
    raw,
    httpStatus: res.status,
    error: autorizada ? undefined : pacRejectionMessage(raw, res.status),
  }
}

/**
 * Extracts the human-readable rejection from a PAC response. DGI validation
 * results live in rRetEnviFe.xProtFe.rProtFe.gInfProt.gResProc[] — e.g.
 * "10103: Campo codigoInternoItem no debe superar los 20 caracteres".
 */
export function pacRejectionMessage(result: unknown, httpStatus: number): string {
  const r = result as {
    rRetEnviFe?: { xProtFe?: { rProtFe?: { gInfProt?: { gResProc?: unknown } } } }
    message?: string
    title?: string
  }
  const proc = r?.rRetEnviFe?.xProtFe?.rProtFe?.gInfProt?.gResProc
  if (Array.isArray(proc) && proc.length > 0) {
    return proc
      .map((p: { dCodRes?: string; dMsgRes?: string }) =>
        [p?.dCodRes, p?.dMsgRes].filter(Boolean).join(': ')
      )
      .join('; ')
      .slice(0, 500)
  }
  return (r?.message || r?.title || `PAC HTTP ${httpStatus}`).slice(0, 500)
}

/** POST /InvoiceEvents/CreateCancellation — anular an emitted document. */
export async function cancelInvoice(
  config: EfacturaConfig,
  cufe: string,
  reason: string
): Promise<{ ok: boolean; raw: unknown }> {
  const res = await pacRequest(config, '/InvoiceEvents/CreateCancellation', {
    method: 'POST',
    body: JSON.stringify({ cufe, cancellationReason: reason.slice(0, 200) }),
  })
  const raw = await res.json().catch(() => ({}))
  return { ok: res.ok, raw }
}

/** GET /Invoices/{cufe}/cafe-file — the customer-facing CAFE as a PDF. */
export async function fetchCafePdf(
  config: EfacturaConfig,
  cufe: string
): Promise<{ ok: boolean; base64?: string; status: number }> {
  const res = await pacRequest(config, `/Invoices/${encodeURIComponent(cufe)}/cafe-file`, {
    headers: { Accept: 'application/pdf' },
  })
  if (!res.ok) return { ok: false, status: res.status }
  const buf = await res.arrayBuffer()
  return { ok: true, base64: Buffer.from(buf).toString('base64'), status: res.status }
}

/** GET /Invoices/Authorization/{cufe} — re-read protocol + QR for a document. */
export async function fetchAuthorization(
  config: EfacturaConfig,
  cufe: string
): Promise<unknown> {
  const res = await pacRequest(config, `/Invoices/Authorization/${encodeURIComponent(cufe)}`)
  return res.json().catch(() => ({}))
}
