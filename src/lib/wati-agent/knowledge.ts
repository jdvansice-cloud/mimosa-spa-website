import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { loadActivePromotions, type PromoSuggestion } from './promotions'
import { BUSINESS } from './config/business'
import { panamaDate } from './hours'
import { getServerSettings, aggregateRating, DEFAULT_SETTINGS, type ServerSiteSettings } from '@/lib/settings'
import { getActiveCatalog, type GcCatalogItem } from '@/lib/giftshop/data'
import {
  PAREJAS_COPY,
  OCCASIONS,
  EMPRESAS_COPY,
  CLUB_COPY,
  PRIMERA_VISITA_COPY,
  REFERIDOS_COPY,
} from '@/content/pages'

/**
 * Everything Camila can say about the website without calling a tool.
 *
 * `catalogText` goes into the prompt as its own cached block; `topics` and
 * `treatments` back the `get_site_info` / `get_treatment_details` tools.
 */
export interface TreatmentEntry {
  id: number
  name: string
  category: string
  minutes: number
  price: number
  description: string
  topPick: boolean
}

export const TOPIC_KEYS = [
  'parejas',
  'club',
  'empresas',
  'primera_visita',
  'referidos',
  'giftcards',
  'politicas',
  'ubicaciones',
] as const
export type TopicKey = (typeof TOPIC_KEYS)[number]

export interface Knowledge {
  catalogText: string
  treatments: TreatmentEntry[]
  topics: Record<TopicKey, string>
  builtAt: string
}

export interface OfferEntry {
  page: string
  name: string
  price: number | null
  priceNote: string
  includes: string[]
  description: string
}

export interface KnowledgeDeps {
  sb?: SupabaseClient
  promotions?: (today: string) => Promise<PromoSuggestion[]>
  settings?: () => Promise<ServerSiteSettings>
  giftCatalog?: () => Promise<GcCatalogItem[]>
  now?: Date
}

const DESC_MAX = 110

