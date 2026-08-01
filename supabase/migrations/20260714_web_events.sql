-- First-party web analytics events (page views + booking funnel).
-- Written by the public /api/track endpoint (service role); read by Mobile Manager.

create table if not exists web_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  -- Panama-local calendar day, stamped server-side for cheap grouping
  event_date date not null,
  event text not null,
  session_id text not null,
  path text,
  locale text,
  device text, -- 'mobile' | 'desktop'
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  location_id integer,
  meta jsonb
);

create index if not exists web_events_date_idx on web_events (event_date);
create index if not exists web_events_event_date_idx on web_events (event, event_date);
create index if not exists web_events_session_idx on web_events (session_id);

-- Service-role only (no policies on purpose)
alter table web_events enable row level security;
