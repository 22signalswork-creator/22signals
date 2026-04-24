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
  const heroRef = useRef<HTMLDivElement>(null);
  const refinedExecutionRef = useRef<HTMLDivElement>(null);
  const processStepsRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // Forward scroll handlers
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

  // Reverse scroll handlers
  const handleRefinedExecutionScrollPrev = () => {
    if (heroRef.current) {
      gsap.to(window, {
        scrollTo: { y: heroRef.current, autoKill: false },
        duration: 1.2,
        ease: "sine.inOut",
      });
    }
  };

  const handleProcessStepsScrollPrev = () => {
    if (refinedExecutionRef.current) {
      gsap.to(window, {
        scrollTo: { y: refinedExecutionRef.current, autoKill: false },
        duration: 1.2,
        ease: "sine.inOut",
      });
    }
  };

  const handleTabsScrollPrev = () => {
    if (processStepsRef.current) {
      gsap.to(window, {
        scrollTo: { y: processStepsRef.current, autoKill: false },
        duration: 1.2,
        ease: "sine.inOut",
      });
    }
  };

  const handlePortfolioScrollPrev = () => {
    if (tabsRef.current) {
      gsap.to(window, {
        scrollTo: { y: tabsRef.current, autoKill: false },
        duration: 1.2,
        ease: "sine.inOut",
      });
    }
  };

  const handleStatsScrollPrev = () => {
    if (portfolioRef.current) {
      gsap.to(window, {
        scrollTo: { y: portfolioRef.current, autoKill: false },
        duration: 1.2,
        ease: "sine.inOut",
      });
    }
  };

  const handleFaqScrollPrev = () => {
    if (statsRef.current) {
      gsap.to(window, {
        scrollTo: { y: statsRef.current, autoKill: false },
        duration: 1.2,
        ease: "sine.inOut",
      });
    }
  };
    
  return (
    <div ref={heroRef}>
      <HeroSection scrollNext={handleHeroScrollNext} />
      <div ref={refinedExecutionRef}>
        <RefinedExecution scrollNext={handleRefinedExecutionScrollNext} scrollPrev={handleRefinedExecutionScrollPrev} />
      </div>
      <div ref={processStepsRef}>
        <ProcessSteps scrollNext={handleProcessStepsScrollNext} scrollPrev={handleProcessStepsScrollPrev} />
      </div>
      <div ref={tabsRef}>
        <Tabs projects={projects} scrollNext={handleTabsScrollNext} scrollPrev={handleTabsScrollPrev} />
      </div>
      <div ref={portfolioRef}>
        <Portfolioslider scrollNext={handlePortfolioScrollNext} scrollPrev={handlePortfolioScrollPrev} />
      </div>
      <div ref={statsRef}>
        <Companystatscounts scrollNext={handleStatsScrollNext} scrollPrev={handleStatsScrollPrev} />
      </div>
      <div ref={faqRef}>
        <FaqSection scrollPrev={handleFaqScrollPrev} />
      </div>
    </div>
  );
};

export default Service;