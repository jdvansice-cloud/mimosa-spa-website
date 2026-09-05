export type TriggerResult = { handoff: true; motivo: string } | { handoff: false }

/** Lowercase + strip accents, for accent/case-insensitive matching. */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const MANIPULACION_RULES: RegExp[] = [
  /\bignora (tus|las) instrucciones\b/,
  /\bolvida (tus|las) instrucciones\b/,
  /\bsystem prompt\b/,
  /\bprompt del sistema\b/,
  /\bmodo desarrollador\b/,
  /\bdeveloper mode\b/,
  /\bjailbreak\b/,
  /\bact[ua]a como (un|una) (ia|ai|modelo)\b/,
  /\beres chatgpt\b/,
  /\beres claude\b/,
  /\bque modelo\b/,
  /\bmuestrame tus instrucciones\b/,
]

const RULES: Array<{ motivo: string; re: RegExp }> = [
  { motivo: 'certificado', re: /\b(certificado|gift ?cards?|tarjeta de regalo|bono de regalo|voucher)\b/i },
  { motivo: 'queja', re: /\b(queja|reclamo|p[ée]simo|molest[oa]|inaceptable|reembolso|devoluci[oó]n|denuncia)\b/i },
  { motivo: 'terapeuta', re: /\b(con la (misma )?terapeuta|con (la|el) (se[ñn]ora?|se[ñn]orita|muchacha) [A-ZÁÉÍÓÚ][a-záéíóú]+|terapeuta [A-ZÁÉÍÓÚ][a-záéíóú]+)\b/ },
  { motivo: 'medico', re: /\b(embaraz|lesi[oó]n|cirug[ií]a|hernia|fractura|m[ée]dic[oa]|trombo|cancer|c[áa]ncer)\b/i },
  { motivo: 'es_bot', re: /\b(eres|sos|es usted|hablo con)\s+(un|una)?\s*(bot|robot|m[áa]quina|ia|inteligencia artificial|asistente virtual)\b/i },
]

export function checkTriggers(input: { type: string; text: string | null; audioCount: number }): TriggerResult {
  const type = (input.type || 'text').toLowerCase()
  if (['image', 'document', 'video', 'sticker'].includes(type)) return { handoff: true, motivo: 'comprobante_o_imagen' }
  if (type === 'audio' || type === 'voice') return input.audioCount >= 2 ? { handoff: true, motivo: 'audio' } : { handoff: false }
  const text = input.text || ''
  const people = text.match(/\b(somos|para|de)\s+(\d+)\s+(personas?|pax|amigas?|chicas?)\b/i)
  if (people && Number(people[2]) >= 3) return { handoff: true, motivo: 'grupo' }
  const normalized = normalize(text)
  for (const re of MANIPULACION_RULES) if (re.test(normalized)) return { handoff: true, motivo: 'manipulacion' }
  for (const r of RULES) if (r.re.test(text)) return { handoff: true, motivo: r.motivo }
  return { handoff: false }
}
