# WATI AI receptionist ("Camila") — design

Date: 2026-09-04
Status: approved in conversation, pending implementation plan

## 1. Goal

An AI receptionist on Mimosa's WhatsApp (WATI) that answers every inbound chat
first, in the voice of the real receptionists, handles information requests
and Mindbody bookings/changes on its own, and hands off to the human team the
moment anything is outside its lane. Handoff must be cheap and obvious for the
receptionists: a chat assigned to "Citas Costa del Este" / "Citas San
Francisco" needs a human; a chat assigned to the agent's seat is being handled.

Decisions already taken with the owner:

| Question | Decision |
|---|---|
| Autonomy | Fully autonomous, low threshold for handoff |
| Identity | Invented persona **Camila 🌼**, one name for both locations. Admits it is an assistant if asked directly, then hands off |
| Scope it handles | Info, booking, reschedule/cancel |
| Scope it hands off | Gift certificate sales and redemptions, complaints, refunds, groups of 3+, specific therapist requests, medical questions, payment proofs, anything uncertain |
| When it answers | Always (24/7), every chat, from the first message |
| Integration | Plain WATI webhooks + WATI API from this Next.js repo on Vercel (no "Connect AI Agents" add-on) |
| Handoff mechanism | Camila starts the existing WATI chatbot flow via API; the flow assigns team, sends the intro message, assigns the location user |
| LLM | Anthropic Claude via `@anthropic-ai/sdk` |

## 2. Context

- Existing WATI client: `src/lib/booking/wati.ts` (template sends only).
- Existing pattern of WATI Flow Builder calling our routes: `src/app/api/wati/round-robin/route.ts`, documented in `docs/WATI_ROUND_ROBIN.md`.
- Mindbody client: `src/lib/booking/mindbody.ts` (client search/create, availability, add/remove appointment, client schedule, services).
- Current WATI flow: Buttons (location choice) → Assign Team → Send message → Assign User "Citas Costa del Este" / "Citas San Francisco". The two "Citas" users are shared logins for each location's receptionists.
- Chat export: `Wati chats.zip` in repo root (5,518 chats, Nov 2025 – Sep 2026, ~74,600 receptionist messages, receptionists Yasi, Adriana, Karen, Nilka, Mary). Images appear only as file names.
- WATI API facts verified from docs.wati.io (2026-09-04):
  - Webhooks: `message received`, `session message sent` (carries `operatorEmail`/`operatorName`/`owner`), `update conversation status`, `chatbot triggered`. WATI retries a non-200 webhook up to 144 times.
  - `POST /api/ext/v3/conversations/messages/text` (session text), `POST /api/v1/sendSessionFile/{number}?caption=` (multipart `file`), `POST /api/v1/sendInteractiveButtonsMessage` (1–3 buttons, optional image header).
  - `POST /api/ext/v3/chatbots/start` `{chatbot_id, target}` (Pro plan).
  - `POST /api/v1/assignOperator?email=&whatsappNumber=`, `PUT /api/ext/v3/contacts/teams`, `POST /api/v1/updateContactAttributes/{number}`, `POST /api/v1/updateChatStatus`, `getMedia` for inbound files.

## 3. Architecture

```
customer ──WhatsApp──▶ WATI ──webhook "message received"──▶ POST /api/wati/agent/inbound
                                                              │ ack 200 immediately
                                                              ▼ (background, waitUntil)
                                                     agent runner
                                                       ├─ load conversation (Supabase)
                                                       ├─ burst debounce
                                                       ├─ Claude + tools
                                                       │    ├─ Mindbody (availability, book, cancel)
                                                       │    ├─ media library (Supabase Storage)
                                                       │    └─ WATI API (send text/file/buttons,
                                                       │         attributes, start chatbot)
                                                       └─ persist messages + events
WATI ──webhook "session message sent"──▶ POST /api/wati/agent/sent      (human takeover detection)
WATI ──webhook "conversation status"──▶ POST /api/wati/agent/status     (ticket solved → agent resumes)
```

All new server code lives under `src/lib/wati-agent/` (pure logic, testable) and
`src/app/api/wati/agent/*` (thin routes). Admin UI under `src/app/admin/wati-agent/`.

### 3.1 WATI configuration changes

1. Create a WATI user seat **"Asistente Mimosa"** (email `asistente@…`). Its
   email is `WATI_AGENT_OPERATOR_EMAIL`. All API sends are made with the
   account token; the spike (section 9, step 1) determines how those sends are
   labelled in the sent webhook.
2. The existing chatbot stops auto-triggering on new conversations and is kept
   as the **handoff flow**. Its id is `WATI_HANDOFF_CHATBOT_ID`. Shape:
   `Condition sucursal == "cde"` → Assign Team CDE → Send message → Assign User
   Citas CDE; else if `"sfc"` → same for SF; else → existing Buttons node
   asking the location (its branches already end in the assign steps).
