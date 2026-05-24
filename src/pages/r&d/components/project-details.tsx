import React from "react";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";

const projects = [
  { label: "Haptic Web Interfaces", percent: 75 },
  { label: "Brain-Computer UX", percent: 60 },
  { label: "Holographic Displays", percent: 38 },
  { label: "Voice-First Navigation", percent: 90 },
];

const ProjectDetails: React.FC = () => {
  return (
    <section className="container py-12">
      <FadeIn>
        <div
          className="rounded-3xl p-8 md:p-12"
          style={{
            background:
              "linear-gradient(135deg, rgba(50,95,236,0.05) 0%, rgba(0,0,0,0.4) 100%)",
            border: "1px solid rgba(80,140,255,0.15)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-start mb-10">
            <h2 className="text-3xl md:text-4xl text-white">Project Details</h2>
            <p className="text-white/60 text-base">
              You never get another chance to make a good first impression. At
              22 Signals, we use a complete spectrum of disciplines to research,
              build, and ship the future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p, i) => (
              <Cardhovereffect key={i}>
                <div className="bg-black/20 rounded-2xl p-5 border border-white/[0.06]">
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-white text-base md:text-lg">
                      {p.label}
                    </span>
                    <span className="text-blue-300 text-base font-medium">
                      {p.percent}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${p.percent}%`,
                        background:
                          "linear-gradient(90deg, #325FEC 0%, #6B92FF 100%)",
                        boxShadow: "0 0 10px rgba(50,95,236,0.5)",
                      }}
                    />
                  </div>
                </div>
              </Cardhovereffect>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
};

export default ProjectDetails;
