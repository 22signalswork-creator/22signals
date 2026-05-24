/**
 * ProjectDetailPage — public page at /portfolio/:slug
 *
 * Premium case-study layout. Renders one row from `project_detail_pages`:
 *   { client_name, card_text, category, cover_image, tagline, intro,
 *     sections: [{title, body}], mockups: string[], live_url, year }
 *
 * Layout:
 *  1. Cinematic hero (cover image + meta strip + intro)
 *  2. Mockups gallery (ONLY rendered if at least 1 image exists)
 *  3. Case-study sections (title + prose paragraphs)
 *  4. Sticky sidebar: section TOC + other projects
 *  5. CTA band
 *
 * Note: sidebar uses <a href="#anchor"> and <Link> instead of <button>
 * because index.css line 414 has a global `button { background-color: ... }`
 * that turns every button into a blue pill.
 */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import MyButton from "@/components/CustomButton";

interface Section {
  title: string;
  body: string;
}

interface ProjectDetailRow {
  id: string;
  slug: string;
  client_name: string;
  card_text: string | null;
  category: string | null;
  cover_image: string | null;
  tagline: string | null;
  intro: string;
  sections: Section[] | string;
  mockups: string[] | string | null;
  live_url: string | null;
  year: string | null;
  is_active: boolean;
  sort_order: number;
}

interface OtherProject {
  slug: string;
  client_name: string;
  category: string | null;
  cover_image: string | null;
}

