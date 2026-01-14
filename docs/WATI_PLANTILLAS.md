# Plantillas WATI para Mimosa Spa Retreat

## Guías de Mensajes Utility (WhatsApp)

Las plantillas tipo UTILITY deben cumplir con estas reglas para ser aprobadas:

| ✅ Permitido | ❌ No Permitido |
|-------------|-----------------|
| Confirmaciones de transacciones | Lenguaje promocional/marketing |
| Recordatorios de citas | Frases como "¡Te esperamos!" |
| Emojis informativos (📍📅🕐) | Firmas de marca |
| Información esencial | URLs no relacionadas con la acción |
| Lenguaje informativo | Exclamaciones excesivas |

---

## Configuración en WATI Dashboard

1. Ir a **WATI Dashboard** → **Broadcast** → **Templates**
2. Click **New Template**
3. Configurar según las plantillas abajo

---

## Plantilla 1: `confirmacion_reserva`

### Configuración

| Campo | Valor |
|-------|-------|
| **Template Name** | `confirmacion_reserva` |
| **Category** | `UTILITY` |
| **Language** | `Spanish (es)` |

### Mensaje

```
Hola {{1}}, tu cita ha sido confirmada.

📍 Ubicación: {{2}}
📅 Fecha: {{3}}
🕐 Hora: {{4}}
⏱️ Duración: {{5}}
👤 Terapeuta: {{6}}
💆 Servicios: {{7}}

Llega 10 minutos antes de tu cita. Para cancelar o modificar, contáctanos con 24 horas de anticipación.
```

### Variables

| # | Nombre en WATI | Descripción |
|---|----------------|-------------|
| 1 | `nombre_cliente` | Nombre del cliente |
| 2 | `ubicacion` | Ubicación del spa |
| 3 | `fecha` | Fecha de la cita |
| 4 | `hora` | Hora de la cita |
| 5 | `duracion` | Duración total |
| 6 | `terapeuta` | Nombre del terapeuta |
| 7 | `servicios` | Lista de servicios (separados por coma) |

### Ejemplo de Mensaje Final

```
Hola María García, tu cita ha sido confirmada.

📍 Ubicación: Costa del Este
📅 Fecha: Lunes, 15 de Enero 2026
🕐 Hora: 10:00 AM
⏱️ Duración: 90 minutos
👤 Terapeuta: Ana López
💆 Servicios: Masaje Relajante, Facial Hidratante

Llega 10 minutos antes de tu cita. Para cancelar o modificar, contáctanos con 24 horas de anticipación.
```

---

## Plantilla 2: `recordatorio_cita` (Con Botones)

### Configuración

| Campo | Valor |
|-------|-------|
| **Template Name** | `recordatorio_cita` |
| **Category** | `UTILITY` |
| **Language** | `Spanish (es)` |

### Mensaje (Body)

```
Hola {{1}}, te recordamos tu cita de mañana.

📍 Ubicación: {{2}}
📅 Fecha: {{3}}
🕐 Hora: {{4}}

Llega 10 minutos antes. Si necesitas cancelar, avísanos lo antes posible.
```

### Botones (Call to Action - URL)

| Botón | Texto | Tipo | URL |
|-------|-------|------|-----|
| 1 | Confirmar asistencia | URL | `https://mimosaretreat.com/api/cita/confirmar?id={{5}}` |
| 2 | Cancelar cita | URL | `https://mimosaretreat.com/api/cita/cancelar?id={{5}}` |

### Variables

| # | Nombre en WATI | Descripción |
|---|----------------|-------------|
| 1 | `nombre_cliente` | Nombre del cliente |
| 2 | `ubicacion` | Ubicación del spa |
| 3 | `fecha` | Fecha de la cita |
| 4 | `hora` | Hora de la cita |
| 5 | `id_cita` | ID de la cita en Mindbody (para los botones) |

### Configuración de Botones en WATI

1. Al crear la plantilla, seleccionar **"Add Button"**
2. Tipo de botón: **"Call to Action"** → **"Visit Website"**
3. Para cada botón:
   - **Button Text:** El texto del botón (sin emojis)
   - **URL Type:** **Dynamic**
   - **Website URL:** La URL base con `{{5}}` como variable
   
### Ejemplo de Mensaje con Botones

```
Hola María García, te recordamos tu cita de mañana.

📍 Ubicación: Costa del Este
📅 Fecha: Martes, 16 de Enero 2026
🕐 Hora: 10:00 AM

Llega 10 minutos antes. Si necesitas cancelar, avísanos lo antes posible.

[Confirmar asistencia]  [Cancelar cita]
```

### Flujo de los Botones

```
Cliente recibe recordatorio
         ↓
    Toca "Confirmar asistencia"
         ↓
Abre: mimosaretreat.com/api/cita/confirmar?id=12345
         ↓
    Actualiza Mindbody
         ↓
Muestra página de confirmación exitosa
```

### ¿Cómo Mindbody identifica la cita?

Cuando se crea una cita en Mindbody, el sistema genera un **AppointmentId** único (ej: `12345`). Este ID:

1. Es único globalmente en todo Mindbody (no solo en tu sitio)
2. Identifica exactamente esa cita específica
3. Contiene internamente la referencia al sitio, cliente, servicio, etc.

**Flujo técnico:**

```
1. Cliente reserva cita → Mindbody crea AppointmentId: 12345

2. Sistema envía recordatorio con URL:
   mimosaretreat.com/api/cita/confirmar?id=12345

3. Cliente toca botón → API recibe id=12345

4. API llama a Mindbody:
   POST /appointment/updateappointment
   { AppointmentId: 12345, Notes: "Confirmado vía WhatsApp" }

5. Mindbody busca AppointmentId 12345 → Actualiza ESA cita específica
```

**Nota:** El Site ID (-41931) ya está configurado en las credenciales del servidor (API Key + Site ID), por lo que Mindbody sabe que la solicitud viene de Mimosa Spa.

---

## Notas Importantes

### Aprobación de WhatsApp
- Las plantillas deben ser aprobadas por WhatsApp antes de poder usarse
- Tiempo de aprobación: 24-48 horas típicamente
- Categoría `UTILITY` tiene mayor tasa de aprobación
- Mantener lenguaje neutro e informativo

### Formato de Teléfono
- El sistema envía números en formato: `507XXXXXXXX`
- Sin signo `+` al inicio
- Código de país Panama: `507`

### Notas sobre Variables
- La variable `{{6}}` (terapeuta) siempre contendrá el nombre del terapeuta asignado
- La variable `{{7}}` (servicios) contiene los tratamientos separados por coma en una sola línea

---

## Credenciales WATI

| Variable | Valor |
|----------|-------|
| `WATI_API_URL` | `https://live-mt-server.wati.io` |
| `WATI_ACCESS_TOKEN` | *(Configurado en Vercel)* |

---

## Soporte

Para problemas con las plantillas WATI:
- Dashboard: https://app.wati.io
- Documentación: https://docs.wati.io
