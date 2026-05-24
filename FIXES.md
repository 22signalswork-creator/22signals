# Round-Of-Fixes — Changelog

Each item lists the user complaint, what was changed, and the files touched.

## 1. Desktop dropdowns (Services + Portfolio) — three bugs in one
**Reported:** "When I hover Services the dropdown shows, but if I try to move
the cursor down into it, it disappears. Same for Portfolio. And after clicking
an item it navigates but the dropdown stays open on the new page."

**Fix:**
- Switched the dropdowns from pure CSS `:hover` to React state
  (`openDropdown: string | null`). `onMouseEnter` opens; `onMouseLeave` schedules
  a 180 ms close so a quick cross-over the gap doesn't kill the panel.
- Added an invisible "hover bridge" pseudo-element (`::after` on the trigger and
  `::before` on the menu) that covers the 12 px gap so the cursor can travel
  from trigger to dropdown without losing the hover state.
- Click on any menu item now calls `closeDropdown()` before navigating, so the
  panel is gone before the next page renders.
- A `useEffect` watching `location.pathname` calls `closeDropdown()` on every
  route change as a belt-and-braces measure — guarantees the panel cannot
  persist over a freshly-mounted page.
- Escape key closes the dropdown.

**Files:** `src/layout/header.tsx`, `src/layout/headerfooter.css`

## 2. Home-page FAQ — first answer was always pre-opened
**Reported:** "The first question's answer is always open. I want all closed by
default, only opening on click."

**Fix:** Changed `useState<number | null>(0)` to `useState<number | null>(null)`
so on mount no row is treated as the "open" index.

**File:** `src/pages/home/components/HomeFaq.tsx`

## 3. Home services on mobile — too tall, too much scrolling

**Reported (round 1):** "The services on the home page on mobile are too big and
take a lot of scroll. Make them compact, maybe 2-column."

**Reported (round 2, after first attempt):** the first attempt squeezed the
existing desktop cards into a 2-column grid, which left Cloud Solutions
orphaned alone on its own row and the cards still felt clunky.

**Final fix:** purpose-built mobile layout that **only** renders on screens
below `md`. The desktop layout is hidden on mobile and untouched on `md+`.

- One unified grid (`grid grid-cols-2 gap-3`) containing all seven services,
  so there is no row-split that strands a card alone.
- New compact tile design — no shrunk-down desktop card. Each tile has:
  a small glowing status dot, a numeric pillar label ("/ 01" through
  "/ 07"), the service title (15 px), a one-line description (11 px),
  and an arrow-out icon chip in the bottom-right. The whole tile is
  tappable; no big GET STARTED pill cluttering the card.
- Tone alternation (dark / blue) is preserved: 01-dark, 02-blue, 03-dark,
  04-blue, 05-dark, 06-blue, 07-dark.
- The 7th card (Global Manufacturing) spans both columns with a slightly
  larger title — terminates the grid cleanly so 7 items fit a 2-column
  rhythm without orphans (3 rows of 2 + 1 wide).
- Descriptions are shortened on mobile (e.g. "Top-tier global talent with
  built-in supervision. Staff augmentation and employee outsourcing." →
  "Top-tier global talent, supervised.") so they fit on a single line.

The whole section now collapses to roughly one phone screen tall instead
of multiple scrolls.

**Files:** `src/pages/home/components/ServicesSection.tsx`

## 4. Featured Projects card on mobile — too tall on every page
**Reported:** "Featured projects on every page on mobile, make them a bit more
compact too."

**Fix:** Added mobile-only overrides for `.glass-card.gradient-border`
(the project card chrome) — reduced padding, capped the project image at
140 px tall, shrunk title to 20 px and body to 12 px, and reined in the
floating arrow icon. Because every page reuses `ProjectCardContent` through
`FeaturedProjectsSection`, this fix applies everywhere featured projects
appear (home, services, portfolio, R&D, blog, contact).

**File:** `src/pages/home/home.css`

## 5. Team page — intro paragraph in the wrong place
**Reported (with annotated image):** Move the "As a result of our diverse
experience…" paragraph from beside the CEO photo up under the big
"MEET THE TEAM" heading.

**Fix:** The paragraph block is now rendered inside the heading container,
right after the `<RisingText>` for "MEET THE TEAM", with `mt-6 md:mt-8` and
`max-w-3xl` so it reads like a proper deck under the title. The duplicate
paragraph that sat next to the CEO image was removed.

**File:** `src/pages/team/component/teamsection.tsx`

## 6. R&D page — research items should come first
**Reported:** "On the R&D page make sure the research things are on top and
then any other thing comes."

**Fix:** Reordered the JSX sections inside the `RD` component:

| Before                       | After                        |
|------------------------------|------------------------------|
| Hero                         | Hero                         |
| Section 01 · Impact Stats    | **Section 01 · Pipeline (cards)** |
| Pull Quote                   | Section 02 · Impact Stats    |
| Section 02 · Pipeline (cards)| Pull Quote                   |
| Pre-CTA                      | Pre-CTA                      |
| CTA                          | CTA                          |

The "Section 01 / 02" eyebrow labels were updated so the numbering still
matches the new order.

**File:** `src/pages/r&d/r&d.tsx`

---

## Verification
- `npm install` and `npm run build` were both run; the production Vite build
  succeeds with **0 errors**.
- No new dependencies were added.
