-- Business packet imports (monthly accountant packet → Mobile Manager · Negocio).
-- All tables are service-role only (RLS on, no policies), like the mb_* cache.

-- Registry of every uploaded file (original also stored in the biz-packet bucket).
create table if not exists biz_files (
  id bigint generated always as identity primary key,
  uploaded_at timestamptz not null default now(),
  -- first day of the month the data belongs to (detected from row dates)
  month date not null,
  doc_type text not null,
  -- 1 = Costa del Este, 2 = San Francisco, null = company-wide
  location_id integer,
  filename text not null,
  file_hash text not null unique,
  storage_path text,
  rows_imported integer not null default 0,
  status text not null default 'imported', -- imported | reference | superseded
  summary jsonb
);
create index if not exists biz_files_month_idx on biz_files (month, doc_type);

-- Bank / card account movements (BG, SG, BAC statements + Visa cards).
create table if not exists biz_bank_txns (
  id bigint generated always as identity primary key,
  file_id bigint not null references biz_files(id) on delete cascade,
  account_key text not null, -- BG-CDE | BG-SF | SG-CDE | SG-SF | BAC | VISA-PRICESMART
  location_id integer,
  txn_date date not null,
  description text not null,
  note text,           -- purpose note from the ACH detail files (enrichment)
  debit numeric(12,2) not null default 0,
  credit numeric(12,2) not null default 0,
  balance numeric(14,2),
  category text        -- auto-classified expense category (rule-based)
);
create index if not exists biz_bank_txns_file_idx on biz_bank_txns (file_id);
create index if not exists biz_bank_txns_date_idx on biz_bank_txns (txn_date);

-- St. Georges card settlement detail (per card transaction, includes tips).
create table if not exists biz_card_settlements (
  id bigint generated always as identity primary key,
  file_id bigint not null references biz_files(id) on delete cascade,
  location_id integer,
  terminal text,
  txn_date date not null,
  card_number text,
  gross numeric(12,2) not null default 0,
  consumo numeric(12,2) not null default 0,
  tip numeric(12,2) not null default 0,
  sale_itbms numeric(12,2) not null default 0,
  itbms_withheld numeric(12,2) not null default 0,
  commission numeric(12,2) not null default 0,
  commission_itbms numeric(12,2) not null default 0,
  ecommerce numeric(12,2) not null default 0,
  refunded numeric(12,2) not null default 0
);
create index if not exists biz_card_settlements_file_idx on biz_card_settlements (file_id);
create index if not exists biz_card_settlements_date_idx on biz_card_settlements (txn_date);

-- Daily sales rows from the Mindbody closeout + gift-card reports.
create table if not exists biz_daily_sales (
  id bigint generated always as identity primary key,
  file_id bigint not null references biz_files(id) on delete cascade,
  doc_type text not null, -- mb_closeout | gc_sold | gc_redeemed
  location_id integer not null,
  sale_date date not null,
  tickets integer not null default 0,
  cash numeric(12,2) not null default 0,
  marcar numeric(12,2) not null default 0,
  card numeric(12,2) not null default 0,
  misc numeric(12,2) not null default 0,
  subtotal numeric(12,2),
  itbms numeric(12,2),
  total numeric(12,2) not null default 0
);
create index if not exists biz_daily_sales_file_idx on biz_daily_sales (file_id);
create index if not exists biz_daily_sales_date_idx on biz_daily_sales (sale_date);

-- Partner-paid expenses reimbursed monthly (cxp Socios).
create table if not exists biz_socio_expenses (
  id bigint generated always as identity primary key,
  file_id bigint not null references biz_files(id) on delete cascade,
  vendor text,
  expense_date date,
  description text,
  amount numeric(12,2) not null default 0,
  itbms numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0
);
create index if not exists biz_socio_expenses_file_idx on biz_socio_expenses (file_id);

-- Electronic invoices issued (efacturapty report).
create table if not exists biz_invoices (
  id bigint generated always as identity primary key,
  file_id bigint not null references biz_files(id) on delete cascade,
  location_id integer,
  invoice_number text,
  issued_at timestamptz,
  status text,
  cufe text,
  amount numeric(12,2) not null default 0,
  itbms numeric(12,2) not null default 0
);
create index if not exists biz_invoices_file_idx on biz_invoices (file_id);

alter table biz_files enable row level security;
alter table biz_bank_txns enable row level security;
alter table biz_card_settlements enable row level security;
alter table biz_daily_sales enable row level security;
alter table biz_socio_expenses enable row level security;
alter table biz_invoices enable row level security;

-- Private bucket for the original files (audit trail, ≥7-year retention).
insert into storage.buckets (id, name, public)
values ('biz-packet', 'biz-packet', false)
on conflict (id) do nothing;
