const KEY_RE = /^[a-z0-9][a-z0-9_-]{1,39}$/

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_PDF_BYTES = 20 * 1024 * 1024

const ALLOWED_TYPES: Record<string, number> = {
  'image/jpeg': MAX_IMAGE_BYTES,
  'image/png': MAX_IMAGE_BYTES,
  'image/webp': MAX_IMAGE_BYTES,
  'application/pdf': MAX_PDF_BYTES,
}

/**
 * Validates and normalizes a media `key`. Returns the normalized (lowercased,
 * trimmed) key when it matches the allowed pattern, or null otherwise.
 */
export function validateMediaKey(key: unknown): string | null {
  if (typeof key !== 'string') return null
  const normalized = key.trim().toLowerCase()
  if (!KEY_RE.test(normalized)) return null
  return normalized
}

/**
 * Validates a file's MIME type and size. Returns a Spanish error message
 * when invalid, or null when the file is acceptable.
 */
export function validateMediaFile(f: { type: string; size: number }): string | null {
  const maxBytes = ALLOWED_TYPES[f.type]
  if (maxBytes === undefined) {
    return 'tipo de archivo no permitido: use JPEG, PNG, WEBP o PDF'
  }
  if (f.size > maxBytes) {
    const maxMb = maxBytes / (1024 * 1024)
    return `archivo demasiado grande: máximo ${maxMb} MB para este tipo`
  }
  return null
}
