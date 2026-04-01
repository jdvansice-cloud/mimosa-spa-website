// ===========================================
// WATI API UTILITY
// Server-side only - handles WhatsApp notifications
// ===========================================

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
  clientPhone: string // Format: 507XXXXXXXX (no + sign)
  locationName: string
  date: string // "Lunes, 15 de Enero 2026"
  time: string // "10:00 AM"
  services: string[] // Array of service names
  totalDuration: number // minutes
  therapistName: string // Always required
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
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '')
  
  // Remove leading + if present in original
  // WATI expects format without + sign
  
  // If starts with 507 (Panama), keep as is
  // If doesn't start with country code, add 507
  if (!cleaned.startsWith('507') && cleaned.length === 8) {
    cleaned = '507' + cleaned
  }
  
  return cleaned
}

// ===========================================
// API REQUEST HELPER
// ===========================================

async function watiRequest(
  endpoint: string,
  body: Record<string, unknown>
): Promise<WatiResponse> {
  if (!WATI_ACCESS_TOKEN) {
    console.warn('WATI_ACCESS_TOKEN not configured')
    return { result: false, error: 'WATI not configured' }
  }

  try {
    const fullUrl = `${WATI_API_URL}${endpoint}`
    console.log('WATI request URL:', fullUrl)

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
      console.error(`WATI API error: ${response.status}`, errorText, 'URL:', fullUrl)
      return { result: false, error: `HTTP ${response.status}: ${errorText}` }
    }

    return await response.json()
  } catch (error) {
    console.error('WATI API request failed:', error)
    return { result: false, error: String(error) }
  }
}

// ===========================================
// SEND TEMPLATE MESSAGE (v3)
// POST /api/ext/v3/messageTemplates/send
// ===========================================

export async function sendTemplateMessage(
  phone: string,
  templateName: string,
  parameters: Array<{ name: string; value: string }>
): Promise<WatiResponse> {
  const formattedPhone = formatPhoneForWati(phone)

  return watiRequest('/api/ext/v3/messageTemplates/send', {
    template_name: templateName,
    broadcast_name: templateName,
    recipients: [
      {
        whatsappNumber: formattedPhone,
        customParams: parameters,
      },
    ],
  })
}

// ===========================================
// SEND SESSION MESSAGE (for active conversations)
// ===========================================

export async function sendSessionMessage(
  phone: string,
  message: string
): Promise<WatiResponse> {
  const formattedPhone = formatPhoneForWati(phone)
  
  return watiRequest('/api/v1/sendSessionMessage/' + formattedPhone, {
    messageText: message,
  })
}

// ===========================================
// BOOKING CONFIRMATION NOTIFICATION
// ===========================================

export async function sendBookingConfirmation(
  data: BookingConfirmationData
): Promise<WatiResponse> {
  const formattedPhone = formatPhoneForWati(data.clientPhone)
  
  // Build services list as comma-separated single line
  const servicesList = data.services.join(', ')
  
  // Template parameters for booking confirmation
  // Note: Template must be pre-approved in WATI dashboard
  // Template name: confirmacion_reserva
  const parameters = [
    { name: 'nombre_cliente', value: data.clientName },
    { name: 'ubicacion', value: data.locationName },
    { name: 'fecha', value: data.date },
    { name: 'hora', value: data.time },
    { name: 'duracion', value: `${data.totalDuration} minutos` },
    { name: 'terapeuta', value: data.therapistName },
    { name: 'servicios', value: servicesList },
  ]
  
  return watiRequest('/api/ext/v3/messageTemplates/send', {
    template_name: 'confirmacion_reserva',
    broadcast_name: 'confirmacion_reserva',
    recipients: [{ whatsappNumber: formattedPhone, customParams: parameters }],
  })
}

// ===========================================
// BOOKING REMINDER NOTIFICATION (24h before)
// ===========================================

