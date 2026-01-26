import React, { FC } from "react";
import HeroSection from "./hero-section.tsx";
import "@/pages/work/work.css";
import Tabs from "@/pages/work/components/tabs.tsx";
import LastSection from "@/pages/work/components/lastsection.tsx";
import { projects } from "./components/projectcard.tsx"; 

const Work: FC = () => {
  return (
    <>
      <HeroSection />
      <Tabs projects={projects} />
        <LastSection />
    </>
  );
};

export default Work;
