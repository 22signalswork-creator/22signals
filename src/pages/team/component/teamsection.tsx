import React, { useEffect, useState } from "react";
import Valuicon from "@/assets/valueicon.png";
import CEOPortrait from "@/assets/Potrait_DaniyalMansur.png";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";
import { supabase } from "@/lib/supabase";

/**
 * Team section.
 *
 * Layout:
 *  1. "MEET THE TEAM" big single-line heading at top + intro paragraph below.
 *  2. CEO featured block — portrait left, name/role/full bio right.
 *     This block is HARDCODED to Daniyal (does not change with admin).
 *  3. "Rest of the Team" grid — admin-controlled from /admin/team-members.
 *     Skips the CEO row (matches by name) so it doesn't appear twice.
 *  4. Values cards (unchanged).
 *
 * No FAQ on team page.
 */

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
}

// Hardcoded CEO — NOT pulled from CMS
const CEO: TeamMember = {
  name: "Daniyal Mansur",
  role: "Founder & CEO",
  bio: `Daniyal's entrepreneurial journey is defined by a relentless pursuit of perfection, and a profound passion for building exciting technology. Fueled by a lifelong curiosity that began with deep-diving into digital landscapes as a child, he quickly established himself in the industry. At a young age, Daniyal spearheaded regional operations for a pioneering startup, managing global projects and executing high-stakes partnerships with industry titans. His ability to identify market opportunities and lead diverse teams naturally evolved into driving comprehensive digital transformation for prestigious international firms. Today, he channels that exact innovative energy into founding 22 Signals. His definitive goal is to push the boundaries of what is possible, engineering and developing the very technology that will lead the future. A strategist at heart, Daniyal backs his hands-on entrepreneurial success with a Master's in Business Analytics from Queen Mary University of London.`,
  image_url: CEOPortrait,
};

const values = [
  {
    title: "Analytical Precision",
    desc: "Every strategy and execution plan is rooted in data, ensuring measurable results and optimized workflows.",
  },
  {
    title: "Competitive Excellence",
    desc: "Forged in the high-stakes environment, our team operates with speed, adaptability, and a drive to win.",
  },
  {
    title: "Strategic Alignment",
    desc: "Harness top talent to achieve your specific business goals.",
  },
  {
    title: "Collaboration",
    desc: "We provide the digital transformation and operational support you need, functioning as a flawless extension of your own internal team.",
  },
];

