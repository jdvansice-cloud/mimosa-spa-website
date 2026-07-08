-- Refine payment proration: tips are part of total_paid but not part of the
-- items, so they must be excluded from the denominator when splitting a sale
-- into cash / gift-card / comp portions. Verified against Mindbody's payment
-- report: daily totals now match exactly.

create or replace view public.kpi_daily_sales_cash
with (security_invoker = true) as
with sale_tips as (
  select sale_id, coalesce(sum(net_amount) filter (where bucket = 'tip' and not returned), 0) as tip
  from public.mb_sale_items
  group by sale_id
)
select
  s.sale_date,
  s.location_id,
  i.bucket,
  sum(
    i.net_amount * case
      when coalesce(s.total_paid, 0) <= 0 then 1
      when s.total_paid - coalesce(t.tip, 0) <= 0 then 0
      else greatest(0, 1 - (coalesce(s.gc_paid, 0) + coalesce(s.comp_paid, 0)) / (s.total_paid - coalesce(t.tip, 0)))
    end
  ) as net
from public.mb_sale_items i
join public.mb_sales s on s.id = i.sale_id
left join sale_tips t on t.sale_id = s.id
where i.bucket <> 'tip' and not i.returned
group by 1, 2, 3;

create or replace view public.kpi_daily_gc_usage
with (security_invoker = true) as
with sale_tips as (
  select sale_id, coalesce(sum(net_amount) filter (where bucket = 'tip' and not returned), 0) as tip
  from public.mb_sale_items
  group by sale_id
)
select
  s.sale_date,
  s.location_id,
  sum(
    i.net_amount * least(1, coalesce(s.gc_paid, 0) / (s.total_paid - coalesce(t.tip, 0)))
  ) as net,
  count(distinct i.sale_id)::int as tx_count
from public.mb_sale_items i
join public.mb_sales s on s.id = i.sale_id
left join sale_tips t on t.sale_id = s.id
where i.bucket <> 'tip' and not i.returned
  and coalesce(s.gc_paid, 0) > 0
  and coalesce(s.total_paid, 0) - coalesce(t.tip, 0) > 0
group by 1, 2;
