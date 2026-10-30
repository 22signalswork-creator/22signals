import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from "framer-motion";

import WhatWeDoGlobe from "./WhatWeDoGlobe.tsx";
import Video, { REEL_YEAR } from "./video.tsx";
import FadeIn from "@/transitions/FadeIn.tsx";
import CompanyStatsCounts from "./CompanyStatsCounts.tsx";
import Words from "@/components/fx/Words";


/* ──────────────────────────────────────────────────────────────────────────
 *  ScrollTrace (exported under the old name so home.tsx is unchanged)
 *
 *  A hairline rail in the left margin of the light part of the page. A small
 *  soft dot rides it, always level with the middle of the screen, and the rail
 *  fills in behind it. One transform per frame, no SVG paths, nothing that
 *  crosses the content.
 * ────────────────────────────────────────────────────────────────────── */
type Mark = { y: number; label: string };

export const BackgroundWindingLine: React.FC = () => {
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [cur, setCur] = useState(-1);
  const marksRef = useRef<Mark[]>([]);

  // Section ticks: every [data-trace] block in the page below the hero.
  useEffect(() => {
    const rail = railRef.current;
    const host = rail?.parentElement;
    if (!rail || !host) return;
    const read = () => {
      const top = rail.getBoundingClientRect().top;
      const list = Array.from(host.querySelectorAll<HTMLElement>("[data-trace]")).map((el) => ({
        y: Math.max(0, el.getBoundingClientRect().top - top),
        label: el.dataset.trace || "",
      }));
      marksRef.current = list;
      setMarks((old) => (JSON.stringify(old) === JSON.stringify(list) ? old : list));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const rail = railRef.current, fill = fillRef.current, dot = dotRef.current;
    const tail = tailRef.current, label = labelRef.current;
    if (!rail || !fill || !dot) return;
    let raf = 0;
    let shown = -1;
    let goal = 0;
    let vis = "0";

    const measure = () => {
      const r = rail.getBoundingClientRect();
      const h = r.height || 1;
      goal = Math.max(0, Math.min(h, window.innerHeight * 0.5 - r.top));
      vis = goal > 2 && goal < h - 2 ? "1" : "0";
      dot.style.opacity = vis;
      if (tail) tail.style.opacity = vis;
      if (label) label.style.opacity = vis;
      let k = -1;
      marksRef.current.forEach((m, i) => {
        if (m.y <= goal + 4) k = i;
      });
      setCur((c) => (c === k ? c : k));
    };
    const frame = () => {
      shown = shown < 0 ? goal : shown + (goal - shown) * 0.3;
      if (Math.abs(goal - shown) < 0.5) shown = goal;
      fill.style.transform = `scaleY(${shown / (rail.offsetHeight || 1)})`;
      dot.style.transform = `translate3d(-50%, ${shown}px, 0)`;
      if (tail) tail.style.transform = `translate3d(0, ${shown}px, 0)`;
      if (label) label.style.transform = `translate3d(0, ${shown + 22}px, 0)`;
      raf = shown !== goal ? requestAnimationFrame(frame) : 0;
    };
    const onScroll = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(frame);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [marks]);

  const m = cur >= 0 ? marks[cur] : null;
  return (
    <div ref={railRef} aria-hidden className="scroll-trace pointer-events-none">
      <div className="scroll-trace-line" />
      <div ref={fillRef} className="scroll-trace-fill" />
      {marks.map((mk, i) => (
        <div key={mk.label + i} className={`scroll-trace-tick ${i <= cur ? "is-past" : ""}`} style={{ top: mk.y }} />
      ))}
      <div ref={tailRef} className="scroll-trace-tail" />
      <div ref={dotRef} className="scroll-trace-dot pulse" />
      <div ref={labelRef} className="scroll-trace-label">
        {m && (
          <span key={m.label} className="stl-txt">
            <b>{String(cur + 1).padStart(2, "0")}</b> {m.label}
          </span>
        )}
      </div>
    </div>
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

const VideoShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  // Phones skip the numeral parallax: it fought momentum scrolling.
  const [still] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);
  // Desktop: the reel opens up to full size as it rises into view.
  const reelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: reelP } = useScroll({ target: reelRef, offset: ["start end", "center center"] });
  const reelScale = useTransform(reelP, [0, 1], [still ? 0.88 : 0.84, 1]);
  const reelFade = useTransform(reelP, [0, 0.6], [0.35, 1]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
  });

  const orbAY = useTransform(progress, [0, 1], ["-30%", "40%"]);
  const orbBY = useTransform(progress, [0, 1], ["35%", "-25%"]);
  const numeralY = useTransform(progress, [0, 1], ["4%", "-8%"]);
  const numeralX = useTransform(progress, [0, 1], ["0%", "0%"]);
  const numeralScale = useTransform(progress, [0, 1], [0.96, 1.02]);
  const numeralOpacity = useTransform(
    progress,
    [0, 0.2, 0.8, 1],
    [0, 0.08, 0.06, 0]
  );

  const connectorScale = useTransform(progress, [0.45, 0.85], [0, 1]);
  const ruleScaleX = useTransform(progress, [0, 0.3], [0, 1]);

  return (
    // overflow-hidden lives HERE now (not on the section) so orbs are clipped
    // within the showcase, but the line below can still bleed to viewport edges.
    <div
      ref={sectionRef}
      data-trace="Showreel"
      className="relative w-full overflow-hidden"
    >
      {/* Huge faded reel numeral */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none select-none absolute inset-x-0 top-[14%] flex justify-center z-0"
      >
        <motion.span
          style={{
            ...(still ? { opacity: 0.07 } : { y: numeralY, x: numeralX, scale: numeralScale, opacity: numeralOpacity }),
            fontSize: "clamp(200px, 30vw, 520px)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(50,95,236,0.45)",
            letterSpacing: "-0.04em",
            display: "inline-block",
          }}
          className="font-thin leading-[0.85] tracking-tighter"
        >
          022
        </motion.span>
      </motion.div>

      {/* Ambient orbs removed — was causing a soft blue glow behind the headline */}

      {/* FOREGROUND */}
      <motion.div
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="relative z-10"
      >
        {/* Decorative rule */}
        <motion.div
          style={{ scaleX: ruleScaleX, transformOrigin: "left center" }}
          className="relative h-px w-full mb-12 md:mb-16"
          aria-hidden
        >
          <div
            className="w-full h-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(50,95,236,0) 0%, rgba(50,95,236,0.55) 25%, rgba(10,21,48,0.5) 60%, rgba(50,95,236,0) 100%)",
            }}
          />
        </motion.div>

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
            <Words>
              <span className="services-hero-line">
                We translate <span style={ACCENT_COLOR}>complex</span> challenges
              </span>{" "}
              <span className="services-hero-line">
                into tangible{" "}
                <span style={ACCENT_COLOR}>data driven results.</span>
              </span>
            </Words>
          </h1>
        </motion.div>

        {/* Lead paragraph removed per request */}

        {/* Video frame */}
        <motion.div variants={fadeUp} className="mt-10 md:mt-16 relative -mx-3 md:mx-0">
          <motion.div ref={reelRef} className="relative z-10" style={{ scale: reelScale, opacity: reelFade, transformOrigin: "50% 0%" }}>
            <Video />
          </motion.div>
        </motion.div>

        {/* Vertical connector */}
        <div className="relative flex justify-center mt-6 md:mt-8">
          <motion.div
            style={{ scaleY: connectorScale, transformOrigin: "top center" }}
            className="w-px h-10 md:h-14"
            aria-hidden
          >
            <div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(180deg, #325FEC 0%, #325FEC 60%, rgba(50,95,236,0) 100%)",
              }}
            />
          </motion.div>
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-2 h-2 rounded-full"
            style={{
              background: "#325FEC",
              boxShadow: "0 0 0 6px rgba(50,95,236,0.15)",
            }}
          />
        </div>
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
    className="home-stats mt-6 md:mt-8 mb-10 md:mb-14 relative z-10"
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
  return (
    <section className="container relative pb-16 px-6 md:px-12 lg:px-20 pt-20 md:pt-40 section-fade-from-black">
      {/* ░░ Line wrapper — video + stats + pillar cards (NOT logos) ░░ */}
      <div className="relative">

        <div className="relative z-10">
          <VideoShowcase />

          <StatsBlock />

        </div>
      </div>

      {/* What we do: outside the line wrapper so the line never crosses it */}
      <div className="relative z-10">
          <FadeIn>
            <div data-trace="What we do" className="mb-8 md:mb-10 mt-16 md:mt-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div
                  className="inline-block px-4 py-1.5 rounded-full text-[10px] tracking-[0.3em] uppercase mb-5"
                  style={{ border: "1px solid rgba(50,95,236,0.4)", color: "rgba(50,95,236,0.95)" }}
                >
                  What We Do
                </div>
                <h2
                  className="text-4xl md:text-[60px] leading-[1.03]"
                  style={{
                    color: "#0A1530",
                    background: "none",
                    WebkitTextFillColor: "#0A1530",
                    backgroundClip: "unset",
                    WebkitBackgroundClip: "unset",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                  }}
                >
                  <Words>
                    One team <br />
                    <span style={{ color: "#325FEC", WebkitTextFillColor: "#325FEC", background: "none" }}>instead of ten.</span>
                  </Words>
                </h2>
                <p className="text-lg md:text-xl mt-5 max-w-xl" style={{ color: "rgba(10,21,48,0.7)" }}>
                  AI, cloud, websites, marketing and video, under one roof.
                </p>
              </div>
              <Link
                data-magnetic
                to="/services"
                className="self-start md:self-auto inline-flex items-center gap-2 md:gap-3 rounded-full px-5 py-2.5 md:px-7 md:py-4 text-[11px] md:text-sm tracking-[0.12em] uppercase no-underline"
                style={{ background: "#325FEC", color: "#ffffff", textDecoration: "none", boxShadow: "0 12px 30px -12px rgba(50,95,236,0.6)" }}
              >
                Explore all services <span aria-hidden>↗</span>
              </Link>
            </div>
          </FadeIn>

          <FadeIn>
            <WhatWeDoGlobe />
          </FadeIn>
      </div>
    </section>
  );
};

export default ServicesSection;
