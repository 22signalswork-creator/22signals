/**
 * DetailPage: the original /services/:slug design (see
 * src/pages/services/ServiceDetailPage.tsx, kept for reference and in the
 * archive/pre-seo-rebuild branch), driven by the new page content instead
 * of the old `service_detail_pages` CMS rows.
 *
 * Used for service, industry, location, market, guide, case-study and
 * company pages. Same hero, numbered sections with capability cards, sticky
 * "On this page" sidebar, stats band and CTA band as the original.
 */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import MyButton from "@/components/CustomButton";
import FaqSection from "@/pages/services/components/FaqSection";
import {
  VisualDigital,
  VisualCreative,
  VisualBroadcast,
  VisualOutsourcing,
} from "@/pages/services/components/service-visuals";
import { openCalendly } from "@/lib/calendly";
import { visualForService } from "@/pages/services/components/service-visuals-by-service";
// @ts-ignore - plain JS content module shared with the prerender script
import { SERVICES, CITY_SERVICES, CTA } from "@/content/site.js";

type Section = { id?: string; h: string; p?: string[]; list?: string[] };
type Faq = { q: string; a: string };
export type DetailPageData = {
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

const pad = (n: number) => String(n).padStart(2, "0");

// Number shown in the badge and the big watermark, like the old "Pillar" number.
function serviceNumber(page: DetailPageData): string | null {
  const i = (SERVICES as NavItem[]).findIndex((s) => s.path === page.path);
  if (i >= 0) return pad(i + 1);
  if (page.kind === "location-service") {
    const slug = page.path.split("/").pop();
    const cs = (CITY_SERVICES as { slug: string; global: string }[]).find((c) => c.slug === slug);
    const j = cs ? (SERVICES as NavItem[]).findIndex((s) => s.path === cs.global) : -1;
    if (j >= 0) return pad(j + 1);
  }
  return null;
}

const CREATIVE = /video|motion|animation|3d|render|fashion|beauty|real-estate/;
const EVENTS = /gaming|esports|entertainment/;
const TEAMS = /\/services\/more|partners|how-we-work/;
function visualFor(path: string): React.ReactNode {
  // Each service has its own visual; city service pages use their parent service's.
  let slug: string | undefined;
  if (path.startsWith("/services/")) slug = path.split("/")[2];
  else if (/^\/locations\/[^/]+\/[^/]+$/.test(path)) {
    const cs = (CITY_SERVICES as { slug: string; global: string }[]).find((c) => c.slug === path.split("/")[3]);
    slug = cs?.global.split("/")[2];
  }
  const own = slug ? visualForService(slug) : null;
  if (own) return own;
  if (EVENTS.test(path)) return <VisualBroadcast />;
  if (CREATIVE.test(path)) return <VisualCreative />;
  if (TEAMS.test(path)) return <VisualOutsourcing />;
  return <VisualDigital />;
}

const slugifySection = (title: string, idx: number) =>
  `section-${idx}-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40)}`;

const STATS = [
  { value: "30+", label: "Companies worked with" },
  { value: "30+", label: "AI builds" },
  { value: "20+", label: "Live events broadcast" },
  { value: "$1.5M+", label: "In projects managed" },
];

const DetailPage: React.FC<{
  page: DetailPageData;
  blocks: { title: string; items: NavItem[] }[];
  labelFor: (path: string) => string;
}> = ({ page, blocks, labelFor }) => {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const tocItemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [tocMarker, setTocMarker] = useState({ top: 0, height: 0 });

  const number = serviceNumber(page);
  const isService = page.kind === "service";
  const sections = page.sections || [];
  const faqs = page.faqs || [];

  // Sidebar cross-links: other services on service pages, related pages elsewhere.
  const sideLinks: NavItem[] = isService
    ? (SERVICES as NavItem[]).filter((s) => s.path !== page.path)
    : (page.related || []).map((r) => ({ path: r, label: labelFor(r) }));
  const sideTitle = isService ? "Other services" : "Related";

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [page.path]);

  // Active section tracking for the sticky table of contents (same as the original).
  useEffect(() => {
    if (sections.length === 0) return;
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveSection((prev) => (prev === i ? prev : i));
          });
        },
        { rootMargin: "-18% 0px -65% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    const handler = () => {
      const trigger = window.scrollY + 160;
      let current = 0;
      sectionRefs.current.forEach((el, i) => {
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= trigger) current = i;
      });
      setActiveSection((prev) => (prev === current ? prev : current));
    };
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    const t1 = window.setTimeout(handler, 80);
    const t2 = window.setTimeout(handler, 300);
    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [page.path, sections.length]);

  useEffect(() => {
    const el = tocItemRefs.current[activeSection];
    if (!el) return;
    setTocMarker({ top: el.offsetTop, height: el.offsetHeight });
  }, [activeSection, page.path]);

  const scrollToSection = (idx: number) => {
    const el = sectionRefs.current[idx];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const backTo = page.path.startsWith("/services/")
    ? { to: "/services", label: "Back to services" }
    : page.path.startsWith("/locations/")
      ? { to: "/locations", label: "All locations" }
      : page.path.startsWith("/insights/")
        ? { to: "/insights", label: "All guides" }
        : page.path.startsWith("/case-studies/")
          ? { to: "/case-studies", label: "All case studies" }
          : { to: "/services", label: "Our services" };

  const linkCard = (s: NavItem, i: number, compact = false) => (
    <Link
      key={s.path}
      to={s.path}
      className={`group block rounded-xl ${compact ? "p-3" : "p-4"} no-underline transition-all duration-300 detail-link-card`}
      style={{ background: "#ffffff", border: "1px solid rgba(10,21,48,0.08)", textDecoration: "none" }}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex-shrink-0 flex items-center justify-center ${compact ? "w-8 h-8 text-[10px]" : "w-9 h-9 text-[11px]"} rounded-md font-medium tabular-nums tracking-wider`}
          style={{ background: "rgba(50,95,236,0.08)", color: "#325FEC" }}
        >
          {pad(i + 1)}
        </span>
        <span className={`${compact ? "text-[13px]" : "text-[14px]"} leading-tight flex-1`} style={{ color: "rgba(10,21,48,0.78)" }}>
          {s.label}
          {!compact && s.blurb && (
            <span className="block text-[12.5px] mt-1" style={{ color: "rgba(10,21,48,0.5)" }}>
              {s.blurb}
            </span>
          )}
        </span>
        <span className="text-[14px] transition-all duration-300 group-hover:translate-x-0.5" style={{ color: "#325FEC" }}>
          →
        </span>
      </div>
    </Link>
  );

  return (
    <>
      {/* HERO */}
      <section
        className="relative pt-40 md:pt-48 pb-24 md:pb-32 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #050A18 0%, #0E1628 55%, #1a3392 130%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(80,140,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(80,140,255,0.35) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at 70% 20%, black 30%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at 70% 20%, black 30%, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(80,140,255,0.35) 0%, rgba(50,95,236,0) 70%)", filter: "blur(20px)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(50,95,236,0.25) 0%, rgba(50,95,236,0) 70%)", filter: "blur(30px)" }}
        />
        {number && (
          <div
            aria-hidden
            className="absolute top-4 right-2 md:-top-8 md:right-8 text-[160px] md:text-[260px] leading-none font-bold pointer-events-none select-none"
            style={{
              background: "linear-gradient(180deg, rgba(120,170,255,0.22) 0%, rgba(50,95,236,0) 85%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.04em",
            }}
          >
            {number}
          </div>
        )}

        <div className="container relative z-10">
          <FadeIn>
            <Link
              to={backTo.to}
              className="inline-flex items-center gap-2 text-blue-300/80 hover:text-blue-200 text-xs tracking-[0.25em] uppercase mb-8 transition-colors group"
            >
              <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
              {backTo.label}
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
            <div className="max-w-4xl">
              <FadeIn delay={0.05}>
                <div
                  className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full"
                  style={{ background: "rgba(80,140,255,0.08)", border: "1px solid rgba(80,140,255,0.25)", backdropFilter: "blur(8px)" }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                  </span>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-blue-200">
                    {isService && number ? `Service ${number} · ${page.eyebrow}` : page.eyebrow}
                  </span>
                </div>
              </FadeIn>

              <RisingText end="80%">
                <h1
                  className="font-medium"
                  style={{
                    fontSize: "clamp(32px, 3.6vw, 52px)",
                    lineHeight: 1.08,
                    display: "block",
                    marginBottom: "28px",
                    color: "#ffffff",
                    background: "none",
                    WebkitTextFillColor: "#ffffff",
                    WebkitBackgroundClip: "unset",
                    backgroundClip: "unset",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {page.h1}
                </h1>
              </RisingText>

              {page.intro && (
                <FadeIn delay={0.2}>
                  <p className="text-white/75 text-base md:text-[17px] leading-relaxed max-w-3xl">{page.intro}</p>
                </FadeIn>
              )}

              <FadeIn delay={0.25}>
                <div className="flex flex-wrap items-center gap-5 mt-9">
                  <MyButton text="BOOK A 15-MINUTE CALL" variant="primary" onClick={() => openCalendly()} />
                  <Link
                    to="/portfolio"
                    className="text-white/70 hover:text-white text-xs tracking-[0.25em] uppercase transition-colors group inline-flex items-center gap-2 no-underline"
                  >
                    See the work
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.25}>
              <div className="hidden lg:flex flex-col gap-4 min-w-[300px] max-w-[380px]">
                <div
                  className="rounded-2xl overflow-hidden h-[220px]"
                  style={{
                    background: "linear-gradient(135deg, rgba(80,140,255,0.08) 0%, rgba(50,95,236,0.04) 100%)",
                    border: "1px solid rgba(80,140,255,0.18)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {visualFor(page.path)}
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </section>

      {/* SECTIONS + STICKY SIDEBAR */}
      <section className="relative py-16 md:py-24 bg-white">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(10,21,48,1) 1px, transparent 1px), linear-gradient(90deg, rgba(10,21,48,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="container relative">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] lg:grid-cols-[1fr_260px] gap-12 md:gap-10 lg:gap-16">
            <div className="flex flex-col gap-14 md:gap-20 min-w-0">
              {sections.map((section, idx) => {
                const sectionId = section.id || slugifySection(section.h, idx);
                return (
                  <article
                    key={idx}
                    id={sectionId}
                    ref={(el) => {
                      sectionRefs.current[idx] = el;
                    }}
                    className="relative scroll-mt-24"
                  >
                    <FadeIn>
                      <div className="relative">
                        <div className="text-blue-500 text-[11px] tracking-[0.3em] mb-3 tabular-nums">{pad(idx + 1)}</div>
                        <h2
                          className="max-w-3xl"
                          style={{ fontSize: "clamp(24px, 2.3vw, 34px)", lineHeight: 1.18, fontWeight: 400, marginBottom: "16px", padding: 0, color: "#0A1530", WebkitTextFillColor: "#0A1530", background: "none", letterSpacing: "-0.01em" }}
                        >
                          {section.h}
                        </h2>
                        {(section.p || []).slice(0, 1).map((t, k) => (
                          <p key={k} className="text-base md:text-[17px] leading-relaxed max-w-3xl mb-4" style={{ color: "rgba(10,21,48,0.72)" }}>
                            {t}
                          </p>
                        ))}
                        {(section.p || []).length > 1 && (
                          <details className="detail-more max-w-3xl">
                            <summary>Read more</summary>
                            {(section.p || []).slice(1).map((t, k) => (
                              <p key={k} className="text-base md:text-[17px] leading-relaxed mb-4" style={{ color: "rgba(10,21,48,0.72)" }}>
                                {t}
                              </p>
                            ))}
                          </details>
                        )}
                        {section.list && section.list.length > 0 && (
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 mt-6 pl-0 list-none max-w-4xl">
                            {section.list.map((item, j) => {
                              const [main] = item.split("|");
                              const c = main.indexOf(": ");
                              return (
                                <li key={j} className="py-3.5 text-[15px] leading-relaxed" style={{ borderTop: "1px solid rgba(10,21,48,0.08)", color: "rgba(10,21,48,0.72)" }}>
                                  {c > 0 && c < 60 ? (
                                    <>
                                      <span style={{ color: "#0A1530", fontWeight: 500 }}>{main.slice(0, c)}</span>
                                      {": "}
                                      {main.slice(c + 2)}
                                    </>
                                  ) : (
                                    main
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </FadeIn>
                  </article>
                );
              })}

              {/* Link blocks (cities, services, industries) in the old cross-link card style */}
              {blocks.map((b) => (
                <FadeIn key={b.title}>
                  <div>
                    <h2
                      className="mb-5 max-w-3xl"
                      style={{ fontSize: "clamp(19px, 1.6vw, 24px)", lineHeight: 1.2, fontWeight: 400, color: "#0A1530", WebkitTextFillColor: "#0A1530", background: "none", letterSpacing: "-0.01em" }}
                    >
                      {b.title}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {b.items.map((s) => (
                        <Link key={s.path} to={s.path} className="detail-chip">
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Sticky sidebar */}
            <aside className="hidden md:block">
              <div className="sticky top-28 flex flex-col gap-10 services-detail-sidebar">
                {sections.length > 0 && (
                  <div>
                    <div className="text-blue-500 text-[10px] tracking-[0.3em] uppercase font-medium mb-5">On this page</div>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-black/10" />
                      <motion.div
                        className="absolute left-0 w-[2px] bg-blue-500"
                        initial={false}
                        animate={{ top: tocMarker.top, height: tocMarker.height || 40 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ borderRadius: 2 }}
                      />
                      <ul className="flex flex-col gap-0 pl-0 relative">
                        {sections.map((s, i) => {
                          const sectionId = s.id || slugifySection(s.h, i);
                          const isActive = activeSection === i;
                          return (
                            <li
                              key={i}
                              ref={(el) => {
                                tocItemRefs.current[i] = el;
                              }}
                            >
                              <a
                                href={`#${sectionId}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  scrollToSection(i);
                                }}
                                className="block w-full pl-5 py-2.5 no-underline transition-colors"
                                style={{ background: "transparent", textDecoration: "none" }}
                              >
                                <div
                                  className="text-[10px] tracking-[0.3em] uppercase mb-0.5 transition-colors"
                                  style={{ color: isActive ? "#325FEC" : "rgba(10,21,48,0.4)" }}
                                >
                                  {pad(i + 1)}
                                </div>
                                <div
                                  className="text-[13px] leading-tight transition-colors"
                                  style={{ color: isActive ? "#0A1530" : "rgba(10,21,48,0.6)", fontWeight: isActive ? 500 : 400 }}
                                >
                                  {s.h}
                                </div>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                )}
                {sideLinks.length > 0 && (
                  <div>
                    <div className="text-blue-500 text-[10px] tracking-[0.3em] uppercase font-medium mb-5">{sideTitle}</div>
                    <ul className="flex flex-col gap-2 max-h-[45vh] overflow-y-auto pr-1">
                      {sideLinks.map((s, i) => (
                        <li key={s.path}>{linkCard(s, i, true)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Cross-links on mobile (sidebar hidden) */}
      {sideLinks.length > 0 && (
        <section className="md:hidden bg-white pb-16">
          <div className="container">
            <FadeIn>
              <div className="text-blue-500 text-[10px] tracking-[0.3em] uppercase font-medium mb-5">{sideTitle}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{sideLinks.map((s, i) => linkCard(s, i))}</div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* FAQ, in the original services FAQ design */}
      {faqs.length > 0 && (
        <div className="bg-white detail-faq">
          <FaqSection items={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
        </div>
      )}

      {/* CTA BAND */}
      <section
        className="py-16 md:py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #050A18 0%, #0E1628 60%, #1a3392 130%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(80,140,255,0.25) 0%, rgba(50,95,236,0) 60%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(80,140,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(80,140,255,0.4) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)",
          }}
        />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <div
                className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full"
                style={{ background: "rgba(80,140,255,0.08)", border: "1px solid rgba(80,140,255,0.25)", backdropFilter: "blur(8px)" }}
              >
                <span className="text-[10px] tracking-[0.3em] uppercase text-blue-200">Ready to start?</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2
                className="text-3xl md:text-[48px] mb-6 leading-[1.1] font-medium"
                style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff", background: "none", letterSpacing: "-0.02em" }}
              >
                Let's build something
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg, #93b8ff 0%, #ffffff 50%, #93b8ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  worth remembering.
                </span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="text-white/70 text-base md:text-lg mb-10 max-w-2xl mx-auto">{CTA.text}</p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <MyButton text="BOOK A CALL" variant="primary" onClick={() => openCalendly()} />
                <Link
                  to="/services"
                  className="text-white/70 hover:text-white text-xs tracking-[0.25em] uppercase transition-colors group inline-flex items-center gap-2 no-underline"
                  style={{ textDecoration: "none" }}
                >
                  Browse all services
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailPage;
