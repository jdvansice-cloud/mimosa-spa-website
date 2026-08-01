-- Comps ("Cortesía/Invitado") are not money received: exclude them from the
-- cash-basis net, matching Mindbody's payment report (verified against the
-- MTD reports: the difference was exactly the comped amounts).
--
-- comp_paid is backfilled here from the stored payments jsonb — no resync
-- needed; the sync fills it for new sales.

alter table public.mb_sales
  add column if not exists comp_paid numeric(10,2);

update public.mb_sales
set comp_paid = coalesce((
  select sum((p->>'amount')::numeric)
  from jsonb_array_elements(coalesce(payments, '[]'::jsonb)) p
  where p->>'type' ilike '%cortes%' or p->>'type' ilike '%invitado%'
), 0)
where payments is not null;

-- Cash view now excludes both gift-card and comp portions
create or replace view public.kpi_daily_sales_cash
with (security_invoker = true) as
select
  s.sale_date,
  s.location_id,
  i.bucket,
  sum(
    i.net_amount * case
      when coalesce(s.total_paid, 0) > 0
        then greatest(0, 1 - (coalesce(s.gc_paid, 0) + coalesce(s.comp_paid, 0)) / s.total_paid)
      else 1
    end
  ) as net
from public.mb_sale_items i
join public.mb_sales s on s.id = i.sale_id
where i.bucket <> 'tip' and not i.returned
group by 1, 2, 3;
