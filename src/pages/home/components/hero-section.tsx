import React, { useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
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
        // Lock triggering for 1.5s to allow the transition to finish
        setTimeout(() => (isScrolling.current = false), 1500);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) handleNext();
    };

    // Mobile Swipe Support
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      if (touchStartY.current - touchEndY > 50) { // 50px swipe threshold
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

  return (
    <section
      ref={sectionRef}
      className="relative bg-white h-screen min-h-screen overflow-hidden" 
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <NeonScene />
      </div>

      <div 
        className="container relative z-10 flex flex-col justify-between items-stretch h-full py-20 pointer-events-none" 
        style={{ paddingTop: '150px' }} 
      >
        <div className="pt-10 md:pt-20">
          <RisingText>
            <h1 className="font-thin leading-[1.1] text-4xl sm:text-5xl md:text-[68px] text-black">
              <span className="text-transparent animated-gradient">Create.</span>{" "}
              <HomeWordRoller />
            </h1>
          </RisingText>
        </div>

        <div className="grid grid-cols-[1fr] md:grid-cols-[2fr_1fr_2fr] gap-8 pb-10 items-center">
          <div className="flex flex-col justify-end items-center md:items-start gap-4 h-full pointer-events-auto">
             <AnimatedText className="text-white hero-section-desc-text" delay={1} duration={2.5}>
              DUBAI &nbsp;|&nbsp; LAHORE &nbsp;|&nbsp; LONDON &nbsp;|&nbsp; NEW YORK
            </AnimatedText>
          </div>

          <div className="flex flex-col justify-end items-center h-full pointer-events-auto">
            <animated.img
              src={Mouse}
              alt="Scroll"
              className="w-[30px] h-[43px] cursor-pointer"
              style={{ ...mouseSpring }}
              onClick={() => scrollNext?.()}
            />
          </div>

          <div className="text-center md:text-right">
            <AnimatedText className="text-white hero-section-desc-text" delay={1} duration={2.5}>
              Your one stop solution business solution.
            </AnimatedText>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;