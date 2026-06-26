import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import Framed from "@/assets/DigitalIcon.png";
import CreativeIcon from "@/assets/creativeicon.png";
import Stafficon from "@/assets/staffIcon.png";
import Broadcastingicon from "@/assets/broadcasticon.png";
import SliderComponent from "@/components/Slider.tsx";

import ScrollLineBottom from "./ScrollLineBottom.js";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";
// NOTE: the video reel showcase is removed for now (no reel available yet).
// `./video.tsx` is kept in the repo so it can be restored later.
import ServiceCard from "./ServiceCard.tsx";
import FadeIn from "@/transitions/FadeIn.tsx";
import CompanyStatsCounts from "./CompanyStatsCounts.tsx";
import {
  DecoCircuit,
  DecoData,
  DecoCloud,
  DecoSparkle,
  DecoTeam,
  DecoBroadcast,
  DecoFactory,
} from "./ServiceDecorations.tsx";
import { useCMS } from "@/hooks/useCMS";
import { usePageContent } from "@/hooks/usePageContent";

interface ClientLogo {
  id: string;
  name?: string;
  logo_url: string;
  sort_order?: number;
  is_active?: boolean;
}

/* ──────────────────────────────────────────────────────────────────────────
 *  BackgroundWindingLine
 *
 *  Two changes vs. previous version:
 *
 *  1. FULL VIEWPORT WIDTH.  The SVG breaks out of the container's box via
 *     left:50% + transform:translateX(-50%) + width:100vw. Its parent
 *     section drops overflow-hidden so the SVG can spill past the container
 *     padding on both sides.
 *
 *  2. SLOW SCROLL DRAW.  The previous math finished drawing the line as
 *     soon as the section was half a viewport into view. The new math maps
 *     pathLength to the user's FULL scroll through the section:
 *
 *         progress = scrolled / (viewport_height + section_height)
 *
 *     So the line starts at 0 when the section just enters the viewport,
 *     and reaches 1 only when the section has fully scrolled past the
 *     viewport's TOP edge. Drawing is gradual the whole time.
 * ────────────────────────────────────────────────────────────────────── */

// Path now starts from the TOP-LEFT corner (M 0 0) and curves down into the
// original winding flow. The first control segment was rewritten to enter
// from the corner rather than from x≈865 at the top.
const WINDING_PATH_D =
  "M0 0C120 120 260 360 357.215 725.005C-60.2856 684.005 -73.7845 284.005 226.716 296.505C527.216 309.005 832.716 841.505 1299.72 661.505C1525.9 574.324 1793.21 649.005 1469.21 1100.01C1145.21 1551.01 756.323 1166.44 480.714 1314.01C226.715 1450.01 208.214 1922.51 480.714 2017.01C753.214 2111.51 1058.71 1882.51 1216.71 2139.51C1374.71 2396.51 1323.21 2893.01 1587.71 2834.51C1852.22 2776.01 1851.71 2526.01 1666.21 2567.01C1480.71 2608.01 1173.01 2827.49 689.715 2636.01C321.214 2490.01 -87.2852 3174.37 430.715 3113.51C948.715 3052.64 929.715 3299.01 864.215 3421.01";

