-- ============================================================
-- 22 SIGNALS — CMS extension (round 2)
-- Adds: page_content (key/value text for any page) and
--       service_pillars (the 6 detailed service descriptions
--       on the /services page).
--
-- Run AFTER supabase_setup.sql, supabase_seed.sql, and
-- supabase_admin_setup.sql. Safe to re-run.
-- ============================================================


-- ------------------------------------------------------------
-- 1. PAGE_CONTENT — generic key/value store for any text
--    on any page (titles, paragraphs, eyebrow tags, etc.).
-- ------------------------------------------------------------
create table if not exists page_content (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  page text,                 -- 'home' | 'services' | 'portfolio' | 'team' | 'blog' | 'contact'
  label text,                -- human-friendly label shown in admin
  type text default 'text',  -- 'text' | 'textarea'
  sort_order int default 0,
  updated_at timestamptz default now()
);

alter table page_content enable row level security;

-- public can read
create policy "Public read" on page_content for select using (true);
-- admins can write
create policy "Authenticated insert" on page_content for insert to authenticated with check (true);
create policy "Authenticated update" on page_content for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on page_content for delete to authenticated using (true);


-- ------------------------------------------------------------
-- 2. SERVICE_PILLARS — the 6 detailed service entries on /services
--    Bullets are stored as JSONB: [{ "label": "...", "text": "..." }, ...]
-- ------------------------------------------------------------
create table if not exists service_pillars (
  id uuid primary key default gen_random_uuid(),
  pillar_number text not null,         -- "01", "02", …
  title text not null,
  tagline text,
  body text,
  bullets jsonb default '[]'::jsonb,   -- array of { label, text }
  visual_key text,                     -- 'digital' | 'creative' | 'broadcast' | 'manufacturing' | 'outsourcing' | 'game'
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table service_pillars enable row level security;

create policy "Public read" on service_pillars for select using (is_active = true);
create policy "Authenticated read all" on service_pillars for select to authenticated using (true);
create policy "Authenticated insert" on service_pillars for insert to authenticated with check (true);
create policy "Authenticated update" on service_pillars for update to authenticated using (true) with check (true);
create policy "Authenticated delete" on service_pillars for delete to authenticated using (true);


-- ============================================================
-- 3. SEED DATA — populates both tables with current site content
--    so the live site keeps displaying the same text after this
--    deploy. Edit these later via /admin.
-- ============================================================

-- ------------------------------------------------------------
-- page_content seeds
-- ------------------------------------------------------------
insert into page_content (key, value, page, label, type, sort_order) values
  -- HOME
  ('home_services_main_title',
   'We translate complex challenges into tangible data driven results.',
   'home', 'Services area — main title', 'textarea', 1),
  ('home_services_eyebrow', 'What We Do',
   'home', 'Services area — eyebrow tag', 'text', 2),
  ('home_services_heading_part1', 'Integrated Solutions',
   'home', 'Services heading — first line', 'text', 3),
  ('home_services_heading_part2', 'Singular Focus.',
   'home', 'Services heading — second line (blue)', 'text', 4),
  ('home_services_subheading',
   'Seven pillars. One operating model. End-to-end execution from engineering to broadcast to physical product.',
   'home', 'Services area — subheading', 'textarea', 5),
  ('home_process_title', 'Seamless Operational Framework.',
   'home', 'Process section — title', 'text', 6),
  ('home_process_subtitle', 'A streamlined approach to maximize productivity and results.',
   'home', 'Process section — subtitle', 'textarea', 7),
  ('home_faq_eyebrow', 'Answers At Your Fingertips',
   'home', 'FAQ section — eyebrow tag', 'text', 8),
  ('home_faq_heading_line1', 'Frequently',
   'home', 'FAQ heading line 1', 'text', 9),
  ('home_faq_heading_line2', 'Asked',
   'home', 'FAQ heading line 2', 'text', 10),
  ('home_faq_heading_line3', 'Questions',
   'home', 'FAQ heading line 3', 'text', 11),
  ('home_faq_subtitle', 'Still have questions? Chat with us.',
   'home', 'FAQ subtitle', 'text', 12),

  -- SERVICES PAGE
  ('services_hero_title', 'Architecting the Future of Business.',
   'services', 'Hero — title', 'text', 1),
  ('services_hero_description',
   'We bridge the gap between ambitious ideas and execution.',
   'services', 'Hero — description', 'textarea', 2),
  ('services_hero_button_text', 'GET STARTED',
   'services', 'Hero — button text', 'text', 3),
  ('services_pillars_eyebrow', 'The Full Spectrum',
   'services', 'Pillars section — eyebrow', 'text', 4),
  ('services_pillars_heading_part1', 'Refined',
   'services', 'Pillars heading — first part', 'text', 5),
  ('services_pillars_heading_part2', 'Execution.',
   'services', 'Pillars heading — second part (blue)', 'text', 6),
  ('services_pillars_subtitle',
   'Six core service pillars. Click any to see the full breakdown of what we deliver, how we deliver it, and the impact you can expect.',
   'services', 'Pillars section — subtitle', 'textarea', 7),

  -- FOOTER CTA (the section above the footer)
  ('footer_cta_title', 'Schedule a call. Let''s connect!',
   'global', 'Footer CTA — title', 'text', 1),
  ('footer_cta_subtitle',
   'Get the signal for what''s next... or get left behind in the digital age.',
   'global', 'Footer CTA — subtitle', 'textarea', 2),
  ('footer_cta_button', 'KNOW MORE',
   'global', 'Footer CTA — button text', 'text', 3)
on conflict (key) do nothing;


-- ------------------------------------------------------------
-- service_pillars seeds — preserves all 6 current pillars
-- ------------------------------------------------------------
insert into service_pillars (pillar_number, title, tagline, body, bullets, visual_key, sort_order) values
  ('01',
   'Digital Solutions & Infrastructure',
   'Building resilient digital ecosystems that dominate search, streamline operations, and scale without friction.',
   'We deliver cutting-edge digital infrastructure designed to future-proof your business. Whether you are a startup needing dynamic applications or an enterprise requiring robust backend systems, we build for performance, visibility, and automation.',
   '[
     {"label": "Web Architecture & Development", "text": "High-performance, SEO-optimized development using MERN, MEAN, and Next.js stacks for lightning-fast server-side rendering and flawless user experiences."},
     {"label": "Next-Gen Search Visibility", "text": "We go beyond traditional SEO. Our strategies incorporate Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) to ensure your brand dominates both traditional search results and AI-driven platforms."},
     {"label": "Applied AI & Process Automation", "text": "We eliminate operational bottlenecks by building intelligent systems. From multi-agentic AI tools that automate complex workflows to predictive analytics and custom chatbots, we optimize your business processes for maximum efficiency."},
     {"label": "IoT Software", "text": "Real-time monitoring and smart industrial automation that connects devices for optimized performance and data-driven insights."}
   ]'::jsonb,
   'digital', 1),

  ('02',
   'Creative & Marketing Solutions',
   'Bridging the gap between aesthetic excellence and measurable conversion.',
   'In a saturated digital landscape, we don''t just create content, we create comprehensive campaigns that leave a lasting impact. We translate your brand vision into visually compelling assets and distribute them through high-converting marketing channels.',
   '[
     {"label": "End-to-End Marketing (SMM & Paid Media)", "text": "Full-funnel digital marketing strategies. We manage comprehensive Social Media Marketing (SMM) and data-driven Paid Ad campaigns designed to maximize ROI, capture market share, and drive aggressive growth."},
     {"label": "Visual & UI/UX Design", "text": "Captivating, human-centered UI/UX design that builds trust and guides users seamlessly. Supported by professional graphic design, custom illustrations, and physical packaging design."},
     {"label": "Motion & Immersive Media", "text": "Dynamic motion graphics, video editing, and immersive 2D/3D animations that elevate your brand storytelling and engage modern audiences."}
   ]'::jsonb,
   'creative', 2),

  ('03',
   'Broadcasting & Esports Solutions',
   'Flawless live execution and strategic access to the elusive youth demographic.',
   'We provide top-tier broadcast production tailored for high-stakes digital events. As a secondary pillar, our deep roots in the gaming industry allow us to bridge the gap between global brands and the highly engaged esports demographic.',
   '[
     {"label": "Broadcasting Solutions", "text": "End-to-end online broadcast management. We handle live event direction, dynamic overlay productions, and seamless broadcast interval (commercial) management to ensure a premium viewing experience."},
     {"label": "Esports & Tournament Management", "text": "Comprehensive management of online and offline tournaments. We execute gaming-focused content strategies and handle talent scouting, allowing brands to tap into a booming market without the exorbitant costs of traditional sports advertising."}
   ]'::jsonb,
   'broadcast', 3),

  ('04',
   'Staff Augmentation',
   'Building your global backend office with built-in management.',
   'We assist businesses in accessing top-tier global talent at a fraction of the cost. Scale your operations rapidly, maintain a high level of work output, and significantly reduce overhead expenses—all without the usual management headaches of remote teams.',
   '[
     {"label": "The Talent Arsenal — Tech & IT", "text": "Software developers, AI specialists, data analysts, and UI/UX designers."},
     {"label": "Creative & Marketing", "text": "SEO specialists, content strategists, animators, and project managers."},
     {"label": "Support & Finance", "text": "Virtual assistants, accountants, bookkeepers, and real estate agents."},
     {"label": "The Management Edge", "text": "Unlike traditional outsourcing, we provide a dedicated supervisor at no additional cost. This ensures you have a single Point of Contact (POC) to efficiently manage your customized team, streamlining communication and guaranteeing productivity."}
   ]'::jsonb,
   'outsourcing', 4),

  ('05',
   'Global Manufacturing Solutions',
   'Scaling physical product lines without bleeding margins.',
   'We help businesses optimize their supply chains by leveraging an extensive international network. By outsourcing manufacturing to Pakistan and China, two of the world''s most competitive production hubs, we deliver high-quality physical products while radically improving your profit margins.',
   '[
     {"label": "Production Capabilities", "text": "Specialized manufacturing across various industries, with a primary focus on custom merchandise, apparel, shoes, sportswear, and accessories."},
     {"label": "Supply Chain Optimization", "text": "We handle everything from large-scale mass production runs to highly customized, specialized batch solutions."},
     {"label": "The Impact", "text": "Strict quality control integrated with fast turnaround times, resulting in overall product cost reductions of 30-60%."}
   ]'::jsonb,
   'manufacturing', 5),

  ('06',
   'Game Development',
   'Immersive gaming experiences built at highly competitive rates.',
   'Bring your gaming visions to life. Operating out of Pakistan, a rapidly growing tech hub producing over 30,000 software engineers annually, we give you direct access to top-tier developers, 3D modelers, and animators.',
   '[
     {"label": "Comprehensive Development", "text": "End-to-end creation of mobile and console hits, immersive 2D/3D game design, and AR/VR experiences."},
     {"label": "Next-Gen Gaming", "text": "Expertise in integrating AI-driven NPCs and blockchain gaming models (NFTs & Play-to-Earn)."},
     {"label": "The Impact", "text": "Our streamlined development pipelines ensure faster prototyping and deployment, yielding up to 60% savings on development expenses compared to North American or European markets, without compromising on quality."}
   ]'::jsonb,
   'game', 6);


-- ============================================================
-- DONE ✅
-- After running, the new tables show up in /admin under
-- "Page text" and "Service pillars". Edit anything from there.
-- ============================================================
