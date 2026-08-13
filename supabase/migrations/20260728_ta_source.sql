-- Attendance imports now also arrive automatically from the NGTeco clock's
-- scheduled email (cron reads the Gmail inbox). Track provenance per file.
alter table ta_files add column if not exists source text not null default 'manual'; -- manual | email
