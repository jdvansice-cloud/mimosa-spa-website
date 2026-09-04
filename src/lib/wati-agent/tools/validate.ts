const YES = /\b(s[ií]|claro|dale|perfecto|listo|ok|okey|confirm|de acuerdo|correcto|exacto|va)\b/i

export function requireConfirmation(input: { customer_confirmation?: string }): string | null {
  const c = (input.customer_confirmation || '').trim()
  const norm = c.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  if (!c || !YES.test(norm) || /\bno\b/i.test(norm)) return 'Falta la confirmación explícita del cliente. Envía el resumen y espera un "sí" antes de llamar esta herramienta.'
  return null
}

export function checkNoticePolicy(startIso: string, now: Date, hours = 24): string | null {
  const diff = (new Date(startIso).getTime() - now.getTime()) / 3600_000
  return diff < hours ? `La cita empieza en menos de ${hours} horas; por política no se puede cambiar ni cancelar por este medio.` : null
}

export function pairSlotsForCouple(slots: Array<{ time: string; staffIds: number[] }>): string[] {
  return slots.filter(s => new Set(s.staffIds).size >= 2).map(s => s.time)
}
