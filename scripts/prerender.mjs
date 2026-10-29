// Post-build step: writes crawlable HTML for every public route.
//
// Why: the site is a client-rendered React app, so without this every URL
// served the same empty <div id="root"> titled "22 Signal". Google, ChatGPT,
// Claude, Perplexity and Bing now get a real title, description, canonical,
// JSON-LD and the page copy in the HTML. React replaces the fallback markup
// on load, so visitors see the normal site.
//
// Run automatically by `npm run build` (see package.json).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, CMS_ROUTES, SERVICES, INDUSTRIES, MARKETS, CTA, CITIES, CITY_SERVICES } from "../src/content/site.js";
import { linkBlocks } from "../src/content/links.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const today = new Date().toISOString().slice(0, 10);
const PAGES = JSON.parse(fs.readFileSync(path.join(root, "src/content/generated/pages.json"), "utf8"));
const MANIFEST = JSON.parse(fs.readFileSync(path.join(root, "src/content/generated/manifest.json"), "utf8"));

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (p) => SITE.url + (p === "/" ? "/" : p);
const ORG_ID = SITE.url + "/#organization";
const PERSON_ID = SITE.url + "/about/daniyal-mansur#person";

// ---------------------------------------------------------------- schema
const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE.name,
  alternateName: "22signals",
  url: SITE.url + "/",
  logo: SITE.url + "/logo.png",
  slogan: SITE.tagline,
  description: SITE.description,
  disambiguatingDescription: "Not affiliated with 2Signals of Tampa, Florida.",
  founder: { "@id": PERSON_ID },
  address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
  areaServed: ["US", "GB", "AE"],
  email: SITE.email,
  telephone: SITE.phone,
  knowsAbout: [
    "AI automation",
    "Cloud infrastructure",
    "Web and app development",
    "Search engine optimization",
    "Generative engine optimization",
    "Paid media",
    "Video production",
    "Motion graphics",
    "3D animation",
    "Go-to-market strategy",
  ],
};
const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE.founder,
  jobTitle: "Founder and CEO",
  worksFor: { "@id": ORG_ID },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Queen Mary University of London" },
  workLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" } },
  url: abs("/about/daniyal-mansur"),
};

