-- ============================================================
-- 22 SIGNALS — Add `tags` column to project_detail_pages
--
-- Lets the admin attach discipline tags to each portfolio project
-- (e.g., "SEO", "AI", "Web Development"). The tags are rendered as
-- small chips on the portfolio cards.
--
-- Safe to re-run: uses `add column if not exists`.
-- ============================================================

alter table if exists project_detail_pages
  add column if not exists tags jsonb default '[]'::jsonb;

-- Optional: backfill any existing rows with an empty array so the
-- application code never sees NULL on the tags column.
update project_detail_pages
   set tags = '[]'::jsonb
 where tags is null;
