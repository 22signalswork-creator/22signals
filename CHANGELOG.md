# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Homepage:** restored the video reel showcase in the services hero, now that
  a reel is available. The `<Video/>` frame, the "Watch our showcase" eyebrow,
  the giant "022" reel numeral, the scroll cue, the decorative rule and the
  vertical connector are all back. The reel source is driven by the
  `home_video_url` row in `site_settings` (Admin → Site Settings), which
  accepts either a YouTube link or a direct `.mp4` URL.

- **Reel loads lazily.** The `<video>` element now uses `preload="none"` and
  only receives its `src` once an `IntersectionObserver` reports the frame is
  within 300px of the viewport. The reel is a multi-megabyte file served from
  Supabase Storage, and the previous `preload="auto"` fetched all of it on
  page load even for visitors who never scrolled that far.

- **Reel overlay labels no longer hardcoded.** "Live · 2024" and
  "Reel 022 · Showcase 2024" now derive their year from the clock via the
  exported `REEL_YEAR`, and the runtime badge reads the real duration from the
  video's metadata instead of a fixed "02:15" — it is hidden entirely for
  YouTube sources, which don't expose a duration.

### Hidden (temporary)

- **Phone number and office address removed site-wide.** The company is
  remote, so there is no office address to publish.
  - Footer contact column now shows only the email address, behind
    `SHOW_PHONE` / `SHOW_ADDRESS` flags in `src/layout/footer.tsx`. Their
    hardcoded fallbacks are blanked too, so the literals no longer ship in
    the public JS bundle — flipping a flag renders whatever `site_settings`
    holds for that key.
  - The "Contact us" blocks on the Privacy Policy and Terms of Service pages
    now list the company name and email only.
  - Governing law and the registered-entity references ("registered in
    Lahore, Pakistan", "courts of Lahore, Pakistan") are deliberately kept —
    those are jurisdiction clauses, not a mailing address.

  The `phone` and `address` rows still exist in `site_settings` and remain
  publicly readable through the anon key. Clear them from Admin → Site
  Settings if the values should be gone entirely.

### Hidden (temporary)

- **Testimonials hidden site-wide.** The testimonials / "Proven Results"
  section is hidden on every public page while it's being revisited. Nothing
  was deleted — it's gated behind flags so it can be switched back on:
  - `src/pages/home/components/portfoliosection.tsx` — home block gated behind
    `const SHOW_TESTIMONIALS = false`.
  - `src/components/PreCtaSections.tsx` — shared `<TestimonialsSection/>` render
    commented out; the Team page (testimonials-only) now renders nothing for
    that block instead of an empty container.
  - The admin CMS for testimonials (`/admin/testimonials`) is untouched.

### Added

- `.gitignore` ignoring `node_modules`, `dist`, `.env`, `.vercel`, and editor/OS
  files (the repo previously had none).
- `.env.example` documenting the required `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_ANON_KEY` environment variables for local dev and Vercel.
- This `CHANGELOG.md` and an expanded `README.md` covering the stack, project
  structure, setup, environment variables, and Vercel deployment.

### How to restore

- **Testimonials:** set `SHOW_TESTIMONIALS = true` in `portfoliosection.tsx`,
  and uncomment the `TestimonialsSection` import + render in `PreCtaSections.tsx`.
- **Video reel:** re-import `Video` in `ServicesSection.tsx` and render
  `<Video/>` inside `VideoShowcase` (see git history for the original block).
