import crypto from 'crypto'
import { giftshopAdminClient, getShopSettings } from './data'
import { sendEmail, isEmailConfigured } from '@/lib/email/resend'
import { recipientGiftEmail, buyerReceiptEmail } from '@/lib/email/templates/giftcard'
import {
  purchaseGiftCard,
  searchClients,
  addClient,
  getCustomPaymentMethods,
} from '@/lib/booking/mindbody'
import { sendTemplateMessage, isWatiConfigured } from '@/lib/booking/wati'
import { SITE_URL } from '@/lib/nav'

// Idempotent fulfillment pipeline for a PAID gc_orders row. Each step
// checkpoints on columns so a crash mid-way is completed by the cron with no
// duplicate cards, bonus credits or emails.

const BONUS_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // no 0/O/1/I/L

function randomSerial(prefix: string, len = 6): string {
  let out = ''
  const bytes = crypto.randomBytes(len)
  for (let i = 0; i < len; i++) out += BONUS_ALPHABET[bytes[i] % BONUS_ALPHABET.length]
  return `${prefix}-${out}`
}

function viewToken(): string {
  return crypto.randomBytes(16).toString('base64url')
}

// Mindbody custom tender names per Tilopay payment method, so the accountant
// can reconcile Mindbody sales ↔ Tilopay transactions ↔ bank deposits by
// method. These must exist as custom payment methods in Mindbody.
const WEB_TENDERS = {
  yappy: 'Yappy Web',
  visaMc: 'Visa/MC Web',
  amex: 'AMEX Web',
} as const

/**
 * Map the Tilopay authorization to a tender name. Input is the structured
 * "<selected_method>|<crd>|<brand>" stored by the callback (older rows may be
 * unstructured — handled below).
 *
 * Signals, strongest first:
 *  - selected_method: 'yappy' text or Tilopay's Yappy method id (18)
 *  - brand text anywhere: amex/american, visa, master
 *  - masked PAN in crd: 3xxx… = Amex, 4xxx…/5xxx…/2xxx… = Visa/MC
 * Unknown → Visa/MC Web (the most common case; verify per-method during
 * test-mode purchases and adjust if Tilopay's field names differ).
 */
function tenderNameFor(tilopayMethod: string | null): string {
  const raw = (tilopayMethod || '').toLowerCase()
  const [method = '', crd = '', brand = ''] = raw.split('|')

  // Yappy: explicit text, or the bare method id 18 (exact token — never a
  // substring match, which would collide with masked card digits).
  if (raw.includes('yappy')) return WEB_TENDERS.yappy
  if (/^0*18$/.test(method.trim())) return WEB_TENDERS.yappy

  // Brand text (from brand field, method text or crd label)
  if (raw.includes('amex') || raw.includes('american')) return WEB_TENDERS.amex
  if (brand.includes('visa') || brand.includes('master')) return WEB_TENDERS.visaMc
  if (method.includes('visa') || method.includes('master')) return WEB_TENDERS.visaMc

  // Masked PAN heuristic: first digit of the card number in crd
  const firstDigit = crd.replace(/\D/g, '').charAt(0)
  if (firstDigit === '3') return WEB_TENDERS.amex
  if (firstDigit === '4' || firstDigit === '5' || firstDigit === '2') {
    return WEB_TENDERS.visaMc
  }

  return WEB_TENDERS.visaMc
}

/**
 * Resolve the tender for the Mindbody registration. The business uses exactly
 * three Tilopay-linked tenders in Mindbody: "Yappy Web", "Visa/MC Web",
 * "AMEX Web". If the matching one can't be found, we THROW — the order lands
 * in mindbody_status=failed with a clear error and the cron retries, instead
 * of silently posting under a tender the accountant can't reconcile.
 */
