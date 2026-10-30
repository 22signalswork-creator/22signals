// Single source of truth for 22 Signals public copy, page metadata and schema.
// Used by the React pages (src/pages/content) AND by scripts/prerender.mjs,
// which writes crawlable HTML for every route at build time.
// Style rules: US spelling, no em or en dashes, no hype words, one proof per section.

export const SITE = {
  name: "22 Signals",
  url: "https://www.22signals.com",
  tagline: "Ambitious ideas, executed.",
  description:
    "22 Signals is a global business solutions company. We build intelligent systems so companies can operate in the new era of business, then we grow them and execute with them: AI, cloud, data, technology, marketing and go-to-market, with specialist teams across the US, UK and UAE.",
  short:
    "We do the tech, the marketing and the execution for ambitious businesses, so they don't have to hire a whole team for it.",
  email: "business@22signals.com",
  phone: "+44 7944 603108",
  phoneHref: "+447944603108",
  city: "London",
  country: "GB",
  booking: "https://calendly.com/business-22signals/15min",
  founder: "Daniyal Mansur",
  ogImage: "https://www.22signals.com/og/home.jpg",
};

// Proof lines cleared for public use. One per section, said out loud.
export const PROOF = {
  search:
    "Right now, 10 of the businesses we work with sit in Google's top five for their main searches and show up in ChatGPT's answers.",
  ai: "We've done more than 30 AI builds for businesses that used to run the old way. They don't anymore.",
  events:
    "We've run and broadcast more than 20 large-scale live events. The date never moves, so we treat every deadline like a live date.",
  scale: "We've worked with 30+ companies across the US, UK, Europe and the UAE.",
  projects: "Over $1.5 million in projects managed.",
};

export const SERVICES = [
  { path: "/services/go-to-market", label: "Strategy and Go-to-Market", blurb: "The plan for a new market or product, and the people to run it." },
  { path: "/services/ai-consulting", label: "AI Consulting", blurb: "Find where AI pays off, plan it safely, then build it." },
  { path: "/services/business-optimization", label: "Business Optimization", blurb: "Map how work runs, remove the waste, automate what repeats." },
  { path: "/services/business-intelligence", label: "Business Intelligence", blurb: "Data in one place, KPIs that matter and dashboards leaders read." },
  { path: "/services/power-bi-consulting", label: "Power BI Consulting", blurb: "Power BI dashboards, data models and reporting that stay current." },
  { path: "/services/data-engineering", label: "Data Engineering", blurb: "Pipelines, warehouses and integrations your reporting can trust." },
  { path: "/services/ai-automation", label: "AI and Automation", blurb: "Custom AI tools and automations that take a business off the old way of working." },
  { path: "/services/custom-ai-development", label: "Custom AI Development", blurb: "AI agents and AI features built on your data, with guardrails." },
  { path: "/services/whatsapp-automation", label: "WhatsApp Automation", blurb: "WhatsApp replies, bookings and lead capture, connected to your CRM." },
  { path: "/services/cloud", label: "Cloud Consulting", blurb: "Cloud architecture, security and operations on AWS, Google Cloud and Azure." },
  { path: "/services/cloud-migration", label: "Cloud Migration", blurb: "Move servers, apps and data to the cloud with minimal downtime." },
  { path: "/services/devops-consulting", label: "DevOps Consulting", blurb: "CI/CD, infrastructure as code and releases that don't break." },
  { path: "/services/web-app-development", label: "Web Development", blurb: "Sites, portals and e-commerce built to rank, convert and last." },
  { path: "/services/app-development", label: "App Development", blurb: "iOS, Android and web apps, from MVP to app store launch." },
  { path: "/services/seo-geo", label: "SEO and GEO", blurb: "Show up in Google and in ChatGPT, Claude, Gemini and Google AI Overview answers." },
  { path: "/services/paid-media", label: "Paid Media", blurb: "Google, Meta, LinkedIn and TikTok campaigns tied to leads you can count." },
  { path: "/services/social-media-management", label: "Social Media Management", blurb: "Calendars, posting, community and reporting across the channels your buyers use." },
  { path: "/services/influencer-campaigns", label: "Influencer Campaigns", blurb: "Creators who fit the brand, briefed, contracted and tracked to results." },
  { path: "/services/content-marketing", label: "Content Marketing", blurb: "Articles, guides and short video that bring the right people to you." },
  { path: "/services/video-motion", label: "Video and Motion Graphics", blurb: "Reels, brand films, motion graphics and live broadcast." },
  { path: "/services/ai-video-production", label: "AI Video Production", blurb: "AI presenters, AI ad variations and AI-generated scenes, clearly labeled." },
  { path: "/services/3d-animation", label: "2D and 3D Animation", blurb: "Animated explainers, product and technical animation." },
  { path: "/services/3d-rendering", label: "3D Rendering", blurb: "Photoreal product, packaging, campaign and interior renders." },
  { path: "/services/more", label: "More We Do", blurb: "Managed teams, live events, game development and product sourcing." },
];

// The 10 services that have a page in every city: city slug -> global page.
export const CITY_SERVICES = [
  { slug: "ai-consulting", label: "AI Consulting", global: "/services/ai-consulting" },
  { slug: "ai-automation", label: "AI Automation", global: "/services/ai-automation" },
  { slug: "business-intelligence", label: "Business Intelligence and Data Analytics", global: "/services/business-intelligence" },
  { slug: "cloud-consulting", label: "Cloud Consulting", global: "/services/cloud" },
  { slug: "web-development", label: "Web Development", global: "/services/web-app-development" },
  { slug: "app-development", label: "App Development", global: "/services/app-development" },
  { slug: "seo-geo", label: "SEO and GEO", global: "/services/seo-geo" },
  { slug: "paid-media", label: "Paid Media", global: "/services/paid-media" },
  { slug: "video-animation", label: "Video, Animation and AI Video", global: "/services/video-motion" },
  { slug: "3d-rendering", label: "3D Rendering", global: "/services/3d-rendering" },
];

export const CITIES = [
  { slug: "new-york", name: "New York", region: "us", state: "New York" },
  { slug: "los-angeles", name: "Los Angeles", region: "us", state: "California" },
  { slug: "san-francisco", name: "San Francisco", region: "us", state: "California" },
  { slug: "dallas", name: "Dallas", region: "us", state: "Texas" },
  { slug: "houston", name: "Houston", region: "us", state: "Texas" },
  { slug: "austin", name: "Austin", region: "us", state: "Texas" },
  { slug: "chicago", name: "Chicago", region: "us", state: "Illinois" },
  { slug: "miami", name: "Miami", region: "us", state: "Florida" },
  { slug: "london", name: "London", region: "uk" },
  { slug: "manchester", name: "Manchester", region: "uk" },
  { slug: "birmingham", name: "Birmingham", region: "uk" },
  { slug: "dubai", name: "Dubai", region: "uae" },
  { slug: "abu-dhabi", name: "Abu Dhabi", region: "uae" },
  { slug: "dublin", name: "Dublin", region: "eu", country: "Ireland" },
  { slug: "amsterdam", name: "Amsterdam", region: "eu", country: "Netherlands" },
  { slug: "berlin", name: "Berlin", region: "eu", country: "Germany" },
  { slug: "paris", name: "Paris", region: "eu", country: "France" },
  { slug: "madrid", name: "Madrid", region: "eu", country: "Spain" },
  { slug: "milan", name: "Milan", region: "eu", country: "Italy" },
  { slug: "stockholm", name: "Stockholm", region: "eu", country: "Sweden" },
  { slug: "zurich", name: "Zurich", region: "eu", country: "Switzerland" },
  { slug: "lahore", name: "Lahore", region: "pk" },
  { slug: "karachi", name: "Karachi", region: "pk" },
  { slug: "islamabad", name: "Islamabad", region: "pk" },
];
export const REGION_LABELS = { us: "United States", uk: "United Kingdom", eu: "Europe", uae: "United Arab Emirates", pk: "Pakistan" };


