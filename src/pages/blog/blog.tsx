import React, { useRef } from "react";
import "@/index.css";
import HeroSection from "./components/hero-section.tsx";
import Tabs from "./components/tabs.tsx";
import Newsletter from "./components/newsletter.tsx";
import PreCtaSections from "@/components/PreCtaSections";

const Blog = () => {
  const nextSectionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="">
      <HeroSection nextSectionRef={nextSectionRef} />
      <div ref={nextSectionRef}>
        <Tabs />
      </div>
      <Newsletter />
      {/* Reusable testimonials + featured projects — appears before footer/CTA */}
      <PreCtaSections />
    </div>
  );
};

export default Blog;
