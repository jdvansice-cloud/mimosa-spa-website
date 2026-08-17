// Relationship (lifecycle) emails: welcome, first-visit thanks, birthday.
// Sent from the warm hola@ identity (kind: 'relation').

import { shell, button } from './booking'

const RESERVAR_URL = 'https://www.mimosaretreat.com/es/reservar'

// Per-location Google review links (location 1 = Costa del Este, 2 = San Francisco)
export const REVIEW_URLS: Record<number, string> = {
  1: 'https://maps.app.goo.gl/5iX28mGH2mxUiJJ1A',
  2: 'https://maps.app.goo.gl/sgT9VCx6DZBoy5wn6',
}

const p = (html: string) =>
  `<p style="font-family:Arial,sans-serif;font-size:14px;color:#54514D;line-height:1.6;margin:0 0 14px;">${html}</p>`

const small = (html: string) =>
  `<p style="font-family:Arial,sans-serif;font-size:12px;color:#8B8680;line-height:1.6;text-align:center;">${html}</p>`

export function welcomeEmail(d: { clientName: string }): { subject: string; html: string } {
  return {
    subject: `Bienvenida a Mimosa Spa Retreat, ${d.clientName} 🌼`,
    html: shell(
      `¡Bienvenida a Mimosa, ${d.clientName}!`,
      `${p('Gracias por unirte a nuestra comunidad. En Mimosa Spa Retreat creemos que cuidarte no es un lujo, es una pausa necesaria.')}
      ${p('Te esperamos en cualquiera de nuestras dos sedes — <b>Costa del Este</b> y <b>San Francisco</b> — con masajes, faciales, cuidado de manos y pies, y rituales pensados para ti.')}
      ${button('Reservar mi primera cita', RESERVAR_URL)}
      ${small('¿Preguntas? Escríbenos por WhatsApp al +507 6404-9464 💛')}`
    ),
  }
}

export function firstVisitEmail(d: {
  clientName: string
  locationId?: number | null
}): { subject: string; html: string } {
  const reviewUrl = (d.locationId && REVIEW_URLS[d.locationId]) || REVIEW_URLS[1]
  return {
    subject: `Gracias por tu primera visita a Mimosa, ${d.clientName} 💛`,
    html: shell(
      `Gracias por visitarnos, ${d.clientName}`,
      `${p('Fue un gusto recibirte por primera vez en Mimosa Spa Retreat. Esperamos que hayas salido renovada y con ganas de volver.')}
      ${p('Si disfrutaste tu experiencia, nos ayudarías muchísimo dejando una reseña en Google — toma menos de un minuto y nos ayuda a que más personas nos conozcan:')}
      ${button('⭐ Dejar mi reseña', reviewUrl)}
      <div style="text-align:center;margin:4px 0 10px;">
        <a href="${RESERVAR_URL}" style="font-family:Arial,sans-serif;font-size:13px;color:#A68700;text-decoration:underline;">Reservar mi próxima cita</a>
      </div>
      ${small('Te esperamos pronto de vuelta 🌼')}`
    ),
  }
}

export function birthdayEmail(d: { clientName: string }): { subject: string; html: string } {
  return {
    subject: `¡Feliz cumpleaños, ${d.clientName}! 🎂`,
    html: shell(
      `¡Feliz cumpleaños, ${d.clientName}! 🎉`,
      `${p('Todo el equipo de Mimosa Spa Retreat te desea un día maravilloso, lleno de calma y de las personas que quieres.')}
      ${p('Y si tu plan de cumpleaños incluye un momento para ti, aquí te esperamos con los brazos abiertos:')}
      ${button('Regalarme un momento Mimosa', RESERVAR_URL)}
      ${small('Con cariño, el equipo de Mimosa 💛')}`
    ),
  }
}
