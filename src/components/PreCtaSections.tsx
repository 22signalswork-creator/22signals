import React from "react";
import TestimonialsSection from "./TestimonialsSection";
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
  testimonialsTitle,
  featuredTitle,
}) => {
  return (
    <div className="relative w-full bg-[#000202] text-white allow-internal-scroll overflow-hidden">
      <TestimonialsSection title={testimonialsTitle} />
      {!testimonialsOnly && <FeaturedProjectsSection title={featuredTitle} />}
    </div>
  );
};

export default PreCtaSections;