3. Account webhooks (Settings → Webhooks) pointing to the three routes above,
   each URL carrying `?token=<WATI_AGENT_WEBHOOK_SECRET>`.
4. Contact attributes created: `sucursal` (cde/sfc), `ai_modo` (agente/humano/off),
   `ai_resumen`, `ai_motivo`.
5. New chats must be assigned to the Asistente seat so the inbox shows who owns
   them: the inbound route calls `assignOperator(email=asistente)` the first
   time it sees a conversation in agent mode.

### 3.2 Environment variables

| Name | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude |
| `WATI_AGENT_WEBHOOK_SECRET` | token in webhook URLs |
| `WATI_AGENT_OPERATOR_EMAIL` | the Asistente seat |
| `WATI_HANDOFF_CHATBOT_ID` | flow started on handoff |
| `WATI_CITAS_CDE_EMAIL`, `WATI_CITAS_SFC_EMAIL` | for admin "hand off now" without the flow (fallback) |
| `WATI_AGENT_MODE` | `off` / `shadow` / `whitelist` / `live` |
| `WATI_AGENT_WHITELIST` | comma-separated phones for whitelist mode |
| `WATI_AGENT_MODEL` | default `claude-sonnet-5` (chosen for latency/cost; overridable) |

Existing `WATI_API_URL`, `WATI_API_KEY`, Mindbody and Supabase vars are reused.

## 4. Data model (Supabase, migration `20260904_wati_agent.sql`)

```
wati_agent_conversations
  phone            text primary key          -- digits only, see wati-phone-format
  wati_contact_id  text
  ticket_id        text                      -- latest WATI ticket
  mode             text  -- 'agent' | 'human' | 'off'
  sucursal         text  -- 'cde' | 'sfc' | null
  mindbody_client_id text
  client_name      text
  summary          text                      -- rolling 2–4 line summary
  handoff_reason   text
  human_since      timestamptz
  last_inbound_at  timestamptz
  last_outbound_at timestamptz
  created_at, updated_at

wati_agent_messages
  id bigserial pk
  phone            text references conversations
  wati_message_id  text unique                -- idempotency
  direction        text  -- 'in' | 'out'
  author           text  -- 'customer' | 'camila' | 'human' | 'bot' | 'template'
  type             text  -- text | image | audio | document | interactive | ...
  text             text
  media_ref        text                      -- WATI media id / filename
  shadow           boolean default false      -- drafted but not sent
  created_at

wati_agent_events
  id bigserial pk
  phone            text
  kind             text  -- 'tool_call' | 'tool_result' | 'handoff' | 'takeover' | 'resume' | 'error' | 'llm'
  payload          jsonb
  created_at

wati_agent_media
  key              text primary key          -- e.g. 'promo_mes', 'mapa_cde', 'precios'
  description      text                      -- what the agent reads to choose it
  caption          text                      -- sent with the image
  storage_path     text                      -- Supabase Storage
  valid_from, valid_until date
  active           boolean

wati_agent_settings
  key text pk, value jsonb                   -- 'enabled', 'persona_name', 'off_hours_note', ...
```

`wati_agent_exemplars` is not a table: the curated exemplar bank ships as
`src/lib/wati-agent/voice/exemplars.json` (versioned with the code).

## 5. Conversation loop

### 5.1 Inbound route `/api/wati/agent/inbound`

1. Verify `token`. Parse the WATI payload (`waId`, `senderName`, `text`, `type`,
   `whatsappMessageId`, `ticketId`, `data`). Respond `200 {ok:true}` at once;
   continue with `waitUntil` from `@vercel/functions` (`maxDuration` 60).
2. Upsert conversation; insert message (ignore on duplicate `wati_message_id`).
3. Gate: skip processing if global mode is `off`, if conversation `mode` is
   `human`/`off`, if whitelist mode and phone not listed, or if the message is
   `owner: true`.
4. **Burst debounce**: sleep 6 s, then re-read the newest inbound id for that
   phone. If a newer message exists, stop (the later invocation replies). This
   makes "Si dos masajes / Cabina separada" one turn.
5. Run the agent turn (5.2). In `shadow` mode the outputs are stored with
   `shadow=true` and nothing is sent to WATI.
6. Human-mode resumption: if `mode='human'` and `human_since` is older than 24 h
   and the ticket is not open in WATI, flip back to `agent` before step 3.

### 5.2 Agent turn (`src/lib/wati-agent/runner.ts`)

- Build system prompt from: persona block, style guide (`voice/style-guide.md`),
  business facts (`config/business.ts`: addresses, Waze/Maps URLs, parking,
  hours, policies, payment instructions), current date/time in Panama,
  conversation summary, customer name and Mindbody history if known, current
  active media keys with descriptions, and exemplars for the detected intent.