async function resolvePaymentInfo(
  tilopayMethod: string | null,
  amountCents: number
): Promise<{ paymentInfo: { Type: string; Metadata?: Record<string, unknown> }; tender: string }> {
  const wanted = tenderNameFor(tilopayMethod)
  const methods = await getCustomPaymentMethods()
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()
  const match = methods.find((m) => norm(m.Name) === norm(wanted))
  if (!match) {
    throw new Error(
      `Custom payment method "${wanted}" not found in Mindbody (have: ${methods
        .map((m) => m.Name)
        .join(', ')})`
    )
  }
  return {
    paymentInfo: {
      Type: 'Custom',
      Metadata: { Id: match.Id, Amount: amountCents / 100 },
    },
    tender: match.Name,
  }
}

export async function fulfillOrder(orderId: string): Promise<void> {
  const supabase = giftshopAdminClient()
  const settings = await getShopSettings()

  const { data: order, error } = await supabase
    .from('gc_orders')
    .select('*')
    .eq('id', orderId)
    .single()
  if (error || !order) throw new Error(`Order not found: ${orderId}`)
  if (order.status !== 'paid' && order.status !== 'fulfilled') return

  let giftCardId: string | null = order.gift_card_id

  // --- Step 1: mint serial + gift_cards row (skip if already done) ---------
  if (!giftCardId) {
    const { data: serialData, error: serialError } = await supabase.rpc(
      'next_online_giftcard_serial'
    )
    if (serialError || !serialData) {
      throw new Error(`Serial mint failed: ${serialError?.message}`)
    }
    const isExperience = order.item_kind === 'experience'
    const { data: card, error: cardError } = await supabase
      .from('gift_cards')
      .insert({
        serial: serialData as string,
        format: 'gift_card',
        channel: 'online',
        buyer_name: order.buyer_name || order.buyer_email,
        buyer_email: order.buyer_email,
        buyer_phone: order.buyer_phone,
        recipient_name: order.recipient_name,
        recipient_email: order.recipient_email,
        amount_cents: order.total_cents,
        base_amount_cents: isExperience ? order.base_amount_cents : null,
        tax_cents: isExperience ? order.itbms_cents : null,
        gift_treatment_names: isExperience && order.item_name ? [order.item_name] : null,
        message: order.gift_message,
        view_token: viewToken(),
        expires_at: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
        print_amount: true,
        print_message: !!order.gift_message,
        print_recipient: true,
        print_treatments: isExperience,
        mindbody_location_id: settings.default_mindbody_location_id,
      })
      .select('id')
      .single()
    if (cardError || !card) throw new Error(`Card insert failed: ${cardError?.message}`)
    giftCardId = card.id
    await supabase.from('gc_orders').update({ gift_card_id: giftCardId }).eq('id', orderId)
  }

  // --- Step 2: Mindbody registration (async, retryable, never blocks) ------
  if (order.mindbody_status === 'pending') {
    await registerInMindbody(orderId, giftCardId!)
  }

  // --- Step 3: bonus card (skip if already issued) --------------------------
  if (!order.bonus_card_id) {
    await maybeIssueBonusCard(orderId, order)
  }

  // --- Step 4: delivery (respects scheduled_send_at) ------------------------
  const scheduled = order.scheduled_send_at && new Date(order.scheduled_send_at) > new Date()
  if (!scheduled) {
    await deliverOrder(orderId)
  }

  await supabase
    .from('gc_orders')
    .update({
      status: 'fulfilled',
      fulfilled_at: order.fulfilled_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
}

async function registerInMindbody(orderId: string, giftCardId: string) {
  const supabase = giftshopAdminClient()
  const settings = await getShopSettings()

  const { data: order } = await supabase.from('gc_orders').select('*').eq('id', orderId).single()
  if (!order) return

  // Catalog item must be mapped to a Mindbody GC product; otherwise the card
  // stays app-native and front desk sells our serial at first redemption.
  const { data: item } = order.catalog_item_id
    ? await supabase
        .from('gc_catalog_items')
        .select('mindbody_giftcard_id, mindbody_layout_id')
        .eq('id', order.catalog_item_id)
        .single()
    : { data: null }

  if (!item?.mindbody_giftcard_id) {
    await supabase
      .from('gc_orders')
      .update({ mindbody_status: 'skipped', mindbody_error: 'No Mindbody GC product mapped' })
      .eq('id', orderId)
    return
  }

  try {
    // Find-or-create the buyer as a Mindbody client.
    let clientId: string | number | undefined
    const found = await searchClients(order.buyer_email)
    if (Array.isArray(found) && found.length > 0) {
      clientId = found[0].Id
    } else {
      const [first, ...rest] = String(order.buyer_name || 'Cliente Web').split(/\s+/)
      const created = await addClient({
        FirstName: first,
        LastName: rest.join(' ') || 'Web',
        Email: order.buyer_email,
        MobilePhone: String(order.buyer_phone || '60000000').replace(/\D/g, '') || '60000000',
      })
      clientId = created?.Id
    }
    if (!clientId) throw new Error('Could not resolve Mindbody client')

    // Tender mirrors how the buyer paid at Tilopay (Yappy Web / Visa/MC Web /
    // AMEX Web) so Mindbody reports reconcile per method against Tilopay.
    const { paymentInfo, tender } = await resolvePaymentInfo(
      order.tilopay_method,
      order.total_cents
    )

    const result = await purchaseGiftCard({
      test: process.env.GIFTCARD_TEST_MODE === '1',
      locationId: settings.default_mindbody_location_id,
      giftCardId: Number(item.mindbody_giftcard_id),
      layoutId: item.mindbody_layout_id ? Number(item.mindbody_layout_id) : undefined,
      purchaserClientId: clientId,
      recipientName: order.recipient_name,
      recipientEmail: order.recipient_email || undefined,
      giftMessage: order.gift_message || undefined,
      title: order.item_name || undefined,
      paymentInfo,
    })

    if (result?.BarcodeId) {
      await supabase
        .from('gift_cards')
        .update({ mindbody_barcode_id: result.BarcodeId })
        .eq('id', giftCardId)
    }
    await supabase
      .from('gc_orders')
      .update({
        mindbody_status: 'registered',
        mindbody_registered_at: new Date().toISOString(),
        mindbody_tender: tender,
        mindbody_error: null,
      })
      .eq('id', orderId)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Mindbody registration failed'
    await supabase
      .from('gc_orders')
      .update({
        mindbody_status: 'failed',
        mindbody_error: msg.slice(0, 500),
        mindbody_attempts: (order.mindbody_attempts ?? 0) + 1,
      })
      .eq('id', orderId)
  }
}

async function maybeIssueBonusCard(
  orderId: string,
  order: { total_cents: number; buyer_name: string | null; buyer_email: string; buyer_phone: string | null }
) {
  const supabase = giftshopAdminClient()
  const now = new Date().toISOString()
  const { data: rules } = await supabase
    .from('bonus_rules')
    .select('*')
    .eq('is_active', true)
    .lte('min_total_cents', order.total_cents)
    .order('bonus_cents', { ascending: false })
    .limit(5)

  const rule = (rules || []).find(
    (r) => (!r.starts_at || r.starts_at <= now) && (!r.ends_at || r.ends_at >= now)
  )
  if (!rule) return

  // Serial collision retry (random alphabet, unique constraint backs us up).
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data: bonus, error } = await supabase
      .from('bonus_cards')
      .insert({
        serial: randomSerial('BN'),
        kind: 'promo',
        amount_cents: rule.bonus_cents,
        owner_name: order.buyer_name,
        owner_email: order.buyer_email,
        owner_phone: order.buyer_phone,
        source_order_id: orderId,
        expires_at: new Date(
          Date.now() + (rule.validity_days ?? 90) * 24 * 3600 * 1000
        ).toISOString(),
        view_token: viewToken(),
      })
      .select('id')
      .single()
    if (!error && bonus) {
      await supabase.from('gc_orders').update({ bonus_card_id: bonus.id }).eq('id', orderId)
      return
    }
    if (error && !/duplicate|unique/i.test(error.message)) return
  }
}

