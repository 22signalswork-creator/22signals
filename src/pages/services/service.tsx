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

const Service = () => {

  // Create refs for each section
  const refinedExecutionRef = useRef<HTMLDivElement>(null);
  const processStepsRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // Create scroll handlers for each section
  const handleHeroScrollNext = () => {
    refinedExecutionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleRefinedExecutionScrollNext = () => {
    processStepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleProcessStepsScrollNext = () => {
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleTabsScrollNext = () => {
    portfolioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePortfolioScrollNext = () => {
    statsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleStatsScrollNext = () => {
    faqRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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