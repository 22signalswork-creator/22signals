import React from "react";
import { useSpring, animated } from "@react-spring/web";

// Assets
import heroImage from "@/assets/hero-section.png";
import Instagram from "@/assets/instagram.svg";
import linkedin from "@/assets/linkedin.svg";
import twiter from "@/assets/twiter.svg";
import whatsapp from "@/assets/whatsapp.svg";
import Mouse from "@/assets/Vector.svg";
import bgImage from "@/assets/background.jpeg";

// Components
import RisingText from "@/transitions/RisingText";
import AnimatedText from "@/transitions/herosectionP.tsx";
import HomeWordRoller from "./hero-word-roller.tsx";
import NeonScene from "./NeonGlobe.tsx";

interface HeroSectionProps {
  nextSectionRef: React.RefObject<HTMLDivElement>;

  scrollNext?: () => void; // This comes from the CarromSmartScroll wrapper
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollNext }) => {

  const mouseSpring = useSpring({
    loop: { reverse: true },
    from: { y: 0 },
    to: { y: 15 },
    config: { duration: 800 },
  });

  // const handleScroll = () => {
  //   if (nextSectionRef.current) {
  //     nextSectionRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  // REPLACE your old handleScroll with this:
  const handleScroll = () => {
    if (scrollNext) {
      scrollNext(); // This triggers the Carrom glide animation
    }
  };

  return (
    <section
      className="relative bg-white h-screen min-h-screen overflow-visible " 
    >
      {/* FIX 1: Lowered z-index to 0 so it stays behind. 
         FIX 2: Added pointer-events-none so the "glass pane" doesn't block scrolling.
         Note: If your NeonGlobe needs mouse movement, the internal canvas usually 
         handles its own listeners, but the container shouldn't block the page.
      */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <NeonScene />
      </div>

      {/* FIX 3: Removed 'display: none' so your content is visible.
         FIX 4: Added pointer-events-none to the container but 
         pointer-events-auto to the clickable elements.
      */}
      <div 
        className="container relative z-10 flex flex-col justify-between items-stretch h-full py-20 pointer-events-none" 
        style={{ justifyContent: 'space-between', alignItems: 'stretch', 'paddingTop': '150px' }} 
      >
        {/* Top Section */}
        <div className="pt-10 md:pt-20">
          <RisingText>
            {/* Changed text to black for white background visibility */}
            <h1 className="font-thin leading-[1.1] text-4xl sm:text-5xl md:text-[68px] text-black">
              <span className="text-transparent animated-gradient">Create.</span>{" "}
              <HomeWordRoller />
            </h1>
          </RisingText>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-[1fr] md:grid-cols-[2fr_1fr_2fr] gap-8 pb-10 items-center">
          
          <div className="flex flex-col justify-end items-center md:items-start gap-4 h-full pointer-events-auto">
             <AnimatedText
              className="text-black hero-section-desc-text"
              delay={0.5}
              duration={2.5}
            >
              DUBAI &nbsp;|&nbsp; LAHORE &nbsp;|&nbsp; LONDON &nbsp;|&nbsp; NEW YORK

           

            </AnimatedText>
          </div>

          <div className="flex flex-col justify-end items-center h-full pointer-events-auto">
            <animated.img
              src={Mouse}
              alt="Scroll"
              className="w-[30px] h-[43px] cursor-pointer"
              style={{ ...mouseSpring, filter: 'brightness(1)' }}
              onClick={handleScroll}
            />
          </div>

          <div className="text-center md:text-right">
            <AnimatedText
              className="text-black hero-section-desc-text"
              delay={0.5}
              duration={2.5}
            >
              Your one stop solution business solution.
            </AnimatedText>
            
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;