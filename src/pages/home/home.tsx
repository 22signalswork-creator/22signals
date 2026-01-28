import React, { useRef } from "react";
import HeroSection from "./components/hero-section.tsx";

import PortfolioSection from "./components/portfoliosection.tsx";
import ScrollSlider from  '@/components/ScrollSlider.tsx';
import ServicesSection  from './components/ServicesSection.tsx';

const Home = () => {
  const homeBodyRef = useRef<HTMLDivElement>(null);

  return (
     <ScrollSlider>
      <HeroSection nextSectionRef={homeBodyRef} />
      <ServicesSection />
      

      <PortfolioSection />
    </ScrollSlider>
  );
};

export default Home;
