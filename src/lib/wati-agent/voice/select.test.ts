import { describe, it, expect } from 'vitest'
import { detectIntent, selectExemplars, filterExemplars, EXEMPLARS, type Exemplar } from './select'

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

describe('filterExemplars', () => {
  const ex = (staff: string): Exemplar => ({ intent: 'pago', sucursal: null, customer: ['hola'], staff: [staff] })

  it('drops a fixture with {codigo}', () => {
    expect(filterExemplars([ex('0343 {codigo} 56 6')])).toEqual([])
  })

  it('drops bank blocks, media captions, uuids and dated promos', () => {
    const dirty = [
      ex('Cuenta Corriente\nRelax Cala S A\nBanco General'),
      ex('...b052ba1dba28 JPEG Caption: promo'),
      ex('5c811184-4ac2-...'),
      ex('Promociones válidas hasta el 31 de mayo'),
      ex('Le enviamos las promos, hasta el 31 de mayo'),
      ex('escríbanos al {telefono}'),
    ]
    expect(filterExemplars(dirty)).toEqual([])
  })

  it('keeps a clean exemplar', () => {
    const clean = ex('Con mucho gusto le agendamos sra {nombre}')
    expect(filterExemplars([clean])).toEqual([clean])
  })

  it('the bundled set is already filtered', () => {
    const all = EXEMPLARS.flatMap(e => [...e.staff, ...e.customer]).join('\n')
    expect(all).not.toContain('{codigo}')
    expect(all).not.toContain('Banco General')
    expect(all).not.toContain('Caption:')
  })
})
