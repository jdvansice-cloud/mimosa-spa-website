// Structural bilingual copy for the FY2027 marketing pages.
// Prices/SKUs live in the marketing_offers table (admin-editable); this file
// holds the copy that only changes with a deploy.

type L = { es: string; en: string }

export const PAREJAS_COPY = {
  heroTitle: { es: 'Parejas y Ocasiones', en: 'Couples & Occasions' } as L,
  heroSubtitle: {
    es: 'Cabinas dobles, rituales para dos y celebraciones que se recuerdan.',
    en: 'Double cabins, rituals for two and celebrations to remember.',
  } as L,
  ritualsTitle: { es: 'Rituales en Pareja', en: 'Couples Rituals' } as L,
  ritualsIntro: {
    es: 'Siete cabinas dobles entre nuestras dos ubicaciones, diseñadas para desconectarse juntos. Reserva por WhatsApp o en línea.',
    en: 'Seven double cabins across our two locations, designed to disconnect together. Book via WhatsApp or online.',
  } as L,
  menuTitle: { es: 'Menú de Parejas', en: 'Couples Menu' } as L,
  occasionsTitle: { es: 'Ocasiones Especiales', en: 'Special Occasions' } as L,
  occasionsIntro: {
    es: 'Cumpleaños, despedidas, celebraciones entre amigas o con mamá: armamos la experiencia completa para tu grupo, con opción de uso privado del spa.',
    en: 'Birthdays, bridal parties, friends day or mom-and-me: we build the full experience for your group, with a private-hire option.',
  } as L,
  groupFormTitle: {
    es: 'Cuéntanos sobre tu ocasión',
    en: 'Tell us about your occasion',
  } as L,
  groupFormIntro: {
    es: 'Déjanos tus datos y coordinamos fecha, cabinas y detalles por WhatsApp.',
    en: 'Leave your details and we will coordinate date, cabins and details via WhatsApp.',
  } as L,
  giftTitle: { es: 'Regala una experiencia', en: 'Gift an experience' } as L,
  giftBody: {
    es: 'Los rituales en pareja son el regalo favorito para aniversarios y fechas especiales. Pregunta por nuestras gift cards.',
    en: 'Couples rituals are the favorite gift for anniversaries and special dates. Ask about our gift cards.',
  } as L,
}

export interface OccasionItem {
  key: string
  name: L
  description: L
  whatsapp: L
}

export const OCCASIONS: OccasionItem[] = [
  {
    key: 'cumpleanos',
    name: { es: 'Cumpleaños Mimosa', en: 'Mimosa Birthday' },
    description: {
      es: 'Celebra tu día con masaje, ritual de pies y un brindis — solo o con tus invitados.',
      en: 'Celebrate your day with a massage, foot ritual and a toast — solo or with guests.',
    },
    whatsapp: {
      es: 'Hola, quiero organizar un Cumpleaños Mimosa.',
      en: 'Hi, I would like to organize a Mimosa Birthday.',
    },
  },
  {
    key: 'despedida',
    name: { es: 'Despedida de Soltera', en: 'Bridal Party' },
    description: {
      es: 'De 3 a 8 amigas, cabinas reservadas en bloque y espacio para brindis y fotos.',
      en: '3 to 8 friends, cabins reserved in a block, and space for a toast and photos.',
    },
    whatsapp: {
      es: 'Hola, quiero cotizar una Despedida de Soltera en el spa.',
      en: 'Hi, I would like a quote for a bridal party at the spa.',
    },
  },
  {
    key: 'mama',
    name: { es: 'Mamá y Yo', en: 'Mom & Me' },
    description: {
      es: 'Una tarde para dos generaciones: masajes en cabina doble y té de cortesía.',
      en: 'An afternoon for two generations: massages in a double cabin and complimentary tea.',
    },
    whatsapp: {
      es: 'Hola, quiero reservar una experiencia Mamá y Yo.',
      en: 'Hi, I would like to book a Mom & Me experience.',
    },
  },
  {
    key: 'amigas',
    name: { es: 'Amigas Day', en: 'Friends Day' },
    description: {
      es: 'Plan de spa para tu grupo: masajes, pies y snacks — ideal entre semana.',
      en: 'A spa plan for your group: massages, foot rituals and snacks — perfect on weekdays.',
    },
    whatsapp: {
      es: 'Hola, quiero organizar un Amigas Day.',
      en: 'Hi, I would like to organize a Friends Day.',
    },
  },
]

