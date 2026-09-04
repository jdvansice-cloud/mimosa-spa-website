# WATI AI Receptionist ("Camila") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** An autonomous WhatsApp receptionist on WATI that answers every inbound chat in the real receptionists' voice, books/changes Mindbody appointments, sends images and location links, and hands off to the human team through the existing WATI flow.

**Architecture:** WATI account webhooks post to three Next.js routes (`/api/wati/agent/{inbound,sent,status}`). The inbound route acks at once and runs the agent in the background: load state from Supabase, debounce bursts, run Claude with tools (Mindbody, media, WATI), send bubbles through the WATI session API, persist everything. Handoff sets contact attributes and starts the WATI handoff chatbot. All logic lives in `src/lib/wati-agent/` as small pure modules with unit tests; routes are thin.

**Tech Stack:** Next.js 16 App Router on Vercel (Node runtime, `waitUntil` from `@vercel/functions`), Supabase (Postgres + Storage), `@anthropic-ai/sdk` (manual tool loop, `claude-sonnet-5` per spec, overridable), WATI v1 + ext/v3 REST, Mindbody v6 via existing `src/lib/booking/mindbody.ts`, Vitest for tests.

**Spec:** `docs/superpowers/specs/2026-09-04-wati-ai-receptionist-design.md`

## Global Constraints

- Phones are digits only, country code first, no `+` (e.g. `50766124546`). Reuse `formatPhoneForWati` logic.
- Spanish, formal `usted`, persona name **Camila 🌼**; admits being an assistant if asked and hands off.
- Prices/durations/promos only from tool results (Mindbody services, media captions). Never from model memory.
- Booking and changes require `customer_confirmation` quoting the customer's yes; tool rejects otherwise.
- Mindbody location ids: 1 = Costa del Este (`cde`), 2 = San Francisco (`sfc`).
- Hours: Lun–Vie 9:00–20:00, Sáb–Dom 9:00–18:00, timezone `America/Panama`.
- Modes: `WATI_AGENT_MODE` = `off | shadow | whitelist | live`. In `shadow` nothing is sent to WATI.
- Webhook routes must return 200 quickly; WATI retries non-200 up to 144 times.
- Every new server file under `src/lib/wati-agent/` must be importable without side effects (no top-level env reads that throw), so tests run without `.env.local`.
- Scripts run with `node --env-file=.env.local --experimental-strip-types --import ./scripts/spikes/ts-resolve-register.mjs <file>` from the repo root.
- Commit after every task. Never `git add` the `.next/` directory or files with ` 2`, ` 3` … suffixes.
- Run all scripts and tests from `/Users/juanvansice/Documents/GitHub/mimosa-spa-website` (the `.env.local` lives there).

---

## File map

| Path | Responsibility |
|---|---|
| `vitest.config.ts`, `package.json` | test runner + new deps |
| `supabase/migrations/20260904_wati_agent.sql` | tables from spec §4 + storage bucket |
| `src/lib/wati-agent/types.ts` | shared TS types (Conversation, StoredMessage, Sucursal, AgentMode…) |
| `src/lib/wati-agent/phone.ts` | `cleanPhone()` |
| `src/lib/wati-agent/config/business.ts` | addresses, links, hours, policies, payment block |
| `src/lib/wati-agent/config/env.ts` | typed env access (lazy) |
| `src/lib/wati-agent/hours.ts` | open/closed + greeting by time of day (Panama tz) |
| `src/lib/wati-agent/bubbles.ts` | split reply into ≤3 bubbles |
| `src/lib/wati-agent/triggers.ts` | deterministic handoff triggers |
| `src/lib/wati-agent/gate.ts` | should-this-message-run decision |
| `src/lib/wati-agent/wati-api.ts` | WATI REST client (send text/file/buttons, attributes, assign, start chatbot, status, media) |
| `src/lib/wati-agent/store.ts` | Supabase persistence |
| `src/lib/wati-agent/voice/parse-export.ts` | chat export parser |
| `src/lib/wati-agent/voice/scrub.ts` | PII scrubbing |
| `src/lib/wati-agent/voice/exemplars.json`, `style-guide.md` | generated voice assets |
| `src/lib/wati-agent/voice/select.ts` | pick exemplars by intent/sucursal |
| `src/lib/wati-agent/prompt.ts` | system prompt assembly |
| `src/lib/wati-agent/tools/definitions.ts` | `Anthropic.Tool[]` |
| `src/lib/wati-agent/tools/validate.ts` | input validation (confirmation, 24 h policy, couples) |
| `src/lib/wati-agent/tools/mindbody-adapter.ts` | services cache, availability, client, book, cancel |
| `src/lib/wati-agent/tools/execute.ts` | tool dispatcher |
| `src/lib/wati-agent/handoff.ts` | handoff / takeover / resume |
| `src/lib/wati-agent/runner.ts` | Claude loop + sending |
| `src/app/api/wati/agent/inbound/route.ts`, `sent/route.ts`, `status/route.ts` | webhooks |
| `src/app/api/admin/wati-agent/**` | admin JSON APIs |
| `src/app/admin/wati-agent/**` | admin UI |
| `scripts/wati-agent/mine-chats.ts` | export → exemplars + style guide |
| `scripts/wati-agent/evals/{cases.json,run.ts}` | replay evals |
| `docs/WATI_AGENT.md` | WATI setup + spike checklist + rollout |

---

### Task 1: Test runner and dependencies

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (scripts + deps)
- Create: `src/lib/wati-agent/phone.ts`
- Test: `src/lib/wati-agent/phone.test.ts`

**Interfaces:**
- Produces: `cleanPhone(raw: unknown): string` — digits only, adds `507` to 8-digit numbers.

- [ ] **Step 1: Install deps**

```bash
npm install @anthropic-ai/sdk @vercel/functions
npm install -D vitest
```

- [ ] **Step 2: Add config and script**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'scripts/wati-agent/**/*.test.ts'],
    environment: 'node',
  },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
})
```

In `package.json` scripts add `"test": "vitest run"` and `"test:watch": "vitest"`.

- [ ] **Step 3: Write failing test**

`src/lib/wati-agent/phone.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { cleanPhone } from './phone'

