/**
 * ServicesGrid — admin-driven services list rendered as a clean, LIGHT-themed
 * grid. Each card links to its individual /services/<slug> detail page.
 *
 * Per the brief: this section must NOT be on a dark background. Each card is
 * a white tile with subtle shadow and a blue accent — visually distinct
 * against the lighter section background.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import FadeIn from "@/transitions/FadeIn";

interface ServicePage {
  slug: string;
  title: string;
  number: string | null;
  tagline: string | null;
  intro: string | null;
  category?: string | null;
  cover_image?: string | null;
  sort_order: number;
}

const ServicesGrid: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ServicePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("service_detail_pages")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setRows((data ?? []) as ServicePage[]);
        setLoading(false);
      });
  }, []);

  const tabs = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      if (r.category && r.category.trim()) set.add(r.category.trim());
    });
    return ["All", ...Array.from(set)];
  }, [rows]);

  const visible = useMemo(() => {
    if (activeTab === "All") return rows;
    return rows.filter((r) => (r.category ?? "").trim() === activeTab);
  }, [rows, activeTab]);

  const scrollLeft = () => tabsRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  const scrollRight = () => tabsRef.current?.scrollBy({ left: 200, behavior: "smooth" });

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #f7f9ff 0%, #ffffff 50%, #eef3ff 100%)",
      }}
    >
      {/* Subtle blue accent washes — keep the section feeling premium without
          dominating with dark colour. */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(80,140,255,0.10) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(50,95,236,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* SECTION HEADING */}
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5 lg:gap-10 mb-8 md:mb-12 items-end">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-[2px] w-10 rounded-full bg-blue-500" />
                <span
                  className="text-[10px] tracking-[0.35em] uppercase font-semibold"
                  style={{ color: "#325FEC" }}
                >
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
                Eight Pillars.{" "}
                <span style={{ color: "#325FEC" }}>One Integrated Partner.</span>
              </h2>
            </div>
            <p
              className="text-sm md:text-base leading-relaxed lg:max-w-md lg:ml-auto"
              style={{ color: "rgba(10, 21, 48, 0.65)" }}
            >
              Every service stands on its own — and every service plugs into the
              others. Pick the pillar you need today; access the entire suite
              the moment you need to scale.
            </p>
          </div>
        </FadeIn>

        {/* CATEGORY FILTER PILLS */}
        {tabs.length > 1 && (
          <FadeIn delay={0.1}>
            <div className="tabs-container mb-7 md:mb-10">
              <div
                className="tabs"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(80,140,255,0.18)",
                  boxShadow: "0 8px 24px -10px rgba(50,95,236,0.12)",
                }}
              >
                <button
                  type="button"
                  className="chevron-button"
                  onClick={scrollLeft}
                  aria-label="Scroll left"
                  style={{ color: "#325FEC" }}
                >
                  ‹
                </button>
                <div ref={tabsRef} className="tabs-scroll flex gap-3 overflow-x-auto scrollbar-hide">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`tab ${activeTab === tab ? "active" : ""}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="chevron-button"
                  onClick={scrollRight}
                  aria-label="Scroll right"
                  style={{ color: "#325FEC" }}
                >
                  ›
                </button>
              </div>
            </div>
          </FadeIn>
        )}

        {/* GRID */}
        {loading ? (
          <p className="text-center py-16" style={{ color: "rgba(10,21,48,0.45)" }}>
            Loading services…
          </p>
        ) : visible.length === 0 ? (
          <p className="text-center py-16" style={{ color: "rgba(10,21,48,0.45)" }}>
            No services found in <strong>{activeTab}</strong>.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {visible.map((s, i) => (
              <ServiceCard
                key={s.slug}
                row={s}
                index={i}
                onClick={() => navigate(`/services/${s.slug}`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ================================
   Light-theme card with watermark pillar number, blue accents, and
   gentle hover lift.
================================ */
const ServiceCard: React.FC<{
  row: ServicePage;
  index: number;
  onClick: () => void;
}> = ({ row, index, onClick }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="service-card group text-left w-full rounded-2xl p-5 md:p-7 relative overflow-hidden flex flex-col"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(80, 140, 255, 0.18)",
        boxShadow:
          "0 8px 30px -12px rgba(50, 95, 236, 0.12), 0 2px 6px -3px rgba(10, 21, 48, 0.06)",
        backgroundColor: "#ffffff",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Big watermark pillar number — subtle so it doesn't fight the title */}
      <span
        aria-hidden
        className="absolute right-3 -bottom-4 md:right-4 md:-bottom-6 leading-none font-black select-none pointer-events-none"
        style={{
          fontSize: "clamp(80px, 9vw, 150px)",
          color: "rgba(50, 95, 236, 0.06)",
          letterSpacing: "-0.06em",
        }}
      >
        {row.number ?? "—"}
      </span>

      {/* Tilted accent ribbon (light-blue) — animates on hover */}
      <span
        aria-hidden
        className="absolute -left-12 -top-12 w-32 h-32 rotate-45 transition-all duration-500 group-hover:translate-x-2 group-hover:translate-y-2 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(80,140,255,0.18) 0%, rgba(80,140,255,0) 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* TOP ROW: pillar badge + arrow */}
      <div className="flex items-center justify-between mb-3 md:mb-4 relative z-10">
        <span
          className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase px-2.5 md:px-3 py-1 rounded-full font-semibold"
          style={{
            background: "rgba(50, 95, 236, 0.08)",
            border: "1px solid rgba(50, 95, 236, 0.22)",
            color: "#325FEC",
          }}
        >
          Pillar {row.number ?? "—"}
        </span>
        <span
          className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full transition-all duration-300 group-hover:rotate-45 group-hover:scale-110"
          style={{
            background:
              "linear-gradient(135deg, #325FEC 0%, #4d6ef0 100%)",
            color: "#ffffff",
            fontSize: "13px",
            boxShadow: "0 6px 16px -4px rgba(50, 95, 236, 0.45)",
          }}
        >
          ↗
        </span>
      </div>

      {/* TITLE */}
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
        {row.title}
      </h3>

      {/* TAGLINE */}
      {row.tagline && (
        <p
          className="relative z-10 italic text-[12px] md:text-[14px] mb-2 md:mb-3 line-clamp-2"
          style={{ color: "#325FEC" }}
        >
          {row.tagline}
        </p>
      )}

      {/* INTRO */}
      {row.intro && (
        <p
          className="relative z-10 text-[12.5px] md:text-[14px] leading-relaxed line-clamp-2 md:line-clamp-3 flex-grow"
          style={{ color: "rgba(10, 21, 48, 0.65)" }}
        >
          {row.intro}
        </p>
      )}

      {/* "READ MORE →" with sliding underline */}
      <div className="relative z-10 mt-4 md:mt-5 inline-flex items-center gap-2 self-start">
        <span
          className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-semibold relative pb-0.5"
          style={{ color: "#325FEC" }}
        >
          Read more
          <span
            aria-hidden
            className="absolute left-0 bottom-0 h-[1px] w-0 group-hover:w-full transition-all duration-400"
            style={{ background: "#325FEC" }}
          />
        </span>
        <span
          className="transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: "#325FEC", fontSize: "13px" }}
        >
          →
        </span>
      </div>
    </motion.button>
  );
};

export default ServicesGrid;
