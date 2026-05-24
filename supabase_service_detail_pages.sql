-- ============================================================
-- 22 SIGNALS — Service detail pages
-- One row per service detail page. Each page has sections
-- (stored as JSONB) with a title, optional intro, and bullet items.
--
-- Run this in Supabase SQL Editor after the previous SQL files.
-- Safe to re-run.
-- ============================================================

create table if not exists service_detail_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,        -- URL slug, e.g. "digital-solutions"
  number text not null,             -- "01" .. "08"
  title text not null,              -- Service title
  tagline text,                     -- Bold italic intro line
  intro text,                       -- Opening paragraph
  sections jsonb default '[]'::jsonb,  -- Array of { title, intro?, items[] }
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table service_detail_pages enable row level security;

create policy "Public read"             on service_detail_pages for select using (is_active = true);
create policy "Authenticated read all"  on service_detail_pages for select to authenticated using (true);
create policy "Authenticated insert"    on service_detail_pages for insert to authenticated with check (true);
create policy "Authenticated update"    on service_detail_pages for update to authenticated using (true) with check (true);
create policy "Authenticated delete"    on service_detail_pages for delete to authenticated using (true);

create index if not exists idx_service_detail_pages_slug on service_detail_pages (slug);
create index if not exists idx_service_detail_pages_sort on service_detail_pages (sort_order) where is_active = true;


-- ============================================================
-- SEED DATA — all 8 services from the brief
-- ============================================================

-- 01 DIGITAL SOLUTIONS
insert into service_detail_pages (slug, number, title, tagline, intro, sections, sort_order) values
('digital-solutions', '01', 'Digital Solutions',
 'End-to-end web engineering, custom software, AI integration, and IoT development for enterprise and high-growth organisations.',
 'Our Digital Solutions division delivers high-performance technology products across the full stack. Every engagement is led by a senior technical architect with dedicated development squads aligned to your specific stack and business objectives.',
 '[
  {"title":"Web & Application Development","items":[
    "MERN Stack (MongoDB, Express.js, React, Node.js) for dynamic, data-heavy applications requiring real-time performance",
    "MEAN Stack (MongoDB, Express.js, Angular, Node.js) for enterprise-grade applications with strong typing and modular architecture",
    "Next.js with server-side rendering for superior Core Web Vitals performance and SEO-ready architecture",
    "Headless CMS and API-first architecture — decoupled frontends with flexible backend integrations",
    "Progressive Web Apps for offline-capable, mobile-first user experiences",
    "E-commerce platforms — custom builds and enterprise configurations on Shopify, WooCommerce, and bespoke solutions"
  ]},
  {"title":"AI Integration & Intelligent Systems","items":[
    "LLM-powered conversational AI for customer support, lead qualification, and internal automation",
    "Predictive analytics engines integrated directly into operational dashboards and decision workflows",
    "Computer vision systems for image recognition, object detection, and visual quality assurance",
    "Natural language processing for document intelligence, sentiment analysis, and automated classification",
    "Personalisation and recommendation engines for e-commerce, content, and SaaS platforms"
  ]},
  {"title":"Multi-Agentic AI Workflows","items":[
    "Autonomous workflow agents that plan, execute, and self-correct across multi-step business processes",
    "AI-powered research systems for competitive intelligence, legal research, and market analysis",
    "Collaborative AI orchestration — multiple specialised agents working in parallel for complex problem-solving"
  ]},
  {"title":"IoT & Connected Systems","items":[
    "Smart industrial automation — sensor networks, device orchestration, and real-time control systems",
    "Asset tracking and environmental monitoring platforms with real-time visibility dashboards",
    "IoT data pipelines for ingestion, processing, and analytics across connected device ecosystems"
  ]},
  {"title":"Mobile Development","items":[
    "Cross-platform mobile applications using React Native and Flutter",
    "Native iOS (Swift) and Android (Kotlin) development for performance-critical applications",
    "Mobile-first PWA development for lightweight, fast-deploy solutions"
  ]},
  {"title":"Blockchain & Web3","items":[
    "Smart contract development on Ethereum, Polygon, and Solana",
    "NFT platform architecture and marketplace development",
    "DeFi protocol integration and wallet infrastructure",
    "Tokenisation strategy and full technical implementation"
  ]}
 ]'::jsonb, 1)