describe('cleanPhone', () => {
  it('strips non-digits', () => expect(cleanPhone('+507 6612-4546')).toBe('50766124546'))
  it('prefixes 507 to 8-digit local numbers', () => expect(cleanPhone('66124546')).toBe('50766124546'))
  it('keeps foreign numbers', () => expect(cleanPhone('17864772422')).toBe('17864772422'))
  it('returns empty for junk', () => expect(cleanPhone('{{phone}}')).toBe(''))
})
```

- [ ] **Step 4: Run, expect failure** — `npm test -- phone` → "Cannot find module './phone'".

- [ ] **Step 5: Implement**

`src/lib/wati-agent/phone.ts`:
```ts
/** Digits only, country code first, no '+'. 8-digit numbers are Panamá. */
export function cleanPhone(raw: unknown): string {
  const digits = String(raw ?? '').replace(/\D/g, '')
  if (digits.length === 8) return '507' + digits
  return digits
}
```

- [ ] **Step 6: Run, expect pass** — `npm test -- phone`.

- [ ] **Step 7: Commit**

```bash
git add vitest.config.ts package.json package-lock.json src/lib/wati-agent/phone.ts src/lib/wati-agent/phone.test.ts
git commit -m "chore(wati-agent): vitest, anthropic sdk, vercel functions, phone helper"
```

---

### Task 2: Database migration

**Files:**
- Create: `supabase/migrations/20260904_wati_agent.sql`
- Create: `src/lib/wati-agent/types.ts`

**Interfaces:**
- Produces types used everywhere:

```ts
export type Sucursal = 'cde' | 'sfc'
export type ConversationMode = 'agent' | 'human' | 'off'
export type GlobalMode = 'off' | 'shadow' | 'whitelist' | 'live'
export type Author = 'customer' | 'camila' | 'human' | 'bot' | 'template'
export interface Conversation {
  phone: string; wati_contact_id: string | null; ticket_id: string | null
  mode: ConversationMode; sucursal: Sucursal | null
  mindbody_client_id: string | null; client_name: string | null
  summary: string | null; handoff_reason: string | null
  human_since: string | null; last_inbound_at: string | null; last_outbound_at: string | null
  audio_count: number
}
export interface StoredMessage {
  id?: number; phone: string; wati_message_id: string | null
  direction: 'in' | 'out'; author: Author; type: string
  text: string | null; media_ref: string | null; shadow: boolean; created_at?: string
}
export interface MediaAsset {
  key: string; description: string; caption: string; storage_path: string
  valid_from: string | null; valid_until: string | null; active: boolean
}
export type EventKind = 'tool_call' | 'tool_result' | 'handoff' | 'takeover' | 'resume' | 'error' | 'llm' | 'shadow_reply'
```

- [ ] **Step 1: Write `types.ts`** with the block above.

- [ ] **Step 2: Write the migration**

```sql
-- WATI AI receptionist (Camila). Idempotent.
create table if not exists wati_agent_conversations (
  phone text primary key,
  wati_contact_id text,
  ticket_id text,
  mode text not null default 'agent' check (mode in ('agent','human','off')),
  sucursal text check (sucursal in ('cde','sfc')),
  mindbody_client_id text,
  client_name text,
  summary text,
  handoff_reason text,
  human_since timestamptz,
  last_inbound_at timestamptz,
  last_outbound_at timestamptz,
  audio_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists wati_agent_messages (
  id bigserial primary key,
  phone text not null references wati_agent_conversations(phone) on delete cascade,
  wati_message_id text unique,
  direction text not null check (direction in ('in','out')),
  author text not null,
  type text not null default 'text',
  text text,
  media_ref text,
  shadow boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists wati_agent_messages_phone_created on wati_agent_messages(phone, created_at desc);

create table if not exists wati_agent_events (
  id bigserial primary key,
  phone text,
  kind text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);
create index if not exists wati_agent_events_phone_created on wati_agent_events(phone, created_at desc);

create table if not exists wati_agent_media (
  key text primary key,
  description text not null,
  caption text not null default '',
  storage_path text not null,
  valid_from date,
  valid_until date,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists wati_agent_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
insert into wati_agent_settings(key, value) values
  ('enabled', 'true'::jsonb),
  ('persona_name', '"Camila"'::jsonb)
on conflict (key) do nothing;

insert into storage.buckets (id, name, public)
values ('wati-agent-media', 'wati-agent-media', true)
on conflict (id) do nothing;

alter table wati_agent_conversations enable row level security;
alter table wati_agent_messages enable row level security;
alter table wati_agent_events enable row level security;
alter table wati_agent_media enable row level security;
alter table wati_agent_settings enable row level security;
```

(Service-role key bypasses RLS; no policies needed for v1 since only server code touches these tables.)

- [ ] **Step 3: Run it in the Supabase SQL editor** (project ref `aoqbaxfynmlcxwrnaeyo`) and confirm `select count(*) from wati_agent_settings` returns 2.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260904_wati_agent.sql src/lib/wati-agent/types.ts
git commit -m "feat(wati-agent): schema for conversations, messages, events, media, settings"
```

---

### Task 3: Business config, hours, and greeting

**Files:**
- Create: `src/lib/wati-agent/config/business.ts`, `src/lib/wati-agent/config/env.ts`, `src/lib/wati-agent/hours.ts`
- Test: `src/lib/wati-agent/hours.test.ts`

**Interfaces:**
- `BUSINESS.locations[sucursal]` → `{ name, mindbodyLocationId, address, plaza, wazeUrl, mapsUrl, parking, phone }`
- `BUSINESS.hours`, `BUSINESS.policies`, `BUSINESS.payment`
- `isOpen(at: Date): boolean`, `greetingFor(at: Date): 'Muy buenos días' | 'Muy buenas tardes' | 'Muy buenas noches'`, `panamaNow(): Date`, `formatPanama(d: Date): string`
- `env()` returns `{ watiUrl, watiToken, webhookSecret, operatorEmail, handoffChatbotId, citasCdeEmail, citasSfcEmail, mode, whitelist: string[], model }`

- [ ] **Step 1: Failing tests**

```ts
import { describe, it, expect } from 'vitest'
import { isOpen, greetingFor } from './hours'

// 2026-09-04 is a Friday. Panama is UTC-5, no DST.
const pa = (h: number, day = '2026-09-04') => new Date(`${day}T${String(h).padStart(2,'0')}:00:00-05:00`)

describe('hours', () => {
  it('weekday 10:00 open', () => expect(isOpen(pa(10))).toBe(true))
  it('weekday 20:30 closed', () => expect(isOpen(new Date('2026-09-04T20:30:00-05:00'))).toBe(false))
  it('saturday 18:30 closed', () => expect(isOpen(new Date('2026-09-05T18:30:00-05:00'))).toBe(false))
  it('sunday 09:00 open', () => expect(isOpen(pa(9, '2026-09-06'))).toBe(true))
  it('greeting morning', () => expect(greetingFor(pa(8))).toBe('Muy buenos días'))
  it('greeting afternoon', () => expect(greetingFor(pa(15))).toBe('Muy buenas tardes'))
  it('greeting night', () => expect(greetingFor(pa(19))).toBe('Muy buenas noches'))
})
```

- [ ] **Step 2: Run, expect failure.**

- [ ] **Step 3: Implement**

`config/business.ts`:
```ts
import type { Sucursal } from '../types'

export const BUSINESS = {
  brand: 'Mimosa Spa Retreat',
  website: 'https://www.mimosaretreat.com',
  bookingUrl: 'https://www.mimosaretreat.com/es/reservar',
  locations: {
    cde: {
      name: 'Costa del Este',
      mindbodyLocationId: 1,
      plaza: 'Star Plaza, Costa del Este',
      address: 'Star Plaza, Costa del Este, Ciudad de Panamá',
      wazeUrl: 'https://waze.com/ul?q=Mimosa%20Spa%20Retreat%20Costa%20del%20Este',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mimosa+Spa+Retreat+Costa+del+Este',
      parking: 'Estacionamiento en la plaza.',
    },
    sfc: {
      name: 'San Francisco',
      mindbodyLocationId: 2,
      plaza: 'San Francisco',
      address: 'San Francisco, Ciudad de Panamá',
      wazeUrl: 'https://waze.com/ul?q=Mimosa%20Spa%20Retreat%20San%20Francisco',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mimosa+Spa+Retreat+San+Francisco',
      parking: 'Estacionamiento disponible.',
    },
  } satisfies Record<Sucursal, unknown>,
  hours: {
    weekday: { open: 9, close: 20 },
    weekend: { open: 9, close: 18 },
    text: 'Lun-Vie 9AM-8PM · Sáb-Dom 9AM-6PM',
  },
  policies: {
    changeNoticeHours: 24,
    changeText: 'Para cambios o cancelaciones necesitamos 24 horas de anticipación.',
    arrivalText: 'Le recomendamos llegar 10 minutos antes de su cita.',
  },
  payment: {
    yappyText: 'En YAPPY nos busca en el directorio como MIMOSA (logo de la flor amarilla 🌼).',
    transferText: 'Cuenta Corriente\nRelax Cala S A\n0343 010913 56 6\nBanco General',
  },
} as const

export const LOCATION_ID_TO_SUCURSAL: Record<number, Sucursal> = { 1: 'cde', 2: 'sfc' }
```

> The exact addresses, Waze links and parking notes must be confirmed by the owner before shadow mode; leave a `// TODO owner-verify` is NOT allowed — instead the admin settings page (Task 15) exposes these strings for editing via `wati_agent_settings` key `business_overrides` and `BUSINESS` is the default.

`config/env.ts`:
```ts
import type { GlobalMode } from '../types'

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
    whitelist: (process.env.WATI_AGENT_WHITELIST || '').split(',').map(s => s.replace(/\D/g, '')).filter(Boolean),
    model: process.env.WATI_AGENT_MODEL || 'claude-sonnet-5',
  }
}
```

`hours.ts`:
```ts
import { BUSINESS } from './config/business'

const TZ = 'America/Panama'

function parts(d: Date) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', hour12: false, weekday: 'short', minute: 'numeric' })
  const p = Object.fromEntries(f.formatToParts(d).map(x => [x.type, x.value]))
  const hour = Number(p.hour) % 24
  const minute = Number(p.minute)
  const weekend = p.weekday === 'Sat' || p.weekday === 'Sun'
  return { hour, minute, weekend }
}

export function isOpen(at: Date): boolean {
  const { hour, minute, weekend } = parts(at)
  const h = weekend ? BUSINESS.hours.weekend : BUSINESS.hours.weekday
  const t = hour + minute / 60
  return t >= h.open && t < h.close
}

export function greetingFor(at: Date): 'Muy buenos días' | 'Muy buenas tardes' | 'Muy buenas noches' {
  const { hour } = parts(at)
  if (hour < 12) return 'Muy buenos días'
  if (hour < 18) return 'Muy buenas tardes'
  return 'Muy buenas noches'
}

export function panamaNow(): Date { return new Date() }

/** "viernes 4 de septiembre de 2026, 3:05 p. m." */
export function formatPanama(d: Date): string {
  return new Intl.DateTimeFormat('es-PA', { timeZone: TZ, dateStyle: 'full', timeStyle: 'short' }).format(d)
}

/** YYYY-MM-DD in Panamá for a Date. */
export function panamaDate(d: Date): string {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
  return f.format(d)
}
```

- [ ] **Step 4: Run tests, expect pass.**

- [ ] **Step 5: Commit** `feat(wati-agent): business config, env, hours`.

---

### Task 4: Bubble splitter

**Files:** `src/lib/wati-agent/bubbles.ts`, test `bubbles.test.ts`

**Interfaces:** `splitBubbles(text: string, max = 3): string[]` — splits on lines that are exactly `---`, trims, drops empties, merges overflow into the last bubble.

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect } from 'vitest'
import { splitBubbles } from './bubbles'

describe('splitBubbles', () => {
  it('splits on --- lines', () => {
    expect(splitBubbles('Hola\n---\n¿Para qué día?')).toEqual(['Hola', '¿Para qué día?'])
  })
  it('keeps a single bubble', () => expect(splitBubbles('Con gusto 🌼')).toEqual(['Con gusto 🌼']))
  it('caps at 3 bubbles, merging the rest', () => {
    expect(splitBubbles('a\n---\nb\n---\nc\n---\nd')).toEqual(['a', 'b', 'c\n\nd'])
  })
  it('drops empty bubbles', () => expect(splitBubbles('a\n---\n\n---\nb')).toEqual(['a', 'b']))
})
```

- [ ] **Step 2: Run, fail.**

- [ ] **Step 3: Implement**

```ts
export function splitBubbles(text: string, max = 3): string[] {
  const parts = text.split(/\n\s*---\s*\n/).map(s => s.trim()).filter(Boolean)
  if (parts.length <= max) return parts
  return [...parts.slice(0, max - 1), parts.slice(max - 1).join('\n\n')]
}
```

- [ ] **Step 4: Pass, commit** `feat(wati-agent): bubble splitter`.

---

### Task 5: Deterministic handoff triggers and gate

**Files:** `src/lib/wati-agent/triggers.ts`, `gate.ts`, tests for both.

**Interfaces:**
```ts
// triggers.ts
export type TriggerResult = { handoff: true; motivo: string } | { handoff: false }
export function checkTriggers(input: { type: string; text: string | null; audioCount: number }): TriggerResult
// gate.ts
export type GateInput = {
  globalMode: GlobalMode; enabledSetting: boolean; whitelist: string[]
  phone: string; conversationMode: ConversationMode; owner: boolean
}
export type GateDecision = { run: false; reason: string } | { run: true; shadow: boolean }
export function gate(i: GateInput): GateDecision
```

Motivos (used in attributes and admin stats): `comprobante_o_imagen`, `audio`, `certificado`, `queja`, `grupo`, `terapeuta`, `medico`, `es_bot`, `error_sistema`, `politica_24h`, `modelo` (model-initiated).

- [ ] **Step 1: Failing tests**

`triggers.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { checkTriggers } from './triggers'

const t = (text: string, type = 'text', audioCount = 0) => checkTriggers({ type, text, audioCount })

describe('checkTriggers', () => {
  it('image → comprobante', () => expect(t(null as unknown as string, 'image')).toEqual({ handoff: true, motivo: 'comprobante_o_imagen' }))
  it('first audio passes', () => expect(t(null as unknown as string, 'audio', 1)).toEqual({ handoff: false }))
  it('second audio → audio', () => expect(t(null as unknown as string, 'audio', 2)).toEqual({ handoff: true, motivo: 'audio' }))
  it('gift certificate', () => expect(t('quiero un certificado de regalo')).toEqual({ handoff: true, motivo: 'certificado' }))
  it('gift card english', () => expect(t('do you sell gift cards?')).toEqual({ handoff: true, motivo: 'certificado' }))
  it('complaint', () => expect(t('quiero poner una queja, pésimo servicio')).toEqual({ handoff: true, motivo: 'queja' }))
  it('group of 4', () => expect(t('somos 4 personas para el sábado')).toEqual({ handoff: true, motivo: 'grupo' }))
  it('couple is fine', () => expect(t('somos 2 personas')).toEqual({ handoff: false }))
  it('bot question', () => expect(t('eres un bot?')).toEqual({ handoff: true, motivo: 'es_bot' }))
  it('plain booking passes', () => expect(t('quiero reservar un masaje mañana')).toEqual({ handoff: false }))
})
```

`gate.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { gate } from './gate'

const base = { globalMode: 'live' as const, enabledSetting: true, whitelist: [], phone: '50766124546', conversationMode: 'agent' as const, owner: false }

describe('gate', () => {
  it('runs live', () => expect(gate(base)).toEqual({ run: true, shadow: false }))
  it('shadow', () => expect(gate({ ...base, globalMode: 'shadow' })).toEqual({ run: true, shadow: true }))
  it('off global', () => expect(gate({ ...base, globalMode: 'off' }).run).toBe(false))
  it('disabled setting', () => expect(gate({ ...base, enabledSetting: false }).run).toBe(false))
  it('whitelist miss', () => expect(gate({ ...base, globalMode: 'whitelist', whitelist: ['50711111111'] }).run).toBe(false))
  it('whitelist hit', () => expect(gate({ ...base, globalMode: 'whitelist', whitelist: ['50766124546'] })).toEqual({ run: true, shadow: false }))
  it('human mode', () => expect(gate({ ...base, conversationMode: 'human' }).run).toBe(false))
  it('owner message', () => expect(gate({ ...base, owner: true }).run).toBe(false))
})
```

- [ ] **Step 2: Run, fail.**

- [ ] **Step 3: Implement**

`triggers.ts`:
```ts
export type TriggerResult = { handoff: true; motivo: string } | { handoff: false }

const RULES: Array<{ motivo: string; re: RegExp }> = [
  { motivo: 'certificado', re: /\b(certificado|gift ?card|tarjeta de regalo|bono de regalo|voucher)\b/i },
  { motivo: 'queja', re: /\b(queja|reclamo|p[ée]simo|molest[oa]|inaceptable|reembolso|devoluci[oó]n|denuncia)\b/i },
  { motivo: 'terapeuta', re: /\b(con la (misma )?terapeuta|con (la|el) (se[ñn]ora?|se[ñn]orita|muchacha) [A-ZÁÉÍÓÚ][a-záéíóú]+|terapeuta [A-ZÁÉÍÓÚ][a-záéíóú]+)\b/ },
  { motivo: 'medico', re: /\b(embaraz|lesi[oó]n|cirug[ií]a|hernia|fractura|m[ée]dic[oa]|trombo|cancer|c[áa]ncer)\b/i },
  { motivo: 'es_bot', re: /\b(eres|sos|es usted|hablo con)\s+(un|una)?\s*(bot|robot|m[áa]quina|ia|inteligencia artificial|asistente virtual)\b/i },
]

export function checkTriggers(input: { type: string; text: string | null; audioCount: number }): TriggerResult {
  const type = (input.type || 'text').toLowerCase()
  if (['image', 'document', 'video', 'sticker'].includes(type)) return { handoff: true, motivo: 'comprobante_o_imagen' }
  if (type === 'audio' || type === 'voice') return input.audioCount >= 2 ? { handoff: true, motivo: 'audio' } : { handoff: false }
  const text = input.text || ''
  const people = text.match(/\b(somos|para|de)\s+(\d+)\s+(personas?|pax|amigas?|chicas?)\b/i)
  if (people && Number(people[2]) >= 3) return { handoff: true, motivo: 'grupo' }
  for (const r of RULES) if (r.re.test(text)) return { handoff: true, motivo: r.motivo }
  return { handoff: false }
}
```

`gate.ts`:
```ts
import type { ConversationMode, GlobalMode } from './types'

export type GateInput = {
  globalMode: GlobalMode; enabledSetting: boolean; whitelist: string[]
  phone: string; conversationMode: ConversationMode; owner: boolean
}
export type GateDecision = { run: false; reason: string } | { run: true; shadow: boolean }

export function gate(i: GateInput): GateDecision {
  if (i.owner) return { run: false, reason: 'owner_message' }
  if (i.globalMode === 'off') return { run: false, reason: 'global_off' }
  if (!i.enabledSetting) return { run: false, reason: 'setting_disabled' }
  if (i.conversationMode !== 'agent') return { run: false, reason: `conversation_${i.conversationMode}` }
  if (i.globalMode === 'whitelist' && !i.whitelist.includes(i.phone)) return { run: false, reason: 'not_whitelisted' }
  return { run: true, shadow: i.globalMode === 'shadow' }
}
```

- [ ] **Step 4: Pass, commit** `feat(wati-agent): handoff triggers and run gate`.

---

### Task 6: WATI API client

**Files:** `src/lib/wati-agent/wati-api.ts`, test `wati-api.test.ts`

**Interfaces:**
```ts
export interface WatiClient {
  sendText(phone: string, text: string): Promise<{ ok: boolean; messageId?: string; error?: string }>
  sendFile(phone: string, file: { bytes: Uint8Array; filename: string; mime: string }, caption?: string): Promise<{ ok: boolean; error?: string }>
  sendButtons(phone: string, body: string, buttons: string[], footer?: string): Promise<{ ok: boolean; error?: string }>
  updateAttributes(phone: string, attrs: Record<string, string>): Promise<{ ok: boolean; error?: string }>
  assignOperator(phone: string, email: string | null): Promise<{ ok: boolean; error?: string }>
  assignTeams(phone: string, teams: string[]): Promise<{ ok: boolean; error?: string }>
  startChatbot(phone: string, chatbotId: string): Promise<{ ok: boolean; error?: string }>
  updateChatStatus(phone: string, status: 'OPEN' | 'SOLVED' | 'PENDING'): Promise<{ ok: boolean; error?: string }>
  getMedia(fileName: string): Promise<{ ok: boolean; bytes?: Uint8Array; mime?: string; error?: string }>
}
export function createWatiClient(opts: { baseUrl: string; token: string; fetchImpl?: typeof fetch }): WatiClient
```

Endpoints (from docs.wati.io, verified 2026-09-04):
- `POST {base}/api/ext/v3/conversations/messages/text` body `{ target, text }`
- `POST {base}/api/v1/sendSessionFile/{phone}?caption=` multipart field `file`
- `POST {base}/api/v1/sendInteractiveButtonsMessage?whatsappNumber={phone}` body `{ body, footer, buttons: [{text}] }`
- `POST {base}/api/v1/updateContactAttributes/{phone}` body `{ customParams: [{name, value}] }`
- `POST {base}/api/v1/assignOperator?email={email}&whatsappNumber={phone}` (omit email → Bot)
- `PUT {base}/api/ext/v3/contacts/teams` body `{ target, teams }`
- `POST {base}/api/ext/v3/chatbots/start` body `{ chatbot_id, target }`
- `POST {base}/api/v1/updateChatStatus` body `{ whatsappNumber, ticketStatus, channelPhoneNumber }` — read `WATI_CHANNEL_PHONE` env (add to env.ts as `channelPhone`)
- `GET {base}/api/v1/getMedia?fileName=` → binary

- [ ] **Step 1: Failing test (mock fetch)**

```ts
import { describe, it, expect, vi } from 'vitest'
import { createWatiClient } from './wati-api'

function mockFetch(status = 200, body: unknown = { result: true }) {
  const calls: Array<{ url: string; init: RequestInit }> = []
  const f = vi.fn(async (url: string, init: RequestInit) => {
    calls.push({ url, init })
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
  }) as unknown as typeof fetch
  return { f, calls }
}

describe('wati client', () => {
  it('sendText posts to ext/v3 with bearer', async () => {
    const { f, calls } = mockFetch()
    const c = createWatiClient({ baseUrl: 'https://x.wati.io/123', token: 'T', fetchImpl: f })
    const r = await c.sendText('50766124546', 'Hola')
    expect(r.ok).toBe(true)
    expect(calls[0].url).toBe('https://x.wati.io/123/api/ext/v3/conversations/messages/text')
    expect((calls[0].init.headers as Record<string,string>).Authorization).toBe('Bearer T')
    expect(JSON.parse(String(calls[0].init.body))).toEqual({ target: '50766124546', text: 'Hola' })
  })
  it('assignOperator without email assigns to bot', async () => {
    const { f, calls } = mockFetch()
    const c = createWatiClient({ baseUrl: 'https://x', token: 'T', fetchImpl: f })
    await c.assignOperator('507', null)
    expect(calls[0].url).toBe('https://x/api/v1/assignOperator?whatsappNumber=507')
  })
  it('startChatbot body', async () => {
    const { f, calls } = mockFetch()
    const c = createWatiClient({ baseUrl: 'https://x', token: 'T', fetchImpl: f })
    await c.startChatbot('507', 'abc')
    expect(JSON.parse(String(calls[0].init.body))).toEqual({ chatbot_id: 'abc', target: '507' })
  })
  it('non-2xx returns ok:false with error', async () => {
    const { f } = mockFetch(401, { error: 'nope' })
    const c = createWatiClient({ baseUrl: 'https://x', token: 'T', fetchImpl: f })
    const r = await c.sendText('507', 'x')
    expect(r.ok).toBe(false)
    expect(r.error).toContain('401')
  })
})
```

- [ ] **Step 2: Run, fail.**

- [ ] **Step 3: Implement**

```ts
export interface WatiResult { ok: boolean; error?: string }
export interface WatiClient { /* as in Interfaces */ }

export function createWatiClient(opts: { baseUrl: string; token: string; channelPhone?: string; fetchImpl?: typeof fetch }): WatiClient {
  const base = opts.baseUrl.replace(/\/$/, '')
  const f = opts.fetchImpl ?? fetch
  const auth = { Authorization: `Bearer ${opts.token}` }

  async function call(path: string, init: RequestInit & { json?: unknown } = {}): Promise<{ ok: boolean; data?: any; error?: string }> {
    const headers: Record<string, string> = { ...auth, ...(init.headers as Record<string, string> | undefined) }
    let body = init.body
    if (init.json !== undefined) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(init.json) }
    try {
      const res = await f(`${base}${path}`, { ...init, headers, body })
      const text = await res.text()
      let data: any = null
      try { data = text ? JSON.parse(text) : null } catch { data = text }
      if (!res.ok) return { ok: false, error: `HTTP ${res.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}` }
      if (data && typeof data === 'object' && data.result === false) return { ok: false, error: data.info || data.message || 'result=false', data }
      return { ok: true, data }
    } catch (e) { return { ok: false, error: String(e) } }
  }

  return {
    async sendText(phone, text) {
      const r = await call('/api/ext/v3/conversations/messages/text', { method: 'POST', json: { target: phone, text } })
      return { ok: r.ok, messageId: r.data?.id ?? r.data?.message?.id, error: r.error }
    },
    async sendFile(phone, file, caption) {
      const fd = new FormData()
      fd.append('file', new Blob([file.bytes], { type: file.mime }), file.filename)
      const q = caption ? `?caption=${encodeURIComponent(caption)}` : ''
      return call(`/api/v1/sendSessionFile/${phone}${q}`, { method: 'POST', body: fd })
    },
    async sendButtons(phone, body, buttons, footer) {
      return call(`/api/v1/sendInteractiveButtonsMessage?whatsappNumber=${phone}`, {
        method: 'POST', json: { body, footer: footer ?? '', buttons: buttons.slice(0, 3).map(text => ({ text: text.slice(0, 20) })) },
      })
    },
    async updateAttributes(phone, attrs) {
      return call(`/api/v1/updateContactAttributes/${phone}`, { method: 'POST', json: { customParams: Object.entries(attrs).map(([name, value]) => ({ name, value })) } })
    },
    async assignOperator(phone, email) {
      const q = email ? `email=${encodeURIComponent(email)}&whatsappNumber=${phone}` : `whatsappNumber=${phone}`
      return call(`/api/v1/assignOperator?${q}`, { method: 'POST' })
    },
    async assignTeams(phone, teams) {
      return call('/api/ext/v3/contacts/teams', { method: 'PUT', json: { target: phone, teams } })
    },
    async startChatbot(phone, chatbotId) {
      return call('/api/ext/v3/chatbots/start', { method: 'POST', json: { chatbot_id: chatbotId, target: phone } })
    },
    async updateChatStatus(phone, status) {
      return call('/api/v1/updateChatStatus', { method: 'POST', json: { whatsappNumber: phone, ticketStatus: status, channelPhoneNumber: opts.channelPhone ?? '' } })
    },
    async getMedia(fileName) {
      try {
        const res = await f(`${base}/api/v1/getMedia?fileName=${encodeURIComponent(fileName)}`, { headers: auth })
        if (!res.ok) return { ok: false, error: `HTTP ${res.status}` }
        return { ok: true, bytes: new Uint8Array(await res.arrayBuffer()), mime: res.headers.get('content-type') ?? undefined }
      } catch (e) { return { ok: false, error: String(e) } }
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
```

Add `channelPhone: process.env.WATI_CHANNEL_PHONE || ''` to `env()` in Task 3's file.

- [ ] **Step 4: Pass, commit** `feat(wati-agent): WATI REST client`.

---

### Task 7: Supabase store

**Files:** `src/lib/wati-agent/store.ts`, test `store.test.ts`

**Interfaces:**
```ts
export interface AgentStore {
  getConversation(phone: string): Promise<Conversation | null>
  upsertConversation(c: Partial<Conversation> & { phone: string }): Promise<Conversation>
  insertMessage(m: StoredMessage): Promise<{ inserted: boolean }>   // false on duplicate wati_message_id
  recentMessages(phone: string, opts: { sinceHours: number; limit: number }): Promise<StoredMessage[]>
  newestInboundId(phone: string): Promise<number | null>
  logEvent(phone: string | null, kind: EventKind, payload: unknown): Promise<void>
  activeMedia(today: string): Promise<MediaAsset[]>
  getSetting<T>(key: string, fallback: T): Promise<T>
  setSetting(key: string, value: unknown): Promise<void>
  listConversations(opts: { mode?: ConversationMode; limit: number }): Promise<Conversation[]>
  eventsFor(phone: string, limit: number): Promise<Array<{ id: number; kind: EventKind; payload: unknown; created_at: string }>>
  stats(sinceIso: string): Promise<{ handled: number; booked: number; handoffs: Record<string, number>; shadow: number }>
}
export function createStore(client: SupabaseClient): AgentStore
export function storeFromEnv(): AgentStore
```

- [ ] **Step 1: Failing test** — uses a minimal fake Supabase client that records calls; test only `insertMessage` duplicate handling and `getSetting` fallback:

```ts
import { describe, it, expect } from 'vitest'
import { createStore } from './store'

function fakeSupabase(responses: Record<string, any>) {
  const chain = (table: string) => {
    const q: any = {}
    const self = () => q
    for (const m of ['select','insert','upsert','update','eq','gte','order','limit','in','lte','or','is']) q[m] = self
    q.single = async () => responses[table] ?? { data: null, error: null }
    q.maybeSingle = q.single
    q.then = (res: any) => Promise.resolve(responses[table] ?? { data: [], error: null }).then(res)
    return q
  }
  return { from: (t: string) => chain(t) } as any
}

describe('store', () => {
  it('insertMessage reports duplicate on unique violation', async () => {
    const s = createStore(fakeSupabase({ wati_agent_messages: { data: null, error: { code: '23505', message: 'dup' } } }))
    expect(await s.insertMessage({ phone: '1', wati_message_id: 'a', direction: 'in', author: 'customer', type: 'text', text: 'x', media_ref: null, shadow: false })).toEqual({ inserted: false })
  })
  it('getSetting falls back', async () => {
    const s = createStore(fakeSupabase({ wati_agent_settings: { data: null, error: null } }))
    expect(await s.getSetting('enabled', true)).toBe(true)
  })
})
```

- [ ] **Step 2: Run, fail.**

- [ ] **Step 3: Implement** (service-role client; every method throws on unexpected errors so the runner's catch → handoff path fires):

```ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Conversation, ConversationMode, EventKind, MediaAsset, StoredMessage } from './types'

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
      fail('eventsFor', error); return (data ?? []) as any
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
  }
}

export function storeFromEnv(): AgentStore {
  return createStore(createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!))
}
```

- [ ] **Step 4: Pass, commit** `feat(wati-agent): supabase store`.

---

### Task 8: Chat export parser and PII scrub

**Files:** `src/lib/wati-agent/voice/parse-export.ts`, `voice/scrub.ts`, tests for both.

**Interfaces:**
```ts
export interface ExportLine { ts: string; sender: string; text: string; kind: 'customer' | 'staff' | 'bot' | 'template' | 'media' }
export function parseExport(raw: string, customerName: string): ExportLine[]
export interface Exchange { sucursal: 'cde' | 'sfc' | null; customer: string[]; staff: string[]; ts: string }
export function buildExchanges(lines: ExportLine[]): Exchange[]
export function scrub(text: string): string   // names→{nombre} handled by caller; emails/phones/codes removed here
```

Export format: `[MM/DD/YYYY HH:MM:SS] Sender: text`, multi-line bodies continue until the next `[` timestamp. Staff senders: `Citas Costa del Este` (cde), `Citas San Francisco` (sfc), `Mimosa Spa` (null). `Bot:` lines and `Template "…" was sent.` lines are dropped from exchanges. Media-only lines match `^[0-9a-f-]{36}\.(jpg|jpeg|png|pdf)$` or `^\[(sticker|audio recorder)\]$`.

- [ ] **Step 1: Failing tests**

```ts
import { describe, it, expect } from 'vitest'
import { parseExport, buildExchanges } from './parse-export'
import { scrub } from './scrub'

const raw = `[06/01/2026 16:36:08] Nabiha: Hola quería reservar
[06/01/2026 16:36:10] Bot: ¡Hola! Bienvenid@
Seleccione sucursal
[06/01/2026 16:36:56] Citas Costa del Este: ✨ Muy buenos días
Mi nombre es Adriana🌼
[06/01/2026 16:37:00] Citas Costa del Este: que masaje desean?
[06/01/2026 16:38:00] Nabiha: relajante
[06/02/2026 22:44:58] Template "Hola Nabiha" was sent.
[06/03/2026 12:57:29] Bot: b5be14fd-f04a-4863-bf30-82c58179744e.png
`

describe('parseExport', () => {
  it('parses multi-line bodies and kinds', () => {
    const lines = parseExport(raw, 'Nabiha')
    expect(lines.map(l => l.kind)).toEqual(['customer', 'bot', 'staff', 'staff', 'customer', 'template', 'media'])
    expect(lines[2].text).toBe('✨ Muy buenos días\nMi nombre es Adriana🌼')
  })
  it('builds exchanges with preceding customer context', () => {
    const ex = buildExchanges(parseExport(raw, 'Nabiha'))
    expect(ex).toHaveLength(1)
    expect(ex[0].sucursal).toBe('cde')
    expect(ex[0].customer).toEqual(['Hola quería reservar'])
    expect(ex[0].staff).toHaveLength(2)
  })
})

describe('scrub', () => {
  it('removes emails, phones, otp codes', () => {
    expect(scrub('escríbame a ana.b@gmail.com o al 6612-4546, código 292411')).toBe('escríbame a {correo} o al {telefono}, código {codigo}')
  })
})
```

- [ ] **Step 2: Run, fail.**

- [ ] **Step 3: Implement**

`parse-export.ts`:
```ts
export interface ExportLine { ts: string; sender: string; text: string; kind: 'customer' | 'staff' | 'bot' | 'template' | 'media' }
export interface Exchange { sucursal: 'cde' | 'sfc' | null; customer: string[]; staff: string[]; ts: string }

const HEAD = /^\[(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2})\] (.+?): ?([\s\S]*)$/
const TEMPLATE = /^\[(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2})\] Template "/
const MEDIA = /^([0-9a-f-]{36}\.(jpg|jpeg|png|pdf|mp4)|\[(sticker|audio recorder)\])$/i
const STAFF: Record<string, 'cde' | 'sfc' | null> = { 'Citas Costa del Este': 'cde', 'Citas San Francisco': 'sfc', 'Mimosa Spa': null }

