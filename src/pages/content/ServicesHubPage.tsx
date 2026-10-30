/**
 * /services in the original Services page design (src/pages/services/service.tsx):
 * same hero, services grid, process steps, stats, FAQ and pre-CTA blocks,
 * with the grid and copy driven by the new content instead of the old CMS rows.
 */
import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "@/index.css";
import "@/pages/services/services.css";
import HeroSection from "@/pages/services/hero-section";
import ProcessSteps from "@/pages/services/components/process-steps.tsx";
import FaqSection from "@/pages/services/components/FaqSection.tsx";
import PreCtaSections from "@/components/PreCtaSections";
import FadeIn from "@/transitions/FadeIn";
// @ts-ignore - plain JS content module shared with the prerender script
import { SERVICES, INDUSTRIES } from "@/content/site.js";
import { UMBRELLAS, NEW_SERVICES } from "@/content/umbrellas";
import { useSearchParams } from "react-router-dom";

type NavItem = { path: string; label: string; blurb?: string };
type HubPage = { h1: string; intro: string; faqs: { q: string; a: string }[] };

// Tabs for the grid filter, in the order the services are listed.
const GROUPS: { name: string; paths: string[] }[] = [
  {
    name: "Strategy and AI",
    paths: [
      "/services/go-to-market",
      "/services/ai-consulting",
      "/services/business-optimization",
      "/services/ai-automation",
      "/services/custom-ai-development",
      "/services/whatsapp-automation",
    ],
  },
  {
    name: "Data and Cloud",
    paths: [
      "/services/business-intelligence",
      "/services/power-bi-consulting",
      "/services/data-engineering",
      "/services/cloud",
      "/services/cloud-migration",
      "/services/devops-consulting",
    ],
  },
  {
    name: "Build and Grow",
    paths: ["/services/web-app-development", "/services/app-development", "/services/seo-geo", "/services/paid-media"],
  },
  {
    name: "Video and 3D",
    paths: ["/services/video-motion", "/services/ai-video-production", "/services/3d-animation", "/services/3d-rendering"],
  },
  { name: "More We Do", paths: ["/services/more"] },
];

const STEPS = [
  { number: "01", title: "Talk", desc: "A 15-minute call to see if we fit." },
  { number: "02", title: "Plan", desc: "Discovery and a written roadmap in 5 to 7 days." },
  { number: "03", title: "Build", desc: "Specialist teams build it, dates in writing." },
  { number: "04", title: "Grow", desc: "We run it, measure it and grow it with you." },
];

const pad = (n: number) => String(n).padStart(2, "0");

const ServiceCard: React.FC<{ s: NavItem; number: string; index: number }> = ({ s, number, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: (index % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -6 }}
  >
    <Link
      to={s.path}
      className="service-card group text-left w-full h-full rounded-2xl p-4 md:p-7 relative overflow-hidden flex flex-col no-underline"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(80, 140, 255, 0.18)",
        boxShadow: "0 8px 30px -12px rgba(50, 95, 236, 0.12), 0 2px 6px -3px rgba(10, 21, 48, 0.06)",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        textDecoration: "none",
      }}
    >
      <span
        aria-hidden
        className="absolute right-3 -bottom-4 md:right-4 md:-bottom-6 leading-none font-black select-none pointer-events-none"
        style={{ fontSize: "clamp(80px, 9vw, 150px)", color: "rgba(50, 95, 236, 0.06)", letterSpacing: "-0.06em" }}
      >
        {number}
      </span>
      <span
        aria-hidden
        className="absolute -left-12 -top-12 w-32 h-32 rotate-45 transition-all duration-500 group-hover:translate-x-2 group-hover:translate-y-2 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(80,140,255,0.18) 0%, rgba(80,140,255,0) 70%)", filter: "blur(20px)" }}
      />
      <div className="flex items-center justify-between mb-3 md:mb-4 relative z-10">
        <span
          className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase px-2.5 md:px-3 py-1 rounded-full font-semibold"
          style={{ background: "rgba(50, 95, 236, 0.08)", border: "1px solid rgba(50, 95, 236, 0.22)", color: "#325FEC" }}
        >
          Service {number}
        </span>
        <span
          className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full transition-all duration-300 group-hover:rotate-45 group-hover:scale-110"
          style={{
            background: "linear-gradient(135deg, #325FEC 0%, #4d6ef0 100%)",
            color: "#ffffff",
            fontSize: "13px",
            boxShadow: "0 6px 16px -4px rgba(50, 95, 236, 0.45)",
          }}
        >
          ↗
        </span>
      </div>
      <h3
        className="relative z-10 mb-2 md:mb-3 leading-[1.15]"
        style={{
          fontSize: "clamp(18px, 1.6vw, 24px)",
          color: "#0A1530",
          background: "none",
          WebkitTextFillColor: "#0A1530",
          fontWeight: 600,
          letterSpacing: "-0.01em",
        }}
      >
        {s.label}
        {NEW_SERVICES.has(s.path) && (
          <span className="ml-2 align-middle text-[10px] tracking-[0.15em]" style={{ color: "#E8743B" }}>NEW</span>
        )}
      </h3>
      {s.blurb && (
        <p
          className="relative z-10 hidden sm:block text-[12.5px] md:text-[14px] leading-relaxed line-clamp-3 flex-grow"
          style={{ color: "rgba(10, 21, 48, 0.65)" }}
        >
          {s.blurb}
        </p>
      )}
      <div className="relative z-10 mt-4 md:mt-5 hidden sm:inline-flex items-center gap-2 self-start">
        <span className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-semibold relative pb-0.5" style={{ color: "#325FEC" }}>
          Read more
          <span aria-hidden className="absolute left-0 bottom-0 h-[1px] w-0 group-hover:w-full transition-all duration-400" style={{ background: "#325FEC" }} />
        </span>
        <span className="transition-transform duration-300 group-hover:translate-x-1" style={{ color: "#325FEC", fontSize: "13px" }}>
          →
        </span>
      </div>
    </Link>
  </motion.div>
);

