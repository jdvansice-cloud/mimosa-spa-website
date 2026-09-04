import { describe, it, expect } from 'vitest'
import { scrub } from './scrub'

describe('scrub', () => {
  it('removes emails, phones, otp codes', () => {
    expect(scrub('escríbame a ana.b@gmail.com o al 6612-4546, código 292411')).toBe('escríbame a {correo} o al {telefono}, código {codigo}')
  })
})
