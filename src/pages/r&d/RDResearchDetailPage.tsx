/**
 * RDResearchDetailPage — public page at /r&d/:slug
 *
 * Renders one row from `rd_research_pages`. Mirrors the structure of
 * ProjectDetailPage but tuned for research content (progress bar, sections,
 * cross-links to other research pieces).
 */
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import MyButton from "@/components/CustomButton";
import PreCtaSections from "@/components/PreCtaSections";

interface Section {
  title: string;
  body: string;
}

interface ResearchRow {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  percent: number;
  card_text: string | null;
  cover_image: string | null;
  tagline: string | null;
  intro: string;
  sections: Section[] | string;
  is_active: boolean;
  sort_order: number;
}

interface OtherResearch {
  slug: string;
  title: string;
  category: string | null;
  percent: number;
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

const RDResearchDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ResearchRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [other, setOther] = useState<OtherResearch[]>([]);

  // Force scroll-to-top on slug change
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    supabase
      .from("rd_research_pages")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setData(data as ResearchRow);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("rd_research_pages")
      .select("slug, title, category, percent, sort_order")
      .eq("is_active", true)
      .neq("slug", slug)
      .order("sort_order", { ascending: true })
      .limit(6)
      .then(({ data }) => {
        if (data) setOther(data as OtherResearch[]);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000202] flex items-center justify-center text-white/50 text-sm">
        Loading…
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-[#000202] flex flex-col items-center justify-center text-white/70 px-4">
        <h2 className="text-2xl mb-4 text-white" style={{ background: "none", WebkitTextFillColor: "#ffffff" }}>
          Research not found.
        </h2>
        <p className="text-white/55 text-sm mb-8 text-center max-w-md">
          The page you tried to open does not exist or is no longer active.
        </p>
        <Link
          to="/r&d"
          className="text-blue-300 hover:text-blue-200 text-xs tracking-[0.25em] uppercase no-underline"
          style={{ textDecoration: "none" }}
        >
          ← Back to R&D
        </Link>
      </div>
    );
  }

  const sections = parseJsonArray<Section>(data.sections);

