import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import "../../../pages/home/home.css";
import "../../services/work.css";

/**
 * Portfolio Tabs — renders project cards from `project_detail_pages`.
 *
 * Each card links to /portfolio/<slug> for the full case study.
 * Falls back to the legacy hardcoded `projects` prop if the table is
 * empty or unreachable, so the site keeps working during migration.
 */

interface DetailRow {
  slug: string;
  client_name: string;
  card_text: string | null;
  category: string | null;
  cover_image: string | null;
  /**
   * Optional discipline tags (e.g. ["SEO", "AI", "Web Development"]) used as
   * small chips on the portfolio card. Stored as a JSONB array in
   * `project_detail_pages.tags`.
   */
  tags: string[] | string | null;
  sort_order: number;
}

// Legacy shape kept for backward compatibility (existing imports still work).
export interface LegacyProject {
  title: string;
  description: string;
  bigImage: string;
  category: string;
}

interface TabsProps {
  /** Optional fallback projects (legacy hardcoded list) */
  projects?: LegacyProject[];
}

const TABS = [
  "All",
  "Digital & AI",
  "Creative & Marketing",
  "Broadcasting & Esports",
  "Manufacturing",
  "Outsourcing",
  "Game Development",
  "Trading & Investments (Coming Soon)",
];

const Tabs: React.FC<TabsProps> = ({ projects: fallback = [] }) => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const tabsRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<DetailRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("project_detail_pages")
      .select("slug, client_name, card_text, category, cover_image, tags, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setRows(data as DetailRow[]);
        setLoading(false);
      });
  }, []);

  // If table empty/unreachable, fall back to legacy hardcoded projects (no detail link)
  const useFallback = !loading && rows.length === 0 && fallback.length > 0;

  const visible = useFallback
    ? activeTab === "All"
      ? fallback
      : fallback.filter((p) => p.category === activeTab)
    : activeTab === "All"
    ? rows
    : rows.filter((p) => p.category === activeTab);

  const scrollLeft = () =>
    tabsRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  const scrollRight = () =>
    tabsRef.current?.scrollBy({ left: 200, behavior: "smooth" });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Tabs with chevrons */}
      <div className="tabs-container">
        <div className="tabs">
          <button
            className="chevron-button"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            ‹
          </button>
          <div
            ref={tabsRef}
            className="tabs-scroll flex gap-4 overflow-x-auto scrollbar-hide"
          >
            {TABS.map((tab) => {
              const isComingSoon = tab.includes("Coming Soon");
              return (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => !isComingSoon && setActiveTab(tab)}
                  style={
                    isComingSoon ? { opacity: 0.55, cursor: "not-allowed" } : {}
                  }
                >
                  {tab}
                </button>
              );
            })}
          </div>
          <button
            className="chevron-button"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="tab-content grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {loading ? (
          <p className="text-gray-400 col-span-full text-center py-20">
            Loading projects…
          </p>
        ) : visible.length > 0 ? (
          useFallback ? (
            // Legacy fallback path — keeps the original card UI when table is empty
            (visible as LegacyProject[]).map((p, i) => (
              <LegacyCard key={i} project={p} />
            ))
          ) : (
            (visible as DetailRow[]).map((row) => (
              <DetailCard key={row.slug} row={row} />
            ))
          )
        ) : (
          <p className="text-gray-400 col-span-full text-center py-20">
            No projects found in <strong>{activeTab}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default Tabs;

// ============================================================
// Card components
// ============================================================

const gradientBg =
  "linear-gradient(98.35deg, #325FEC -98.47%, #000000 3.34%, #000000 46.77%, #325FEC 145.86%)";

/**
 * Tags can come back from Supabase as either a real JS array (typical) or
 * a string (rare — when a JSONB column gets stringified). This normalizes
 * both shapes so the card always sees a string[].
 */
const parseTags = (raw: string[] | string | null | undefined): string[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === "string") {
    try {
      const x = JSON.parse(raw);
      return Array.isArray(x) ? (x.filter(Boolean) as string[]) : [];
    } catch {
      // Comma-separated fallback: "SEO, AI, Web Dev"
      return raw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }
  return [];
};

/** Small chip used on portfolio cards to show discipline tags. */
const TagChip: React.FC<{ label: string }> = ({ label }) => (
  <span
    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] tracking-[0.15em] uppercase"
    style={{
      background: "rgba(80,140,255,0.15)",
      border: "1px solid rgba(80,140,255,0.4)",
      color: "#bcd0ff",
    }}
  >
    {label}
  </span>
);

