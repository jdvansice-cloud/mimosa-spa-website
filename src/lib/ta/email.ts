import { ImapFlow } from 'imapflow'
import { simpleParser, type AddressObject } from 'mailparser'
import { importAttendanceFiles, type TaImportResult } from './import'

// ===========================================
// Reads the NGTeco clock's scheduled report from the Gmail inbox (IMAP +
// app password) and feeds the attachments to the attendance importer.
// Stateless idempotency: we only look at the last few days of mail and the
// importer hash-dedupes whole files, so re-reading a message is a no-op.
// Env: ATTENDANCE_GMAIL_USER, ATTENDANCE_GMAIL_APP_PASSWORD,
//      ATTENDANCE_EMAIL_FROM (optional match on sender/subject, default "ngteco").
// ===========================================

const LOOKBACK_DAYS = 4
const MAX_MESSAGES = 20
const ATTACHMENT_RE = /\.(xlsx|xls|csv)$/i

export interface EmailImportSummary {
  configured: boolean
  messagesScanned: number
  messagesMatched: number
  files: number
  results: TaImportResult[]
}

const addressText = (a: AddressObject | AddressObject[] | undefined): string =>
  (Array.isArray(a) ? a : a ? [a] : []).map(x => x.text).join(', ')

export async function importAttendanceFromEmail(): Promise<EmailImportSummary> {
  const user = process.env.ATTENDANCE_GMAIL_USER
  const pass = process.env.ATTENDANCE_GMAIL_APP_PASSWORD
  const filter = (process.env.ATTENDANCE_EMAIL_FROM ?? 'ngteco').toLowerCase()
  const summary: EmailImportSummary = { configured: !!(user && pass), messagesScanned: 0, messagesMatched: 0, files: 0, results: [] }
  if (!user || !pass) return summary

  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
  })
  await client.connect()
  try {
    const lock = await client.getMailboxLock('INBOX')
    try {
      const since = new Date(Date.now() - LOOKBACK_DAYS * 86400000)
      const uids = (await client.search({ since }, { uid: true })) || []
      for (const uid of uids.slice(-MAX_MESSAGES)) {
        summary.messagesScanned++
        const msg = await client.fetchOne(String(uid), { source: true }, { uid: true })
        if (!msg || !msg.source) continue
        const mail = await simpleParser(msg.source)
        const from = addressText(mail.from).toLowerCase()
        const subject = (mail.subject ?? '').toLowerCase()
        if (!from.includes(filter) && !subject.includes(filter)) continue
        const files = (mail.attachments ?? [])
          .filter(a => a.filename && ATTACHMENT_RE.test(a.filename))
          .map(a => ({ filename: a.filename!, buffer: a.content as Buffer }))
        if (files.length === 0) continue
        summary.messagesMatched++
        summary.files += files.length
        summary.results.push(...await importAttendanceFiles(files, 'email'))
        await client.messageFlagsAdd(String(uid), ['\\Seen'], { uid: true })
      }
    } finally {
      lock.release()
    }
  } finally {
    await client.logout().catch(() => {})
  }
  return summary
}