on conflict (slug) do nothing;


-- 02 DATA & AI
insert into service_detail_pages (slug, number, title, tagline, intro, sections, sort_order) values
('data-ai', '02', 'Data & AI',
 'Enterprise data infrastructure, advanced analytics, machine learning, and AI strategy — converting raw data into a decisive organisational asset.',
 'The Data & AI vertical is built for organisations ready to move beyond dashboards and into genuine, operationally embedded intelligence. We engage from strategy through to full implementation — pipelines, models, and the interfaces that make data meaningful at the point of decision.',
 '[
  {"title":"Data Strategy & Architecture","items":[
    "Data maturity assessments — mapping existing infrastructure, governance gaps, and roadmap opportunities",
    "Modern data architecture design — cloud-native lakehouse, data mesh, and medallion architectures",
    "Data governance frameworks covering lineage, cataloguing, access control, and compliance",
    "KPI definition and metric frameworks tied directly to commercial outcomes"
  ]},
  {"title":"Data Engineering & Infrastructure","items":[
    "ETL and ELT pipeline development using Spark, dbt, Airflow, and Fivetran",
    "Data warehouse and lakehouse implementation on Snowflake, BigQuery, Databricks, and Redshift",
    "Real-time streaming architectures using Kafka, Kinesis, and Flink for event-driven systems",
    "Data quality and observability — automated testing and anomaly detection across production pipelines",
    "Third-party API data integration connecting CRMs, ERPs, and proprietary systems"
  ]},
  {"title":"Business Intelligence & Analytics","items":[
    "Executive dashboards and reporting suites on Looker, Power BI, Tableau, and custom React UIs",
    "Self-serve analytics platforms enabling non-technical stakeholders to query data independently",
    "Cohort analysis, funnel analytics, and behavioural segmentation for product and marketing teams",
    "Financial modelling and scenario planning tools integrated with live data sources"
  ]},
  {"title":"Machine Learning & Predictive Modelling","items":[
    "Churn prediction, demand forecasting, and customer lifetime value modelling",
    "Fraud detection and anomaly detection systems for fintech and e-commerce",
    "NLP models for document classification, entity extraction, and summarisation",
    "Model deployment, monitoring, and retraining pipelines on AWS SageMaker, Vertex AI, and Azure ML"
  ]},
  {"title":"Generative AI & LLM Integration","items":[
    "Retrieval-Augmented Generation (RAG) systems connecting LLMs to proprietary knowledge bases",
    "Fine-tuned model development on domain-specific datasets",
    "AI copilot development — embedded assistants within internal tools, CRMs, and SaaS platforms",
    "Prompt engineering and LLM evaluation frameworks for production-grade reliability",
    "AI governance policy and responsible AI framework development"
  ]},
  {"title":"Data Science Consulting","items":[
    "Embedded data science teams for ongoing analysis, experimentation, and model iteration",
    "A/B testing frameworks and experimentation infrastructure",
    "Causal inference and uplift modelling for marketing and product decisions"
  ]}
 ]'::jsonb, 2)
on conflict (slug) do nothing;