const DetailCard: React.FC<{ row: DetailRow }> = ({ row }) => {
  const tags = parseTags(row.tags);

  return (
  <Link
    to={`/portfolio/${row.slug}`}
    className="block group no-underline"
    style={{ textDecoration: "none" }}
  >
    {/* Desktop */}
    <div
      className="glass-card rounded-2xl relative overflow-hidden my-4 min-h-[307px] h-auto md:h-[307px] w-full md:mr-4 p-4 md:p-6 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 md:gap-6 items-center hidden md:grid transition-transform duration-300 group-hover:-translate-y-1"
      style={{ background: gradientBg }}
    >
      {row.cover_image && (
        <div
          className="absolute bottom-0 md:left-auto md:translate-x-6 md:right-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${row.cover_image})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center bottom",
            backgroundSize: "contain",
            width: "100%",
            maxWidth: "400px",
            height: "200px",
          }}
        />
      )}

      <div className="flex flex-col justify-between h-full relative z-10">
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-[20px] pt-2 md:pt-[10px]">
          {row.category && <span className="badge">{row.category}</span>}
          <h2 className="recentproject-title">{row.client_name}</h2>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 4).map((t) => (
                <TagChip key={t} label={t} />
              ))}
            </div>
          )}
        </div>
        {row.card_text && (
          <p className="mt-2 sm:mt-3 md:mt-2">{row.card_text}</p>
        )}
      </div>

      <div className="flex flex-col items-end justify-start space-y-2 md:space-y-4 relative z-10">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full transition-transform duration-300 group-hover:rotate-45"
          style={{
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.20)",
            color: "#ffffff",
            fontSize: "18px",
          }}
        >
          ↗
        </div>
      </div>
    </div>

    {/* Mobile */}
    <div className="block md:hidden">
      <div
        className="glass-card rounded-2xl relative overflow-hidden my-4 px-4 pt-6 flex flex-col gap-3"
        style={{ background: gradientBg }}
      >
        <div className="flex flex-col gap-2">
          {row.category && <span className="badge">{row.category}</span>}
          <h2 className="recentproject-title">{row.client_name}</h2>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 4).map((t) => (
                <TagChip key={t} label={t} />
              ))}
            </div>
          )}
          {row.card_text && <p className="mt-1">{row.card_text}</p>}
          <div
            className="absolute top-6 right-2 w-10 h-10 flex items-center justify-center rounded-full"
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.20)",
              color: "#ffffff",
            }}
          >
            ↗
          </div>
        </div>
        {row.cover_image && (
          <div className="relative flex justify-center mt-2">
            <img
              src={row.cover_image}
              alt={row.client_name}
              className="w-full max-w-[500px] h-auto object-contain"
            />
          </div>
        )}
      </div>
    </div>
  </Link>
  );
};

const LegacyCard: React.FC<{ project: LegacyProject }> = ({ project }) => (
  <>
    {/* Desktop */}
    <div
      className="glass-card rounded-2xl relative overflow-hidden my-4 group min-h-[307px] h-auto md:h-[307px] w-full md:mr-4 p-4 md:p-6 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 md:gap-6 items-center hidden md:grid"
      style={{ background: gradientBg }}
    >
      <div
        className="absolute bottom-0 md:left-auto md:translate-x-6 md:right-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${project.bigImage})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center bottom",
          backgroundSize: "contain",
          width: "100%",
          maxWidth: "400px",
          height: "200px",
        }}
      />
      <div className="flex flex-col justify-between h-full relative z-10">
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-[30px] pt-2 md:pt-[10px]">
          <span className="badge">{project.category}</span>
          <h2 className="recentproject-title">{project.title}</h2>
        </div>
        <p className="mt-2 sm:mt-3 md:mt-2">{project.description}</p>
      </div>
    </div>

    {/* Mobile */}
    <div className="block md:hidden">
      <div
        className="glass-card rounded-2xl relative overflow-hidden my-4 px-4 pt-6 flex flex-col gap-4"
        style={{ background: gradientBg }}
      >
        <div className="flex flex-col gap-2">
          <span className="badge">{project.category}</span>
          <h2 className="recentproject-title">{project.title}</h2>
          <p className="mt-1">{project.description}</p>
        </div>
        <div className="relative flex justify-center mt-2">
          <img
            src={project.bigImage}
            alt={project.title}
            className="w-full max-w-[500px] h-auto object-contain"
          />
        </div>
      </div>
    </div>
  </>
);