/** Send recipient + buyer emails (and WhatsApp when enabled). Idempotent via sent stamps. */
export async function deliverOrder(orderId: string): Promise<void> {
  const supabase = giftshopAdminClient()
  const settings = await getShopSettings()

  const { data: order } = await supabase.from('gc_orders').select('*').eq('id', orderId).single()
  if (!order || !order.gift_card_id) return

  const { data: card } = await supabase
    .from('gift_cards')
    .select('serial, view_token, mindbody_barcode_id')
    .eq('id', order.gift_card_id)
    .single()
  if (!card?.view_token) return

  const giftUrl = `${SITE_URL}/gift/${card.view_token}`
  const amountLabel = `$${(order.total_cents / 100).toFixed(0)}`
  const itemName = order.item_name || 'Gift Card'
  const buyerName = order.buyer_name || 'Mimosa'

  const forwardText =
    order.locale === 'en'
      ? `A Mimosa Spa gift for you 🎁 ${giftUrl}`
      : `Un regalo de Mimosa Spa para ti 🎁 ${giftUrl}`
  const whatsappForwardUrl = `https://wa.me/?text=${encodeURIComponent(forwardText)}`

  if (!order.email_sent_at && isEmailConfigured()) {
    // Recipient email (when we have one)
    if (order.recipient_email && order.delivery_email) {
      const mail = recipientGiftEmail({
        locale: order.locale || 'es',
        recipientName: order.recipient_name,
        buyerName,
        amountLabel,
        itemName,
        message: order.gift_message,
        giftUrl,
      })
      await sendEmail({ to: order.recipient_email, ...mail, kind: 'gift' })
    }
    // Buyer receipt (always)
    let bonusLabel: string | null = null
    if (order.bonus_card_id) {
      const { data: bonus } = await supabase
        .from('bonus_cards')
        .select('amount_cents, expires_at, serial')
        .eq('id', order.bonus_card_id)
        .single()
      if (bonus) {
        bonusLabel =
          order.locale === 'en'
            ? `Your purchase earned a $${(bonus.amount_cents / 100).toFixed(0)} bonus card (${bonus.serial}), valid until ${new Date(bonus.expires_at).toLocaleDateString('en-US')}.`
            : `Tu compra ganó una bonus card de $${(bonus.amount_cents / 100).toFixed(0)} (${bonus.serial}), válida hasta ${new Date(bonus.expires_at).toLocaleDateString('es-PA')}.`
      }
    }
    const receipt = buyerReceiptEmail({
      locale: order.locale || 'es',
      buyerName,
      recipientName: order.recipient_name,
      amountLabel,
      itemName,
      orderNumber: order.order_number,
      giftUrl,
      whatsappForwardUrl,
      bonusLabel,
      scheduledLabel: order.scheduled_send_at
        ? new Date(order.scheduled_send_at).toLocaleDateString(
            order.locale === 'en' ? 'en-US' : 'es-PA'
          )
        : null,
    })
    const sent = await sendEmail({ to: order.buyer_email, ...receipt, kind: 'purchase' })
    if (sent.ok) {
      await supabase
        .from('gc_orders')
        .update({ email_sent_at: new Date().toISOString() })
        .eq('id', orderId)
    }
    // Internal notification
    if (settings.notify_email) {
      await sendEmail({
        to: settings.notify_email,
        subject: `Venta online: ${itemName} ${amountLabel} (${order.order_number})`,
        html: `<p>Comprador: ${order.buyer_email}<br/>Destinatario: ${order.recipient_name}<br/>Serial: ${card.serial}<br/>Mindbody: ${order.mindbody_status}</p>`,
      })
    }
  }

  // WhatsApp delivery via approved template (opt-in + flag + template approved)
  if (
    !order.whatsapp_sent_at &&
    order.delivery_whatsapp &&
    order.recipient_phone &&
    settings.whatsapp_delivery_enabled &&
    isWatiConfigured()
  ) {
    const res = await sendTemplateMessage(order.recipient_phone, 'giftcard_entrega', [
      { name: '1', value: card.view_token },
      { name: 'nombre', value: order.recipient_name },
      { name: 'remitente', value: buyerName },
      { name: 'monto', value: amountLabel },
    ])
    await supabase
      .from('gc_orders')
      .update(
        res.result
          ? { whatsapp_sent_at: new Date().toISOString(), whatsapp_error: null }
          : { whatsapp_error: (res.error || 'send failed').slice(0, 300) }
      )
      .eq('id', orderId)
  }
}
