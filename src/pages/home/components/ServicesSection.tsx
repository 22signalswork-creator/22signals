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
  const headRef = useRef<SVGGElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const path = pathRef.current;
    const svg = svgRef.current;
    const head = headRef.current;
    if (!path || !svg) return;

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = String(pathLength);
    path.style.strokeDashoffset = String(pathLength);

    // Only work when the page scrolls (the page scrolls inside <body>, so
    // listen in the capture phase), at most once per frame, and only while
    // the line is near the screen.
    let raf = 0;
    let shown = 0; // eased progress so the line glides rather than jumps
    let goal = 0;
    let inView = true;

    const measure = () => {
      const rect = svg.getBoundingClientRect();
      const wh = window.innerHeight;
      // Same pace as the original line: draws across the whole scroll-through.
      const p = (wh - rect.top) / (wh + rect.height);
      goal = Math.max(0, Math.min(1, p));
    };

    const frame = () => {
      shown += (goal - shown) * 0.08;
      if (Math.abs(goal - shown) < 0.0005) shown = goal;
      path.style.strokeDashoffset = String(pathLength * (1 - shown));
      if (head) {
        const pt = path.getPointAtLength(pathLength * shown);
        head.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        head.style.opacity = shown > 0.002 && shown < 0.998 ? "1" : "0";
      }
      raf = shown !== goal ? requestAnimationFrame(frame) : 0;
    };

    const onScroll = () => {
      if (!inView) return;
      measure();
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver((es) => {
      inView = es[0]?.isIntersecting ?? true;
      if (inView) onScroll();
    }, { rootMargin: "200px 0px" });
    io.observe(svg);

    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener("scroll", onScroll, { capture: true } as any);
      window.removeEventListener("resize", onScroll);
    };
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
        left: "50%",
        transform: "translateX(-50%)",
        width: "100vw",
        height: "100%",
      }}
    >
      <defs>
        <linearGradient id="wl-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#325FEC" />
          <stop offset="1" stopColor="#6B92FF" />
        </linearGradient>
        <radialGradient id="wl-glow">
          <stop offset="0" stopColor="#dfe8ff" />
          <stop offset="0.3" stopColor="#6B92FF" stopOpacity="0.85" />
          <stop offset="1" stopColor="#325FEC" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* the road ahead: a faint dotted copy of the line */}
      <path d={WINDING_PATH_D} stroke="rgba(50,95,236,0.16)" strokeWidth="5" strokeDasharray="2 28" strokeLinecap="round" fill="none" />
      <path
        ref={pathRef}
        d={WINDING_PATH_D}
        stroke="url(#wl-grad)"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />
      <g ref={headRef} style={{ opacity: 0, transition: "opacity .3s ease" }}>
        <circle r="34" fill="url(#wl-glow)" opacity="0.7" />
        <circle r="9" fill="#ffffff" />
      </g>
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

const VideoShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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
            y: numeralY,
            x: numeralX,
            scale: numeralScale,
            opacity: numeralOpacity,
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
            <span className="services-hero-line">
              We translate <span style={ACCENT_COLOR}>complex</span> challenges
            </span>{" "}
            <span className="services-hero-line">
              into tangible{" "}
              <span style={ACCENT_COLOR}>data driven results.</span>
            </span>
          </h1>
        </motion.div>

        {/* Lead paragraph removed per request */}

        {/* Video frame */}
        <motion.div variants={fadeUp} className="mt-12 md:mt-16 relative">
          <div className="relative z-10">
            <Video />
          </div>
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
    className="mt-6 md:mt-8 mb-10 md:mb-14 relative z-10"
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
        <BackgroundWindingLine />

        <div className="relative z-10">
          <VideoShowcase />

          <StatsBlock />

        </div>
      </div>

      {/* What we do: outside the line wrapper so the line never crosses it */}
      <div className="relative z-10">
          <FadeIn>
            <div className="mb-8 md:mb-10 mt-16 md:mt-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
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
                  One team <br />
                  <span style={{ color: "#325FEC", WebkitTextFillColor: "#325FEC", background: "none" }}>instead of ten.</span>
                </h2>
                <p className="text-lg md:text-xl mt-5 max-w-xl" style={{ color: "rgba(10,21,48,0.7)" }}>
                  AI, cloud, websites, marketing and video, under one roof.
                </p>
              </div>
              <Link
                to="/services"
                className="self-start md:self-auto inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm tracking-[0.12em] uppercase no-underline transition-transform hover:-translate-y-0.5"
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