- Intent detection is a cheap first Claude call (or the same call's first tool)
  returning one of: `saludo, ubicacion, horario, precios, promo, reservar,
  cambiar, cancelar, certificado, pago, queja, otro`. Its only job is to pick
  exemplars (≤ 12) from the bank.
- Messages: last 48 h of this chat (customer, camila, human, bot lines all
  included so Camila knows what the human said), capped at 60 messages.
- Tool loop, max 8 rounds. Final assistant text is split into bubbles on the
  `---` marker the prompt asks Camila to use; bubbles are sent 1.5–3 s apart.
  Max 3 bubbles per turn.
- After the turn, a rolling summary is refreshed every 6 turns or on handoff.
- Any exception → event `error`, then `handoff(motivo='error_sistema')` with a
  generic apology bubble. Never leave the customer without a reply.

### 5.3 Prompt rules (enforced in the system prompt, verified by evals)

- Greeting exactly in the receptionists' shape, e.g. "✨ Muy buenos días,
  bienvenido a Mimosa Spa Retreat. Mi nombre es Camila 🌼 ¿Cómo podemos
  ayudarle?" with the time-of-day greeting correct for Panama.
- Formal `usted`, "Sra/Sr + nombre" once the name is known, short lines, the
  emojis they use (🌼 ✨ 🍃 📅 ⏰ ✅), never long paragraphs, never bullet lists
  except the ✅ confirmation card and the data request card.
- Prices, durations and promos only from tool results or media captions.
- Ask one thing at a time. Collect **nombre y apellido + correo** before booking,
  using the "📌 Nombre y Apellido: / 📌 Correo electrónico:" card.
- Before any booking/change, send a summary and wait for a clear yes.
- Off-hours (outside Lun–Vie 9–20, Sab–Dom 9–18): Camila still answers, but a
  handoff message says a colleague will follow up when the spa opens.
- If asked "¿eres un bot / una máquina?": answer honestly in one line, warm, and
  hand off.

## 6. Tools

| Tool | Backed by | Notes |
|---|---|---|
| `get_location_info(sucursal)` | `config/business.ts` | address, Waze + Google Maps links, parking, landmarks, hours |
| `get_hours(sucursal, date?)` | config + holiday list | |
| `list_services(sucursal, query?)` | Mindbody `getAllServices` cached 6 h in memory/Supabase | name, minutes, price, category, couples-capable |
| `send_image(key)` | `wati_agent_media` + `sendSessionFile` | agent sees `key` + description; only active + in-date assets are offered |
| `send_buttons(body, buttons[])` | `sendInteractiveButtonsMessage` | for yes/no confirmations and location choice |
| `find_client()` | Mindbody `searchClients` by phone; `getClientSchedule`, `getClientVisits` | fills name, history ("la última vez fue Liberador de tensión") |
| `create_client(first, last, email)` | `addClient` | |
| `check_availability(sucursal, date, service_ids[], people)` | `getStaffWithAvailability` / `getBookableItems` | `people=2` requires two overlapping slots; returns ≤ 6 slots |
| `book(sucursal, date, time, items[], client_id, customer_confirmation)` | `addAppointment` / `addMultipleAppointments`, then `sendBookingConfirmation` | `customer_confirmation` must quote the customer's yes; the tool rejects otherwise |
| `list_my_appointments()` | `getClientSchedule` | |
| `reschedule(appointment_id, date, time, customer_confirmation)` / `cancel(appointment_id, customer_confirmation)` | remove + add / remove | refuses inside 24 h → agent hands off |
| `handoff(motivo, resumen)` | attributes + `chatbots/start` | see section 7 |
| `close_chat()` | `updateChatStatus SOLVED` | after the "Ha sido un placer atenderle…" closing |
| `note_to_self(text)` | conversation summary | persists facts like "prefiere cabina separada" |

Inbound media: images/documents from the customer → automatic handoff
(`motivo='comprobante_o_imagen'`). Audio: first one gets "¿Me lo puede escribir
por favor? 🌼"; a second audio → handoff (`motivo='audio'`).

Handoff triggers coded outside the model (deterministic): customer media,
second audio, Mindbody/tool error, keyword hits for gift certificates
(`certificado|gift card|regalo`), complaint words, 3+ people, and any message
while `mode='human'` is simply stored.

## 7. Handoff and takeover

**Handoff (`handoff` tool):**
1. Camila sends "Un momento por favor, le comunico con mi compañera 🌼" (varied
   by exemplars).
2. `updateContactAttributes`: `sucursal`, `ai_modo=humano`, `ai_resumen`
   (≤ 300 chars, Spanish, what the customer wants + what was already collected),
   `ai_motivo`.
3. `POST /api/ext/v3/chatbots/start {chatbot_id: WATI_HANDOFF_CHATBOT_ID, target: phone}`.
   If it fails, fallback: `assignOperator(email=Citas X)` directly (or ask
   location with buttons if unknown) and send the intro text ourselves.
4. Conversation `mode='human'`, `human_since=now`, event `handoff`.

**Takeover (`/api/wati/agent/sent` webhook):** if `owner=true` and the operator
is not the Asistente seat and not the account-API label discovered in the
spike, set `mode='human'`, event `takeover`. Camila never writes into a chat a
human is working.

**Resume:** `/api/wati/agent/status` webhook with ticket `SOLVED` → `mode='agent'`,
event `resume`. Safety net: 24 h after `human_since` with no human message.

**Kill switches:** `wati_agent_settings.enabled=false` (admin toggle) and
`WATI_AGENT_MODE=off` stop all sends; contact attribute `ai_modo=off` (set by a
receptionist in WATI) permanently excludes a customer.

## 8. Voice pipeline

`scripts/wati-agent/mine-chats.ts` (run with `node --env-file=.env.local`):

1. Parse the export (`[MM/DD/YYYY HH:MM:SS] Sender: text`, multi-line bodies).
   Drop `Bot:` lines, `Template "…" was sent.` lines, OTP chats, media-only lines.
2. Build exchanges: each run of consecutive receptionist lines with the 1–4
   preceding customer lines and the location (from sender). Group near-identical
   texts (normalised) to count canned phrases.
3. Claude batch job tags each exchange with intent + quality flag (good / avoid
   / contains-error) and extracts phrase statistics.
4. Outputs:
   - `src/lib/wati-agent/voice/style-guide.md`: greetings by time of day,
     closings, forms of address, data-request card, ✅ card, payment block,
     emoji usage, sentence length, bubble rhythm, what they never say, common
     mistakes to avoid. **Reviewed by the owner before launch.**
   - `src/lib/wati-agent/voice/exemplars.json`: ~200 exchanges tagged
     `{intent, sucursal, customer, staff[]}`; PII scrubbed (names → `{nombre}`,
     emails/phones removed).
   - `scripts/wati-agent/evals/cases.json`: ~30 real conversations replayed
     turn by turn; `scripts/wati-agent/evals/run.ts` scores Camila's reply
     against the human's on tone (Claude-graded 1–5) and hard checks (no
     invented price, asked for name/email before booking, handoff when
     required). Run before any prompt or exemplar change.

