export function scrub(text: string): string {
  return text
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '{correo}')
    .replace(/\+?\d{3}[\s-]?\d{4}[\s-]?\d{4}\b/g, '{telefono}')
    .replace(/\b\d{4}-\d{4}\b/g, '{telefono}')
    .replace(/\b\d{6}\b/g, '{codigo}')
}