const ServicesGrid: React.FC<{ heading: string; intro: string }> = ({ heading, intro }) => {
  const [params] = useSearchParams();
  const fromUrl = UMBRELLAS.find((u) => u.slug === params.get("area"));
  const [activeTab, setActiveTab] = useState(fromUrl ? fromUrl.short : "All");
  const tabsRef = useRef<HTMLDivElement>(null);
  // Every service once, in umbrella order, with label and blurb from SERVICES.
  const ordered = useMemo(() => {
    const byPath = new Map((SERVICES as NavItem[]).map((s) => [s.path, s]));
    const seen = new Set<string>();
    const out: (NavItem & { area: string })[] = [];
    for (const u of UMBRELLAS) for (const it of u.items) {
      if (seen.has(it.path)) continue;
      seen.add(it.path);
      const s = byPath.get(it.path);
      if (s) out.push({ ...s, label: it.path === "/services/more" ? "Managed Teams, Events, Games and Sourcing" : s.label, area: u.short });
    }
    return out;
  }, []);
  const numberOf = (path: string) => pad(ordered.findIndex((s) => s.path === path) + 1);
  const visible = useMemo(
    () => (activeTab === "All" ? ordered : ordered.filter((s) => s.area === activeTab)),
    [activeTab, ordered]
  );
  const tabs = ["All", ...UMBRELLAS.map((u) => u.short)];

  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #f7f9ff 0%, #ffffff 50%, #eef3ff 100%)" }}>
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(80,140,255,0.10) 0%, transparent 70%)", filter: "blur(40px)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(50,95,236,0.08) 0%, transparent 70%)", filter: "blur(40px)" }}
      />
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5 lg:gap-10 mb-8 md:mb-12 items-end">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-[2px] w-10 rounded-full bg-blue-500" />
                <span className="text-[10px] tracking-[0.35em] uppercase font-semibold" style={{ color: "#325FEC" }}>
                  Our Services
                </span>
              </div>
              <h2
                className="leading-[1.05]"
                style={{
                  fontSize: "clamp(28px, 4vw, 56px)",
                  letterSpacing: "-0.02em",
                  color: "#0A1530",
                  background: "none",
                  WebkitTextFillColor: "#0A1530",
                  WebkitBackgroundClip: "unset",
                  fontWeight: 600,
                }}
              >
                One team <span style={{ color: "#325FEC" }}>instead of ten.</span>
              </h2>
            </div>
            <p className="text-sm md:text-base leading-relaxed lg:max-w-md lg:ml-auto" style={{ color: "rgba(10, 21, 48, 0.65)" }}>
              {intro}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="tabs-container mb-7 md:mb-10">
            <div
              className="tabs"
              style={{ background: "#ffffff", border: "1px solid rgba(80,140,255,0.18)", boxShadow: "0 8px 24px -10px rgba(50,95,236,0.12)" }}
            >
              <button
                type="button"
                className="chevron-button"
                onClick={() => tabsRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
                aria-label="Scroll left"
                style={{ color: "#325FEC" }}
              >
                ‹
              </button>
              <div ref={tabsRef} className="tabs-scroll flex gap-3 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button key={tab} type="button" className={`tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                    {tab}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="chevron-button"
                onClick={() => tabsRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
                aria-label="Scroll right"
                style={{ color: "#325FEC" }}
              >
                ›
              </button>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {visible.map((s, i) => (
            <ServiceCard key={s.path} s={s} number={numberOf(s.path)} index={i} />
          ))}
        </div>

        {/* Industries, as a quieter row of links under the grid */}
        <FadeIn>
          <div className="mt-14 md:mt-20">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-[2px] w-10 rounded-full bg-blue-500" />
              <span className="text-[10px] tracking-[0.35em] uppercase font-semibold" style={{ color: "#325FEC" }}>
                Industries we work in
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {(INDUSTRIES as NavItem[]).map((ind) => (
                <Link
                  key={ind.path}
                  to={ind.path}
                  className="rounded-full px-5 py-2.5 text-sm no-underline transition-colors detail-link-card"
                  style={{ background: "#ffffff", border: "1px solid rgba(80,140,255,0.22)", color: "#0A1530", textDecoration: "none" }}
                >
                  {ind.label}
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const ServicesHubPage: React.FC<{ page: HubPage }> = ({ page }) => (
  <div>
    <HeroSection />
    <ServicesGrid heading="One team instead of ten" intro={page.intro} />
    <ProcessSteps
      steps={STEPS}
      title="How we work."
      text="Specialist teams, every date in writing. Discovery and a roadmap take 5 to 7 days."
    />
    <FaqSection items={page.faqs.map((f) => ({ question: f.q, answer: f.a }))} />
    <PreCtaSections />
  </div>
);

export default ServicesHubPage;
