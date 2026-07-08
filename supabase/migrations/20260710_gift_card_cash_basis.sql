-- Cash-basis net sales + gift-card usage filter.
--
-- 1. mb_sales gains payment amounts: gc_paid (paid with gift card) and
--    total_paid (all payments). Populated by the sales sync — run a full
--    sales resync after applying.
-- 2. kpi_daily_sales_cash: like kpi_daily_sales but each item's net is
--    prorated by the share of the sale NOT paid with a gift card, so net
--    reflects money actually received at the register (cash method).
--    Rows synced before this migration have total_paid NULL → factor 1
--    (unchanged) until the resync fills them.
-- 3. kpi_daily_gc_usage: gift-card value redeemed per day/location.

alter table public.mb_sales
  add column if not exists payments jsonb,
  add column if not exists gc_paid numeric(10,2),
  add column if not exists total_paid numeric(10,2);

create or replace view public.kpi_daily_sales_cash
with (security_invoker = true) as
select
  s.sale_date,
  s.location_id,
  i.bucket,
  sum(
    i.net_amount * case
      when coalesce(s.total_paid, 0) > 0
        then greatest(0, 1 - coalesce(s.gc_paid, 0) / s.total_paid)
      else 1
    end
  ) as net
from public.mb_sale_items i
join public.mb_sales s on s.id = i.sale_id
where i.bucket <> 'tip' and not i.returned
group by 1, 2, 3;

-- Gift-card usage, expressed net of ITBMS/tips: each item's net prorated by
-- the share of the sale that WAS paid with a gift card. By construction,
-- kpi_daily_sales_cash + kpi_daily_gc_usage = kpi_daily_sales (the old total).
create or replace view public.kpi_daily_gc_usage
with (security_invoker = true) as
select
  s.sale_date,
  s.location_id,
  sum(
    i.net_amount * least(1, coalesce(s.gc_paid, 0) / s.total_paid)
  ) as net,
  count(distinct i.sale_id)::int as tx_count
from public.mb_sale_items i
join public.mb_sales s on s.id = i.sale_id
where i.bucket <> 'tip' and not i.returned
  and coalesce(s.gc_paid, 0) > 0 and coalesce(s.total_paid, 0) > 0
group by 1, 2;
