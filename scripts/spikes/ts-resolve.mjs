// Minimal ESM resolver so scripts can import the app's extensionless .ts modules.
import { existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve as resolvePath } from 'node:path'

export async function resolve(specifier, context, next) {
  if (specifier.startsWith('.') && !/\.[cm]?[jt]s$/.test(specifier)) {
    const base = dirname(fileURLToPath(context.parentURL))
    for (const ext of ['.ts', '.tsx', '/index.ts']) {
      const candidate = resolvePath(base, specifier + ext)
      if (existsSync(candidate)) return next(pathToFileURL(candidate).href, context)
    }
  }
  return next(specifier, context)
}
