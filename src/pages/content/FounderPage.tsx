/**
 * /about/daniyal-mansur: founder page in the Team page design.
 * Portrait card (same as the founder block on /team), key numbers,
 * a short story in sections and a timeline.
 */
import React from "react";
import { Link } from "react-router-dom";
import CEOPortrait from "@/assets/Potrait_DaniyalMansur.webp";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";
import MyButton from "@/components/CustomButton";
import { openCalendly } from "@/lib/calendly";

type Section = { id?: string; h: string; p?: string[]; list?: string[] };
type FounderData = { eyebrow: string; h1: string; intro: string; sections: Section[] };

const LINKEDIN = "https://www.linkedin.com/in/daniyal-mansur/";
const split = (s: string) => {
  const i = s.indexOf("|");
  return i > 0 ? [s.slice(0, i), s.slice(i + 1)] : [s, ""];
};

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="h-[2px] w-10 rounded-full bg-blue-400" />
    <span className="text-blue-300 text-[10px] tracking-[0.35em] uppercase font-medium">{children}</span>
  </div>
);

export const PortraitCard: React.FC<{ badge?: string }> = ({ badge = "01 · Founder" }) => (
  <div className="relative w-full max-w-[460px] mx-auto lg:mx-0">
    <div
      className="absolute inset-0 rounded-[28px]"
      style={{
        background: "radial-gradient(circle at 50% 40%, rgba(50,95,236,0.55) 0%, rgba(50,95,236,0) 65%)",
        filter: "blur(50px)",
        transform: "scale(1.05)",
      }}
    />
    <div
      className="absolute -top-3 -left-3 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full"
      style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(80,140,255,0.5)", backdropFilter: "blur(8px)" }}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400" />
      </span>
      <span className="text-[10px] tracking-[0.35em] uppercase text-blue-100 font-medium">{badge}</span>
    </div>
    <div
      className="relative rounded-[28px] overflow-hidden"
      style={{
        aspectRatio: "4 / 5",
        background: "linear-gradient(180deg, rgba(50,95,236,0.25) 0%, rgba(10,15,40,0.85) 50%, rgba(0,0,0,1) 100%)",
        border: "1px solid rgba(80,140,255,0.28)",
        boxShadow: "0 40px 100px -30px rgba(50,95,236,0.55), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
    >
      <img src={CEOPortrait} alt="Daniyal Mansur, founder and CEO of 22 Signals" className="relative w-full h-full object-cover object-top" draggable={false} />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,1) 100%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 px-7 pb-7 z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-[1px] w-10 bg-blue-300/70" />
          <span className="text-blue-200/90 text-[10px] tracking-[0.35em] uppercase">Signed</span>
        </div>
        <div className="text-2xl md:text-3xl font-medium leading-tight text-white" style={{ letterSpacing: "-0.01em" }}>
          Daniyal Mansur
        </div>
        <div className="text-blue-200/80 text-sm mt-1">Founder &amp; CEO</div>
      </div>
    </div>
  </div>
);

const FounderPage: React.FC<{ page: FounderData }> = ({ page }) => {
  const facts = page.sections.find((s) => s.id === "facts");
  const timeline = page.sections.find((s) => s.id === "timeline");
  const story = page.sections.filter((s) => !s.id && s.h !== "Talk to Daniyal");
  const talk = page.sections.find((s) => s.h === "Talk to Daniyal");

  return (
    <section className="relative bg-black text-white overflow-hidden pt-40 md:pt-48 pb-20 md:pb-28">
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
        style={{ background: "radial-gradient(circle, rgba(50,95,236,0.18) 0%, rgba(50,95,236,0) 65%)", filter: "blur(50px)", transform: "translate(25%, -35%)" }}
      />

      <div className="container relative z-10">
        <FadeIn>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-blue-300/80 hover:text-blue-200 text-xs tracking-[0.25em] uppercase mb-10 transition-colors group no-underline"
          >
            <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
            About 22 Signals
          </Link>
        </FadeIn>

        {/* Portrait + intro */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-14 items-center">
          <FadeIn>
            <PortraitCard />
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="max-w-2xl">
              <Label>{page.eyebrow}</Label>
              <RisingText>
                <h1
                  className="font-bold leading-[0.95] tracking-tight mb-6"
                  style={{
                    fontSize: "clamp(44px, 6vw, 96px)",
                    letterSpacing: "-0.035em",
                    background: "linear-gradient(91deg, #325FEC 0%, #FFFFFF 50%, #325FEC 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    display: "block",
                  }}
                >
                  {page.h1}
                </h1>
              </RisingText>
              <p className="leading-relaxed mb-10" style={{ fontSize: "clamp(16px, 1.3vw, 20px)", color: "rgba(255,255,255,0.8)" }}>
                {page.intro}
              </p>
              <div className="flex flex-wrap items-center gap-5">
                <MyButton text="BOOK A CALL" variant="primary" onClick={() => openCalendly()} />
                <a
                  href={LINKEDIN}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="text-white/70 hover:text-white text-xs tracking-[0.25em] uppercase transition-colors group inline-flex items-center gap-2 no-underline"
                >
                  Connect on LinkedIn
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Key numbers, in the team value-card style */}
        {facts?.list && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch mt-20 md:mt-28">
            {facts.list.map((f, i) => {
              const [value, label] = split(f);
              return (
                <FadeIn key={i} delay={i * 0.05}>
                  <Cardhovereffect>
                    <div
                      className="rounded-[20px] p-6 flex flex-col gap-3 h-full"
                      style={{ background: "linear-gradient(121.9deg, #1C1C1C 0%, #050505 96.81%)", border: "1px solid rgba(255,255,255,0.6)" }}
                    >
                      <div
                        className="font-light leading-none"
                        style={{
                          fontSize: value.length > 8 ? "34px" : "48px",
                          background: "linear-gradient(91.16deg, #325FEC 1.74%, #FFFFFF 50%, #325FEC 102.48%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {value}
                      </div>
                      <div className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                        {label}
                      </div>
                    </div>
                  </Cardhovereffect>
                </FadeIn>
              );
            })}
          </div>
        )}

        {/* Story: one readable column, like an article */}
        <div className="max-w-3xl mx-auto mt-20 md:mt-28 flex flex-col gap-14">
          {story.map((s, idx) => (
            <React.Fragment key={s.h}>
              <FadeIn>
                <div>
                  <h2
                    className="mb-5"
                    style={{
                      fontSize: "clamp(24px, 2.2vw, 34px)",
                      lineHeight: 1.2,
                      fontWeight: 400,
                      padding: 0,
                      color: "#ffffff",
                      WebkitTextFillColor: "#ffffff",
                      background: "none",
                    }}
                  >
                    {s.h}
                  </h2>
                  <div className="flex flex-col gap-5">
                    {(s.p || []).map((t, i) => (
                      <p key={i} className="leading-relaxed" style={{ fontSize: "clamp(16px, 1.2vw, 19px)", color: "rgba(255,255,255,0.78)" }}>
                        {t}
                      </p>
                    ))}
                  </div>
                </div>
              </FadeIn>
              {idx === 0 && (
                <FadeIn>
                  <blockquote className="m-0 pl-6 md:pl-8 border-l-2 border-[#325FEC]">
                    <p
                      style={{
                        fontSize: "clamp(24px, 2.6vw, 40px)",
                        lineHeight: 1.25,
                        fontWeight: 300,
                        background: "linear-gradient(91.16deg, #325FEC 1.74%, #FFFFFF 50%, #93b8ff 102.48%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        margin: 0,
                      }}
                    >
                      "The companies that win don't always have the best idea. They're the ones that execute faster and adapt before everyone else does."
                    </p>
                  </blockquote>
                </FadeIn>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Timeline */}
        {timeline?.list && (
          <FadeIn>
            <div className="mt-20 md:mt-28">
              <Label>{timeline.h}</Label>
              <div className="relative mt-8">
                <div className="absolute left-0 right-0 top-[7px] h-px bg-blue-400/30 hidden md:block" />
                <ol className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-6 list-none p-0 m-0">
                  {timeline.list.map((t, i) => {
                    const [year, text] = split(t);
                    return (
                      <li key={i} className="relative md:pt-8 pl-6 md:pl-0">
                        <span
                          className="absolute left-0 top-1 md:top-0 w-[15px] h-[15px] rounded-full"
                          style={{ background: i === timeline.list!.length - 1 ? "#325FEC" : "#000", border: "2px solid #6B92FF" }}
                        />
                        <div className="text-blue-300 text-sm tracking-[0.2em] uppercase mb-2">{year}</div>
                        <div className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                          {text}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </FadeIn>
        )}

        {talk && (
          <FadeIn>
            <div
              className="mt-20 md:mt-28 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
              style={{ background: "linear-gradient(135deg, rgba(50,95,236,0.18) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(80,140,255,0.3)" }}
            >
              <div>
                <h2 style={{ fontSize: "clamp(26px, 2.6vw, 40px)", lineHeight: 1.15 }}>{talk.h}</h2>
                <p className="mt-3" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {talk.p?.[0]}
                </p>
              </div>
              <MyButton text="BOOK A CALL" variant="primary" onClick={() => openCalendly()} />
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
};

export default FounderPage;
