-- WATI AI receptionist (Camila). Idempotent.
create table if not exists wati_agent_conversations (
  phone text primary key,
  wati_contact_id text,
  ticket_id text,
  mode text not null default 'agent' check (mode in ('agent','human','off')),
  sucursal text check (sucursal in ('cde','sfc')),
  mindbody_client_id text,
  client_name text,
  summary text,
  handoff_reason text,
  human_since timestamptz,
  last_inbound_at timestamptz,
  last_outbound_at timestamptz,
  audio_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists wati_agent_messages (
  id bigserial primary key,
  phone text not null references wati_agent_conversations(phone) on delete cascade,
  wati_message_id text unique,
  direction text not null check (direction in ('in','out')),
  author text not null,
  type text not null default 'text',
  text text,
  media_ref text,
  shadow boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists wati_agent_messages_phone_created on wati_agent_messages(phone, created_at desc);

create table if not exists wati_agent_events (
  id bigserial primary key,
  phone text,
  kind text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);
create index if not exists wati_agent_events_phone_created on wati_agent_events(phone, created_at desc);

create table if not exists wati_agent_media (
  key text primary key,
  description text not null,
  caption text not null default '',
  storage_path text not null,
  valid_from date,
  valid_until date,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists wati_agent_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
insert into wati_agent_settings(key, value) values
  ('enabled', 'true'::jsonb),
  ('persona_name', '"Camila"'::jsonb)
on conflict (key) do nothing;

insert into storage.buckets (id, name, public)
values ('wati-agent-media', 'wati-agent-media', true)
on conflict (id) do nothing;

alter table wati_agent_conversations enable row level security;
alter table wati_agent_messages enable row level security;
alter table wati_agent_events enable row level security;
alter table wati_agent_media enable row level security;
alter table wati_agent_settings enable row level security;
