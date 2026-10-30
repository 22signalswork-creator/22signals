/**
 * Team page: every member as a card in one grid, founder first. Real members come from the `team_members` table (admin). Until the
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
  href?: string;
};

const FOUNDER: Member = {
  name: "Daniyal Mansur",
  role: "Founder and CEO",
  team: "Leadership",
  image_url: CEOPortrait,
  href: "/about/daniyal-mansur",
};

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

const MemberCard: React.FC<{ m: Member }> = ({ m }) => {
  const body = (
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
  return m.href ? (
    <Link to={m.href} className="block no-underline" style={{ textDecoration: "none" }} aria-label={`${m.name}, ${m.role}`}>
      {body}
    </Link>
  ) : (
    body
  );
};

const Team: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);

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

  const visible = useMemo(() => [FOUNDER, ...members, ...(SHOW_SAMPLES ? SAMPLES : [])], [members]);

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
          {/* Everyone, founder first */}
          <div>

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
