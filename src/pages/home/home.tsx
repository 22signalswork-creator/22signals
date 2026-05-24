import React, { useRef } from "react";
import HeroSection from "./components/hero-section.tsx";
import PortfolioSection from "./components/portfoliosection.tsx";
import ServicesSection from "./components/ServicesSection.tsx";
import HomeProcess from "./components/HomeProcess.tsx";
import HomeFaq from "./components/HomeFaq.tsx";
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
      <div ref={nextSectionRef}>
        <ServicesSection />
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
