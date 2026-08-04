-- Client visits: one client coming in on one day = 1 visit, no matter how
-- many treatments. Appointments without a client id count individually.
-- "treatments" = appointment count (the old "visits").
create or replace view public.kpi_daily_client_visits
with (security_invoker = true) as
select
  start_datetime::date as day,
  location_id,
  count(distinct client_id) filter (where client_id is not null)
    + count(*) filter (where client_id is null) as visits,
  count(*) as treatments
from public.mb_appointments
where status not in ('Cancelled', 'LateCancelled', 'NoShow')
group by 1, 2;