const BackgroundWindingLine: React.FC = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const path = pathRef.current;
    const svg = svgRef.current;
    if (!path || !svg) return;

    const pathLength = path.getTotalLength();
    path.setAttribute("stroke-dasharray", String(pathLength));
    path.setAttribute("stroke-dashoffset", String(pathLength));

    let raf = 0;
    let lastTop = Number.POSITIVE_INFINITY;

    const tick = () => {
      const rect = svg.getBoundingClientRect();
      if (rect.top !== lastTop) {
        lastTop = rect.top;
        const wh = window.innerHeight;
        const sectionHeight = rect.height;

        // Total scroll distance from "section just entering viewport bottom"
        // to "section just left viewport top".
        const total = wh + sectionHeight;
        // How far we've scrolled into that journey.
        const scrolled = wh - rect.top;
        // Progress 0 → 1 across the WHOLE scroll-through of the section.
        let progress = scrolled / total;
        progress = Math.max(0, Math.min(1, progress));

        const offset = pathLength * (1 - progress);
        path.setAttribute("stroke-dashoffset", String(offset));
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="absolute pointer-events-none"
      viewBox="0 0 1817 3441"
      preserveAspectRatio="xMidYMin slice"
      style={{
        zIndex: 0,
        top: 0,
        // Break out of container's left/right padding to span the full viewport.
        left: "50%",
        transform: "translateX(-50%)",
        width: "100vw",
        height: "100%",
      }}
    >
      <path
        ref={pathRef}
        d={WINDING_PATH_D}
        stroke="#325FEC"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
 *  H1 OVERRIDE — index.css globally sets h1 to inline-block + transparent.
 *  We reset all of it so the headline is block, centered, solid color.
 * ────────────────────────────────────────────────────────────────────── */
const HEADING_RESET: React.CSSProperties = {
  display: "block",
  color: "#0A1530",
  WebkitTextFillColor: "#0A1530",
  background: "none",
  backgroundClip: "unset",
  WebkitBackgroundClip: "unset",
  margin: "0 auto",
  textAlign: "center",
  maxWidth: "100%",
};

const ACCENT_COLOR: React.CSSProperties = {
  color: "#325FEC",
  WebkitTextFillColor: "#325FEC",
};

/* ──────────────────────────────────────────────────────────────────────────
 *  VideoShowcase
 *
 *  overflow-hidden is moved onto THIS wrapper (instead of the outer section)
 *  so the orbs and big "022" numeral still get clipped, but the line in the
 *  section can bleed past the container edges to full viewport width.
 * ────────────────────────────────────────────────────────────────────── */

const containerStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

// VideoShowcase — the reel/video showcase has been removed (no reel available
// yet). All showcase chrome (the "Watch our showcase" eyebrow, the giant "022"
// reel numeral, the scroll cue, the decorative rule, the <Video/> frame and the
// vertical connector) is gone; only the headline remains.
const VideoShowcase: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="relative z-10"
      >
        {/* HEADLINE */}
        <motion.div variants={fadeUp} style={{ textAlign: "center" }}>
          <h1
            className="services-hero-headline"
            style={{
              ...HEADING_RESET,
              fontSize: "clamp(24px, 4.2vw, 56px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
            }}
          >
            <span className="services-hero-line">
              We translate <span style={ACCENT_COLOR}>complex</span> challenges
            </span>{" "}
            <span className="services-hero-line">
              into tangible{" "}
              <span style={ACCENT_COLOR}>data driven results.</span>
            </span>
          </h1>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
 *  Stats block
 * ────────────────────────────────────────────────────────────────────── */

const StatsBlock: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
    className="mt-14 md:mt-20 mb-32 md:mb-48 relative z-10"
  >
    <CompanyStatsCounts />
  </motion.div>
);

/* ──────────────────────────────────────────────────────────────────────────
 *  ServicesSection
 *
 *  NOTE: `overflow-hidden` is REMOVED from the section so the line can bleed
 *  past the container's left/right padding to span the full viewport width.
 *  Orbs are clipped inside VideoShowcase via its own overflow-hidden.
 * ────────────────────────────────────────────────────────────────────── */

const ServicesSection = () => {
  const navigate = useNavigate();
  const stagger = (i: number) => i * 0.1;
  const { t } = usePageContent();

  const goToService = (slug: string) => () => navigate(`/services/${slug}`);

  const { data: logos } = useCMS<ClientLogo>("client_logos", {
    filter: { is_active: true },
    orderBy: "sort_order",
  });
  const slideUrls = logos.map((l) => l.logo_url).filter(Boolean);

  return (
    <section className="container relative pb-16 px-6 md:px-12 lg:px-20 pt-20 md:pt-40 section-fade-from-black">
      {/* ░░ Line wrapper — video + stats + pillar cards (NOT logos) ░░ */}
      <div className="relative">
        <BackgroundWindingLine />

        <div className="relative z-10">
          <VideoShowcase />

          <StatsBlock />

          <FadeIn>
            <div className="mb-12 mt-24 flex flex-col md:flex-row justify-between md:items-end gap-6">
              <div>
                <div
                  className="inline-block px-4 py-1.5 rounded-full text-[10px] tracking-[0.3em] uppercase mb-5"
                  style={{
                    border: "1px solid rgba(50,95,236,0.4)",
                    color: "rgba(50,95,236,0.95)",
                  }}
                >
                  {t("home_services_eyebrow", "What We Do")}
                </div>
                <h2
                  className="text-4xl md:text-[56px] leading-[1.05]"
                  style={{
                    color: "#0A1530",
                    background: "none",
                    WebkitTextFillColor: "#0A1530",
                    backgroundClip: "unset",
                    WebkitBackgroundClip: "unset",
                    fontWeight: 800,
                    letterSpacing: "-0.025em",
                  }}
                >
                  {t("home_services_heading_part1", "Integrated Solutions")}{" "}
                  <br className="hidden md:block" />
                  <span
                    style={{
                      color: "#325FEC",
                      WebkitTextFillColor: "#325FEC",
                      background: "none",
                    }}
                  >
                    {t("home_services_heading_part2", "Singular Focus.")}
                  </span>
                </h2>
              </div>
              <p
                className="text-base md:text-lg max-w-md"
                style={{ color: "#000" }}
              >
                {t(
                  "home_services_subheading",
                  "Seven pillars. One operating model. End-to-end execution from engineering to broadcast to physical product."
                )}
              </p>
            </div>
          </FadeIn>

          {/* ─────────────────────────────────────────────────────────────
              DESKTOP (md+) — keep the original two-row layout exactly as it
              was designed: 3 "tall" pillar cards on top, 4 regular cards
              below. Hidden on mobile because we render a purpose-built
              compact grid for phones instead (see further below).
          ─────────────────────────────────────────────────────────────── */}
          <div className="hidden md:grid grid-cols-3 gap-6 mb-6">
            <FadeIn delay={stagger(0)}>
              <Cardhovereffect>
                <ServiceCard
                  title="Digital Solutions"
                  description="High-performance web development, SEO, GEO and intelligent AI systems."
                  icon={Framed}
                  tone="dark"
                  size="tall"
                  highlight="01 / Pillar"
                  decoration={<DecoCircuit tone="dark" />}
                  buttonVariant="white"
                  onClick={goToService("digital-solutions")}
                />
              </Cardhovereffect>
            </FadeIn>

            <FadeIn delay={stagger(1)}>
              <Cardhovereffect>
                <ServiceCard
                  title="Data & AI"
                  description="Predictive analytics, multi-agentic AI, and automation that scales."
                  icon={Framed}
                  tone="blue"
                  size="tall"
                  highlight="02 / Pillar"
                  decoration={<DecoData tone="blue" />}
                  buttonVariant="secondary"
                  onClick={goToService("data-ai")}
                />
              </Cardhovereffect>
            </FadeIn>

            <FadeIn delay={stagger(2)}>
              <Cardhovereffect>
                <ServiceCard
                  title="Cloud Solutions"
                  description="Scalable cloud infrastructure, DevOps, and resilient backend systems."
                  icon={Framed}
                  tone="dark"
                  size="tall"
                  highlight="03 / Pillar"
                  decoration={<DecoCloud tone="dark" />}
                  buttonVariant="white"
                  onClick={goToService("cloud-solutions")}
                />
              </Cardhovereffect>
            </FadeIn>
          </div>

          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FadeIn delay={stagger(3)}>
              <Cardhovereffect>
                <ServiceCard
                  title="Creative Solutions"
                  description="Social media management, motion graphics, 2D/3D animations."
                  icon={CreativeIcon}
                  tone="blue"
                  decoration={<DecoSparkle tone="blue" />}
                  buttonVariant="secondary"
                  onClick={goToService("creative-solutions")}
                />
              </Cardhovereffect>
            </FadeIn>

            <FadeIn delay={stagger(4)}>
              <Cardhovereffect>
                <ServiceCard
                  title="Managed Services"
                  description="Top-tier global talent with built-in supervision. Staff augmentation and employee outsourcing."
                  icon={Stafficon}
                  tone="dark"
                  decoration={<DecoTeam tone="dark" />}
                  buttonVariant="white"
                  onClick={goToService("managed-services")}
                />
              </Cardhovereffect>
            </FadeIn>

            <FadeIn delay={stagger(5)}>
              <Cardhovereffect>
                <ServiceCard
                  title="Broadcasting & Events"
                  description="End-to-end online and offline tournament and broadcast management."
                  icon={Broadcastingicon}
                  tone="blue"
                  decoration={<DecoBroadcast tone="blue" />}
                  buttonVariant="secondary"
                  onClick={goToService("broadcasting-events")}
                />
              </Cardhovereffect>
            </FadeIn>

            <FadeIn delay={stagger(6)}>
              <Cardhovereffect>
                <ServiceCard
                  title="Global Manufacturing"
                  description="Optimize your supply chain and reduce product costs by 40-60%."
                  icon={Stafficon}
                  tone="dark"
                  decoration={<DecoFactory tone="dark" />}
                  buttonVariant="white"
                  onClick={goToService("global-manufacturing")}
                />
              </Cardhovereffect>
            </FadeIn>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              MOBILE (< md) — one unified compact grid for all 7 services.

              Why this layout: when the desktop's "3 pillars on top + 4
              below" structure is forced into a 2-column phone grid, the 3rd
              pillar card ends up alone on a row by itself (orphan). To
              avoid that, we drop all 7 services into a single grid and let
              the 7th service span both columns at the bottom — a clean
              3-rows-of-2-plus-1-wide rhythm, no orphans.

              Each tile is a slim purpose-built mobile card: icon, title,
              one-line description, arrow. No big GET STARTED button — the
              whole tile is tappable.
          ─────────────────────────────────────────────────────────────── */}
          <div className="grid md:hidden grid-cols-2 gap-3">
            {[
              { title: "Digital Solutions",     short: "Web, SEO, GEO, AI systems.",                   tone: "dark" as const, slug: "digital-solutions",      label: "01" },
              { title: "Data & AI",             short: "Predictive analytics & automation.",           tone: "blue" as const, slug: "data-ai",                 label: "02" },
              { title: "Cloud Solutions",       short: "Cloud, DevOps, backend systems.",              tone: "dark" as const, slug: "cloud-solutions",        label: "03" },
              { title: "Creative Solutions",    short: "Social, motion, 2D/3D animation.",             tone: "blue" as const, slug: "creative-solutions",     label: "04" },
              { title: "Managed Services",      short: "Top-tier global talent, supervised.",          tone: "dark" as const, slug: "managed-services",       label: "05" },
              { title: "Broadcasting & Events", short: "Tournaments & broadcast management.",          tone: "blue" as const, slug: "broadcasting-events",    label: "06" },
              { title: "Global Manufacturing",  short: "Supply chain & cost reduction 40-60%.",        tone: "dark" as const, slug: "global-manufacturing",   label: "07" },
            ].map((s, i) => {
              const isBlue = s.tone === "blue";
              const isLast = i === 6; // span 2 columns to terminate cleanly
              return (
                <FadeIn key={s.slug} delay={i * 0.04}>
                  <button
                    type="button"
                    onClick={goToService(s.slug)}
                    className={`group relative w-full h-full text-left rounded-2xl overflow-hidden transition-transform duration-300 active:scale-[0.98] ${
                      isLast ? "col-span-2" : ""
                    }`}
                    style={{
                      background: isBlue
                        ? "linear-gradient(135deg, #4571F5 0%, #2447b8 70%, #1a3392 100%)"
                        : "linear-gradient(135deg, #0E1628 0%, #050A18 60%, #02040D 100%)",
                      border: "1px solid rgba(80,140,255,0.18)",
                      boxShadow: isBlue
                        ? "0 10px 30px -12px rgba(50,95,236,0.45)"
                        : "0 10px 30px -12px rgba(0,0,0,0.6)",
                      minHeight: isLast ? 110 : 150,
                    }}
                  >
                    {/* Subtle corner glow */}
                    <span
                      aria-hidden
                      className="absolute -top-10 -right-8 w-32 h-32 rounded-full pointer-events-none opacity-40 blur-2xl"
                      style={{
                        background: isBlue ? "rgba(255,255,255,0.35)" : "rgba(80,140,255,0.55)",
                      }}
                    />

                    <div className="relative z-10 flex flex-col justify-between h-full p-4">
                      {/* Top row: status dot + numeric label */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            isBlue ? "bg-white/20" : "bg-white/[0.08]"
                          }`}
                          style={{ border: "1px solid rgba(255,255,255,0.14)" }}
                        >
                          <span
                            className="block w-2 h-2 rounded-full"
                            style={{
                              background: isBlue ? "#ffffff" : "#7eaaff",
                              boxShadow: isBlue
                                ? "0 0 8px rgba(255,255,255,0.7)"
                                : "0 0 8px rgba(126,170,255,0.7)",
                            }}
                          />
                        </span>
                        <span
                          className="text-[9px] tracking-[0.25em] uppercase font-medium"
                          style={{ color: isBlue ? "rgba(255,255,255,0.7)" : "rgba(126,170,255,0.85)" }}
                        >
                          / {s.label}
                        </span>
                      </div>

                      {/* Bottom block: title + 1-line description on the left,
                          arrow chip in the bottom-right corner. Same layout
                          for every tile (including the full-width "07"). */}
                      <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <h3
                            className="text-white font-medium leading-tight"
                            style={{ fontSize: isLast ? 18 : 15 }}
                          >
                            {s.title}
                          </h3>
                          <p
                            className="text-white/65 mt-1 leading-snug"
                            style={{ fontSize: 11 }}
                          >
                            {s.short}
                          </p>
                        </div>

                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full transition-transform group-hover:translate-x-0.5 flex-shrink-0"
                          style={{
                            background: isBlue ? "rgba(255,255,255,0.18)" : "rgba(80,140,255,0.18)",
                            border: "1px solid rgba(255,255,255,0.18)",
                            color: "#ffffff",
                          }}
                          aria-hidden
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="8 7 17 7 17 16" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </button>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>

      {/* ░░ Logos — outside the line wrapper ░░ */}
      <div className="relative z-20 mt-20 md:mt-28">
        <ScrollLineBottom />

        <FadeIn>
          <div className="text-center mt-8 md:mt-10 mb-3 md:mb-4 relative z-20">
            <div
              className="inline-block px-4 py-1.5 rounded-full text-[10px] tracking-[0.3em] uppercase mb-4"
              style={{
                border: "1px solid rgba(50,95,236,0.4)",
                color: "rgba(50,95,236,0.95)",
              }}
            >
              {t("home_logos_eyebrow", "Trusted By")}
            </div>
            <h2
              className="leading-[1.15] font-bold"
              style={{
                color: "#0A1530",
                background: "none",
                WebkitTextFillColor: "#0A1530",
                backgroundClip: "unset",
                WebkitBackgroundClip: "unset",
                fontSize: "clamp(28px, 3.4vw, 44px)",
                fontWeight: 700,
                padding: "8px 0 0 0",
                margin: 0,
              }}
            >
              {t("home_logos_heading", "Companies We Have Worked With")}
            </h2>
          </div>
        </FadeIn>

        {slideUrls.length > 0 && (
          <div className="logos-band-wrap mt-1 md:mt-2 relative z-10">
            <SliderComponent slides={slideUrls} />
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
