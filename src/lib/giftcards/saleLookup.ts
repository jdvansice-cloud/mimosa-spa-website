import { mindbodyRequest } from '@/lib/booking/mindbody'

/**
 * Find the Mindbody sale that sold a gift card, via the exact link the sales
 * feed provides: PurchasedItems[].GiftCardBarcodeId. No amount-and-date
 * guessing — either the serial appears on a sale item or we report nothing.
 *
 * Scans day by day backwards (the sale is at or shortly before the moment the
 * sync noticed the card), stopping on the first hit.
 */

interface SaleItem {
  GiftCardBarcodeId?: string | null
  Returned?: boolean
}
interface Sale {
  Id: number
  SaleDateTime?: string
  PurchasedItems?: SaleItem[]
  Payments?: Array<{ Type?: string; Amount?: number }>
}

export interface GiftCardSaleInfo {
  saleId: number
  saleDateTime: string | null
  /** Unique tender types joined, e.g. "Visa/MC" or "Efectivo + Gift Card". */
  paymentMethod: string
}

const PAGE = 200
const MAX_PAGES_PER_DAY = 3 // 600 sales/day is far beyond a real day

async function salesOfDay(day: string): Promise<Sale[]> {
  const out: Sale[] = []
  for (let offset = 0; offset < PAGE * MAX_PAGES_PER_DAY; offset += PAGE) {
    const res = await mindbodyRequest<{ Sales?: Sale[] }>('/sale/sales', {
      params: {
        startSaleDateTime: `${day}T00:00:00`,
        endSaleDateTime: `${day}T23:59:59`,
        limit: PAGE,
        offset,
      },
    })
    const page = res?.Sales ?? []
    out.push(...page)
    if (page.length < PAGE) break
  }
  return out
}

function paymentLabel(sale: Sale): string {
  const types = [
    ...new Set(
      (sale.Payments ?? [])
        .filter(p => (p.Amount ?? 0) !== 0 && p.Type)
        .map(p => p.Type!.trim())
    ),
  ]
  return types.join(' + ') || 'Desconocido'
}

/**
 * @param serials the card's serial and (if different) its Mindbody BarcodeId
 * @param daysBack how many days to scan backwards from today
 * @param dayCache share one cache across a batch so a cron run scanning many
 *   cards fetches each day's sales once, not once per card
 */
export async function findGiftCardSale(
  serials: Array<string | null | undefined>,
  daysBack = 14,
  dayCache?: Map<string, Sale[]>
): Promise<GiftCardSaleInfo | null> {
  const wanted = new Set(serials.filter((x): x is string => !!x))
  if (wanted.size === 0) return null
  const cache = dayCache ?? new Map<string, Sale[]>()

  for (let back = 0; back < daysBack; back++) {
    const day = new Date(Date.now() - back * 86400000).toISOString().slice(0, 10)
    if (!cache.has(day)) cache.set(day, await salesOfDay(day))

    for (const sale of cache.get(day)!) {
      const hit = (sale.PurchasedItems ?? []).find(
        i => !i.Returned && i.GiftCardBarcodeId && wanted.has(i.GiftCardBarcodeId)
      )
      if (hit) {
        return {
          saleId: sale.Id,
          saleDateTime: sale.SaleDateTime ?? null,
          paymentMethod: paymentLabel(sale),
        }
      }
    }
  }
  return null
}