Media library seeded manually by the owner through the admin page: promo of
the month (`promo_mes`), price lists (`precios_cde`, `precios_sfc`), location
maps, gift certificate sample.

## 9. Rollout

1. **Spike (½ day):** create the Asistente seat; point webhooks at a preview
   deploy; send one API message and one inbox message; record how each appears
   in the sent webhook; test `chatbots/start` on a test phone. Result decides
   the takeover rule in 7 and is written into `docs/WATI_AGENT.md`.
2. **Shadow (3–5 days):** `WATI_AGENT_MODE=shadow`. Camila drafts for every chat;
   admin page shows draft vs. human reply side by side.
3. **Whitelist:** owner + partners' phones live.
4. **Live:** everyone. Receptionists keep the inbox open the first week; handoff
   reasons reviewed daily in the admin page; style guide and exemplars adjusted.

## 10. Admin page `/admin/wati-agent`

- Conversations list: phone/name, mode, sucursal, last message, last activity;
  filters by mode; open transcript with tool calls and events inline.
- Per-chat actions: "Pausar Camila" (mode=off), "Pasar a humano" (runs handoff),
  "Reanudar".
- Media library: upload/replace, description, caption, validity, active.
- Settings: enabled, persona name, off-hours note.
- Daily stats: chats handled, bookings made, handoffs by motivo, shadow
  agreement rate.
- Auth: same as existing `/admin` pages.

## 11. Testing

- Unit: export parser, burst debounce decision, bubble splitter, handoff
  trigger rules, tool input validation (`customer_confirmation` required),
  availability pairing for couples, 24 h policy check.
- Integration (mocked WATI + Mindbody): full inbound → reply, handoff path,
  takeover path, resume path, shadow mode stores but doesn't send, idempotent
  duplicate webhook.
- Evals: section 8, run manually and in CI on changes under `src/lib/wati-agent/voice/`.

## 12. Out of scope (v1)

Voice-note transcription, gift certificate sales, payments, Instagram
channel, WATI "Connect AI Agents" add-on, multi-language beyond Spanish
(English replies allowed when the customer writes in English, same persona).

## 13. Open items

- Whether API sends appear with the Asistente email or blank in the sent
  webhook (spike).
- Exact `chatbot_id` and confirmation that `chatbots/start` runs on a chat
  currently assigned to an operator.
- Owner to review the style guide and seed the media library before shadow mode.
