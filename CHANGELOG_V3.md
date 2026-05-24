# 22 Signals — Website Update Changelog

All requested changes have been implemented. Detailed list below, grouped by area.

---

## 1. Header — Services + Portfolio dropdowns
*Already implemented in the previous round.* Confirmed working: hovering "Services" or "Portfolio" in the desktop header now reveals a dropdown menu listing the categories. On mobile the dropdowns are hidden (the mobile menu shows everything as a flat list anyway).

Files: `src/layout/header.tsx`, `src/layout/headerfooter.css`

---

## 2. Featured project block heading — solid dark blue
The project card heading (`.recentproject-title`) is now a single solid dark blue (`#1a3392`), no gradient. The `background-image: none !important` rule defeats any inherited h2 gradient from the global CSS.

Files: `src/index.css` (`h2.recentproject-title` block)

---

## 3. Companies-We-Have-Worked-With logos section
- Heading reduced from `text-2xl md:text-3xl` to **`text-lg md:text-xl`** with weight 500 — much smaller and less visually loud.
- Slider now shows **7 logos per slide on desktop**, **3 on tablet**, **2 on mobile**.
- Marquee is **infinite** and **does NOT pause on hover** (uses CSS `@keyframes marquee` running continuously; no JS event handlers on hover).

Files: `src/pages/home/components/ServicesSection.tsx`, `src/components/Slider.tsx`

---

## 4. Testimonials + Featured Projects on every page
Two new reusable components were extracted from the home page so the same proof-of-work block can be dropped into any page:

- **`src/components/TestimonialsSection.tsx`** — pulls `testimonials` from Supabase, falls back to local list. 4 cards desktop / 1 mobile, autoplay infinite.
- **`src/components/FeaturedProjectsSection.tsx`** — pulls `projects WHERE is_featured = true`, has "ALL PORTFOLIO" button → /portfolio.
- **`src/components/PreCtaSections.tsx`** — wraps both. `<PreCtaSections />` for full block, `<PreCtaSections testimonialsOnly />` for testimonials only.

Now appearing on:
- ✅ Services — `Hero → Service grid → Pillars → Process → Stats → FAQ → PreCtaSections → footer CTA`
- ✅ Portfolio — `Hero → Tabs → Stats → FAQ → PreCtaSections → footer CTA`
- ✅ R&D listing — added before footer CTA
- ✅ R&D detail page — added before footer CTA
- ✅ Blog — added after Newsletter
- ✅ Contact — added after the form
- ✅ Team — `testimonialsOnly` (no Featured Projects, no FAQ)
- ✅ Home — already had these via `PortfolioSection`

---

## 5. Service page rebuild
The old in-page Tabs slider that opened a service detail block is **gone**. Replaced with `ServicesGrid` — a clean responsive grid (1 / 2 / 3 columns by breakpoint), each card linking directly to `/services/<slug>` (the individual detail page). Optional category filter pills appear above the grid only when categories are populated in the DB.

Files: new `src/pages/services/components/ServicesGrid.tsx`, updated `src/pages/services/service.tsx`

---

## 6. Home Hero — mobile heading + globe overlap
- Mobile heading reduced to `text-[22px] sm:text-3xl md:text-[68px]`.
- Stays on **one line at all breakpoints** via `whitespace-nowrap` (was `nowrap` only on mobile, with `md:whitespace-normal` removed).
- Top padding nudged from `pt-6` to `pt-2 md:pt-20` so the heading sits higher above the globe.

Files: `src/pages/home/components/hero-section.tsx`

---

## 7. Home Video — scroll feel + spacing
- GSAP scrub tightened from `0.6 → 0.25` (snappier, less perceived lag).
- Pin distance shortened from `+=350 → +=220` (advances faster).
- Float distances slightly reduced for a smoother feel.
- Container top margin bumped on mobile (`mt-12 → mt-20`) so the video no longer "merges" with the hero.

Files: `src/pages/home/components/video.tsx`

The home services section also gained more top padding on mobile (`pt-32 → pt-44`) so there is breathing room between the hero and the video block.

Files: `src/pages/home/components/ServicesSection.tsx`

---

