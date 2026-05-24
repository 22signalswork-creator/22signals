/**
 * R&D Page — admin-driven version.
 *
 * Each card on this page is one row from `rd_research_pages` (the same
 * table the admin manages). Clicking a card goes to /r&d/<slug>, the
 * full detail page.
 *
 * Sections:
 *   1. Cinematic hero with watermark, search, and category tabs.
 *   2. Live impact stats (still hardcoded — these are headline KPIs,
 *      not individual research items).
 *   3. Pull quote.
 *   4. Research pipeline — admin-driven, filtered live by search + tab.
 *   5. Pre-CTA proof block (testimonials + featured projects).
 *   6. CTA.
 */
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import MyButton from "@/components/CustomButton";
import PreCtaSections from "@/components/PreCtaSections";
import { supabase } from "@/lib/supabase";

// ---------- DATA ----------

interface ResearchRow {
  slug: string;
  title: string;
  category: string | null;
  percent: number;
  card_text: string | null;
  sort_order: number;
}

interface Stat {
  kicker: string;
  value: number;
  suffix: string;
  label: string;
  /** Optional override label (e.g. "40-60%") shown after counter finishes */
  display?: string;
}

const STATS: Stat[] = [
  {
    kicker: "Work in Progress",
    value: 15,
    suffix: "+",
    label: "Active Beta Frameworks",
  },
  {
    kicker: "Effect on Speed",
    value: 60,
    suffix: "%",
    label: "Faster Prototyping",
  },
  {
    kicker: "Effect on Margins",
    value: 60,
    suffix: "%",
    label: "Optimized Cost Reductions",
    display: "40-60%",
  },
  {
    kicker: "Execution Standard",
    value: 100,
    suffix: "%",
    label: "Analytical Precision",
  },
];

// ---------- HELPERS ----------

