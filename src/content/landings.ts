// Local-SEO landing page copy. Spanish slugs in both locales (site convention);
// hreflang handles the EN alternate.
import { PROGRAM_IDS } from '@/lib/booking/constants'

type L = { es: string; en: string }

export interface LandingFaq {
  q: L
  a: L
}

export interface LandingContent {
  slug: string
  location: 'cde' | 'sfc' | 'both'
  title: L
  metaDescription: L
  h1: L
  intro: L[]
  highlights: L[]
  programIds: number[]
  servicesTitle: L
  faqs: LandingFaq[]
  mapUrl?: string
}

export const LANDINGS: LandingContent[] = [
  {
    slug: 'masajes-costa-del-este',
    location: 'cde',
    title: {
      es: 'Masajes en Costa del Este | Mimosa Spa Retreat',
      en: 'Massages in Costa del Este | Mimosa Spa Retreat',
    },
    metaDescription: {
      es: 'Spa de masajes en Costa del Este, Ciudad de Panamá: masajes relajantes, descontracturantes y rituales signature en Star Plaza, frente al Riba Smith.',
      en: 'Massage spa in Costa del Este, Panama City: relaxing and deep-tissue massages and signature rituals at Star Plaza, across from Riba Smith.',
    },
    h1: { es: 'Masajes en Costa del Este', en: 'Massages in Costa del Este' },
    intro: [
      {
        es: 'A pasos de las torres de Costa del Este, Mimosa Spa Retreat es el refugio donde el barrio corporativo baja las revoluciones. Nuestro spa en Star Plaza, frente al Riba Smith, ofrece masajes relajantes y terapéuticos con terapeutas certificados en un ambiente zen de aromas y música suave.',
        en: 'Steps from the Costa del Este towers, Mimosa Spa Retreat is where the corporate district slows down. Our spa at Star Plaza, across from Riba Smith, offers relaxing and therapeutic massages with certified therapists in a calm, aromatic setting.',
      },
      {
        es: 'Elige entre el clásico Mimosa Relax, el masaje profundo descontracturante, piedras calientes o nuestros rituales signature — de lunes a domingo, con estacionamiento en la plaza.',
        en: 'Choose the classic Mimosa Relax, a deep-tissue massage, hot stones or our signature rituals — open every day, with plaza parking.',
      },
    ],
    highlights: [
      { es: 'Terapeutas certificados y cabinas privadas', en: 'Certified therapists and private cabins' },
      { es: 'Frente al Riba Smith de Costa del Este', en: 'Across from Riba Smith in Costa del Este' },
      { es: 'Reserva en línea o por WhatsApp en minutos', en: 'Book online or via WhatsApp in minutes' },
    ],
    programIds: [PROGRAM_IDS.PAQUETES_DELUXE, PROGRAM_IDS.TRATAMIENTOS_CORPORALES],
    servicesTitle: { es: 'Nuestros masajes', en: 'Our massages' },
    faqs: [
      {
        q: { es: '¿Dónde están ubicados en Costa del Este?', en: 'Where are you located in Costa del Este?' },
        a: {
          es: 'En Star Plaza, frente al Riba Smith. También tenemos sede en San Francisco, Calle 74E.',
          en: 'At Star Plaza, across from Riba Smith. We also have a location in San Francisco, Calle 74E.',
        },
      },
      {
        q: { es: '¿Necesito reservar con anticipación?', en: 'Do I need to book in advance?' },
        a: {
          es: 'Recomendamos reservar por WhatsApp o en línea, especialmente para fines de semana. Entre semana solemos tener disponibilidad el mismo día.',
          en: 'We recommend booking via WhatsApp or online, especially for weekends. On weekdays we usually have same-day availability.',
        },
      },
    ],
    mapUrl: 'https://maps.app.goo.gl/5iX28mGH2mxUiJJ1A',
  },
  {
    slug: 'spa-san-francisco',
    location: 'sfc',
    title: {
      es: 'Spa en San Francisco, Panamá | Mimosa Spa Retreat',
      en: 'Spa in San Francisco, Panama | Mimosa Spa Retreat',
    },
    metaDescription: {
      es: 'Spa en San Francisco, Ciudad de Panamá: masajes, faciales y rituales en Calle 74E, al lado de la Delta de Calle 50. Reserva en línea o por WhatsApp.',
      en: 'Spa in San Francisco, Panama City: massages, facials and rituals on Calle 74E, next to the Delta on Calle 50. Book online or via WhatsApp.',
    },
    h1: { es: 'Tu spa en San Francisco', en: 'Your spa in San Francisco' },
    intro: [
      {
        es: 'Nuestra sede de San Francisco trae la experiencia Mimosa al corazón residencial de la ciudad: cabinas amplias, cabinas dobles para parejas y el mismo estándar de servicio que nos hizo el spa mejor calificado de Costa del Este.',
        en: 'Our San Francisco location brings the Mimosa experience to the heart of the city: spacious cabins, double cabins for couples and the same standard that made us the top-rated spa in Costa del Este.',
      },
      {
        es: 'Estamos en Calle 74E, al lado de la Delta de Calle 50 — a minutos de Punta Pacífica, Coco del Mar y Obarrio.',
        en: 'Find us on Calle 74E, next to the Delta on Calle 50 — minutes from Punta Pacífica, Coco del Mar and Obarrio.',
      },
    ],
    highlights: [
      { es: 'Cabinas dobles para parejas', en: 'Double cabins for couples' },
      { es: 'Masajes, faciales y rituales signature', en: 'Massages, facials and signature rituals' },
      { es: 'Abierto todos los días', en: 'Open every day' },
    ],
    programIds: [PROGRAM_IDS.PAQUETES_DELUXE, PROGRAM_IDS.TRATAMIENTOS_CORPORALES],
    servicesTitle: { es: 'Tratamientos disponibles', en: 'Available treatments' },
    faqs: [
      {
        q: { es: '¿Tienen estacionamiento?', en: 'Is parking available?' },
        a: {
          es: 'Sí, contamos con opciones de estacionamiento cercanas sobre Calle 74E.',
          en: 'Yes, there are parking options nearby on Calle 74E.',
        },
      },
      {
        q: { es: '¿Atienden parejas?', en: 'Do you host couples?' },
        a: {
          es: 'Sí — San Francisco cuenta con cabinas dobles. Mira nuestra página de Parejas y Ocasiones.',
          en: 'Yes — San Francisco has double cabins. See our Couples & Occasions page.',
        },
      },
    ],
    mapUrl: 'https://maps.app.goo.gl/sgT9VCx6DZBoy5wn6',
  },
  {
    slug: 'masaje-de-parejas-panama',
    location: 'both',
    title: {
      es: 'Masaje de Parejas en Panamá | Mimosa Spa Retreat',
      en: 'Couples Massage in Panama | Mimosa Spa Retreat',
    },
    metaDescription: {
      es: 'Masajes de parejas en Ciudad de Panamá en cabina doble: rituales románticos, aniversarios y ocasiones especiales en Costa del Este y San Francisco.',
      en: 'Couples massages in Panama City in double cabins: romantic rituals, anniversaries and special occasions in Costa del Este and San Francisco.',
    },
    h1: { es: 'Masaje de parejas en Panamá', en: 'Couples massage in Panama' },
    intro: [
      {
        es: 'Con siete cabinas dobles entre Costa del Este y San Francisco, Mimosa es el lugar para desconectarse en pareja: masajes lado a lado, aromaterapia y rituales que terminan con una ceremonia de té.',
        en: 'With seven double cabins across Costa del Este and San Francisco, Mimosa is the place to disconnect together: side-by-side massages, aromatherapy and rituals that end with a tea ceremony.',
      },
      {
        es: 'Perfecto para aniversarios, San Valentín, cumpleaños o simplemente una cita diferente. Reserva tu cabina doble por WhatsApp.',
        en: 'Perfect for anniversaries, Valentine’s, birthdays or simply a different kind of date. Book your double cabin via WhatsApp.',
      },
    ],
    highlights: [
      { es: '7 cabinas dobles en 2 ubicaciones', en: '7 double cabins across 2 locations' },
      { es: 'Rituales románticos con cava y chocolates', en: 'Romantic rituals with cava and chocolates' },
      { es: 'Gift cards para regalar la experiencia', en: 'Gift cards to gift the experience' },
    ],
    programIds: [PROGRAM_IDS.TRATAMIENTOS_PAREJAS, PROGRAM_IDS.PAREJAS],
    servicesTitle: { es: 'Masajes para dos', en: 'Massages for two' },
    faqs: [
      {
        q: { es: '¿Puedo regalar un masaje de parejas?', en: 'Can I gift a couples massage?' },
        a: {
          es: 'Sí — nuestras gift cards pueden emitirse por el valor de cualquier ritual en pareja.',
          en: 'Yes — our gift cards can be issued for the value of any couples ritual.',
        },
      },
      {
        q: { es: '¿Cómo reservo una cabina doble?', en: 'How do I book a double cabin?' },
        a: {
          es: 'Escríbenos por WhatsApp con la fecha y hora deseada y confirmamos tu cabina doble.',
          en: 'Message us on WhatsApp with your preferred date and time and we will confirm your double cabin.',
        },
      },
    ],
  },
  {
    slug: 'drenaje-linfatico-panama',
    location: 'both',
    title: {
      es: 'Drenaje Linfático en Panamá | Mimosa Spa Retreat',
      en: 'Lymphatic Drainage in Panama | Mimosa Spa Retreat',
    },
    metaDescription: {
      es: 'Drenaje linfático manual en Ciudad de Panamá: reduce retención de líquidos, apoya el post-operatorio y mejora la circulación. Costa del Este y San Francisco.',
      en: 'Manual lymphatic drainage in Panama City: reduce fluid retention, support post-op recovery and improve circulation. Costa del Este and San Francisco.',
    },
    h1: { es: 'Drenaje linfático en Panamá', en: 'Lymphatic drainage in Panama' },
    intro: [
      {
        es: 'El drenaje linfático manual es una técnica suave y rítmica que estimula el sistema linfático para reducir la retención de líquidos, desinflamar y apoyar la recuperación post-operatoria.',
        en: 'Manual lymphatic drainage is a gentle, rhythmic technique that stimulates the lymphatic system to reduce fluid retention, de-bloat and support post-operative recovery.',
      },
      {
        es: 'En Mimosa lo realizan terapeutas con formación específica, en sesiones individuales o en planes de varias sesiones para resultados sostenidos.',
        en: 'At Mimosa it is performed by specifically trained therapists, in single sessions or multi-session plans for lasting results.',
      },
    ],
    highlights: [
      { es: 'Técnica manual, suave y segura', en: 'Gentle, safe manual technique' },
      { es: 'Ideal post-operatorio y retención de líquidos', en: 'Ideal for post-op recovery and fluid retention' },
      { es: 'Planes de varias sesiones disponibles', en: 'Multi-session plans available' },
    ],
    programIds: [PROGRAM_IDS.TRATAMIENTOS_CORPORALES],
    servicesTitle: { es: 'Tratamientos corporales relacionados', en: 'Related body treatments' },
    faqs: [
      {
        q: { es: '¿Cuántas sesiones necesito?', en: 'How many sessions do I need?' },
        a: {
          es: 'Depende del objetivo: para bienestar general 1–2 sesiones al mes; para post-operatorio se suelen recomendar planes de 5 a 10 sesiones.',
          en: 'It depends on your goal: for general wellness 1–2 sessions per month; for post-op recovery, 5 to 10 session plans are typical.',
        },
      },
      {
        q: { es: '¿Es doloroso?', en: 'Is it painful?' },
        a: {
          es: 'No — es una técnica de presión suave, muy diferente a un masaje descontracturante.',
          en: 'No — it is a light-pressure technique, very different from a deep-tissue massage.',
        },
      },
    ],
  },
]
