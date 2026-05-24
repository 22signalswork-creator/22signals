import React, { useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { motion } from "framer-motion";
import Mouse from "@/assets/Vector.svg";
import RisingText from "@/transitions/RisingText";
import AnimatedText from "@/transitions/herosectionP.tsx";
import HomeWordRoller from "./hero-word-roller.tsx";
import NeonScene from "./NeonGlobe.tsx";
import { useCMSSingle } from "@/hooks/useCMS";

interface HeroSectionProps {
  nextSectionRef: React.RefObject<HTMLDivElement>;
  scrollNext?: () => void;
}

interface HeroRow {
  id?: string;
  headline?: string;
  tagline?: string;
  cities_list?: string[];
  gradient_word?: string;
}

// Fallback values used until the `hero_section` row exists in Supabase
const FALLBACK_HERO: HeroRow = {
  headline: "Create.",
  tagline: "Your one stop business solution.",
  cities_list: ["DUBAI", "LAHORE", "LONDON", "NEW YORK"],
  gradient_word: "Create.",
};

const HeroSection: React.FC<HeroSectionProps> = ({ scrollNext }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { data: hero } = useCMSSingle<HeroRow>("hero_section", FALLBACK_HERO);

  const cities = hero?.cities_list?.length
    ? hero.cities_list
    : FALLBACK_HERO.cities_list!;
  const tagline = hero?.tagline || FALLBACK_HERO.tagline;
  const gradientWord = hero?.gradient_word || FALLBACK_HERO.gradient_word;

  const mouseSpring = useSpring({
    loop: { reverse: true },
    from: { y: 0 },
    to: { y: 15 },
    config: { duration: 800 },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 1.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-black overflow-hidden h-screen min-h-screen"
    >
      {/* Globe */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <NeonScene />
      </motion.div>

      <motion.div
        className=" relative z-10 flex flex-col justify-between items-stretch h-full py-8 md:py-20 pointer-events-none home-hero-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          style={{
            width: "100%",
            paddingLeft: "16px",
            paddingRight: "16px",
            textAlign: "left",
            boxSizing: "border-box",
          }}
          className="pt-2 md:pt-20 md:px-0"
        >
          <RisingText>
            <h1
              className="font-thin leading-[1.1] whitespace-nowrap"
              style={{
                fontSize: "clamp(22px, 5.5vw, 68px)",
                color: "#ffffff",
                background: "none",
                backgroundImage: "none",
                WebkitTextFillColor: "#ffffff",
                WebkitBackgroundClip: "unset",
                backgroundClip: "unset",
              }}
            >
              <span className="text-transparent animated-gradient">{gradientWord}</span>{" "}
              <HomeWordRoller />
            </h1>
          </RisingText>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr] gap-8 pb-10 items-center w-full">
          {/* Cities */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-end items-center md:items-start gap-4 h-full pointer-events-auto order-2 md:order-1"
          >
            <AnimatedText
              className="text-white hero-section-desc-text text-center md:text-left tracking-[0.18em] text-sm md:text-base"
              delay={0}
              duration={1.5}
            >
              {cities.join("  |  ")}
            </AnimatedText>
          </motion.div>

          {/* Mouse */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-end items-center h-full pointer-events-auto order-1 md:order-2"
          >
            <animated.img
              src={Mouse}
              alt="Scroll"
              className="w-[30px] h-[43px] cursor-pointer"
              style={{ ...mouseSpring }}
              onClick={() => {
                if (scrollNext) scrollNext();
              }}
            />
          </motion.div>

          {/* Right tagline */}
          <motion.div
            variants={itemVariants}
            className="text-center md:text-right order-3 pointer-events-auto"
          >
            <AnimatedText
              className="text-white hero-section-desc-text"
              delay={0}
              duration={1.5}
            >
              {tagline}
            </AnimatedText>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