  return (
    <>
      {/* HERO */}
      <section
        className="relative pt-28 md:pt-36 pb-16 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #050A18 0%, #0E1628 55%, #1a3392 130%)",
        }}
      >
        {/* Watermark percent */}
        <div
          className="absolute top-8 right-2 md:top-0 md:-right-4 text-[180px] md:text-[300px] leading-none font-bold pointer-events-none select-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(120,170,255,0.16) 0%, rgba(50,95,236,0) 85%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.04em",
          }}
        >
          {data.percent}%
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <Link
              to="/r&d"
              className="inline-flex items-center gap-2 text-blue-300/80 hover:text-blue-200 text-xs tracking-[0.25em] uppercase mb-6 no-underline"
              style={{ textDecoration: "none" }}
            >
              ← Back to R&D
            </Link>
          </FadeIn>

          <FadeIn>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 rounded-full bg-blue-400" />
              <span className="text-blue-300 text-[10px] tracking-[0.35em] uppercase font-medium">
                {data.category ?? "Research"}
              </span>
              <span
                className="text-[10px] tracking-[0.25em] uppercase px-3 py-1 rounded-full"
                style={{
                  background: "rgba(80,140,255,0.1)",
                  border: "1px solid rgba(80,140,255,0.3)",
                  color: "#bcd0ff",
                }}
              >
                {data.percent}% complete
              </span>
            </div>
          </FadeIn>

          <RisingText>
            <h1
              className="font-bold leading-[1.05] tracking-tight"
              style={{
                background:
                  "linear-gradient(91deg, #325FEC 0%, #FFFFFF 50%, #325FEC 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: "clamp(36px, 5vw, 72px)",
                letterSpacing: "-0.025em",
              }}
            >
              {data.title}
            </h1>
          </RisingText>

          {data.tagline && (
            <FadeIn delay={0.1}>
              <p className="italic text-blue-200/90 mt-5 max-w-3xl" style={{ fontSize: "clamp(15px, 1.3vw, 20px)" }}>
                {data.tagline}
              </p>
            </FadeIn>
          )}

          {/* Progress bar */}
          <FadeIn delay={0.2}>
            <div className="mt-8 max-w-2xl">
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${data.percent}%` }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #325FEC 0%, #6B92FF 100%)",
                    boxShadow: "0 0 12px rgba(80,140,255,0.6)",
                  }}
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* COVER + INTRO */}
      <section className="bg-[#000202] py-16 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-start">
            <div>
              {data.cover_image && (
                <FadeIn>
                  <div className="rounded-2xl overflow-hidden mb-8 border border-white/10">
                    <img
                      src={data.cover_image}
                      alt={data.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </FadeIn>
              )}
              <FadeIn>
                <p
                  className="text-white/75 leading-relaxed"
                  style={{ fontSize: "clamp(15px, 1.15vw, 18px)", lineHeight: 1.7 }}
                >
                  {data.intro}
                </p>
              </FadeIn>
            </div>

            {/* Other research sidebar */}
            <FadeIn delay={0.1}>
              <aside
                className="rounded-2xl p-6 md:p-7"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(50,95,236,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                  border: "1px solid rgba(80,140,255,0.18)",
                }}
              >
                <div className="text-blue-300 text-[10px] tracking-[0.35em] uppercase mb-4">
                  Other Research
                </div>
                {other.length === 0 ? (
                  <p className="text-white/50 text-sm">No other research is currently active.</p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {other.map((o) => (
                      <li key={o.slug}>
                        <Link
                          to={`/r&d/${o.slug}`}
                          className="block rounded-lg p-3 transition-colors no-underline"
                          style={{
                            textDecoration: "none",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <span className="text-white text-sm font-medium leading-tight">
                              {o.title}
                            </span>
                            <span className="text-blue-300 text-xs tabular-nums shrink-0">
                              {o.percent}%
                            </span>
                          </div>
                          {o.category && (
                            <span className="text-white/45 text-[11px] tracking-[0.2em] uppercase">
                              {o.category}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </aside>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      {sections.length > 0 && (
        <section className="bg-[#000202] pb-16 md:pb-24">
          <div className="container">
            <div className="max-w-3xl mx-auto flex flex-col gap-12 md:gap-16">
              {sections.map((s, i) => (
                <FadeIn key={i}>
                  <article>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-[2px] w-10 rounded-full bg-blue-400" />
                      <span className="text-blue-300 text-[10px] tracking-[0.35em] uppercase font-medium">
                        Section {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h2
                      className="leading-[1.1] mb-4"
                      style={{
                        color: "#ffffff",
                        background: "none",
                        WebkitTextFillColor: "#ffffff",
                        fontSize: "clamp(26px, 3vw, 40px)",
                      }}
                    >
                      {s.title}
                    </h2>
                    {s.body.split(/\n\s*\n/).map((p, j) => (
                      <p
                        key={j}
                        className="text-white/72 leading-relaxed mb-4"
                        style={{ fontSize: "clamp(15px, 1.05vw, 17px)", lineHeight: 1.8 }}
                      >
                        {p}
                      </p>
                    ))}
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="py-16 md:py-20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #050A18 0%, #0E1628 60%, #1a3392 130%)",
        }}
      >
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <FadeIn>
            <h2
              className="leading-[1.1] mb-6"
              style={{
                color: "#ffffff",
                background: "none",
                WebkitTextFillColor: "#ffffff",
                fontSize: "clamp(28px, 3.5vw, 44px)",
                letterSpacing: "-0.02em",
              }}
            >
              Have a research challenge of your own?
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-white/70 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              If you're working on something the rest of the industry hasn't
              figured out yet, we'd love to hear about it.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <MyButton
              text="GET IN TOUCH"
              variant="primary"
              onClick={() => navigate("/contact")}
            />
          </FadeIn>
        </div>
      </section>

      {/* Pre-CTA proof block */}
      <PreCtaSections />
    </>
  );
};

export default RDResearchDetailPage;
