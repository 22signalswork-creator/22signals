import React from "react";
import "@/index.css";
import HeroSection from "./hero-section";
import "./services.css";
import Servicebody from "./components/servicesbody.tsx";
import Tabs from "./components/tabs.tsx";
import Companystatscounts from "./components/CompanyStatsCounts.tsx";
import { projects } from "./components/projectcard.tsx";
import Portfolioslider from "./components/portfolioslider.tsx";
import FaqSection from "./components/FaqSection.tsx";

const Service = () => {
  return (
    <div>
      <HeroSection />
      <Servicebody />
      <Tabs projects={projects} />
      <Portfolioslider />
      <Companystatscounts />
      <FaqSection />
    </div>
  );
};

export default Service;