/**
 * "Companies We Have Worked With", unchanged in look, now the last section
 * before the footer. A soft black-to-light fade leads into it.
 */
import React from "react";
import FadeIn from "@/transitions/FadeIn.tsx";
import SliderComponent from "@/components/Slider.tsx";
import { useCMS } from "@/hooks/useCMS";
import { usePageContent } from "@/hooks/usePageContent";

interface ClientLogo {
  id: string;
  logo_url: string;
  sort_order?: number;
  is_active?: boolean;
}

const HomeLogos: React.FC = () => {
  const { t } = usePageContent();
  const { data: logos } = useCMS<ClientLogo>("client_logos", {
    filter: { is_active: true },
    orderBy: "sort_order",
  });
  const slideUrls = logos.map((l) => l.logo_url).filter(Boolean);

  return (
    <section className="relative" style={{ background: "#F0F1FA" }}>
      <div
        aria-hidden
        className="w-full"
        style={{ height: "clamp(120px, 22vh, 260px)", background: "linear-gradient(180deg, #000202 0%, #1b2140 40%, #F0F1FA 100%)" }}
      />
      <div className="container px-6 md:px-12 lg:px-20 pb-20 md:pb-28">
        <FadeIn>
          <div className="text-center mb-3 md:mb-4 relative z-20">
            <div
              className="inline-block px-4 py-1.5 rounded-full text-[10px] tracking-[0.3em] uppercase mb-4"
              style={{ border: "1px solid rgba(50,95,236,0.4)", color: "rgba(50,95,236,0.95)" }}
            >
              {t("home_logos_eyebrow", "Trusted By")}
            </div>
            <h2
              className="leading-[1.15]"
              style={{
                color: "#0A1530",
                background: "none",
                WebkitTextFillColor: "#0A1530",
                backgroundClip: "unset",
                WebkitBackgroundClip: "unset",
                fontSize: "clamp(28px, 3.4vw, 44px)",
                fontWeight: 700,
                padding: "8px 0 0 0",
                margin: 0,
              }}
            >
              {t("home_logos_heading", "Companies We Have Worked With")}
            </h2>
          </div>
        </FadeIn>
        {slideUrls.length > 0 && (
          <div className="logos-band-wrap mt-1 md:mt-2 relative z-10">
            <SliderComponent slides={slideUrls} />
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeLogos;
