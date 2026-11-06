import type { BagGiftCard } from '@/lib/bag/store'

/** Maps bag gift cards to the POST /api/checkout `giftCards` payload (undefined/empty fields omitted). */
export function bagGiftCardsToCheckout(items: BagGiftCard[]) {
  return items.map(g => {
    const out: Record<string, unknown> = {
      catalogItemId: g.catalogItemId,
      deliveryMethod: g.deliveryMethod,
    }
    const set = (k: string, v: unknown) => { if (v !== undefined && v !== null && v !== '') out[k] = v }
    set('recipientName', g.recipientName)
    if (g.deliveryMethod === 'email') set('recipientEmail', g.recipientEmail)
    if (g.deliveryMethod === 'whatsapp') set('recipientPhone', g.recipientPhone)
    set('designSlug', g.designSlug)
    set('message', g.message)
    set('deliveryDate', g.deliveryDate)
    return out
  })
}
