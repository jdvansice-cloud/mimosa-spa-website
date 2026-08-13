// Legal page copy. Lives in git (versioned, reviewed) rather than the CMS.
// NOTE: draft copy — have the partners/lawyer review before treating as final,
// especially the cancellation windows in `cancelacion`.

export interface LegalSection {
  heading: string
  body: string[]
}

export interface LegalDoc {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}

type Localized<T> = { es: T; en: T }

export const LEGAL_PRIVACY: Localized<LegalDoc> = {
  es: {
    title: 'Política de Privacidad',
    updated: 'Última actualización: agosto 2026',
    intro:
      'En Mimosa Spa Retreat (Panamá) protegemos tus datos personales. Esta política explica qué información recopilamos, para qué la usamos y cuáles son tus derechos.',
    sections: [
      {
        heading: 'Datos que recopilamos',
        body: [
          'Datos de contacto que nos proporcionas al reservar o comprar (nombre, teléfono, correo electrónico).',
          'Historial de citas y servicios, gestionado en nuestro sistema de reservas (Mindbody).',
          'Datos de navegación en el sitio (páginas visitadas, dispositivo), mediante herramientas de analítica.',
        ],
      },
      {
        heading: 'Para qué usamos tus datos',
        body: [
          'Gestionar tus reservas y enviarte confirmaciones y recordatorios por WhatsApp o correo.',
          'Emitir y entregar gift cards y comprobantes.',
          'Mejorar nuestros servicios y comunicarte promociones (solo si lo aceptas).',
        ],
      },
      {
        heading: 'Con quién compartimos datos',
        body: [
          'Proveedores que hacen posible el servicio: sistema de reservas (Mindbody), infraestructura del sitio (Vercel, Supabase), mensajería de WhatsApp y, cuando pagas en línea, el procesador de pagos. Nunca vendemos tus datos.',
        ],
      },
      {
        heading: 'Tus derechos',
        body: [
          'Puedes solicitar acceso, corrección o eliminación de tus datos escribiéndonos a info@mimosaretreat.com o por WhatsApp.',
        ],
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: August 2026',
    intro:
      'At Mimosa Spa Retreat (Panama) we protect your personal data. This policy explains what we collect, how we use it, and your rights.',
    sections: [
      {
        heading: 'Data we collect',
        body: [
          'Contact details you provide when booking or purchasing (name, phone, email).',
          'Appointment and service history, managed in our booking system (Mindbody).',
          'Site navigation data (pages visited, device) via analytics tools.',
        ],
      },
      {
        heading: 'How we use your data',
        body: [
          'To manage your bookings and send confirmations and reminders via WhatsApp or email.',
          'To issue and deliver gift cards and receipts.',
          'To improve our services and send you promotions (only with your consent).',
        ],
      },
      {
        heading: 'Who we share data with',
        body: [
          'Providers that make the service possible: our booking system (Mindbody), site infrastructure (Vercel, Supabase), WhatsApp messaging and, when you pay online, the payment processor. We never sell your data.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You may request access, correction or deletion of your data by writing to info@mimosaretreat.com or via WhatsApp.',
        ],
      },
    ],
  },
}

export const LEGAL_TERMS: Localized<LegalDoc> = {
  es: {
    title: 'Términos y Condiciones',
    updated: 'Última actualización: agosto 2026',
    intro:
      'Estos términos regulan el uso del sitio mimosaretreat.com y la contratación de servicios de Mimosa Spa Retreat en Panamá.',
    sections: [
      {
        heading: 'Reservas',
        body: [
          'Las reservas se confirman por WhatsApp o en el sitio. Los horarios están sujetos a disponibilidad.',
          'Te pedimos llegar 10 minutos antes de tu cita. Las llegadas tardías pueden reducir la duración del tratamiento.',
        ],
      },
      {
        heading: 'Gift cards y certificados',
        body: [
          'Las gift cards tienen una validez de 12 meses desde su emisión y no son canjeables por efectivo.',
          'Para redimir, presenta el código el día de tu visita en cualquiera de nuestras ubicaciones.',
        ],
      },
      {
        heading: 'Precios',
        body: [
          'Los precios están expresados en dólares (USD). Salvo indicación contraria, no incluyen ITBMS (7%).',
          'Los precios y el menú de servicios pueden cambiar sin previo aviso.',
        ],
      },
      {
        heading: 'Cancelaciones',
        body: [
          'Consulta nuestra Política de Cancelación para plazos y condiciones.',
        ],
      },
    ],
  },
  en: {
    title: 'Terms and Conditions',
    updated: 'Last updated: August 2026',
    intro:
      'These terms govern the use of mimosaretreat.com and the purchase of services from Mimosa Spa Retreat in Panama.',
    sections: [
      {
        heading: 'Bookings',
        body: [
          'Bookings are confirmed via WhatsApp or on the site. Times are subject to availability.',
          'Please arrive 10 minutes before your appointment. Late arrivals may shorten your treatment time.',
        ],
      },
      {
        heading: 'Gift cards and certificates',
        body: [
          'Gift cards are valid for 12 months from issuance and are not redeemable for cash.',
          'To redeem, present your code on the day of your visit at either of our locations.',
        ],
      },
      {
        heading: 'Prices',
        body: [
          'Prices are in US dollars (USD). Unless stated otherwise, they do not include ITBMS (7%).',
          'Prices and the service menu may change without notice.',
        ],
      },
      {
        heading: 'Cancellations',
        body: ['See our Cancellation Policy for notice periods and conditions.'],
      },
    ],
  },
}

export const LEGAL_CANCELLATION: Localized<LegalDoc> = {
  es: {
    title: 'Política de Cancelación',
    updated: 'Última actualización: agosto 2026',
    intro:
      'Sabemos que los planes cambian. Esta política nos permite reorganizar la agenda y ofrecer el espacio a otros clientes.',
    sections: [
      {
        heading: 'Cancelar o reprogramar',
        body: [
          'Puedes cancelar o reprogramar tu cita sin costo avisándonos con al menos 24 horas de anticipación, por WhatsApp o teléfono.',
          'Cancelaciones con menos de 24 horas o inasistencias (no-show) pueden requerir prepago para futuras reservas.',
        ],
      },
      {
        heading: 'Grupos y ocasiones especiales',
        body: [
          'Reservas de grupos (3+ personas) y eventos requieren depósito y un aviso de cancelación de 48 horas para su reembolso.',
        ],
      },
      {
        heading: 'Llegadas tardías',
        body: [
          'Haremos lo posible por brindarte el tratamiento completo; si la agenda no lo permite, la sesión terminará a la hora originalmente pautada.',
        ],
      },
    ],
  },
  en: {
    title: 'Cancellation Policy',
    updated: 'Last updated: August 2026',
    intro:
      'We know plans change. This policy lets us reorganize the schedule and offer the space to other clients.',
    sections: [
      {
        heading: 'Cancelling or rescheduling',
        body: [
          'You may cancel or reschedule at no cost by notifying us at least 24 hours in advance, via WhatsApp or phone.',
          'Cancellations with less than 24 hours notice, or no-shows, may require prepayment for future bookings.',
        ],
      },
      {
        heading: 'Groups and special occasions',
        body: [
          'Group bookings (3+ people) and events require a deposit and 48 hours cancellation notice for a refund.',
        ],
      },
      {
        heading: 'Late arrivals',
        body: [
          'We will do our best to give you the full treatment; if the schedule does not allow it, the session will end at the originally booked time.',
        ],
      },
    ],
  },
}
