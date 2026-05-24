import React, { useEffect, useRef } from "react";
import "@/pages/services/services.css";
import serviceBg from "@/assets/servicebg.png";
import gsap from "gsap";
import RisingText from "@/transitions/RisingText";

interface HeroSectionProps {
  nextSectionRef: React.RefObject<HTMLDivElement>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ nextSectionRef }) => {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { backgroundSize: "0% 100%" },
        { backgroundSize: "100% 100%", duration: 2.5, ease: "power2.out", delay: 0.5 }
      );
    }
  }, []);

  return (
    <section className="hero-section">
      <div className="container">
        <div className="servicebg-wrapper ">
          <div
            className="servicebg w-[1600px] h-[657px]  -mx-[70px] rounded-[50px] flex items-center relative"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(50,95,236,0.25) 7%, rgba(50,95,236,0.15) 25%, rgba(50,95,236,0) 52%), url(${serviceBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="content-container w-full">
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-12 gap-5 mb-10">
                <RisingText>
                  <h1>
                    Industry Insights <br /> & Intel.
                  </h1>
                </RisingText>

                <p ref={textRef} className="dark-text px-10 md:px-0 max-w-3xl">
                  Expert perspectives on digital transformation, global supply chains,
                  esports marketing, and the future of scalable business operations.
                </p>

                <div className="flex justify-center w-full">
                  <input
                    type="text"
                    placeholder="Search articles, case studies, and company news..."
                    className="w-[260px] md:w-[800px] px-6 py-4 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={nextSectionRef} />
    </section>
  );
};

export default HeroSection;
