/**
 * /about in the original Team page design (src/pages/team/team.tsx):
 * same hero ("The Engine Behind 22 Signals."), same founder block, same team
 * grid and value cards, with the About copy in place of the team copy.
 * The /team page itself is unchanged.
 */
import React, { useEffect } from "react";
import "@/index.css";
import HeroSection from "@/pages/team/component/hero-section.tsx";
import TeamSection from "@/pages/team/component/teamsection.tsx";
import PreCtaSections from "@/components/PreCtaSections";

type Section = { h: string; p?: string[]; list?: string[] };
type AboutData = { h1: string; subtitle?: string; intro: string; sections: Section[] };

const AboutPage: React.FC<{ page: AboutData }> = ({ page }) => {
  useEffect(() => {
    document.body.classList.add("team-page");
    return () => {
      document.body.classList.remove("team-page");
    };
  }, []);

  const solve = page.sections.find((s) => s.list && s.list.length) || null;
  const rest = page.sections.filter((s) => s !== solve);
  const cards = (solve?.list || []).map((item) => {
    const i = item.indexOf(": ");
    return i > 0
      ? { title: item.slice(0, i), desc: item.charAt(i + 2).toUpperCase() + item.slice(i + 3) }
      : { title: item, desc: "" };
  });

  return (
    <div>
      <HeroSection titleAs="h1" subtitle={page.subtitle} />
      <TeamSection
        label="About 22 Signals"
        bigHeading="WHO WE ARE"
        bigHeadingAs="h2"
        intro={page.intro}
        valuesTitle={solve?.h}
        valuesText={solve?.p?.[0]}
        valueItems={cards}
        extraBlocks={rest.map((s) => ({ h: s.h, p: s.p || [] }))}
      />
      <PreCtaSections testimonialsOnly testimonialsTitle="What Our Clients Say" />
    </div>
  );
};

export default AboutPage;
