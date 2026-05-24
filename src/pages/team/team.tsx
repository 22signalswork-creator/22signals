import React, { useEffect } from "react";
import "@/index.css";
import HeroSection from "./component/hero-section.tsx";
import Teamsection from "./component/teamsection.tsx";
import PreCtaSections from "@/components/PreCtaSections";

/**
 * Team page — per the brief:
 *   - No FAQ section
 *   - Only the testimonials block before the CTA
 *   - No featured projects
 *
 * The CEO row inside <Teamsection/> is hardcoded; the rest-of-team grid
 * is admin-driven via the `team_members` table.
 */
const Service = () => {
  useEffect(() => {
    document.body.classList.add("team-page");
    return () => {
      document.body.classList.remove("team-page");
    };
  }, []);

  return (
    <div className="">
      <HeroSection />
      <Teamsection />
      {/* Team page only gets the testimonials, not featured projects */}
      <PreCtaSections testimonialsOnly testimonialsTitle="What Our Clients Say" />
    </div>
  );
};

export default Service;
