import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FadeIn from "@/transitions/FadeIn";
// @ts-ignore - plain JS content module shared with the prerender script
import { PAGES, SERVICES, INDUSTRIES, MARKETS, SITE, CTA } from "@/content/site.js";
// @ts-ignore - plain JS helper shared with the prerender script
import { linkBlocks } from "@/content/links.js";
import MANIFEST from "@/content/generated/manifest.json";

type Section = { id?: string; h: string; p?: string[]; list?: string[] };
type Faq = { q: string; a: string };
type Page = {
  path: string;
  kind: string;
  eyebrow: string;
  h1: string;
  intro: string;
  sections: Section[];
  faqs: Faq[];
  related: string[];
};
type NavItem = { path: string; label: string; blurb?: string };

type ManifestItem = { path: string; file: string; kind: string; eyebrow?: string; h1?: string };
const ALL_LINKS: NavItem[] = [...SERVICES, ...INDUSTRIES, ...MARKETS];
const labelFor = (path: string) => {
  const hit = ALL_LINKS.find((l) => l.path === path);
  if (hit) return hit.label;
  const m = (MANIFEST as ManifestItem[]).find((p) => p.path === path);
  return m ? m.eyebrow || m.h1 || path : path;
};

/** Page data: prerendered JSON embedded in the HTML on first load, otherwise fetched. */
function usePage(current: string): Page | null {
  const local = (PAGES as Page[]).find((p) => p.path === current) || null;
  const initial = (): Page | null => {
    if (typeof document !== "undefined") {
      const el = document.getElementById("page-data");
      if (el) {
        try {
          const d = JSON.parse(el.textContent || "null");
          if (d && d.path === current) return d;
        } catch {
          /* ignore */
        }
      }
    }
    return null;
  };
  const [page, setPage] = useState<Page | null>(initial);
  useEffect(() => {
    if (page && page.path === current) return;
    const m = (MANIFEST as ManifestItem[]).find((p) => p.path === current);
    if (!m) {
      setPage(local);
      return;
    }
    let cancelled = false;
    fetch(`/content/${m.file}.json`)
      .then((r) => r.json())
      .then((d) => !cancelled && setPage(d))
      .catch(() => !cancelled && setPage(local));
    return () => {
      cancelled = true;
    };
  }, [current]);
  return page && page.path === current ? page : null;
}

const gradient: React.CSSProperties = {
  background: "linear-gradient(91.16deg, #325FEC 1.74%, #FFFFFF 50%, #325FEC 102.48%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const CardGrid: React.FC<{ title: string; items: NavItem[] }> = ({ title, items }) => (
  <section className="mt-16">
    <h2 className="text-white text-2xl md:text-3xl mb-6">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((s) => (
        <Link
          key={s.path}
          to={s.path}
          className="block rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-[#325FEC] hover:bg-[#325FEC]/10 transition-colors"
        >
          <span className="block text-white text-lg mb-2">{s.label}</span>
          {s.blurb && <span className="block text-white/60 text-sm leading-relaxed">{s.blurb}</span>}
        </Link>
      ))}
    </div>
  </section>
);

/**
 * Generic page for every route defined in src/content/site.js.
 * The same content is written into static HTML at build time by
 * scripts/prerender.mjs, so crawlers and AI assistants see this text
 * without running JavaScript.
 */
