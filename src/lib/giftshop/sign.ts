import crypto from 'crypto'

/** Short HMAC over the order number so the gracias page can load order details
 *  without enumeration (key: CRON_SECRET). */
export function signOrderNumber(orderNumber: string): string {
  return crypto
    .createHmac('sha256', process.env.CRON_SECRET || 'dev')
    .update(orderNumber)
    .digest('hex')
    .slice(0, 16)
}
