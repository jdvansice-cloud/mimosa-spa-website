// Branded booking notification emails — the fallback channel when the
// customer has no phone in Mindbody or the WATI WhatsApp send fails.

const BRAND_DARK = '#333333'
const BRAND_GOLD = '#FCCF08'
const CREAM = '#FDFAF5'

export function shell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:24px 12px;background:${CREAM};font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
    <div style="background:${BRAND_DARK};padding:22px;text-align:center;">
      <div style="color:#ffffff;font-size:26px;letter-spacing:1px;">Mimosa</div>
      <div style="color:${BRAND_GOLD};font-size:10px;letter-spacing:4px;text-transform:uppercase;margin-top:2px;">Spa Retreat</div>
    </div>
    <div style="padding:28px 26px;">
      <h1 style="font-size:20px;color:${BRAND_DARK};margin:0 0 14px;">${title}</h1>
      ${bodyHtml}
    </div>
    <div style="padding:16px;text-align:center;border-top:1px solid #eee;color:#8B8680;font-size:12px;font-family:Arial,sans-serif;">
      Mimosa Spa Retreat · Costa del Este &amp; San Francisco ·
      <a href="https://www.mimosaretreat.com" style="color:#A68700;">mimosaretreat.com</a>
    </div>
  </div>
</body></html>`
}

export function detailRows(rows: Array<[string, string]>): string {
  return `<table style="width:100%;border-collapse:collapse;background:${CREAM};border-radius:10px;margin:14px 0;font-family:Arial,sans-serif;font-size:14px;">
    ${rows
      .map(
        ([k, v]) => `<tr>
      <td style="padding:8px 14px;color:#8B8680;">${k}</td>
      <td style="padding:8px 14px;color:${BRAND_DARK};text-align:right;font-weight:bold;">${v}</td>
    </tr>`
      )
      .join('')}
  </table>`
}

export function button(label: string, url: string): string {
  return `<div style="text-align:center;margin:20px 0 6px;">
    <a href="${url}" style="display:inline-block;background:${BRAND_GOLD};color:${BRAND_DARK};font-family:Arial,sans-serif;font-weight:bold;font-size:15px;padding:12px 28px;border-radius:10px;text-decoration:none;">${label}</a>
  </div>`
}

export interface BookingEmailData {
  clientName: string
  locationName: string
  date: string
  time: string
  services?: string[]
  therapistName?: string
  isCouples?: boolean
}

const COUPLES_ROW: [string, string] = ['Tipo', '💑 Cita en pareja']

export function bookingConfirmationEmail(d: BookingEmailData): { subject: string; html: string } {
  const rows: Array<[string, string]> = [
    ['Sede', d.locationName],
    ['Fecha', d.date],
    ['Hora', d.time],
  ]
  if (d.isCouples) rows.push(COUPLES_ROW)
  if (d.services?.length) rows.push(['Servicios', d.services.join(', ')])
  if (d.therapistName) rows.push(['Terapeuta', d.therapistName])
  return {
    subject: `Tu cita en Mimosa Spa está confirmada — ${d.date}`,
    html: shell(
      `¡Cita confirmada, ${d.clientName}!`,
      `<p style="font-family:Arial,sans-serif;font-size:14px;color:#54514D;line-height:1.6;margin:0;">
        Te esperamos en Mimosa Spa Retreat. Estos son los detalles de tu reserva:
      </p>
      ${detailRows(rows)}
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#8B8680;line-height:1.6;">
        Si necesitas cambiar o cancelar tu cita, escríbenos por WhatsApp al +507 6404-9464.
      </p>`
    ),
  }
}

export function bookingReminderEmail(
  d: BookingEmailData & { appointmentId?: string }
): { subject: string; html: string } {
  // Mirror the WhatsApp reminder: confirm + reschedule actions
  const confirmUrl = d.appointmentId
    ? `https://mimosaretreat.com/api/cita/confirmar?id=${d.appointmentId}`
    : null
  const changeUrl = d.appointmentId
    ? `https://mimosaretreat.com/reservar?replace=${d.appointmentId}`
    : 'https://www.mimosaretreat.com/es/reservar'
  return {
    subject: `Recordatorio: tu cita en Mimosa Spa es mañana — ${d.date}`,
    html: shell(
      `Nos vemos mañana, ${d.clientName} 💛`,
      `<p style="font-family:Arial,sans-serif;font-size:14px;color:#54514D;line-height:1.6;margin:0;">
        Te recordamos tu cita en Mimosa Spa Retreat:
      </p>
      ${detailRows([
        ['Sede', d.locationName],
        ['Fecha', d.date],
        ['Hora', d.time],
        ...(d.isCouples ? [COUPLES_ROW] : []),
        ...(d.services?.length ? [['Servicios', d.services.join(', ')] as [string, string]] : []),
      ])}
      ${confirmUrl ? button('✅ Confirmar asistencia', confirmUrl) : ''}
      <div style="text-align:center;margin:4px 0 10px;">
        <a href="${changeUrl}" style="font-family:Arial,sans-serif;font-size:13px;color:#A68700;text-decoration:underline;">🔄 Cambiar mi cita</a>
      </div>
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#8B8680;line-height:1.6;text-align:center;">
        Favor confirmar tu asistencia 🙏
      </p>`
    ),
  }
}