export function parseExport(raw: string, customerName: string): ExportLine[] {
  const out: ExportLine[] = []
  let cur: ExportLine | null = null
  for (const line of raw.split('\n')) {
    if (line.startsWith('[') && /^\[\d{2}\/\d{2}\/\d{4} /.test(line)) {
      if (cur) out.push(cur)
      if (TEMPLATE.test(line)) { cur = { ts: line.slice(1, 20), sender: 'Template', text: line, kind: 'template' }; continue }
      const m = line.match(HEAD)
      if (!m) { cur = null; continue }
      const [, ts, sender, text] = m
      const kind: ExportLine['kind'] = sender === 'Bot' ? 'bot' : sender in STAFF ? 'staff' : 'customer'
      cur = { ts, sender, text, kind }
    } else if (cur) {
      cur.text += '\n' + line
    }
  }
  if (cur) out.push(cur)
  for (const l of out) {
    l.text = l.text.trimEnd()
    if (MEDIA.test(l.text.trim())) l.kind = 'media'
  }
  return out
}

export function staffSucursal(sender: string): 'cde' | 'sfc' | null { return STAFF[sender] ?? null }

export function buildExchanges(lines: ExportLine[]): Exchange[] {
  const ex: Exchange[] = []
  let customer: string[] = []
  let i = 0
  while (i < lines.length) {
    const l = lines[i]
    if (l.kind === 'customer') { customer.push(l.text); if (customer.length > 4) customer.shift(); i++; continue }
    if (l.kind === 'staff') {
      const staff: string[] = []
      const sucursal = staffSucursal(l.sender)
      const ts = l.ts
      while (i < lines.length && lines[i].kind === 'staff') { staff.push(lines[i].text); i++ }
      if (customer.length) ex.push({ sucursal, customer: [...customer], staff, ts })
      customer = []
      continue
    }
    i++
  }
  return ex
}
```

`scrub.ts`:
```ts
export function scrub(text: string): string {
  return text
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '{correo}')
    .replace(/\+?\d{3}[\s-]?\d{4}[\s-]?\d{4}\b/g, '{telefono}')
    .replace(/\b\d{4}-\d{4}\b/g, '{telefono}')
    .replace(/\b\d{6}\b/g, '{codigo}')
}
```

- [ ] **Step 4: Pass, commit** `feat(wati-agent): chat export parser and PII scrub`.

---

### Task 9: Mining script → exemplars + style guide

**Files:** `scripts/wati-agent/mine-chats.ts`, outputs `src/lib/wati-agent/voice/exemplars.json`, `src/lib/wati-agent/voice/style-guide.md`, `scripts/wati-agent/evals/cases.json`. Add script `"wati:mine"` to package.json.

**Interfaces:**
- `exemplars.json`: `Array<{ intent: Intent; sucursal: 'cde'|'sfc'|null; customer: string[]; staff: string[] }>`
- `Intent = 'saludo'|'ubicacion'|'horario'|'precios'|'promo'|'reservar'|'cambiar'|'cancelar'|'certificado'|'pago'|'queja'|'cierre'|'otro'`
- `cases.json`: `Array<{ id: string; sucursal; turns: Array<{ customer: string[]; staff: string[] }> }>` (30 full conversations, scrubbed).

- [ ] **Step 1: Write the script**

```ts
// scripts/wati-agent/mine-chats.ts
// Usage: npm run wati:mine -- <dir-with-txt-files>
import fs from 'node:fs'
import path from 'node:path'
import Anthropic from '@anthropic-ai/sdk'
import { parseExport, buildExchanges, type Exchange } from '../../src/lib/wati-agent/voice/parse-export'
import { scrub } from '../../src/lib/wati-agent/voice/scrub'

const INTENTS = ['saludo','ubicacion','horario','precios','promo','reservar','cambiar','cancelar','certificado','pago','queja','cierre','otro'] as const
type Intent = typeof INTENTS[number]

const dir = process.argv[2]
if (!dir) { console.error('dir required'); process.exit(1) }
const client = new Anthropic()
const MODEL = process.env.WATI_AGENT_MODEL || 'claude-sonnet-5'

function customerNameFrom(lines: ReturnType<typeof parseExport>): string {
  return lines.find(l => l.kind === 'customer')?.sender ?? ''
}

// 1. Parse everything
const files = fs.readdirSync(dir).filter(f => f.endsWith('.txt'))
const all: Array<{ file: string; exchanges: Exchange[]; lines: ReturnType<typeof parseExport>; name: string }> = []
for (const f of files) {
  const raw = fs.readFileSync(path.join(dir, f), 'utf8')
  const lines = parseExport(raw, '')
  const name = customerNameFrom(lines)
  const exchanges = buildExchanges(lines)
  if (exchanges.length) all.push({ file: f, exchanges, lines, name })
}
console.log(`chats with staff replies: ${all.length}`)

// 2. Scrub names + PII
function scrubName(t: string, name: string) {
  if (!name) return scrub(t)
  const first = name.split(/\s+/)[0]
  return scrub(t.replace(new RegExp(`\\b${first}\\b`, 'gi'), '{nombre}'))
}
const exchanges = all.flatMap(c => c.exchanges.map(e => ({
  ...e, customer: e.customer.map(t => scrubName(t, c.name)), staff: e.staff.map(t => scrubName(t, c.name)),
})))

// 3. Phrase stats (normalised canned lines)
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()
const counts = new Map<string, number>()
for (const e of exchanges) for (const s of e.staff) counts.set(norm(s), (counts.get(norm(s)) ?? 0) + 1)
const canned = [...counts.entries()].filter(([, n]) => n >= 15).sort((a, b) => b[1] - a[1]).slice(0, 80)

// 4. Sample 1200 exchanges (stratified by sucursal) and tag with Claude in batches of 40
function sample<T>(arr: T[], n: number) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a.slice(0, n) }
const pool = [...sample(exchanges.filter(e => e.sucursal === 'cde'), 600), ...sample(exchanges.filter(e => e.sucursal === 'sfc'), 600)]

type Tagged = Exchange & { intent: Intent; quality: 'good' | 'avoid' }
const tagged: Tagged[] = []
for (let i = 0; i < pool.length; i += 40) {
  const batch = pool.slice(i, i + 40)
  const res = await client.messages.create({
    model: MODEL, max_tokens: 8000,
    system: `Eres un analista. Clasificas intercambios de WhatsApp entre clientes y recepcionistas de un spa en Panamá. Responde SOLO JSON: [{"i":0,"intent":"...","quality":"good|avoid"}]. intent ∈ ${JSON.stringify(INTENTS)}. quality=avoid si la recepcionista comete un error, es cortante, o el intercambio no sirve de ejemplo.`,
    messages: [{ role: 'user', content: JSON.stringify(batch.map((e, i) => ({ i, customer: e.customer, staff: e.staff }))) }],
  })
  const text = res.content.find(b => b.type === 'text')?.text ?? '[]'
  const json = JSON.parse(text.slice(text.indexOf('['), text.lastIndexOf(']') + 1)) as Array<{ i: number; intent: Intent; quality: 'good' | 'avoid' }>
  for (const t of json) if (batch[t.i]) tagged.push({ ...batch[t.i], intent: INTENTS.includes(t.intent) ? t.intent : 'otro', quality: t.quality })
  console.log(`tagged ${tagged.length}`)
}

// 5. Pick ≤ 20 good per intent, balanced by sucursal
const exemplars: Array<Omit<Tagged, 'quality' | 'ts'>> = []
for (const intent of INTENTS) {
  const good = tagged.filter(t => t.intent === intent && t.quality === 'good')
  const cde = good.filter(g => g.sucursal === 'cde').slice(0, 10), sfc = good.filter(g => g.sucursal === 'sfc').slice(0, 10)
  for (const g of [...cde, ...sfc]) exemplars.push({ intent: g.intent, sucursal: g.sucursal, customer: g.customer, staff: g.staff })
}
fs.writeFileSync('src/lib/wati-agent/voice/exemplars.json', JSON.stringify(exemplars, null, 2))

