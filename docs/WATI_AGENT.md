# Camila 🌼 — WATI AI receptionist

Camila answers every inbound WhatsApp chat first, in the voice of the real
receptionists, and hands off to the human team the moment anything is
outside her lane. Design doc:
`docs/superpowers/specs/2026-09-04-wati-ai-receptionist-design.md`.

## Antes de activar (checklist del dueño)

- [ ] Correr la migración `supabase/migrations/20260904_wati_agent.sql` en el
      SQL editor de Supabase (proyecto `aoqbaxfynmlcxwrnaeyo`).
- [ ] Agregar las variables de entorno en Vercel (Production **y** Preview) —
      tabla completa en la sección 2 más abajo, incluyendo `WATI_CHANNEL_PHONE`
      (el número de WhatsApp del negocio, solo dígitos) y `ANTHROPIC_API_KEY`.
- [ ] Crear el usuario WATI **"Asistente Mimosa"** (Settings → Team members).
- [ ] Configurar los tres webhooks (Settings → Webhooks) — sección 3.3.
- [ ] Crear los atributos de contacto `sucursal`, `ai_modo`, `ai_resumen`,
      `ai_motivo` (Contacts → Attributes).
- [ ] Convertir el chatbot existente en el flujo de handoff y copiar su id en
      `WATI_HANDOFF_CHATBOT_ID` — sección 3.3.
- [ ] Subir las imágenes en `/admin/wati-agent` con las llaves `promo_mes`,
      `precios_cde`, `precios_sfc`, `mapa_cde`, `mapa_sfc`.

Ninguno de estos pasos activa a Camila por sí solo — mientras
`WATI_AGENT_MODE=off` (el valor por defecto) ella nunca envía nada. Ver la
sección 6 (spike) antes de pasar a `shadow`.

## 1. Qué hace / qué NO hace Camila

Responde siempre (24/7), desde el primer mensaje, en todos los chats.

**Hace por su cuenta:**
- Información: ubicación, horarios, precios, promociones, servicios.
- Reservas, cambios de fecha/hora y cancelaciones en Mindbody.
- Pide nombre y apellido + correo antes de reservar, y confirma con la
  clienta antes de tocar Mindbody.

**Entrega a un humano de inmediato:**
- Venta o canje de certificados de regalo.
- Quejas, reembolsos, comprobantes de pago o cualquier imagen/documento
  enviado por la clienta.
