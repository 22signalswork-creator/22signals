# Round-7 Changes — 16:10 responsive + admin SMTP + multiple UI fixes

## Summary

Nine separate changes shipped in this round, covering responsive
optimization, copy edits, the logo carousel redesign, the new email
admin, and integrating service visuals into individual detail pages.

---

## 1. Removed the subheading paragraph below the section hero

`src/pages/home/components/ServicesSection.tsx`

The paragraph **"One studio. Seven pillars. From the first signal to
the final ship — we engineer outcomes that move the needle."** was
removed from beneath the *"We translate complex challenges into
tangible data driven results."* headline. Vertical spacing above the
showcase video was tightened to compensate.

## 2. Fixed Global Manufacturing card text cut-off

`src/pages/home/components/ServiceCard.tsx`

The 7th service card ("Global Manufacturing") was clipping its title
because the card's title font was too large for the column width
inside the responsive grid. Adjustments:

- Title font reduced (`text-[20px] md:text-[24px]` from
  `text-[22px] md:text-[26px]`)
- Added `break-words` so a single long word can wrap
- Inner padding tightened to `p-6 md:p-8` (from `p-7 md:p-9`)

## 3. Logos carousel — full width, white background, 3 rows,
alternating directions, infinite

`src/components/Slider.tsx` — fully rewritten.

- Three independent marquee rows.
- Row 1 scrolls left, row 2 scrolls right, row 3 scrolls left
  (different durations to avoid lock-step motion).
- Full-bleed white background via `width: 100vw; left: 50%;
  transform: translateX(-50%)`.
- Logos are evenly distributed across the three rows
  (round-robin), so each band stays full even with few logos.
- Infinite loop via duplicated track + CSS keyframes (GPU-accelerated).
- Responsive cell sizes from mobile through 1600px+ desktop.
- `prefers-reduced-motion: reduce` disables the animation.
- Hover lifts opacity from 95 → 100% and removes grayscale tint.

The wrapper section now provides a tiny extra top margin so the white
band reads as its own canvas distinct from the page's `#f0f1fa` body
color.

## 4. Removed "Refined Execution" section from /services page

`src/pages/services/service.tsx`