// 6. Style guide from canned phrases + 150 good exchanges
const guide = await client.messages.create({
  model: MODEL, max_tokens: 6000,
  system: 'Escribes guías de estilo para asistentes de atención al cliente. Español de Panamá.',
  messages: [{ role: 'user', content: `Frases más usadas por las recepcionistas (frase → veces):\n${canned.map(([p, n]) => `${n}× ${p}`).join('\n')}\n\nEjemplos reales:\n${JSON.stringify(sample(tagged.filter(t => t.quality === 'good'), 150).map(t => ({ cliente: t.customer, recepcionista: t.staff })))}\n\nEscribe una guía de estilo en Markdown con secciones: Saludo (por hora del día, con nombre y 🌼), Tratamiento (usted, Sra/Sr + nombre), Ritmo (mensajes cortos, varios seguidos), Emojis usados, Tarjeta de datos (📌 Nombre y Apellido / 📌 Correo), Tarjeta de confirmación ✅ (formato exacto), Bloque de pago Yappy/Banco General, Cierre, Lo que nunca dicen, Errores a evitar. Cita frases textuales.` }],
})
fs.writeFileSync('src/lib/wati-agent/voice/style-guide.md', guide.content.find(b => b.type === 'text')?.text ?? '')

// 7. Eval cases: 30 chats with 4–12 exchanges, scrubbed
const cases = sample(all.filter(c => c.exchanges.length >= 4 && c.exchanges.length <= 12), 30).map((c, i) => ({
  id: `case-${i + 1}`, sucursal: c.exchanges[0].sucursal,
  turns: c.exchanges.map(e => ({ customer: e.customer.map(t => scrubName(t, c.name)), staff: e.staff.map(t => scrubName(t, c.name)) })),
}))
fs.mkdirSync('scripts/wati-agent/evals', { recursive: true })
fs.writeFileSync('scripts/wati-agent/evals/cases.json', JSON.stringify(cases, null, 2))
console.log(`exemplars ${exemplars.length}, cases ${cases.length}`)
```

Add to package.json scripts: `"wati:mine": "node --env-file=.env.local --experimental-strip-types --import ./scripts/spikes/ts-resolve-register.mjs scripts/wati-agent/mine-chats.ts"`.

- [ ] **Step 2: Unzip and run**

```bash
mkdir -p /private/tmp/claude-501/wati-chats && unzip -qo "Wati chats.zip" -d /private/tmp/claude-501/wati-chats
npm run wati:mine -- /private/tmp/claude-501/wati-chats
```
Expected: `exemplars ~200`, `cases 30`, `style-guide.md` non-empty. Requires `ANTHROPIC_API_KEY` in `.env.local`.

- [ ] **Step 3: Sanity check outputs** — `grep -c '"intent"' src/lib/wati-agent/voice/exemplars.json` ≥ 150; `grep -E '@|\b\d{8}\b' src/lib/wati-agent/voice/exemplars.json` returns nothing.

- [ ] **Step 4: Commit** `feat(wati-agent): mined exemplars, style guide, eval cases`. Do not commit the unzipped chats. Add `Wati chats.zip` to `.gitignore`.

---

### Task 10: Exemplar selection and prompt assembly

**Files:** `src/lib/wati-agent/voice/select.ts`, `src/lib/wati-agent/prompt.ts`, tests `select.test.ts`, `prompt.test.ts`.

**Interfaces:**
```ts
export type Intent = 'saludo'|'ubicacion'|'horario'|'precios'|'promo'|'reservar'|'cambiar'|'cancelar'|'certificado'|'pago'|'queja'|'cierre'|'otro'
export function detectIntent(text: string): Intent            // regex-based; the model handles nuance
export function selectExemplars(intent: Intent, sucursal: Sucursal | null, max = 12): Exemplar[]
export interface PromptContext {
  personaName: string; now: Date; sucursal: Sucursal | null; clientName: string | null
  mindbodyHistory: string | null; summary: string | null; media: MediaAsset[]; intent: Intent
  styleGuide: string; businessOverrides?: Partial<typeof BUSINESS>
}
export function buildSystem(ctx: PromptContext): Anthropic.TextBlockParam[]   // [stable(cache_control), volatile]
```

`detectIntent` regexes: ubicacion `/d[oó]nde|ubicaci|direcci|waze|mapa|llegar/`, horario `/horario|abren|cierran|hasta qu[eé] hora|abierto/`, precios `/precio|cu[aá]nto|costo|vale|tarifa/`, promo `/promo|oferta|descuento|paquete/`, cambiar `/cambiar|mover|reagendar|otra hora/`, cancelar `/cancelar/`, reservar `/reserv|agendar|cita|disponib|masaje|facial/`, pago `/yappy|pagar|pago|transferencia|tarjeta/`, cierre `/gracias|listo|perfecto|ok/` (only when message ≤ 4 words), saludo when text ≤ 3 words matching `/hola|buen[oa]s/`, else `otro`. Order: ubicacion, horario, cambiar, cancelar, promo, precios, pago, reservar, saludo, cierre, otro.

- [ ] **Step 1: Failing tests**

```ts
// select.test.ts
import { describe, it, expect } from 'vitest'
import { detectIntent, selectExemplars } from './select'
describe('detectIntent', () => {
  it('ubicacion', () => expect(detectIntent('me mandas la ubicación por waze?')).toBe('ubicacion'))
  it('precios', () => expect(detectIntent('cuánto cuesta el masaje relajante')).toBe('precios'))
  it('cambiar beats reservar', () => expect(detectIntent('quiero cambiar mi cita de mañana')).toBe('cambiar'))
  it('saludo', () => expect(detectIntent('Hola buenas')).toBe('saludo'))
})
describe('selectExemplars', () => {
  it('prefers same sucursal and caps', () => {
    const ex = selectExemplars('reservar', 'sfc', 6)
    expect(ex.length).toBeLessThanOrEqual(6)
    expect(ex.every(e => e.intent === 'reservar')).toBe(true)
  })
})
```

```ts
// prompt.test.ts
import { describe, it, expect } from 'vitest'
import { buildSystem } from './prompt'
describe('buildSystem', () => {
  const blocks = buildSystem({ personaName: 'Camila', now: new Date('2026-09-04T15:00:00-05:00'), sucursal: 'cde', clientName: 'Ana', mindbodyHistory: null, summary: null, media: [{ key: 'promo_mes', description: 'Promo septiembre', caption: '', storage_path: 'x', valid_from: null, valid_until: null, active: true }], intent: 'promo', styleGuide: 'GUIA' })
  it('first block is cached and stable', () => {
    expect(blocks[0].cache_control).toEqual({ type: 'ephemeral' })
    expect(blocks[0].text).toContain('GUIA')
    expect(blocks[0].text).not.toContain('2026')
  })
  it('second block carries date, client, media keys', () => {
    expect(blocks[1].text).toContain('Ana')
    expect(blocks[1].text).toContain('promo_mes')
    expect(blocks[1].text).toContain('Muy buenas tardes')
  })
  it('states the confirmation and handoff rules', () => {
    expect(blocks[0].text).toMatch(/customer_confirmation/)
    expect(blocks[0].text).toMatch(/handoff/)
  })
})
```

- [ ] **Step 2: Run, fail.**

- [ ] **Step 3: Implement `select.ts`**

```ts
import exemplarsJson from './exemplars.json'
import type { Sucursal } from '../types'
export type Intent = 'saludo'|'ubicacion'|'horario'|'precios'|'promo'|'reservar'|'cambiar'|'cancelar'|'certificado'|'pago'|'queja'|'cierre'|'otro'
export interface Exemplar { intent: Intent; sucursal: Sucursal | null; customer: string[]; staff: string[] }
const EXEMPLARS = exemplarsJson as Exemplar[]

const RULES: Array<[Intent, RegExp]> = [
  ['ubicacion', /d[oó]nde|ubicaci|direcci|waze|mapa|llegar|quedan/i],
  ['horario', /horario|abren|cierran|hasta qu[eé] hora|abierto|abiertos/i],
  ['cambiar', /cambiar|mover|reagendar|otra hora|pasar(la|lo)? para/i],
  ['cancelar', /cancelar/i],
  ['promo', /promo|oferta|descuento|paquete/i],
  ['precios', /precio|cu[aá]nto|costo|vale|tarifa/i],
  ['pago', /yappy|pagar|pago|transferencia|tarjeta/i],
  ['reservar', /reserv|agendar|cita|disponib|masaje|facial|cabina|pareja/i],
]
export function detectIntent(text: string): Intent {
  const t = text.trim()
  const words = t.split(/\s+/).length
  for (const [intent, re] of RULES) if (re.test(t)) return intent
  if (words <= 3 && /hola|buen[oa]s|saludos/i.test(t)) return 'saludo'
  if (words <= 4 && /gracias|listo|perfecto|ok|vale/i.test(t)) return 'cierre'
  return 'otro'
}
export function selectExemplars(intent: Intent, sucursal: Sucursal | null, max = 12): Exemplar[] {
  const same = EXEMPLARS.filter(e => e.intent === intent && e.sucursal === sucursal)
  const other = EXEMPLARS.filter(e => e.intent === intent && e.sucursal !== sucursal)
  return [...same, ...other].slice(0, max)
}
```

Add `"resolveJsonModule": true` to tsconfig if missing.

- [ ] **Step 4: Implement `prompt.ts`**

```ts
import type Anthropic from '@anthropic-ai/sdk'
import { BUSINESS } from './config/business'
import { greetingFor, formatPanama, isOpen } from './hours'
import { selectExemplars, type Intent } from './voice/select'
import type { MediaAsset, Sucursal } from './types'

export interface PromptContext { /* as in Interfaces */ }

function stable(personaName: string, styleGuide: string): string {
  return `Eres ${personaName}, recepcionista de ${BUSINESS.brand} (spa en Ciudad de Panamá, sucursales Costa del Este y San Francisco). Atiendes por WhatsApp exactamente como lo hacen las recepcionistas reales. Nunca dices que eres un asistente virtual salvo que te lo pregunten directamente; en ese caso lo admites con calidez en una línea y llamas a la herramienta handoff con motivo "es_bot".

## Cómo escribes
${styleGuide}

## Reglas duras
- Español, usted. Mensajes cortos. Máximo 3 burbujas por turno; separa burbujas con una línea que contenga solo ---.
- Primer mensaje de una conversación: saludo según la hora + "bienvenido a Mimosa Spa Retreat" + "Mi nombre es ${personaName} 🌼" + "¿Cómo podemos ayudarle?".
- Precios, duraciones y promociones SOLO de los resultados de list_services o de las imágenes de la biblioteca (send_image). Si no lo sabes, pregúntalo con get_* o pásalo a una compañera.
- Pregunta una cosa a la vez. Si no sabes la sucursal y hace falta (reserva, ubicación, disponibilidad), pregunta "¿Para Costa del Este o San Francisco?".
- Antes de reservar: nombre y apellido + correo con la tarjeta 📌. Luego envías un resumen (fecha, hora, tratamiento, sucursal) y esperas un sí claro. Solo entonces llamas a book con customer_confirmation = el texto exacto del cliente.
- Cambios y cancelaciones: mismo resumen + sí claro; si faltan menos de ${BUSINESS.policies.changeNoticeHours} h, la herramienta lo rechazará: explica la política y llama a handoff con motivo "politica_24h".
- Pasa a una compañera (handoff) cuando: certificados de regalo (venta o uso), comprobantes de pago, quejas, grupos de 3 o más, terapeuta específica, temas médicos, cualquier error de herramienta, o cuando no estés segura. Antes de handoff envía una burbuja tipo "Un momento por favor, le comunico con mi compañera 🌼".
- Fuera de horario puedes informar y reservar; si pasas a una compañera, avisa que responderá en horario de atención (${BUSINESS.hours.text}).
- Nunca inventes disponibilidad: usa check_availability. Ofrece máximo 3–4 horas.
- Ubicación: usa get_location_info y envía el enlace de Waze en su propia burbuja.
- Al terminar ("gracias", "listo"): despídete como las recepcionistas y llama a close_chat.

## Política de cambios
${BUSINESS.policies.changeText} ${BUSINESS.policies.arrivalText}`
}

export function buildSystem(ctx: PromptContext): Anthropic.TextBlockParam[] {
  const ex = selectExemplars(ctx.intent, ctx.sucursal)
  const volatile = [
    `## Ahora\nFecha y hora en Panamá: ${formatPanama(ctx.now)}. Saludo correcto ahora: "${greetingFor(ctx.now)}". El spa está ${isOpen(ctx.now) ? 'abierto' : 'cerrado'} en este momento.`,
    `## Cliente\nTeléfono conocido. Nombre: ${ctx.clientName ?? 'desconocido'}. Sucursal de esta conversación: ${ctx.sucursal ?? 'no definida'}.${ctx.mindbodyHistory ? `\nHistorial Mindbody: ${ctx.mindbodyHistory}` : ''}${ctx.summary ? `\nResumen de la conversación: ${ctx.summary}` : ''}`,
    `## Imágenes disponibles (send_image)\n${ctx.media.length ? ctx.media.map(m => `- ${m.key}: ${m.description}`).join('\n') : '(ninguna)'}`,
    `## Ejemplos reales de las recepcionistas para este tipo de mensaje\n${ex.map(e => `Cliente: ${e.customer.join(' / ')}\nRecepcionista: ${e.staff.join('\n---\n')}`).join('\n\n')}`,
  ].join('\n\n')
  return [
    { type: 'text', text: stable(ctx.personaName, ctx.styleGuide), cache_control: { type: 'ephemeral' } },
    { type: 'text', text: volatile },
  ]
}
```

- [ ] **Step 5: Pass, commit** `feat(wati-agent): intent detection, exemplar selection, system prompt`.

---

### Task 11: Tool definitions and validation

**Files:** `src/lib/wati-agent/tools/definitions.ts`, `tools/validate.ts`, test `validate.test.ts`.

**Interfaces:**
```ts
export const TOOLS: Anthropic.Tool[]   // names below
export function requireConfirmation(input: { customer_confirmation?: string }): string | null  // error text or null
export function checkNoticePolicy(startIso: string, now: Date, hours = 24): string | null
export function pairSlotsForCouple(slots: Array<{ time: string; staffIds: number[] }>): string[] // times with ≥2 distinct staff
```

Tool names and schemas (all `strict: true`, `additionalProperties: false`):
- `get_location_info { sucursal: 'cde'|'sfc' }`
- `get_hours { }`
- `list_services { sucursal, query?: string }`
- `send_image { key: string }`
- `send_buttons { body: string, buttons: string[] }`
- `find_client { }`
- `create_client { first_name, last_name, email }`
- `check_availability { sucursal, date: 'YYYY-MM-DD', service_ids: number[], people: 1|2 }`
- `book { sucursal, date, time: 'HH:mm', service_ids: number[], people: 1|2, customer_confirmation: string }`
- `list_my_appointments { }`
- `reschedule { appointment_id: number, date, time, customer_confirmation }`
- `cancel { appointment_id: number, customer_confirmation }`
- `handoff { motivo: string, resumen: string }`
- `close_chat { }`
- `note_to_self { text: string }`

- [ ] **Step 1: Failing tests**

```ts
import { describe, it, expect } from 'vitest'
import { requireConfirmation, checkNoticePolicy, pairSlotsForCouple } from './validate'
import { TOOLS } from './definitions'

describe('validate', () => {
  it('rejects empty confirmation', () => expect(requireConfirmation({ customer_confirmation: '' })).toMatch(/confirmaci/))
  it('rejects non-affirmative', () => expect(requireConfirmation({ customer_confirmation: 'no sé' })).toMatch(/confirmaci/))
  it('accepts sí', () => expect(requireConfirmation({ customer_confirmation: 'Si perfecto' })).toBeNull())
  it('24h policy blocks', () => expect(checkNoticePolicy('2026-09-05T10:00:00-05:00', new Date('2026-09-05T08:00:00-05:00'))).toMatch(/24/))
  it('24h policy allows', () => expect(checkNoticePolicy('2026-09-07T10:00:00-05:00', new Date('2026-09-05T08:00:00-05:00'))).toBeNull())
  it('couple pairing needs 2 staff', () => {
    expect(pairSlotsForCouple([{ time: '10:00', staffIds: [1] }, { time: '11:00', staffIds: [1, 2] }])).toEqual(['11:00'])
  })
  it('all tools strict', () => expect(TOOLS.every(t => (t as any).strict === true)).toBe(true))
})
```

- [ ] **Step 2: Run, fail.**

- [ ] **Step 3: Implement `validate.ts`**

```ts
const YES = /\b(s[ií]|claro|dale|perfecto|listo|ok|okey|confirm|de acuerdo|correcto|exacto|va)\b/i
export function requireConfirmation(input: { customer_confirmation?: string }): string | null {
  const c = (input.customer_confirmation || '').trim()
  if (!c || !YES.test(c) || /\bno\b/i.test(c)) return 'Falta la confirmación explícita del cliente. Envía el resumen y espera un "sí" antes de llamar esta herramienta.'
  return null
}
export function checkNoticePolicy(startIso: string, now: Date, hours = 24): string | null {
  const diff = (new Date(startIso).getTime() - now.getTime()) / 3600_000
  return diff < hours ? `La cita empieza en menos de ${hours} horas; por política no se puede cambiar ni cancelar por este medio.` : null
}
export function pairSlotsForCouple(slots: Array<{ time: string; staffIds: number[] }>): string[] {
  return slots.filter(s => new Set(s.staffIds).size >= 2).map(s => s.time)
}
```

- [ ] **Step 4: Implement `definitions.ts`**

```ts
import type Anthropic from '@anthropic-ai/sdk'
const suc = { type: 'string', enum: ['cde', 'sfc'], description: 'cde = Costa del Este, sfc = San Francisco' }
const tool = (name: string, description: string, properties: Record<string, unknown>, required: string[] = []): Anthropic.Tool =>
  ({ name, description, strict: true, input_schema: { type: 'object', properties, required, additionalProperties: false } } as Anthropic.Tool)