export const EMPRESAS_COPY = {
  heroTitle: { es: 'Mimosa para Empresas', en: 'Mimosa for Business' } as L,
  heroSubtitle: {
    es: 'Bienestar corporativo, regalos ejecutivos y eventos en el spa.',
    en: 'Corporate wellness, executive gifting and in-spa events.',
  } as L,
  giftingTitle: { es: 'Regalos corporativos', en: 'Corporate gifting' } as L,
  giftingBody: {
    es: 'Gift cards y cajas de regalo para clientes y colaboradores — ideales para la temporada de aguinaldo. Pedidos por volumen con facturación.',
    en: 'Gift cards and gift boxes for clients and teams — ideal for the holiday season. Volume orders with invoicing.',
  } as L,
  wellnessTitle: { es: 'Bienestar en tu oficina', en: 'Wellness at your office' } as L,
  wellnessBody: {
    es: 'Jornadas de masaje en silla en tu empresa y códigos de beneficio para tu equipo, con planes mensuales.',
    en: 'Chair-massage days at your company and employee benefit codes, with monthly plans.',
  } as L,
  eventsTitle: { es: 'Eventos en el spa', en: 'Events at the spa' } as L,
  eventsBody: {
    es: 'Reserva el spa para tu equipo o tus clientes: experiencias privadas entre semana en Costa del Este o San Francisco.',
    en: 'Book the spa for your team or clients: private weekday experiences in Costa del Este or San Francisco.',
  } as L,
  formTitle: { es: 'Hablemos', en: 'Let’s talk' } as L,
  formIntro: {
    es: 'Cuéntanos qué necesitas y te enviamos una propuesta en 24–48 horas.',
    en: 'Tell us what you need and we will send a proposal within 24–48 hours.',
  } as L,
}

export const CLUB_COPY = {
  heroTitle: { es: 'Club Mimosa', en: 'Club Mimosa' } as L,
  heroSubtitle: {
    es: 'Tu ritual mensual, a precio de miembro. Dos planes, cero complicaciones.',
    en: 'Your monthly ritual at member pricing. Two plans, zero hassle.',
  } as L,
  foundingTitle: { es: 'Miembros Fundadores', en: 'Founding Members' } as L,
  howTitle: { es: 'Cómo funciona', en: 'How it works' } as L,
  how: [
    {
      es: 'Elige tu plan y asegura tu tarifa mensual.',
      en: 'Choose your plan and lock in your monthly rate.',
    },
    {
      es: 'Usa tu crédito cada mes en tu masaje favorito (acumulable 60 días).',
      en: 'Use your monthly credit on your favorite massage (rolls over 60 days).',
    },
    {
      es: 'Disfruta descuentos de miembro en todo lo demás, incluidas gift cards.',
      en: 'Enjoy member discounts on everything else, including gift cards.',
    },
  ] as L[],
  vipTitle: { es: 'Mimosa Privilege (VIP prepagado)', en: 'Mimosa Privilege (prepaid VIP)' } as L,
  vipBody: {
    es: 'Nuestra membresía prepagada de siempre sigue disponible como opción VIP y de regalo.',
    en: 'Our classic prepaid membership remains available as the VIP and gifting option.',
  } as L,
  vipCta: { es: 'Ver Mimosa Privilege', en: 'See Mimosa Privilege' } as L,
  waitlistTitle: {
    es: 'Únete a la lista fundadora',
    en: 'Join the founding list',
  } as L,
  waitlistIntro: {
    es: 'Déjanos tus datos y te avisamos apenas abra la venta de los primeros 100 cupos.',
    en: 'Leave your details and we will let you know as soon as the first 100 spots open.',
  } as L,
}

export const PRIMERA_VISITA_COPY = {
  heroTitle: { es: 'Tu Primera Visita', en: 'Your First Visit' } as L,
  heroSubtitle: {
    es: 'Empieza tu ritual Mimosa con una experiencia diseñada para conocerte.',
    en: 'Start your Mimosa ritual with an experience designed to welcome you.',
  } as L,
  stepsTitle: { es: 'Así de fácil', en: 'It’s this easy' } as L,
  steps: [
    { es: 'Déjanos tu nombre y WhatsApp.', en: 'Leave your name and WhatsApp.' },
    { es: 'Te escribimos para agendar tu primera visita.', en: 'We message you to schedule your first visit.' },
    { es: 'Llega 10 minutos antes y disfruta tu ritual.', en: 'Arrive 10 minutes early and enjoy your ritual.' },
  ] as L[],
  formTitle: { es: 'Reclama tu primera visita', en: 'Claim your first visit' } as L,
}

export const REFERIDOS_COPY = {
  heroTitle: { es: 'Regala $20, Recibe $20', en: 'Give $20, Get $20' } as L,
  heroSubtitle: {
    es: 'Muy pronto: comparte Mimosa con alguien que amas y ambos reciben $20 en crédito de spa.',
    en: 'Coming soon: share Mimosa with someone you love and you both receive $20 in spa credit.',
  } as L,
  notifyTitle: {
    es: 'Avísame cuando esté listo',
    en: 'Let me know when it launches',
  } as L,
  notifyIntro: {
    es: 'Déjanos tus datos y serás de los primeros en tener tu enlace de referido.',
    en: 'Leave your details and you will be among the first to get your referral link.',
  } as L,
}
