import React, { useRef } from "react";
import HeroSection from "./components/hero-section.tsx";
import PortfolioSection from "./components/portfoliosection.tsx";
import ScrollSlider from '@/components/ScrollSlider.tsx';
import ServicesSection from './components/ServicesSection.tsx';
import Footer from "../../layout/footer.tsx"; // Import Global Footer
import CarromSmartScroll from "./components/CarromSmartScroll.tsx";
const Home = () => {
  const nextSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollNext = () => {
    nextSectionRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "start" 
    });
  };
  return (
    <>
      {/* <CarromSmartScroll> */}
        <HeroSection nextSectionRef={nextSectionRef} 
        scrollNext={handleScrollNext} />
        <div ref={nextSectionRef}>

      
        <ServicesSection />
          </div>
        <PortfolioSection />
        {/* The Footer is now the final slide */}
        <section className="w-full h-full bg-black flex flex-col justify-end overflow-y-auto">
          <Footer />
        </section>
      {/* </CarromSmartScroll> */}
    </>
  );
};

export default Home;