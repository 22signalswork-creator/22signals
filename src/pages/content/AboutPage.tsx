/**
 * /about in the original Team page design (src/pages/team/team.tsx):
 * same hero ("The Engine Behind 22 Signals."), same dark grid background,
 * blue labels, gradient headings and value cards, filled with the About copy.
 * Ends with the founder's portrait card linking to his page.
 * The /team page itself is unchanged.
 */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "@/index.css";
import HeroSection from "@/pages/team/component/hero-section.tsx";
import PreCtaSections from "@/components/PreCtaSections";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Valuicon from "@/assets/valueicon.png";
import { PortraitCard } from "./FounderPage";

type Section = { id?: string; h: string; p?: string[]; list?: string[] };
type AboutData = { h1: string; subtitle?: string; intro: string; sections: Section[] };

const titled = (item: string) => {
  const [main, link] = item.split("|");
  const i = main.indexOf(": ");
  const title = i > 0 ? main.slice(0, i) : main;
  const rest = i > 0 ? main.slice(i + 2) : "";
  return { title, desc: rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : "", link };
};

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="h-[2px] w-12 rounded-full bg-blue-400" />
    <span className="text-blue-300 text-[11px] tracking-[0.4em] uppercase font-medium">{children}</span>
  </div>
);

const Para: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="leading-relaxed" style={{ fontSize: "clamp(15px, 1.15vw, 18px)", color: "rgba(255,255,255,0.75)" }}>
    {children}
  </p>
);

// Heading left, text right: the team page "DNA of Our Standard" layout.
const Split: React.FC<{ s?: Section; children?: React.ReactNode }> = ({ s, children }) =>
  s ? (
    <FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 md:gap-12 items-start">
        <h2>{s.h}</h2>
        <div className="flex flex-col gap-4">
          {(s.p || []).map((t, i) => (
            <Para key={i}>{t}</Para>
          ))}
          {children}
        </div>
      </div>
    </FadeIn>
  ) : null;

const ValueCards: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 md:gap-x-10 gap-y-7 md:gap-y-8">
    {items.map((item, i) => {
      const v = titled(item);
      return (
        <FadeIn key={i} delay={(i % 4) * 0.05}>
          <div className="border-t border-white/15 pt-5">
            <img src={Valuicon} width={36} height={36} alt="" className="mb-4" />
            <h3 className="m-0" style={{ fontSize: "clamp(16px, 1.45vw, 22px)", color: "#ffffff", fontWeight: 400, background: "none", WebkitTextFillColor: "#ffffff" }}>
              {v.title}
            </h3>
            <p className="mt-2 m-0 text-[13px] md:text-[15px]" style={{ lineHeight: 1.5, color: "rgba(255,255,255,0.6)" }}>
              {v.desc}
            </p>
          </div>
        </FadeIn>
      );
    })}
  </div>
);

