import { describe, it, expect } from 'vitest'
import { detectIntent, selectExemplars } from './select'

describe('detectIntent', () => {
  it('ubicacion', () => expect(detectIntent('me mandas la ubicación por waze?')).toBe('ubicacion'))
  it('precios', () => expect(detectIntent('cuánto cuesta el masaje relajante')).toBe('precios'))
  it('cambiar beats reservar', () => expect(detectIntent('quiero cambiar mi cita de mañana')).toBe('cambiar'))
  it('saludo', () => expect(detectIntent('Hola buenas')).toBe('saludo'))
})

describe('selectExemplars', () => {
  it('prefers same sucursal and caps', () => {
    const ex = selectExemplars('reservar', 'sfc', 6)
    expect(ex.length).toBeLessThanOrEqual(6)
    expect(ex.every(e => e.intent === 'reservar')).toBe(true)
  })
})
