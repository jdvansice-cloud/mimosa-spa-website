-- KPI dashboard v1.1: daily rollup views so year-to-date and monthly
-- comparison charts aggregate in SQL instead of shipping two years of raw
-- line items to the API on every page view.
--
-- security_invoker: views run with the caller's permissions, so the RLS on
-- the underlying mb_* tables still applies (service role only).

create or replace view public.kpi_daily_sales
with (security_invoker = true) as
select
  s.sale_date,
  s.location_id,
  i.bucket,
  sum(i.net_amount) as net
from public.mb_sale_items i
join public.mb_sales s on s.id = i.sale_id
where i.bucket <> 'tip' and not i.returned
group by 1, 2, 3;

create or replace view public.kpi_daily_sale_counts
with (security_invoker = true) as
select
  s.sale_date,
  s.location_id,
  count(distinct i.sale_id)::int as sale_count
from public.mb_sale_items i
join public.mb_sales s on s.id = i.sale_id
where i.bucket <> 'tip' and not i.returned
group by 1, 2;

create or replace view public.kpi_daily_appointments
with (security_invoker = true) as
select
  start_datetime::date as day,
  location_id,
  count(*) filter (where status not in ('Cancelled', 'LateCancelled', 'NoShow'))::int as visits,
  count(*) filter (where status in ('NoShow', 'LateCancelled'))::int as missed,
  count(distinct client_id) filter (
    where first_appointment and status not in ('Cancelled', 'LateCancelled', 'NoShow')
  )::int as new_clients
from public.mb_appointments
group by 1, 2;