export default function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    supabase
      .from("team_members")
      .select("id, name, role, bio, image_url")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) {
          // Filter out the CEO so we don't duplicate them — match by name (case-insensitive)
          const filtered = (data as TeamMember[]).filter(
            (m) => m.name?.toLowerCase().trim() !== CEO.name.toLowerCase().trim()
          );
          setTeam(filtered);
        }
      });
  }, []);

  const bioParagraphs = (CEO.bio || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="relative bg-black text-white overflow-hidden">
      {/* Background atmospherics */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(80,140,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(80,140,255,0.6) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(50,95,236,0.18) 0%, rgba(50,95,236,0) 65%)",
          filter: "blur(50px)",
          transform: "translate(25%, -35%)",
        }}
      />

      {/* ============================================== */}
      {/*  HEADING — MEET THE TEAM single line on its own */}
      {/* ============================================== */}
      <div className="container relative z-10 pt-16 md:pt-24 pb-8 md:pb-10">
        <FadeIn>
          <div className="flex items-center gap-3 mb-7">
            <div className="h-[2px] w-12 rounded-full bg-blue-400" />
            <span className="text-blue-300 text-[11px] tracking-[0.4em] uppercase font-medium">
              Our Team
            </span>
          </div>
        </FadeIn>

        <RisingText>
          <h1
            className="font-bold leading-[0.95] tracking-tight whitespace-nowrap"
            style={{
              fontSize: "clamp(28px, 8vw, 124px)",
              letterSpacing: "-0.035em",
              background: "linear-gradient(91deg, #325FEC 0%, #FFFFFF 50%, #325FEC 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            MEET THE TEAM
          </h1>
        </RisingText>

        {/* Intro paragraph — relocated from beside the CEO portrait per brief
            so it sits directly under the big MEET THE TEAM heading. */}
        <FadeIn delay={0.1}>
          <p
            className="text-white/75 leading-relaxed mt-6 md:mt-8 max-w-3xl"
            style={{ fontSize: "clamp(15px, 1.1vw, 18px)" }}
          >
            As a result of our diverse experience, we are able to think
            creatively and find new solutions to problems — providing clients
            with memorable, purpose-driven experiences that cut through the
            noise and connect where it matters.
          </p>
        </FadeIn>
      </div>

      {/* ============================================== */}
      {/*  CEO BLOCK — Portrait + (intro + bio) side-by-side */}
      {/*  HARDCODED, never changed by CMS                */}
      {/* ============================================== */}
      <div className="container relative z-10 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-14 items-start">
          {/* Portrait */}
          <FadeIn>
            <div className="relative w-full max-w-[460px] mx-auto lg:mx-0">
              <div
                className="absolute inset-0 rounded-[28px]"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, rgba(50,95,236,0.55) 0%, rgba(50,95,236,0) 65%)",
                  filter: "blur(50px)",
                  transform: "scale(1.05)",
                }}
              />

              <div
                className="absolute -top-3 -left-3 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full"
                style={{
                  background: "rgba(0,0,0,0.7)",
                  border: "1px solid rgba(80,140,255,0.5)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400" />
                </span>
                <span className="text-[10px] tracking-[0.35em] uppercase text-blue-100 font-medium">
                  01 · Founder
                </span>
              </div>

              <div
                className="relative rounded-[28px] overflow-hidden"
                style={{
                  aspectRatio: "4 / 5",
                  background:
                    "linear-gradient(180deg, rgba(50,95,236,0.25) 0%, rgba(10,15,40,0.85) 50%, rgba(0,0,0,1) 100%)",
                  border: "1px solid rgba(80,140,255,0.28)",
                  boxShadow:
                    "0 40px 100px -30px rgba(50,95,236,0.55), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                <img
                  src={CEO.image_url}
                  alt={CEO.name}
                  className="relative w-full h-full object-cover object-top"
                  draggable={false}
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,1) 100%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 px-7 pb-7 z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-[1px] w-10 bg-blue-300/70" />
                    <span className="text-blue-200/90 text-[10px] tracking-[0.35em] uppercase">
                      Signed
                    </span>
                  </div>
                  <div
                    className="text-2xl md:text-3xl font-medium leading-tight"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {CEO.name}
                  </div>
                  <div className="text-blue-200/80 text-sm mt-1">{CEO.role}</div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Description / bio next to portrait */}
          <FadeIn delay={0.1}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-10 rounded-full bg-blue-400" />
                <span className="text-blue-300 text-[10px] tracking-[0.35em] uppercase font-medium">
                  The Profile
                </span>
              </div>

              <h2
                className="font-medium leading-[1.05] mb-2"
                style={{
                  fontSize: "clamp(32px, 4vw, 48px)",
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  WebkitTextFillColor: "#ffffff",
                  background: "none",
                }}
              >
                {CEO.name}
              </h2>
              <p
                className="mb-7"
                style={{
                  background: "linear-gradient(90deg, #93b8ff 0%, #ffffff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: "clamp(15px, 1.3vw, 18px)",
                }}
              >
                {CEO.role}
              </p>

              <div className="flex flex-col gap-4">
                {bioParagraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-white/72 leading-relaxed"
                    style={{ fontSize: "clamp(14px, 1vw, 16px)", lineHeight: 1.7 }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ============================================== */}
      {/*  REST OF THE TEAM — admin-controlled grid       */}
      {/* ============================================== */}
      {team.length > 0 && (
        <div className="container relative z-10 pb-20 md:pb-28">
          <FadeIn>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[2px] w-12 rounded-full bg-blue-400" />
              <span className="text-blue-300 text-[11px] tracking-[0.4em] uppercase font-medium">
                Rest of the Team
              </span>
            </div>
            <h2
              className="leading-[1.05] mb-12"
              style={{
                fontSize: "clamp(32px, 4vw, 56px)",
                letterSpacing: "-0.02em",
                color: "#ffffff",
                WebkitTextFillColor: "#ffffff",
                background: "none",
              }}
            >
              The People Behind 22 Signals
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map((m, i) => (
              <FadeIn key={m.id ?? i} delay={i * 0.05}>
                <div
                  className="rounded-2xl overflow-hidden group transition-all"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(50,95,236,0.10) 0%, rgba(255,255,255,0.02) 100%)",
                    border: "1px solid rgba(80,140,255,0.15)",
                  }}
                >
                  <div
                    className="relative w-full overflow-hidden"
                    style={{ aspectRatio: "4 / 5", background: "#0a1428" }}
                  >
                    {m.image_url ? (
                      <img
                        src={m.image_url}
                        alt={m.name}
                        className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(50,95,236,0.25) 0%, rgba(50,95,236,0) 70%)",
                        }}
                      >
                        <span className="text-4xl font-light text-white/40">
                          {m.name?.[0] || "?"}
                        </span>
                      </div>
                    )}
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)",
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <h3
                      className="text-xl text-white font-medium mb-1 leading-tight"
                      style={{
                        WebkitTextFillColor: "#ffffff",
                        background: "none",
                      }}
                    >
                      {m.name}
                    </h3>
                    <p className="text-blue-300/80 text-sm">{m.role}</p>
                    {m.bio && (
                      <p className="text-white/55 text-xs leading-relaxed mt-3 line-clamp-3">
                        {m.bio}
                      </p>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      )}

      {/* ============================================== */}
      {/*  VALUES CARDS                                  */}
      {/* ============================================== */}
      <div className="container relative z-10 flex flex-col gap-16 md:gap-20 pb-20 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 items-start">
          <div>
            <h2>The DNA of Our Standard.</h2>
          </div>
          <div>
            <p className="white-text">
              Our operational framework is built on precision, speed, and
              cross-departmental excellence to help you lead your market.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {values.map((value, i) => (
            <FadeIn key={i}>
              <Cardhovereffect>
                <div
                  style={{
                    background:
                      "linear-gradient(121.9deg, #1C1C1C 0%, #050505 96.81%)",
                    border: "1px solid #FFFFFF",
                  }}
                  className="rounded-[20px] p-6 flex flex-col gap-4 h-full"
                >
                  <img src={Valuicon} width={"66px"} alt="" />
                  <h1 className="teamcard-title">{value.title}</h1>
                  <p className="text-white text-left flex-grow">{value.desc}</p>
                </div>
              </Cardhovereffect>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
