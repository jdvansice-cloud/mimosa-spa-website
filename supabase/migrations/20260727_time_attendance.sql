-- Time & attendance from the NGTeco TC7 clock (Mobile Manager · Asistencia).
-- The clock has no API: staff punches arrive as Excel/CSV exports from the
-- NGTeco Time app, uploaded by hand. Service-role only (RLS on, no policies),
-- like the mb_* cache and biz_* tables.

-- Registry of every uploaded export (original kept in the ta-files bucket).
create table if not exists ta_files (
  id bigint generated always as identity primary key,
  uploaded_at timestamptz not null default now(),
  filename text not null,
  file_hash text not null unique,
  storage_path text,
  period_start date,
  period_end date,
  rows_imported integer not null default 0
);

-- One row per punch pair (or lone punch when in/out is missing).
-- punch_key makes re-uploads of overlapping date ranges idempotent.
create table if not exists ta_punches (
  id bigint generated always as identity primary key,
  file_id bigint not null references ta_files(id) on delete cascade,
  employee_name text not null,
  -- employee id/code as printed by the clock, when present
  employee_code text,
  work_date date not null,
  clock_in time,
  clock_out time,
  -- minutes as reported by the clock (may differ from out−in on paired shifts)
  minutes integer,
  punch_key text not null unique
);
create index if not exists ta_punches_date_idx on ta_punches (work_date);
create index if not exists ta_punches_emp_idx on ta_punches (employee_name, work_date);

-- Manual mapping clock name → Mindbody staff name, for cases the
-- automatic normalized-name match can't resolve.
create table if not exists ta_staff_map (
  employee_name text primary key,
  mb_staff_name text not null
);

alter table ta_files enable row level security;
alter table ta_punches enable row level security;
alter table ta_staff_map enable row level security;

-- Private bucket for the original exports (audit trail).
insert into storage.buckets (id, name, public)
values ('ta-files', 'ta-files', false)
on conflict (id) do nothing;
