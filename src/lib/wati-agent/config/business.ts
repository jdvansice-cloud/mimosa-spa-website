import type { Sucursal } from '../types'

export const BUSINESS = {
  brand: 'Mimosa Spa Retreat',
  website: 'https://www.mimosaretreat.com',
  bookingUrl: 'https://www.mimosaretreat.com/es/reservar',
  locations: {
    cde: {
      name: 'Costa del Este',
      mindbodyLocationId: 1,
      plaza: 'Star Plaza, Costa del Este',
      address: 'Star Plaza, Costa del Este, Ciudad de Panamá (código plus 2GFQ+38)',
      wazeUrl: 'https://waze.com/ul/hd1x7rf98x',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=2GFQ%2B38+Panama+City',
      parking: 'Estacionamiento en la plaza.',
    },
    sfc: {
      name: 'San Francisco',
      mindbodyLocationId: 2,
      plaza: 'San Francisco',
      address: 'Calle 74 Este, San Francisco, Ciudad de Panamá (código plus XFVV+8R)',
      wazeUrl: 'https://waze.com/ul/hd1x7nv1vs',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=XFVV%2B8R+Panama+City',
      parking: 'Estacionamiento disponible.',
    },
  } satisfies Record<Sucursal, unknown>,
  hours: {
    weekday: { open: 9, close: 20 },
    weekend: { open: 9, close: 18 },
    text: 'Lun-Vie 9AM-8PM · Sáb-Dom 9AM-6PM',
  },
  policies: {
    changeNoticeHours: 24,
    changeText: 'Para cambios o cancelaciones necesitamos 24 horas de anticipación.',
    arrivalText: 'Le recomendamos llegar 10 minutos antes de su cita.',
  },
  payment: {
    yappyText: 'En YAPPY nos busca en el directorio como MIMOSA (logo de la flor amarilla 🌼).',
    transferText: 'Cuenta Corriente\nRelax Cala S A\n0343 010913 56 6\nBanco General',
  },
} as const

/** Owner-editable overrides stored in the `business_overrides` setting row. */
export interface LocationOverride { address?: string; parking?: string; wazeUrl?: string; mapsUrl?: string }
export type BusinessOverrides = Partial<Record<Sucursal, LocationOverride>>

export const LOCATION_ID_TO_SUCURSAL: Record<number, Sucursal> = { 1: 'cde', 2: 'sfc' }