-- 03 CLOUD SOLUTIONS
insert into service_detail_pages (slug, number, title, tagline, intro, sections, sort_order) values
('cloud-solutions', '03', 'Cloud Solutions',
 'Cloud migration, DevOps, infrastructure automation, and managed operations across AWS, Google Cloud, and Microsoft Azure.',
 'Our Cloud Solutions practice supports organisations at every stage of cloud adoption — from initial migration strategy through to ongoing managed operations. We are platform-agnostic and experienced across all three major cloud providers, recommending and implementing the right architecture for each client''s specific requirements.',
 '[
  {"title":"Cloud Strategy & Migration","items":[
    "Cloud readiness assessments — evaluating workloads, dependencies, and migration risk profiles",
    "Migration strategy development — lift-and-shift, re-platforming, and cloud-native re-architecture",
    "Zero-downtime migrations with rollback planning and automated testing",
    "Multi-cloud and hybrid cloud architecture for resilience and vendor diversification",
    "FinOps and cost optimisation — rightsizing, reserved instance planning, and budget governance"
  ]},
  {"title":"Infrastructure as Code & Automation","items":[
    "Terraform and Pulumi infrastructure automation — reproducible, version-controlled cloud environments",
    "AWS CloudFormation and Azure Bicep for platform-native IaC",
    "Automated environment provisioning for development, staging, and production parity",
    "Configuration management at fleet scale using Ansible"
  ]},
  {"title":"DevOps & CI/CD Engineering","items":[
    "CI/CD pipeline design and implementation — GitHub Actions, GitLab CI, Jenkins, and CircleCI",
    "Container orchestration on Kubernetes (EKS, GKE, AKS)",
    "Helm chart development and GitOps workflows using ArgoCD and Flux",
    "Blue-green and canary deployment strategies for zero-risk releases"
  ]},
  {"title":"Cloud Security & Compliance","items":[
    "Cloud security posture management — continuous misconfiguration detection and remediation",
    "IAM architecture — least-privilege access, role-based controls, and identity federation",
    "Secrets management using HashiCorp Vault, AWS Secrets Manager, and Azure Key Vault",
    "Compliance-as-code for SOC 2, ISO 27001, GDPR, and HIPAA"
  ]},
  {"title":"Managed Cloud Operations","items":[
    "24/7 infrastructure monitoring with proactive alerting and incident response",
    "Observability stack implementation — Datadog, Grafana, Prometheus, and ELK",
    "Disaster recovery architecture with defined RTO and RPO targets",
    "Database administration — managed PostgreSQL, MySQL, MongoDB, and Redis on cloud"
  ]},
  {"title":"Serverless & Edge Computing","items":[
    "Serverless architecture design using AWS Lambda, Google Cloud Functions, and Azure Functions",
    "Edge deployment on Cloudflare Workers, Vercel Edge, and AWS CloudFront",
    "Event-driven microservices architectures"
  ]}
 ]'::jsonb, 3)
on conflict (slug) do nothing;


-- 04 CREATIVE SOLUTIONS
insert into service_detail_pages (slug, number, title, tagline, intro, sections, sort_order) values
('creative-solutions', '04', 'Creative Solutions',
 'Premium visual content production — motion graphics, 2D/3D animation, brand design, and video production for global enterprises and ambitious brands.',
 'Our Creative Solutions division produces visual content at enterprise scale, with a portfolio spanning global clients across gaming, technology, consumer goods, and sports. Our teams are built from practitioners with deep specialisation in each discipline. Every brief is managed by a dedicated creative supervisor to maintain brand coherence, deadline adherence, and production quality across all deliverables.',
 '[
  {"title":"Brand & Visual Identity","items":[
    "Brand identity development — logo systems, colour palettes, typography, and comprehensive brand guidelines",
    "Brand refresh and evolution for organisations modernising existing identities",
    "Visual identity audits across digital and physical touchpoints",
    "Packaging design — product packaging, labelling, and retail-ready artwork",
    "Brand books and style guides for internal and agency use"
  ]},
  {"title":"Motion Graphics & Animation","items":[
    "Motion graphics for marketing campaigns, product launches, and brand storytelling",
    "Animated explainer videos and product demonstrations",
    "Broadcast-ready motion packages — openers, lower thirds, transitions, and title cards",
    "Social media motion content — animated posts, reels, and story formats",
    "Kinetic typography and data visualisation animations"
  ]},
  {"title":"2D & 3D Animation","items":[
    "Character animation — 2D frame-by-frame and rigged character production",
    "3D product visualisation and photorealistic rendering for e-commerce and marketing",
    "Architectural visualisation — walkthroughs, fly-throughs, and rendered presentations",
    "3D environment design and asset creation for games, VR, and interactive media"
  ]},
  {"title":"Video Production & Post-Production","items":[
    "Full post-production services — editing, colour grading, and sound design for branded content",
    "Corporate video production — testimonials, case studies, and executive communications",
    "Social content production at scale — volume editing pipelines for multi-platform deployment",
    "Event highlight reels and documentary-style brand films",
    "Subtitling, captioning, and localisation for global markets"
  ]},
  {"title":"Graphic Design & Digital Assets","items":[
    "Digital advertising creative — display, social, and programmatic ad sets across formats",
    "Presentation design — investor decks, sales materials, and executive presentations",
    "UI/UX design — wireframing, prototyping, and high-fidelity interface design",
    "Illustration and custom iconography"
  ]},
  {"title":"Content at Scale","items":[
    "Monthly social media content packages for multi-platform publishing",
    "Brand-compliant design template systems for internal team self-serve",
    "Ongoing retainer production squads embedded on a monthly basis"
  ]}
 ]'::jsonb, 4)
