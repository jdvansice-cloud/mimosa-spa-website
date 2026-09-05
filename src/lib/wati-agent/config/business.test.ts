import { describe, it, expect } from 'vitest'
import { menuLink, MENU_SECTIONS } from './business'

describe('menuLink', () => {
  it('maps every section to its Spanish URL', () => {
    expect(menuLink('menu')).toBe('https://www.mimosaretreat.com/es/menu')
    expect(menuLink('faciales')).toBe('https://www.mimosaretreat.com/es/menu/faciales')
    expect(menuLink('corporales')).toBe('https://www.mimosaretreat.com/es/menu/corporales')
    expect(menuLink('paquetes')).toBe('https://www.mimosaretreat.com/es/menu/paquetes')
    expect(menuLink('promociones')).toBe('https://www.mimosaretreat.com/es/promociones')
    expect(menuLink('parejas')).toBe('https://www.mimosaretreat.com/es/parejas')
    expect(menuLink('reservar')).toBe('https://www.mimosaretreat.com/es/reservar')
  })
  it('falls back to the full menu for anything unknown', () => {
    expect(menuLink('masajes')).toBe('https://www.mimosaretreat.com/es/menu')
    expect(MENU_SECTIONS).toHaveLength(7)
  })
})
