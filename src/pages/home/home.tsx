import React, { useRef } from "react";
import HeroSection from "./components/hero-section.tsx";
import Homebody from "./components/home-body.tsx";
import PortfolioSection from "./components/portfoliosection.tsx";

const Home = () => {
  const homeBodyRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <HeroSection nextSectionRef={homeBodyRef} />
      <div ref={homeBodyRef}>
        <Homebody />
      </div>
      <PortfolioSection />
    </>
  );
};

export default Home;
