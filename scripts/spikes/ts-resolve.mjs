// Minimal ESM resolver so scripts can import the app's extensionless .ts
// modules, and the "@/" alias those modules use between themselves.
import { existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve as resolvePath } from 'node:path'

const SRC = resolvePath(dirname(fileURLToPath(import.meta.url)), '../../src')
const EXTENSIONS = ['', '.ts', '.tsx', '/index.ts', '/index.tsx']

/** First path that exists, trying each extension the app omits. */
function firstExisting(base, specifier) {
  for (const ext of EXTENSIONS) {
    const candidate = resolvePath(base, specifier + ext)
    if (existsSync(candidate) && !candidate.endsWith('/')) return candidate
  }
  return null
}

export async function resolve(specifier, context, next) {
  // "@/lib/x" → src/lib/x — the tsconfig path alias, which Node knows nothing
  // about. Without this, any app module that imports a sibling by alias is
  // unreachable from a script.
  if (specifier.startsWith('@/')) {
    const hit = firstExisting(SRC, specifier.slice(2))
    if (hit) return next(pathToFileURL(hit).href, context)
  }

  if (specifier.startsWith('.') && !/\.[cm]?[jt]s$/.test(specifier)) {
    const base = dirname(fileURLToPath(context.parentURL))
    const hit = firstExisting(base, specifier)
    if (hit) return next(pathToFileURL(hit).href, context)
  }

  return next(specifier, context)
}
