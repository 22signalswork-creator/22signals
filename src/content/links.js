// Automatic internal-link blocks, shared by the React page and the prerender script.
import { SERVICES, CITY_SERVICES, CITIES, REGION_LABELS, INDUSTRIES } from "./site.js";

const cityByslug = (s) => CITIES.find((c) => c.slug === s);
const has = (manifest, p) => manifest.some((m) => m.path === p);

export function linkBlocks(page, manifest) {
  const blocks = [];
  const add = (title, items) => {
    const list = items.filter((i) => has(manifest, i.path) && i.path !== page.path);
    if (list.length) blocks.push({ title, items: list });
  };
  if (page.kind === "location-hub" && page.citySlug) {
    const c = cityByslug(page.citySlug);
    add(`Services in ${c ? c.name : page.city}`, CITY_SERVICES.map((s) => ({ path: `/locations/${page.citySlug}/${s.slug}`, label: s.label })));
    if (c) add(`Other cities in ${REGION_LABELS[c.region]}`, CITIES.filter((x) => x.region === c.region && x.slug !== c.slug).map((x) => ({ path: `/locations/${x.slug}`, label: x.name })));
  }
  if (page.kind === "location-service" && page.citySlug && page.service) {
    const c = cityByslug(page.citySlug);
    const svc = CITY_SERVICES.find((s) => s.slug === page.service);
    add(`More services in ${c ? c.name : page.city}`, [
      { path: `/locations/${page.citySlug}`, label: `All services in ${c ? c.name : page.city}` },
      ...CITY_SERVICES.filter((s) => s.slug !== page.service).map((s) => ({ path: `/locations/${page.citySlug}/${s.slug}`, label: s.label })),
    ]);
    if (svc)
      add(`${svc.label} in other cities`, [
        { path: svc.global, label: `${svc.label} (all regions)` },
        ...CITIES.filter((x) => x.slug !== page.citySlug).map((x) => ({ path: `/locations/${x.slug}/${svc.slug}`, label: x.name })),
      ]);
  }
  if (page.kind === "service") {
    const svc = CITY_SERVICES.find((s) => s.global === page.path);
    if (svc)
      for (const r of ["us", "uk", "eu", "uae", "pk"])
        add(`${svc.label} in ${REGION_LABELS[r]}`, CITIES.filter((x) => x.region === r).map((x) => ({ path: `/locations/${x.slug}/${svc.slug}`, label: x.name })));
  }
  if (page.kind === "state-hub") {
    const state = page.path.endsWith("texas") ? "Texas" : page.path.endsWith("california") ? "California" : "";
    add(`Cities in ${state}`, CITIES.filter((x) => x.state === state).map((x) => ({ path: `/locations/${x.slug}`, label: x.name })));
  }
  if (page.kind === "market" || ["/united-states", "/united-kingdom", "/europe", "/uae", "/pakistan"].includes(page.path)) {
    const r = { "/united-states": "us", "/united-kingdom": "uk", "/europe": "eu", "/uae": "uae", "/pakistan": "pk" }[page.path];
    if (r) add(`Cities we serve in ${REGION_LABELS[r]}`, CITIES.filter((x) => x.region === r).map((x) => ({ path: `/locations/${x.slug}`, label: x.name })));
  }
  if (page.kind === "locations-index") {
    add("Regions", [
      { path: "/united-states", label: "United States" },
      { path: "/united-kingdom", label: "United Kingdom" },
      { path: "/europe", label: "Europe" },
      { path: "/uae", label: "UAE" },
      { path: "/pakistan", label: "Pakistan" },
    ]);
    for (const r of ["us", "uk", "eu", "uae", "pk"])
      add(REGION_LABELS[r], CITIES.filter((x) => x.region === r).map((x) => ({ path: `/locations/${x.slug}`, label: x.name })));
  }
  if (page.kind === "industry") add("Services", SERVICES.slice(0, 12).map((s) => ({ path: s.path, label: s.label })));
  if (page.kind === "case-studies-index" || page.kind === "insights-index") {
    add(page.kind === "insights-index" ? "Guides" : "Case studies", manifest.filter((m) => m.kind === (page.kind === "insights-index" ? "guide" : "case-study")).map((m) => ({ path: m.path, label: m.h1, blurb: m.description })));
  }
  return blocks;
}
export { INDUSTRIES };
