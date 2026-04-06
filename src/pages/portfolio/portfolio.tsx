import React, { FC } from "react";
import HeroSection from "./hero-section.tsx";
import "@/pages/work/work.css";
import Tabs from "./components/tabs.tsx";
import CompanyStatsCounts from "@/pages/work/components/CompanyStatsCounts.tsx";
import { projects } from "./components/projectcard.tsx"; 
import RisingText from "@/transitions/RisingText.tsx";
import FaqSection from "./components/FaqSection.tsx";

const Work: FC = () => {
  return (
    <>
      <HeroSection />
      <Tabs projects={projects} />
       <div className="container  mx-auto px-4 py-16 space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 items-start">
        <RisingText>
          <h1 className="sub-heading text-3xl md:text-5xl font-thin">
            Our Successfully <br /> Growth
          </h1>
        </RisingText>
        <p className="dark-text">
          You never get another chance to make a good first impression. At American Designers Hub, we use a complete spectrum
        </p>
      </div>
        <CompanyStatsCounts />
      
        </div>
          <FaqSection />
    </>
  );
};

export default Work;
