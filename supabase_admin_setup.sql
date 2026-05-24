-- ============================================================
-- 22 SIGNALS — Admin write policies
-- Run this AFTER `supabase_setup.sql` and `supabase_seed.sql`.
--
-- This grants any authenticated (logged-in) user full read/write
-- access to all CMS tables. Public (anonymous) visitors keep
-- their existing read-only access.
--
-- Pair this with a Supabase Auth user account — see the README
-- section "Creating your admin user".
-- ============================================================

-- ------------------------------------------------------------
-- Helper: grant authenticated users full CRUD on a table.
-- We use one policy per command because Postgres RLS requires
-- separate policies for SELECT vs INSERT vs UPDATE vs DELETE
-- when the conditions differ.
-- ------------------------------------------------------------

-- HERO_SECTION
create policy "Authenticated insert" on hero_section for insert to authenticated with check (true);
create policy "Authenticated update" on hero_section for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on hero_section for delete to authenticated using (true);

-- SERVICES
create policy "Authenticated insert" on services for insert to authenticated with check (true);
create policy "Authenticated update" on services for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on services for delete to authenticated using (true);

-- COMPANY_STATS
create policy "Authenticated insert" on company_stats for insert to authenticated with check (true);
create policy "Authenticated update" on company_stats for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on company_stats for delete to authenticated using (true);

-- PROJECTS
create policy "Authenticated insert" on projects for insert to authenticated with check (true);
create policy "Authenticated update" on projects for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on projects for delete to authenticated using (true);

-- TESTIMONIALS — admin can also see inactive rows
create policy "Authenticated read all" on testimonials for select to authenticated using (true);
create policy "Authenticated insert" on testimonials for insert to authenticated with check (true);
create policy "Authenticated update" on testimonials for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on testimonials for delete to authenticated using (true);

-- PROCESS_STEPS
create policy "Authenticated insert" on process_steps for insert to authenticated with check (true);
create policy "Authenticated update" on process_steps for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on process_steps for delete to authenticated using (true);

-- FAQS — admin can also see inactive rows
create policy "Authenticated read all" on faqs for select to authenticated using (true);
create policy "Authenticated insert" on faqs for insert to authenticated with check (true);
create policy "Authenticated update" on faqs for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on faqs for delete to authenticated using (true);

-- BLOG_POSTS — admin can also see unpublished
create policy "Authenticated read all" on blog_posts for select to authenticated using (true);
create policy "Authenticated insert" on blog_posts for insert to authenticated with check (true);
create policy "Authenticated update" on blog_posts for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on blog_posts for delete to authenticated using (true);

-- TEAM_MEMBERS — admin can also see inactive
create policy "Authenticated read all" on team_members for select to authenticated using (true);
create policy "Authenticated insert" on team_members for insert to authenticated with check (true);
create policy "Authenticated update" on team_members for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on team_members for delete to authenticated using (true);

-- CONTACT_SUBMISSIONS — admin can read and delete; insert is public (already set)
create policy "Authenticated read all" on contact_submissions for select to authenticated using (true);
create policy "Authenticated delete" on contact_submissions for delete to authenticated using (true);

-- SITE_SETTINGS
create policy "Authenticated insert" on site_settings for insert to authenticated with check (true);
create policy "Authenticated update" on site_settings for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on site_settings for delete to authenticated using (true);

-- CLIENT_LOGOS — admin can also see inactive
create policy "Authenticated read all" on client_logos for select to authenticated using (true);
create policy "Authenticated insert" on client_logos for insert to authenticated with check (true);
create policy "Authenticated update" on client_logos for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on client_logos for delete to authenticated using (true);


-- ============================================================
-- STORAGE policies for cms-assets bucket
-- Allow authenticated users to upload/delete; everyone can read.
-- ============================================================

-- (Public read is automatic because the bucket is set to public.)

create policy "Authenticated upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'cms-assets');

create policy "Authenticated update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'cms-assets')
  with check (bucket_id = 'cms-assets');

create policy "Authenticated delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'cms-assets');


-- ============================================================
-- DONE ✅
-- Next: create your admin user in Supabase dashboard:
--   Authentication → Users → Add user → enter email + password
-- Then go to /admin/login on your site and log in.
-- ============================================================
