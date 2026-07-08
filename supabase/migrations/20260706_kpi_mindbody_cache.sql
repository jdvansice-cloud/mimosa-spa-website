-- KPI dashboard (Phase 1): local cache of Mindbody sales, appointments and clients.
-- Synced by /api/cron/sync-kpis; read by /api/admin/kpis.
--
-- Timestamps are Panama local time (America/Panama, no DST), stored as plain
-- timestamps: Mindbody returns site-local times (the 'Z' suffix it puts on
-- SaleDateTime is spurious and is stripped at sync time).

create table if not exists public.mb_sales (
  id bigint primary key,                -- Mindbody Sale.Id
  sale_datetime timestamp not null,
  sale_date date not null,
  location_id integer not null,         -- 1 = Costa del Este, 2 = San Francisco
  client_id text,
  sales_rep_id integer,
  payment_types text[] not null default '{}',
  synced_at timestamptz not null default now()
);

create table if not exists public.mb_sale_items (
  sale_id bigint not null references public.mb_sales(id) on delete cascade,
  line_no integer not null,
  item_id bigint,
  description text,
  is_service boolean not null default false,
  bucket text not null,                 -- service | retail | giftcard | tip
  category_id integer,
  quantity numeric not null default 1,
  unit_price numeric(10,2) not null default 0,
  discount_amount numeric(10,2) not null default 0,
  tax_amount numeric(10,2) not null default 0,   -- ITBMS portion reported by Mindbody
  total_amount numeric(10,2) not null default 0,
  net_amount numeric(10,2) generated always as (total_amount - tax_amount) stored,
  returned boolean not null default false,
  primary key (sale_id, line_no)
);

create table if not exists public.mb_appointments (
  id bigint primary key,                -- Mindbody Appointment.Id
  start_datetime timestamp not null,
  end_datetime timestamp,
  duration_min integer,
  status text not null,                 -- Booked/Confirmed/Arrived/Completed/NoShow/Cancelled/LateCancelled/...
  location_id integer not null,
  staff_id bigint,
  staff_name text,
  client_id text,
  session_type_id integer,
  first_appointment boolean not null default false,
  synced_at timestamptz not null default now()
);

create table if not exists public.mb_clients (
  id text primary key,                  -- Mindbody Client.Id
  creation_date timestamp,
  first_appointment_date timestamp,
  referred_by text,
  synced_at timestamptz not null default now()
);

create table if not exists public.kpi_sync_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists mb_sales_date_loc_idx on public.mb_sales (sale_date, location_id);
create index if not exists mb_sale_items_sale_idx on public.mb_sale_items (sale_id);
create index if not exists mb_appointments_start_idx on public.mb_appointments (start_datetime);
create index if not exists mb_appointments_loc_start_idx on public.mb_appointments (location_id, start_datetime);
create index if not exists mb_appointments_client_idx on public.mb_appointments (client_id, start_datetime);
create index if not exists mb_appointments_first_idx on public.mb_appointments (start_datetime) where first_appointment;

-- Service-role only: RLS enabled with no policies, so anon/authenticated get
-- nothing. Server routes use the service role key and bypass RLS.
alter table public.mb_sales enable row level security;
alter table public.mb_sale_items enable row level security;
alter table public.mb_appointments enable row level security;
alter table public.mb_clients enable row level security;
alter table public.kpi_sync_state enable row level security;