export const TOOLS: Anthropic.Tool[] = [
  tool('get_location_info', 'Dirección, plaza, enlaces de Waze y Google Maps y estacionamiento de una sucursal.', { sucursal: suc }, ['sucursal']),
  tool('get_hours', 'Horario de atención del spa.', {}),
  tool('list_services', 'Lista tratamientos con duración y precio (fuente única de precios). query filtra por nombre.', { sucursal: suc, query: { type: 'string' } }, ['sucursal', 'query']),
  tool('send_image', 'Envía una imagen de la biblioteca al cliente (promo, precios, mapa). Usa la clave listada en el prompt.', { key: { type: 'string' } }, ['key']),
  tool('send_buttons', 'Envía un mensaje con hasta 3 botones (máx 20 caracteres cada uno).', { body: { type: 'string' }, buttons: { type: 'array', items: { type: 'string' } } }, ['body', 'buttons']),
  tool('find_client', 'Busca al cliente en Mindbody por su teléfono; devuelve nombre, correo y últimas visitas.', {}),
  tool('create_client', 'Crea el cliente en Mindbody. Solo después de pedir nombre, apellido y correo.', { first_name: { type: 'string' }, last_name: { type: 'string' }, email: { type: 'string' } }, ['first_name', 'last_name', 'email']),
  tool('check_availability', 'Horas disponibles para los tratamientos en una fecha. people=2 devuelve solo horas con dos terapeutas libres a la vez.', { sucursal: suc, date: { type: 'string', description: 'YYYY-MM-DD' }, service_ids: { type: 'array', items: { type: 'integer' } }, people: { type: 'integer', enum: [1, 2] } }, ['sucursal', 'date', 'service_ids', 'people']),
  tool('book', 'Crea la cita en Mindbody. Requiere customer_confirmation con el texto exacto con el que el cliente dijo que sí al resumen.', { sucursal: suc, date: { type: 'string' }, time: { type: 'string', description: 'HH:mm 24h' }, service_ids: { type: 'array', items: { type: 'integer' } }, people: { type: 'integer', enum: [1, 2] }, customer_confirmation: { type: 'string' } }, ['sucursal', 'date', 'time', 'service_ids', 'people', 'customer_confirmation']),
  tool('list_my_appointments', 'Próximas citas del cliente.', {}),
  tool('reschedule', 'Mueve una cita. Requiere confirmación del cliente.', { appointment_id: { type: 'integer' }, date: { type: 'string' }, time: { type: 'string' }, customer_confirmation: { type: 'string' } }, ['appointment_id', 'date', 'time', 'customer_confirmation']),
  tool('cancel', 'Cancela una cita. Requiere confirmación del cliente.', { appointment_id: { type: 'integer' }, customer_confirmation: { type: 'string' } }, ['appointment_id', 'customer_confirmation']),
  tool('handoff', 'Pasa la conversación a una recepcionista humana. resumen: 2 líneas con lo que quiere el cliente y lo ya recopilado.', { motivo: { type: 'string' }, resumen: { type: 'string' } }, ['motivo', 'resumen']),
  tool('close_chat', 'Marca la conversación como resuelta después de despedirte.', {}),
  tool('note_to_self', 'Guarda un dato útil para el resto de la conversación (preferencias, sucursal, etc.).', { text: { type: 'string' } }, ['text']),
]
```

- [ ] **Step 5: Pass, commit** `feat(wati-agent): tool schemas and validation`.

---

### Task 12: Mindbody adapter

**Files:** `src/lib/wati-agent/tools/mindbody-adapter.ts`, test `mindbody-adapter.test.ts` (mocks `@/lib/booking/mindbody` with `vi.mock`).

**Interfaces:**
```ts
export interface ServiceSummary { id: number; name: string; minutes: number; price: number; category: string }
export function listServices(sucursal: Sucursal, query?: string): Promise<ServiceSummary[]>            // cached 6 h in module memory
export function findClientByPhone(phone: string): Promise<{ id: string; name: string; email: string; lastVisits: string[] } | null>
export function createClient(i: { first: string; last: string; email: string; phone: string }): Promise<{ id: string }>
export function availability(i: { sucursal: Sucursal; date: string; serviceIds: number[]; people: 1 | 2; origin: string }): Promise<Array<{ time: string; staffIds: number[] }>>
export function book(i: { clientId: string; sucursal: Sucursal; date: string; time: string; serviceIds: number[]; people: 1|2; origin: string; clientName: string; phone: string }): Promise<{ appointmentIds: number[]; therapist: string }>
export function upcoming(clientId: string): Promise<Array<{ id: number; start: string; service: string; location: string }>>
export function cancelAppointment(id: number): Promise<boolean>
```

`availability` calls the existing `GET {origin}/api/mindbody/availability?locationId&serviceIds&startDate&endDate&duration` with header `x-internal-staff-resolution: 1` exactly as `book/route.ts` does, then maps `availableDates[0].slots[] → {time, staffIds: availableStaffIds}` and applies `pairSlotsForCouple` when `people === 2`. `book` uses `addMultipleAppointments` (one chain per person; for couples second person books with a different `StaffId` from the slot's `staffIds`), then `sendBookingConfirmation` from `@/lib/booking/wati`. Duration = sum of `minutes` of the chosen services. Start ISO = `${date}T${time}:00` (Mindbody expects site-local time, same as the web booking route).

- [ ] **Step 1: Failing tests** (mock mindbody module; test `listServices` filtering + cache, `availability` couple pairing, `findClientByPhone` matching by last 8 digits):

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
vi.mock('@/lib/booking/mindbody', () => ({
  getAllServices: vi.fn(async () => [{ Id: 10, Name: 'Mimosa Relax - 60 min', Duration: 60, Price: 75, Category: 'Masajes', IsAddOn: false }, { Id: 11, Name: 'Facial Glow', Duration: 45, Price: 60, Category: 'Faciales', IsAddOn: false }]),
  searchClients: vi.fn(async () => [{ Id: 'C1', FirstName: 'Ana', LastName: 'Ruiz', Email: 'a@x.com', MobilePhone: '6612-4546' }]),
  addClient: vi.fn(), addMultipleAppointments: vi.fn(), getClientSchedule: vi.fn(async () => ({ Visits: [] })), getClientVisits: vi.fn(async () => ({ Visits: [] })), removeAppointment: vi.fn(async () => true),
}))
vi.mock('@/lib/booking/wati', () => ({ sendBookingConfirmation: vi.fn(async () => ({ result: true })) }))
import * as mb from '@/lib/booking/mindbody'
import { listServices, availability, findClientByPhone } from './mindbody-adapter'

beforeEach(() => vi.clearAllMocks())

describe('adapter', () => {
  it('filters services by query and caches', async () => {
    const a = await listServices('cde', 'relax'); const b = await listServices('cde', 'facial')
    expect(a.map(s => s.id)).toEqual([10]); expect(b.map(s => s.id)).toEqual([11])
    expect(mb.getAllServices).toHaveBeenCalledTimes(1)
  })
  it('availability pairs for couples', async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ availableDates: [{ date: '2026-09-06', slots: [{ time: '10:00', availableStaffIds: [1] }, { time: '11:00', availableStaffIds: [1, 2] }] }] })))
    const slots = await availability({ sucursal: 'cde', date: '2026-09-06', serviceIds: [10], people: 2, origin: 'https://x', fetchImpl })
    expect(slots.map(s => s.time)).toEqual(['11:00'])
  })
  it('finds client by phone suffix', async () => {
    const c = await findClientByPhone('50766124546')
    expect(c?.name).toBe('Ana Ruiz')
  })
})
```

(`availability` accepts an optional `fetchImpl` for tests.)

- [ ] **Step 2: Run, fail.**

- [ ] **Step 3: Implement**

```ts
import { getAllServices, searchClients, addClient, addMultipleAppointments, getClientSchedule, getClientVisits, removeAppointment } from '@/lib/booking/mindbody'
import { sendBookingConfirmation } from '@/lib/booking/wati'
import { BUSINESS } from '../config/business'
import { pairSlotsForCouple } from './validate'
import type { Sucursal } from '../types'

export interface ServiceSummary { id: number; name: string; minutes: number; price: number; category: string }
const cache = new Map<Sucursal, { at: number; items: ServiceSummary[] }>()
const SIX_H = 6 * 3600_000

export async function listServices(sucursal: Sucursal, query?: string): Promise<ServiceSummary[]> {
  const hit = cache.get(sucursal)
  let items = hit && Date.now() - hit.at < SIX_H ? hit.items : null
  if (!items) {
    const raw = await getAllServices(BUSINESS.locations[sucursal].mindbodyLocationId)
    items = raw.filter(s => !s.IsAddOn).map(s => ({ id: s.Id, name: s.Name, minutes: s.Duration, price: Math.round(s.Price * 100) / 100, category: s.Category }))
    cache.set(sucursal, { at: Date.now(), items })
  }
  if (!query?.trim()) return items
  const q = query.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  return items.filter(s => s.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(q))
}

export async function findClientByPhone(phone: string) {
  const last8 = phone.slice(-8)
  const clients = await searchClients(last8)
  const c = clients.find(x => (x.MobilePhone || '').replace(/\D/g, '').endsWith(last8))
  if (!c) return null
  const visits = await getClientVisits({ clientId: String(c.Id), limit: 5 }).catch(() => ({ Visits: [] as any[] }))
  const lastVisits = (visits.Visits || []).slice(0, 3).map((v: any) => `${String(v.StartDateTime).slice(0, 10)} ${v.Name ?? v.ServiceName ?? ''}`.trim())
  return { id: String(c.Id), name: `${c.FirstName} ${c.LastName}`.trim(), email: c.Email, lastVisits }
}

export async function createClient(i: { first: string; last: string; email: string; phone: string }) {
  const r = await addClient({ FirstName: i.first, LastName: i.last, Email: i.email, MobilePhone: i.phone })
  return { id: String(r.Client.Id) }
}

export async function availability(i: { sucursal: Sucursal; date: string; serviceIds: number[]; people: 1 | 2; origin: string; fetchImpl?: typeof fetch }) {
  const services = await listServices(i.sucursal)
  const duration = i.serviceIds.reduce((s, id) => s + (services.find(x => x.id === id)?.minutes ?? 60), 0)
  const params = new URLSearchParams({ locationId: String(BUSINESS.locations[i.sucursal].mindbodyLocationId), serviceIds: i.serviceIds.join(','), startDate: i.date, endDate: i.date, duration: String(duration) })
  const res = await (i.fetchImpl ?? fetch)(`${i.origin}/api/mindbody/availability?${params}`, { headers: { 'x-internal-staff-resolution': '1' } })
  const json = await res.json()
  const day = (json.availableDates || []).find((d: any) => d.date === i.date)
  const slots: Array<{ time: string; staffIds: number[] }> = (day?.slots || []).map((s: any) => ({ time: s.time, staffIds: s.availableStaffIds || [] }))
  if (i.people === 2) { const ok = new Set(pairSlotsForCouple(slots)); return slots.filter(s => ok.has(s.time)) }
  return slots
}

export async function book(i: { clientId: string; sucursal: Sucursal; date: string; time: string; serviceIds: number[]; people: 1 | 2; origin: string; clientName: string; phone: string }) {
  const slots = await availability({ ...i })
  const slot = slots.find(s => s.time === i.time)
  if (!slot) throw new Error('Esa hora ya no está disponible')
  const services = await listServices(i.sucursal)
  const loc = BUSINESS.locations[i.sucursal]
  const chain = (staffId: number) => i.serviceIds.map(id => ({ ClientId: i.clientId, LocationId: loc.mindbodyLocationId, StaffId: staffId, SessionTypeId: id, StartDateTime: `${i.date}T${i.time}:00`, Notes: 'Reservado por WhatsApp (Camila)' }))
  const first = await addMultipleAppointments(chain(slot.staffIds[0]))
  let ids = first.map(a => a.id)
  if (i.people === 2) { const second = await addMultipleAppointments(chain(slot.staffIds[1])); ids = [...ids, ...second.map(a => a.id)] }
  const therapist = first[0]?.appointment?.Staff ? `${first[0].appointment.Staff.FirstName} ${first[0].appointment.Staff.LastName}` : 'Por asignar'
  const minutes = i.serviceIds.reduce((s, id) => s + (services.find(x => x.id === id)?.minutes ?? 0), 0)
  await sendBookingConfirmation({
    clientName: i.clientName, clientPhone: i.phone, locationName: `Mimosa ${loc.name}`,
    date: new Intl.DateTimeFormat('es-PA', { timeZone: 'America/Panama', dateStyle: 'long' }).format(new Date(`${i.date}T12:00:00-05:00`)),
    time: new Intl.DateTimeFormat('es-PA', { timeZone: 'America/Panama', timeStyle: 'short' }).format(new Date(`${i.date}T${i.time}:00-05:00`)),
    services: i.serviceIds.map(id => services.find(x => x.id === id)?.name ?? String(id)), totalDuration: minutes, therapistName: therapist,
  })
  return { appointmentIds: ids, therapist }
}

export async function upcoming(clientId: string) {
  const r = await getClientSchedule({ clientId, startDate: new Date().toISOString().slice(0, 10), limit: 10 })
  return (r.Visits || []).map((v: any) => ({ id: v.AppointmentId ?? v.Id, start: v.StartDateTime, service: v.Name ?? v.ServiceName ?? '', location: v.LocationId === 1 ? 'Costa del Este' : 'San Francisco' }))
}
export async function cancelAppointment(id: number) { return removeAppointment(id) }
```

Verify field names of `ClientScheduledVisit` in `src/lib/booking/mindbody.ts` (`grep -n "interface ClientScheduledVisit" -A15`) and adjust `upcoming` mapping to the real property names before committing.

- [ ] **Step 4: Pass, commit** `feat(wati-agent): mindbody adapter`.

---

### Task 13: Tool executor and handoff module

**Files:** `src/lib/wati-agent/tools/execute.ts`, `src/lib/wati-agent/handoff.ts`, tests `execute.test.ts`, `handoff.test.ts`.

**Interfaces:**
```ts
export interface ToolDeps {
  store: AgentStore; wati: WatiClient; conv: Conversation; origin: string; shadow: boolean; now: Date
  mediaBytes: (storagePath: string) => Promise<{ bytes: Uint8Array; mime: string; filename: string }>
  mb: typeof import('./mindbody-adapter')
}
export interface ToolOutcome { result: string; isError?: boolean; endTurn?: boolean; convPatch?: Partial<Conversation> }
export function executeTool(name: string, input: any, deps: ToolDeps): Promise<ToolOutcome>

// handoff.ts
export function performHandoff(i: { store: AgentStore; wati: WatiClient; conv: Conversation; motivo: string; resumen: string; shadow: boolean; env: ReturnType<typeof env> }): Promise<void>
export function registerTakeover(store: AgentStore, phone: string, operatorEmail: string): Promise<void>
export function resumeAgent(store: AgentStore, phone: string): Promise<void>
```

