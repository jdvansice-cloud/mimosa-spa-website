import { describe, it, expect } from 'vitest'
import { checkTriggers } from './triggers'

const t = (text: string, type = 'text', audioCount = 0) => checkTriggers({ type, text, audioCount })

describe('checkTriggers', () => {
  it('image → comprobante', () => expect(t(null as unknown as string, 'image')).toEqual({ handoff: true, motivo: 'comprobante_o_imagen' }))
  it('first audio passes', () => expect(t(null as unknown as string, 'audio', 1)).toEqual({ handoff: false }))
  it('second audio → audio', () => expect(t(null as unknown as string, 'audio', 2)).toEqual({ handoff: true, motivo: 'audio' }))
  it('gift certificate', () => expect(t('quiero un certificado de regalo')).toEqual({ handoff: true, motivo: 'certificado' }))
  it('gift card english', () => expect(t('do you sell gift cards?')).toEqual({ handoff: true, motivo: 'certificado' }))
  it('complaint', () => expect(t('quiero poner una queja, pésimo servicio')).toEqual({ handoff: true, motivo: 'queja' }))
  it('group of 4', () => expect(t('somos 4 personas para el sábado')).toEqual({ handoff: true, motivo: 'grupo' }))
  it('couple is fine', () => expect(t('somos 2 personas')).toEqual({ handoff: false }))
  it('bot question', () => expect(t('eres un bot?')).toEqual({ handoff: true, motivo: 'es_bot' }))
  it('plain booking passes', () => expect(t('quiero reservar un masaje mañana')).toEqual({ handoff: false }))
})
