// ===========================================
// WATI API UTILITY
// Server-side only - handles WhatsApp notifications
// ===========================================

// v1 API uses the full URL including account ID (e.g. https://live-mt-server.wati.io/1036696)
const WATI_API_URL = process.env.WATI_API_URL || 'https://live-mt-server.wati.io'
const WATI_ACCESS_TOKEN = process.env.WATI_ACCESS_TOKEN || process.env.WATI_API_KEY

// ===========================================
// TYPES
// ===========================================

interface WatiResponse {
  result: boolean
  info?: string
  error?: string
}

interface BookingConfirmationData {
  clientName: string
  clientPhone: string
  locationName: string
  date: string // "Lunes, 15 de Enero 2026"
  time: string // "10:00 AM"
  services: string[] // Array of service names
  // Minutes; couples visits pass a joined string like "60 y 90"
  totalDuration: number | string
  therapistName: string
}

interface ReminderData {
  clientName: string
  clientPhone: string
  locationName: string
  date: string
  time: string
  appointmentId: string
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function formatPhoneForWati(phone: string): string {
  let cleaned = phone.replace(/\D/g, '')

  // Add Panama country code if missing
  if (!cleaned.startsWith('507') && cleaned.length === 8) {
    cleaned = '507' + cleaned
  }

  return cleaned
}

// ===========================================
// API REQUEST HELPER
// POST /api/v1/sendTemplateMessage?whatsappNumber=PHONE
// ===========================================

async function sendTemplate(
  phone: string,
  templateName: string,
  parameters: Array<{ name: string; value: string }>
): Promise<WatiResponse> {
  if (!WATI_ACCESS_TOKEN) {
    console.warn('WATI_ACCESS_TOKEN not configured')
    return { result: false, error: 'WATI not configured' }
  }

  const formattedPhone = formatPhoneForWati(phone)
  const url = `${WATI_API_URL}/api/v1/sendTemplateMessage?whatsappNumber=${formattedPhone}`
  const body = {
    template_name: templateName,
    broadcast_name: templateName,
    parameters,
  }

  try {
    console.log('WATI request:', url, JSON.stringify(body))

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WATI_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`WATI API error: ${response.status}`, errorText)
      return { result: false, error: `HTTP ${response.status}: ${errorText}` }
    }

    const responseData = await response.json()
    console.log('WATI response:', JSON.stringify(responseData))
    return responseData
  } catch (error) {
    console.error('WATI API request failed:', error)
    return { result: false, error: String(error) }
  }
}

// ===========================================
// SEND TEMPLATE MESSAGE (generic)
// ===========================================

export async function sendTemplateMessage(
  phone: string,
  templateName: string,
  parameters: Array<{ name: string; value: string }>
): Promise<WatiResponse> {
  return sendTemplate(phone, templateName, parameters)
}

// Template: "Mimosa {{2}}" — strip the "Mimosa " prefix from location names
function stripMimosaPrefix(locationName: string): string {
  return locationName.replace(/^Mimosa\s+/i, '').trim() || locationName
}

// ===========================================
// BOOKING CONFIRMATION NOTIFICATION
// Template: confirmacion_cita
// {{1}} nombre, {{2}} ubicacion, {{3}} fecha, {{4}} hora,
// {{5}} duracion, {{6}} terapeuta, {{7}} servicios
// ===========================================

export async function sendBookingConfirmation(
  data: BookingConfirmationData
): Promise<WatiResponse> {
  return sendTemplate(data.clientPhone, 'confirmacion_cita2', [
    { name: '1', value: data.clientName },
    { name: '2', value: stripMimosaPrefix(data.locationName) },
    { name: '3', value: data.date },
    { name: '4', value: data.time },
    { name: '5', value: `${data.totalDuration} min` },
    { name: '6', value: data.therapistName },
    { name: '7', value: data.services.join(', ') },
  ])
}

// ===========================================
// BOOKING CHANGE NOTIFICATION
// Template: cambio_cita
// {{1}} nombre, {{2}} ubicacion, {{3}} fecha, {{4}} hora,
// {{5}} duracion, {{6}} terapeuta, {{7}} servicios
// ===========================================

export async function sendBookingChange(
  data: BookingConfirmationData
): Promise<WatiResponse> {
  return sendTemplate(data.clientPhone, 'cambio_cita', [
    { name: '1', value: data.clientName },
    { name: '2', value: stripMimosaPrefix(data.locationName) },
    { name: '3', value: data.date },
    { name: '4', value: data.time },
    { name: '5', value: `${data.totalDuration} min` },
    { name: '6', value: data.therapistName },
    { name: '7', value: data.services.join(', ') },
  ])
}

