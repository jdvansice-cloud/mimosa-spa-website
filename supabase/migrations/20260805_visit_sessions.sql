-- Visit = one client ID's CONTINUOUS block of treatments with ONE therapist
-- in a day. A therapist change (couple sharing one Mindbody account) or a
-- time gap > 60 min (same ID returning later) starts a new visit.
-- Same view name/columns as before — consumers unchanged.
create or replace view public.kpi_daily_client_visits
with (security_invoker = true) as
with appts as (
  select
    client_id,
    location_id,
    coalesce(staff_id, -1) as staff_key,
    start_datetime,
    start_datetime + make_interval(mins => coalesce(duration_min, 60)) as end_dt,
    start_datetime::date as day
  from public.mb_appointments
  where status not in ('Cancelled', 'LateCancelled', 'NoShow')
),
marked as (
  select
    day,
    location_id,
    case
      when client_id is null then 1 -- anonymous bookings each count once
      when lag(end_dt) over w is null then 1
      when start_datetime > lag(end_dt) over w + interval '60 minutes' then 1
      else 0
    end as new_visit
  from appts
  window w as (partition by client_id, day, location_id, staff_key order by start_datetime, end_dt)
)
-- No ::int casts: the original view's columns are bigint and
-- CREATE OR REPLACE VIEW cannot change a column's type.
select
  day,
  location_id,
  sum(new_visit) as visits,
  count(*) as treatments
from marked
group by 1, 2;
