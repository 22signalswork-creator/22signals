import React, { FC } from "react";
import HeroSection from "./components/hero-section.tsx";
import "./work.css";
import Tabs from "./components/tabs.tsx";
import LastSection from "./components/CompanyStatsCounts.tsx";
import { projects } from "./components/projectcard.tsx"; // import your projects
import Service from "../services/service.tsx";
import Portfolioslider from "./components/portfolioslider.tsx";
import FaqSection from "../services/components/FaqSection.tsx";

const Work: FC = () => {
  return (
    <>
      <HeroSection />
      <Service />
      <Tabs projects={projects} />
      <Portfolioslider />
      <LastSection />
      <FaqSection />

    </>
  );
};

export default Work;