on conflict (slug) do nothing;


-- 05 MANAGED SERVICES & STAFF AUGMENTATION
insert into service_detail_pages (slug, number, title, tagline, intro, sections, sort_order) values
('managed-services', '05', 'Managed Services & Staff Augmentation',
 'Enterprise-grade talent placed globally — embedded teams, back-office setup, and specialist placement at 40 to 70 percent below Western market rates.',
 'Our Managed Services division enables businesses to scale operations, access specialised talent, and reduce overhead without compromising on output quality. We place professionals globally, manage performance through dedicated supervisors, and support large organisations in establishing fully operational back-end offices. This is managed talent delivery — not recruitment.',
 '[
  {"title":"How It Works","items":[
    "Discovery and scoping — role requirements, performance KPIs, and integration protocols are defined",
    "Talent selection from our vetted global network, shortlisted and presented within agreed timelines",
    "Managed onboarding — tool access, workflow integration, and knowledge transfer",
    "Ongoing supervision by a dedicated 22 Signals supervisor at no additional cost",
    "Performance reporting — regular output reviews, KPI tracking, and continuous optimisation"
  ]},
  {"title":"Technology & Engineering","items":[
    "Software engineers — full-stack, backend, frontend, and mobile",
    "DevOps and cloud infrastructure engineers",
    "Data engineers, analysts, and ML engineers",
    "QA engineers and automation testers",
    "Technical project managers and engineering leads"
  ]},
  {"title":"Creative & Marketing","items":[
    "SEO specialists — technical, on-page, and content strategy",
    "Paid media managers — Google Ads, Meta, programmatic, and LinkedIn",
    "Content strategists and writers",
    "Social media and community managers",
    "Graphic designers, animators, and video editors",
    "Marketing analysts and performance reporting specialists"
  ]},
  {"title":"Customer Experience & Operations","items":[
    "Customer support representatives across voice, chat, and email",
    "Virtual assistants and executive assistants",
    "Operations coordinators and workflow managers"
  ]},
  {"title":"Finance & Professional Services","items":[
    "Bookkeepers and management accountants",
    "Financial analysts and FP&A support",
    "Paralegal and legal research support"
  ]},
  {"title":"Real Estate & Property Management","items":[
    "Virtual leasing agents and booking coordinators",
    "Property management assistants",
    "Tenant communication and CRM management teams"
  ]},
  {"title":"Back-Office Setup for Enterprise Clients","intro":"For larger organisations, we support the full establishment of offshore operational hubs:","items":[
    "Offshore office design and team structure planning",
    "Recruitment and onboarding at volume",
    "Technology infrastructure setup — tools, communication platforms, and security protocols",
    "Ongoing managed operations with embedded supervisory layer"
  ]}
 ]'::jsonb, 5)
on conflict (slug) do nothing;