const ContentPage: React.FC<{ path?: string }> = ({ path }) => {
  const location = useLocation();
  const current = path || location.pathname.replace(/\/$/, "") || "/";
  const page = usePage(current);

  if (!page) return <div className="bg-[#000202] min-h-screen" />;
  const blocks = linkBlocks(page, MANIFEST) as { title: string; items: NavItem[] }[];

  return (
    <div className="bg-[#000202] min-h-screen pt-32 pb-24 px-6 relative overflow-hidden text-white">
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(50,95,236,0.18) 0%, transparent 55%)" }}
      />
      <div className="container relative z-10">
        <article className="content-page max-w-3xl mx-auto">
          <FadeIn>
            <p className="text-[#6B92FF] text-sm tracking-[0.2em] uppercase mb-4">{page.eyebrow}</p>
            <h1 className="text-4xl md:text-[56px] leading-[1.05] mb-8" style={gradient}>
              {page.h1}
            </h1>
            <p className="mt-6 text-white/80 text-lg md:text-xl leading-relaxed">{page.intro}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={SITE.booking}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-[#325FEC] px-7 py-3 text-white hover:bg-[#4B73F0] transition-colors"
              >
                {CTA.button}
              </a>
              <Link
                to="/portfolio"
                className="inline-block rounded-full border border-white/20 px-7 py-3 text-white/90 hover:border-white/50 transition-colors"
              >
                See the work
              </Link>
              {page.kind === "person" && (
                <a
                  href="https://www.linkedin.com/in/daniyal-mansur/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full border border-white/20 px-7 py-3 text-white/90 hover:border-white/50 transition-colors"
                >
                  Connect on LinkedIn
                </a>
              )}
            </div>
          </FadeIn>

          {page.kind === "hub" && (
            <>
              <CardGrid title="Services" items={SERVICES} />
              <CardGrid title="Industries" items={INDUSTRIES} />
            </>
          )}

          <div className="mt-16 space-y-12">
            {page.sections.map((s) => (
              <FadeIn key={s.h}>
                <section id={s.id}>
                  <h2 className="text-white text-2xl md:text-3xl mb-4">{s.h}</h2>
                  {s.p?.map((t, i) => (
                    <p key={i} className="text-white/70 text-base md:text-lg leading-relaxed mb-4">
                      {t}
                    </p>
                  ))}
                  {s.list && (
                    <ul className="space-y-3">
                      {s.list.map((t, i) => (
                        <li key={i} className="flex gap-3 text-white/70 text-base md:text-lg leading-relaxed">
                          <span className="mt-[0.6em] h-1.5 w-1.5 flex-none rounded-full bg-[#325FEC]" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </FadeIn>
            ))}
          </div>

          {blocks.map((b) => (
            <CardGrid key={b.title} title={b.title} items={b.items} />
          ))}

          {page.faqs.length > 0 && (
            <section className="mt-16">
              <h2 className="text-white text-2xl md:text-3xl mb-6">Questions</h2>
              <div className="divide-y divide-white/10 border-y border-white/10">
                {page.faqs.map((f) => (
                  <details key={f.q} className="group py-5" open={page.kind === "faq"}>
                    <summary className="cursor-pointer list-none text-white text-lg flex justify-between gap-4">
                      <h3 className="font-normal">{f.q}</h3>
                      <span className="text-[#6B92FF] group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="mt-3 text-white/70 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {page.related.length > 0 && (
            <nav className="mt-16" aria-label="Related">
              <h2 className="text-white/50 text-sm tracking-[0.2em] uppercase mb-4">Related</h2>
              <div className="flex flex-wrap gap-3">
                {page.related.map((r) => (
                  <Link
                    key={r}
                    to={r}
                    className="rounded-full border border-white/15 px-5 py-2 text-white/80 hover:border-[#325FEC] hover:text-white transition-colors"
                  >
                    {labelFor(r)}
                  </Link>
                ))}
              </div>
            </nav>
          )}

          <section className="mt-20 rounded-3xl border border-[#325FEC]/40 bg-[#325FEC]/10 p-8 md:p-12">
            <h2 className="text-white text-2xl md:text-3xl mb-4">{CTA.heading}</h2>
            <p className="text-white/75 leading-relaxed mb-6">{CTA.text}</p>
            <a
              href={SITE.booking}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-[#325FEC] px-7 py-3 text-white hover:bg-[#4B73F0] transition-colors"
            >
              {CTA.button}
            </a>
          </section>
        </article>
      </div>
    </div>
  );
};

export default ContentPage;
