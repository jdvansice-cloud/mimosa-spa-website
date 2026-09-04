/** Digits only, country code first, no '+'. 8-digit numbers are Panamá. */
export function cleanPhone(raw: unknown): string {
  const digits = String(raw ?? '').replace(/\D/g, '')
  if (digits.length === 8) return '507' + digits
  return digits
}
