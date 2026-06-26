# 22 Signals

Marketing website for **22 Signals**, built with React 19 + Vite + TypeScript,
styled with Tailwind CSS, animated with Framer Motion / GSAP / React Three
Fiber, and backed by a Supabase CMS. Deployed on Vercel.

---

## Tech stack

| Area        | Choice                                              |
| ----------- | --------------------------------------------------- |
| Framework   | React 19, React Router 7 (SPA)                      |
| Build tool  | Vite 7                                              |
| Language    | TypeScript                                          |
| Styling     | Tailwind CSS 4                                       |
| Animation   | Framer Motion, GSAP, React Three Fiber / drei       |
| Carousels   | react-slick                                         |
| Backend/CMS | Supabase (content tables, auth, contact submissions)|
| Hosting     | Vercel                                              |

---

## Project structure

```
src/
├── App.tsx                 # Routes + public/admin layout split
├── layout/                 # Header, Footer, Preloader
├── pages/                  # Public pages
│   ├── home/               # Landing page + sections
│   ├── services/  portfolio/  team/  r&d/  blog/  contact/  thank-you/
├── components/             # Shared sections (PreCtaSections, TestimonialsSection, ...)
├── admin/                  # Supabase-backed CMS (login, dashboard, CRUD pages)
├── hooks/                  # useCMS, usePageContent
└── lib/                    # supabase client, image upload helpers
```

### Routes

- Public: `/`, `/services` (`/work`), `/services/:slug`, `/portfolio`,
  `/portfolio/:slug`, `/team`, `/r&d`, `/r&d/:slug`, `/blog`, `/contact`,
  `/thank-you`
- Admin: `/admin/*` (protected, Supabase auth) — manages all CMS content
  including testimonials, projects, blog posts, team, FAQs, site settings, etc.

---

## Local development

```bash
npm install
cp .env.example .env   # then fill in your Supabase credentials
npm run dev            # start the dev server
```

| Script            | Purpose                          |
| ----------------- | -------------------------------- |
| `npm run dev`     | Vite dev server with HMR         |
| `npm run build`   | Production build → `dist/`       |
| `npm run preview` | Preview the production build     |
| `npm run lint`    | ESLint                           |

---

## Environment variables

The site reads Supabase credentials at build time (Vite only exposes
`VITE_`-prefixed variables to the client). See `.env.example`:

| Variable                 | Description                          |
| ------------------------ | ------------------------------------ |
| `VITE_SUPABASE_URL`      | Supabase project URL                 |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key             |

If these are missing the build still succeeds and pages render using their
built-in fallback content; live CMS data, admin auth, and the contact form
won't work until they're set.

---

## Deploying to Vercel

The project is a standard Vite SPA and deploys to Vercel with zero extra
configuration beyond environment variables:

1. **Framework preset:** Vite (auto-detected)
2. **Build command:** `npm run build` (auto-detected)
3. **Output directory:** `dist` (auto-detected)
4. **Environment variables:** add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` in *Project Settings → Environment Variables*.

`vercel.json` rewrites every path to `/index.html` so client-side routing
(React Router) works on hard refresh and deep links.

---

## Recent changes

See [`CHANGELOG.md`](./CHANGELOG.md) for the full, versioned history. In short,
the latest work:

- **Homepage:** removed the video reel showcase (no reel available yet) —
  only the _"We translate complex challenges into tangible data driven
  results."_ headline remains.
- **Testimonials:** hidden site-wide (temporary, flag-gated, fully reversible).
- **Deploy hygiene:** added `.gitignore`, `.env.example`, this `CHANGELOG.md`,
  and an expanded README/Vercel guide.

Restore instructions for the hidden/removed pieces are in the changelog.
