// ===========================================
// WATI API UTILITY
// Server-side only - handles WhatsApp notifications
// ===========================================

const WATI_API_URL = process.env.WATI_API_URL || 'https://live-mt-server.wati.io'
const WATI_ACCESS_TOKEN = process.env.WATI_ACCESS_TOKEN

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
    const response = await fetch(`${WATI_API_URL}${endpoint}`, {
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
      return { result: false, error: `HTTP ${response.status}` }
    }
    
    return await response.json()
  } catch (error) {
    console.error('WATI API request failed:', error)
    return { result: false, error: String(error) }
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
  const formattedPhone = formatPhoneForWati(phone)
  
  return watiRequest('/api/v1/sendTemplateMessage', {
    whatsappNumber: formattedPhone,
    templateName,
    parameters,
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
  
  return watiRequest('/api/v1/sendTemplateMessage', {
    whatsappNumber: formattedPhone,
    templateName: 'confirmacion_reserva',
    parameters,
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
  
  return watiRequest('/api/v1/sendTemplateMessage', {
    whatsappNumber: formattedPhone,
    templateName: 'recordatorio_cita',
    parameters,
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
// PHONE VERIFICATION VIA WHATSAPP
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
  return watiRequest('/api/v1/sendTemplateMessage', {
    whatsappNumber: formattedPhone,
    templateName: 'verificacion_telefono',
    parameters,
    // Button parameters - the URL button uses the token as dynamic part
    buttonParameters: {
      // Button index 0 (first button)
      '0': data.verificationUrl,
    },
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
