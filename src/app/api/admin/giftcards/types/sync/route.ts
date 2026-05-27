import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGiftCardProducts } from '@/lib/booking/mindbody'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Auto-categorize a Mindbody gift card by its name.
 * - Contains "Privilege" → privilege membership
 * - Contains "Certificado" → gift certificate
 * - Else → gift card
 * Case-insensitive on both sides.
 */
function categorizeName(name: string): 'gift_card' | 'certificado' | 'privilege' {
  const n = name.toLowerCase()
  if (n.includes('privilege')) return 'privilege'
  if (n.includes('certificado')) return 'certificado'
  return 'gift_card'
}

/**
 * Derive a default prefix from a name. Strips non-alphanumerics, uppercases,
 * truncates to 8 chars. Conflicts are resolved by appending digits.
 */
function defaultPrefix(name: string, taken: Set<string>): string {
  const base = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8)
  let candidate = base || 'GC'
  let i = 2
  while (taken.has(candidate)) {
    const suffix = String(i++)
    candidate = (base + suffix).slice(-8)
  }
  taken.add(candidate)
  return candidate
}

export async function POST() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  let products
  try {
    products = await getGiftCardProducts()
  } catch (e) {
    console.error('Mindbody getGiftCardProducts failed:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Mindbody error' },
      { status: 502 }
    )
  }

  // Load existing rows so we can update name/value while preserving the
  // staff-edited fields (category, prefix, serial_length, is_active).
  const { data: existing, error: loadError } = await supabase
    .from('gift_card_types')
    .select('id, mindbody_id, prefix')

  if (loadError) {
    return NextResponse.json({ error: loadError.message }, { status: 500 })
  }

  const byMindbodyId = new Map<number, { id: string }>()
  const usedPrefixes = new Set<string>()
  for (const row of existing ?? []) {
    if (row.mindbody_id != null) byMindbodyId.set(row.mindbody_id, { id: row.id })
    if (row.prefix) usedPrefixes.add(row.prefix)
  }

  let created = 0
  let updated = 0
  let errors = 0

  for (const p of products) {
    const existingRow = byMindbodyId.get(p.Id)
    const valueCents = p.Price > 0 ? Math.round(p.Price * 100) : null

    if (existingRow) {
      const { error } = await supabase
        .from('gift_card_types')
        .update({
          name: p.Name,
          value_cents: valueCents,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingRow.id)
      if (error) {
        errors++
        console.error('sync types update error:', error)
      } else {
        updated++
      }
    } else {
      const prefix = defaultPrefix(p.Name, usedPrefixes)
      const { error } = await supabase
        .from('gift_card_types')
        .insert({
          mindbody_id: p.Id,
          name: p.Name,
          value_cents: valueCents,
          category: categorizeName(p.Name),
          prefix,
          serial_length: 6,
          is_active: true,
        })
      if (error) {
        errors++
        console.error('sync types insert error:', error)
      } else {
        created++
      }
    }
  }

  return NextResponse.json({
    fetched: products.length,
    created,
    updated,
    errors,
  })
}
