-- Sales report: store client names so daily transactions can show who bought.
-- Populated by the client sync (full re-pull after applying this).

alter table public.mb_clients
  add column if not exists first_name text,
  add column if not exists last_name text;
