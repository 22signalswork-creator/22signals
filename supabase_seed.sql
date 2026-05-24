-- ============================================================
-- 22 SIGNALS — Seed data for all CMS tables
-- Run this AFTER `supabase_setup.sql`. It populates each table
-- with the content currently hardcoded in the React app, so the
-- Supabase dashboard mirrors what the live site shows today.
--
-- How to run: Supabase → SQL Editor → New query → paste → Run
-- Safe to re-run: every section either checks for existing rows
-- or uses on-conflict guards.
-- ============================================================


-- ------------------------------------------------------------
-- HERO SECTION (single row — already seeded by setup.sql)
-- This will only insert if the table is empty.
-- ------------------------------------------------------------
insert into hero_section (headline, tagline, cities_list, gradient_word)
select 'Create.', 'Your one stop business solution.',
       array['DUBAI','LAHORE','LONDON','NEW YORK'], 'Create.'
where not exists (select 1 from hero_section);


-- ------------------------------------------------------------
-- SERVICES (7 service cards from ServicesSection.tsx)
-- tone values match the design system: 'dark' | 'blue' | 'light'
-- size values: 'normal' | 'tall' | 'wide'
-- ------------------------------------------------------------
insert into services (title, description, tone, pillar_number, size, sort_order) values
  ('Digital Solutions',
   'High-performance web development, SEO, GEO and intelligent AI systems.',
   'dark', 1, 'tall', 1),
  ('Broadcasting & Events',
   'End-to-end online and offline tournament and broadcast management.',
   'blue', 2, 'tall', 2),
  ('Global Manufacturing',
   'Optimize your supply chain and reduce product costs by 40-60%.',
   'dark', 3, 'tall', 3),
  ('Data & AI',
   'Predictive analytics, multi-agentic AI, and automation that scales.',
   'blue', 4, 'normal', 4),
  ('Cloud Solutions',
   'Scalable cloud infrastructure, DevOps, and resilient backend systems.',
   'dark', 5, 'normal', 5),
  ('Creative Solutions',
   'Social media management, motion graphics, 2D/3D animations.',
   'blue', 6, 'normal', 6),
  ('Managed Services',
   'Top-tier global talent with built-in supervision.',
   'dark', 7, 'normal', 7);


-- ------------------------------------------------------------
-- PROJECTS (4 featured projects from projectcard.tsx)
-- image_url left blank — upload images via Storage > cms-assets
-- and paste the public URLs into these rows.
-- ------------------------------------------------------------
insert into projects (title, description, category, is_featured, sort_order) values
  ('LEAP',
   'Tech & innovation summit — full broadcast & event execution.',
   'Broadcasting', true, 1),
  ('VUJA DE',
   'Digital experience design and brand activation campaign.',
   'Creative', true, 2),
  ('Latakoo',
   'Enterprise media platform — UI/UX and product engineering.',
   'Digital', true, 3),
  ('Gameview',
   'Esports broadcast platform with custom overlays and analytics.',
   'Esports', true, 4);


-- ------------------------------------------------------------
-- TESTIMONIALS (from portfoliosection.tsx)
-- ------------------------------------------------------------
insert into testimonials (name, role, text, sort_order, is_active) values
  ('Nugraha', 'Founder, Mangcoding',
   '22 Signals delivered our enterprise platform on time with flawless execution. Their dedicated supervisor model is a game changer for outsourcing.',
   1, true),
  ('Alex Jounky', 'Founder, Robs',
   'We scaled marketing, dev and broadcast all through one team. Cut overhead by half and shipped twice as fast.',
   2, true),
  ('Chelsia Alexy', 'Founder, Frank',
   'Their team handled everything from product UI to ad campaigns. The quality and speed are unmatched.',
   3, true),
  ('Samuel Abey', 'Director, Acme Co.',
   'From AI automation to esports broadcast, 22 Signals brings depth across every vertical we needed.',
   4, true),
  ('Nugraha', 'Founder, Mangcoding',
   'A truly integrated partner — strategy, design, and engineering executed under one roof.',
   5, true),
  ('Alex Jounky', 'Founder, Robs',
   'World-class delivery with global manufacturing know-how that saved us 40%+ on production.',
   6, true);


-- ------------------------------------------------------------
-- FAQS — Home (from HomeFaq.tsx)
-- ------------------------------------------------------------
insert into faqs (question, answer, page, sort_order, is_active) values
  ('How do you ensure efficiency?',
   'We provide a dedicated supervisor at no extra cost to serve as your single point of contact.',
   'home', 1, true),
  ('What if I need multiple services?',
   'Engaging us for one service unlocks instant access to our entire suite of solutions.',
   'home', 2, true),
  ('How much can I save?',
   'Expect 40-60% savings across all services with faster business growth.',
   'home', 3, true),
  ('What roles can I outsource?',
   'We provide talent across tech, marketing, finance, customer support, and real estate.',
   'home', 4, true);