const AboutPage: React.FC<{ page: AboutData }> = ({ page }) => {
  useEffect(() => {
    document.body.classList.add("team-page");
    return () => {
      document.body.classList.remove("team-page");
    };
  }, []);

  const get = (id: string) => page.sections.find((s) => s.id === id);
  const who = get("who");
  const solve = get("solve");
  const doo = get("do");
  const how = get("how");
  const withS = get("with");
  const numbers = get("numbers");
  const founder = get("founder");

  return (
    <div>
      <HeroSection titleAs="h1" subtitle={page.subtitle} />

      <section className="relative bg-black text-white overflow-hidden">
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

        {/* WHO WE ARE: big single-line heading, as "MEET THE TEAM" on /team */}
        <div className="container relative z-10 pt-16 md:pt-24 pb-16 md:pb-24">
          <FadeIn>
            <Label>About 22 Signals</Label>
          </FadeIn>
          <RisingText>
            <h2
              className="font-bold leading-[0.95] tracking-tight whitespace-nowrap"
              style={{
                fontSize: "clamp(28px, 5.4vw, 80px)",
                letterSpacing: "-0.035em",
                background: "linear-gradient(91deg, #325FEC 0%, #FFFFFF 50%, #325FEC 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                padding: 0,
              }}
            >
              WHO WE ARE
            </h2>
          </RisingText>
          <FadeIn delay={0.1}>
            <p className="leading-snug mt-6 md:mt-8 max-w-4xl" style={{ fontSize: "clamp(17px, 1.55vw, 23px)", color: "rgba(255,255,255,0.85)", fontWeight: 300 }}>
              {page.intro}
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-12 md:mt-16 max-w-5xl">
            {(who?.list || []).map((item, i) => {
              const v = titled(item);
              return (
                <FadeIn key={i} delay={0.1 + i * 0.06}>
                  <div className="border-t border-white/20 pt-6">
                    <div className="text-blue-300 text-[11px] tracking-[0.3em] uppercase mb-4">{v.title}</div>
                    <Para>{v.desc}</Para>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>

        <div className="container relative z-10 flex flex-col gap-20 md:gap-28 pb-20 md:pb-28">
          {/* WHAT WE SOLVE */}
          {solve && (
            <div className="flex flex-col gap-8 md:gap-10">
              <Split s={solve} />
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 md:gap-x-10 gap-y-7 md:gap-y-8">
                {(solve.list || []).map((item, i) => {
                  const v = titled(item);
                  return (
                    <FadeIn key={i} delay={(i % 3) * 0.05}>
                      <div className="border-t border-white/15 pt-5">
                        <div className="text-blue-300/80 text-[11px] tracking-[0.3em] mb-3 tabular-nums">{String(i + 1).padStart(2, "0")}</div>
                        <h3 className="m-0" style={{ fontSize: "clamp(16px, 1.45vw, 22px)", color: "#ffffff", fontWeight: 400, background: "none", WebkitTextFillColor: "#ffffff" }}>
                          {v.title}
                        </h3>
                        <p className="mt-2 m-0 text-[13px] md:text-[15px]" style={{ lineHeight: 1.5, color: "rgba(255,255,255,0.6)" }}>
                          {v.desc}
                        </p>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          )}

          {/* WHAT WE DO: the seven areas as quiet links (detail lives on /services) */}
          {doo && (
            <FadeIn>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                <div>
                  <h2>What we do.</h2>
                  <div className="mt-3">
                    <Para>{doo.p?.[0]}</Para>
                  </div>
                </div>
                <Link to="/services" className="text-blue-300 hover:text-white text-xs tracking-[0.25em] uppercase no-underline transition-colors" style={{ textDecoration: "none" }}>
                  All services →
                </Link>
              </div>
              <div className="flex flex-wrap gap-3">
                {(doo.list || []).map((item) => {
                  const v = titled(item);
                  return (
                    <Link
                      key={v.title}
                      to={v.link || "/services"}
                      className="no-underline rounded-full px-5 py-3 text-[15px] transition-colors"
                      style={{ textDecoration: "none", color: "#ffffff", border: "1px solid rgba(147,184,255,0.35)", background: "rgba(50,95,236,0.08)" }}
                    >
                      {v.title}
                    </Link>
                  );
                })}
              </div>
            </FadeIn>
          )}

          {/* HOW WE WORK: four steps */}
          {how && (
            <div className="flex flex-col gap-10">
              <Split s={how} />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {(how.list || []).map((item, i) => {
                  const v = titled(item);
                  return (
                    <FadeIn key={i} delay={i * 0.06}>
                      <div className="rounded-[20px] p-6 h-full" style={{ background: "rgba(50,95,236,0.08)", border: "1px solid rgba(80,140,255,0.3)" }}>
                        <div className="text-blue-300 text-xs tracking-[0.3em] mb-6">{String(i + 1).padStart(2, "0")}</div>
                        <h3 className="teamcard-title mb-3">{v.title}</h3>
                        <p style={{ color: "rgba(255,255,255,0.75)" }}>{v.desc}</p>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          )}

          {/* WHO WE WORK WITH */}
          <Split s={withS} />

          {/* NUMBERS */}
          {numbers && (
            <div className="flex flex-col gap-10">
              <FadeIn>
                <h2>{numbers.h}</h2>
              </FadeIn>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {(numbers.list || []).map((n, i) => {
                  const [value, label] = n.split("|");
                  return (
                    <FadeIn key={i} delay={i * 0.05}>
                      <div className="border-t border-white/20 pt-6">
                        <div
                          className="font-light leading-none mb-3"
                          style={{
                            fontSize: "clamp(44px, 5vw, 80px)",
                            background: "linear-gradient(91.16deg, #325FEC 1.74%, #FFFFFF 50%, #325FEC 102.48%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {value}
                        </div>
                        <div className="text-xs tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>
                          {label}
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          )}


          {/* FOUNDER: portrait card and title only, linking to his page */}
          {founder && (
            <FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 items-center">
                <div>
                  <Label>The founder</Label>
                  <h2>{founder.h}</h2>
                  <div className="mt-5 max-w-md">
                    <Para>{founder.p?.[0]}</Para>
                  </div>
                  <Link
                    to="/about/daniyal-mansur"
                    className="inline-flex items-center gap-2 mt-8 text-blue-300 hover:text-white text-xs tracking-[0.25em] uppercase transition-colors group no-underline"
                  >
                    Read Daniyal's story
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
                <Link to="/about/daniyal-mansur" className="block max-w-[380px] w-full md:ml-auto no-underline" aria-label="Daniyal Mansur, Founder and CEO">
                  <PortraitCard />
                </Link>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      <PreCtaSections testimonialsOnly testimonialsTitle="What Our Clients Say" />
    </div>
  );
};

export default AboutPage;
