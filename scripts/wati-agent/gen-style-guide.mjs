// Regenerates src/lib/wati-agent/voice/style-guide.ts from style-guide.md.
// Usage: node scripts/wati-agent/gen-style-guide.mjs
import fs from 'node:fs'

const md = fs.readFileSync('src/lib/wati-agent/voice/style-guide.md', 'utf8')
const header = '// GENERATED from style-guide.md — do not edit by hand.\n// Regenerate: node scripts/wati-agent/gen-style-guide.mjs\n'
fs.writeFileSync('src/lib/wati-agent/voice/style-guide.ts', header + 'export const STYLE_GUIDE = ' + JSON.stringify(md) + '\n')
console.log('style-guide.ts regenerated (%d chars)', md.length)
