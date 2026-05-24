import React from "react";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";
import { useCMS } from "@/hooks/useCMS";
import { usePageContent } from "@/hooks/usePageContent";

interface ProcessStep {
  id: number | string;
  step_number: string;
  title: string;
  description: string;
  sort_order?: number;
}

// Fallback steps — used when `process_steps` table is empty.
const FALLBACK_STEPS: ProcessStep[] = [
  { id: 1, step_number: "01", title: "Partner",
    description: "Gain a dedicated supervisor at no extra cost." },
  { id: 2, step_number: "02", title: "Manage",
    description: "One point of contact to streamline communication." },
  { id: 3, step_number: "03", title: "Access",
    description: "Instantly unlock our full suite of solutions." },
  { id: 4, step_number: "04", title: "Scale",
    description: "Rapid execution to adapt without delays." },
];

const HomeProcess: React.FC = () => {
  const { t } = usePageContent();
  const { data: steps } = useCMS<ProcessStep>("process_steps", {
    orderBy: "sort_order",
    fallback: FALLBACK_STEPS,
  });

  return (
    <section className="bg-[#000202] py-20 md:py-28 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 100%, rgba(50,95,236,0.18) 0%, transparent 60%)",
        }}
      />

      <div className="container relative z-10">
        <FadeIn>
          <div className="text-center md:text-left mb-12 md:mb-16">
            <RisingText>
              <h2 className="text-3xl md:text-5xl text-white">
                {t("home_process_title", "Seamless Operational Framework.")}
              </h2>
            </RisingText>
            <p className="text-white/60 text-base md:text-lg mt-4 max-w-2xl">
              {t("home_process_subtitle", "A streamlined approach to maximize productivity and results.")}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {steps.map((s, i) => (
            <FadeIn key={s.id ?? s.step_number} delay={i * 0.12}>
              <Cardhovereffect>
                <div
                  className="relative h-full rounded-2xl p-6 md:p-8 overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(50,95,236,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                    border: "1px solid rgba(80,140,255,0.18)",
                  }}
                >
                  {/* Step number watermark */}
                  <div
                    className="absolute -top-2 -right-2 text-[100px] md:text-[140px] font-bold leading-none select-none pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(50,95,236,0.18) 0%, rgba(50,95,236,0) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {s.step_number}
                  </div>

                  <div className="relative z-10">
                    <div className="text-blue-400 text-xs tracking-[0.25em] uppercase mb-3">
                      Step {s.step_number}
                    </div>
                    <h3 className="text-2xl md:text-[28px] text-white font-medium mb-3">
                      {s.title}
                    </h3>
                    <p className="text-white/65 text-sm md:text-[15px] leading-relaxed">
                      {s.description}
                    </p>
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

export default HomeProcess;