-- 06 BROADCASTING & ESPORTS
insert into service_detail_pages (slug, number, title, tagline, intro, sections, sort_order) values
('broadcasting-esports', '06', 'Broadcasting & Esports',
 'End-to-end esports tournament management, live broadcast production, and brand activation — backed by over 100 online events and $2.1M in managed project value.',
 '22 Signals has an established track record in the global esports industry, having worked with Tencent, Garena, TCL, Samsung, and PepsiCo. Our Broadcasting & Esports division provides complete event management and broadcast production for brands seeking meaningful access to the gaming demographic. We have delivered 100+ online esports events and 25+ offline events globally, distributing $275,000 in prize pools and managing over $2.1M in total project value.',
 '[
  {"title":"Tournament & Event Management","items":[
    "End-to-end online tournament management — format design, registration, bracket management, moderation, and results",
    "Offline event production — venue sourcing, logistics, player experience, and on-site management",
    "Hybrid event formats combining live audience experiences with global online participation",
    "Multi-title expertise — FPS, MOBA, Battle Royale, sports simulation, and mobile gaming",
    "Prize pool management — distribution, tax compliance, and player verification",
    "Regional and global qualifier structures for large-scale competitive formats"
  ]},
  {"title":"Broadcast Production","items":[
    "Full show production including talent direction, graphics, and stream technical operations",
    "Custom animated overlay design — HUD systems, team branding, and dynamic data integration",
    "Broadcast interval management — in-stream commercial delivery and sponsor segments",
    "Multi-platform streaming to Twitch, YouTube Live, Facebook Gaming, and proprietary platforms",
    "VOD production and highlight packages for post-event content distribution",
    "Commentary and casting talent management for multilingual broadcasts"
  ]},
  {"title":"Brand Activation & Sponsorship Integration","items":[
    "Brand integration strategy for authentic activation within esports contexts",
    "In-game and in-stream placement — logo integration, sponsored segments, and branded challenges",
    "Influencer and streamer partnerships — sourcing, contracting, and management",
    "Audience analytics and reporting — reach, viewership, engagement, and conversion data"
  ]},
  {"title":"Social & Content Marketing","items":[
    "Gaming-focused content strategy for gaming communities across all major platforms",
    "Pre-event and post-event content production — clips, highlights, and team features",
    "Community management on Discord, Reddit, and platform-specific channels"
  ]},
  {"title":"Talent & Training","items":[
    "Player scouting and talent identification for brand-sponsored teams",
    "Team and coaching development programmes",
    "Content creator training for gaming talent developing brand partnerships"
  ]}
 ]'::jsonb, 6)
on conflict (slug) do nothing;


-- 07 GLOBAL MANUFACTURING
insert into service_detail_pages (slug, number, title, tagline, intro, sections, sort_order) values
('global-manufacturing', '07', 'Global Manufacturing',
 'Cost-competitive manufacturing across Pakistan and China — delivering 40 to 60 percent savings on production costs without compromising quality or lead times.',
 'Our Global Manufacturing division leverages an extensive international production network and an experienced research and sourcing team to deliver high-quality manufactured goods at significantly reduced cost. We manage the full supply chain — from initial sourcing and supplier qualification through to quality control, production management, and delivery logistics — giving clients a single point of accountability.',
 '[
  {"title":"Product Categories","items":[
    "Apparel and fashion — clothing, activewear, sportswear, and uniforms",
    "Footwear — athletic, casual, and branded shoe production",
    "Merchandise and promotional products — branded goods for events, retail, and corporate gifting",
    "Phone cases, accessories, and consumer electronics peripherals",
    "Packaging and retail display solutions",
    "Custom and specialised product manufacturing on request — feasibility assessed within five to seven business days"
  ]},
  {"title":"Supply Chain Management","items":[
    "Supplier identification and qualification — factory audits, compliance checks, and sample evaluation",
    "Price benchmarking, MOQ negotiation, and long-term contract structuring",
    "Production scheduling and capacity planning aligned to client launch timelines",
    "Multi-factory coordination for large or diversified product runs",
    "Logistics and freight management across FOB, CIF, and DDP incoterms"
  ]},
  {"title":"Quality Assurance","items":[
    "Pre-production sample review and approval workflows",
    "During-production quality inspections at critical production milestones",
    "Pre-shipment AQL-standard inspections before goods leave origin",
    "Defect reporting, rework management, and claim resolution",
    "Testing certification coordination for CE, FCC, RoHS, and category-specific compliance"
  ]},
  {"title":"Cost Architecture","intro":"Our manufacturing model delivers 40 to 60 percent cost reduction against Western production alternatives, achieved through:","items":[
    "Established relationships with high-output factories in Pakistan and China",
    "Aggregated volume across multiple clients",
    "A local research team on the ground",
    "Full landed cost transparency including production, freight, duties, and handling"
  ]}
 ]'::jsonb, 7)
