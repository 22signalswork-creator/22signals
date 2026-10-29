// Merges page copy from src/content/site.js and content/pages/*.json into:
//  - src/content/generated/manifest.json (small, bundled: routes, titles, labels)
//  - public/content/<file>.json (full page, fetched by the React page on client-side navigation)
// Run before `vite build` (see package.json).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES, CITIES, REGION_LABELS } from "../src/content/site.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "content/pages");
const byPath = new Map(PAGES.map((p) => [p.path, p]));
for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".json")) : []) {
  const p = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  byPath.set(p.path, { ...(byPath.get(p.path) || {}), ...p });
}
// Generated index pages
const gen = (p) => { if (!byPath.has(p.path)) byPath.set(p.path, p); };
gen({
  path: "/locations", kind: "locations-index", region: "global",
  title: "Locations: Where 22 Signals Works | 22 Signals",
  description: "22 Signals works with companies across the United States, the United Kingdom, the UAE and Pakistan. Find services in your city.",
  eyebrow: "Locations", h1: "Where we work",
  intro: `Our head office is in London and we work with companies in ${CITIES.length} cities across the United States, the United Kingdom, the UAE and Pakistan. Every city has the same model: one accountable lead, specialist teams behind them and dates agreed in writing.`,
  sections: [], faqs: [], related: [],
});
gen({
  path: "/case-studies", kind: "case-studies-index", region: "global",
  title: "Case Studies: AI, Cloud, Search and Video | 22 Signals",
  description: "How 22 Signals has helped companies with AI, cloud, data, websites, search, paid media and video. Client names kept private.",
  eyebrow: "Case studies", h1: "Work we can talk about",
  intro: "Real projects, described without client names. Each one shows the problem, what we did, how we ran it and what changed.",
  sections: [], faqs: [], related: [],
});
gen({
  path: "/insights", kind: "insights-index", region: "global",
  title: "Insights: AI, Cloud, Data and Search Guides | 22 Signals",
  description: "Practical guides on AI consulting, cloud migration, Power BI, and showing up in Google and AI answers, from the 22 Signals team.",
  eyebrow: "Insights", h1: "Guides from the team",
  intro: "Plain answers to the questions companies ask us before they start: what AI consulting is, what it costs, how to choose a firm, how to move to the cloud and how search is changing.",
  sections: [], faqs: [], related: [],
});
const pages = [...byPath.values()];
const fileOf = (p) => (p === "/" ? "index" : p.slice(1).replace(/\//g, "__"));
const outDir = path.join(root, "public/content");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
const manifest = [];
for (const p of pages) {
  fs.writeFileSync(path.join(outDir, fileOf(p.path) + ".json"), JSON.stringify(p));
  manifest.push({
    path: p.path, file: fileOf(p.path), kind: p.kind, region: p.region || "global",
    title: p.title, description: p.description, eyebrow: p.eyebrow, h1: p.h1,
    city: p.city, citySlug: p.citySlug, service: p.service, noindex: p.noindex || undefined,
  });
}
fs.mkdirSync(path.join(root, "src/content/generated"), { recursive: true });
fs.writeFileSync(path.join(root, "src/content/generated/manifest.json"), JSON.stringify(manifest));
fs.writeFileSync(path.join(root, "src/content/generated/pages.json"), JSON.stringify(pages)); // used by prerender only (gitignored)
console.log(`content: ${pages.length} pages (${manifest.filter((m) => m.kind === "location-service").length} city service pages)`);