export function bookingChangeEmail(d: BookingEmailData): { subject: string; html: string } {
  const rows: Array<[string, string]> = [
    ['Sede', d.locationName],
    ['Nueva fecha', d.date],
    ['Nueva hora', d.time],
  ]
  if (d.isCouples) rows.push(COUPLES_ROW)
  if (d.services?.length) rows.push(['Servicios', d.services.join(', ')])
  if (d.therapistName) rows.push(['Terapeuta', d.therapistName])
  return {
    subject: `Tu cita en Mimosa Spa cambió — nueva fecha: ${d.date}`,
    html: shell(
      `Tu cita fue actualizada, ${d.clientName}`,
      `<p style="font-family:Arial,sans-serif;font-size:14px;color:#54514D;line-height:1.6;margin:0;">
        Estos son los nuevos datos de tu reserva:
      </p>
      ${detailRows(rows)}
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#8B8680;line-height:1.6;">
        Si el nuevo horario no te funciona, escríbenos por WhatsApp al +507 6404-9464 o
        <a href="https://www.mimosaretreat.com/es/reservar" style="color:#A68700;">reagenda en línea</a>.
      </p>`
    ),
  }
}

export function bookingCancellationEmail(
  d: BookingEmailData & { reagendarUrl: string }
): { subject: string; html: string } {
  const rows: Array<[string, string]> = [
    ['Sede', d.locationName],
    ['Fecha', d.date],
    ['Hora', d.time],
  ]
  if (d.isCouples) rows.push(COUPLES_ROW)
  if (d.services?.length) rows.push(['Servicios', d.services.join(', ')])
  return {
    subject: `Tu cita en Mimosa Spa fue cancelada — ${d.date}`,
    html: shell(
      `Tu cita fue cancelada, ${d.clientName}`,
      `<p style="font-family:Arial,sans-serif;font-size:14px;color:#54514D;line-height:1.6;margin:0;">
        <b style="color:#B3261E;">Esta cita ya no está activa</b> — fue cancelada y el espacio quedó liberado:
      </p>
      ${detailRows(rows)}
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#54514D;line-height:1.6;margin:0;">
        Si deseas reagendar, elige tu nuevo horario en un par de clics:
      </p>
      ${button('Reagendar mi cita', d.reagendarUrl)}
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#8B8680;line-height:1.6;text-align:center;">
        Te esperamos pronto en Mimosa 🌼
      </p>`
    ),
  }
}
