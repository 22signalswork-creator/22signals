/**
 * ServiceDetailPage — public page at /services/:slug
 *
 * Premium redesign with all changes merged:
 *   - Cinematic hero with animated grid + glow + gradient watermark
 *   - Sticky sidebar: section TOC + other-services cross-links
 *   - Capability cards (replaces plain bullets)
 *   - Stats band + premium CTA
 *
 * Renders one row from `service_detail_pages`:
 *   { number, title, tagline, intro, sections: [{title, intro?, items[]}] }
 *
 * Note: Sidebar uses <a href="#anchor"> and <Link> instead of <button>
 * because index.css line 414 has a global `button { background-color: ... }`
 * rule that turns every button into a blue pill.
 */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import MyButton from "@/components/CustomButton";
import {
  VisualDigital,
  VisualCreative,
  VisualBroadcast,
  VisualManufacturing,
  VisualOutsourcing,
  VisualGame,
} from "./components/service-visuals";

// Map every service slug to a branded right-side visual so the imagery
// from the old "Refined Execution" section is preserved inside each
// individual service page.
const SLUG_VISUAL_MAP: Record<string, React.ReactNode> = {
  "digital-solutions": <VisualDigital />,
  "data-ai": <VisualDigital />,
  "cloud-solutions": <VisualDigital />,
  "creative-solutions": <VisualCreative />,
  "broadcasting-events": <VisualBroadcast />,
  "broadcasting-esports": <VisualBroadcast />,
  "global-manufacturing": <VisualManufacturing />,
  "managed-services": <VisualOutsourcing />,
  "game-development": <VisualGame />,
};

interface Section {
  title: string;
  intro?: string | null;
  items: string[];
}

interface ServiceDetailRow {
  id: string;
  slug: string;
  number: string;
  title: string;
  tagline: string;
  intro: string;
  sections: Section[] | string;
  is_active: boolean;
}

interface OtherService {
  slug: string;
  number: string;
  title: string;
}

const parseSections = (s: Section[] | string | null | undefined): Section[] => {
  if (!s) return [];
  if (Array.isArray(s)) return s;
  try {
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? (parsed as Section[]) : [];
  } catch {
    return [];
  }
};

const slugifySection = (title: string, idx: number) =>
  `section-${idx}-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40)}`;

const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ServiceDetailRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const tocItemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [tocMarker, setTocMarker] = useState({ top: 0, height: 0 });
  const [otherServices, setOtherServices] = useState<OtherService[]>([]);

// ----- Force instant scroll-to-top on slug change -----
// Overrides the global `html { scroll-behavior: smooth }` from index.css
// so navigating between /services/x and /services/y opens at the top,
// not mid-page.
useLayoutEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
}, [slug]);

