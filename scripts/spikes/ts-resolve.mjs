// Minimal ESM resolver so scripts can import the app's extensionless .ts
// modules, and the "@/" alias those modules use between themselves.
import { existsSync, readFileSync } from 'node:fs'
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

  // Node's native loader requires an explicit `type: 'json'` import
  // attribute for JSON modules; app source (bundled by webpack/turbopack)
  // imports JSON without one, so scripts loading that source need it added.
  const jsonAttrs = specifier.endsWith('.json') ? { ...context, importAttributes: { ...context.importAttributes, type: 'json' } } : context

  if (specifier.startsWith('.') && !/\.[cm]?[jt]s$/.test(specifier)) {
    const base = dirname(fileURLToPath(context.parentURL))
    const hit = firstExisting(base, specifier)
    if (hit) return next(pathToFileURL(hit).href, jsonAttrs)
  }

  return next(specifier, jsonAttrs)
}

export async function load(url, context, next) {
  // Belt-and-suspenders for the JSON fix above: some Node versions ignore
  // the resolve hook's importAttributes, so short-circuit the load here too.
  if (url.endsWith('.json')) {
    return { format: 'json', source: readFileSync(fileURLToPath(url), 'utf8'), shortCircuit: true }
  }
  return next(url, context)
}
