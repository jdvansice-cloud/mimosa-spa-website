-- Staff page: track whether the client specifically requested the therapist
-- (Mindbody Appointment.StaffRequested). Populated by the appointments sync —
-- run an appointments resync after applying to backfill history.

alter table public.mb_appointments
  add column if not exists staff_requested boolean not null default false;