/** Descriptions come from the CMS and may carry markup or newlines. */
function clean(s: string | null | undefined): string {
  return String(s ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(s: string, max = DESC_MAX): string {
  if (s.length <= max) return s
  return s.slice(0, max - 1).trimEnd() + '…'
}

const money = (n: number | null | undefined): string =>
  n == null ? '' : Number.isInteger(Number(n)) ? String(Number(n)) : Number(n).toFixed(2)

function serviceClient(sb?: SupabaseClient): SupabaseClient {
  return sb ?? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

async function loadTreatments(sb: SupabaseClient): Promise<TreatmentEntry[]> {
  const { data, error } = await sb
    .from('treatment_settings')
    .select('mindbody_service_id, service_name, category, price, duration, description, is_top_pick')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })
  if (error) throw new Error(`knowledge/treatments: ${error.message}`)
  const seen = new Set<string>()
  const out: TreatmentEntry[] = []
  for (const row of (data ?? []) as Record<string, unknown>[]) {
    const name = clean(row.service_name as string)
    if (!name || seen.has(name)) continue
    seen.add(name)
    out.push({
      id: Number(row.mindbody_service_id ?? 0),
      name,
      category: clean(row.category as string) || 'Otros',
      minutes: Number(row.duration ?? 0),
      price: Number(row.price ?? 0),
      description: clean(row.description as string),
      topPick: Boolean(row.is_top_pick),
    })
  }
  return out
}

async function loadOffers(sb: SupabaseClient): Promise<OfferEntry[]> {
  const { data, error } = await sb
    .from('marketing_offers')
    .select('page, name_es, price, price_note_es, includes_es, description_es, is_active, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error) throw new Error(`knowledge/offers: ${error.message}`)
  return ((data ?? []) as Record<string, unknown>[]).map(o => ({
    page: String(o.page ?? ''),
    name: clean(o.name_es as string),
    price: o.price == null ? null : Number(o.price),
    priceNote: clean(o.price_note_es as string),
    includes: Array.isArray(o.includes_es) ? (o.includes_es as unknown[]).map(x => clean(String(x))).filter(Boolean) : [],
    description: clean(o.description_es as string),
  }))
}

const OFFER_PAGES: Array<[string, string]> = [
  ['parejas', 'Parejas'],
  ['club-mimosa', 'Club Mimosa'],
  ['empresas', 'Empresas'],
  ['primera-visita', 'Primera visita'],
]

function offerLine(o: OfferEntry): string {
  const precio = o.price != null ? ` · $${money(o.price)}` : ''
  const nota = o.priceNote ? ` (${o.priceNote})` : ''
  const incluye = o.includes.length ? ` — incluye ${o.includes.join(', ')}` : ''
  const desc = !o.includes.length && o.description ? ` — ${truncate(o.description)}` : ''
  return `- ${o.name}${precio}${nota}${incluye}${desc}`
}

function giftCardLines(items: GcCatalogItem[]): string[] {
  const monto = items
    .filter(i => i.kind === 'monetary')
    .map(i => `$${money(i.amount_cents / 100)}`)
  const exp = items.filter(i => i.kind === 'experience').map(i => `${clean(i.name_es)} ($${money(i.amount_cents / 100)})`)
  const out: string[] = []
  if (monto.length) out.push(`Montos disponibles: ${monto.join(', ')}.`)
  if (exp.length) out.push(`Experiencias de regalo: ${exp.join(', ')}.`)
  out.push('Se compran en mimosaretreat.com/giftcards.')
  out.push('Vigencia: consulte la vigencia en el certificado.')
  return out
}

const POLICY_TEXT = [
  'Cambios y cancelaciones: se aceptan siempre, a cualquier hora y sin penalidad, sin importar cuán cerca esté la cita. Nunca mencione multas ni cargos.',
  'Pedimos, como favor y nunca como condición, que nos avisen con 24 horitas de anticipación cuando se pueda.',
  BUSINESS.policies.arrivalText,
  'Reservas de 3 personas o más y eventos: los coordina una recepcionista (haga handoff).',
].join('\n')

function locationsText(s: ServerSiteSettings): string {
  const cde = BUSINESS.locations.cde
  const sfc = BUSINESS.locations.sfc
  return [
    `Costa del Este: ${cde.address}. Teléfono ${s.phone_costa_del_este}.`,
    `San Francisco: ${sfc.address}. Teléfono ${s.phone_san_francisco}.`,
    `Horario: ${BUSINESS.hours.text}.`,
    `Correo: ${s.email}. Web: ${BUSINESS.website}.`,
  ].join('\n')
}

function buildTopics(args: {
  offers: OfferEntry[]
  gift: GcCatalogItem[]
  settings: ServerSiteSettings
}): Record<TopicKey, string> {
  const { offers, gift, settings } = args
  const byPage = (page: string) => offers.filter(o => o.page === page)
  const offerBlock = (page: string) => {
    const list = byPage(page)
    return list.length ? `\nOfertas activas:\n${list.map(offerLine).join('\n')}` : ''
  }

  const parejas = [
    `${PAREJAS_COPY.heroTitle.es}: ${PAREJAS_COPY.heroSubtitle.es}`,
    PAREJAS_COPY.ritualsIntro.es,
    `${PAREJAS_COPY.occasionsTitle.es}: ${PAREJAS_COPY.occasionsIntro.es}`,
    ...OCCASIONS.map(o => `- ${o.name.es}: ${o.description.es}`),
    PAREJAS_COPY.giftBody.es,
    'Grupos de 3 o más y ocasiones especiales los coordina una recepcionista.',
  ].join('\n') + offerBlock('parejas')

  const club = [
    `${CLUB_COPY.heroTitle.es}: ${CLUB_COPY.heroSubtitle.es}`,
    `${CLUB_COPY.howTitle.es}:`,
    ...CLUB_COPY.how.map(h => `- ${h.es}`),
    `${CLUB_COPY.vipTitle.es}: ${CLUB_COPY.vipBody.es}`,
    `${CLUB_COPY.waitlistTitle.es}: ${CLUB_COPY.waitlistIntro.es}`,
  ].join('\n') + offerBlock('club-mimosa')

  const empresas = [
    `${EMPRESAS_COPY.heroTitle.es}: ${EMPRESAS_COPY.heroSubtitle.es}`,
    `${EMPRESAS_COPY.giftingTitle.es}: ${EMPRESAS_COPY.giftingBody.es}`,
    `${EMPRESAS_COPY.wellnessTitle.es}: ${EMPRESAS_COPY.wellnessBody.es}`,
    `${EMPRESAS_COPY.eventsTitle.es}: ${EMPRESAS_COPY.eventsBody.es}`,
    `${EMPRESAS_COPY.formTitle.es}: ${EMPRESAS_COPY.formIntro.es}`,
  ].join('\n') + offerBlock('empresas')

  const primera = [
    `${PRIMERA_VISITA_COPY.heroTitle.es}: ${PRIMERA_VISITA_COPY.heroSubtitle.es}`,
    `${PRIMERA_VISITA_COPY.stepsTitle.es}:`,
    ...PRIMERA_VISITA_COPY.steps.map(s => `- ${s.es}`),
  ].join('\n') + offerBlock('primera-visita')

  const referidos = [
    `${REFERIDOS_COPY.heroTitle.es}: ${REFERIDOS_COPY.heroSubtitle.es}`,
    'Estado: próximamente / lista de espera. Todavía no está disponible; puede dejar sus datos para avisarle.',
    `${REFERIDOS_COPY.notifyTitle.es}: ${REFERIDOS_COPY.notifyIntro.es}`,
  ].join('\n')

  const giftcards = ['Certificados de regalo Mimosa.', ...giftCardLines(gift)].join('\n')

  return {
    parejas,
    club,
    empresas,
    primera_visita: primera,
    referidos,
    giftcards,
    politicas: POLICY_TEXT,
    ubicaciones: locationsText(settings),
  }
}

function buildCatalogText(args: {
  treatments: TreatmentEntry[]
  promos: PromoSuggestion[]
  offers: OfferEntry[]
  gift: GcCatalogItem[]
  settings: ServerSiteSettings
}): string {
  const { treatments, promos, offers, gift, settings } = args
  const parts: string[] = []

  // Treatments, grouped by category in first-appearance order (sort_order).
  const cats: string[] = []
  const byCat = new Map<string, TreatmentEntry[]>()
  for (const t of treatments) {
    if (!byCat.has(t.category)) { byCat.set(t.category, []); cats.push(t.category) }
    byCat.get(t.category)!.push(t)
  }
  const catBlocks = cats.map(c => {
    const lines = byCat.get(c)!.map(t => {
      const star = t.topPick ? '★ ' : ''
      const desc = t.description ? ` — ${truncate(t.description)}` : ''
      return `- ${star}${t.name} · ${t.minutes} min · $${money(t.price)} · ${t.category}${desc}`
    })
    return `### ${c}\n${lines.join('\n')}`
  })
  parts.push(`## Catálogo de tratamientos\n${catBlocks.length ? catBlocks.join('\n') : '(sin tratamientos)'}`)

  parts.push(
    `## Promociones activas (web)\n${
      promos.length
        ? promos
            .map(p => {
              const antes = p.precio_original ? ` (antes $${money(p.precio_original)})` : ''
              const min = p.minutos ? ` · ${p.minutos} min` : ''
              return `- ${p.titulo} · $${money(p.precio)}${antes}${min}`
            })
            .join('\n')
        : '(ninguna activa)'
    }`,
  )

  const offerBlocks = OFFER_PAGES.map(([page, label]) => {
    const list = offers.filter(o => o.page === page)
    if (!list.length) return null
    return `### ${label}\n${list.map(offerLine).join('\n')}`
  }).filter(Boolean) as string[]
  parts.push(`## Ofertas de página\n${offerBlocks.length ? offerBlocks.join('\n') : '(ninguna activa)'}`)

  const giftSummary = giftCardLines(gift).join(' ')
  parts.push(
    [
      '## Páginas',
      `- Parejas: ${PAREJAS_COPY.heroSubtitle.es} ${PAREJAS_COPY.ritualsIntro.es} Ocasiones: ${OCCASIONS.map(o => o.name.es).join(', ')}.`,
      `- Club Mimosa: ${CLUB_COPY.heroSubtitle.es} ${CLUB_COPY.how.map(h => h.es).join(' ')} ${CLUB_COPY.vipBody.es}`,
      `- Empresas: ${EMPRESAS_COPY.heroSubtitle.es} ${EMPRESAS_COPY.giftingBody.es} ${EMPRESAS_COPY.wellnessBody.es} ${EMPRESAS_COPY.eventsBody.es}`,
      `- Primera visita: ${PRIMERA_VISITA_COPY.heroSubtitle.es} ${PRIMERA_VISITA_COPY.steps.map(s => s.es).join(' ')}`,
      `- Referidos: ${REFERIDOS_COPY.heroSubtitle.es} Próximamente / lista de espera; todavía no está disponible.`,
      `- Certificados de regalo: ${giftSummary}`,
    ].join('\n'),
  )

  const r = aggregateRating(settings)
  parts.push(
    [
      '## Datos',
      `- Horario: ${BUSINESS.hours.text}`,
      `- Teléfono Costa del Este: ${settings.phone_costa_del_este}`,
      `- Teléfono San Francisco: ${settings.phone_san_francisco}`,
      `- Correo: ${settings.email}`,
      `- Google: ${money(r.rating)} ★ con ${r.count} reseñas`,
      '- Cambios y cancelaciones: siempre se aceptan, a cualquier hora y sin penalidad.',
      '- Grupos de 3 o más y eventos: los coordina una recepcionista.',
    ].join('\n'),
  )

  return parts.join('\n\n')
}

export async function buildKnowledge(deps: KnowledgeDeps = {}): Promise<Knowledge> {
  const sb = serviceClient(deps.sb)
  const now = deps.now ?? new Date()
  const loadPromos = deps.promotions ?? ((today: string) => loadActivePromotions(today, deps.sb))
  const loadSettings = deps.settings ?? (() => getServerSettings())
  const loadGift = deps.giftCatalog ?? (() => getActiveCatalog())

  const [treatments, offers, promos, settings, gift] = await Promise.all([
    loadTreatments(sb).catch(() => [] as TreatmentEntry[]),
    loadOffers(sb).catch(() => [] as OfferEntry[]),
    loadPromos(panamaDate(now)).catch(() => [] as PromoSuggestion[]),
    loadSettings().catch(() => null),
    loadGift().catch(() => [] as GcCatalogItem[]),
  ])

  const resolvedSettings = settings ?? DEFAULT_SETTINGS
  const topics = buildTopics({ offers, gift, settings: resolvedSettings })
  const catalogText = buildCatalogText({ treatments, promos, offers, gift, settings: resolvedSettings })

  return { catalogText, treatments, topics, builtAt: now.toISOString() }
}

// ---------------------------------------------------------------------------
// Fuzzy lookup

/** Lowercase, accent-stripped, punctuation-free tokens. */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const STOP = new Set(['de', 'la', 'el', 'los', 'las', 'y', 'con', 'para', 'min', 'minutos', 'masaje'])

function tokens(s: string): string[] {
  return normalize(s).split(' ').filter(w => w.length > 2 && !STOP.has(w))
}

export interface TreatmentMatch {
  match: TreatmentEntry | null
  similar: string[]
}

/** Best treatment for a free-text name: exact, then substring, then token overlap. */
export function findTreatment(name: string, list: TreatmentEntry[]): TreatmentMatch {
  const q = normalize(name)
  if (!q || !list.length) return { match: null, similar: list.slice(0, 3).map(t => t.name) }

  const exact = list.find(t => normalize(t.name) === q)
  if (exact) return { match: exact, similar: [] }

  const sub = list.find(t => normalize(t.name).includes(q) || q.includes(normalize(t.name)))
  if (sub) return { match: sub, similar: [] }

  const qt = tokens(name)
  let best: TreatmentEntry | null = null
  let bestScore = 0
  const scored: Array<{ t: TreatmentEntry; score: number }> = []
  for (const t of list) {
    const tt = tokens(t.name)
    const hits = qt.filter(w => tt.some(x => x === w || x.startsWith(w) || w.startsWith(x))).length
    const score = qt.length ? hits / qt.length : 0
    scored.push({ t, score })
    if (score > bestScore) { bestScore = score; best = t }
  }
  if (best && bestScore >= 0.5) return { match: best, similar: [] }

  const similar = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.t.name)
  return { match: null, similar }
}

// ---------------------------------------------------------------------------
// Module-level cache (6 h), mirroring the services cache.

const TTL_MS = 6 * 60 * 60 * 1000
let cached: { at: number; value: Promise<Knowledge> } | null = null

export async function getKnowledge(deps: KnowledgeDeps = {}): Promise<Knowledge> {
  const now = Date.now()
  if (cached && now - cached.at < TTL_MS) return cached.value
  const value = buildKnowledge(deps)
  cached = { at: now, value }
  try {
    return await value
  } catch (e) {
    cached = null
    throw e
  }
}

export function invalidateKnowledge(): void {
  cached = null
}