Behaviour:
- `send_image` / `send_buttons` send immediately (unless shadow → log `shadow_reply`) and return `"enviado"`.
- `book`/`reschedule`/`cancel` run `requireConfirmation`; `reschedule`/`cancel` also `checkNoticePolicy` against the appointment start from `upcoming()`; on policy error return `{ result, isError: true }` so the model hands off.
- Any thrown error → `{ result: 'ERROR: ' + message, isError: true }` and event `error`.
- `handoff` calls `performHandoff` and returns `{ result: 'handoff hecho', endTurn: true }`.
- `close_chat` → `wati.updateChatStatus(phone, 'SOLVED')` (skipped in shadow), `endTurn: true`.
- `find_client` / `create_client` return `convPatch` with `mindbody_client_id`, `client_name`; `note_to_self` appends to `summary`.

`performHandoff`:
1. `wati.sendText(phone, 'Un momento por favor, le comunico con mi compañera 🌼')` (skip in shadow).
2. `wati.updateAttributes(phone, { sucursal: conv.sucursal ?? '', ai_modo: 'humano', ai_resumen: resumen.slice(0, 300), ai_motivo: motivo })`.
3. `wati.startChatbot(phone, env.handoffChatbotId)`; if `!ok` → fallback `assignOperator(phone, sucursal === 'cde' ? env.citasCdeEmail : env.citasSfcEmail)` (if sucursal null → `wati.sendButtons(phone, '¿Para cuál sucursal?', ['Costa del Este', 'San Francisco'])` and assign to `citasSfcEmail`).
4. `store.upsertConversation({ phone, mode: 'human', human_since: now, handoff_reason: motivo, summary: resumen })`; `store.logEvent(phone, 'handoff', { motivo, resumen, viaFlow: ok })`.
In shadow mode steps 1–3 are skipped and the conversation stays in `agent` mode, only the event is logged with `shadow: true`.

- [ ] **Step 1: Failing tests**

`handoff.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest'
import { performHandoff } from './handoff'

const wati = () => ({ sendText: vi.fn(async () => ({ ok: true })), updateAttributes: vi.fn(async () => ({ ok: true })), startChatbot: vi.fn(async () => ({ ok: true })), assignOperator: vi.fn(async () => ({ ok: true })), sendButtons: vi.fn(async () => ({ ok: true })) }) as any
const store = () => ({ upsertConversation: vi.fn(async (c: any) => c), logEvent: vi.fn(async () => {}) }) as any
const conv = { phone: '507', sucursal: 'cde', mode: 'agent' } as any
const e = { handoffChatbotId: 'bot1', citasCdeEmail: 'cde@x', citasSfcEmail: 'sfc@x' } as any

describe('performHandoff', () => {
  it('starts the flow and flips mode', async () => {
    const w = wati(), s = store()
    await performHandoff({ store: s, wati: w, conv, motivo: 'queja', resumen: 'x', shadow: false, env: e })
    expect(w.startChatbot).toHaveBeenCalledWith('507', 'bot1')
    expect(w.updateAttributes.mock.calls[0][1]).toMatchObject({ ai_modo: 'humano', ai_motivo: 'queja', sucursal: 'cde' })
    expect(s.upsertConversation.mock.calls[0][0]).toMatchObject({ mode: 'human', handoff_reason: 'queja' })
  })
  it('falls back to assignOperator when flow fails', async () => {
    const w = wati(); w.startChatbot = vi.fn(async () => ({ ok: false, error: 'x' }))
    await performHandoff({ store: store(), wati: w, conv, motivo: 'queja', resumen: 'x', shadow: false, env: e })
    expect(w.assignOperator).toHaveBeenCalledWith('507', 'cde@x')
  })
  it('shadow sends nothing and keeps agent mode', async () => {
    const w = wati(), s = store()
    await performHandoff({ store: s, wati: w, conv, motivo: 'queja', resumen: 'x', shadow: true, env: e })
    expect(w.sendText).not.toHaveBeenCalled(); expect(w.startChatbot).not.toHaveBeenCalled()
    expect(s.upsertConversation).not.toHaveBeenCalled()
  })
})
```

`execute.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest'
import { executeTool } from './execute'

const deps = (over: Partial<any> = {}) => ({
  store: { logEvent: vi.fn(async () => {}), upsertConversation: vi.fn(async (c: any) => c) },
  wati: { sendText: vi.fn(async () => ({ ok: true })), sendFile: vi.fn(async () => ({ ok: true })), sendButtons: vi.fn(async () => ({ ok: true })), updateChatStatus: vi.fn(async () => ({ ok: true })) },
  conv: { phone: '507', sucursal: 'cde', mindbody_client_id: 'C1', client_name: 'Ana', summary: null },
  origin: 'https://x', shadow: false, now: new Date('2026-09-05T08:00:00-05:00'),
  mediaBytes: vi.fn(async () => ({ bytes: new Uint8Array([1]), mime: 'image/png', filename: 'a.png' })),
  mb: { upcoming: vi.fn(async () => [{ id: 9, start: '2026-09-05T10:00:00', service: 'Relax', location: 'Costa del Este' }]), cancelAppointment: vi.fn(async () => true), listServices: vi.fn(async () => []) },
  ...over,
}) as any

describe('executeTool', () => {
  it('book without confirmation is an error', async () => {
    const r = await executeTool('book', { customer_confirmation: '' }, deps())
    expect(r.isError).toBe(true)
  })
  it('cancel inside 24h is blocked', async () => {
    const d = deps(); const r = await executeTool('cancel', { appointment_id: 9, customer_confirmation: 'sí' }, d)
    expect(r.isError).toBe(true); expect(d.mb.cancelAppointment).not.toHaveBeenCalled()
  })
  it('get_location_info returns waze', async () => {
    const r = await executeTool('get_location_info', { sucursal: 'sfc' }, deps())
    expect(r.result).toContain('waze')
  })
  it('send_image in shadow does not send', async () => {
    const d = deps({ shadow: true, store: { logEvent: vi.fn(async () => {}), activeMedia: vi.fn(async () => [{ key: 'promo', storage_path: 'p', caption: 'c', description: '', active: true, valid_from: null, valid_until: null }]) } })
    await executeTool('send_image', { key: 'promo' }, d)
    expect(d.wati.sendFile).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run, fail.**

- [ ] **Step 3: Implement `handoff.ts`**

```ts
import type { AgentStore } from './store'
import type { WatiClient } from './wati-api'
import type { Conversation } from './types'
import type { env as envFn } from './config/env'

export async function performHandoff(i: { store: AgentStore; wati: WatiClient; conv: Conversation; motivo: string; resumen: string; shadow: boolean; env: ReturnType<typeof envFn> }) {
  const { phone, sucursal } = i.conv
  if (i.shadow) { await i.store.logEvent(phone, 'handoff', { motivo: i.motivo, resumen: i.resumen, shadow: true }); return }
  await i.wati.sendText(phone, 'Un momento por favor, le comunico con mi compañera 🌼')
  await i.wati.updateAttributes(phone, { sucursal: sucursal ?? '', ai_modo: 'humano', ai_resumen: i.resumen.slice(0, 300), ai_motivo: i.motivo })
  let viaFlow = false
  if (i.env.handoffChatbotId) viaFlow = (await i.wati.startChatbot(phone, i.env.handoffChatbotId)).ok
  if (!viaFlow) {
    if (!sucursal) await i.wati.sendButtons(phone, '¿Para cuál sucursal desea atención?', ['Costa del Este', 'San Francisco'])
    await i.wati.assignOperator(phone, sucursal === 'cde' ? i.env.citasCdeEmail : i.env.citasSfcEmail)
  }
  await i.store.upsertConversation({ phone, mode: 'human', human_since: new Date().toISOString(), handoff_reason: i.motivo, summary: i.resumen })
  await i.store.logEvent(phone, 'handoff', { motivo: i.motivo, resumen: i.resumen, viaFlow })
}

export async function registerTakeover(store: AgentStore, phone: string, operatorEmail: string) {
  await store.upsertConversation({ phone, mode: 'human', human_since: new Date().toISOString(), handoff_reason: 'takeover' })
  await store.logEvent(phone, 'takeover', { operatorEmail })
}

export async function resumeAgent(store: AgentStore, phone: string) {
  await store.upsertConversation({ phone, mode: 'agent', human_since: null, handoff_reason: null })
  await store.logEvent(phone, 'resume', {})
}
```

- [ ] **Step 4: Implement `execute.ts`**

```ts
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
        const r = await d.mb.book({ clientId: d.conv.mindbody_client_id!, sucursal: d.conv.sucursal ?? (a.location === 'Costa del Este' ? 'cde' : 'sfc'), date: input.date, time: input.time, serviceIds: [], people: 1, origin: d.origin, clientName: d.conv.client_name ?? '', phone })
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
```

> `reschedule` with `serviceIds: []` is wrong: before commit, extend `upcoming()` in Task 12 to also return `sessionTypeId` (from `v.SessionTypeId`) and pass `serviceIds: [a.sessionTypeId]`. Update the Task 12 interface accordingly.

- [ ] **Step 5: Pass, commit** `feat(wati-agent): tool executor and handoff`.

---

### Task 14: Runner (Claude loop)

**Files:** `src/lib/wati-agent/runner.ts`, test `runner.test.ts` (injected fake Anthropic client).

**Interfaces:**
```ts
export interface RunDeps {
  anthropic: Pick<Anthropic, 'messages'>; store: AgentStore; wati: WatiClient; origin: string; now: Date
  mediaBytes: ToolDeps['mediaBytes']; mb: ToolDeps['mb']; styleGuide: string; sleep?: (ms: number) => Promise<void>
}
export async function runTurn(phone: string, shadow: boolean, deps: RunDeps): Promise<{ bubbles: string[]; handedOff: boolean }>
```

Algorithm:
1. `conv = store.getConversation(phone)`; `history = store.recentMessages(phone, {sinceHours: 48, limit: 60})`.
2. Build `messages`: consecutive `in` → user text (prefix `[imagen]`/`[audio]` for media types), `out` → assistant text (author `human` prefixed `[compañera humana]:` inside a user-role note so Camila knows). Ensure first is `user`; merge consecutive same-role blocks by joining with `\n`.
3. `intent = detectIntent(last inbound text)`; `system = buildSystem({...})`; media from `store.activeMedia(panamaDate(now))`; persona from `store.getSetting('persona_name','Camila')`.
4. Loop ≤ 8: `anthropic.messages.create({ model: env().model, max_tokens: 2000, system, tools: TOOLS, messages })`. Log `llm` event with `usage`. If `stop_reason === 'tool_use'`: run each tool via `executeTool`, push assistant content + `tool_result` blocks (with `is_error`), apply `convPatch` via `store.upsertConversation`, if any outcome `endTurn` → collect text so far, stop. Else break.
5. Text = all `text` blocks joined by `\n`; `bubbles = splitBubbles(text)`. For each: shadow → `store.insertMessage({... author:'camila', shadow:true})` + event `shadow_reply`; live → `wati.sendText`, insert message (`shadow:false`, `wati_message_id` from response), `sleep(1500 + 500*index)` between bubbles.
6. Every 6th turn (count `out` messages by camila in history % 6 === 0) or after handoff: refresh summary with one extra Claude call (`max_tokens: 300`, "Resume en ≤ 4 líneas…") and `upsertConversation({summary})`.
7. Catch-all: log `error`, and if not shadow: `wati.sendText(phone, 'Disculpe, un momento por favor 🌼')` then `performHandoff(... motivo: 'error_sistema')`.

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect, vi } from 'vitest'
import { runTurn } from './runner'

function fakeAnthropic(responses: any[]) {
  let i = 0
  return { messages: { create: vi.fn(async () => responses[i++]) } } as any
}
const text = (t: string) => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: t }], usage: {} })
const toolUse = (name: string, input: any) => ({ stop_reason: 'tool_use', content: [{ type: 'tool_use', id: 't1', name, input }], usage: {} })

function deps(anthropic: any, over: any = {}) {
  const sent: string[] = []
  return {
    anthropic, origin: 'https://x', now: new Date('2026-09-04T15:00:00-05:00'), styleGuide: 'G', sleep: async () => {},
    store: {
      getConversation: vi.fn(async () => ({ phone: '507', mode: 'agent', sucursal: null, mindbody_client_id: null, client_name: null, summary: null, audio_count: 0 })),
      recentMessages: vi.fn(async () => [{ phone: '507', direction: 'in', author: 'customer', type: 'text', text: 'hola', shadow: false }]),
      activeMedia: vi.fn(async () => []), getSetting: vi.fn(async (_k: string, f: any) => f),
      insertMessage: vi.fn(async () => ({ inserted: true })), logEvent: vi.fn(async () => {}), upsertConversation: vi.fn(async (c: any) => c),
    },
    wati: { sendText: vi.fn(async (_p: string, t: string) => { sent.push(t); return { ok: true, messageId: 'm' } }) },
    mediaBytes: vi.fn(), mb: {}, sent, ...over,
  } as any
}

describe('runTurn', () => {
  it('sends bubbles live', async () => {
    const d = deps(fakeAnthropic([text('Hola\n---\n¿En qué le ayudo?')]))
    const r = await runTurn('507', false, d)
    expect(r.bubbles).toEqual(['Hola', '¿En qué le ayudo?']); expect(d.sent).toEqual(['Hola', '¿En qué le ayudo?'])
  })
  it('shadow stores but does not send', async () => {
    const d = deps(fakeAnthropic([text('Hola')]))
    await runTurn('507', true, d)
    expect(d.sent).toEqual([]); expect(d.store.insertMessage.mock.calls[0][0]).toMatchObject({ shadow: true, author: 'camila' })
  })
  it('runs a tool then answers', async () => {
    const d = deps(fakeAnthropic([toolUse('get_hours', {}), text('Abrimos 9am')]))
    const r = await runTurn('507', false, d)
    expect(r.bubbles).toEqual(['Abrimos 9am']); expect(d.anthropic.messages.create).toHaveBeenCalledTimes(2)
    const second = d.anthropic.messages.create.mock.calls[1][0]
    expect(second.messages.at(-1).content[0]).toMatchObject({ type: 'tool_result', tool_use_id: 't1' })
  })
})
```

- [ ] **Step 2: Run, fail.**

- [ ] **Step 3: Implement** following the algorithm; use `Anthropic.MessageParam`, `Anthropic.ToolUseBlock`, `Anthropic.ToolResultBlockParam` types; import `TOOLS`, `executeTool`, `buildSystem`, `detectIntent`, `splitBubbles`, `performHandoff`, `panamaDate`, `env`.