- Grupos de 3 o más personas.
- Pedido de una terapeuta específica.
- Preguntas médicas (embarazo, lesiones, cirugías, etc.).
- Un segundo audio seguido (el primero recibe "¿Me lo puede escribir por
  favor?").
- Si le preguntan directamente si es un bot: lo admite en una línea, cálida,
  y entrega la conversación.
- Cualquier error técnico o de Mindbody.

## Cómo funciona

```
clienta ──WhatsApp──▶ WATI ──webhook "message received"──▶ /api/wati/agent/inbound
                                                             │ responde 200 al instante
                                                             ▼ (en segundo plano)
                                                     turno del agente
                                                       ├─ debounce de ráfaga (6 s)
                                                       ├─ Claude + herramientas
                                                       │    ├─ Mindbody (disponibilidad, reservar, cancelar)
                                                       │    ├─ biblioteca de imágenes
                                                       │    └─ API de WATI (texto/imagen/botones,
                                                       │         atributos, iniciar chatbot)
                                                       └─ guarda mensajes y eventos

WATI ──webhook "session message sent"──▶ /api/wati/agent/sent     (detecta si un humano tomó el chat)
WATI ──webhook "conversation status"───▶ /api/wati/agent/status   (ticket resuelto → Camila retoma)
```

Código: `src/lib/wati-agent/` (lógica), `src/app/api/wati/agent/{inbound,sent,status}`
(rutas), `src/app/admin/wati-agent` (panel).

## 2. Variables de entorno

| Variable | Para qué sirve |
|---|---|
| `ANTHROPIC_API_KEY` | Llamadas a Claude |
| `WATI_AGENT_WEBHOOK_SECRET` | Token `?token=` que llevan las tres URLs de webhook (`openssl rand -hex 24`) |
| `WATI_AGENT_OPERATOR_EMAIL` | Email del seat "Asistente Mimosa" |
| `WATI_HANDOFF_CHATBOT_ID` | Id del flujo que se inicia al entregar a un humano |
| `WATI_CITAS_CDE_EMAIL` | Email de "Citas Costa del Este", fallback si el flujo falla |
| `WATI_CITAS_SFC_EMAIL` | Email de "Citas San Francisco", fallback si el flujo falla |
| `WATI_CHANNEL_PHONE` | Número de WhatsApp del negocio, solo dígitos |
| `WATI_AGENT_MODE` | `off` / `shadow` / `whitelist` / `live` |
| `WATI_AGENT_WHITELIST` | Teléfonos separados por coma, solo se usa en modo `whitelist`. Se normalizan igual que los entrantes: se aceptan números de 8 dígitos (`6612-4546`), a los que se les antepone `507` |
| `WATI_AGENT_MODEL` | Por defecto `claude-sonnet-5` |

Reutiliza `WATI_API_URL`, `WATI_ACCESS_TOKEN`/`WATI_API_KEY`, y las variables
existentes de Mindbody y Supabase (`src/lib/wati-agent/config/env.ts`).

Agregar todas en Vercel → Production y Preview, y en `.env.local` para
desarrollo local. `.env.example` en la raíz del repo lista los nombres (sin
valores).

## 3. Configuración en WATI, paso a paso

### 3.1 Usuario "Asistente Mimosa"

Settings → Team members → crear usuario con email tipo `asistente@…`. Copiar
ese email a `WATI_AGENT_OPERATOR_EMAIL`. Todos los envíos por API se hacen
con el token de la cuenta — el spike (sección 6) determina si esos envíos
quedan etiquetados con este email o en blanco en el webhook "sent".

### 3.2 Atributos de contacto

Contacts → Attributes → crear: `sucursal` (cde/sfc), `ai_modo`
(agente/humano/off), `ai_resumen`, `ai_motivo`.

### 3.3 Webhooks

Settings → Webhooks. **Antes de nada**: WATI Pro lista "limited webhooks" —
confirmar primero que la sección existe y qué eventos están disponibles en
el plan actual.

Agregar tres endpoints (usar siempre `www.` — el dominio pelado hace un 302
que WATI no sigue):

| Evento | URL |
|---|---|
| Messages received | `https://www.mimosaretreat.com/api/wati/agent/inbound?token=<WATI_AGENT_WEBHOOK_SECRET>` |
| Messages sent (session) | `https://www.mimosaretreat.com/api/wati/agent/sent?token=<WATI_AGENT_WEBHOOK_SECRET>` |
| Conversation status update | `https://www.mimosaretreat.com/api/wati/agent/status?token=<WATI_AGENT_WEBHOOK_SECRET>` |

### 3.4 Chatbot → flujo de handoff

Abrir el chatbot que hoy pregunta la sucursal (Buttons → Assign Team →
mensaje → Assign User Citas CDE/SF):

1. Quitar su palabra clave de arranque ("new conversation") para que nunca
   se dispare solo — Camila lo inicia por API.
2. Insertar un nodo **Condition** sobre `{{sucursal}}` antes del nodo
   Buttons: `cde` → rama CDE (Assign Team CDE → mensaje → Assign User Citas
   CDE), `sfc` → rama SF (misma forma), cualquier otro valor → el flujo de
   Buttons existente (pregunta la sucursal).
3. Copiar el id del chatbot desde la URL del editor de flujos en
   `WATI_HANDOFF_CHATBOT_ID`.

## 4. Kill switches

Dos formas de detener todo de inmediato, sin tocar código:

1. Panel `/admin/wati-agent` → Settings → apagar **enabled**.
2. Vercel env `WATI_AGENT_MODE=off` (redeploy o edge config, según cómo esté
   servida la variable).

Por chat: en el panel `/admin/wati-agent`, el botón **Pausar** de la
conversación pone su `mode` en `off` en `wati_agent_conversations`, y la
puerta de entrada (`gate()`) deja de responder ese chat. No existe ningún
atributo de contacto en WATI que pause a Camila: el agente nunca lee los
atributos de contacto de vuelta.

## 5. Spike (hacer antes de pasar a shadow)

Con `WATI_AGENT_MODE=off` desplegado en una URL preview y los tres webhooks
apuntando ahí:

1. **Confirmar que existen webhooks en el plan.** Settings → Webhooks — si
   la sección no aparece o los eventos necesarios no están, resolver esto
   antes de seguir.
2. Enviar un WhatsApp desde un teléfono de prueba y confirmar que aparece
   una fila en `wati_agent_messages`.
3. Responder desde el inbox de WATI como "Citas Costa del Este" y confirmar
   que el webhook "sent" trae `operatorEmail` igual al de esa usuaria.
4. Enviar un mensaje por API (no por el inbox) y anotar cómo llega
   `operatorEmail` en el webhook "sent":

   ```bash
   curl -X POST "$WATI_API_URL/api/ext/v3/conversations/messages/text" \
     -H "Authorization: Bearer $WATI_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"target": "<telefono>", "text": "prueba"}'
   ```

   Registrar el valor de `operatorEmail` que trae el webhook "sent" para ese
   envío (puede venir en blanco, o con el email del seat de la cuenta) en
   Ajustes → `api_operator_labels` (panel `/admin/wati-agent` o directo en
   `wati_agent_settings`). Esa lista es la que `isHumanOperator()`
   (`src/lib/wati-agent/webhook.ts`) usa para no confundir un envío propio
   con una toma de control humana.
5. Llamar `chatbots/start` para el teléfono de prueba y confirmar que el
   flujo corre incluso en un chat ya asignado a una operadora.
6. Marcar el ticket como `SOLVED` y revisar el payload del webhook de
   status: si el campo no se llama `ticketStatus`, ajustar
   `src/app/api/wati/agent/status/route.ts` (hoy también acepta `status` /
   `statusString` como alternativa).

## 6. Evals

`scripts/wati-agent/evals/run.ts` reproduce ~30 conversaciones reales turno
por turno y compara la respuesta de Camila con la de la receptionista
(calificación de tono 1–5 por Claude, más chequeos duros: no inventar
precios, pedir nombre/correo antes de reservar, entregar cuando corresponde).

```bash
npm run wati:evals
```

Los números de la última corrida quedan en
`scripts/wati-agent/evals/last-run.json` — revisar ese archivo (no
números fijos en este doc) antes de subir el modo de rollout, y volver a
correr el comando después de cualquier cambio en
`src/lib/wati-agent/voice/`.

## 7. Rollout

`WATI_AGENT_MODE`: `off` → `shadow` → `whitelist` → `live`.

1. **`off`** (estado inicial). Nada se envía. Usar para el spike.
2. **`shadow`** (3–5 días). Camila redacta una respuesta para cada chat pero
   no la envía — se guarda con `shadow=true`. En `/admin/wati-agent` revisar
   el transcript de cada conversación: el borrador de Camila junto a lo que
   respondió la receptionista real, y ajustar `style-guide.md` /
   `exemplars.json` según lo que falle.
3. **`whitelist`**. Cargar los teléfonos del dueño y los socios en
   `WATI_AGENT_WHITELIST` (se aceptan de 8 dígitos, con o sin guiones).
   Solo esos chats reciben respuestas reales de
   Camila; el resto sigue en shadow/off según `WATI_AGENT_MODE`. Revisar en
   el panel que las reservas y handoffs de esos chats sean correctos.
4. **`live`**. Todos los chats. La primera semana mantener el inbox de WATI
   abierto, revisar diariamente los motivos de handoff (`ai_motivo` /
   eventos `handoff` en el panel) y la tasa de acuerdo con shadow antes de
   confiar el canal por completo.

En cualquier paso, usar los kill switches de la sección 4 si algo se ve mal.