// ----- Fetch current service -----
useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    supabase
      .from("service_detail_pages")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setData(data as ServiceDetailRow);
        }
        setLoading(false);
      });
  }, [slug]);

  // ----- Fetch OTHER services for cross-linking in the sidebar -----
  useEffect(() => {
    if (!slug) return;
    supabase
      .from("service_detail_pages")
      .select("slug, number, title, sort_order")
      .eq("is_active", true)
      .neq("slug", slug)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) {
          setOtherServices(data as OtherService[]);
        }
      });
  }, [slug]);

  // ----- Derived: parsed sections (memoised so the deps below are stable) -----
  // Declared BEFORE the effects so they can safely reference `sections`.
  const sections = data ? parseSections(data.sections) : [];
  const totalCapabilities = sections.reduce(
    (acc, s) => acc + (s.items?.length ?? 0),
    0
  );

  // ----- Active section tracking for sticky nav -----
  // We run TWO trackers in parallel because either one alone can miss
  // edge cases:
  //   1. IntersectionObserver — fires the moment a section enters a
  //      narrow horizontal band near the top of the viewport. Best for
  //      "which section is the user reading right now".
  //   2. Scroll handler fallback — picks the last section whose top has
  //      crossed a 160-px trigger line. Used when IO didn't fire (e.g.
  //      programmatic scroll, anchor jumps, fast scrolls past short
  //      sections).
  useEffect(() => {
    if (!data) return;
    if (sections.length === 0) return;

    // ---- 1) IntersectionObserver ----
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection((prev) => (prev === i ? prev : i));
            }
          });
        },
        {
          // Band: top 18% of viewport down to 35% — the spot the eye
          // typically focuses on while reading.
          rootMargin: "-18% 0px -65% 0px",
          threshold: 0,
        }
      );
      obs.observe(el);
      observers.push(obs);
    });

    // ---- 2) Scroll handler fallback ----
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
    // Initial measurement after layout settles
    const t1 = window.setTimeout(handler, 80);
    const t2 = window.setTimeout(handler, 300);

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, sections.length]);

  // ----- Recalculate marker position whenever the active section changes -----
  useEffect(() => {
    const el = tocItemRefs.current[activeSection];
    if (!el) return;
    // Position relative to the parent container that the marker is absolutely
    // positioned inside (the <ul>).
    setTocMarker({ top: el.offsetTop, height: el.offsetHeight });
  }, [activeSection, data]);

  const scrollToSection = (idx: number) => {
    const el = sectionRefs.current[idx];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // ----- Loading -----
  if (loading) {
    return (
      <section className="container py-32 min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-blue-500/70 tracking-[0.3em] uppercase text-xs">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Loading
        </div>
      </section>
    );
  }

  // ----- Not found -----
  if (notFound || !data) {
    return (
      <section className="container py-32 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="text-black/50 text-xs uppercase tracking-[0.3em] mb-3">
          Not found
        </div>
        <h1 className="text-3xl md:text-5xl text-black mb-4">
          This service doesn't exist.
        </h1>
        <p className="text-black/60 mb-8 max-w-md">
          The page you're looking for may have moved or been removed.
        </p>
        <button
          onClick={() => navigate("/services")}
          className="rounded-lg bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 text-sm font-medium transition-colors"
        >
          ← Back to all services
        </button>
      </section>
    );
  }

  return (
    <>
      {/* ============================================== */}
      {/* HERO                                           */}
      {/* ============================================== */}
      <section
        className="relative pt-28 md:pt-36 pb-24 md:pb-32 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #050A18 0%, #0E1628 55%, #1a3392 130%)",
        }}
      >
        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(80,140,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(80,140,255,0.35) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at 70% 20%, black 30%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 70% 20%, black 30%, transparent 70%)",
          }}
        />

        {/* Glow orb top-right */}
        <div
          className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(80,140,255,0.35) 0%, rgba(50,95,236,0) 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* Glow orb bottom-left */}
        <div
          className="absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(50,95,236,0.25) 0%, rgba(50,95,236,0) 70%)",
            filter: "blur(30px)",
          }}
        />

        {/* Big gradient watermark number */}
        <div
          className="absolute top-4 right-2 md:-top-8 md:right-8 text-[200px] md:text-[340px] leading-none font-bold pointer-events-none select-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(120,170,255,0.22) 0%, rgba(50,95,236,0) 85%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.04em",
          }}
        >
          {data.number}
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-blue-300/80 hover:text-blue-200 text-xs tracking-[0.25em] uppercase mb-8 transition-colors group"
            >
              <span className="inline-block transition-transform group-hover:-translate-x-1">
                ←
              </span>
              Back to services
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
            <div className="max-w-4xl">
              <FadeIn delay={0.05}>
                <div
                  className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full"
                  style={{
                    background: "rgba(80,140,255,0.08)",
                    border: "1px solid rgba(80,140,255,0.25)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                  </span>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-blue-200">
                    Pillar {data.number} · Service
                  </span>
                </div>
              </FadeIn>

              <RisingText end="80%">
                <h1
                  className="text-4xl md:text-[72px] leading-[1.02] mb-6 font-medium"
                  style={{
                    color: "#ffffff",
                    background: "none",
                    WebkitTextFillColor: "#ffffff",
                    WebkitBackgroundClip: "unset",
                    backgroundClip: "unset",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {data.title}
                </h1>
              </RisingText>

              {data.tagline && (
                <FadeIn delay={0.15}>
                  <p
                    className="italic text-lg md:text-2xl max-w-3xl mb-8 leading-snug"
                    style={{
                      background:
                        "linear-gradient(90deg, #ffffff 0%, #93b8ff 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {data.tagline}
                  </p>
                </FadeIn>
              )}

              {data.intro && (
                <FadeIn delay={0.2}>
                  <p className="text-white/75 text-base md:text-[17px] leading-relaxed max-w-3xl">
                    {data.intro}
                  </p>
                </FadeIn>
              )}
            </div>

            {/* Hero visual + compact stats */}
            <FadeIn delay={0.25}>
              <div className="hidden lg:flex flex-col gap-4 min-w-[300px] max-w-[380px]">
                {/* Branded visual — same imagery that used to live in the
                    old "Refined Execution" section */}
                <div
                  className="rounded-2xl overflow-hidden h-[220px]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(80,140,255,0.08) 0%, rgba(50,95,236,0.04) 100%)",
                    border: "1px solid rgba(80,140,255,0.18)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {(slug && SLUG_VISUAL_MAP[slug]) || <VisualDigital />}
                </div>

                {/* Compact stats card */}
                <div
                  className="flex flex-col gap-4 p-6 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(80,140,255,0.18)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div className="flex items-baseline justify-between gap-6 pb-3 border-b border-white/10">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-blue-300/80">
                      Sections
                    </span>
                    <span className="text-2xl text-white font-medium tabular-nums">
                      {String(sections.length).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 pb-3 border-b border-white/10">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-blue-300/80">
                      Capabilities
                    </span>
                    <span className="text-2xl text-white font-medium tabular-nums">
                      {String(totalCapabilities).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-blue-300/80">
                      Pillar
                    </span>
                    <span className="text-2xl text-white font-medium tabular-nums">
                      {data.number}
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Scroll indicator */}
          <FadeIn delay={0.4}>
            <div className="flex items-center gap-3 mt-16 md:mt-20">
              <div className="h-[1px] w-12 bg-blue-300/40" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-blue-300/60">
                Scroll to explore
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.6,
                  ease: "easeInOut",
                }}
                className="text-blue-300/60"
              >
                ↓
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================== */}
      {/* SECTIONS BLOCK + STICKY SIDEBAR                */}
      {/* ============================================== */}
      <section className="relative py-20 md:py-28 bg-white">
        {/* Subtle background grain */}
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
            {/* ----- Sections column ----- */}
            <div className="flex flex-col gap-20 md:gap-28">
              {sections.map((section, idx) => {
                const sectionId = slugifySection(section.title, idx);
                return (
                  <article
                    key={idx}
                    id={sectionId}
                    ref={(el) => {
                      sectionRefs.current[idx] = el;
                    }}
                    className="relative scroll-mt-24"
                  >
                    {/* Floating big section number */}
                    <div
                      className="absolute -top-10 md:-top-16 -left-2 md:-left-6 text-[120px] md:text-[200px] leading-none font-bold pointer-events-none select-none"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(50,95,236,0.10) 0%, rgba(50,95,236,0) 85%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "-0.05em",
                      }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </div>

                    <FadeIn>
                      <div className="relative">
                        {/* Eyebrow with line */}
                        <div className="flex items-center gap-3 mb-5">
                          <div className="h-[2px] w-10 rounded-full bg-blue-500" />
                          <span className="text-blue-500 text-[10px] tracking-[0.3em] uppercase font-medium">
                            Section {String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>

                        {/* Title */}
                        <h2
                          className="text-3xl md:text-[44px] leading-[1.1] mb-5 max-w-3xl"
                          style={{
                            color: "#0A1530",
                            WebkitTextFillColor: "#0A1530",
                            background: "none",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {section.title}
                        </h2>

                        {/* Optional intro */}
                        {section.intro && (
                          <p className="text-black/65 text-base md:text-[17px] leading-relaxed max-w-3xl mb-10">
                            {section.intro}
                          </p>
                        )}

                        {/* Capability cards grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                          {section.items.map((item, j) => (
                            <motion.div
                              key={j}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, amount: 0.2 }}
                              transition={{
                                duration: 0.5,
                                delay: j * 0.05,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              whileHover={{ y: -4 }}
                              className="group relative p-5 md:p-6 rounded-2xl transition-all duration-300 cursor-default"
                              style={{
                                background: "#ffffff",
                                border: "1px solid rgba(10,21,48,0.08)",
                                boxShadow: "0 1px 0 rgba(10,21,48,0.02)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor =
                                  "rgba(50,95,236,0.35)";
                                e.currentTarget.style.boxShadow =
                                  "0 20px 40px -20px rgba(50,95,236,0.25)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor =
                                  "rgba(10,21,48,0.08)";
                                e.currentTarget.style.boxShadow =
                                  "0 1px 0 rgba(10,21,48,0.02)";
                              }}
                            >
                              {/* Left gradient accent bar (visible on hover) */}
                              <div
                                className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{
                                  background:
                                    "linear-gradient(180deg, #325FEC 0%, #93b8ff 100%)",
                                }}
                              />

                              <div className="flex items-start gap-4">
                                {/* Number badge */}
                                <div
                                  className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg text-[11px] font-medium tabular-nums tracking-wider transition-colors duration-300"
                                  style={{
                                    background: "rgba(50,95,236,0.08)",
                                    color: "#325FEC",
                                  }}
                                >
                                  {String(j + 1).padStart(2, "0")}
                                </div>

                                <p
                                  className="text-[15px] md:text-[15.5px] leading-relaxed flex-1"
                                  style={{ color: "rgba(10,21,48,0.82)" }}
                                >
                                  {item}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </FadeIn>
                  </article>
                );
              })}
            </div>

            {/* ----- Sticky sidebar: TOC + other services (md+ screens) ----- */}
            <aside className="hidden md:block">
              <div className="sticky top-28 flex flex-col gap-10 services-detail-sidebar">
                {/* On this page */}
                <div>
                  <div className="text-blue-500 text-[10px] tracking-[0.3em] uppercase font-medium mb-5">
                    On this page
                  </div>
                  <div className="relative">
                    {/* Track */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-black/10" />
                    {/* Animated active marker — physically moves to the
                        active item's measured Y position so it visually
                        tracks the section the user is reading. */}
                    <motion.div
                      className="absolute left-0 w-[2px] bg-blue-500"
                      initial={false}
                      animate={{
                        top: tocMarker.top,
                        height: tocMarker.height || 40,
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ borderRadius: 2 }}
                    />
                    <ul className="flex flex-col gap-0 pl-0 relative">
                      {sections.map((s, i) => {
                        const sectionId = slugifySection(s.title, i);
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
                              style={{
                                background: "transparent",
                                textDecoration: "none",
                              }}
                            >
                              <div
                                className="text-[10px] tracking-[0.3em] uppercase mb-0.5 transition-colors"
                                style={{
                                  color: isActive
                                    ? "#325FEC"
                                    : "rgba(10,21,48,0.4)",
                                }}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </div>
                              <div
                                className="text-[13px] leading-tight transition-colors"
                                style={{
                                  color: isActive
                                    ? "#0A1530"
                                    : "rgba(10,21,48,0.6)",
                                  fontWeight: isActive ? 500 : 400,
                                }}
                              >
                                {s.title}
                              </div>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Other services cross-links */}
                {otherServices.length > 0 && (
                  <div>
                    <div className="text-blue-500 text-[10px] tracking-[0.3em] uppercase font-medium mb-5">
                      Other services
                    </div>
                    <ul className="flex flex-col gap-2">
                      {otherServices.map((s) => (
                        <li key={s.slug}>
                          <Link
                            to={`/services/${s.slug}`}
                            className="group block rounded-xl p-3 no-underline transition-all duration-300"
                            style={{
                              background: "#ffffff",
                              border: "1px solid rgba(10,21,48,0.08)",
                              textDecoration: "none",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor =
                                "rgba(50,95,236,0.35)";
                              e.currentTarget.style.boxShadow =
                                "0 10px 24px -16px rgba(50,95,236,0.35)";
                              e.currentTarget.style.transform =
                                "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor =
                                "rgba(10,21,48,0.08)";
                              e.currentTarget.style.boxShadow = "none";
                              e.currentTarget.style.transform = "translateY(0)";
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-md text-[10px] font-medium tabular-nums tracking-wider"
                                style={{
                                  background: "rgba(50,95,236,0.08)",
                                  color: "#325FEC",
                                }}
                              >
                                {s.number}
                              </span>
                              <span
                                className="text-[13px] leading-tight transition-colors flex-1"
                                style={{ color: "rgba(10,21,48,0.75)" }}
                              >
                                {s.title}
                              </span>
                              <span
                                className="text-[14px] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5"
                                style={{ color: "#325FEC" }}
                              >
                                →
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ============================================== */}
      {/* OTHER SERVICES — Mobile / tablet only          */}
      {/* (sidebar is hidden below lg, so show inline)   */}
      {/* ============================================== */}
      {otherServices.length > 0 && (
        <section className="md:hidden bg-white pb-16 md:pb-20">
          <div className="container">
            <FadeIn>
              <div className="text-blue-500 text-[10px] tracking-[0.3em] uppercase font-medium mb-5">
                Other services
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherServices.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/services/${s.slug}`}
                    className="group block rounded-xl p-4 no-underline transition-all duration-300"
                    style={{
                      background: "#ffffff",
                      border: "1px solid rgba(10,21,48,0.08)",
                      textDecoration: "none",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-md text-[11px] font-medium tabular-nums tracking-wider"
                        style={{
                          background: "rgba(50,95,236,0.08)",
                          color: "#325FEC",
                        }}
                      >
                        {s.number}
                      </span>
                      <span
                        className="text-[14px] leading-tight flex-1"
                        style={{ color: "rgba(10,21,48,0.8)" }}
                      >
                        {s.title}
                      </span>
                      <span style={{ color: "#325FEC" }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ============================================== */}
      {/* STATS BAND                                     */}
      {/* ============================================== */}
      <section
        className="py-16 md:py-20 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f5f7fb 100%)",
          borderTop: "1px solid rgba(10,21,48,0.06)",
          borderBottom: "1px solid rgba(10,21,48,0.06)",
        }}
      >
        <div className="container">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div>
                <div
                  className="text-5xl md:text-6xl font-medium mb-2 tabular-nums"
                  style={{ color: "#325FEC", letterSpacing: "-0.02em" }}
                >
                  {data.number}
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-black/50">
                  Pillar
                </div>
              </div>
              <div>
                <div
                  className="text-5xl md:text-6xl font-medium mb-2 tabular-nums"
                  style={{ color: "#0A1530", letterSpacing: "-0.02em" }}
                >
                  {String(sections.length).padStart(2, "0")}
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-black/50">
                  Service Sections
                </div>
              </div>
              <div>
                <div
                  className="text-5xl md:text-6xl font-medium mb-2 tabular-nums"
                  style={{ color: "#0A1530", letterSpacing: "-0.02em" }}
                >
                  {String(totalCapabilities).padStart(2, "0")}+
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-black/50">
                  Capabilities
                </div>
              </div>
              <div>
                <div
                  className="text-5xl md:text-6xl font-medium mb-2"
                  style={{ color: "#0A1530", letterSpacing: "-0.02em" }}
                >
                  ∞
                </div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-black/50">
                  Combined With Other Pillars
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================== */}
      {/* CTA BAND                                       */}
      {/* ============================================== */}
      <section
        className="py-20 md:py-28 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #050A18 0%, #0E1628 60%, #1a3392 130%)",
        }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(80,140,255,0.25) 0%, rgba(50,95,236,0) 60%)",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(80,140,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(80,140,255,0.4) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)",
          }}
        />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <div
                className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full"
                style={{
                  background: "rgba(80,140,255,0.08)",
                  border: "1px solid rgba(80,140,255,0.25)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="text-[10px] tracking-[0.3em] uppercase text-blue-200">
                  Ready to start?
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2
                className="text-3xl md:text-[48px] mb-6 leading-[1.1] font-medium"
                style={{
                  color: "#ffffff",
                  WebkitTextFillColor: "#ffffff",
                  background: "none",
                  letterSpacing: "-0.02em",
                }}
              >
                Let's build something
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #93b8ff 0%, #ffffff 50%, #93b8ff 100%)",
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
              <p className="text-white/70 text-base md:text-lg mb-10 max-w-2xl mx-auto">
                Engaging us for{" "}
                <span className="text-white font-medium">{data.title}</span>{" "}
                also unlocks instant access to our full suite of services —
                one team, one engagement, every capability.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <MyButton
                  text="GET IN TOUCH"
                  variant="primary"
                  onClick={() => navigate("/contact")}
                />
                <Link
                  to="/services"
                  className="text-white/70 hover:text-white text-xs tracking-[0.25em] uppercase transition-colors group inline-flex items-center gap-2 no-underline"
                  style={{ textDecoration: "none" }}
                >
                  Browse all services
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetailPage;
