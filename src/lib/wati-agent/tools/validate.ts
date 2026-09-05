const YES = /\b(s[ií]|claro|dale|perfecto|listo|ok|okey|confirm|de acuerdo|correcto|exacto|va)\b/i

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
}

/** recentInbound: the last customer texts, newest last. The quoted yes must actually be in them. */
export function requireConfirmation(input: { customer_confirmation?: string }, recentInbound: string[] = []): string | null {
  const c = (input.customer_confirmation || '').trim()
  const norm = normalize(c)
  if (!c || !YES.test(norm) || /\bno\b/i.test(norm)) return 'Falta la confirmación explícita del cliente. Envía el resumen y espera un "sí" antes de llamar esta herramienta.'
  const said = normalize(recentInbound.join(' \n '))
  if (!said.includes(norm)) return 'La confirmación debe ser el texto exacto que escribió el cliente'
  return null
}

export function pairSlotsForCouple(slots: Array<{ time: string; staffIds: number[] }>): string[] {
  return slots.filter(s => new Set(s.staffIds).size >= 2).map(s => s.time)
}