export const INDUSTRIES = [
  { path: "/industries/healthcare", label: "Healthcare and Wellness" },
  { path: "/industries/fashion-beauty", label: "Fashion, Beauty and Retail" },
  { path: "/industries/technology-ai", label: "Technology and AI Companies" },
  { path: "/industries/professional-services", label: "Law Firms and Professional Services" },
  { path: "/industries/gaming-entertainment", label: "Gaming, Esports and Entertainment" },
  { path: "/industries/real-estate", label: "Real Estate" },
];

export const MARKETS = [
  { path: "/united-states", label: "United States" },
  { path: "/united-kingdom", label: "United Kingdom" },
  { path: "/uae", label: "UAE" },
  { path: "/pakistan", label: "Pakistan" },
];

const CTA = {
  heading: "Book a 15-minute call.",
  text: "A fit check, not a pitch. A few questions, an honest answer and a clear next step. Not every call ends in a proposal.",
  button: "Book 15 minutes",
};

// ---------------------------------------------------------------------------
// Pages. Each: path, title (<60), description (<160), eyebrow, h1, intro (the
// 40 to 60 word answer AI assistants quote), sections, faqs, related, schema.
// ---------------------------------------------------------------------------

export const PAGES = [
  // ======================= HOME (head + crawlable fallback only) ===========
  // Mirrors the live homepage (CMS-driven) so crawlers see what visitors see.
  {
    path: "/",
    kind: "home",
    title: "22 Signals: Ambitious Ideas, Executed",
    description:
      "22 Signals builds intelligent systems for ambitious companies, then grows them: AI, cloud, data, web and apps, SEO and GEO, paid media, video and go-to-market.",
    eyebrow: "Business solutions company",
    h1: "Ambitious ideas, executed.",
    intro:
      "We build the systems a business runs on, then we grow it. 22 Signals is a global business solutions company, with specialist teams across the US, UK and UAE.",
    sections: [
      {
        h: "One team instead of ten.",
        p: ["Seven areas, one team: strategy, AI, data and cloud, web and apps, growth marketing, creative and managed services."],
        list: [
          "Web and App Development: websites, portals and apps built to rank, convert and last.",
          "AI and Automation: custom AI tools and automations that take a business off the old way of working.",
          "Cloud and Data: cloud infrastructure, migrations, DevOps and data systems that keep up with the business.",
          "Video, Motion and 3D: reels, brand films, motion graphics, 3D and live broadcast.",
          "Strategy and Go-to-Market: the plan for a new market or product, and the people to run it.",
          "SEO, GEO and Paid Media: show up in Google and in ChatGPT, Claude and Gemini answers, and run ads tied to leads.",
          "More We Do: managed teams, live events, game development and product sourcing.",
        ],
      },
      {
        h: "How we work.",
        p: ["Talk, plan, build, grow."],
      },
      {
        h: "In numbers we stand behind",
        list: ["30+ companies worked with", "30+ AI builds", "20+ live events broadcast", "$1.5M+ in projects managed"],
      },
    ],
    faqs: [
      { q: "Who do I work with day to day?", a: "A project lead who runs the specialist teams behind your project. One person to call, a written scope and agreed dates." },
      { q: "What if I need multiple services?", a: "We run all of it. Technology, AI, cloud, marketing and go-to-market sit under one team, so you deal with one team instead of ten." },
      { q: "What does it cost?", a: "It depends on scope, so we price after a 15-minute call. For product sourcing and managed teams, savings of 40 to 60% are typical, depending on product, volume and role." },
      { q: "What does 22 Signals do?", a: "Businesses hire us to handle their tech, marketing and launches, so they deal with one team instead of ten and don't have to hire a whole team for it." },
    ],
    related: [],
  },

  // ======================= SERVICES HUB ====================================
  {
    path: "/services",
    kind: "hub",
    title: "Services: AI, Cloud, Web, SEO and GEO, Video | 22 Signals",
    description:
      "Strategy and go-to-market, AI and automation, cloud and data, web and app development, SEO and GEO, paid media, and video, motion and 3D.",
    eyebrow: "What we do",
    h1: "Ambitious ideas, executed.",
    intro:
      "22 Signals builds the systems a business runs on, then grows it. Seven service areas, from strategy and AI to growth marketing and video, run by one team with specialists behind every project.",
    sections: [
      {
        h: "One team instead of ten.",
        p: [
          "Pick the service you need today. Strategy and AI, data and cloud, websites and apps, search and paid media, and video and 3D all sit under one team, so the next service is already in the room when you need it.",
        ],
      },
      {
        h: "How we work, step by step",
        p: ["One accountable lead, specialist teams behind them, and every date in writing. Discovery and a roadmap take 5 to 7 days."],
        list: [
          "Talk: a 15-minute call to see if we fit.",
          "Plan: discovery and a written roadmap in 5 to 7 days.",
          "Build: specialist teams build it, dates in writing.",
          "Grow: we run it, measure it and grow it with you.",
        ],
      },
    ],
    faqs: [
      { q: "Can I hire 22 Signals for just one service?", a: "Yes. Most clients start with one service, such as an AI build, a website or search. Because the other services sit in the same team, adding one later does not mean briefing a new supplier." },
      { q: "Who runs my project?", a: "One accountable lead, the Signal Lead, runs your project and the specialist teams behind it. You get one person to call, a written scope and dates in writing." },
      { q: "How quickly can you start?", a: "After a 15-minute call, discovery and a written roadmap take 5 to 7 days. The build starts on the dates agreed in that roadmap." },
      { q: "Which industries do you work with?", a: "Mostly established companies in healthcare, fashion and beauty, technology and AI, law and professional services, gaming and entertainment, and real estate, plus founders and startups." },
      { q: "What does it cost?", a: "It depends on scope, so we price after a 15-minute call and put it in writing before any work starts. For product sourcing and managed teams, savings of 40 to 60% are typical, depending on product, volume and role." },
    ],
    related: [],
  },

  // ======================= SERVICES ========================================
  {
    path: "/services/go-to-market",
    kind: "service",
    serviceType: "Go-to-market strategy",
    title: "Go-to-Market Strategy and Launch | 22 Signals",
    description:
      "Positioning, pricing, launch plans and sales pipelines for new products and new markets, then the teams to execute them.",
    eyebrow: "Strategy and Go-to-Market",
    h1: "Go-to-market strategy that ships.",
    intro:
      "22 Signals plans how a product or a company wins a market, then executes the plan. That covers research, positioning, pricing, launch channels, sales pipelines and partnerships, plus the brand, website, content and ads underneath. Consultants hand you a plan and leave. We make the plan, then we build it.",
    sections: [
      {
        h: "What's included",
        list: [
          "Market and competitor research, and who will actually buy",
          "Positioning, messaging and pricing",
          "Business, operating and marketing plans",
          "Launch plan by channel, with dates in writing",
          "Outbound and CRM setup so the pipeline doesn't depend on luck",
          "Partnerships and distribution",
        ],
      },
      {
        h: "Who it's for",
        p: [
          "Established companies opening a new region, product line or category come first. We also work with founders launching a product and startups entering a new market. We've taken a neurotech device from idea to a full business, operating and marketing plan, and built a complete outbound sales engine for ourselves first.",
        ],
      },
      {
        h: "How it runs",
        p: [
          "Talk, plan, build, grow. One lead owns the plan and the execution, so nothing is lost between the strategy deck and the people doing the work.",
        ],
      },
    ],
    faqs: [
      {
        q: "What does a go-to-market partner do?",
        a: "A go-to-market partner works out who will buy, what to say and where to sell, then runs the launch: brand, website, content, ads, outbound and partnerships. 22 Signals does both the plan and the execution, with one lead accountable for the result.",
      },
      {
        q: "How long does a go-to-market plan take?",
        a: "It depends on how much research the market needs. We agree the date in writing before we start, and execution begins as soon as the plan is signed off.",
      },
    ],
    related: ["/services/paid-media", "/services/video-motion", "/industries/technology-ai"],
  },
  {
    path: "/services/ai-consulting",
    kind: "service",
    serviceType: "AI consulting",
    title: "AI Consulting Services: Strategy to Working Systems | 22 Signals",
    description:
      "AI consulting for established companies: find where AI pays off, plan it, then build it. Readiness reviews, roadmaps, governance and working pilots.",
    eyebrow: "AI Consulting",
    h1: "AI consulting that ends in working systems.",
    intro:
      "22 Signals helps companies work out where AI will actually pay off, then builds it. We review how the business runs today, find the processes worth automating or augmenting, pick the right tools, set the rules for using them safely, and ship a working pilot. Most AI strategies stop at a slide deck. Ours stop at a system your team uses.",
    sections: [
      { h: "Proof", p: [PROOF.ai] },
      {
        h: "What's included",
        list: [
          "AI readiness review: data, systems, people and risk",
          "Use-case discovery, ranked by value and effort",
          "AI roadmap with owners, budgets and dates",
          "Tool and vendor selection, including build versus buy",
          "AI policy, governance and data-privacy rules for your team",
          "Pilot builds that prove the value before you scale",
          "Team training so people actually use what's built",
        ],
      },
      {
        h: "Who it's for",
        p: [
          "Established companies that know AI matters but haven't turned it into results yet, and leadership teams that need a clear plan before they spend. Founders and startups building AI into a product use the same process, faster.",
        ],
      },
    ],
    faqs: [
      {
        q: "What does an AI consultant do?",
        a: "An AI consultant finds where AI can save time, cut cost or create revenue in a business, plans how to adopt it safely, and helps put it in place. At 22 Signals, the same team that advises also builds, so the plan ends in a working system.",
      },
      {
        q: "Where should a company start with AI?",
        a: "Start with one process your team repeats every day that runs on documents, email or data. A focused pilot there proves value quickly and shows what the next step should be.",
      },
      {
        q: "Do we need clean data before using AI?",
        a: "Not perfect data, but usable data. Part of the readiness review is checking what you have and fixing the gaps that matter for the first use cases.",
      },
    ],
    related: ["/services/ai-automation", "/services/business-intelligence", "/services/business-optimization"],
  },
  {
    path: "/services/business-optimization",
    kind: "service",
    serviceType: "Business process optimization consulting",
    title: "Business Optimization Consulting | 22 Signals",
    description:
      "Business process optimization for established companies: map how work really runs, remove the waste, automate what repeats and measure the result.",
    eyebrow: "Business Optimization Consulting",
    h1: "Move off the old way of working.",
    intro:
      "22 Signals helps established businesses run leaner. We map how work actually flows through your teams and tools, find the delays, duplication and manual steps that cost time and money, then fix them: new processes, connected systems, automation and the dashboards to prove it worked. It's business optimization consulting with the build included.",
    sections: [
      {
        h: "What's included",
        list: [
          "Process mapping across sales, operations, finance and delivery",
          "Bottleneck, cost and time analysis",
          "Operating model and roles: who owns what",
          "Systems review and consolidation, so tools stop overlapping",
          "Workflow automation and AI where it pays off",
          "KPIs and dashboards to track the improvement",
        ],
      },
      { h: "Proof", p: [PROOF.ai] },
      {
        h: "Advice that gets built",
        p: [
          "Most consultants hand over a report. We hand over a business that runs differently, because the team that recommends the change is the team that makes it.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is business process optimization?",
        a: "It is the work of finding where time and money leak out of the way a business operates, through manual steps, duplicated effort or disconnected tools, and redesigning those processes so they run faster, cheaper and with fewer errors.",
      },
      {
        q: "How do you measure the result?",
        a: "We agree the measures before we start, such as hours spent, turnaround time, error rate or cost per task, and track them on a dashboard before and after the change.",
      },
    ],
    related: ["/services/ai-consulting", "/services/ai-automation", "/services/business-intelligence"],
  },
  {
    path: "/services/business-intelligence",
    kind: "service",
    serviceType: "Business intelligence and data analytics consulting",
    title: "Business Intelligence and Data Analytics Consulting | 22 Signals",
    description:
      "BI consulting, dashboards and data analytics: bring your numbers into one place, report on what matters and decide on data, not guesses.",
    eyebrow: "Business Intelligence Consulting",
    h1: "Decisions on data, not guesses.",
    intro:
      "22 Signals builds business intelligence for companies whose numbers live in too many places. We connect your systems, build the data warehouse and pipelines, design the KPIs that matter, and deliver dashboards and reports in Power BI, Looker Studio or Tableau that leadership actually reads. Then we keep the data clean and the reports current.",
    sections: [
      {
        h: "What's included",
        list: [
          "Data strategy and KPI design",
          "Data warehouse and pipelines from your CRM, finance, ads and operations tools",
          "Dashboards in Power BI, Looker Studio or Tableau",
          "Automated reporting on a schedule",
          "Forecasting and analysis for sales, marketing and operations",
          "Data quality checks and governance",
        ],
      },
      {
        h: "Connected to the rest of the business",
        p: [
          "Because the same team runs cloud, AI and marketing, the data we model is the data your business actually runs on, and the dashboards feed the automations and AI tools built on top.",
        ],
      },
    ],
    faqs: [
      {
        q: "What does a business intelligence consultant do?",
        a: "A BI consultant brings a company's data together, defines the metrics that matter, and builds the dashboards and reports that let leaders see performance and make decisions quickly.",
      },
      {
        q: "Which BI tools do you work with?",
        a: "Power BI, Looker Studio and Tableau for reporting, and cloud data warehouses such as BigQuery and Azure for storage. We recommend what fits your stack and budget.",
      },
    ],
    related: ["/services/cloud", "/services/ai-consulting", "/services/business-optimization"],
  },
  {
    path: "/services/ai-automation",
    kind: "service",
    serviceType: "AI development and business automation",
    title: "AI and Automation: Custom AI Tools | 22 Signals",
    description:
      "Custom AI tools, automations and internal systems that move a business off the old way of working. More than 30 AI builds delivered.",
    eyebrow: "AI and Automation",
    h1: "Custom AI tools and automations.",
    intro:
      "22 Signals builds custom AI tools, automations and internal software that take repetitive work off a team and make the business smarter: intake and booking, reporting, research, content operations, sales follow-up and data analysis. We scope a build, agree the dates in writing, ship it, and measure what changed.",
    sections: [
      { h: "Proof", p: [PROOF.ai] },
      {
        h: "What we build",
        list: [
          "AI assistants that answer customers, qualify leads and book appointments, with a human hand-off",
          "Automations across email, CRM, spreadsheets and the tools you already use",
          "Internal tools and dashboards for operations, finance and sales",
          "Research and reporting systems that run on a schedule",
          "Data pipelines and analysis so decisions run on numbers, not guesses",
        ],
      },
      {
        h: "The last 20%",
        p: [
          "Anyone can prompt. The part that matters is making a system reliable enough that a business runs on it: edge cases, permissions, checks, and someone who answers for it. That's the part we're good at.",
        ],
      },
    ],
    faqs: [
      {
        q: "What can AI automate in a small business?",
        a: "Common first builds are replying to enquiries out of hours, booking and reminders, follow-up emails, reporting, invoice and document handling, and research. The best first build is the task your team repeats most and likes least.",
      },
      {
        q: "Do you use off-the-shelf tools or build custom?",
        a: "Both. We use existing tools where they fit and build custom where they don't, then connect everything so your team works in one place.",
      },
      {
        q: "How long does an AI build take?",
        a: "It depends on the scope. Focused automations are small builds; larger internal systems are scoped in phases. Every phase gets a date in writing before we start.",
      },
    ],
    related: ["/services/cloud", "/industries/healthcare", "/industries/professional-services"],
  },
  {
    path: "/services/cloud",
    kind: "service",
    serviceType: "Cloud infrastructure and data engineering",
    title: "Cloud Solutions: Infrastructure, DevOps, Data | 22 Signals",
    description:
      "Cloud architecture, migrations, DevOps, security and data systems on AWS, Google Cloud and Azure. Built to stay fast, secure and cost-controlled.",
    eyebrow: "Cloud and Data",
    h1: "Cloud infrastructure that keeps up with the business.",
    intro:
      "22 Signals designs, migrates and runs cloud infrastructure for growing companies on AWS, Google Cloud and Azure. We set up the architecture, DevOps pipelines, security, monitoring and data systems, then keep them fast and the bill under control. It's the layer every AI build, app and website depends on.",
    sections: [
      {
        h: "What's included",
        list: [
          "Cloud architecture and setup on AWS, Google Cloud or Azure",
          "Migrations from legacy servers and shared hosting",
          "DevOps: CI/CD pipelines, environments, automated deploys",
          "Security, backups, access control and monitoring",
          "Data warehouses, pipelines and dashboards",
          "Cost reviews that cut waste without cutting performance",
        ],
      },
      {
        h: "Why it matters now",
        p: [
          "AI tools, apps and data all run on infrastructure. If it's slow, insecure or expensive, everything built on top inherits the problem. We build the foundation first, so the intelligent systems on top of it actually hold.",
        ],
      },
      {
        h: "Running it, not just setting it up",
        p: [
          "Most cloud work fails after handover. We stay on to monitor, patch, scale and report, with one lead you can call.",
        ],
      },
    ],
    faqs: [
      {
        q: "Which cloud platforms do you work with?",
        a: "AWS, Google Cloud and Microsoft Azure, plus Vercel, Supabase and similar platforms for web and app workloads. We recommend the one that fits your stack and budget.",
      },
      {
        q: "Can you migrate us without downtime?",
        a: "Most migrations run with no or minimal downtime by building the new environment alongside the old one, testing it, and switching over in a planned window.",
      },
      {
        q: "Can you reduce our cloud bill?",
        a: "Usually, yes. Right-sizing, removing idle resources and better storage and caching choices often lower costs. We review your setup first and show you where the money goes.",
      },
    ],
    related: ["/services/ai-automation", "/services/web-app-development", "/industries/technology-ai"],
  },
  {
    path: "/services/web-app-development",
    kind: "service",
    serviceType: "Web and app development",
    title: "Web and App Development | 22 Signals",
    description:
      "Fast websites, client portals, web apps and mobile apps, built to rank, convert and last. Designed, built and maintained by one team.",
    eyebrow: "Web and App Development",
    h1: "Websites and apps that do the work.",
    intro:
      "22 Signals designs and builds websites, client portals, web apps and mobile apps for businesses that need more than a brochure: fast pages that rank in search, booking and payments, member areas, and integrations with the tools the business already runs on. A site is one piece of what the business needs, so we build it to connect to the rest.",
    sections: [
      {
        h: "What we build",
        list: [
          "Websites and redesigns, built for search and speed from day one",
          "Client portals with logins, documents and payments",
          "Web apps and SaaS products",
          "Mobile apps for iOS and Android",
          "E-commerce stores",
          "Website care: security, updates, backups and clean-ups",
        ],
      },
      {
        h: "Built to be found",
        p: [
          "Every build ships with clean structure, schema, fast load times and pages that search engines and AI assistants can read. The search team checks it before launch, not after rankings drop.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you redesign our site without losing rankings?",
        a: "Yes. We map every old URL to a new one, keep the content that ranks, redirect the rest and monitor rankings and errors after launch.",
      },
      {
        q: "Do you maintain sites after launch?",
        a: "Yes. Ongoing care covers updates, security, backups, uptime monitoring and small changes, with one lead to call.",
      },
    ],
    related: ["/services/seo-geo", "/services/cloud", "/industries/fashion-beauty"],
  },
  {
    path: "/services/seo-geo",
    kind: "service",
    serviceType: "SEO and generative engine optimization",
    title: "SEO and GEO Services: Google and AI Answers | 22 Signals",
    description:
      "SEO and GEO so your business shows up in Google and in the answers ChatGPT, Claude, Gemini and Google AI Overviews give. Reported monthly in plain words.",
    eyebrow: "SEO and GEO",
    h1: "SEO and GEO: show up where buyers ask.",
    intro:
      "GEO (generative engine optimization) is the work of getting a business named, and described correctly, when someone asks ChatGPT, Claude, Gemini, Perplexity or Google's AI Overviews for a recommendation. It sits on top of SEO, because AI answers lean on the same signals search engines trust. 22 Signals does both and reports what moved every month.",
    sections: [
      { h: "Where our clients stand today", p: [PROOF.search] },
      {
        h: "What we do",
        list: [
          "Check how you show up today across Google and the AI assistants your buyers use",
          "Fix how your business is described everywhere AI reads: your site, profiles, directories and reviews",
          "Rewrite key pages so the answer comes first and is easy to quote",
          "Technical SEO so crawlers can read every page",
          "Local SEO and Google Business Profile for businesses with real locations",
          "Content and outside mentions that search engines and assistants trust",
          "Monthly reporting from our own data stack, in plain words",
        ],
      },
      {
        h: "What we won't do",
        p: [
          "Promise a number of AI mentions, publish thin pages in bulk, or sell a single file as a ranking trick. Nobody controls what an assistant says. We control the signals it reads.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the difference between GEO and SEO?",
        a: "SEO gets your pages ranked in search results. GEO gets your business named inside the answer itself, in ChatGPT, Claude, Gemini or Google's AI Overviews. Most of the work overlaps; GEO adds consistent descriptions across the web, answer-first pages and mentions on sites the assistants trust.",
      },
      {
        q: "How long does SEO and GEO take to work?",
        a: "Fixes to how you're described show once pages are recrawled. Ranking and being recommended for competitive searches takes longer, depending on your site and how crowded your market is. We agree milestones in writing and report what moved every month.",
      },
      {
        q: "Can you guarantee ChatGPT will recommend us?",
        a: "No one honestly can. We show you which questions you appear for, across which assistants, and what changed month to month.",
      },
      {
        q: "How do you measure AI search results?",
        a: "Search Console and Bing Webmaster Tools AI reports, visits from AI assistants in analytics, and a fixed set of buyer questions we test every month across the major assistants.",
      },
    ],
    related: ["/services/web-app-development", "/services/paid-media", "/industries/professional-services"],
  },
  {
    path: "/services/paid-media",
    kind: "service",
    serviceType: "Paid media management",
    title: "Paid Media: Google, Meta and TikTok Ads | 22 Signals",
    description:
      "Paid search and paid social campaigns tied to leads and revenue, with the creative, landing pages and tracking built by the same team.",
    eyebrow: "Paid Media",
    h1: "Paid media tied to leads you can count.",
    intro:
      "22 Signals plans, builds and runs paid campaigns on Google, Meta, LinkedIn and TikTok, and connects them to calls, bookings, sales and your CRM. Because the same team makes the video, the landing pages and the tracking, nothing gets lost between the ad and the result.",
    sections: [
      {
        h: "What's included",
        list: [
          "Google Search, Performance Max and YouTube",
          "Meta (Facebook and Instagram), LinkedIn and TikTok",
          "Ad creative: video, motion and static, made in-house",
          "Landing pages built to convert",
          "Conversion tracking, call tracking and CRM connection",
          "Weekly optimization and a monthly report in plain words",
        ],
      },
      {
        h: "Creative is the targeting now",
        p: [
          "Ad platforms decide who sees an ad largely from the ad itself. Having the video and motion team in the same room as the media buyer is the advantage.",
        ],
      },
    ],
    faqs: [
      {
        q: "Which ad platforms do you manage?",
        a: "Google Ads, Meta, LinkedIn and TikTok. We pick channels based on where your buyers are, not where it's easiest to spend.",
      },
      {
        q: "Do you make the ad creative too?",
        a: "Yes. Video, motion graphics and static ads are made by our own video and motion team.",
      },
    ],
    related: ["/services/video-motion", "/services/go-to-market", "/industries/fashion-beauty"],
  },
  {
    path: "/services/video-motion",
    kind: "service",
    serviceType: "Video production, motion graphics and 3D animation",
    title: "Video Production, AI Video, Animation and 3D Renders | 22 Signals",
    description:
      "Video production, AI video, motion graphics, animation and photoreal 3D renders for brands that need content at volume, every week.",
    eyebrow: "Video, AI Video, Animation and 3D",
    h1: "Video, animation and 3D that stops the scroll.",
    intro:
      "22 Signals produces video, AI video, motion graphics, 2D and 3D animation and photoreal 3D renders for brands that need content at volume without losing the standard. We also run and broadcast live events. Book a 15-minute call to talk through what you need.",
    sections: [
      {
        h: "What we make",
        list: [
          "Short-form video and reels for Instagram, TikTok, YouTube and LinkedIn",
          "Motion graphics and animated explainers",
          "Brand films and launch videos",
          "AI video: AI presenters, AI ads and AI-generated scenes, clearly labeled",
          "2D and 3D animation and animated explainers",
          "3D modeling and photoreal 3D renders for products, packaging and campaigns",
          "Technical and product 3D animation that explains how something works",
          "Managed video editing teams for ongoing volume",
        ],
      },
      { h: "Live events and broadcast", p: [PROOF.events] },
    ],
    faqs: [
      {
        q: "How fast can you turn around a reel?",
        a: "We agree the delivery date in writing before we start, based on the brief and assets. Larger series get a schedule with a date for every batch.",
      },
      {
        q: "Do you provide ongoing video editing?",
        a: "Yes. We run managed editing teams for brands that publish every week, with one lead and a clear turnaround for every batch.",
      },
      {
        q: "Do you use AI in video production?",
        a: "Where it helps, yes, for things like presenters, backgrounds and versions. Anything AI-generated is labeled, and every piece is reviewed by a person before it goes out.",
      },
    ],
    related: ["/services/paid-media", "/industries/gaming-entertainment", "/industries/fashion-beauty"],
  },
  {
    path: "/services/more",
    kind: "service",
    serviceType: "Managed teams, live events, game development and product sourcing",
    title: "More We Do: Teams, Events, Games, Sourcing | 22 Signals",
    description:
      "Managed specialist teams, live events and broadcast, game development and product sourcing through partner factories, all under one lead.",
    eyebrow: "More we do",
    h1: "More we do.",
    intro:
      "Beyond the core services, 22 Signals runs managed specialist teams, live events and broadcasts, game development, and product sourcing and manufacturing through partner factories. Same model: one lead, specialist people behind them.",
    sections: [
      {
        id: "managed-teams",
        h: "Managed teams",
        p: [
          "Supervised specialists for engineering, design, video, marketing, finance and support, with a lead who manages quality so you don't have to. Depending on the role, companies typically save 40 to 60% against hiring locally.",
        ],
      },
      {
        id: "live-events",
        h: "Live events and broadcast",
        p: [PROOF.events + " Tournaments, summits, launches and online broadcasts, planned and produced by one team."],
      },
      {
        id: "game-development",
        h: "Game development",
        p: ["Games, interactive experiences and esports products, from concept and design to build and launch."],
      },
      {
        id: "manufacturing",
        h: "Product sourcing and manufacturing",
        p: [
          "Sourcing, sampling, production and quality control through partner factories for merchandise, apparel and physical products. Depending on product and volume, clients can cut unit costs by 40 to 60%.",
        ],
      },
    ],
    faqs: [],
    related: ["/services/video-motion", "/industries/gaming-entertainment", "/industries/fashion-beauty"],
  },

  // ======================= INDUSTRIES ======================================
  {
    path: "/industries/healthcare",
    kind: "industry",
    title: "Healthcare, Wellness and Aesthetics Growth | 22 Signals",
    description:
      "AI tools, patient booking, SEO and GEO, video and 3D animation for clinics, aesthetics practices, health tech and neurotech companies.",
    eyebrow: "Healthcare and Wellness",
    h1: "Growth and systems for healthcare brands.",
    intro:
      "22 Signals works with clinics, aesthetics and dental practices, wellness brands, health tech and neurotech companies. We build patient booking and AI that replies to messages out of hours, get practices found in Google and in AI answers, and produce video and 3D animation that explains a treatment or a device clearly.",
    sections: [
      {
        h: "What we do for healthcare",
        list: [
          "Search and AI-answer audits: we tested 35 patient questions across five AI engines for one US aesthetics practice",
          "Business, operating and marketing plans for health devices going to market",
          "Websites with online booking, forms and secure patient flows",
          "AI that answers enquiries and books appointments, with a human hand-off",
          "Video, motion and 3D animation for treatments and devices",
          "Paid media within platform health-advertising rules",
        ],
      },
      {
        h: "Accuracy first",
        p: [
          "Health content has to be right. Clinical claims are checked against sources and approved by your team before anything is published.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do clinics show up in ChatGPT and Google AI Overviews?",
        a: "Assistants draw on a clinic's website and, more heavily, on reviews, directories, local news and health listings. Clinics that are described consistently, well reviewed and have clear treatment pages get named more often.",
      },
    ],
    related: ["/services/ai-automation", "/services/seo-geo", "/services/video-motion"],
  },
  {
    path: "/industries/fashion-beauty",
    kind: "industry",
    title: "Fashion, Beauty and Retail Brands | 22 Signals",
    description:
      "E-commerce builds, paid social, reels, AI tools and product sourcing for fashion, beauty, salon and retail brands. One team from launch to scale.",
    eyebrow: "Fashion, Beauty and Retail",
    h1: "From the next collection to the next customer.",
    intro:
      "22 Signals helps fashion, beauty, salon and retail brands launch and sell: online stores, reels and motion content, paid social on Meta and TikTok, search, AI tools for customer service and stock, and sourcing for the next collection through partner factories. One team, from the product to the customer.",
    sections: [
      {
        h: "What we do for brands",
        list: [
          "E-commerce stores and booking sites",
          "Reels, product videos and motion graphics at volume",
          "Paid social on Meta and TikTok, with creative made in-house",
          "Local SEO and Google Business Profile for salons and stores",
          "AI that answers customers and books appointments",
          "Product sourcing, sampling and production through partner factories",
        ],
      },
      { h: "Proof", p: [PROOF.search] },
    ],
    faqs: [
      {
        q: "Can you help a clothing brand with both marketing and manufacturing?",
        a: "Yes. We can run the store, the ads and the content, and source and produce the next collection through partner factories, under one lead.",
      },
    ],
    related: ["/services/video-motion", "/services/paid-media", "/services/more"],
  },
  {
    path: "/industries/technology-ai",
    kind: "industry",
    title: "Technology, SaaS and AI Companies | 22 Signals",
    description:
      "Product builds, cloud, AI, go-to-market and growth for technology, SaaS and AI companies, from established firms to funded startups.",
    eyebrow: "Technology and AI Companies",
    h1: "Build, launch and scale technology products.",
    intro:
      "22 Signals works with established technology companies, SaaS businesses and AI companies, as well as funded startups, on product, cloud, launch and growth. We build the product and the cloud it runs on, position it, launch it, and bring in users through search, paid media and outbound, with one lead and a team that already works together.",
    sections: [
      {
        h: "What we do for tech companies",
        list: [
          "MVPs, web apps and mobile apps",
          "Cloud architecture, DevOps and data",
          "AI features and internal AI tools",
          "Positioning, pricing and go-to-market",
          "Launch video, motion and explainer content",
          "SEO, GEO and paid acquisition",
        ],
      },
      { h: "Proof", p: [PROOF.ai] },
    ],
    faqs: [
      {
        q: "Can 22 Signals build our MVP and launch it?",
        a: "Yes. We scope, design and build the product, set up the cloud, then run the launch: positioning, content, search and paid acquisition, with one lead across both.",
      },
    ],
    related: ["/services/cloud", "/services/go-to-market", "/services/ai-automation"],
  },
  {
    path: "/industries/professional-services",
    kind: "industry",
    title: "Law Firms and Professional Services Growth | 22 Signals",
    description:
      "SEO and GEO, websites, client portals, video and AI tools for law firms, consultancies and professional services firms in the US and UK.",
    eyebrow: "Law Firms and Professional Services",
    h1: "Get chosen, by people and by AI.",
    intro:
      "22 Signals works with law firms, consultancies and other professional services firms, mostly in the US. People now ask Google, ChatGPT, Claude and Gemini which firm to call. We build the websites, search presence, content, video and AI intake that get a firm named in those answers and turn enquiries into clients.",
    sections: [
      {
        h: "What we do for firms",
        list: [
          "SEO and GEO, including monthly content with every statute checked",
          "Websites, redesigns and migrations that keep the rankings you earned",
          "Client portals with documents and payments",
          "AI intake that answers questions and books consultations, and never gives legal advice",
          "Attorney video, reels and motion graphics",
          "Website security clean-ups and ongoing care",
        ],
      },
      { h: "Where our clients stand today", p: [PROOF.search] },
      {
        h: "Rules respected",
        p: ["Every page, video and ad avoids misleading claims and outcome promises, and your firm keeps final approval under your bar or regulator rules."],
      },
    ],
    faqs: [
      {
        q: "How do law firms show up in ChatGPT's answers?",
        a: "Assistants draw on the firm's site and, more heavily, on what other sites say: reviews, legal directories, bar profiles, local news and lists. Firms that are consistent and well reviewed across those sources, with clear practice-area pages, get named more often.",
      },
      {
        q: "Can we change our domain without losing rankings?",
        a: "Yes, with a full redirect map, content parity, updated directory listings, and monitoring of rankings and errors after launch.",
      },
    ],
    related: ["/services/seo-geo", "/services/web-app-development", "/partners"],
  },
  {
    path: "/industries/gaming-entertainment",
    kind: "industry",
    title: "Gaming, Esports and Entertainment | 22 Signals",
    description:
      "Live events and broadcast, game development, AI products, video and brand partnerships for gaming, esports and entertainment brands.",
    eyebrow: "Gaming, Esports and Entertainment",
    h1: "Where the future lands first.",
    intro:
      "Gaming has been living in everyone else's future for years. 22 Signals runs tournaments and broadcasts, builds games and AI products, and produces the content and partnerships around them. We're also building our own AI for live esports commentary.",
    sections: [
      { h: "Live events and broadcast", p: [PROOF.events] },
      {
        h: "What we do for gaming brands",
        list: [
          "Tournaments, live events and broadcast production",
          "Game development and interactive experiences",
          "AI products, including live esports commentary",
          "Reels, highlights and motion content",
          "Brand partnerships and sponsorship decks",
        ],
      },
    ],
    faqs: [],
    related: ["/services/video-motion", "/services/more", "/about/daniyal-mansur"],
  },

  // ======================= PARTNERS (agency owners) ========================
  {
    path: "/partners",
    kind: "company",
    title: "For Agencies: The Team Behind Ambitious Agencies",
    description:
      "An execution wing for marketing and growth agencies: AI builds, cloud, web, SEO and GEO, video and motion, delivered to your standard with dates in writing.",
    eyebrow: "For agencies",
    h1: "The team behind ambitious agencies.",
    intro:
      "22 Signals is the execution partner marketing and growth agencies bring in when a client asks for more than the team can deliver: an AI build, a proper search push, a cloud migration, a video series or a launch across every channel. You keep the client and the strategy. We deliver it, with one lead and dates in writing.",
    sections: [
      {
        h: "A client asks for something big.",
        p: [
          "You want to say yes. You have two answers: \"Give us a quarter\" and hope the hire works out, or \"Yes. We start Monday.\" The second only works if the team already exists. Ours does.",
        ],
      },
      { h: "Where our clients stand today", p: [PROOF.search] },
      {
        h: "How it works",
        list: [
          "One lead for your account, who knows your standards",
          "Specialist teams across AI, cloud, web, search, paid and video",
          "Dates agreed in writing for every deliverable",
          "We never go near your clients. That's in writing too.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you work directly with our clients?",
        a: "Only if you want us to. By default we work through you and never approach your clients, and that's written into the agreement.",
      },
    ],
    related: ["/services/seo-geo", "/services/ai-automation", "/services/video-motion"],
  },

  // ======================= MARKETS =========================================
  {
    path: "/united-states",
    kind: "market",
    areaServed: "US",
    title: "22 Signals in the United States",
    description:
      "AI, cloud, web, SEO and GEO, paid media and video for ambitious US companies that need more done than their own team can carry.",
    eyebrow: "United States",
    h1: "The team behind ambitious US companies.",
    intro:
      "22 Signals works with established US companies, and with founders and startups, in healthcare and aesthetics, technology, professional services, fashion and gaming that need more done than their team can carry. Most of our client work is in the US, run with a written scope, agreed dates and one shared channel for updates.",
    sections: [
      { h: "Where our clients stand today", p: [PROOF.search] },
      {
        h: "What US companies hire us for",
        list: [
          "AI tools and automations",
          "Cloud and data",
          "Websites, portals and apps",
          "SEO and GEO for Google and AI answers",
          "Paid media and video",
        ],
      },
    ],
    faqs: [
      {
        q: "How do US projects run?",
        a: "Every project starts with a 15-minute call, then discovery and a written roadmap in 5 to 7 days. After that you get a written scope, agreed dates, one shared channel for updates and review calls booked when they suit you.",
      },
    ],
    related: ["/services/seo-geo", "/industries/healthcare", "/industries/technology-ai"],
  },
  {
    path: "/united-kingdom",
    kind: "market",
    areaServed: "GB",
    title: "22 Signals UK: Business Solutions for UK Companies",
    description:
      "AI, cloud, web, SEO and GEO, paid media and video for UK businesses that want more output without adding to payroll, from one team.",
    eyebrow: "United Kingdom",
    h1: "Built for UK businesses.",
    intro:
      "22 Signals is a business solutions company registered in London. UK businesses bring us in for AI tools and automation, cloud, websites and apps, SEO and GEO, paid media and video, when they want more output without adding to payroll, with specialist teams behind every project.",
    sections: [
      {
        h: "What UK businesses hire us for",
        list: [
          "Moving operations off spreadsheets and onto intelligent systems",
          "Cloud migrations and data",
          "Websites, portals and apps",
          "Showing up in Google and in AI answers",
          "Paid social and video",
        ],
      },
      { h: "Proof", p: [PROOF.ai] },
    ],
    faqs: [
      {
        q: "Can we meet in person?",
        a: "Yes. Most work runs through calls and a shared channel, and we meet clients in person when a project needs it, for workshops, shoots or launches.",
      },
    ],
    related: ["/services/ai-automation", "/services/cloud", "/about"],
  },
  {
    path: "/uae",
    kind: "market",
    areaServed: "AE",
    title: "22 Signals for UAE Businesses",
    description:
      "AI tools, cloud, websites, SEO and GEO, paid media and video for ambitious businesses in Dubai, Abu Dhabi and across the UAE.",
    eyebrow: "UAE",
    h1: "For ambitious businesses in the UAE.",
    intro:
      "22 Signals works with UAE businesses in Dubai, Abu Dhabi and beyond on AI tools, cloud, websites and apps, SEO and GEO, paid media and video. Service businesses use us to answer customers faster, get found in Google and AI answers, and look as established as they are.",
    sections: [
      {
        h: "What UAE businesses hire us for",
        list: [
          "AI that answers customer messages and books jobs",
          "Websites and apps",
          "Local SEO and Google Business Profile",
          "Paid social and video",
          "Cloud and data",
        ],
      },
    ],
    faqs: [
      {
        q: "What does a first UAE project usually look like?",
        a: "Often a focused piece of work: a website rebuild, WhatsApp automation for enquiries and bookings, or local search. It starts with a 15-minute call and a written roadmap in 5 to 7 days.",
      },
    ],
    related: ["/services/ai-automation", "/services/seo-geo", "/industries/fashion-beauty"],
  },

  // ======================= COMPANY =========================================
  {
    path: "/about",
    kind: "about",
    title: "About 22 Signals: Global Business Solutions Company",
    description:
      "22 Signals is a global business solutions company. We build intelligent systems for businesses, then grow them and execute with them.",
    eyebrow: "Who we are",
    h1: "The Engine Behind 22 Signals.",
    subtitle: "Built for the next era of business.",
    intro:
      "22 Signals is a global business solutions company. We build the intelligent systems a business runs on, then we grow it and execute with it: AI, cloud, data, websites and apps, marketing, video and the launches that tie them together.",
    sections: [
      {
        id: "who",
        h: "Who we are.",
        list: [
          "Why we exist: most businesses don't need another supplier. They need capability they don't have in-house, from a team that owns the result.",
          "Who we work with: established businesses and ambitious founders across the US, UK and UAE, in healthcare, fashion and beauty, technology and AI, law, gaming and real estate.",
        ],
      },
      {
        id: "solve",
        h: "What we solve.",
        p: ["What holds a business back, and what we do about it."],
        list: [
          "Manual operations: work stuck in spreadsheets and copy-paste. We automate it.",
          "Scattered data: numbers spread across ten tools. We put them in one place.",
          "Slow infrastructure: systems that are slow, costly or insecure. We fix the cloud underneath.",
          "Hard to find: missing from Google, AI answers and social. We fix that.",
          "Too many suppliers: nobody owns the result. One team does.",
          "Ideas without execution: an ambitious idea and no team. We build it with you.",
        ],
      },
      {
        id: "do",
        h: "What we do.",
        p: ["Seven areas, one team."],
        list: [
          "Strategy and Consulting: go-to-market plans, AI consulting and business process optimization.|/services/go-to-market",
          "AI and Automation: custom AI tools and agents, workflow automation and WhatsApp automation.|/services/ai-automation",
          "Data and Cloud: business intelligence, Power BI, data engineering, cloud, migrations and DevOps.|/services/business-intelligence",
          "Web and App Development: websites, portals, e-commerce and iOS and Android apps.|/services/web-app-development",
          "Growth Marketing: SEO and GEO, paid media, social media management, influencer campaigns and content.|/services/seo-geo",
          "Creative Studio: video and motion graphics, AI video, 2D and 3D animation, 3D rendering and brand identity.|/services/video-motion",
          "Managed Services and Events: managed specialist teams, live events and broadcast, game development and product sourcing.|/services/more",
        ],
      },
      {
        id: "founder",
        h: "Meet the founder.",
        p: ["Daniyal Mansur is the Founder and CEO of 22 Signals."],
      },
    ],
    faqs: [],
    related: ["/how-we-work", "/services", "/contact"],
  },
  {
    path: "/about/daniyal-mansur",
    kind: "person",
    title: "Daniyal Mansur, Founder and CEO of 22 Signals",
    description:
      "Daniyal Mansur is the founder and CEO of 22 Signals, a London business solutions company. Strategist, operator and builder of AI tools.",
    eyebrow: "Founder",
    h1: "Daniyal Mansur",
    intro:
      "Daniyal Mansur is the founder and CEO of 22 Signals, a global business solutions company. He wins clients, sets direction and runs operations, and still builds some of the company's AI tools himself. He holds an MSc in Business Analytics from Queen Mary University of London.",
    sections: [
      {
        h: "Background",
        p: [
          "Before 22 Signals, Daniyal built an esports organization that grew to a million followers, with partnerships including Red Bull and Unilever.",
          "That's where the rule came from: live events teach you fast that the date doesn't move.",
        ],
      },
      {
        h: "What he writes about",
        p: ["How businesses move off the old way of working, AI in real operations, search in the age of answer engines, and what winning looks like for founder-led companies."],
      },
    ],
    faqs: [],
    related: ["/about", "/blog", "/contact"],
  },
  {
    path: "/how-we-work",
    kind: "company",
    title: "How We Work: One Lead, Specialist Teams | 22 Signals",
    description:
      "Talk, plan, build, grow. Every 22 Signals engagement has one accountable Signal Lead, specialist teams and dates agreed in writing.",
    eyebrow: "How we work",
    h1: "One lead. Specialist teams. Dates in writing.",
    intro:
      "Every 22 Signals engagement has one accountable lead, the Signal Lead, who runs the specialist teams behind your project. You get one person to call, a written scope and dates, and work checked by our own data stack before it reaches you.",
    sections: [
      {
        h: "Talk, plan, build, grow",
        list: [
          "Talk: a 15-minute call to see if there's a fit.",
          "Plan: a written scope, owners and dates.",
          "Build: your Signal Lead runs the specialist teams.",
          "Grow: we report what moved, in plain words, and keep improving it.",
        ],
      },
      { h: "Why the dates hold", p: [PROOF.events] },
    ],
    faqs: [],
    related: ["/about", "/services/ai-automation", "/contact"],
  },
  {
    path: "/faq",
    kind: "faq",
    title: "Questions About Working With 22 Signals",
    description:
      "Straight answers about 22 Signals: what we do, who we work with, where we're based, how fast we start and what happens on the first call.",
    eyebrow: "FAQ",
    h1: "Questions, answered straight.",
    intro:
      "Short, honest answers to what people ask most about 22 Signals. If yours isn't here, book a 15-minute call.",
    sections: [],
    faqs: [
      { q: "What is 22 Signals?", a: SITE_DESC() },
      {
        q: "What does 22 Signals do, in plain words?",
        a: "Businesses hire us to handle their tech, marketing and launches, so they deal with one team instead of ten and don't have to hire a whole team for it.",
      },
      {
        q: "Is 22 Signals an agency?",
        a: "Not really. An agency usually does one thing, and you end up managing five of them. We cover technology, AI, cloud, marketing and go-to-market, and one person is accountable for all of it.",
      },
      {
        q: "Is 22 Signals the same as 2Signals?",
        a: "No. 22 Signals (22signals.com) is a separate company from 2Signals in Tampa, Florida.",
      },
      {
        q: "Where is 22 Signals registered?",
        a: "22 Signals is registered in London. We work with companies across the United States, the United Kingdom, Europe and the UAE.",
      },
      {
        q: "What industries do you work with?",
        a: "Healthcare and wellness, fashion, beauty and retail, technology and AI companies, law firms and professional services, and gaming and entertainment.",
      },
      {
        q: "How fast can you start?",
        a: "Most projects start the Monday after the scope is agreed.",
      },
      {
        q: "Do I work with one person or several teams?",
        a: "One. Every engagement has a Signal Lead who runs the specialist teams behind it.",
      },
      {
        q: "What happens on the 15-minute call?",
        a: "Four or five questions, an honest fit verdict, and a clear next step, whether that is a proposal or a pointer to someone better suited.",
      },
    ],
    related: ["/about", "/how-we-work", "/contact"],
  },
];

function SITE_DESC() {
  return SITE.description;
}

// Head and fallback text for routes that stay CMS-driven in React.
export const CMS_ROUTES = [
  {
    path: "/portfolio",
    title: "Work: Projects and Results | 22 Signals",
    description: "Selected 22 Signals projects across AI, web, search, video and live broadcast.",
    h1: "Proven execution.",
  },
  {
    path: "/blog",
    title: "Insights: Search, AI and Growth | 22 Signals",
    description: "Field notes from the 22 Signals team on AI, cloud, data, search and growth.",
    h1: "Insights",
  },
  {
    path: "/contact",
    title: "Contact 22 Signals: Book a 15-Minute Call",
    description: "Book a 15-minute fit call, or email business@22signals.com.",
    h1: "Let's Build the Future.",
  },
  {
    path: "/team",
    title: "Team | 22 Signals",
    description: "The people behind 22 Signals.",
    h1: "Team",
    noindex: true,
  },
  {
    path: "/r&d",
    title: "R&D: What 22 Signals Is Researching | 22 Signals",
    description: "22 Signals R&D: the AI, interface and automation research we run before it reaches client work, from multi-agent workflows to voice-first navigation.",
    h1: "The Pulse of Innovation.",
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy and How We Found You | 22 Signals",
    description: "How 22 Signals collects and uses personal data, where business contact details come from, and how to object.",
    h1: "Privacy Policy",
  },
  {
    path: "/terms-of-service",
    title: "Terms of Service | 22 Signals",
    description: "The terms for using 22signals.com.",
    h1: "Terms of Service",
  },
  {
    path: "/thank-you",
    title: "Thank You | 22 Signals",
    description: "Thanks for getting in touch.",
    h1: "Thank you",
    noindex: true,
  },
];

export { CTA };
