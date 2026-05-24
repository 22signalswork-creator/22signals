# 22 Signals — CMS + Admin Dashboard

A full content management system built into your React app. Edit everything from a password-protected dashboard at `/admin`.

---

## What you get

```
http://your-site.com/              → public website (visitors)
http://your-site.com/admin/login   → login page
http://your-site.com/admin         → admin dashboard
```

The admin dashboard lets you edit:

- **Hero section** — headline, tagline, cities
- **Services** — 7 service cards with icons
- **Company stats** — animated counters
- **Process steps** — operational framework
- **FAQs** — separated by page (home / services / portfolio)
- **Projects** — with image upload
- **Testimonials** — with photo upload
- **Blog posts** — with cover image upload
- **Team members** — with photo upload
- **Client logos** — slider images
- **Site settings** — phone, email, address, footer text
- **Contact submissions** — read-only inbox of messages from your contact form

All edits go to Supabase, and the public site reads from Supabase. **You never have to touch the Supabase dashboard once it's set up.**

---

## One-time setup (do this once)

### 1. Run the SQL files in order

In Supabase → **SQL Editor → New query**, run these three files in order:

1. **`supabase_setup.sql`** — Creates all 12 tables, RLS, public read policies (already done)
2. **`supabase_seed.sql`** — Populates tables with your current site content (already done)
3. **`supabase_admin_setup.sql`** — Adds write policies for logged-in admin users **(NEW — run this)**

### 2. Create your admin user

In your Supabase project:

1. Click **Authentication** in the left sidebar.
2. Click **Users** → **Add user** → **Create new user**.
3. Enter your email and a strong password.
4. Check **Auto Confirm User** (so you don't need to verify by email).
5. Click **Create user**.

That's your login. To add more admins later, repeat this step.

### 3. Run the site

```bash
npm install
npm run dev
```

Open `http://localhost:5173/admin/login`, sign in with the email/password you just created, and you're in.

---

## Day-to-day usage

**To edit text content** (e.g. change a service description):
1. Go to `/admin` → **Services**
2. Click **Edit** next to the service
3. Change the text → click **Save**
4. Refresh the public site → change is live

**To replace an image** (e.g. update a project photo):
1. Go to `/admin` → **Projects** → **Edit**
2. Click **Replace** under the image field
3. Pick the new image → it uploads automatically
4. Click **Save**

**To check who contacted you**:
1. Go to `/admin` → **Contact submissions**
2. Click any row to expand the full message

**To add a new blog post**:
1. Go to `/admin` → **Blog posts** → **+ Add new**
2. Fill in title, description, upload cover image
3. Toggle **Published** on
4. **Save**

---

## How it all hangs together

```
React component (e.g. HomeFaq.tsx)
        │
        │  uses useCMS() hook
        ▼
Supabase Postgres tables (faqs, projects, etc.)
        ▲
        │  written to by admin pages (CrudPage, HeroEditor, etc.)
        │
Admin dashboard at /admin (protected by Supabase Auth)
```

Each public component has a **fallback** — if Supabase is unreachable or a table is empty, the site falls back to hardcoded content so it never breaks.

---

## File map

```
.env                                 # Supabase credentials (NOT committed)
supabase_setup.sql                   # Tables, public read policies
supabase_seed.sql                    # Initial content
supabase_admin_setup.sql             # Admin write policies (NEW)

src/
├── lib/
│   ├── supabase.ts                  # Supabase client
│   └── uploadImage.ts               # Storage upload helper
├── hooks/
│   └── useCMS.ts                    # useCMS / useCMSSingle hooks
├── admin/
│   ├── AuthContext.tsx              # Auth state provider
│   ├── ProtectedRoute.tsx           # Route guard
│   ├── AdminLayout.tsx              # Sidebar + shell
│   ├── components/
│   │   ├── CrudPage.tsx             # Generic table editor
│   │   └── ImageUploader.tsx        # Drag-drop image upload
│   └── pages/
│       ├── Login.tsx                # Sign-in form
│       ├── Dashboard.tsx            # Overview tiles
│       ├── HeroEditor.tsx           # Single-row editor for hero
│       ├── SiteSettings.tsx         # Key/value editor
│       ├── ContactSubmissions.tsx   # Read-only inbox
│       └── CrudPages.tsx            # Configs for all CRUD tables
└── App.tsx                          # Routing (admin + public)
```

---

## Troubleshooting

**"Invalid login credentials"** — make sure the user exists in Supabase Authentication → Users. Confirm the email is verified (Auto Confirm).

**Edit saves silently fail / "row violates RLS"** — `supabase_admin_setup.sql` wasn't run. Run it.

**Image upload fails** — `cms-assets` bucket isn't public, or storage policies missing. Re-run the storage policy section of `supabase_admin_setup.sql`.

**Edits in admin don't show on the live site** — hard refresh the public tab (`Ctrl + Shift + R`). React caches data per component mount.

**Logged-in user gets stuck on loading screen** — clear your browser's local storage for the site (auth token may be malformed), then sign in again.

---

## Security notes

- The `anon public` Supabase key is safe in frontend code — RLS policies prevent it from doing anything an unauthenticated user shouldn't do.
- Only **authenticated** users can write to CMS tables. Without logging in, the most a visitor can do is INSERT into `contact_submissions` (which is intended).
- To remove an admin: Supabase → Authentication → Users → click the user → **Delete user**.
- To rotate the anon key: Supabase → Settings → API → **Reset anon key** → update `.env` → redeploy.
- **Never** put the `service_role` key in this codebase — it bypasses RLS.

---

## Adding a new editable section later

If you add a new table to Supabase:

1. Add an entry to `supabase_admin_setup.sql` for write policies.
2. In `src/admin/pages/CrudPages.tsx`, add a new `CrudConfig` and export an `XYZAdmin` wrapper component.
3. In `src/admin/AdminLayout.tsx`, add a sidebar link inside the appropriate `NAV` group.
4. In `src/App.tsx`, add a `<Route>` under `/admin`.
5. In the public component that should render the new content, call `useCMS('your_table', { fallback: [...] })`.
