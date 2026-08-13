// Server component: renders a JSON-LD <script> tag.
// Safety: the payload is produced exclusively by JSON.stringify (never raw
// user HTML) and all '<' characters are unicode-escaped, so the content can
// never close the script tag or introduce markup — the standard Next.js
// JSON-LD pattern (https://nextjs.org/docs/app/guides/json-ld).
export function JsonLd({ data }: { data: object }) {
  const safeJson = JSON.stringify(data).replace(/</g, '\\u003c')
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  )
}
