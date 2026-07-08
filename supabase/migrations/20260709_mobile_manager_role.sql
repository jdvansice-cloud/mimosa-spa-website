-- New role: mobile_manager — access ONLY to the Mobile Manager section
-- (/admin/kpis, /admin/kpis/ventas, /admin/kpis/agenda). Enforced by the
-- middleware and the KPI API routes; all other admin pages/APIs still
-- require role = 'admin'.
--
-- To grant access:
--   1. Supabase Dashboard → Authentication → Users → "Invite user" (their email).
--      (The profiles row is created automatically with role 'user'.)
--   2. Run:  update public.profiles set role = 'mobile_manager' where email = 'persona@correo.com';
--   3. They log in at www.mimosaretreat.com/admin/login with that email (OTP code).

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('user', 'admin', 'mobile_manager'));
