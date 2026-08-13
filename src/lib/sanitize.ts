// Conservative HTML cleaner for treatment descriptions (admin/Mindbody-managed
// rich text: <p>, <br>, <b>, <i>, <ul>, <li>...). Strips active content so a
// compromised description can never execute in visitors' browsers.
export function sanitizeDescriptionHtml(html: string): string {
  return (
    html
      // drop script/style/iframe/object/embed blocks entirely
      .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, '')
      .replace(/<(script|style|iframe|object|embed)[^>]*\/?>/gi, '')
      // drop inline event handlers (onclick=, onerror=, ...)
      .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
      .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
      // neutralize javascript: URLs
      .replace(/(href|src)\s*=\s*(["']?)\s*javascript:[^"'>\s]*\2/gi, '$1="#"')
  )
}