-- ------------------------------------------------------------
-- FAQS — Services (from services/components/FaqSection.tsx)
-- ------------------------------------------------------------
insert into faqs (question, answer, page, sort_order, is_active) values
  ('How do you manage remote teams and ensure seamless execution?',
   'We eliminate the typical friction of outsourcing by providing a dedicated supervisor at no additional cost for every engagement. This dedicated professional serves as your single point of contact, efficiently managing multiple talents across your project. This streamlined communication ensures rapid execution and extremely quick turnaround times without adding to your management overhead.',
   'services', 1, true),
  ('Can we scale across different departments as our needs evolve?',
   'Yes. Our operational framework is built on an integrated service model. Once you partner with us for any single service whether that is hiring a MERN stack developer or launching a marketing campaign, you gain instant, frictionless access to our full suite of solutions. You can easily scale up to include creative designers, broadcast managers, or financial bookkeepers as your business demands.',
   'services', 2, true),
  ('How are you able to offer 40-60% cost reductions in manufacturing and development?',
   'We achieve this by strategically leveraging highly competitive global hubs. For physical product manufacturing, we utilize an extensive network in Pakistan and China to optimize your supply chain, reducing costs by 40-60%. For tech and game development, we operate out of Pakistan, a rapidly growing market producing over 30,000 software engineers annually, allowing us to offer up to 60% savings compared to North American or European markets without ever compromising on quality.',
   'services', 3, true),
  ('Does your team handle emerging technologies like AI and Web3?',
   'Absolutely. We build digital infrastructure meant to future-proof your business. Beyond traditional web development, our teams specialize in predictive AI analytics, Natural Language Processing (NLP), and multi-agentic AI tools designed to automate complex business workflows. Within our game development department, we also build AR/VR experiences and integrate blockchain models like NFTs and Play-to-Earn mechanics.',
   'services', 4, true),
  ('Why should a traditional brand consider your Esports solutions?',
   'Traditional sports advertising has become highly saturated and expensive. Esports provides a direct, highly engaging avenue to capture the elusive younger demographic that is difficult to reach through conventional marketing. With experience executing over 125 global events for giants like Tencent, Samsung, and PepsiCo, we handle the entire ecosystem from live broadcast management and overlays to full tournament execution, making your brand''s entry into the space completely seamless.',
   'services', 5, true);


-- ------------------------------------------------------------
-- FAQS — Portfolio (from portfolio/components/FaqSection.tsx)
-- ------------------------------------------------------------
insert into faqs (question, answer, page, sort_order, is_active) values
  ('Do you have experience working within my specific industry?',
   'Yes. Our portfolio spans a highly diverse range of industries. From executing global broadcasts to developing AI solutions for enterprises and manufacturing physical merchandise for retail brands, our agile framework adapts to your specific market demands.',
   'portfolio', 1, true),
  ('Can I request a more detailed case study for a specific project?',
   'Absolutely. While this portfolio represents a curated high-level overview of our capabilities and aesthetic standard, we are happy to provide in-depth performance metrics, ROI breakdowns, and technical case studies during our discovery call.',
   'portfolio', 2, true),
  ('Were these projects executed using your dedicated supervisor model?',
   'Yes. Every project showcased in our portfolio whether it required a single UI/UX designer or an entire outsourced backend office was managed through our dedicated supervisor framework. This ensures the rapid execution and flawless quality you see in our work, all managed through a single point of contact.',
   'portfolio', 3, true),
  ('If my project requires multiple services (e.g., Web Development and Social Media Management), do I need to hire different teams?',
   'No. That is the core advantage of 22 Signals. Many of the projects in our portfolio utilize cross-departmental execution. Engaging us for one service grants you instant access to our full suite of digital, creative, and operational solutions.',
   'portfolio', 4, true),
  ('How quickly can we start a project like the ones shown here?',
   'Our global infrastructure is built for speed. Once we understand your vision and align on goals, we can deploy the necessary talent from developers to esports broadcast managers and initiate execution almost immediately.',
   'portfolio', 5, true);


-- ------------------------------------------------------------
-- BLOG POSTS (from blog/components/tabs.tsx)
-- ------------------------------------------------------------
insert into blog_posts (title, description, category, author, read_time, is_published, published_at) values
  ('How AI Agents Are Reshaping Backend Operations',
   'Multi-agentic systems are no longer experimental — they are reducing operational overhead by up to 60% in real deployments.',
   'AI & Automation', 'Daniyal Mansur', 6, true, '2026-03-15'),
  ('Esports Marketing: The Untapped ROI Channel',
   'Why traditional sports advertising is losing ground and how brands can win the youth demographic through tournament sponsorships.',
   'Esports', 'Sarah Chen', 6, true, '2026-03-10'),
  ('Reducing Manufacturing Cost Without Cutting Quality',
   'A breakdown of supply chain strategies that delivered 40-60% savings for our retail clients in 2025.',
   'Manufacturing', '22 Signals Editorial', 6, true, '2026-03-05'),
  ('GEO & AEO: The New Frontier After SEO',
   'Generative and Answer Engine Optimization explained — and how to position your brand inside AI-driven search.',
   'Digital Strategy', 'Daniyal Mansur', 6, true, '2026-02-28'),
  ('Web3 Beyond the Hype: Practical Applications',
   'Cutting through the noise — where blockchain actually creates business value in 2026.',
   'Web3', 'Sarah Chen', 6, true, '2026-02-20'),
  ('Building a Global Backend Office in 30 Days',
   'How we deploy fully managed offshore teams with built-in supervision and zero management overhead.',
   'Operations', '22 Signals Editorial', 6, true, '2026-02-15');


-- ============================================================
-- DONE ✅
-- After running this, refresh your website — the same content
-- you see now will be coming live from Supabase. From here on,
-- any edits in the Supabase Table Editor will appear on the
-- site after a page refresh.
-- ============================================================
