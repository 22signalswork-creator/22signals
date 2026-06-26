# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Homepage:** removed the video reel showcase from the services hero. There
  is no reel available yet, so the embedded template video and all of its
  surrounding chrome have been removed, leaving only the headline
  _"We translate complex challenges into tangible data driven results."_
  Removed elements:
  - the `<Video/>` reel frame
  - the "Watch our showcase" / "Reel 022 / 2024" eyebrow row
  - the giant faded "022" reel numeral
  - the "scroll ↓" cue
  - the decorative rule above the headline
  - the vertical connector below the reel

  The `src/pages/home/components/video.tsx` component is kept in the repo (no
  longer imported) so the reel can be restored once a video is available.

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
