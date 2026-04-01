// ===========================================
// WATI API UTILITY
// Server-side only - handles WhatsApp notifications
// ===========================================

const WATI_ACCESS_TOKEN = process.env.WATI_ACCESS_TOKEN || process.env.WATI_API_KEY
const WATI_BASE_URL = process.env.WATI_API_URL
  ? new URL(process.env.WATI_API_URL).origin
  : 'https://live-mt-server.wati.io'

const V3_ENDPOINT = '/api/ext/v3/messageTemplates/send'

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
  totalDuration: number // minutes
  therapistName: string
}

interface ReminderData {
  clientName: string
  clientPhone: string
  locationName: string
  date: string
  time: string
  appointmentId: string // Mindbody appointment ID for confirm/cancel URLs
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
// ===========================================

async function watiRequest(
  body: Record<string, unknown>
): Promise<WatiResponse> {
  if (!WATI_ACCESS_TOKEN) {
    console.warn('WATI_ACCESS_TOKEN not configured')
    return { result: false, error: 'WATI not configured' }
  }

  const fullUrl = `${WATI_BASE_URL}${V3_ENDPOINT}`

  try {
    console.log('WATI request:', fullUrl, JSON.stringify(body))

    const response = await fetch(fullUrl, {
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

    return await response.json()
  } catch (error) {
    console.error('WATI API request failed:', error)
    return { result: false, error: String(error) }
  }
}

function buildRequest(
  templateName: string,
  phone: string,
  parameters: Array<{ name: string; value: string }>
): Record<string, unknown> {
  return {
    template_name: templateName,
    broadcast_name: templateName,
    recipients: [{ phone_number: formatPhoneForWati(phone), customParams: parameters }],
  }
}

// ===========================================
// SEND TEMPLATE MESSAGE
// ===========================================

export async function sendTemplateMessage(
  phone: string,
  templateName: string,
  parameters: Array<{ name: string; value: string }>
): Promise<WatiResponse> {
  return watiRequest(buildRequest(templateName, phone, parameters))
}

// ===========================================
// BOOKING CONFIRMATION NOTIFICATION
// ===========================================

export async function sendBookingConfirmation(
  data: BookingConfirmationData
): Promise<WatiResponse> {
  const parameters = [
    { name: 'nombre_cliente', value: data.clientName },
    { name: 'ubicacion', value: data.locationName },
    { name: 'fecha', value: data.date },
    { name: 'hora', value: data.time },
    { name: 'duracion', value: `${data.totalDuration} minutos` },
    { name: 'terapeuta', value: data.therapistName },
    { name: 'servicios', value: data.services.join(', ') },
  ]

  return watiRequest(buildRequest('confirmacion_reserva', data.clientPhone, parameters))
}

// ===========================================
// BOOKING REMINDER NOTIFICATION (24h before)
// ===========================================

export async function sendBookingReminder(
  data: ReminderData
): Promise<WatiResponse> {
  const parameters = [
    { name: 'nombre_cliente', value: data.clientName },
    { name: 'ubicacion', value: data.locationName },
    { name: 'fecha', value: data.date },
    { name: 'hora', value: data.time },
    { name: 'id_cita', value: data.appointmentId },
  ]

  return watiRequest(buildRequest('recordatorio_cita', data.clientPhone, parameters))
}

// ===========================================
// WHATSAPP OTP CODE (6-digit code verification)
// Uses /sendTemplateMessage with phone as query param (per WATI OTP guide)
// ===========================================

/**
 * Sends a 6-digit OTP code via WhatsApp using the codigo_verificacion template.
 *
 * Template: codigo_verificacion (Authentication category, Spanish)
 * Body (fixed by Meta): "Tu código de verificación es {{1}} Por tu seguridad, no lo compartas."
 * Footer (fixed): "Este código caduca en 10 minutos."
 * Parameters: {{1}} = otpCode only
 */
export async function sendOtpCode(
  phone: string,
  otpCode: string
): Promise<WatiResponse> {
  if (!WATI_ACCESS_TOKEN) {
    return { result: false, error: 'WATI not configured' }
  }

  const formattedPhone = formatPhoneForWati(phone)
  const url = `${WATI_BASE_URL}/api/v1/sendTemplateMessage?whatsappNumber=${formattedPhone}`
  const body = {
    template_name: 'codigo_verificacion',
    broadcast_name: 'codigo_verificacion',
    parameters: [{ name: '1', value: otpCode }],
  }

  try {
    console.log('WATI OTP request:', url, JSON.stringify(body))
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
      console.error(`WATI OTP error: ${response.status}`, errorText)
      return { result: false, error: `HTTP ${response.status}: ${errorText}` }
    }

    return await response.json()
  } catch (error) {
    console.error('WATI OTP request failed:', error)
    return { result: false, error: String(error) }
  }
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
  return watiRequest(buildRequest('verificacion_telefono', data.clientPhone, [{ name: '1', value: data.clientName }]))
}

// ===========================================
// CHECK IF WATI IS CONFIGURED
// ===========================================

export function isWatiConfigured(): boolean {
  return Boolean(WATI_ACCESS_TOKEN)
}
