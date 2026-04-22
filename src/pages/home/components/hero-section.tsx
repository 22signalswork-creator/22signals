import React, { useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { motion } from "framer-motion";
import Mouse from "@/assets/Vector.svg";
import RisingText from "@/transitions/RisingText";
import AnimatedText from "@/transitions/herosectionP.tsx";
import HomeWordRoller from "./hero-word-roller.tsx";
import NeonScene from "./NeonGlobe.tsx";

interface HeroSectionProps {
  nextSectionRef: React.RefObject<HTMLDivElement>;
  scrollNext?: () => void; 
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollNext }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isScrolling = useRef(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    const handleNext = () => {
      if (!isScrolling.current && scrollNext) {
        isScrolling.current = true;
        scrollNext();
        setTimeout(() => (isScrolling.current = false), 1500);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) handleNext();
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      if (touchStartY.current - touchEndY > 50) {
        handleNext();
      }
    };

    const element = sectionRef.current;
    if (element) {
      element.addEventListener("wheel", handleWheel, { passive: true });
      element.addEventListener("touchstart", handleTouchStart, { passive: true });
      element.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    return () => {
      if (element) {
        element.removeEventListener("wheel", handleWheel);
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [scrollNext]);

  const mouseSpring = useSpring({
    loop: { reverse: true },
    from: { y: 0 },
    to: { y: 15 },
    config: { duration: 800 },
  });

  // PRIORITY 2: Text Animation Settings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.3, // Time between each item
        delayChildren: 1.2    // Wait for globe to finish/be visible before text starts
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-black h-screen min-h-screen overflow-hidden" 
    >
      {/* PRIORITY 1: NeonGlobe Fades in First */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <NeonScene />
      </motion.div>

      {/* TEXT LAYER: Starts after globe is established */}
      <motion.div 
        className="container relative z-10 flex flex-col justify-between items-stretch h-full py-20 pointer-events-none" 
        style={{ paddingTop: '150px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Sequence 1: Main Title */}
        <motion.div variants={itemVariants} className="pt-10 md:pt-20">
          <RisingText>
            <h1 className="font-thin leading-[1.1] text-4xl sm:text-5xl md:text-[68px] text-white">
              <span className="text-transparent animated-gradient">Create.</span>{" "}
              <HomeWordRoller />
            </h1>
          </RisingText>
        </motion.div>

        <div className="grid grid-cols-[1fr] md:grid-cols-[2fr_1fr_2fr] gap-8 pb-10 items-center">
          
          {/* Sequence 2: Cities */}
          <motion.div variants={itemVariants} className="flex flex-col justify-end items-center md:items-start gap-4 h-full pointer-events-auto">
             <AnimatedText className="text-white hero-section-desc-text" delay={0} duration={1.5}>
              DUBAI &nbsp;|&nbsp; LAHORE &nbsp;|&nbsp; LONDON &nbsp;|&nbsp; NEW YORK
            </AnimatedText>
          </motion.div>

          {/* Sequence 3: Scroll Mouse */}
          <motion.div variants={itemVariants} className="flex flex-col justify-end items-center h-full pointer-events-auto">
            <animated.img
              src={Mouse}
              alt="Scroll"
              className="w-[30px] h-[43px] cursor-pointer"
              style={{ ...mouseSpring }}
              onClick={() => scrollNext?.()}
            />
          </motion.div>

          {/* Sequence 4: Description */}
          <motion.div variants={itemVariants} className="text-center md:text-right">
            <AnimatedText className="text-white hero-section-desc-text" delay={0} duration={1.5}>
              Your one stop solution business solution.
            </AnimatedText>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;