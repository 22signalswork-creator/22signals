import React from "react";
// TEMP: testimonials are hidden site-wide. Restore the import + render below to bring them back.
// import TestimonialsSection from "./TestimonialsSection";
import FeaturedProjectsSection from "./FeaturedProjectsSection";

interface Props {
  /**
   * When true, only the testimonials section is rendered (no featured
   * projects). Used on the Team page per the brief — team page gets the
   * testimonials section only, no featured projects, no FAQ.
   */
  testimonialsOnly?: boolean;
  /** Custom heading for the testimonials block. */
  testimonialsTitle?: string;
  /** Custom heading for the featured projects block. */
  featuredTitle?: string;
}

/**
 * PreCtaSections — drop into any public page just before the footer/CTA so
 * every page gets the same proof-of-work block.
 *
 * The home page already composes these manually inside <PortfolioSection/>,
 * so do NOT add this twice on home.
 */
const PreCtaSections: React.FC<Props> = ({
  testimonialsOnly = false,
  // testimonialsTitle is unused while testimonials are hidden; kept for API stability.
  testimonialsTitle: _testimonialsTitle,
  featuredTitle,
}) => {
  // TEMP: testimonials hidden site-wide. When a page asked for testimonials
  // only (e.g. the Team page), there is nothing left to render, so render
  // nothing rather than an empty styled block.
  if (testimonialsOnly) return null;

  return (
    <div className="relative w-full bg-[#000202] text-white allow-internal-scroll overflow-hidden">
      {/* TEMP: testimonials hidden. Restore: <TestimonialsSection title={testimonialsTitle} /> */}
      <FeaturedProjectsSection title={featuredTitle} />
    </div>
  );
};

export default PreCtaSections;
