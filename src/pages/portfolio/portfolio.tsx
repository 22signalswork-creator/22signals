import React, { FC } from "react";
import HeroSection from "./hero-section.tsx";
import "@/pages/services/work.css";
import Tabs from "./components/tabs.tsx";
import { projects } from "./components/projectcard.tsx"; 
import RisingText from "@/transitions/RisingText.tsx";
import FaqSection from "./components/FaqSection.tsx";
import PreCtaSections from "@/components/PreCtaSections";

const Work: FC = () => {
  return (
    <>
      <HeroSection />
      <Tabs projects={projects} />
      <FaqSection />
      {/* No featured projects here: the grid above already shows every project */}
      <PreCtaSections testimonialsOnly />
    </>
  );
};

export default Work;