/** Number that counts up from 0 to target when scrolled into view. */
const RollingNumber: React.FC<{
  target: number;
  suffix?: string;
  duration?: number;
  display?: string;
}> = ({ target, suffix = "", duration = 1800, display }) => {
  const [val, setVal] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = p * (2 - p);
      setVal(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
      else setDone(true);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return <span ref={ref}>{done && display ? display : `${val}${suffix}`}</span>;
};

// ---------- PAGE ----------

const RD: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<ResearchRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Force scroll-to-top on entry
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  // Pull from Supabase
  useEffect(() => {
    supabase
      .from("rd_research_pages")
      .select("slug, title, category, percent, card_text, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setRows((data ?? []) as ResearchRow[]);
        setLoading(false);
      });
  }, []);

  // Auto-derive tab list from whatever categories exist + "All"
  const tabs = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      if (r.category && r.category.trim()) set.add(r.category.trim());
    });
    return ["All", ...Array.from(set)];
  }, [rows]);

  // Filter projects by tab + search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((p) => {
      const tabOk = activeTab === "All" || (p.category ?? "") === activeTab;
      const queryOk =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.card_text ?? "").toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q);
      return tabOk && queryOk;
    });
  }, [rows, activeTab, search]);

  // Reusable inline style block to defeat the global h1/h2 gradient
  const plainHeading: React.CSSProperties = {
    color: "#ffffff",
    background: "none",
    WebkitTextFillColor: "#ffffff",
    WebkitBackgroundClip: "unset",
    backgroundClip: "unset",
  };
  const gradientHeading: React.CSSProperties = {
    background: "linear-gradient(91deg, #325FEC 0%, #FFFFFF 50%, #325FEC 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <>
      {/* ============================================== */}
      {/*  HERO                                          */}
      {/* ============================================== */}
      <section
        className="relative pt-28 md:pt-36 pb-20 md:pb-24 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #050A18 0%, #0E1628 55%, #1a3392 130%)",
        }}
      >
        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(80,140,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(80,140,255,0.35) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)",
          }}
        />
        {/* Glow orbs */}
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(80,140,255,0.32) 0%, rgba(50,95,236,0) 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(50,95,236,0.22) 0%, rgba(50,95,236,0) 70%)",
            filter: "blur(40px)",
          }}
        />
        {/* Watermark "R&D" */}
        <div
          className="absolute top-8 right-4 md:top-0 md:-right-4 text-[180px] md:text-[300px] leading-none font-bold pointer-events-none select-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(120,170,255,0.16) 0%, rgba(50,95,236,0) 85%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.04em",
          }}
        >
          R&D
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <div className="flex justify-center mb-7">
              <div
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full"
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
                <span className="text-[10px] tracking-[0.35em] uppercase text-blue-200">
                  Research Division · Active
                </span>
              </div>
            </div>
          </FadeIn>

          <div className="text-center">
            <RisingText>
              <h1
                className="font-bold leading-[1.1] tracking-tight"
                style={{
                  ...gradientHeading,
                  fontSize: "clamp(40px, 5vw, 68px)",
                  letterSpacing: "-0.025em",
                }}
              >
                The Pulse of Innovation.
              </h1>
            </RisingText>
          </div>

          <FadeIn delay={0.15}>
            <p
              className="text-center text-white/75 leading-relaxed mt-6 mx-auto max-w-2xl"
              style={{ fontSize: "clamp(15px, 1.15vw, 18px)" }}
            >
              Strategic perspectives on AI architecture, marketing, and the
              future of scalable business operations.
            </p>
          </FadeIn>

          {/* Search input */}
          <FadeIn delay={0.2}>
            <div className="mt-10 flex justify-center">
              <div className="relative w-full max-w-2xl">
                <svg
                  className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(120,170,255,0.7)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search insights, case studies, and industry trends…"
                  className="w-full pl-12 pr-5 py-4 rounded-full text-white placeholder:text-white/40 focus:outline-none transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(80,140,255,0.25)",
                    backdropFilter: "blur(8px)",
                  }}
                />
              </div>
            </div>
          </FadeIn>

          {/* Tabs (auto-derived from DB) */}
          {tabs.length > 1 && (
            <FadeIn delay={0.25}>
              <div className="mt-8 flex justify-center">
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                      <a
                        key={tab}
                        href="#pipeline"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTab(tab);
                        }}
                        className="px-4 py-2 rounded-full text-xs tracking-[0.15em] uppercase transition-all no-underline"
                        style={{
                          background: isActive
                            ? "rgba(50,95,236,0.85)"
                            : "rgba(255,255,255,0.04)",
                          color: isActive ? "#ffffff" : "rgba(255,255,255,0.65)",
                          border: isActive
                            ? "1px solid rgba(80,140,255,0.5)"
                            : "1px solid rgba(255,255,255,0.1)",
                          textDecoration: "none",
                        }}
                      >
                        {tab}
                      </a>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ============================================== */}
      {/*  RESEARCH PIPELINE — admin-driven, link to detail */}
      {/* ============================================== */}
      <section
        id="pipeline"
        className="bg-[#000202] py-20 md:py-28 relative overflow-hidden scroll-mt-20"
      >
        <div className="container relative z-10">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 mb-14 items-end">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[2px] w-10 rounded-full bg-blue-400" />
                  <span className="text-blue-300 text-[10px] tracking-[0.35em] uppercase font-medium">
                    Section 01 · Pipeline
                  </span>
                </div>
                <h2
                  className="leading-[1.05]"
                  style={{
                    ...plainHeading,
                    fontSize: "clamp(32px, 4vw, 56px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Research Pipeline.
                </h2>
              </div>
              <p className="text-white/60 text-base md:text-lg max-w-xl md:ml-auto">
                You never get another chance to make a good first impression. At
                22 Signals, we use a complete spectrum of disciplines to research,
                build, and ship the future.
              </p>
            </div>
          </FadeIn>

          {/* Result count */}
          <FadeIn>
            <div className="flex items-center justify-between mb-6 text-xs text-white/45 tracking-wider">
              <span>
                Showing {filtered.length} of {rows.length}{" "}
                {filtered.length === 1 ? "project" : "projects"}
                {activeTab !== "All" && (
                  <span className="ml-2 text-blue-300/80">· {activeTab}</span>
                )}
                {search && (
                  <span className="ml-2 text-blue-300/80">· "{search}"</span>
                )}
              </span>
              {(activeTab !== "All" || search) && (
                <a
                  href="#pipeline"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("All");
                    setSearch("");
                  }}
                  className="text-blue-300 hover:text-blue-200 transition-colors no-underline"
                  style={{ textDecoration: "none" }}
                >
                  Reset filters →
                </a>
              )}
            </div>
          </FadeIn>

          {/* Cards */}
          {loading ? (
            <p className="text-white/40 text-sm py-12 text-center">Loading research…</p>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((p, i) => (
                <Link
                  key={p.slug}
                  to={`/r&d/${p.slug}`}
                  className="block no-underline"
                  style={{ textDecoration: "none" }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl p-6 md:p-7 relative overflow-hidden transition-shadow duration-300 group h-full"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(50,95,236,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                      border: "1px solid rgba(80,140,255,0.18)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-[10px] tracking-[0.25em] uppercase px-3 py-1 rounded-full"
                        style={{
                          background: "rgba(80,140,255,0.1)",
                          border: "1px solid rgba(80,140,255,0.25)",
                          color: "rgba(147,184,255,0.95)",
                        }}
                      >
                        {p.category ?? "Research"}
                      </span>
                      <span
                        className="text-2xl font-light tabular-nums"
                        style={{
                          background:
                            "linear-gradient(91deg, #325FEC 0%, #FFFFFF 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {p.percent}%
                      </span>
                    </div>

                    <h3
                      className="text-xl md:text-2xl mb-2 leading-tight"
                      style={{
                        ...plainHeading,
                        fontSize: "clamp(20px, 1.7vw, 26px)",
                      }}
                    >
                      {p.title}
                    </h3>

                    {p.card_text && (
                      <p className="text-white/55 text-sm leading-relaxed mb-5">
                        {p.card_text}
                      </p>
                    )}

                    {/* Progress bar */}
                    <div
                      className="w-full h-2 rounded-full overflow-hidden mb-4"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${p.percent}%` }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{
                          background:
                            "linear-gradient(90deg, #325FEC 0%, #6B92FF 100%)",
                          boxShadow: "0 0 12px rgba(80,140,255,0.6)",
                        }}
                      />
                    </div>

                    <div className="inline-flex items-center gap-2 text-blue-300 text-xs tracking-[0.2em] uppercase">
                      Read more
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div
              className="rounded-2xl border border-dashed py-16 px-6 text-center"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              <p className="text-white/50 text-sm">
                No research projects match your filters.
              </p>
              <a
                href="#pipeline"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("All");
                  setSearch("");
                }}
                className="text-blue-300 hover:text-blue-200 text-xs tracking-wider mt-3 inline-block no-underline"
                style={{ textDecoration: "none" }}
              >
                Reset filters →
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ============================================== */}
      {/*  IMPACT STATS                                  */}
      {/* ============================================== */}
      <section className="bg-[#000202] py-20 md:py-28 relative overflow-hidden section-fade-from-black">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(80,140,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(80,140,255,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="container relative z-10">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 mb-14 items-end">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[2px] w-10 rounded-full bg-blue-400" />
                  <span className="text-blue-300 text-[10px] tracking-[0.35em] uppercase font-medium">
                    Section 02 · Impact
                  </span>
                </div>
                <h2
                  className="leading-[1.05]"
                  style={{
                    ...plainHeading,
                    fontSize: "clamp(32px, 4vw, 56px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Active R&D Impact.
                </h2>
              </div>
              <p className="text-white/60 text-base md:text-lg max-w-xl md:ml-auto">
                We do not wait for the future; we engineer it. Our research
                division continuously develops, tests, and optimizes proprietary
                backend systems.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS.map((s, i) => (
              <FadeIn key={s.kicker} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="rounded-2xl p-7 h-full flex flex-col justify-between min-h-[220px] relative overflow-hidden transition-shadow duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(50,95,236,0.10) 0%, rgba(255,255,255,0.02) 100%)",
                    border: "1px solid rgba(80,140,255,0.2)",
                  }}
                >
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(80,140,255,0.25) 0%, transparent 70%)",
                      filter: "blur(20px)",
                    }}
                  />

                  <div className="relative z-10 text-blue-300/80 text-[10px] tracking-[0.3em] uppercase font-medium">
                    {s.kicker}
                  </div>
                  <div className="relative z-10">
                    <div
                      className="text-5xl md:text-6xl font-light leading-none"
                      style={{
                        background:
                          "linear-gradient(91deg, #325FEC 0%, #FFFFFF 50%, #325FEC 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      <RollingNumber
                        target={s.value}
                        suffix={s.suffix}
                        display={s.display}
                      />
                    </div>
                    <p className="text-white/65 text-sm mt-4">{s.label}</p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================== */}
      {/*  PULL QUOTE                                    */}
      {/* ============================================== */}
      <section className="bg-[#000202] py-16 md:py-20 relative overflow-hidden">
        <div className="container max-w-4xl mx-auto text-center px-4">
          <FadeIn>
            <div
              className="text-[140px] md:text-[200px] leading-none font-serif select-none mb-[-40px] md:mb-[-60px]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(80,140,255,0.6) 0%, rgba(80,140,255,0) 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              "
            </div>
            <blockquote
              className="italic font-light leading-[1.2] text-white"
              style={{
                fontSize: "clamp(22px, 2.5vw, 36px)",
                letterSpacing: "-0.01em",
              }}
            >
              We do not wait for the future. We engineer it.
            </blockquote>
            <div className="mt-7 flex items-center justify-center gap-3">
              <div className="h-[1px] w-12 bg-blue-300/60" />
              <span className="text-blue-200/80 text-[10px] tracking-[0.35em] uppercase">
                The 22 Signals Manifesto
              </span>
              <div className="h-[1px] w-12 bg-blue-300/60" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================== */}
      {/*  PRE-CTA — Testimonials + Featured Projects     */}
      {/* ============================================== */}
      <PreCtaSections />

      {/* ============================================== */}
      {/*  CTA                                            */}
      {/* ============================================== */}
      <section
        className="py-20 md:py-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #050A18 0%, #0E1628 60%, #1a3392 130%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(80,140,255,0.25) 0%, rgba(50,95,236,0) 60%)",
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
                  Have a research challenge?
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2
                className="leading-[1.1] mb-6"
                style={{
                  ...plainHeading,
                  fontSize: "clamp(32px, 4vw, 48px)",
                  letterSpacing: "-0.02em",
                }}
              >
                Let's build the next{" "}
                <span style={gradientHeading}>breakthrough.</span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="text-white/70 text-base md:text-lg mb-10 max-w-2xl mx-auto">
                If you're working on something the rest of the industry hasn't
                figured out yet, we'd love to hear about it.
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
                  to="/blog"
                  className="text-white/70 hover:text-white text-xs tracking-[0.25em] uppercase transition-colors group inline-flex items-center gap-2 no-underline"
                  style={{ textDecoration: "none" }}
                >
                  Read our insights
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

export default RD;