on conflict (slug) do nothing;


-- 08 TRADING & INVESTMENTS
insert into service_detail_pages (slug, number, title, tagline, intro, sections, sort_order) values
('trading-investments', '08', 'Trading & Investments',
 'A disciplined, multi-asset investment operation focused on blockchain, cryptocurrency, futures, ETFs, and commodities — managed with institutional-grade rigour.',
 '22 Signals'' Trading & Investments division operates as a capital markets practice, deploying structured strategies across digital assets and traditional financial instruments. We combine quantitative analysis, macroeconomic research, and technical execution to generate risk-adjusted returns in some of the most dynamic and liquid markets in the world. This vertical is built for clients seeking disciplined exposure to alternative assets and derivatives markets — with the oversight, reporting, and governance expected at an institutional level.',
 '[
  {"title":"Digital Assets","items":[
    "Cryptocurrency portfolio construction and management across large-cap, mid-cap, and sector-specific allocations",
    "Blockchain protocol analysis and fundamental valuation of layer-one and layer-two networks",
    "DeFi yield strategies — liquidity provision, staking, and protocol-level capital deployment",
    "On-chain analytics integration for real-time market intelligence and position monitoring",
    "Custody and security architecture for institutional-grade digital asset management"
  ]},
  {"title":"Derivatives & Futures Trading","items":[
    "Futures trading across cryptocurrency, commodity, and financial instrument markets",
    "Options strategy development — covered calls, protective puts, and structured derivatives positions",
    "Perpetual futures management with systematic leverage controls and drawdown protocols",
    "Algorithmic execution systems for automated order management and risk-adjusted entries",
    "Basis trading, spread strategies, and cross-exchange arbitrage"
  ]},
  {"title":"ETF & Macro Strategies","items":[
    "ETF portfolio construction across equity, fixed income, commodity, and sector-specific funds",
    "Macro-driven allocation strategies integrating interest rate, inflation, and geopolitical analysis",
    "Thematic investment positioning — emerging technology, energy transition, and digital infrastructure",
    "Rebalancing frameworks aligned to defined risk tolerance and return targets"
  ]},
  {"title":"Commodity Markets","items":[
    "Exposure management across energy, metals, and agricultural commodity markets",
    "Commodity futures and forward contract trading",
    "Supply-demand research and geopolitical risk assessment for commodity positioning",
    "Commodity-linked ETF and structured product strategies"
  ]},
  {"title":"Risk Management & Governance","items":[
    "Portfolio-level risk frameworks covering volatility, correlation, and concentration controls",
    "Drawdown limits, position sizing protocols, and stop-loss discipline at the strategy level",
    "Counterparty due diligence and exchange risk assessment for all trading venues",
    "Regular performance reporting — returns attribution, risk metrics, and portfolio review",
    "Regulatory and compliance monitoring across applicable jurisdictions"
  ]},
  {"title":"Research & Intelligence","items":[
    "Quantitative research covering technical analysis, on-chain data, and market microstructure",
    "Macroeconomic and geopolitical intelligence feeds integrated into investment decision processes",
    "Custom market research and asset-specific due diligence for client-directed mandates"
  ]}
 ]'::jsonb, 8)
on conflict (slug) do nothing;


-- ============================================================
-- DONE ✅
-- 8 service detail pages, all editable from /admin/service-detail-pages
-- Each accessible on the public site at /services/<slug>
-- ============================================================
