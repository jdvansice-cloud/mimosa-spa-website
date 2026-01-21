/**
 * Script to update treatment descriptions in Supabase from CSV
 *
 * This script reads the admin_treatments.csv file and updates
 * the treatment descriptions in the Supabase treatment_settings table.
 *
 * Usage: npx ts-node scripts/update-treatment-descriptions.ts
 * Or run via: npm run update-descriptions (after adding to package.json)
 */

import * as fs from 'fs'
import * as path from 'path'

// CSV parsing function
function parseCSV(content: string): Array<Record<string, string>> {
  const lines = content.split('\n')
  const headers = parseCSVLine(lines[0])
  const results: Array<Record<string, string>> = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = parseCSVLine(line)
    const row: Record<string, string> = {}

    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })

    results.push(row)
  }

  return results
}

// Parse a single CSV line handling quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

interface TreatmentUpdate {
  name: string
  currentDescription: string
  proposedDescription: string
}

async function main() {
  // Read the CSV file
  const csvPath = path.join(__dirname, '..', 'admin_treatments.csv')

  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found:', csvPath)
    process.exit(1)
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const treatments = parseCSV(csvContent)

  console.log(`Loaded ${treatments.length} treatments from CSV`)

  // Filter treatments that have proposed descriptions different from current
  const updates: TreatmentUpdate[] = treatments
    .filter(t => {
      const current = t['Current Description'] || ''
      const proposed = t['Proposed Description'] || ''
      // Only update if proposed is different and not empty
      return proposed && proposed !== current && proposed !== '(sin descripción)'
    })
    .map(t => ({
      name: t['Treatment Name'],
      currentDescription: t['Current Description'] || '',
      proposedDescription: t['Proposed Description']
    }))

  console.log(`Found ${updates.length} treatments with new descriptions to update`)

  // Create a map of treatment names to proposed descriptions
  const descriptionMap = new Map<string, string>()
  updates.forEach(u => {
    descriptionMap.set(u.name, u.proposedDescription)
  })

  // Fetch current treatments from API
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  console.log(`Fetching current treatments from ${baseUrl}/api/admin/treatments...`)

  const response = await fetch(`${baseUrl}/api/admin/treatments`)

  if (!response.ok) {
    console.error('Failed to fetch treatments:', response.status, response.statusText)
    process.exit(1)
  }

  const data = await response.json()
  const currentTreatments = data.treatments || []

  console.log(`Fetched ${currentTreatments.length} treatments from API`)

  // Match treatments by name and update descriptions
  let matchCount = 0
  const updatedTreatments = currentTreatments.map((treatment: any) => {
    const newDescription = descriptionMap.get(treatment.service_name)

    if (newDescription) {
      matchCount++
      console.log(`  Updating: ${treatment.service_name}`)
      return {
        ...treatment,
        description: newDescription
      }
    }

    return treatment
  })

  console.log(`Matched ${matchCount} treatments for description update`)

  if (matchCount === 0) {
    console.log('No treatments matched. Check that treatment names in CSV match the API.')
    console.log('\nSample API treatment names:')
    currentTreatments.slice(0, 10).forEach((t: any) => console.log(`  - ${t.service_name}`))
    console.log('\nSample CSV treatment names:')
    updates.slice(0, 10).forEach(u => console.log(`  - ${u.name}`))
    process.exit(0)
  }

  // Send updated treatments to API
  console.log('\nSending updates to API...')

  const updateResponse = await fetch(`${baseUrl}/api/admin/treatments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ treatments: updatedTreatments })
  })

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text()
    console.error('Failed to update treatments:', updateResponse.status, errorText)
    process.exit(1)
  }

  const result = await updateResponse.json()

  if (result.success) {
    console.log(`\nSuccessfully updated ${matchCount} treatment descriptions!`)
  } else {
    console.error('Update failed:', result.error)
  }
}

main().catch(console.error)
