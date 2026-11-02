import { describe, it, expect } from 'vitest'
import { buildGiftCardLine, giftCardChildRow } from './giftCardItems'

const item = { id: 'i1', kind: 'monetary' as const, name_es: 'Gift Card $50', name_en: 'Gift Card $50', amount_cents: 5000, is_active: true, default_design_slug: 'general' }
const exp = { ...item, id: 'i2', kind: 'experience' as const, amount_cents: 10000, treatment_names: ['Mimosa Relax'] }
const opts = { whatsappEnabled: false, todayIso: '2026-11-02' }

describe('buildGiftCardLine', () => {
  it('builds an email-delivery monetary line', () => {
    const r = buildGiftCardLine({ catalogItemId: 'i1', recipientName: ' María ', recipientEmail: 'maria@example.com', deliveryMethod: 'email', message: 'Feliz cumple' }, item, opts)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.line).toMatchObject({ kind: 'monetary', unitPriceCents: 5000, taxCents: 0, taxRateCode: '00', recipientName: 'María', recipientEmail: 'maria@example.com', deliveryMethod: 'email', deliveryEmail: true, deliveryWhatsapp: false, designSlug: 'general', deliveryDate: null })
    }
  })
  it('experience cards carry 7% and treatment names', () => {
    const r = buildGiftCardLine({ catalogItemId: 'i2', recipientName: 'Ana', deliveryMethod: 'self' }, exp, opts)
    expect(r.ok && r.line.taxRateCode).toBe('01')
    expect(r.ok && r.line.taxCents).toBe(700)
    expect(r.ok && r.line.unitPriceCents).toBe(10700)
    expect(r.ok && r.line.treatmentNames).toEqual(['Mimosa Relax'])
  })
  it('rejects unknown/inactive items and missing recipient name', () => {
    expect(buildGiftCardLine({ catalogItemId: 'x' }, undefined, opts)).toEqual({ ok: false, error: 'Gift card no disponible' })
    expect(buildGiftCardLine({ catalogItemId: 'i1' }, { ...item, is_active: false }, opts)).toEqual({ ok: false, error: 'Gift card no disponible' })
    expect(buildGiftCardLine({ catalogItemId: 'i1', recipientEmail: 'a@b.co', deliveryMethod: 'email' }, item, opts)).toEqual({ ok: false, error: 'Indica el nombre de quien recibe' })
  })
  it('passes resolveDelivery errors through and blocks whatsapp while disabled', () => {
    expect(buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', deliveryMethod: 'email' }, item, opts)).toEqual({ ok: false, error: 'Indica el correo de quien recibe' })
    expect(buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', deliveryMethod: 'whatsapp', recipientPhone: '+507 6000-0000' }, item, opts)).toEqual({ ok: false, error: 'La entrega por WhatsApp no está disponible todavía.' })
    const ok = buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', deliveryMethod: 'whatsapp', recipientPhone: '+507 6000-0000' }, item, { ...opts, whatsappEnabled: true })
    expect(ok.ok && ok.line.deliveryWhatsapp).toBe(true)
    expect(ok.ok && ok.line.recipientPhone).toBe('50760000000')
  })
  it('drops past and self-delivery dates, keeps future email dates', () => {
    const past = buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', recipientEmail: 'a@b.co', deliveryMethod: 'email', deliveryDate: '2026-11-01' }, item, opts)
    expect(past).toEqual({ ok: false, error: 'La fecha de envío debe ser hoy o después' })
    const self = buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', deliveryMethod: 'self', deliveryDate: '2026-12-01' }, item, opts)
    expect(self.ok && self.line.deliveryDate).toBeNull()
    const fut = buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', recipientEmail: 'a@b.co', deliveryMethod: 'email', deliveryDate: '2026-12-01' }, item, opts)
    expect(fut.ok && fut.line.deliveryDate).toBe('2026-12-01')
  })
  it('enforces trim limits and the design slug fallback chain', () => {
    const base = { catalogItemId: 'i1', deliveryMethod: 'self' as const }
    expect(buildGiftCardLine({ ...base, recipientName: 'x'.repeat(121) }, item, opts)).toEqual({ ok: false, error: 'Indica el nombre de quien recibe' })
    expect(buildGiftCardLine({ ...base, recipientName: '   ' }, item, opts)).toEqual({ ok: false, error: 'Indica el nombre de quien recibe' })
    const long = buildGiftCardLine({ ...base, recipientName: 'A', message: 'm'.repeat(301) }, item, opts)
    expect(long.ok && long.line.message).toBe('m'.repeat(300))
    const blank = buildGiftCardLine({ ...base, recipientName: 'A', message: '   ' }, item, opts)
    expect(blank.ok && blank.line.message).toBeNull()
    const edge = buildGiftCardLine({ ...base, recipientName: 'A', message: `  ${'m'.repeat(300)}  ` }, item, opts)
    expect(edge.ok && edge.line.message).toBe('m'.repeat(300))
    const picked = buildGiftCardLine({ ...base, recipientName: 'A', designSlug: 'navidad' }, { ...item, default_design_slug: 'cumple' }, opts)
    expect(picked.ok && picked.line.designSlug).toBe('navidad')
    const dflt = buildGiftCardLine({ ...base, recipientName: 'A' }, { ...item, default_design_slug: 'cumple' }, opts)
    expect(dflt.ok && dflt.line.designSlug).toBe('cumple')
    const none = buildGiftCardLine({ ...base, recipientName: 'A' }, { ...item, default_design_slug: null }, opts)
    expect(none.ok && none.line.designSlug).toBe('general')
  })
  it('accepts today as a delivery date and rejects malformed dates', () => {
    const today = buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', recipientEmail: 'a@b.co', deliveryMethod: 'email', deliveryDate: '2026-11-02' }, item, opts)
    expect(today.ok && today.line.deliveryDate).toBe('2026-11-02')
    const bad = buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', recipientEmail: 'a@b.co', deliveryMethod: 'email', deliveryDate: '02/12/2026' }, item, opts)
    expect(bad).toEqual({ ok: false, error: 'Fecha de envío inválida' })
  })
  it('rejects calendar-invalid dates (rollover and out-of-range) on schedulable channels', () => {
    const email = (deliveryDate: string) => buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', recipientEmail: 'a@b.co', deliveryMethod: 'email', deliveryDate }, item, opts)
    expect(email('2026-02-31')).toEqual({ ok: false, error: 'Fecha de envío inválida' })
    expect(email('2026-13-45')).toEqual({ ok: false, error: 'Fecha de envío inválida' })
    expect(email('2026-12-32')).toEqual({ ok: false, error: 'Fecha de envío inválida' })
    expect(email('2027-02-29')).toEqual({ ok: false, error: 'Fecha de envío inválida' })
    const leap = email('2028-02-29')
    expect(leap.ok && leap.line.deliveryDate).toBe('2028-02-29')
    // whatsapp is schedulable too
    const wa = buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', deliveryMethod: 'whatsapp', recipientPhone: '50760000000', deliveryDate: '2026-02-31' }, item, { ...opts, whatsappEnabled: true })
    expect(wa).toEqual({ ok: false, error: 'Fecha de envío inválida' })
  })
  it('self delivery drops any date silently, even a past or malformed one', () => {
    const self = (deliveryDate: string) => buildGiftCardLine({ catalogItemId: 'i1', recipientName: 'A', deliveryMethod: 'self', deliveryDate }, item, opts)
    const past = self('2026-11-01')
    expect(past.ok && past.line.deliveryDate).toBeNull()
    const malformed = self('not-a-date')
    expect(malformed.ok && malformed.line.deliveryDate).toBeNull()
    const impossible = self('2026-13-45')
    expect(impossible.ok && impossible.line.deliveryDate).toBeNull()
  })
})

