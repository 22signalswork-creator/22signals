-- ============================================================
-- 22 SIGNALS — R&D research pages
--
-- Mirrors `project_detail_pages` but for the /r&d section. Each row
-- becomes one card on /r&d AND one full detail page at /r&d/:slug.
--
-- Run AFTER the previous Supabase setup files. Safe to re-run.
-- ============================================================

create table if not exists rd_research_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,                -- URL slug, e.g. "haptic-web"
  title text not null,                      -- Research title shown on card + page
  category text,                            -- e.g. "AI Architecture", "Marketing"
  percent int default 0,                    -- 0–100 progress shown on card
  card_text text,                           -- Short blurb on the /r&d listing card
  cover_image text,                         -- Optional hero/cover image URL
  tagline text,                             -- Italic intro line on the detail page
  intro text,                               -- Opening paragraph
  sections jsonb default '[]'::jsonb,       -- Array of { title, body } chapters
  references_list jsonb default '[]'::jsonb,-- Array of { label, url } external links
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table rd_research_pages enable row level security;

create policy "Public read"
  on rd_research_pages for select using (is_active = true);
create policy "Authenticated read all"
  on rd_research_pages for select to authenticated using (true);
create policy "Authenticated insert"
  on rd_research_pages for insert to authenticated with check (true);
create policy "Authenticated update"
  on rd_research_pages for update to authenticated using (true) with check (true);
create policy "Authenticated delete"
  on rd_research_pages for delete to authenticated using (true);

create index if not exists idx_rd_research_pages_slug
  on rd_research_pages (slug);
create index if not exists idx_rd_research_pages_sort
  on rd_research_pages (sort_order) where is_active = true;


-- ============================================================
-- SEED — 3 demo research items (idempotent via on conflict do nothing)
-- ============================================================

insert into rd_research_pages
  (slug, title, category, percent, card_text, tagline, intro, sections, sort_order)
values
  ('haptic-web-interfaces',
   'Haptic Web Interfaces',
   'AI Architecture',
   75,
   'Tactile-feedback web layers that bring physical sensation to digital interactions.',
   'A research effort to fold tactile feedback into the browser without proprietary plugins.',
   'Most digital interactions are visual-first. Our Haptic Web Interfaces project explores how device vibration APIs, force-feedback peripherals, and emerging WebHID surfaces can be combined to give a webpage a sense of touch — for accessibility, for storytelling, and for high-precision tooling.',
   '[
     {"title":"What we are testing",
      "body":"We are testing whether a uniform haptic layer can be exposed as a CSS-like primitive — so designers describe ''what should feel like what'' instead of writing low-level vibration code. Early prototypes route through the Vibration API, GamepadHapticActuator, and a custom Bluetooth bridge for force-feedback gloves."},
     {"title":"Why it matters",
      "body":"Touch carries information that visuals alone can not — confirmation, weight, friction, error. In high-stakes interfaces (medical, financial, industrial control) a 2 ms haptic confirmation reduces error rates more reliably than a visual one. The web has historically been muted on this dimension; we want to change that."},
     {"title":"Current status",
      "body":"At 75% we have a working internal SDK, two design partners using it in private betas, and a public reference implementation scheduled for the next quarter. The remaining work is mostly battery-aware throttling and accessibility opt-outs."}
   ]'::jsonb,
   1)
on conflict (slug) do nothing;

insert into rd_research_pages
  (slug, title, category, percent, card_text, tagline, intro, sections, sort_order)
values
  ('multi-agentic-workflows',
   'Multi-Agentic Workflows',
   'AI Architecture',
   85,
   'Cooperative AI agent systems that automate complex backend operations.',
   'A study in how small, specialised agents outperform a single general one for real business workflows.',
   'A single LLM call rarely solves a real workflow — quoting, onboarding, claims, content production. We are researching how a small swarm of specialised agents (planner, executor, critic, archivist) can hand work between themselves to finish the workflow without a human in the loop, and without compounding hallucinations.',
   '[
     {"title":"The architecture",
      "body":"Each agent owns one capability and a narrow tool surface. A central planner decomposes the task, the executor calls tools, the critic checks output against the original prompt, and the archivist commits final state. This isolation is what keeps quality high at scale."},
     {"title":"What we are measuring",
      "body":"Time-to-completion, hallucination rate, escalation rate (how often a human had to intervene), and end-to-end cost per workflow. Across the workflows we have tested so far, this architecture beats a single-agent baseline on every metric except first-token latency."},
     {"title":"Current status",
      "body":"At 85% we have an internal framework running 14 production workflows for design partners. The remaining work is observability — making it easy to see WHY an agent made a decision and replay the run end-to-end."}
   ]'::jsonb,
   2)
on conflict (slug) do nothing;

insert into rd_research_pages
  (slug, title, category, percent, card_text, tagline, intro, sections, sort_order)
values
  ('voice-first-navigation',
   'Voice-First Navigation',
   'Marketing',
   90,
   'Conversational UI patterns optimized for ambient and hands-free contexts.',
   'How interfaces should behave when the screen is not the primary surface.',
   'As more software is consumed in the car, in the kitchen, on a watch, or through a wearable, the keyboard-and-screen mental model breaks. We are researching the patterns that work in voice-first contexts — turn structure, error recovery, confirmation, and the handover back to a screen when one becomes available.',
   '[
     {"title":"What we are exploring",
      "body":"We are mapping the failure modes of current voice interfaces (long preambles, unclear state, no undo, no scrubbing) and prototyping replacement patterns. Each pattern is tested with real users in real ambient contexts (cooking, driving, walking) — not in a lab."},
     {"title":"Where it shows up",
      "body":"The biggest commercial opportunity is in support and triage flows where users prefer to speak rather than type. We are running pilots inside customer-service tools, in-car infotainment, and live-broadcast control rooms."},
     {"title":"Current status",
      "body":"At 90% we have a published pattern library and an open-source reference implementation. The last 10% is a stress test against multilingual, low-bandwidth, and severely accented input — the conditions where most voice interfaces collapse."}
   ]'::jsonb,
   3)
on conflict (slug) do nothing;
