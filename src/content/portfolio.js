// Portfolio helpers shared by the site and scripts/prerender.mjs. Project
// content lives in the CMS table `project_detail_pages`.

// Clients delivered as execution partner for Outlier Creative Agency.
export const OCA_PARTNER = "Outlier Creative Agency";
export const OCA_SLUGS = new Set([
  "bringardner",
  "mirador-law",
  "roughan-associates",
  "varner-injury-advocates",
  "lbbk",
  "kendall-law",
  "ravan-law",
]);

// Every project now lives in the CMS (project_detail_pages) and is edited in
// the admin. These stay empty; add an entry here only to show a project on a
// preview before it goes into the CMS.
export const PORTFOLIO_OVERRIDES = {};

export const PORTFOLIO_EXTRA = [];

// Remove em and en dashes that crept into CMS copy.
export const clean = (s) => (typeof s === "string" ? s.replace(/\s*[—–]\s*/g, ", ") : s);

const cleanRow = (r) => ({
  ...r,
  card_text: clean(r.card_text),
  intro: clean(r.intro),
  tagline: clean(r.tagline),
  sections: Array.isArray(r.sections)
    ? r.sections.map((s) => ({ ...s, title: clean(s.title), body: clean(s.body) }))
    : r.sections,
});

const isEmpty = (v) => v == null || (Array.isArray(v) && v.length === 0) || v === "";

export function applyOverride(row) {
  const o = PORTFOLIO_OVERRIDES[row.slug];
  let r = { ...row };
  if (o) {
    for (const k of ["cover_image", "mockups", "tags", "live_url"]) if (isEmpty(r[k]) && o[k]) r[k] = o[k];
    if (o.extra_sections && Array.isArray(r.sections)) r.sections = [...r.sections, ...o.extra_sections];
  }
  return cleanRow(r);
}

/** CMS rows plus the code-kept projects, de-duplicated by slug. */
export function mergeRows(rows) {
  const list = (rows || []).map(applyOverride);
  const seen = new Set(list.map((r) => r.slug));
  for (const e of PORTFOLIO_EXTRA) if (!seen.has(e.slug)) list.push(cleanRow(e));
  return list.sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99));
}

export const extraBySlug = (slug) => PORTFOLIO_EXTRA.find((e) => e.slug === slug) || null;
