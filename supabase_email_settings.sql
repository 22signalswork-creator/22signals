-- ============================================================
-- 22 SIGNALS — Email / SMTP settings
--
-- Adds:
--   1. `email_settings` (singleton row) — SMTP host/port/user/pass,
--      sender name/email, and the 3 recipient inboxes that should
--      receive every contact form submission.
--   2. Adds `prefix` column to `company_stats` so admins can render
--      things like "$5M" in front of an animated number.
--
-- Safe to re-run (uses `if not exists`).
-- Run AFTER the other SQL files.
-- ============================================================


-- ------------------------------------------------------------
-- 1. company_stats.prefix  (e.g. "$")
-- ------------------------------------------------------------
alter table if exists company_stats
  add column if not exists prefix text;

-- Auto-seed "$" on revenue-style stats so the existing
-- "5M Increase Revenue For Client" card renders as "$5M" immediately,
-- without needing admin edits. Re-running is safe because this only
-- touches rows where prefix is still NULL.
update company_stats
   set prefix = '$'
 where prefix is null
   and (label ilike '%revenue%' or label ilike '%earn%' or suffix = 'M' or suffix = 'B');


-- ------------------------------------------------------------
-- 2. email_settings — singleton row driven by `id = 1`
-- ------------------------------------------------------------
create table if not exists email_settings (
  id              int primary key default 1,                 -- always 1 (singleton)
  -- SMTP connection (Brevo defaults: smtp-relay.brevo.com, 587, your login)
  smtp_host       text,
  smtp_port       int,
  smtp_user       text,
  smtp_pass       text,
  smtp_secure     boolean default false,                     -- true = SSL/465, false = STARTTLS/587
  -- "From" header
  from_name       text default '22 Signals',
  from_email      text,
  -- 3 inboxes that receive every contact submission
  recipient_1     text,
  recipient_2     text,
  recipient_3     text,
  -- Toggle email sending on/off without deleting credentials
  is_enabled      boolean default false,
  updated_at      timestamptz default now(),
  constraint email_settings_singleton_chk check (id = 1)
);

-- Seed the singleton row if it's not there yet
insert into email_settings (id)
values (1)
on conflict (id) do nothing;

alter table email_settings enable row level security;

-- Public read is intentionally NOT granted (SMTP password!)
-- Only authenticated admins may read or write.
create policy "Authenticated read"   on email_settings for select to authenticated using (true);
create policy "Authenticated insert" on email_settings for insert to authenticated with check (true);
create policy "Authenticated update" on email_settings for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on email_settings for delete to authenticated using (true);


-- ============================================================
-- DONE ✅
-- After running this:
--   1. Open /admin/email-settings, fill in your Brevo SMTP
--      credentials and the 3 recipient inboxes, then save.
--   2. Deploy the `send-contact-email` Supabase Edge Function
--      (see supabase/functions/send-contact-email/index.ts).
-- ============================================================
