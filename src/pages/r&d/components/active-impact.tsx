import React, { useEffect, useRef, useState } from "react";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";

// Rolling counter, only animates once visible
const RollingNumber: React.FC<{ target: number; suffix?: string; duration?: number }> = ({
  target,
  suffix = "",
  duration = 2000,
}) => {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = p * (2 - p);
      setVal(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
};

const cards = [
  {
    label: "The Work in Progress",
    number: 15,
    suffix: "+",
    sub: "Active Beta Frameworks",
  },
  {
    label: "The Effect on Speed",
    number: 60,
    suffix: "%",
    sub: "Faster Prototyping",
  },
  {
    label: "The Effect on Margins",
    number: 50, // animates from 0 → 50, label shows "40-60%"
    suffix: "%",
    sub: "Optimized Cost Reductions",
    overrideLabel: "40-60%",
  },
  {
    label: "The Execution Standard",
    number: 100,
    suffix: "%",
    sub: "Analytical Precision",
  },
];

const ActiveImpact: React.FC = () => {
  return (
    <section className="bg-[#000202] py-24">
      <div className="container">
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 mb-16 items-end">
            <RisingText>
              <h2 className="text-4xl md:text-[56px] text-white leading-tight">
                Active R&D <br /> Impact.
              </h2>
            </RisingText>
            <p className="text-white/60 text-base md:text-lg max-w-xl md:ml-auto">
              We do not wait for the future; we engineer it. Our research division
              continuously develops, tests, and optimizes proprietary backend
              systems.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <Cardhovereffect>
                <div
                  className="rounded-2xl p-7 h-full flex flex-col justify-between min-h-[220px] relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(50,95,236,0.10) 0%, rgba(255,255,255,0.02) 100%)",
                    border: "1px solid rgba(80,140,255,0.2)",
                  }}
                >
                  <div className="text-blue-300/80 text-xs tracking-[0.2em] uppercase">
                    {c.label}
                  </div>
                  <div>
                    <h1
                      className="text-white text-5xl md:text-6xl font-light"
                      style={{
                        background:
                          "linear-gradient(91.16deg, #325FEC 1.74%, #FFFFFF 50%, #325FEC 102.48%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {c.overrideLabel ? (
                        c.overrideLabel
                      ) : (
                        <RollingNumber target={c.number} suffix={c.suffix} />
                      )}
                    </h1>
                    <p className="text-white/65 text-sm mt-3">{c.sub}</p>
                  </div>
                </div>
              </Cardhovereffect>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActiveImpact;
