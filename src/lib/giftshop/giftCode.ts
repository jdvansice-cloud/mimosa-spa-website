// A gift code arrives on /reservar?gc=CODE from the recipient's card page and
// rides into the Mindbody appointment note so the front desk sees it. It is
// informational only: the POS validates the card when the client pays.
export const GIFT_CODE_STORAGE_KEY = 'mimosa-gc'

const CODE_RE = /^[A-Z0-9-]{4,20}$/

export function sanitizeGiftCode(input: unknown): string | null {
  if (typeof input !== 'string') return null
  const code = input.trim().toUpperCase()
  return CODE_RE.test(code) ? code : null
}

export function readStoredGiftCode(): string | null {
  try {
    return sanitizeGiftCode(window.sessionStorage.getItem(GIFT_CODE_STORAGE_KEY))
  } catch {
    return null
  }
}

export function clearStoredGiftCode(): void {
  try {
    window.sessionStorage.removeItem(GIFT_CODE_STORAGE_KEY)
  } catch {
    // private mode / storage disabled
  }
}
