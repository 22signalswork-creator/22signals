import React from "react";
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
  return (
    <div>
      <HeroSection />
      <Tabs projects={projects} />
      <RefinedExecution />
      <ProcessSteps />
      
      <Portfolioslider />
      <Companystatscounts />
      <FaqSection />
    </div>
  );
};

export default Service;