function breadcrumbs(p) {
  const parts = p.split("/").filter(Boolean);
  if (!parts.length) return null;
  const items = [{ name: "Home", url: abs("/") }];
  let acc = "";
  for (const part of parts) {
    acc += "/" + part;
    const page = PAGES.find((x) => x.path === acc) || CMS_ROUTES.find((x) => x.path === acc);
    items.push({ name: page ? page.eyebrow || page.h1 : part, url: abs(acc) });
  }
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

function schemaFor(page) {
  const graph = [];
  if (page.path === "/") {
    graph.push(organization, person, {
      "@type": "WebSite",
      "@id": SITE.url + "/#website",
      url: SITE.url + "/",
      name: SITE.name,
      publisher: { "@id": ORG_ID },
    });
  } else {
    graph.push({ "@type": "Organization", "@id": ORG_ID, name: SITE.name, url: SITE.url + "/" });
  }
  if (page.kind === "service") {
    graph.push({
      "@type": "Service",
      name: page.eyebrow,
      serviceType: page.serviceType,
      description: page.intro,
      provider: { "@id": ORG_ID },
      areaServed: ["US", "GB", "AE"],
      url: abs(page.path),
    });
  }
  if (page.kind === "location-service") {
    graph.push({
      "@type": "Service",
      name: page.eyebrow || page.h1,
      serviceType: page.serviceType || page.eyebrow,
      description: page.intro,
      provider: { "@id": ORG_ID },
      areaServed: { "@type": "City", name: page.city },
      url: abs(page.path),
    });
  }
  if (page.kind === "location-hub" || page.kind === "state-hub") {
    graph.push({
      "@type": "ProfessionalService",
      name: `${SITE.name} for ${page.city || page.eyebrow}`,
      description: page.intro,
      url: abs(page.path),
      parentOrganization: { "@id": ORG_ID },
      areaServed: page.city ? { "@type": "City", name: page.city } : page.eyebrow,
      address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
    });
  }
  if (page.kind === "guide" || page.kind === "case-study") {
    graph.push({
      "@type": "Article",
      headline: page.h1,
      description: page.description,
      author: { "@type": "Person", name: page.author || SITE.founder, url: abs("/about/daniyal-mansur") },
      publisher: { "@id": ORG_ID },
      datePublished: page.datePublished || today,
      dateModified: today,
      mainEntityOfPage: abs(page.path),
    });
  }
  if (page.kind === "market") {
    graph.push({
      "@type": "Service",
      name: `${SITE.name} in ${page.eyebrow}`,
      description: page.intro,
      provider: { "@id": ORG_ID },
      areaServed: page.areaServed || page.eyebrow,
      url: abs(page.path),
    });
  }
  if (page.kind === "about") graph.push({ "@type": "AboutPage", url: abs(page.path), about: { "@id": ORG_ID } });
  if (page.kind === "person") graph.push(person, { "@type": "ProfilePage", url: abs(page.path), mainEntity: { "@id": PERSON_ID } });
  if (page.faqs && page.faqs.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }
  const bc = breadcrumbs(page.path);
  if (bc) graph.push(bc);
  return { "@context": "https://schema.org", "@graph": graph };
}

// ---------------------------------------------------------------- html
const NAV = [
  ["Services", "/services"],
  ["Portfolio", "/portfolio"],
  ["Locations", "/locations"],
  ["About", "/about"],
  ["How we work", "/how-we-work"],
  ["FAQ", "/faq"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
];

function chrome(main) {
  const link = ([l, h]) => `<a href="${h}">${esc(l)}</a>`;
  return `<div data-prerender style="background:#000202;color:#e8ebf2;font-family:system-ui,sans-serif;line-height:1.6;min-height:100vh">
<header style="padding:24px;max-width:960px;margin:0 auto"><a href="/"><strong>22 Signals</strong></a> <nav style="display:inline">${NAV.map(link).join(" · ")}</nav></header>
<main style="padding:48px 24px 64px;max-width:760px;margin:0 auto">${main}</main>
<footer style="padding:24px;max-width:960px;margin:0 auto;font-size:14px;color:#9aa7b8">
<p><strong>Services:</strong> ${SERVICES.map((s) => link([s.label, s.path])).join(" · ")}</p>
<p><strong>Industries:</strong> ${INDUSTRIES.map((s) => link([s.label, s.path])).join(" · ")}</p>
<p><strong>Locations:</strong> ${CITIES.map((c) => link([c.name, `/locations/${c.slug}`])).join(" · ")}</p>
<p><strong>Markets:</strong> ${MARKETS.map((s) => link([s.label, s.path])).join(" · ")} · <a href="/partners">For agencies</a></p>
<p>22 Signals, London, United Kingdom · <a href="mailto:${SITE.email}">${SITE.email}</a> · <a href="tel:${SITE.phoneHref}">${SITE.phone}</a> · <a href="/privacy-policy">Privacy</a> · <a href="/terms-of-service">Terms</a></p>
</footer></div>`;
}

function body(page) {
  let h = "";
  if (page.eyebrow) h += `<p>${esc(page.eyebrow)}</p>`;
  h += `<h1>${esc(page.h1)}</h1>`;
  if (page.intro) h += `<p>${esc(page.intro)}</p>`;
  if (page.kind === "hub") {
    h += `<h2>Services</h2><ul>${SERVICES.map((s) => `<li><a href="${s.path}">${esc(s.label)}</a>: ${esc(s.blurb || "")}</li>`).join("")}</ul>`;
    h += `<h2>Industries</h2><ul>${INDUSTRIES.map((s) => `<li><a href="${s.path}">${esc(s.label)}</a></li>`).join("")}</ul>`;
  }
  for (const s of page.sections || []) {
    h += `<section${s.id ? ` id="${s.id}"` : ""}><h2>${esc(s.h)}</h2>`;
    for (const p of s.p || []) h += `<p>${esc(p)}</p>`;
    if (s.list) h += `<ul>${s.list.map((li) => `<li>${esc(li)}</li>`).join("")}</ul>`;
    h += `</section>`;
  }
  if (page.faqs && page.faqs.length) {
    h += `<section><h2>Questions</h2>${page.faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}</section>`;
  }
  for (const b of linkBlocks(page, MANIFEST)) {
    h += `<nav aria-label="${esc(b.title)}"><h2>${esc(b.title)}</h2><ul>${b.items.map((i) => `<li><a href="${i.path}">${esc(i.label)}</a></li>`).join("")}</ul></nav>`;
  }
  if (page.related && page.related.length) {
    const label = (r) => [...SERVICES, ...INDUSTRIES, ...MARKETS].find((x) => x.path === r)?.label || PAGES.find((x) => x.path === r)?.eyebrow || r;
    h += `<nav aria-label="Related"><h2>Related</h2><ul>${page.related.map((r) => `<li><a href="${r}">${esc(label(r))}</a></li>`).join("")}</ul></nav>`;
  }
  if (page.cta !== false) {
    h += `<section><h2>${esc(CTA.heading)}</h2><p>${esc(CTA.text)}</p><p><a href="${SITE.booking}">${esc(CTA.button)}</a></p></section>`;
  }
  return chrome(h);
}

function render(page, { noindex = false, schema = true } = {}) {
  const canonical = abs(page.path);
  const head = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}" />`,
    noindex ? "" : `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="22 Signals" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:image" content="${SITE.ogImage}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    schema ? `<script type="application/ld+json">${JSON.stringify(schemaFor(page))}</script>` : "",
  ]
    .filter(Boolean)
    .join("\n    ");
  return template
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/<meta name="description"[^>]*>/, "")
    .replace("</head>", `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body(page)}</div>${page.kind ? `<script id="page-data" type="application/json">${JSON.stringify(page).replace(/</g, "\\u003c")}</script>` : ""}`);
}

function write(routePath, html) {
  const file = routePath === "/" ? path.join(dist, "index.html") : path.join(dist, routePath.replace(/^\//, "") + ".html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

// ---------------------------------------------------------------- CMS data
async function fetchTable(table, query) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const base = url.startsWith("http") ? url : `https://${url}`;
    const res = await fetch(`${base.replace(/\/$/, "")}/rest/v1/${table}?${query}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------- run
// 1. Bare app shell for client-only routes (admin, R&D): never indexed.
const appShell = template
  .replace(/<title>[\s\S]*?<\/title>/, "<title>22 Signals</title>")
  .replace("</head>", '    <meta name="robots" content="noindex, nofollow" />\n  </head>');
fs.writeFileSync(path.join(dist, "app.html"), appShell);

// 2. 404 page with a real 404 status (Vercel serves 404.html for unmatched paths).
write(
  "/404",
  render(
    { path: "/404", title: "Page not found | 22 Signals", description: "This page doesn't exist.", h1: "Page not found", intro: "The page you asked for doesn't exist. Try one of these.", sections: [], faqs: [], related: ["/services", "/about", "/contact"] },
    { noindex: true, schema: false }
  )
);

// 3. Content pages.
const sitemap = [];
for (const page of PAGES) {
  write(page.path, render(page));
  sitemap.push(page.path);
}

// 4. CMS-driven pages (head + short fallback).
for (const r of CMS_ROUTES) {
  const page = { ...r, eyebrow: "", intro: r.description, sections: [], faqs: [], related: [], cta: true };
  write(r.path, render(page, { noindex: !!r.noindex, schema: !r.noindex }));
  if (!r.noindex) sitemap.push(r.path);
}

// 4b. R&D research pages.
const rd = await fetchTable("rd_research_pages", "select=slug,title,card_text,tagline,intro,sections,is_active&is_active=eq.true");
for (const p of rd) {
  if (!p.slug) continue;
  const route = `/r&d/${p.slug}`;
  const sections = Array.isArray(p.sections)
    ? p.sections.filter((s) => s && (s.body || s.heading)).map((s) => ({ h: s.heading || p.title, p: s.body ? [s.body] : [] }))
    : [];
  write(route, render({
    path: route,
    title: `${p.title}: 22 Signals R&D`,
    description: String(p.card_text || p.tagline || "").replace(/\s+/g, " ").slice(0, 155),
    eyebrow: "R&D", h1: p.title, intro: p.intro || p.tagline || "", sections, faqs: [], related: ["/r&d", "/services/ai-consulting"],
  }));
  sitemap.push(route);
}

// 5. Portfolio case pages.
const projects = await fetchTable("project_detail_pages", "select=slug,client_name,card_text,intro,sections,is_active&is_active=eq.true");
for (const p of projects) {
  if (!p.slug) continue;
  const route = `/portfolio/${p.slug}`;
  const sections = Array.isArray(p.sections)
    ? p.sections.filter((s) => s && (s.body || s.heading)).map((s) => ({ h: s.heading || p.client_name, p: s.body ? [s.body] : [] }))
    : [];
  const desc = String(p.card_text || p.intro || "").replace(/\s+/g, " ").slice(0, 155);
  write(
    route,
    render({
      path: route,
      title: `${p.client_name} | 22 Signals Work`,
      description: desc,
      eyebrow: "Work",
      h1: p.client_name,
      intro: p.intro || p.card_text || "",
      sections,
      faqs: [],
      related: ["/portfolio", "/services"],
    })
  );
  sitemap.push(route);
}
console.log(`prerender: ${PAGES.length} content pages, ${CMS_ROUTES.length} CMS routes, ${projects.length} case pages`);

// 6. robots.txt
fs.writeFileSync(
  path.join(dist, "robots.txt"),
  `# 22 Signals
User-agent: *
Allow: /
Disallow: /admin

# Search and AI assistants we want reading the site
User-agent: Googlebot
Allow: /
User-agent: Bingbot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: GPTBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`
);

// 7. sitemap.xml
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...new Set(sitemap)].map((p) => `  <url><loc>${esc(abs(p))}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`
);

// 8. llms.txt
const line = (p) => {
  const page = PAGES.find((x) => x.path === p);
  if (!page) return null;
  const name = page.path === "/" ? "Home" : page.eyebrow || page.h1;
  return `- [${name}](${abs(p)}): ${page.description}`;
};
const lines = (paths) => paths.map(line).filter(Boolean).join("\n");
fs.writeFileSync(
  path.join(dist, "llms.txt"),
  `# 22 Signals

> ${SITE.description} Not affiliated with 2Signals of Tampa, Florida.

Head office: London. Contact: ${SITE.email}, ${SITE.phone}. Markets: United States, United Kingdom, UAE.

## Services
${lines(SERVICES.map((s) => s.path))}

## Industries
${lines(INDUSTRIES.map((s) => s.path))}

## Markets and locations
${lines([...MARKETS.map((s) => s.path), "/locations", "/locations/texas", "/locations/california", ...CITIES.map((c) => `/locations/${c.slug}`)])}

## Company
${lines(["/about", "/about/daniyal-mansur", "/how-we-work", "/partners", "/faq", "/case-studies", "/insights"])}

## Guides
${lines(PAGES.filter((p) => p.kind === "guide").map((p) => p.path))}

## Case studies
${lines(PAGES.filter((p) => p.kind === "case-study").map((p) => p.path))}
`
);
console.log(`prerender: sitemap ${new Set(sitemap).size} URLs, robots.txt, llms.txt, app.html, 404.html`);