```ts
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
import type { StoredMessage } from './types'

export interface RunDeps { anthropic: Pick<Anthropic, 'messages'>; store: AgentStore; wati: WatiClient; origin: string; now: Date; mediaBytes: ToolDeps['mediaBytes']; mb: ToolDeps['mb']; styleGuide: string; sleep?: (ms: number) => Promise<void> }

function toMessages(history: StoredMessage[]): Anthropic.MessageParam[] {
  const out: Anthropic.MessageParam[] = []
  for (const m of history) {
    const role: 'user' | 'assistant' = m.direction === 'in' || m.author === 'human' || m.author === 'bot' || m.author === 'template' ? 'user' : 'assistant'
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

export async function runTurn(phone: string, shadow: boolean, d: RunDeps): Promise<{ bubbles: string[]; handedOff: boolean }> {
  const sleep = d.sleep ?? (ms => new Promise(r => setTimeout(r, ms)))
  let conv = (await d.store.getConversation(phone))!
  try {
    const history = await d.store.recentMessages(phone, { sinceHours: 48, limit: 60 })
    const lastIn = [...history].reverse().find(m => m.direction === 'in')
    const messages = toMessages(history)
    if (!messages.length) return { bubbles: [], handedOff: false }
    const [media, personaName] = await Promise.all([d.store.activeMedia(panamaDate(d.now)), d.store.getSetting('persona_name', 'Camila')])
    const system = buildSystem({ personaName, now: d.now, sucursal: conv.sucursal, clientName: conv.client_name, mindbodyHistory: null, summary: conv.summary, media, intent: detectIntent(lastIn?.text || ''), styleGuide: d.styleGuide })
    const texts: string[] = []
    let handedOff = false
    for (let round = 0; round < 8; round++) {
      const res = await d.anthropic.messages.create({ model: env().model, max_tokens: 2000, system, tools: TOOLS, messages })
      await d.store.logEvent(phone, 'llm', { round, stop: res.stop_reason, usage: res.usage })
      for (const b of res.content) if (b.type === 'text' && b.text.trim()) texts.push(b.text)
      if (res.stop_reason !== 'tool_use') break
      messages.push({ role: 'assistant', content: res.content })
      const results: Anthropic.ToolResultBlockParam[] = []
      let end = false
      for (const b of res.content) {
        if (b.type !== 'tool_use') continue
        await d.store.logEvent(phone, 'tool_call', { tool: b.name, input: b.input })
        const o = await executeTool(b.name, b.input, { store: d.store, wati: d.wati, conv, origin: d.origin, shadow, now: d.now, mediaBytes: d.mediaBytes, mb: d.mb })
        await d.store.logEvent(phone, 'tool_result', { tool: b.name, ok: !o.isError, result: o.result.slice(0, 500) })
        if (o.convPatch) conv = await d.store.upsertConversation({ phone, ...o.convPatch })
        if (b.name === 'handoff') handedOff = true
        if (o.endTurn) end = true
        results.push({ type: 'tool_result', tool_use_id: b.id, content: o.result, is_error: o.isError || undefined })
      }
      messages.push({ role: 'user', content: results })
      if (end) break
    }
    const bubbles = handedOff ? [] : splitBubbles(texts.join('\n'))
    for (const [i, text] of bubbles.entries()) {
      if (shadow) {
        await d.store.insertMessage({ phone, wati_message_id: null, direction: 'out', author: 'camila', type: 'text', text, media_ref: null, shadow: true })
        await d.store.logEvent(phone, 'shadow_reply', { text })
      } else {
        const r = await d.wati.sendText(phone, text)
        await d.store.insertMessage({ phone, wati_message_id: r.messageId ?? null, direction: 'out', author: 'camila', type: 'text', text, media_ref: null, shadow: false })
        if (i < bubbles.length - 1) await sleep(1500 + 500 * i)
      }
    }
    if (bubbles.length) await d.store.upsertConversation({ phone, last_outbound_at: new Date().toISOString() })
    const outCount = history.filter(m => m.author === 'camila').length + bubbles.length
    if (handedOff || (outCount > 0 && outCount % 6 === 0)) {
      const s = await d.anthropic.messages.create({ model: env().model, max_tokens: 300, system: 'Resume la conversación en máximo 4 líneas en español: qué quiere el cliente, qué datos ya dio (nombre, correo, sucursal, fecha/hora, tratamiento), qué falta.', messages: [...messages.filter(m => typeof m.content === 'string'), { role: 'user', content: 'Resumen:' }] })
      const summary = s.content.find(b => b.type === 'text')?.text
      if (summary) await d.store.upsertConversation({ phone, summary })
    }
    return { bubbles, handedOff }
  } catch (e) {
    await d.store.logEvent(phone, 'error', { where: 'runTurn', error: String(e) })
    if (!shadow) {
      await d.wati.sendText(phone, 'Disculpe, un momento por favor 🌼').catch(() => {})
      await performHandoff({ store: d.store, wati: d.wati, conv, motivo: 'error_sistema', resumen: conv.summary ?? '', shadow, env: env() }).catch(() => {})
    }
    return { bubbles: [], handedOff: true }
  }
}
```

- [ ] **Step 4: Pass, commit** `feat(wati-agent): claude runner with tool loop and bubbles`.

---

### Task 15: Webhook routes

**Files:**
- Create: `src/app/api/wati/agent/inbound/route.ts`, `sent/route.ts`, `status/route.ts`
- Create: `src/lib/wati-agent/webhook.ts` (payload parsing + auth) with test `webhook.test.ts`
- Create: `src/lib/wati-agent/media-bytes.ts` (Supabase Storage download)

**Interfaces:**
```ts
// webhook.ts
export function authorized(url: string, secret: string): boolean
export interface InboundEvent { phone: string; senderName: string; messageId: string; text: string | null; type: string; owner: boolean; ticketId: string | null; contactId: string | null; mediaRef: string | null }
export function parseInbound(body: any): InboundEvent | null
export interface SentEvent { phone: string; messageId: string; text: string | null; operatorEmail: string | null; operatorName: string | null; owner: boolean }
export function parseSent(body: any): SentEvent | null
export function isHumanOperator(e: SentEvent, agentEmail: string, apiLabels: string[]): boolean
export function shouldDebounceSkip(newestId: number | null, myId: number): boolean  // true when a newer inbound exists
```

- [ ] **Step 1: Failing tests**

```ts
import { describe, it, expect } from 'vitest'
import { authorized, parseInbound, parseSent, isHumanOperator, shouldDebounceSkip } from './webhook'

describe('webhook', () => {
  it('authorizes by token query', () => expect(authorized('https://x/api?token=abc', 'abc')).toBe(true))
  it('rejects wrong token', () => expect(authorized('https://x/api?token=zzz', 'abc')).toBe(false))
  it('parses inbound text', () => {
    const e = parseInbound({ waId: '50766124546', senderName: 'Ana', whatsappMessageId: 'w1', text: 'hola', type: 'text', owner: false, ticketId: 't', data: null })
    expect(e).toMatchObject({ phone: '50766124546', messageId: 'w1', text: 'hola', type: 'text', owner: false })
  })
  it('parses inbound image with data filename', () => {
    const e = parseInbound({ waId: '507', whatsappMessageId: 'w2', type: 'image', data: { fileName: 'data/images/a.jpg' }, owner: false })
    expect(e?.mediaRef).toBe('data/images/a.jpg')
  })
  it('returns null without waId', () => expect(parseInbound({})).toBeNull())
  it('human operator detection', () => {
    const e = parseSent({ waId: '507', whatsappMessageId: 'w3', operatorEmail: 'karen@mimosa.com', owner: true })!
    expect(isHumanOperator(e, 'asistente@mimosa.com', [''])).toBe(true)
    expect(isHumanOperator({ ...e, operatorEmail: 'asistente@mimosa.com' }, 'asistente@mimosa.com', [''])).toBe(false)
    expect(isHumanOperator({ ...e, operatorEmail: null }, 'asistente@mimosa.com', [''])).toBe(false)
  })
  it('debounce skip when newer exists', () => { expect(shouldDebounceSkip(10, 9)).toBe(true); expect(shouldDebounceSkip(9, 9)).toBe(false) })
})
```

- [ ] **Step 2: Run, fail.**

- [ ] **Step 3: Implement `webhook.ts`**

```ts
import { cleanPhone } from './phone'

export function authorized(url: string, secret: string): boolean {
  if (!secret) return false
  return new URL(url).searchParams.get('token')?.trim() === secret
}
export interface InboundEvent { phone: string; senderName: string; messageId: string; text: string | null; type: string; owner: boolean; ticketId: string | null; contactId: string | null; mediaRef: string | null }
export function parseInbound(b: any): InboundEvent | null {
  const phone = cleanPhone(b?.waId); if (!phone) return null
  const data = b?.data && typeof b.data === 'object' ? b.data : null
  return { phone, senderName: String(b.senderName ?? ''), messageId: String(b.whatsappMessageId ?? b.id ?? ''), text: typeof b.text === 'string' ? b.text : null, type: String(b.type ?? 'text').toLowerCase(), owner: Boolean(b.owner), ticketId: b.ticketId ?? null, contactId: b.contactId ?? b.conversationId ?? null, mediaRef: data?.fileName ?? data?.filename ?? (typeof b.data === 'string' ? b.data : null) }
}
export interface SentEvent { phone: string; messageId: string; text: string | null; operatorEmail: string | null; operatorName: string | null; owner: boolean }
export function parseSent(b: any): SentEvent | null {
  const phone = cleanPhone(b?.waId); if (!phone) return null
  return { phone, messageId: String(b.whatsappMessageId ?? b.id ?? ''), text: typeof b.text === 'string' ? b.text : null, operatorEmail: b.operatorEmail ? String(b.operatorEmail).toLowerCase() : null, operatorName: b.operatorName ?? null, owner: Boolean(b.owner) }
}
/** apiLabels: operatorEmail values WATI stamps on API-sent messages (learned in the spike; '' = blank). */
export function isHumanOperator(e: SentEvent, agentEmail: string, apiLabels: string[]): boolean {
  if (!e.owner) return false
  const em = e.operatorEmail ?? ''
  if (!em) return false
  if (em === agentEmail.toLowerCase()) return false
  if (apiLabels.map(s => s.toLowerCase()).includes(em)) return false
  return true
}
export function shouldDebounceSkip(newestId: number | null, myId: number): boolean { return newestId !== null && newestId > myId }
```

`media-bytes.ts`:
```ts
import { createClient } from '@supabase/supabase-js'
export async function mediaBytesFromStorage(storagePath: string) {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data, error } = await sb.storage.from('wati-agent-media').download(storagePath)
  if (error || !data) throw new Error(`media download failed: ${error?.message}`)
  return { bytes: new Uint8Array(await data.arrayBuffer()), mime: data.type || 'image/jpeg', filename: storagePath.split('/').pop() || 'imagen.jpg' }
}
```

- [ ] **Step 4: Inbound route**

```ts
// src/app/api/wati/agent/inbound/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import Anthropic from '@anthropic-ai/sdk'
import fs from 'node:fs'
import path from 'node:path'
import { authorized, parseInbound, shouldDebounceSkip } from '@/lib/wati-agent/webhook'
import { env } from '@/lib/wati-agent/config/env'
import { storeFromEnv } from '@/lib/wati-agent/store'
import { watiFromEnv } from '@/lib/wati-agent/wati-api'
import { gate } from '@/lib/wati-agent/gate'
import { checkTriggers } from '@/lib/wati-agent/triggers'
import { performHandoff, resumeAgent } from '@/lib/wati-agent/handoff'
import { runTurn } from '@/lib/wati-agent/runner'
import { mediaBytesFromStorage } from '@/lib/wati-agent/media-bytes'
import * as mb from '@/lib/wati-agent/tools/mindbody-adapter'

export const dynamic = 'force-dynamic'
export const maxDuration = 60
const DEBOUNCE_MS = 6000
const STYLE_GUIDE = fs.readFileSync(path.join(process.cwd(), 'src/lib/wati-agent/voice/style-guide.md'), 'utf8')

export async function POST(request: NextRequest) {
  const e = env()
  if (!authorized(request.url, e.webhookSecret)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const body = await request.json().catch(() => null)
  const ev = parseInbound(body)
  if (!ev) return NextResponse.json({ ok: true, ignored: 'no waId' })
  const origin = `${request.nextUrl.protocol}//${request.headers.get('host')}`
  waitUntil(process(ev, origin).catch(err => console.error('wati-agent inbound failed', err)))
  return NextResponse.json({ ok: true })
}

