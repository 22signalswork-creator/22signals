import React, { useRef } from "react";
import HeroSection from "./components/hero-section.tsx";
import PortfolioSection from "./components/portfoliosection.tsx";
import ServicesSection, { BackgroundWindingLine } from "./components/ServicesSection.tsx";
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
      {/* The light part of the page: the scroll line runs behind all of it,
          from the reel down to where Featured Projects begins. */}
      <div className="relative">
        <BackgroundWindingLine />
        <div ref={nextSectionRef} className="relative z-10">
          <ServicesSection />
        </div>

        {/* Companies We Have Worked With, straight after What We Do */}
        <div className="relative z-10">
          <HomeLogos />
        </div>
      </div>

      <PortfolioSection />

      {/* New: Operational Framework process */}
      <HomeProcess />

      {/* New: Home FAQ */}
      <HomeFaq />


      {/* Footer */}
      <section className="w-full h-full bg-black flex flex-col justify-end overflow-y-auto">
        <Footer />
      </section>
    </>
  );
};

export default Home;
