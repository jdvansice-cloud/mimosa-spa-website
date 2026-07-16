// ===========================================
// Rule-based expense categorization for bank/card movements.
// Matches against statement description + ACH purpose note (uppercased).
// Order matters: first match wins. 'Sin clasificar' stays visible on the
// dashboard so unmatched spending is never silently absorbed.
// ===========================================

export const INTERNAL_CATEGORIES = new Set([
  'Transferencia interna',
  'Reembolso socios (interno)',
  'Pago de tarjeta (interno)',
  // card tips collected from clients and passed through to therapists —
  // never company revenue, so paying them out is not an expense either
  'Propinas pagadas (interno)',
  // security deposits are an asset (refundable), not a monthly expense
  'Depósitos en garantía (no gasto)',
])

const RULES: Array<[RegExp, string]> = [
  // internal money movements (never expenses)
  [/A FAVOR DE RELAX CALA|ACH - RELAX CALA|RELAX CALA,? ?S\.? ?A/, 'Transferencia interna'],
  [/SU PAGO RECIBIDO/, 'Transferencia interna'],
  [/PAGO .*VISA|ABONO .*VISA|VISA BAC|PAGO \d{4}-\d{2}\*/, 'Pago de tarjeta (interno)'],
  [/PROPINA/, 'Propinas pagadas (interno)'],
  // e.g. "Abono a contrato de arrendamiento de vehículo" = lease guarantee deposit
  [/ABONO A CONTRATO|DEPOSITO DE GARANTIA|DEPÓSITO DE GARANTÍA/, 'Depósitos en garantía (no gasto)'],
  [/REEMBOLSO.*(SOCIO|GABY|MELI)|(GABY|MELI).*REEMBOLSO|REEMBOLSOS VARIOS/, 'Reembolso socios (interno)'],
  // transfers to the partners (personal-paid expense reimbursements)
  [/CAMBEFORT|MELI ?AVILA|AVILA,? MELI/, 'Reembolso socios (interno)'],
  // taxes withheld / bank costs
  [/RETEN\.? SOBRE ITBMS|RETENCION CLAVE|RET LIQ/, 'Retención ITBMS'],
  [/COMISION|COMISIÓN|ITBMS CLAVE|ITBMS L\d|COM LIQ|PROTECCION ROBO|PLAN SALDOS/, 'Comisiones bancarias'],
  // people
  [/CAJA DE SEGURO|\bCSS\b/, 'CSS (cargas sociales)'],
  // "Servicios Profesionales" on transfers = commission-based therapist pay (labor)
  [/VACACIONES|PLANILLA|SALARIO|QUINCENA|DECIMO|DÉCIMO|XIII MES|LIQUIDACION|LIQUIDACIÓN|SERVICIOS PROFESIONALES/, 'Planilla'],
  // fixed costs
  // PANARENTING is a car-leasing company — vehicle costs are NOT spa rent
  [/PANARENTING|VEHICULO|VEHÍCULO/, 'Vehículos'],
  [/ARRENDAMIENTO|ALQUILER|STAR PLAZA/, 'Alquiler'],
  [/MUNICIPIO|TASA UNICA|TASA ÚNICA|\bDGI\b|\bMEF\b|\bANIP\b|MULTA/, 'Impuestos y tasas'],
  [/ENSA|NATURGY|IDAAN|TIGO|\+ ?MOVIL|MAS ?MOVIL|CABLE ONDA|INTERNET|ELECTRICIDAD|\bAGUA\b|\bLUZ\b/, 'Servicios públicos'],
  // operations
  [/POLIZA|PÓLIZA|\bASSA\b|MULTIRIESGO|SEGURO(?!S? SOCIAL)/, 'Seguros'],
  [/PRICESMART|A PLUS SUPPLY|AMAZON|QUICKBOX|HOT EXPRESS|GALLETAS|INSUMO|SUPER ?99|RIBA SMITH|EL MACHETAZO|TOA SUPPLY|EXFOLIANTE|ACEITE|CREMA|MASCARILLA|UTILES|ÚTILES|OFICINA|GIFT ?CARD|PVC/, 'Insumos'],
  [/EQUIPO|PC CELL|RAENCO/, 'Equipamiento'],
  [/CUMPLEAÑ|CENA|ATENCION|ATENCIÓN|RESTAURANTE|TEPANYAKI|PATAGONIA|CATERING|EVENTO/, 'Atenciones y eventos'],
  [/LAVANDERIA|LAVANDERÍA|LAVADO|\bGAS\b|TROPIGAS/, 'Lavandería'],
  [/MANTENIMIENTO|REPARAC|PLOMER|ELECTRICA|ELÉCTRICA|PINTURA|AIRE ACOND|FUMIGA|ARREGLOS|NOVEY|DO IT CENTER|COCHEZ|MATERIALES/, 'Mantenimiento'],
  [/UNIFORME/, 'Uniformes'],
  // services & marketing
  [/MINDBODY|SUPABASE|VERCEL|GOOGLE WORKSPACE|WATI|OPENAI|ANTHROPIC|HAPPY COPY|SOFTWARE/, 'Software y TI'],
  [/FACEBK|FACEBOOK|GOOGLE \*?ADS|MAILCHIMP|PUBLICIDAD|INSTAGRAM|CANVA/, 'Publicidad'],
  [/CONTABLE|HONORARIO|ABOGAD|LEGAL|NOTARIA|NOTARÍA/, 'Honorarios'],
  [/CAPACITACION|CAPACITACIÓN|CURSO|TALLER/, 'Capacitación'],
]

// Bank names stripped before the payroll heuristic (they carry S.A. themselves)
const BANK_NAMES = /(BANCA EN LINEA|BANCA MOVIL|BAC INTERNATIONAL BANK|BANISI|PRIVAL BANK|TOWERBANK INT\.?|MULTIBANK|BANESCO|GLOBAL BANK|CAIXABANK|BANCO GENERAL)( ?,? ?S\.? ?A\.?)?/g
const COMPANY = /S\.? ?A\.?\b|CORP|INC\b|LTDA|S\. ?DE ?R\.?L|FUNDACION|FUNDACIÓN|\bCIA\b/

export function classifyExpense(description: string, note?: string | null): string {
  const text = `${description} ${note ?? ''}`.toUpperCase()
  for (const [re, category] of RULES) {
    if (re.test(text)) return category
  }
  // Heuristic: online transfer to an account held by a person (no corporate
  // suffix once bank names are stripped) → almost always payroll. The ACH
  // purpose notes confirm/override this at import time.
  const stripped = text.replace(BANK_NAMES, ' ')
  if (/TRANSFERENCIA A \d{9,}|\b\d{9,}\b [A-ZÁÉÍÓÚÑ ]{6,}/.test(stripped) && !COMPANY.test(stripped)) {
    return 'Planilla'
  }
  return 'Sin clasificar'
}
