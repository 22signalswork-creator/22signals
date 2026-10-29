/**
 * /about/daniyal-mansur: short founder page in the Team page design
 * (same portrait card as the founder block on /team and /about).
 */
import React from "react";
import { Link } from "react-router-dom";
import CEOPortrait from "@/assets/Potrait_DaniyalMansur.webp";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import MyButton from "@/components/CustomButton";
import { openCalendly } from "@/lib/calendly";

type Section = { h: string; p?: string[] };
type FounderData = { eyebrow: string; h1: string; intro: string; sections: Section[] };

const LINKEDIN = "https://www.linkedin.com/in/daniyal-mansur/";

const FounderPage: React.FC<{ page: FounderData }> = ({ page }) => (
  <section className="relative bg-black text-white overflow-hidden pt-32 md:pt-40 pb-20 md:pb-28">
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
        background: "radial-gradient(circle, rgba(50,95,236,0.18) 0%, rgba(50,95,236,0) 65%)",
        filter: "blur(50px)",
        transform: "translate(25%, -35%)",
      }}
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

      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-14 items-start">
        {/* Portrait card, same as the founder block on the team page */}
        <FadeIn>
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
              <span className="text-[10px] tracking-[0.35em] uppercase text-blue-100 font-medium">01 · Founder</span>
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
              <img
                src={CEOPortrait}
                alt="Daniyal Mansur, founder and CEO of 22 Signals"
                className="relative w-full h-full object-cover object-top"
                draggable={false}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,1) 100%)" }}
              />
              <div className="absolute inset-x-0 bottom-0 px-7 pb-7 z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-[1px] w-10 bg-blue-300/70" />
                  <span className="text-blue-200/90 text-[10px] tracking-[0.35em] uppercase">Signed</span>
                </div>
                <div className="text-2xl md:text-3xl font-medium leading-tight" style={{ letterSpacing: "-0.01em" }}>
                  Daniyal Mansur
                </div>
                <div className="text-blue-200/80 text-sm mt-1">Founder &amp; CEO</div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Short text */}
        <FadeIn delay={0.1}>
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 rounded-full bg-blue-400" />
              <span className="text-blue-300 text-[10px] tracking-[0.35em] uppercase font-medium">{page.eyebrow}</span>
            </div>
            <RisingText>
              <h1
                className="font-medium leading-[1.05] mb-6"
                style={{
                  fontSize: "clamp(36px, 4.5vw, 60px)",
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  WebkitTextFillColor: "#ffffff",
                  background: "none",
                  display: "block",
                }}
              >
                {page.h1}
              </h1>
            </RisingText>
            <p className="text-white/80 leading-relaxed mb-10" style={{ fontSize: "clamp(16px, 1.3vw, 19px)" }}>
              {page.intro}
            </p>

            <div className="flex flex-col gap-8">
              {page.sections.map((s) => (
                <div key={s.h} className="pt-6 border-t border-white/10">
                  <h2
                    className="mb-3"
                    style={{
                      fontSize: "clamp(18px, 1.5vw, 22px)",
                      color: "#93b8ff",
                      WebkitTextFillColor: "#93b8ff",
                      background: "none",
                      fontWeight: 400,
                      padding: 0,
                    }}
                  >
                    {s.h}
                  </h2>
                  {(s.p || []).map((t, i) => (
                    <p key={i} className="text-white/70 leading-relaxed" style={{ fontSize: "clamp(15px, 1.1vw, 17px)" }}>
                      {t}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-5 mt-10">
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
    </div>
  </section>
);

export default FounderPage;
