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
  totalDuration: number // minutes
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

    return await response.json()
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
  return sendTemplate(data.clientPhone, 'confirmacion_cita', [
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
// BOOKING REMINDER NOTIFICATION (24h before)
// Template: recordatorio_cita
// {{1}} nombre, {{2}} ubicacion, {{3}} fecha, {{4}} hora
// URL buttons use appointmentId
// ===========================================

export async function sendBookingReminder(
  data: ReminderData
): Promise<WatiResponse> {
  return sendTemplate(data.clientPhone, 'recordatorio_cita', [
    { name: '1', value: data.clientName },
    { name: '2', value: stripMimosaPrefix(data.locationName) },
    { name: '3', value: data.date },
    { name: '4', value: data.time },
    // Button URL dynamic params: both Confirmar and Cancelar buttons use {{1}} = appointmentId
    { name: 'button_url_0', value: data.appointmentId },
    { name: 'button_url_1', value: data.appointmentId },
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