`<ServicesDetailList />` removed from the page. Imagery is preserved:
each branded visual (code editor, dashboard, broadcast HUD, factory,
team grid, game UI) is now rendered inside the matching
`/services/:slug` detail page (see #6 below).

`src/pages/services/components/services-detail-list.tsx` remains in
the repo as dead code so it can be re-enabled later if needed.

## 5. "On this page" sidebar now scrolls with the section

`src/pages/services/ServiceDetailPage.tsx`

The TOC sidebar is now visible on `md` (tablet) and up, not just `lg`,
so 16:10 laptops always see it. The active-section indicator is now
an animated `<motion.div>` whose `top` and `height` percentages
interpolate as the user scrolls through sections — visually conveying
"the TOC moves with you" rather than being a static highlight.

## 6. Service visuals integrated into individual service pages

`src/pages/services/ServiceDetailPage.tsx`

A new `SLUG_VISUAL_MAP` ties every service slug to its branded
visual (`VisualDigital`, `VisualCreative`, `VisualBroadcast`,
`VisualManufacturing`, `VisualOutsourcing`, `VisualGame`). The hero
right-rail now shows the visual stacked above a compact stats card
(Sections / Capabilities / Pillar).

## 7. Portfolio page — paragraph removed

`src/pages/portfolio/components/CompanyStatsCounts.tsx`

The descriptive paragraph next to "Our Successfully Growth" was
removed. The same component is now CMS-driven (uses `useCMS`) so the
counter values respect any admin edits — including the new prefix
field.

## 8. `$` prefix support for stat counters (e.g. **$5M**)

- New column: `company_stats.prefix` (see SQL below).
- All three stat components render `{stat.prefix}{value}{suffix}`:
  - `src/pages/home/components/CompanyStatsCounts.tsx`
  - `src/pages/services/components/CompanyStatsCounts.tsx`
  - `src/pages/portfolio/components/CompanyStatsCounts.tsx`
- Admin form (`/admin/stats`) now has a "Prefix" field. Set it to `$`
  for the "5M Increase Revenue For Client" stat.

## 9. SMTP / Brevo admin + 3-recipient email delivery

### Database
`supabase_email_settings.sql` — new singleton table `email_settings`:

| Column        | Purpose                                          |
|---------------|--------------------------------------------------|
| `smtp_host`   | e.g. `smtp-relay.brevo.com`                      |
| `smtp_port`   | e.g. `587`                                       |
| `smtp_user`   | Brevo SMTP login                                 |
| `smtp_pass`   | Brevo SMTP key                                   |
| `smtp_secure` | true = SSL/465, false = STARTTLS/587             |
| `from_name`   | e.g. `22 Signals`                                |
| `from_email`  | The address shown in the "From" header           |
| `recipient_1` | 1st inbox to notify                              |
| `recipient_2` | 2nd inbox to notify                              |
| `recipient_3` | 3rd inbox to notify                              |
| `is_enabled`  | Master switch                                    |

RLS: only authenticated admins can read/write (because `smtp_pass` is
sensitive).

### Admin UI
`src/admin/pages/EmailSettings.tsx` — new route at `/admin/email-settings`
with sections for: master switch, SMTP server (one-click Brevo defaults),
sender identity, three recipient inputs, plus a setup checklist.

### Edge function
`supabase/functions/send-contact-email/index.ts` — Deno Deploy edge
function that:

1. Loads `email_settings` (using the SERVICE_ROLE_KEY so credentials
   never reach the browser).
2. Skips sending silently if `is_enabled` is false.
3. Connects to the configured SMTP server via `denomailer`.
4. Sends a styled HTML email to all three recipients.
5. Uses the submitter's email as `Reply-To` so the team can reply
   directly.

### Contact form wiring
`src/pages/contact/contact.tsx` — both submission handlers (quick
and detailed) now call `supabase.functions.invoke("send-contact-email", …)`
after a successful insert. Send failures are non-blocking — the
submission still lands in the `contact_submissions` table either way.

### Deployment steps (one-time)

```bash
# 1. Run the SQL
psql -f supabase_email_settings.sql
# (or paste into the Supabase SQL editor)

# 2. Deploy the edge function
supabase functions deploy send-contact-email

# 3. In Supabase Dashboard → Edge Functions → Secrets, add:
#      SUPABASE_URL              = https://<project>.supabase.co
#      SUPABASE_SERVICE_ROLE_KEY = <service role key>

# 4. Go to /admin/email-settings, fill in everything, save,
#    flip the master switch ON.
```

## 10. 16:10 (and full desktop-ratio) responsive optimization

`src/index.css`

Expanded the existing `(min-width: 1024px) and (max-height: 900px)`
block with **three new media-query layers**:

- **16:10 aspect-ratio query** (`min-aspect-ratio: 16/10` ∧
  `max-aspect-ratio: 16/9`) — catches actual 16:10 panels regardless
  of resolution (e.g. a 1920×1200 monitor that the old query missed).
  Tightens hero/section paddings, narrows container gutters
  proportionally, clamps oversize headlines.
- **Larger 16:10 (≥1600px wide)** — restores generous gutters and
  bigger headlines on 27"+ 16:10 panels.
- **16:9 + ultrawide (≥21:9)** — increases container `max-width`
  so the layout doesn't look stranded in the middle.
- **Short-viewport catch-all** (`max-height: 820px`) — any narrow
  laptop benefits from compressed hero paddings.

`src/pages/home/home.css`

- New `.services-hero-line` rule: lets the services-section hero
  headline wrap naturally on screens narrower than 1100px, while
  preserving the original 2-line layout on wider screens. (Replaces
  a hard `whitespace-nowrap` that overflowed on 16:10 laptops.)

---

## Files changed / added

### Modified
- `src/App.tsx`
- `src/admin/AdminLayout.tsx`
- `src/admin/pages/CrudPages.tsx`
- `src/components/Slider.tsx`  *(full rewrite)*
- `src/index.css`
- `src/pages/contact/contact.tsx`
- `src/pages/home/components/CompanyStatsCounts.tsx`
- `src/pages/home/components/ServiceCard.tsx`
- `src/pages/home/components/ServicesSection.tsx`
- `src/pages/home/home.css`
- `src/pages/portfolio/components/CompanyStatsCounts.tsx`  *(full rewrite)*
- `src/pages/services/ServiceDetailPage.tsx`
- `src/pages/services/components/CompanyStatsCounts.tsx`  *(full rewrite)*
- `src/pages/services/service.tsx`

### Added
- `src/admin/pages/EmailSettings.tsx`
- `supabase_email_settings.sql`
- `supabase/functions/send-contact-email/index.ts`
- `CHANGELOG_V7.md`  *(this file)*
