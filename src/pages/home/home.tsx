import React, { useRef } from "react";
import HeroSection from "./components/hero-section.tsx";
import PortfolioSection from "./components/portfoliosection.tsx";
import ServicesSection, { BackgroundWindingLine } from "./components/ServicesSection.tsx";
import PanelReveal from "@/components/fx/PanelReveal";
import HomeProcess from "./components/HomeProcess.tsx";
import HomeFaq from "./components/HomeFaq.tsx";
import HomeLogos from "./components/HomeLogos.tsx";
import Footer from "../../layout/footer.tsx";

const Home = () => {
  const nextSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollNext = () => {
    nextSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <HeroSection nextSectionRef={nextSectionRef} scrollNext={handleScrollNext} />
      {/* Everything below the hero. The scroll trace runs down the left
          margin of all of it and names each section as you reach it. */}
      <div className="relative">
        <BackgroundWindingLine />
        <div ref={nextSectionRef} className="relative z-10">
          <ServicesSection />
        </div>

        {/* Companies We Have Worked With, straight after What We Do */}
        <div className="relative z-10" data-trace="Clients">
          <HomeLogos />
        </div>

        <PanelReveal trace="Work">
          <PortfolioSection />
        </PanelReveal>

        <div data-trace="How we work">
          <HomeProcess />
        </div>

        <div data-trace="FAQ">
          <HomeFaq />
        </div>
      </div>


      {/* Footer */}
      <section className="w-full h-full bg-black flex flex-col justify-end overflow-y-auto">
        <Footer />
      </section>
    </>
  );
};

export default Home;
