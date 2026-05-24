import React from "react";
import "@/index.css";
import HeroSection from "./hero-section";
import "./services.css";
import ProcessSteps from "./components/process-steps.tsx";
import ServicesGrid from "./components/ServicesGrid.tsx";
import Companystatscounts from "./components/CompanyStatsCounts.tsx";
import FaqSection from "./components/FaqSection.tsx";
import PreCtaSections from "@/components/PreCtaSections";

/**
 * /services page
 *
 * Order per brief:
 *   Hero → Service grid (cards link directly to /services/<slug>) →
 *   process → stats → FAQ → testimonials + featured projects → CTA.
 *
 * NOTE: The in-page "Refined Execution" pillar list was removed per
 * client request. The individual `/services/:slug` pages still
 * include the matching visual (code editor, dashboard, broadcast, etc.)
 * inside each detail page so the imagery is preserved per pillar.
 */
const Service = () => {
  return (
    <div>
      <HeroSection />
      {/* Grid of service cards — each links to its dedicated detail page */}
      <ServicesGrid />
      <ProcessSteps />
      <Companystatscounts />
      <FaqSection />
      {/* Reusable pre-CTA proof-of-work block — testimonials + featured projects */}
      <PreCtaSections />
    </div>
  );
};

export default Service;
