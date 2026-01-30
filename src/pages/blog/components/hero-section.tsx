import React, { useEffect, useRef } from "react";
import { useSpring } from "@react-spring/web";
import "@/pages/services/services.css";
import serviceBg from "@/assets/servicebg.png";
import gsap from "gsap";
import RisingText from "@/transitions/RisingText";

interface HeroSectionProps {
  nextSectionRef: React.RefObject<HTMLDivElement>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ nextSectionRef }) => {
  const textRef = useRef<HTMLParagraphElement>(null);

  /* =====================
     TEXT REVEAL FIX
  ===================== */
  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { backgroundSize: "0% 100%" },
        {
          backgroundSize: "100% 100%",
          duration: 2.5,
          ease: "power2.out",
          delay: 0.5,
        }
      );
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
    <section className="hero-section">
      {/* ===== REQUIRED CSS FOR ANIMATION ===== */}
      <style>{`
        .hero-text-reveal {
          background-image: linear-gradient(#000000, #000000);
          background-repeat: no-repeat;
          background-size: 0% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }
      `}</style>

      <div className="container">
        <div className="servicebg-wrapper">
          <div
            className="w-[1600px] h-[657px] -mx-[70px] rounded-[50px] flex items-center relative"
            style={{
              backgroundImage: `
                linear-gradient(
                  to top,
                  rgba(50, 95, 236, 0.25) 7%,
                  rgba(50, 95, 236, 0.15) 25%,
                  rgba(50, 95, 236, 0) 52%
                ),
                url(${serviceBg})
              `,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="content-container w-full">
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-12 gap-5">
                <RisingText>
                <h1>
                  Insights & <br /> Perspectives
                </h1>
                </RisingText>
                {/* ===== ANIMATED TEXT ===== */}
                <p
                  ref={textRef}
                  className="hero-text-reveal px-10 md:px-0"
                >
                  Thoughts on design, technology, and the future of digital
                  experiences
                </p>

                <div className="flex justify-center">
                  <input
                    type="text"
                    placeholder="Search Articles......."
                    className="w-[300px] md:w-[970px] px-4 py-4 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* next section anchor */}
      <div ref={nextSectionRef} />
    </section>
  );
};

export default HeroSection;