## 8. Footer — mobile alignment + padding
- All four footer columns are **left-aligned on every breakpoint** (was `text-center md:text-left`, now `text-left` everywhere).
- Top CTA banner: heading left-aligned on mobile, button left-aligned on mobile (was centered).
- Top padding bumped (`pt-16 md:pt-20 → pt-20 md:pt-24`); bottom padding nudged (`pb-12 md:pb-16 → pb-14 md:pb-16`).
- Bottom bar items left-aligned on mobile.

Files: `src/layout/footer.tsx`

---

## 9. Mobile responsiveness fixes
- **Home hero heading** — already covered above (smaller, single line, no globe overlap).
- **Home video / hero spacing** — already covered above.
- **Services boxes** — the new `ServicesGrid` is responsive: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` with text clamping (`line-clamp-2` on tagline, `line-clamp-4` on intro). No more cramped sliders.
- **Section spacing** — `index.css` now has a stronger `@media (max-width: 640px)` block compressing `py-20`, `pt-20`, `pb-20`, `py-16`, `mt-16`, `mb-16`, `gap-10`, `gap-12` so more sections fit on one mobile screen.

Files: `src/index.css`, `src/pages/services/components/ServicesGrid.tsx`

---

## 10. Portfolio admin — discipline tags
Each project in the portfolio admin can now have **discipline tags** (e.g., "SEO", "AI", "Web Development") which appear as small chips on the portfolio card.

In the admin (`Project detail pages`):
- New "Tags" editor block under the cover-image upload.
- Active tags appear as removable chips.
- Type any tag and press Enter to add it.
- Click suggested chips (`SEO`, `AI`, `Web Development`, `Mobile App`, `UI/UX`, `Branding`, `Content`, `Paid Ads`, `Esports`, `Broadcasting`, `Manufacturing`, `Game Dev`) to quickly add common ones.

On the public portfolio cards, up to **4 chips per card** are rendered below the client name.

**Run the SQL** `supabase_project_tags.sql` in your Supabase SQL editor — it adds the `tags jsonb` column to `project_detail_pages` (idempotent, safe to re-run).

Files:
- `supabase_project_tags.sql` (new)
- `src/admin/pages/ProjectDetailPagesAdmin.tsx`
- `src/pages/portfolio/components/tabs.tsx`

---

## 11. Contact form fixes
### Double submission bug — FIXED
Root cause: `CustomButton` rendered a plain `<button>` without a `type` attribute, which defaults to `type="submit"` inside a `<form>`. Clicking it triggered the form's `onSubmit` AND the button's `onClick`, so each contact submission was inserted twice.

Fix: `CustomButton` now accepts a `type` prop and **defaults to `type="button"`**. The contact buttons rely on `onClick` to call `handleSubmit1/2` directly. Result: exactly one row per click. Pressing Enter inside a form input still works (form's `onSubmit` fires once).

Files: `src/components/CustomButton.tsx`

### Mobile detailed-form scroll bug — FIXED
Root cause: `switchMode()` measured the form before it had mounted (`<FadeIn>` lazy-mounts the form), so the page scrolled to where the form WOULD be — which on mobile was the very bottom of an empty section.

Fix: switch now uses **double `requestAnimationFrame` + `setTimeout(150ms)` fallback** so the scroll fires AFTER the form is in the DOM and any entry animation has settled.

Files: `src/pages/contact/contact.tsx`

### "Reducing development/manufacturing costs (40-60%)" goal option
Confirmed **NOT present** in the GOALS array. A comment was added to ensure it does not get re-added.

Files: `src/pages/contact/contact.tsx`

---

## 12. Team page rebuild
- **"MEET THE TEAM"** heading is now on **ONE LINE** above the CEO section at every breakpoint (uses `whitespace-nowrap` + `clamp(28px, 8vw, 124px)` so it scales down on tiny phones).
- The page intro paragraph ("As a result of our diverse experience...") **moved next to the CEO image** — it now sits in the right column above the "The Profile" eyebrow, not below the heading.
- **CEO row remains hardcoded** (`Daniyal Mansur`).
- The **"Rest of the team" grid is admin-driven** from the `team_members` table; the CEO is filtered out by name so the admin can never accidentally duplicate or replace him.
- **No FAQ section** on the team page.
- **Testimonials only** before the footer CTA (no Featured Projects).

Files: `src/pages/team/component/teamsection.tsx`, `src/pages/team/team.tsx`

---

## 13. R&D — admin-controlled research with detail pages
Brand-new system mirroring the Portfolio detail-pages flow.

### New Supabase table — `rd_research_pages`
Run **`supabase_rd_research_pages.sql`** in your Supabase SQL editor. It creates the table, sets RLS policies (public read for active rows, authenticated write), adds indexes, and **seeds 3 demo entries**:

1. **Haptic Web Interfaces** (75% — AI Architecture)
2. **Multi-Agentic Workflows** (85% — AI Architecture)
3. **Voice-First Navigation** (90% — Marketing)

Each demo has 3 sections (chapters) of content. Safe to re-run — uses `on conflict (slug) do nothing`.

### New admin page — `R&D research pages`
Path: `/admin/rd-research-pages`
Linked in the sidebar under a new "R&D" section.

Edit each row with:
- slug (URL part), title, category, percent (0–100), sort order
- card text (shown on the listing card)
- cover image (uploads to the `research` folder)
- tagline (italic intro line)
- intro paragraph
- multiple **sections** (chapters) with reorder ↑ ↓ buttons

### New public detail page — `/r&d/<slug>`
- Cinematic hero with watermark percent number
- Animated progress bar
- Cover image + intro
- Sticky sidebar listing other research entries (cross-links)
- Sections rendered as long-form articles
- "Have a research challenge of your own?" CTA → /contact
- PreCtaSections proof block before footer

### Updated R&D listing page — `/r&d`
- Now **fetches from `rd_research_pages`** instead of using a hardcoded array.
- Each card links to `/r&d/<slug>`.
- Filter tabs are **auto-derived** from the categories present in the DB plus "All".
- PreCtaSections block added before the existing CTA.

Files:
- `supabase_rd_research_pages.sql` (new)
- `src/admin/pages/RDResearchPagesAdmin.tsx` (new)
- `src/pages/r&d/RDResearchDetailPage.tsx` (new)
- `src/pages/r&d/r&d.tsx` (rewritten to be admin-driven)
- `src/admin/AdminLayout.tsx` (nav link)
- `src/App.tsx` (admin route + public detail route)

---

## 14. Black-to-white diffuse fades between sections
The reusable helper classes `section-fade-from-black`, `section-fade-from-white`, `section-fade-to-black`, `section-fade-to-white` (defined in `src/index.css`) render an 80px-tall linear-gradient overlay at the top or bottom of a section, producing a soft diffuse instead of a hard horizontal line.

Applied automatically on the home (`ServicesSection` uses `section-fade-from-black`) and the R&D Impact stats section (`section-fade-from-black`). Most other dark sections sit on the same `bg-[#000202]` so they don't need a fade — a fade is only needed when adjacent sections have different background colors.

The classes are available for any future section transitions: just add `section-fade-from-black` or `section-fade-from-white` to a section that follows a dark / light section respectively, and add `relative` to make the `::before` overlay position correctly.

Files: `src/index.css`

---

## 15. 14-inch / 16:10 laptop optimization
A new media query `@media (min-width: 1024px) and (max-width: 1500px) and (max-height: 900px)` compresses the most over-sized vertical paddings on hero and content sections (`py-28 → 4rem`, `pt-60 → 9rem`, `py-24 → 3.5rem`, etc.) so first-impression sections fit in one viewport on the typical 14-inch laptop (1280×800, 1366×768, 1440×900) instead of forcing a long scroll.

Files: `src/index.css`

---

## How to deploy
1. **Run the two new SQL files** in your Supabase SQL editor (in this order doesn't matter, both are idempotent):
   - `supabase_project_tags.sql` — adds `tags` column to `project_detail_pages`
   - `supabase_rd_research_pages.sql` — creates the `rd_research_pages` table + seeds 3 demos

2. **Build the frontend**: `npm install && npm run build`

3. **Deploy** the `dist/` folder to your host as usual.

The build produces no TypeScript errors and is the same shape as before (single-page Vite build, ~1.1 MB JS / ~110 KB CSS).