describe('giftCardChildRow', () => {
  const base = {
    orderNumber: 'MO-001234', index: 0,
    order: { buyer_name: 'Juan', buyer_email: 'juan@x.co', buyer_phone: '50761111111', locale: 'es', location_id: 2, hasServices: false },
    item: { gc_catalog_item_id: 'i1', name_es: 'Gift Card $50', total_cents: 5000, tax_cents: 0, gc_recipient_name: 'María', gc_recipient_email: null, gc_recipient_phone: '50760000000', gc_delivery_method: 'whatsapp', gc_message: 'Hola', gc_delivery_date: '2026-12-01', gc_design_slug: 'navidad' },
    catalog: { kind: 'monetary' as const }, payment: { tilopay_tpt: 'TPT1', tilopay_method: 'card|crd|visa' }, nowIso: '2026-11-02T15:00:00.000Z',
  }
  it('maps a whatsapp card', () => {
    expect(giftCardChildRow(base)).toMatchObject({ order_number: 'MO-001234-G1', status: 'paid', item_kind: 'monetary', base_amount_cents: 5000, itbms_cents: 0, recipient_phone: '50760000000', delivery_email: false, delivery_whatsapp: true, scheduled_send_at: '2026-12-01T14:00:00.000Z', design_slug: 'navidad', mindbody_location_id: null, tilopay_tpt: 'TPT1' })
  })
  it('defaults: email when an email exists, self otherwise; experience kind + names; location with services', () => {
    const e = giftCardChildRow({ ...base, item: { ...base.item, gc_recipient_email: 'm@x.co', gc_recipient_phone: null, gc_delivery_method: null }, catalog: { kind: 'experience', treatment_names: ['Relax'] }, order: { ...base.order, hasServices: true } })
    expect(e).toMatchObject({ delivery_email: true, delivery_whatsapp: false, item_kind: 'experience', gift_treatment_names: ['Relax'], mindbody_location_id: 2 })
    const s = giftCardChildRow({ ...base, item: { ...base.item, gc_recipient_email: null, gc_recipient_phone: null, gc_delivery_method: null } })
    expect(s).toMatchObject({ delivery_email: false, delivery_whatsapp: false, recipient_name: 'María' })
  })
})