export async function sendBookingReminder(
  data: ReminderData
): Promise<WatiResponse> {
  const formattedPhone = formatPhoneForWati(data.clientPhone)
  
  // Parameters for the template body
  const parameters = [
    { name: 'nombre_cliente', value: data.clientName },
    { name: 'ubicacion', value: data.locationName },
    { name: 'fecha', value: data.date },
    { name: 'hora', value: data.time },
    { name: 'id_cita', value: data.appointmentId }, // Used in URL buttons
  ]
  
  return watiRequest('/api/ext/v3/messageTemplates/send', {
    template_name: 'recordatorio_cita',
    broadcast_name: 'recordatorio_cita',
    recipients: [{ whatsappNumber: formattedPhone, customParams: parameters }],
  })
}

// ===========================================
// SIMPLE TEXT MESSAGE (for testing)
// ===========================================

export async function sendTextMessage(
  phone: string,
  message: string
): Promise<WatiResponse> {
  const formattedPhone = formatPhoneForWati(phone)
  
  // Try session message first (if within 24h window)
  // Falls back to template if session expired
  return watiRequest('/api/v1/sendSessionMessage/' + formattedPhone, {
    messageText: message,
  })
}

// ===========================================
// CHECK IF WATI IS CONFIGURED
// ===========================================

export function isWatiConfigured(): boolean {
  return Boolean(WATI_ACCESS_TOKEN && WATI_API_URL)
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
 * Parameters: {{1}} = otpCode only (Authentication templates have a fixed body — cannot add client name)
 */
export async function sendOtpCode(
  phone: string,
  otpCode: string
): Promise<WatiResponse> {
  const formattedPhone = formatPhoneForWati(phone)

  return watiRequest('/api/ext/v3/messageTemplates/send', {
    template_name: 'codigo_verificacion',
    broadcast_name: 'codigo_verificacion',
    recipients: [
      {
        whatsappNumber: formattedPhone,
        customParams: [{ name: '1', value: otpCode }],
      },
    ],
  })
}

// ===========================================
// PHONE VERIFICATION VIA WHATSAPP (link-based, legacy)
// ===========================================

interface VerificationData {
  clientName: string
  clientPhone: string // Format: 507XXXXXXXX
  verificationUrl: string // Full URL with token
}

export async function sendPhoneVerification(
  data: VerificationData
): Promise<WatiResponse> {
  const formattedPhone = formatPhoneForWati(data.clientPhone)

  // Template with CTA button for phone verification
  // Note: Template must be pre-approved in WATI dashboard
  // Template name: verificacion_telefono
  // Body parameter: {{1}} = client name
  // Button: URL button with dynamic suffix
  const parameters = [
    { name: '1', value: data.clientName },
  ]

  console.log('Sending WhatsApp verification to:', formattedPhone)
  console.log('Verification URL:', data.verificationUrl)

  // For button templates, WATI uses a different format
  // The button URL is set in the template with a variable suffix
  return watiRequest('/api/ext/v3/messageTemplates/send', {
    template_name: 'verificacion_telefono',
    broadcast_name: 'verificacion_telefono',
    recipients: [{ whatsappNumber: formattedPhone, customParams: parameters }],
  })
}

// ===========================================
// GET CONTACT INFO
// ===========================================

export async function getContactInfo(phone: string): Promise<WatiResponse & { contact?: unknown }> {
  const formattedPhone = formatPhoneForWati(phone)
  
  if (!WATI_ACCESS_TOKEN) {
    return { result: false, error: 'WATI not configured' }
  }
  
  try {
    const response = await fetch(
      `${WATI_API_URL}/api/v1/getContacts?pageSize=1&pageNumber=1&whatsappNumber=${formattedPhone}`,
      {
        headers: {
          'Authorization': `Bearer ${WATI_ACCESS_TOKEN}`,
        },
      }
    )
    
    if (!response.ok) {
      return { result: false, error: `HTTP ${response.status}` }
    }
    
    const data = await response.json()
    return { result: true, contact: data }
  } catch (error) {
    return { result: false, error: String(error) }
  }
}
