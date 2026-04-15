import React, { FC } from "react";
import HeroSection from "./hero-section.tsx";
import "@/pages/services/work.css";
import Tabs from "./components/tabs.tsx";
import CompanyStatsCounts from "./components/CompanyStatsCounts.tsx";
import { projects } from "./components/projectcard.tsx"; 
import RisingText from "@/transitions/RisingText.tsx";
import FaqSection from "./components/FaqSection.tsx";

const Work: FC = () => {
  return (
    <>
      <HeroSection />
      <Tabs projects={projects} />
      
     
        <CompanyStatsCounts />

          <FaqSection />
    </>
  );
};

export default Work;
