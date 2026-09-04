-- Per-contact memory ("perfil") for the WATI AI receptionist.
alter table wati_agent_conversations add column if not exists profile jsonb not null default '{}'::jsonb;

create table if not exists wati_agent_conversation_log (
  id bigserial primary key,
  phone text not null references wati_agent_conversations(phone) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz not null default now(),
  outcome text,            -- 'booked' | 'handoff' | 'closed' | 'idle'
  summary text not null,
  created_at timestamptz not null default now()
);

create index if not exists wati_agent_conversation_log_phone on wati_agent_conversation_log(phone, ended_at desc);
