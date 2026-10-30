// Portfolio entries kept in code, merged with the CMS table
// `project_detail_pages`. Lives here (not in the CMS) so new projects only
// appear on the preview until approved. Plain JS so scripts/prerender.mjs can
// import it too.

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

const img = (slug, n) => `/portfolio/${slug}/${n}.webp`;

// Extra imagery and detail for projects that already exist in the CMS.
export const PORTFOLIO_OVERRIDES = {
  "kendall-law": {
    cover_image: img("kendall-law", "cover"),
    mockups: [img("kendall-law", "shot-1"), img("kendall-law", "shot-2"), img("kendall-law", "shot-3")],
    tags: ["Website Management", "Client Portal", "Video", "Email and CRM"],
    live_url: "https://kendalllaw.com",
    extra_sections: [
      {
        title: "Video, email and systems",
        body:
          "Alongside the site and the portal, we edit the firm's video, from short updates featuring its founding attorney to event recap reels from trade shows. We moved the firm's email marketing and branding from its old practice tools into a new campaign manager, updated its email authentication records so messages reach inboxes, and renamed and reorganized the resource hub and compliance library as the content grew.",
      },
    ],
  },
};

export const PORTFOLIO_EXTRA = [
  {
    slug: "ravan-law",
    client_name: "Ravan Law",
    category: "Digital & AI",
    card_text:
      "Website care, a security cleanup, an English and Spanish site and a steady flow of search content for a Los Angeles personal injury firm.",
    cover_image: img("ravan-law", "cover"),
    tags: ["Website Management", "Security", "SEO Content", "AEO and GEO"],
    intro:
      "Ravan Law is a Los Angeles personal injury firm that represents people hurt by negligent drivers, property owners and government agencies across Southern California. 22 Signals looks after the firm's WordPress website, keeps it secure and writes its search content.",
    sections: [
      {
        title: "Website care",
        body:
          "We run the day-to-day work on the firm's site: page updates, fixes and new features. We added an English and Spanish toggle so Spanish-speaking clients can read the whole site in their own language, and cleaned out spam that had built up in the site's forms and content.",
      },
      {
        title: "Security",
        body:
          "The site was found carrying a self-healing backdoor hidden in WordPress's must-use plugins folder, where it loads on every page and never shows in the normal plugin list. Deleting the file from the admin panel did not hold, because a reinfector put it back. We cleaned the site with a security tool that works below the admin layer, confirmed the files were gone and the reinfector had stopped, and gave the firm a short hardening list: rotate every credential and security salt, remove old configuration copies from the server and check who owns the site in Google Search Console.",
      },
      {
        title: "Search content",
        body:
          "We write the firm's articles and resource pages, including a guide to California personal injury time limits and pieces on sidewalk injuries, government claims in Los Angeles, and claims involving Caltrans and LA Metro. Every statute and deadline is checked before an article reaches the firm for review. The publishing cadence is ramping toward three articles a week, and the work now extends to showing up in AI answers from ChatGPT, Claude, Gemini and Google AI Overviews.",
      },
    ],
    mockups: [img("ravan-law", "shot-1"), img("ravan-law", "shot-2"), img("ravan-law", "shot-3")],
    live_url: "https://ravanlaw.com",
    sort_order: 20,
  },
  {
    slug: "nges",
    client_name: "Next Generation Esports (NGES)",
    category: "Broadcasting & Esports",
    card_text:
      "The technical design of an AI caster that commentates live esports matches, a partner pitch deck and an SEO audit for the UAE market.",
    cover_image: img("nges", "cover"),
    tags: ["AI Product Design", "Pitch Deck", "SEO Audit"],
    intro:
      "Next Generation Esports (NGES) is an esports and gaming company running tournaments, broadcast and production, brand activations and talent management. We designed the technical architecture for its AI caster, a product that commentates live matches, built the deck it takes to partners and audited its website for search in the UAE.",
    sections: [
      {
        title: "The AI caster",
        body:
          "An AI commentary product is not one model. It is a chain: taking in what is happening in the match, deciding what is worth saying, writing the line, turning it into speech and getting it on air while the moment still matters. Each link trades speed against accuracy and cost. Our architecture sets out that chain in detail, so NGES and any partner can see how the product works, where the hard parts are and what to build first.",
      },
      {
        title: "The partner pitch",
        body:
          "A product like this needs a partner to reach the market, such as a tournament organiser, a broadcaster or a platform. We built a 26-slide pitch deck in NGES's own brand colours that explains the product, the technical approach and the case for working together.",
      },
      {
        title: "Search in the UAE",
        body:
          "Alongside the product work, we ran an SEO audit of the NGES website from a full crawl, with Dubai and the wider UAE as the market to win. It sets out the technical and content issues standing between the company and the searches it wants.",
      },
    ],
    mockups: [img("nges", "shot-1"), img("nges", "shot-2"), img("nges", "shot-3")],
    live_url: "https://nges.gg",
    sort_order: 21,
  },
  {
    slug: "hifsa-khan-salon",
    client_name: "Hifsa Khan Salon & Studio",
    category: "Digital & AI",
    card_text:
      "A rebuilt website, an SEO and AI search programme, and Google Ads for bridal makeup searches for a beauty salon and studio.",
    cover_image: img("hifsa-khan-salon", "cover"),
    tags: ["Website", "SEO, AEO and GEO", "Google Ads", "Content"],
    intro:
      "Hifsa Khan Salon & Studio needed a rebuilt website and a search programme that would bring in people who did not already know its name. We planned both as one project: research, content, build and SEO, then Google Ads once the site was ready to convert.",
    sections: [
      {
        title: "Research and plan",
        body:
          "We audited the old site and researched the market and competitors in the first week of June 2026. A keyword strategy gave every planned page a clear search to answer, and the words for each page were written and approved by 12 June, before development began.",
      },
      {
        title: "The build",
        body:
          "Development ran from 15 June to 1 July, with the salon's own photography added across the site in the week after. The new site went live on 14 July 2026, and SEO started the same day.",
      },
      {
        title: "Search for people and for AI answers",
        body:
          "The search work covers classic SEO plus answer and generative engine optimisation, so Google and AI assistants describe the salon's services accurately. We built a rank tracker, crawled the live site straight after launch to catch any new problems, and report progress to the owners in a branded deck.",
      },
      {
        title: "Google Ads for bridal makeup",
        body:
          "With the site and SEO in place, the salon asked us to run Google Ads aimed at people searching for bridal makeup, so it appears for those searches while organic rankings keep building.",
      },
    ],
    mockups: [img("hifsa-khan-salon", "shot-1"), img("hifsa-khan-salon", "shot-2"), img("hifsa-khan-salon", "shot-3")],
    live_url: "https://hifsakhansalon.com",
    sort_order: 22,
  },
  {
    slug: "e-intel",
    client_name: "E-Intel (BBRhythm)",
    category: "Creative & Marketing",
    card_text:
      "Business, operating and marketing plans, branding and website mockups to take a head-worn EEG neurofeedback device to market in the US.",
    cover_image: img("e-intel", "cover"),
    tags: ["Go-to-Market", "Business Plan", "Branding", "Website Mockups"],
    intro:
      "E-Intel is a neural and physiological data company. Its product, BBRhythm, is a head-worn EEG neurofeedback device sold with a monthly app subscription. We wrote the plan to bring it to market in the United States, built its branding and website mockups, and researched its competitors.",
    sections: [
      {
        title: "One connected plan",
        body:
          "We wrote the business, operating and marketing plans as one document set, because each depends on the others. Competitor research showed how similar devices are positioned, sold and explained, and the website mockups show how the product, the subscription and the science are presented to ordinary buyers.",
      },
      {
        title: "Changing the route to market",
        body:
          "The first plan led with paid social to sell direct to consumers. Partway through, the company decided to earn revenue before buying growth, so we reworked the plan around partnerships with US wellness clinics as the first channel and moved paid social later, to be funded by early revenue. The operating plan, marketing plan, partner pitch and website story were all updated together.",
      },
    ],
    mockups: [img("e-intel", "shot-1"), img("e-intel", "shot-2"), img("e-intel", "shot-3")],
    live_url: "https://e-intelbci.com",
    sort_order: 23,
  },
  {
    slug: "leap-summit",
    client_name: "LEAP",
    category: "Broadcasting & Esports",
    card_text: "Full broadcast and event execution for a technology and innovation summit.",
    cover_image: img("leap-summit", "cover"),
    tags: ["Live Broadcast", "Event Production"],
    intro:
      "LEAP is a technology and innovation summit. 22 Signals handled the broadcast and event execution.",
    sections: [
      {
        title: "Broadcast and event execution",
        body:
          "Full broadcast and event execution for the summit, run by our live events and broadcast team.",
      },
    ],
    mockups: [],
    live_url: null,
    sort_order: 24,
  },
  {
    slug: "latakoo",
    client_name: "Latakoo",
    category: "Digital & AI",
    card_text: "UI and UX design and product engineering for an enterprise media platform.",
    cover_image: img("latakoo", "cover"),
    tags: ["UI and UX", "Product Engineering"],
    intro:
      "Latakoo is an enterprise media platform. 22 Signals worked on its UI and UX design and product engineering.",
    sections: [
      {
        title: "Product design and engineering",
        body:
          "UI and UX design and product engineering for an enterprise media platform.",
      },
    ],
    mockups: [],
    live_url: null,
    sort_order: 25,
  },
  {
    slug: "gameview",
    client_name: "Gameview",
    category: "Broadcasting & Esports",
    card_text: "An esports broadcast platform with custom overlays and analytics.",
    cover_image: img("gameview", "cover"),
    tags: ["Esports Broadcast", "Overlays", "Analytics"],
    intro: "Gameview is an esports broadcast platform with custom overlays and analytics, built with 22 Signals.",
    sections: [
      {
        title: "Overlays and analytics",
        body:
          "Custom broadcast overlays and analytics for live esports.",
      },
    ],
    mockups: [],
    live_url: null,
    sort_order: 26,
  },
];

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
