import { createHash } from 'crypto'
import { serviceClient } from '@/lib/kpis/queries'
import { parseNgtecoExport, type PunchRow } from './parse'

// ===========================================
// NGTeco export import. Punches can be mended (edited OR deleted) in the
// NGTeco software, so the last export is the truth: before inserting, we
// delete every existing punch inside the file's date range for the
// employees present in the file (replace-by-window). Restricting the wipe
// to employees in the file keeps a single-person manual export from
// erasing everyone else. Whole files are hash-deduped, and the original
// is kept in the private ta-files bucket for audit.
// ===========================================

export interface TaImportResult {
  filename: string
  status: 'imported' | 'duplicate' | 'error'
  rows: number
  periodStart?: string
  periodEnd?: string
  employees?: number
  detail?: string
}

const punchKey = (p: PunchRow): string =>
  `${p.employeeName.toLowerCase().trim()}|${p.workDate}|${p.pairIndex}`

export async function importAttendanceFiles(
  files: Array<{ filename: string; buffer: Buffer }>,
  source: 'manual' | 'email' = 'manual'
): Promise<TaImportResult[]> {
  const supabase = serviceClient()
  const results: TaImportResult[] = []

  for (const { filename, buffer } of files) {
    try {
      const hash = createHash('sha256').update(buffer).digest('hex')
      const { data: dupe } = await supabase.from('ta_files').select('id,filename').eq('file_hash', hash).maybeSingle()
      if (dupe) {
        results.push({ filename, status: 'duplicate', rows: 0, detail: `ya importado como "${dupe.filename}"` })
        continue
      }

      const parsed = parseNgtecoExport(buffer)

      const filePayload = {
        filename,
        file_hash: hash,
        period_start: parsed.periodStart,
        period_end: parsed.periodEnd,
      }
      let { data: fileRow, error: fileErr } = await supabase
        .from('ta_files')
        .insert({ ...filePayload, source })
        .select('id')
        .single()
      if (fileErr?.message.includes("'source' column")) {
        // migration 20260728_ta_source not applied yet — import anyway
        ;({ data: fileRow, error: fileErr } = await supabase
          .from('ta_files')
          .insert(filePayload)
          .select('id')
          .single())
      }
      if (fileErr || !fileRow) throw new Error(fileErr?.message ?? 'no file row')
      const fileId = fileRow.id as number

      // Last export wins: wipe this window for the employees in the file so
      // punches deleted in a mend disappear here too, then insert fresh.
      if (parsed.periodStart && parsed.periodEnd) {
        const names = [...new Set(parsed.punches.map(p => p.employeeName))]
        const { error: delErr } = await supabase
          .from('ta_punches')
          .delete()
          .gte('work_date', parsed.periodStart)
          .lte('work_date', parsed.periodEnd)
          .in('employee_name', names)
        if (delErr) throw new Error(delErr.message)
      }

      const rows = parsed.punches.map(p => ({
        file_id: fileId,
        employee_name: p.employeeName,
        employee_code: p.employeeCode,
        work_date: p.workDate,
        clock_in: p.clockIn,
        clock_out: p.clockOut,
        minutes: p.minutes,
        punch_key: punchKey(p),
      }))
      for (let i = 0; i < rows.length; i += 400) {
        const { error } = await supabase
          .from('ta_punches')
          .upsert(rows.slice(i, i + 400), { onConflict: 'punch_key' })
        if (error) throw new Error(error.message)
      }

      // keep the original in the private bucket (best-effort)
      const path = `${(parsed.periodStart ?? 'unknown').slice(0, 7)}/${filename}`
      const { error: upErr } = await supabase.storage.from('ta-files').upload(path, buffer, {
        contentType: 'application/octet-stream',
        upsert: true,
      })
      await supabase
        .from('ta_files')
        .update({ rows_imported: rows.length, storage_path: upErr ? null : path })
        .eq('id', fileId)

      results.push({
        filename,
        status: 'imported',
        rows: rows.length,
        periodStart: parsed.periodStart ?? undefined,
        periodEnd: parsed.periodEnd ?? undefined,
        employees: new Set(parsed.punches.map(p => p.employeeName)).size,
      })
    } catch (err) {
      results.push({ filename, status: 'error', rows: 0, detail: err instanceof Error ? err.message : String(err) })
    }
  }
  return results
}