// ===========================================
// BOOKING CANCELLATION NOTIFICATION
// Template: cancelacion_cita
// {{1}} nombre, {{2}} ubicacion, {{3}} fecha, {{4}} hora.
// The reagendar link is STATIC in the template body
// (https://www.mimosaretreat.com/es/reservar) — 4 variables only.
// Sent when a confirmed online booking is cancelled in Mindbody (front
// desk/phone) so the customer hears it from us, not silence.
// ===========================================

export async function sendBookingCancellation(data: {
  clientName: string
  clientPhone: string
  locationName: string
  date: string
  time: string
  /** Kept for the email fallback's deep link; unused by the WATI template */
  serviceId?: number
}): Promise<WatiResponse> {
  return sendTemplate(data.clientPhone, 'cancelacion_cita', [
    { name: '1', value: data.clientName },
    { name: '2', value: stripMimosaPrefix(data.locationName) },
    { name: '3', value: data.date },
    { name: '4', value: data.time },
  ])
}

// ===========================================
// BOOKING REMINDER NOTIFICATION (24h before)
// Template: recordatorio_cita
// {{1}} nombre, {{2}} ubicacion, {{3}} fecha, {{4}} hora
// URL buttons use appointmentId
// ===========================================

export async function sendBookingReminder(
  data: ReminderData
): Promise<WatiResponse> {
  return sendTemplate(data.clientPhone, 'recordatorio_cita4', [
    { name: '1', value: data.clientName },
    { name: '2', value: stripMimosaPrefix(data.locationName) },
    { name: '3', value: data.date },
    { name: '4', value: data.time },
    { name: '5', value: data.appointmentId },
  ])
}

// ===========================================
// LIFECYCLE MESSAGES (MARKETING templates — must be created + approved in WATI)
// House rule: no variables at the end of the body; URLs static in the body.
// ===========================================

// Template: bienvenida_mimosa2 — {{1}} nombre
export async function sendWelcome(data: {
  clientName: string
  clientPhone: string
}): Promise<WatiResponse> {
  return sendTemplate(data.clientPhone, 'bienvenida_mimosa2', [
    { name: '1', value: data.clientName },
  ])
}

// Template: gracias_primera_visita — {{1}} nombre, {{2}} link de reseña Google
// (per-location; the variable sits mid-body, text follows it)
export async function sendFirstVisitThanks(data: {
  clientName: string
  clientPhone: string
  reviewUrl: string
}): Promise<WatiResponse> {
  return sendTemplate(data.clientPhone, 'gracias_primera_visita', [
    { name: '1', value: data.clientName },
    { name: '2', value: data.reviewUrl },
  ])
}

// Template: cumpleanos_mimosa — {{1}} nombre
export async function sendBirthday(data: {
  clientName: string
  clientPhone: string
}): Promise<WatiResponse> {
  return sendTemplate(data.clientPhone, 'cumpleanos_mimosa', [
    { name: '1', value: data.clientName },
  ])
}

// ===========================================
// WHATSAPP OTP CODE (6-digit code verification)
// ===========================================

/**
 * Sends a 6-digit OTP code via WhatsApp using the codigo_verificacion template.
 *
 * Template: codigo_verificacion (Authentication category, Spanish)
 * Body (fixed by Meta): "Tu código de verificación es {{1}} Por tu seguridad, no lo compartas."
 * Footer (fixed): "Este código caduca en 10 minutos."
 */
export async function sendOtpCode(
  phone: string,
  otpCode: string
): Promise<WatiResponse> {
  return sendTemplate(phone, 'codigo_verificacion', [{ name: '1', value: otpCode }])
}

// ===========================================
// PHONE VERIFICATION VIA WHATSAPP (link-based)
// ===========================================

interface VerificationData {
  clientName: string
  clientPhone: string
  verificationUrl: string
}

export async function sendPhoneVerification(
  data: VerificationData
): Promise<WatiResponse> {
  return sendTemplate(data.clientPhone, 'verificacion_telefono', [{ name: '1', value: data.clientName }])
}

// ===========================================
// CHECK IF WATI IS CONFIGURED
// ===========================================

export function isWatiConfigured(): boolean {
  return Boolean(WATI_ACCESS_TOKEN)
}
