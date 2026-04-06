import React, { useRef } from "react";
import HeroSection from "./components/hero-section.tsx";
import PortfolioSection from "./components/portfoliosection.tsx";
import ScrollSlider from '@/components/ScrollSlider.tsx';
import ServicesSection from './components/ServicesSection.tsx';
import Footer from "../../layout/footer.tsx"; // Import Global Footer

const Home = () => {
  const homeBodyRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <HeroSection nextSectionRef={homeBodyRef} />
      <ServicesSection />
      <PortfolioSection />
      {/* The Footer is now the final slide */}
      <section className="w-full h-full bg-black flex flex-col justify-end overflow-y-auto">
        <Footer />
      </section>
    </>
  );
};

export default Home;