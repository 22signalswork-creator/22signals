import React, { FC } from "react";
import HeroSection from "./components/hero-section.tsx";
import "./work.css";
import Tabs from "./components/tabs.tsx";
import LastSection from "./components/lastsection.tsx";
import { projects } from "./components/projectcard.tsx"; // import your projects

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