const parseJsonArray = <T,>(s: unknown): T[] => {
  if (Array.isArray(s)) return s as T[];
  if (typeof s === "string") {
    try {
      const x = JSON.parse(s);
      return Array.isArray(x) ? (x as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
};

const slugifySection = (title: string, idx: number) =>
  `section-${idx}-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40)}`;

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ProjectDetailRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [otherProjects, setOtherProjects] = useState<OtherProject[]>([]);

  // ----- Force scroll to top on slug change (overrides global smooth scroll) -----
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  // ----- Fetch current project -----
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    supabase
      .from("project_detail_pages")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setData(data as ProjectDetailRow);
        }
        setLoading(false);
      });
  }, [slug]);

  // ----- Fetch other projects for cross-linking -----
  useEffect(() => {
    if (!slug) return;
    supabase
      .from("project_detail_pages")
      .select("slug, client_name, category, cover_image, sort_order")
      .eq("is_active", true)
      .neq("slug", slug)
      .order("sort_order", { ascending: true })
      .limit(6)
      .then(({ data }) => {
        if (data) setOtherProjects(data as OtherProject[]);
      });
  }, [slug]);

  // ----- Active section tracking -----
  useEffect(() => {
    if (!data) return;
    const handler = () => {
      const fromTop = window.scrollY + 220;
      let current = 0;
      sectionRefs.current.forEach((el, i) => {
        if (el && el.offsetTop <= fromTop) current = i;
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [data]);

  const scrollToSection = (idx: number) => {
    const el = sectionRefs.current[idx];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // ---- Loading ----
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

  // ---- Not found ----
  if (notFound || !data) {
    return (
      <section className="container py-32 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="text-black/50 text-xs uppercase tracking-[0.3em] mb-3">
          Not found
        </div>
        <h1 className="text-3xl md:text-5xl text-black mb-4">
          This project doesn't exist.
        </h1>
        <p className="text-black/60 mb-8 max-w-md">
          The page you're looking for may have moved or been removed.
        </p>
        <button
          onClick={() => navigate("/portfolio")}
          className="rounded-lg bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 text-sm font-medium transition-colors"
        >
          ← Back to portfolio
        </button>
      </section>
    );
  }

  const sections = parseJsonArray<Section>(data.sections);
  const mockups = parseJsonArray<string>(data.mockups).filter(
    (m) => typeof m === "string" && m.trim().length > 0
  );
  const hasCover = !!data.cover_image && data.cover_image.trim().length > 0;
  const hasMockups = mockups.length > 0;

  return (
    <>
      {/* ============================================== */}
      {/* HERO                                           */}
      {/* ============================================== */}
      <section
        className="relative pt-28 md:pt-36 pb-20 md:pb-24 overflow-hidden"
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
        {/* Glow orbs */}
        <div
          className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(80,140,255,0.35) 0%, rgba(50,95,236,0) 70%)",
            filter: "blur(20px)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(50,95,236,0.25) 0%, rgba(50,95,236,0) 70%)",
            filter: "blur(30px)",
          }}
        />

        <div className="container relative z-10">
          <FadeIn>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-blue-300/80 hover:text-blue-200 text-xs tracking-[0.25em] uppercase mb-8 transition-colors group"
            >
              <span className="inline-block transition-transform group-hover:-translate-x-1">
                ←
              </span>
              Back to portfolio
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
            <div className="max-w-4xl">
              <FadeIn delay={0.05}>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {data.category && (
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
                      <span className="text-[10px] tracking-[0.3em] uppercase text-blue-200">
                        {data.category}
                      </span>
                    </div>
                  )}
                  {data.year && (
                    <div
                      className="px-4 py-2 rounded-full text-[10px] tracking-[0.3em] uppercase text-blue-200/70"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {data.year}
                    </div>
                  )}
                </div>
              </FadeIn>

              <RisingText end="80%">
                <h1
                  className="text-4xl md:text-[68px] leading-[1.04] mb-6 font-medium"
                  style={{
                    color: "#ffffff",
                    background: "none",
                    WebkitTextFillColor: "#ffffff",
                    WebkitBackgroundClip: "unset",
                    backgroundClip: "unset",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {data.client_name}
                </h1>
              </RisingText>

              {data.tagline && (
                <FadeIn delay={0.15}>
                  <p
                    className="italic text-lg md:text-2xl max-w-3xl mb-7 leading-snug"
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

              {data.live_url && (
                <FadeIn delay={0.25}>
                  <a
                    href={data.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-full text-sm text-white transition-colors group no-underline"
                    style={{
                      background: "rgba(50,95,236,0.18)",
                      border: "1px solid rgba(80,140,255,0.4)",
                      textDecoration: "none",
                    }}
                  >
                    Visit live site
                    <span className="inline-block transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                </FadeIn>
              )}
            </div>

            {/* Cover image card (desktop) — graceful fallback if missing */}
            <FadeIn delay={0.25}>
              <div
                className="hidden lg:block w-[340px] aspect-[4/3] rounded-2xl overflow-hidden relative"
                style={{
                  background: hasCover
                    ? "transparent"
                    : "linear-gradient(135deg, rgba(80,140,255,0.10), rgba(50,95,236,0.04))",
                  border: "1px solid rgba(80,140,255,0.18)",
                  boxShadow: "0 30px 60px -30px rgba(50,95,236,0.4)",
                }}
              >
                {hasCover ? (
                  <img
                    src={data.cover_image as string}
                    alt={data.client_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // No cover image — abstract glow instead so it doesn't look broken
                  <div className="w-full h-full flex items-center justify-center relative">
                    <div
                      className="absolute inset-0 opacity-50"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 30% 30%, rgba(80,140,255,0.4), transparent 50%), radial-gradient(circle at 70% 70%, rgba(50,95,236,0.3), transparent 50%)",
                      }}
                    />
                    <div className="relative text-center px-5">
                      <div className="text-[10px] tracking-[0.3em] uppercase text-blue-200/60 mb-2">
                        Case study
                      </div>
                      <div className="text-2xl text-white/90 font-medium leading-tight">
                        {data.client_name}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============================================== */}
      {/* MOCKUPS GALLERY (only if mockups exist)        */}
      {/* ============================================== */}
      {hasMockups && (
        <section
          className="py-16 md:py-20"
          style={{
            background: "linear-gradient(180deg, #050A18 0%, #0a1428 100%)",
          }}
        >
          <div className="container">
            <FadeIn>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-[2px] w-10 rounded-full bg-blue-400" />
                <span className="text-blue-300 text-[10px] tracking-[0.3em] uppercase font-medium">
                  Mockups · {mockups.length} {mockups.length === 1 ? "image" : "images"}
                </span>
              </div>
            </FadeIn>

            {/* Layout adapts to count: 1 = single big, 2 = pair, 3 = triplet, 4 = grid */}
            <div
              className={
                mockups.length === 1
                  ? "grid grid-cols-1 gap-5"
                  : mockups.length === 2
                  ? "grid grid-cols-1 md:grid-cols-2 gap-5"
                  : mockups.length === 3
                  ? "grid grid-cols-1 md:grid-cols-3 gap-5"
                  : "grid grid-cols-1 md:grid-cols-2 gap-5"
              }
            >
              {mockups.map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rounded-2xl overflow-hidden group"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(80,140,255,0.18)",
                    aspectRatio: mockups.length === 1 ? "16 / 9" : "4 / 3",
                  }}
                >
                  <img
                    src={src}
                    alt={`${data.client_name} mockup ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================== */}
      {/* SECTIONS + STICKY SIDEBAR                      */}
      {/* ============================================== */}
      <section className="relative py-20 md:py-28 bg-white">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(10,21,48,1) 1px, transparent 1px), linear-gradient(90deg, rgba(10,21,48,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12 lg:gap-16">
            {/* Sections column */}
            <div className="flex flex-col gap-20 md:gap-24">
              {sections.map((section, idx) => {
                const sectionId = slugifySection(section.title, idx);
                const paragraphs = (section.body || "")
                  .split(/\n\s*\n/)
                  .map((p) => p.trim())
                  .filter(Boolean);
                return (
                  <article
                    key={idx}
                    id={sectionId}
                    ref={(el) => (sectionRefs.current[idx] = el)}
                    className="relative scroll-mt-24"
                  >
                    {/* Floating big number */}
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
                        <div className="flex items-center gap-3 mb-5">
                          <div className="h-[2px] w-10 rounded-full bg-blue-500" />
                          <span className="text-blue-500 text-[10px] tracking-[0.3em] uppercase font-medium">
                            Chapter {String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h2
                          className="text-3xl md:text-[44px] leading-[1.1] mb-6 max-w-3xl"
                          style={{
                            color: "#0A1530",
                            WebkitTextFillColor: "#0A1530",
                            background: "none",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {section.title}
                        </h2>

                        <div className="flex flex-col gap-5 max-w-3xl">
                          {paragraphs.length > 0 ? (
                            paragraphs.map((p, j) => (
                              <p
                                key={j}
                                className="text-base md:text-[17px] leading-relaxed"
                                style={{ color: "rgba(10,21,48,0.78)" }}
                              >
                                {p}
                              </p>
                            ))
                          ) : (
                            <p
                              className="text-base md:text-[17px] leading-relaxed italic"
                              style={{ color: "rgba(10,21,48,0.5)" }}
                            >
                              (Section content coming soon.)
                            </p>
                          )}
                        </div>
                      </div>
                    </FadeIn>
                  </article>
                );
              })}

              {sections.length === 0 && (
                <div className="text-black/50 text-base italic">
                  This case study doesn't have detailed chapters yet — check
                  back soon.
                </div>
              )}
            </div>

            {/* Sticky sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-32 flex flex-col gap-10">
                {sections.length > 0 && (
                  <div>
                    <div className="text-blue-500 text-[10px] tracking-[0.3em] uppercase font-medium mb-5">
                      On this page
                    </div>
                    <ul className="flex flex-col gap-0 border-l border-black/10">
                      {sections.map((s, i) => {
                        const sectionId = slugifySection(s.title, i);
                        const isActive = activeSection === i;
                        return (
                          <li key={i}>
                            <a
                              href={`#${sectionId}`}
                              onClick={(e) => {
                                e.preventDefault();
                                scrollToSection(i);
                              }}
                              className="block w-full pl-5 py-2.5 -ml-px no-underline transition-colors"
                              style={{
                                background: "transparent",
                                borderLeft: isActive
                                  ? "2px solid #325FEC"
                                  : "2px solid transparent",
                                textDecoration: "none",
                              }}
                            >
                              <div
                                className="text-[10px] tracking-[0.3em] uppercase mb-0.5"
                                style={{
                                  color: isActive
                                    ? "#325FEC"
                                    : "rgba(10,21,48,0.4)",
                                }}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </div>
                              <div
                                className="text-[13px] leading-tight"
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
                )}

                {otherProjects.length > 0 && (
                  <div>
                    <div className="text-blue-500 text-[10px] tracking-[0.3em] uppercase font-medium mb-5">
                      More projects
                    </div>
                    <ul className="flex flex-col gap-2">
                      {otherProjects.map((p) => (
                        <li key={p.slug}>
                          <Link
                            to={`/portfolio/${p.slug}`}
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
                              {p.cover_image ? (
                                <img
                                  src={p.cover_image}
                                  alt=""
                                  className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                                />
                              ) : (
                                <div
                                  className="flex-shrink-0 w-10 h-10 rounded-md"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, rgba(50,95,236,0.15), rgba(50,95,236,0.04))",
                                  }}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div
                                  className="text-[13px] leading-tight truncate"
                                  style={{ color: "rgba(10,21,48,0.85)" }}
                                >
                                  {p.client_name}
                                </div>
                                {p.category && (
                                  <div
                                    className="text-[9px] tracking-[0.2em] uppercase mt-1"
                                    style={{ color: "rgba(50,95,236,0.7)" }}
                                  >
                                    {p.category}
                                  </div>
                                )}
                              </div>
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

      {/* ---- More projects (mobile / tablet only) ---- */}
      {otherProjects.length > 0 && (
        <section className="lg:hidden bg-white pb-16">
          <div className="container">
            <FadeIn>
              <div className="text-blue-500 text-[10px] tracking-[0.3em] uppercase font-medium mb-5">
                More projects
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherProjects.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/portfolio/${p.slug}`}
                    className="group block rounded-xl p-4 no-underline"
                    style={{
                      background: "#ffffff",
                      border: "1px solid rgba(10,21,48,0.08)",
                      textDecoration: "none",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {p.cover_image ? (
                        <img
                          src={p.cover_image}
                          alt=""
                          className="w-11 h-11 rounded-md object-cover flex-shrink-0"
                        />
                      ) : (
                        <div
                          className="flex-shrink-0 w-11 h-11 rounded-md"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(50,95,236,0.15), rgba(50,95,236,0.04))",
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <div
                          className="text-[14px] leading-tight"
                          style={{ color: "rgba(10,21,48,0.85)" }}
                        >
                          {p.client_name}
                        </div>
                        {p.category && (
                          <div
                            className="text-[9px] tracking-[0.2em] uppercase mt-1"
                            style={{ color: "rgba(50,95,236,0.7)" }}
                          >
                            {p.category}
                          </div>
                        )}
                      </div>
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
      {/* CTA BAND                                       */}
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
                  Have a project in mind?
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2
                className="text-3xl md:text-[44px] mb-6 leading-[1.1] font-medium"
                style={{
                  color: "#ffffff",
                  WebkitTextFillColor: "#ffffff",
                  background: "none",
                  letterSpacing: "-0.02em",
                }}
              >
                Let's build the next
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
                  case study together.
                </span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="text-white/70 text-base md:text-lg mb-10 max-w-2xl mx-auto">
                If this is the kind of work you're looking for, we'd love to
                hear what you're building.
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
                  to="/portfolio"
                  className="text-white/70 hover:text-white text-xs tracking-[0.25em] uppercase transition-colors group inline-flex items-center gap-2 no-underline"
                  style={{ textDecoration: "none" }}
                >
                  Browse all projects
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

export default ProjectDetailPage;
