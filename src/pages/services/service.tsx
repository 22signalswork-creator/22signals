import React, { useRef } from "react";
import "@/index.css";
import HeroSection from "./hero-section";
import "./services.css";
import RefinedExecution from "./components/refined-execution.tsx";
import ProcessSteps from "./components/process-steps.tsx";
import Tabs from "./components/tabs.tsx";
import Companystatscounts from "./components/CompanyStatsCounts.tsx";
import { projects } from "./components/projectcard.tsx";
import Portfolioslider from "./components/portfolioslider.tsx";
import FaqSection from "./components/FaqSection.tsx";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const Service = () => {

  // Create refs for each section
  const refinedExecutionRef = useRef<HTMLDivElement>(null);
  const processStepsRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // Create scroll handlers with GSAP friction scroll
  const handleHeroScrollNext = () => {
    if (refinedExecutionRef.current) {
      gsap.to(window, {
        scrollTo: { y: refinedExecutionRef.current, autoKill: false },
        duration: 1.2,
        ease: "sine.inOut",
      });
    }
  };

  const handleRefinedExecutionScrollNext = () => {
    if (processStepsRef.current) {
      gsap.to(window, {
        scrollTo: { y: processStepsRef.current, autoKill: false },
        duration: 1.2,
        ease: "sine.inOut",
      });
    }
  };

  const handleProcessStepsScrollNext = () => {
    if (tabsRef.current) {
      gsap.to(window, {
        scrollTo: { y: tabsRef.current, autoKill: false },
        duration: 1.2,
        ease: "sine.inOut",
      });
    }
  };

  const handleTabsScrollNext = () => {
    if (portfolioRef.current) {
      gsap.to(window, {
        scrollTo: { y: portfolioRef.current, autoKill: false },
        duration: 1.2,
        ease: "sine.inOut",
      });
    }
  };

  const handlePortfolioScrollNext = () => {
    if (statsRef.current) {
      gsap.to(window, {
        scrollTo: { y: statsRef.current, autoKill: false },
        duration: 1.2,
        ease: "sine.inOut",
      });
    }
  };

  const handleStatsScrollNext = () => {
    if (faqRef.current) {
      gsap.to(window, {
        scrollTo: { y: faqRef.current, autoKill: false },
        duration: 1.2,
        ease: "sine.inOut",
      });
    }
  };
    
  return (
    <div>
      <HeroSection scrollNext={handleHeroScrollNext} />
      <div ref={refinedExecutionRef}>
        <RefinedExecution scrollNext={handleRefinedExecutionScrollNext} />
      </div>
      <div ref={processStepsRef}>
        <ProcessSteps scrollNext={handleProcessStepsScrollNext} />
      </div>
      <div ref={tabsRef}>
        <Tabs projects={projects} scrollNext={handleTabsScrollNext} />
      </div>
      <div ref={portfolioRef}>
        <Portfolioslider scrollNext={handlePortfolioScrollNext} />
      </div>
      <div ref={statsRef}>
        <Companystatscounts scrollNext={handleStatsScrollNext} />
      </div>
      <div ref={faqRef}>
        <FaqSection />
      </div>
    </div>
  );
};

export default Service;