async function process(ev: ReturnType<typeof parseInbound> & object, origin: string) {
  const e = env(); const store = storeFromEnv(); const wati = watiFromEnv()
  let conv = await store.getConversation(ev.phone)
  if (!conv) conv = await store.upsertConversation({ phone: ev.phone, mode: 'agent', client_name: ev.senderName || null, wati_contact_id: ev.contactId, ticket_id: ev.ticketId })
  // Resume after 24 h in human mode with no activity
  if (conv.mode === 'human' && conv.human_since && Date.now() - new Date(conv.human_since).getTime() > 24 * 3600_000) { await resumeAgent(store, ev.phone); conv = (await store.getConversation(ev.phone))! }
  if (ev.owner) return
  const { inserted } = await store.insertMessage({ phone: ev.phone, wati_message_id: ev.messageId || null, direction: 'in', author: 'customer', type: ev.type, text: ev.text, media_ref: ev.mediaRef, shadow: false })
  if (!inserted) return
  const audioCount = ev.type === 'audio' || ev.type === 'voice' ? conv.audio_count + 1 : conv.audio_count
  conv = await store.upsertConversation({ phone: ev.phone, last_inbound_at: new Date().toISOString(), ticket_id: ev.ticketId ?? conv.ticket_id, audio_count: audioCount })
  const enabled = await store.getSetting('enabled', true)
  const g = gate({ globalMode: e.mode, enabledSetting: enabled, whitelist: e.whitelist, phone: ev.phone, conversationMode: conv.mode, owner: ev.owner })
  if (!g.run) { await store.logEvent(ev.phone, 'llm', { skipped: g.reason }); return }
  const myId = await store.newestInboundId(ev.phone)
  await new Promise(r => setTimeout(r, DEBOUNCE_MS))
  if (shouldDebounceSkip(await store.newestInboundId(ev.phone), myId!)) return
  if (!g.shadow && e.operatorEmail) await wati.assignOperator(ev.phone, e.operatorEmail)
  const trig = checkTriggers({ type: ev.type, text: ev.text, audioCount })
  if (trig.handoff) {
    if (trig.motivo === 'es_bot' && !g.shadow) await wati.sendText(ev.phone, 'Soy la asistente de Mimosa 🌼 con gusto le comunico con una de mis compañeras.')
    await performHandoff({ store, wati, conv, motivo: trig.motivo, resumen: conv.summary ?? `Cliente envió: ${ev.text ?? ev.type}`, shadow: g.shadow, env: e })
    return
  }
  if ((ev.type === 'audio' || ev.type === 'voice') && audioCount === 1) {
    if (!g.shadow) await wati.sendText(ev.phone, '¿Me lo puede escribir por favor? 🌼')
    await store.insertMessage({ phone: ev.phone, wati_message_id: null, direction: 'out', author: 'camila', type: 'text', text: '¿Me lo puede escribir por favor? 🌼', media_ref: null, shadow: g.shadow })
    return
  }
  await runTurn(ev.phone, g.shadow, { anthropic: new Anthropic(), store, wati, origin, now: new Date(), mediaBytes: mediaBytesFromStorage, mb, styleGuide: STYLE_GUIDE })
}
```

- [ ] **Step 5: Sent route**

```ts
// src/app/api/wati/agent/sent/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { authorized, parseSent, isHumanOperator } from '@/lib/wati-agent/webhook'
import { env } from '@/lib/wati-agent/config/env'
import { storeFromEnv } from '@/lib/wati-agent/store'
import { registerTakeover } from '@/lib/wati-agent/handoff'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const e = env()
  if (!authorized(request.url, e.webhookSecret)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const ev = parseSent(await request.json().catch(() => null))
  if (!ev) return NextResponse.json({ ok: true })
  const store = storeFromEnv()
  const apiLabels = await store.getSetting<string[]>('api_operator_labels', [''])
  const conv = await store.getConversation(ev.phone)
  const human = isHumanOperator(ev, e.operatorEmail, apiLabels)
  await store.insertMessage({ phone: ev.phone, wati_message_id: ev.messageId || null, direction: 'out', author: human ? 'human' : 'camila', type: 'text', text: ev.text, media_ref: null, shadow: false }).catch(() => ({ inserted: false }))
  if (human && conv && conv.mode === 'agent') await registerTakeover(store, ev.phone, ev.operatorEmail!)
  return NextResponse.json({ ok: true })
}
```

Note: Camila's own messages are inserted at send time with the WATI id, so the duplicate insert here is a no-op; human messages get stored once. If the conversation row doesn't exist yet, skip the insert (foreign key).

- [ ] **Step 6: Status route**

```ts
// src/app/api/wati/agent/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { authorized } from '@/lib/wati-agent/webhook'
import { cleanPhone } from '@/lib/wati-agent/phone'
import { env } from '@/lib/wati-agent/config/env'
import { storeFromEnv } from '@/lib/wati-agent/store'
import { resumeAgent } from '@/lib/wati-agent/handoff'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (!authorized(request.url, env().webhookSecret)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const b = await request.json().catch(() => null)
  const phone = cleanPhone(b?.waId); const status = String(b?.ticketStatus ?? b?.status ?? b?.statusString ?? '').toUpperCase()
  if (phone && status === 'SOLVED') { const store = storeFromEnv(); const c = await store.getConversation(phone); if (c && c.mode === 'human') await resumeAgent(store, phone) }
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 7: `npm run type-check` passes; commit** `feat(wati-agent): inbound, sent and status webhooks`.

---

### Task 16: Admin API and page

**Files:**
- Create: `src/app/api/admin/wati-agent/conversations/route.ts` (GET list, `?mode=`), `src/app/api/admin/wati-agent/conversations/[phone]/route.ts` (GET transcript+events; POST `{action:'pause'|'resume'|'handoff'}`), `src/app/api/admin/wati-agent/media/route.ts` (GET list; POST multipart upload with key/description/caption/valid_from/valid_until; DELETE `?key=`), `src/app/api/admin/wati-agent/settings/route.ts` (GET/POST), `src/app/api/admin/wati-agent/stats/route.ts` (GET `?days=7`)
- Create: `src/app/admin/wati-agent/page.tsx` (server, metadata) + `WatiAgentClient.tsx` (client UI)
- Modify: `src/app/admin/AdminLayoutClient.tsx` — find the nav item for `/admin/configuracion` and add `{ href: '/admin/wati-agent', label: 'Camila (WhatsApp)' }` next to it with the `MessageCircle` icon from lucide-react.

All routes start with `const denied = await requireAdmin(); if (denied) return denied` from `@/lib/auth/require-admin`.

- [ ] **Step 1: Conversations routes**

```ts
// conversations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { storeFromEnv } from '@/lib/wati-agent/store'
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(); if (denied) return denied
  const mode = req.nextUrl.searchParams.get('mode') as any
  return NextResponse.json({ data: await storeFromEnv().listConversations({ mode: mode || undefined, limit: 200 }) })
}
```

```ts
// conversations/[phone]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { storeFromEnv } from '@/lib/wati-agent/store'
import { watiFromEnv } from '@/lib/wati-agent/wati-api'
import { performHandoff, resumeAgent } from '@/lib/wati-agent/handoff'
import { env } from '@/lib/wati-agent/config/env'
import { createClient } from '@supabase/supabase-js'

export async function GET(_: NextRequest, { params }: { params: Promise<{ phone: string }> }) {
  const denied = await requireAdmin(); if (denied) return denied
  const { phone } = await params; const store = storeFromEnv()
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: messages } = await sb.from('wati_agent_messages').select('*').eq('phone', phone).order('created_at', { ascending: true }).limit(500)
  return NextResponse.json({ conversation: await store.getConversation(phone), messages: messages ?? [], events: await store.eventsFor(phone, 200) })
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ phone: string }> }) {
  const denied = await requireAdmin(); if (denied) return denied
  const { phone } = await params; const { action } = await req.json(); const store = storeFromEnv()
  const conv = await store.getConversation(phone); if (!conv) return NextResponse.json({ error: 'No existe' }, { status: 404 })
  if (action === 'pause') await store.upsertConversation({ phone, mode: 'off' })
  else if (action === 'resume') await resumeAgent(store, phone)
  else if (action === 'handoff') await performHandoff({ store, wati: watiFromEnv(), conv, motivo: 'admin', resumen: conv.summary ?? 'Pasado a humano desde el panel', shadow: false, env: env() })
  else return NextResponse.json({ error: 'acción inválida' }, { status: 400 })
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Media route** — POST reads `formData()`, uploads `file` to bucket `wati-agent-media` at `${key}/${Date.now()}-${file.name}` via service-role `sb.storage.from(...).upload(path, bytes, { contentType, upsert: true })`, then upserts `wati_agent_media`. DELETE removes the row and the object. GET lists rows plus `publicUrl` from `sb.storage.from('wati-agent-media').getPublicUrl(storage_path)`.

- [ ] **Step 3: Settings + stats routes** — settings GET returns `{ enabled, persona_name, api_operator_labels }` via `getSetting`; POST accepts any subset and `setSetting`s each. Stats GET returns `store.stats(new Date(Date.now() - days*86400_000).toISOString())` plus `env().mode`.

- [ ] **Step 4: Page** — `page.tsx` exports metadata `{ title: 'Camila | Mimosa Admin', robots: { index: false, follow: false } }` and renders `<WatiAgentClient />`. The client component has three tabs (Conversaciones, Imágenes, Ajustes) using `Card`, `Button` from `@/components/ui` like `configuracion/page.tsx`:
  - Header strip: mode badge (`env` mode from stats), enabled toggle, 7-day counts (handled / booked / handoffs by motivo / shadow replies).
  - Conversations: table (phone, client_name, mode chip, sucursal, last_inbound_at relative, handoff_reason); filter buttons Todas/Agente/Humano/Off; click opens a side panel with the transcript (bubbles by author: customer left, camila right yellow, human right green, shadow dashed with "no enviado") and an events list (tool calls collapsed by default); action buttons Pausar / Reanudar / Pasar a humano.
  - Imágenes: list with thumbnail, key, description, caption, validity, active; upload form.
  - Ajustes: persona name, `api_operator_labels` (comma list), enabled.
  Fetch via the routes above; refresh conversations every 15 s while the tab is visible.

- [ ] **Step 5: Verify in the browser** — `npm run dev`, open `/admin/wati-agent`, see empty tables without console errors; upload one test image; confirm it appears in `wati_agent_media` and in Supabase Storage.

- [ ] **Step 6: Commit** `feat(admin): wati-agent panel (conversations, media, settings, stats)`.

---

### Task 17: Evals runner

**Files:** `scripts/wati-agent/evals/run.ts`, package script `"wati:evals"`.

**Interfaces:** reads `cases.json`; for each case replays turns through `runTurn` with an in-memory store, a recording fake WATI client, and a mocked `mb` (returns fixed services and slots). Grades each Camila turn vs the human's with one Claude call (1–5 tone score) and hard checks. Prints a table and writes `scripts/wati-agent/evals/last-run.json`. Exit 1 if mean tone < 3.5 or any hard-check failure rate > 10 %.

- [ ] **Step 1: Write the runner**

```ts
import fs from 'node:fs'
import Anthropic from '@anthropic-ai/sdk'
import { runTurn } from '../../../src/lib/wati-agent/runner'
import type { StoredMessage, Conversation } from '../../../src/lib/wati-agent/types'

const cases = JSON.parse(fs.readFileSync('scripts/wati-agent/evals/cases.json', 'utf8')) as Array<{ id: string; sucursal: 'cde' | 'sfc' | null; turns: Array<{ customer: string[]; staff: string[] }> }>
const styleGuide = fs.readFileSync('src/lib/wati-agent/voice/style-guide.md', 'utf8')
const anthropic = new Anthropic()
const only = process.argv[2]

function memStore(conv: Conversation) {
  const messages: StoredMessage[] = []; const events: any[] = []
  return {
    messages, events,
    getConversation: async () => conv, upsertConversation: async (p: any) => Object.assign(conv, p),
    insertMessage: async (m: StoredMessage) => { messages.push({ ...m, id: messages.length + 1, created_at: new Date().toISOString() }); return { inserted: true } },
    recentMessages: async () => messages, newestInboundId: async () => messages.filter(m => m.direction === 'in').at(-1)?.id ?? null,
    logEvent: async (_p: any, kind: string, payload: any) => { events.push({ kind, payload }) },
    activeMedia: async () => [{ key: 'promo_mes', description: 'Promoción del mes', caption: '', storage_path: 'x', valid_from: null, valid_until: null, active: true }],
    getSetting: async (_k: string, f: any) => f, setSetting: async () => {}, listConversations: async () => [], eventsFor: async () => [], stats: async () => ({ handled: 0, booked: 0, handoffs: {}, shadow: 0 }),
  } as any
}
const fakeWati = () => ({ sendText: async () => ({ ok: true, messageId: 'm' }), sendFile: async () => ({ ok: true }), sendButtons: async () => ({ ok: true }), updateAttributes: async () => ({ ok: true }), assignOperator: async () => ({ ok: true }), assignTeams: async () => ({ ok: true }), startChatbot: async () => ({ ok: true }), updateChatStatus: async () => ({ ok: true }), getMedia: async () => ({ ok: false }) }) as any
const fakeMb = {
  listServices: async () => [{ id: 10, name: 'Mimosa Relax - 60 min', minutes: 60, price: 75, category: 'Masajes' }, { id: 12, name: 'Liberador de Tensión - 60 min', minutes: 60, price: 80, category: 'Masajes' }],
  findClientByPhone: async () => ({ id: 'C1', name: 'Cliente Prueba', email: 'c@x.com', lastVisits: [] }),
  createClient: async () => ({ id: 'C2' }), availability: async () => [{ time: '10:00', staffIds: [1, 2] }, { time: '15:00', staffIds: [1] }],
  book: async () => ({ appointmentIds: [1], therapist: 'Por asignar' }), upcoming: async () => [], cancelAppointment: async () => true,
} as any

const rows: any[] = []
for (const c of cases) {
  if (only && c.id !== only) continue
  const conv: Conversation = { phone: '50700000000', wati_contact_id: null, ticket_id: null, mode: 'agent', sucursal: c.sucursal, mindbody_client_id: null, client_name: null, summary: null, handoff_reason: null, human_since: null, last_inbound_at: null, last_outbound_at: null, audio_count: 0 }
  const store = memStore(conv)
  for (const [ti, turn] of c.turns.entries()) {
    for (const t of turn.customer) await store.insertMessage({ phone: conv.phone, wati_message_id: null, direction: 'in', author: 'customer', type: 'text', text: t, media_ref: null, shadow: false })
    const r = await runTurn(conv.phone, false, { anthropic, store, wati: fakeWati(), origin: 'https://eval', now: new Date(), mediaBytes: async () => ({ bytes: new Uint8Array(), mime: 'image/png', filename: 'x' }), mb: fakeMb, styleGuide })
    const camila = r.bubbles.join('\n')
    const g = await anthropic.messages.create({ model: process.env.WATI_AGENT_MODEL || 'claude-sonnet-5', max_tokens: 200, system: 'Califica de 1 a 5 qué tanto la respuesta A suena como la recepcionista real B (tono, largo, calidez, formato). Responde solo JSON {"score":n,"why":"..."}', messages: [{ role: 'user', content: `Cliente: ${turn.customer.join(' / ')}\n\nA (Camila):\n${camila || '(handoff)'}\n\nB (humana):\n${turn.staff.join('\n')}` }] })
    const gt = g.content.find(b => b.type === 'text')?.text ?? '{}'
    const score = Number((JSON.parse(gt.slice(gt.indexOf('{'), gt.lastIndexOf('}') + 1)).score) || 0)
    const inventedPrice = /\$\s?\d+|\b\d+\s?(d[oó]lares|usd)\b/i.test(camila) && !store.events.some((e: any) => e.kind === 'tool_result' && e.payload.tool === 'list_services')
    const bookedWithoutConfirm = store.events.some((e: any) => e.kind === 'tool_result' && e.payload.tool === 'book' && e.payload.ok) && !turn.customer.some(t => /s[ií]|claro|dale|perfecto|listo|ok/i.test(t))
    rows.push({ case: c.id, turn: ti, score, inventedPrice, bookedWithoutConfirm, handedOff: r.handedOff, camila: camila.slice(0, 200) })
    if (r.handedOff) break
    // keep the human's real reply out of history: Camila's own reply is already stored by runTurn
  }
}
fs.writeFileSync('scripts/wati-agent/evals/last-run.json', JSON.stringify(rows, null, 2))
const mean = rows.reduce((s, r) => s + r.score, 0) / rows.length
const hard = rows.filter(r => r.inventedPrice || r.bookedWithoutConfirm).length / rows.length
console.table(rows.map(r => ({ case: r.case, turn: r.turn, score: r.score, price: r.inventedPrice, confirm: r.bookedWithoutConfirm, handoff: r.handedOff })))
console.log(`mean tone ${mean.toFixed(2)}  hard-fail ${(hard * 100).toFixed(1)}%`)
process.exit(mean < 3.5 || hard > 0.1 ? 1 : 0)
```

package.json: `"wati:evals": "node --env-file=.env.local --experimental-strip-types --import ./scripts/spikes/ts-resolve-register.mjs scripts/wati-agent/evals/run.ts"`.

- [ ] **Step 2: Run `npm run wati:evals -- case-1`** and read Camila's replies by eye; then the full set. Record the numbers in `docs/WATI_AGENT.md` (Task 18). Iterate on `prompt.ts` wording (not on tests) until mean ≥ 3.5.

- [ ] **Step 3: Commit** `feat(wati-agent): replay evals`.

---

### Task 18: WATI setup doc, spike checklist, env

**Files:** `docs/WATI_AGENT.md`, `.env.example` (add the new vars), `.gitignore` (`Wati chats.zip`).

- [ ] **Step 1: Write `docs/WATI_AGENT.md`** with sections:
  1. What Camila does / doesn't (from spec §1).
  2. Env vars table (spec §3.2 plus `WATI_CHANNEL_PHONE`, `ANTHROPIC_API_KEY`).
  3. WATI setup, step by step with the exact UI names: create user "Asistente Mimosa" (Settings → Team members), copy its email; Settings → Webhooks → add three endpoints:
     - Messages received → `https://www.mimosaretreat.com/api/wati/agent/inbound?token=<WATI_AGENT_WEBHOOK_SECRET>`
     - Messages sent (session) → `.../api/wati/agent/sent?token=...`
     - Conversation status update → `.../api/wati/agent/status?token=...`
     Must use `www.` (bare domain 302s).
     Contact attributes (Contacts → Attributes): `sucursal`, `ai_modo`, `ai_resumen`, `ai_motivo`.
     Chatbot: open the existing flow, remove its "new conversation" trigger keyword so it never auto-starts, insert a Condition on `{{sucursal}}` before the Buttons node (`cde` → CDE branch, `sfc` → SF branch, else Buttons), copy the chatbot id from the URL into `WATI_HANDOFF_CHATBOT_ID`.
  4. **Spike checklist** (do before shadow mode): with `WATI_AGENT_MODE=off` deployed to a preview URL, (a) send a WhatsApp from a test phone and confirm a `wati_agent_messages` row; (b) reply from the inbox as Citas CDE and confirm the sent webhook shows `operatorEmail` = that user; (c) call `sendText` through the API once (`curl` example given) and record what `operatorEmail` the sent webhook carries — put that value in Ajustes → `api_operator_labels`; (d) call `chatbots/start` for the test phone and confirm the flow runs on a chat assigned to an operator; (e) `updateChatStatus SOLVED` and confirm the status webhook payload field name for status — adjust `status/route.ts` if it isn't `ticketStatus`.
  5. Rollout: shadow → whitelist → live, with what to look at in `/admin/wati-agent` at each step, and how to stop everything (`enabled` toggle, `WATI_AGENT_MODE=off`).
  6. Eval numbers from Task 17.

- [ ] **Step 2: Add env vars to Vercel** (Production + Preview) and `.env.local`: `ANTHROPIC_API_KEY`, `WATI_AGENT_WEBHOOK_SECRET` (`openssl rand -hex 24`), `WATI_AGENT_OPERATOR_EMAIL`, `WATI_HANDOFF_CHATBOT_ID`, `WATI_CITAS_CDE_EMAIL`, `WATI_CITAS_SFC_EMAIL`, `WATI_CHANNEL_PHONE`, `WATI_AGENT_MODE=off`, `WATI_AGENT_WHITELIST`, `WATI_AGENT_MODEL`.

- [ ] **Step 3: `npm run check-all && npm test`** green; commit `docs(wati-agent): setup, spike checklist, rollout`.

---

### Task 19: Shadow-mode verification

- [ ] **Step 1:** Deploy (cherry-pick to `main` per release workflow), run the spike checklist, set `WATI_AGENT_MODE=shadow`, redeploy.
- [ ] **Step 2:** After 24 h, open `/admin/wati-agent`, read 20 shadow replies next to the human replies. Note recurring misses (wrong greeting, too long, wrong sucursal assumption, missed handoff) and fix them in `prompt.ts` / `triggers.ts`, re-running `npm run wati:evals`.
- [ ] **Step 3:** Confirm no `error` events in `wati_agent_events` for 24 h, then move to `whitelist` with the owner's phones, then `live`.

---

## Self-review

**Spec coverage:** §3 routes and background processing → Task 15; §3.1 WATI config → Task 18; §3.2 env → Tasks 3, 18; §4 tables → Task 2; §5.1 gate/debounce/idempotency/resume → Tasks 5, 7, 15; §5.2 prompt, intent, history window, tool loop, bubbles, summary, error→handoff → Tasks 10, 14; §5.3 prompt rules → Task 10; §6 tools incl. couples, confirmation, 24 h, media, audio rule → Tasks 11–13, 15; §7 handoff/takeover/resume/kill switches → Tasks 13, 15, 16; §8 voice pipeline + evals → Tasks 8, 9, 17; §9 rollout → Tasks 18, 19; §10 admin → Task 16; §11 tests → each task; §12 out of scope respected.

**Type consistency:** `Conversation.audio_count` added in Task 2 and used in Task 15; `MediaAsset` shape identical in Tasks 2, 10, 13; `AgentStore.activeMedia(today)` used in Tasks 13, 14; `WatiClient.sendText` returns `messageId` used in Task 14; `upcoming()` must return `sessionTypeId` (noted in Task 13) — Task 12 implementer adds it to the return type.

**Known judgement calls left to the implementer:** exact `ClientScheduledVisit` field names (Task 12), the WATI status webhook field name (spike, Task 18), and the nav array location in `AdminLayoutClient.tsx` (Task 16).
