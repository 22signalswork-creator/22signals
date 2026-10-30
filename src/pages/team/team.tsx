/**
 * Team page: founder first, then every team member as a card in a filterable
 * grid. Real members come from the `team_members` table (admin). Until the
 * team is filled in, sample cards show the layout; switch SHOW_SAMPLES off
 * (or add real members) before this goes live.
 */
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "@/index.css";
import HeroSection from "./component/hero-section.tsx";
import FadeIn from "@/transitions/FadeIn";
import { supabase } from "@/lib/supabase";
import CEOPortrait from "@/assets/Potrait_DaniyalMansur.webp";

// Sample cards: on for the preview, off before launch.
const SHOW_SAMPLES = true;

type Member = {
  id?: string;
  name: string;
  role: string;
  team?: string;
  image_url?: string | null;
  linkedin?: string | null;
  sample?: boolean;
};

const TEAMS = ["Strategy", "AI and Engineering", "Data and Cloud", "Growth Marketing", "Creative Studio", "Operations"];

const SAMPLES: Member[] = [
  { name: "Team member", role: "Head of Strategy", team: "Strategy" },
  { name: "Team member", role: "Project Lead", team: "Operations" },
  { name: "Team member", role: "AI Engineer", team: "AI and Engineering" },
  { name: "Team member", role: "Senior Full Stack Developer", team: "AI and Engineering" },
  { name: "Team member", role: "App Developer", team: "AI and Engineering" },
  { name: "Team member", role: "Data Engineer", team: "Data and Cloud" },
  { name: "Team member", role: "Cloud and DevOps Engineer", team: "Data and Cloud" },
  { name: "Team member", role: "SEO and GEO Lead", team: "Growth Marketing" },
  { name: "Team member", role: "Paid Media Specialist", team: "Growth Marketing" },
  { name: "Team member", role: "Social Media Manager", team: "Growth Marketing" },
  { name: "Team member", role: "Motion Designer", team: "Creative Studio" },
  { name: "Team member", role: "3D Artist", team: "Creative Studio" },
].map((m) => ({ ...m, sample: true }));

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const MemberCard: React.FC<{ m: Member }> = ({ m }) => (
  <div className="group">
    <div
      className="relative rounded-[20px] overflow-hidden"
      style={{
        aspectRatio: "4 / 5",
        background: "linear-gradient(180deg, rgba(50,95,236,0.22) 0%, rgba(10,15,40,0.9) 60%, #02040d 100%)",
        border: "1px solid rgba(80,140,255,0.22)",
      }}
    >
      {m.image_url ? (
        <img
          src={m.image_url}
          alt={`${m.name}, ${m.role} at 22 Signals`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg aria-hidden width="46%" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="36" r="18" stroke="rgba(147,184,255,0.45)" strokeWidth="1.5" />
            <path d="M16 92c4-20 18-30 34-30s30 10 34 30" stroke="rgba(147,184,255,0.45)" strokeWidth="1.5" />
          </svg>
          {!m.sample && (
            <span className="absolute text-3xl text-white/80" style={{ letterSpacing: "0.05em" }}>
              {initials(m.name)}
            </span>
          )}
        </div>
      )}
      {m.team && (
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] tracking-[0.15em] uppercase"
          style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(147,184,255,0.3)", color: "#bcd0ff", backdropFilter: "blur(6px)" }}
        >
          {m.team}
        </span>
      )}
      {m.linkedin && (
        <a
          href={m.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${m.name} on LinkedIn`}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs"
          style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.25)" }}
        >
          in
        </a>
      )}
    </div>
    <div className="pt-4">
      <div className="text-white text-[18px] leading-tight">{m.name}</div>
      <div className="mt-1 text-[14px]" style={{ color: "rgba(255,255,255,0.55)" }}>
        {m.role}
      </div>
    </div>
  </div>
);

const Team: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    document.body.classList.add("team-page");
    return () => document.body.classList.remove("team-page");
  }, []);

  useEffect(() => {
    supabase
      .from("team_members")
      .select("id, name, role, image_url")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        const real = ((data as Member[]) || []).filter((m) => m.name?.toLowerCase().trim() !== "daniyal mansur");
        setMembers(real);
      });
  }, []);

  const all = useMemo(() => [...members, ...(SHOW_SAMPLES ? SAMPLES : [])], [members]);
  const tabs = ["All", ...TEAMS.filter((t) => all.some((m) => m.team === t))];
  const visible = filter === "All" ? all : all.filter((m) => m.team === filter);

  return (
    <div>
      <HeroSection titleAs="h1" title="Meet the team." subtitle="Strategists, engineers, marketers and creatives working as one team." />

      <section className="relative bg-black text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(80,140,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(80,140,255,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="container relative z-10 py-16 md:py-24">
          {/* Leadership */}
          <FadeIn>
            <div className="text-blue-300 text-[11px] tracking-[0.35em] uppercase mb-6">Leadership</div>
            <Link
              to="/about/daniyal-mansur"
              className="group grid grid-cols-1 md:grid-cols-[minmax(0,300px)_1fr] gap-6 md:gap-12 items-center no-underline rounded-[24px] p-4 md:p-6"
              style={{ textDecoration: "none", background: "rgba(50,95,236,0.06)", border: "1px solid rgba(80,140,255,0.2)" }}
            >
              <div className="rounded-[18px] overflow-hidden" style={{ aspectRatio: "4 / 5", background: "#0a1230" }}>
                <img src={CEOPortrait} alt="Daniyal Mansur, founder and CEO of 22 Signals" className="w-full h-full object-cover object-top" />
              </div>
              <div className="pb-2">
                <div className="text-[13px] tracking-[0.2em] uppercase" style={{ color: "#93b8ff" }}>
                  Founder and CEO
                </div>
                <div className="mt-3 text-white" style={{ fontSize: "clamp(30px, 3.4vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
                  Daniyal Mansur
                </div>
                <p className="mt-4 max-w-lg text-[16px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Sets the direction for 22 Signals and works with clients on strategy, AI and growth.
                </p>
                <span className="inline-flex items-center gap-2 mt-6 text-blue-300 group-hover:text-white text-xs tracking-[0.25em] uppercase transition-colors">
                  Read his story <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </FadeIn>

          {/* Everyone else */}
          <div className="mt-20 md:mt-28">
            <FadeIn>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                <h2 className="whitespace-nowrap shrink-0" style={{ margin: 0, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 400, lineHeight: 1.1 }}>The team.</h2>
                <div className="flex flex-wrap md:justify-end gap-2" role="tablist" aria-label="Filter by team">
                  {tabs.map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="tab"
                      aria-selected={filter === t}
                      onClick={() => setFilter(t)}
                      className="rounded-full px-4 py-2 text-[13px] transition-colors"
                      style={{
                        background: filter === t ? "#325FEC" : "transparent",
                        color: filter === t ? "#ffffff" : "rgba(255,255,255,0.7)",
                        border: `1px solid ${filter === t ? "#325FEC" : "rgba(255,255,255,0.18)"}`,
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
              {visible.map((m, i) => (
                <FadeIn key={(m.id || m.role) + i} delay={(i % 4) * 0.05}>
                  <MemberCard m={m} />
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
