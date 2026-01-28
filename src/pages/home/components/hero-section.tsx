import React, { useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import gsap from "gsap";

// Assets
import heroImage from "@/assets/hero-section.png";
import Instagram from "@/assets/instagram.svg";
import linkedin from "@/assets/linkedin.svg";
import twiter from "@/assets/twiter.svg";
import whatsapp from "@/assets/whatsapp.svg";
import Mouse from "@/assets/Vector.svg";
import bgImage from "@/assets/background.jpeg";

interface HeroSectionProps {
  nextSectionRef: React.RefObject<HTMLDivElement>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ nextSectionRef }) => {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // Auto-run animation on load
      gsap.to(textRef.current, {
        backgroundSize: "100% 100%",
        duration: 2.5, // Time in seconds to complete the reveal
        ease: "power2.out", // Starts fast, ends smooth
        delay: 0.5, // Optional delay so it doesn't start instantly
      });
    }
  }, []);

  const mouseSpring = useSpring({
    loop: { reverse: true },
    from: { y: 0 },
    to: { y: 15 },
    config: { duration: 800 },
  });

  const handleScroll = () => {
    if (nextSectionRef.current) {
      nextSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative bg-cover bg-center -mt-12 md:-mt-30"
      style={{ backgroundImage: `url(${bgImage})`, height: '110vh', minHeight: '110vh' }}
    >
      <style>{`
        .hero-section-desc-text {
          position: relative;
          color: #e2e8f0; /* Base color (Light Grey) */
          background-image: linear-gradient(#0f172a, #0f172a); /* Reveal color (Dark) */
          background-repeat: no-repeat;
          background-size: 0% 100%; /* Starting state */
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline;
        }
      `}</style>

      <div className="container pt-32 md:pt-60 relative z-10">
        <div className="mx-auto flex flex-col items-center">
          <div className="w-full text-center md:text-left mt-18 ">
            
            <h1 className="font-thin leading-[1.1] text-4xl sm:text-5xl md:text-[68px]">
              <span className="text-transparent animated-gradient">Create.</span>{" "}
              <span className="bg-clip-text text-transparent bg-[linear-gradient(91.16deg,#325FEC_1.74%,#000000_43.71%,#000000_61.62%,#325FEC_102.48%)]">
                Innovate.
              </span>
            </h1>

            <div className="w-full bg-[#161922] rounded-2xl md:rounded-[38px] mt-6 md:mt-8 h-[400px] flex items-center justify-center">
              <img src={heroImage} alt="Hero" className="w-full h-full object-contain rounded-2xl md:rounded-[38px]" />
            </div>

            <div className="grid grid-cols-[1fr] md:grid-cols-[2fr_1fr_2fr] gap-8 my-10 md:my-12 items-center">
              <div className="flex flex-col justify-end items-center md:items-start gap-4 h-full">
                <div className="flex gap-4">
                  <img src={Instagram} alt="Instagram" className="w-[24px] h-[24px]" />
                  <img src={whatsapp} alt="WhatsApp" className="w-[24px] h-[24px]" />
                  <img src={linkedin} alt="LinkedIn" className="w-[24px] h-[24px]" />
                  <img src={twiter} alt="Twitter" className="w-[24px] h-[24px]" />
                </div>
              </div>

              <div className="flex flex-col justify-end items-center h-full">
                <animated.img
                  src={Mouse}
                  alt="Scroll"
                  className="w-[30px] h-[43px] cursor-pointer"
                  style={mouseSpring}
                  onClick={handleScroll}
                />
              </div>

              <div className="text-center md:text-left">
                <p 
                  ref={textRef} 
                  className="dark-text hero-section-desc-text"
                >
                  22 Signals: Your one stop solution business provider. We
                  leverage an agile global network to deliver high quality,
                  cost effective solutions and empower your journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;