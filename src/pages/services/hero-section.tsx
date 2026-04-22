import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./services.css";
import MyButton from "@/components/CustomButton";
import AnimatedText from "@/transitions/herosectionP.tsx";
import RisingText from "@/transitions/RisingText";

export default function HeroSection() {
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Background appears first
    tl.fromTo(
      bgRef.current,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" }
    );

    // 2. Title, Description, and Button appear 1 by 1
    // We use a small overlap (-=0.8) so the first text starts while the bg finishes
    tl.fromTo(
      [titleRef.current, descRef.current, btnRef.current],
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.3, // This creates the "1 by 1" effect
        ease: "power3.out" 
      },
      "-=0.8" 
    );
  }, []);

  return (
    <section className="hero-section">
      <div className="container">
        
        {/* Step 1: Background */}
        <div ref={bgRef} className="servicebg-wrapper">
          <div className="servicebg">
            
            <div className="content-container">
              <div className="service-content">
                
                {/* Step 2: Title */}
                <div ref={titleRef}>
                  <RisingText>
                    <h1>Creative Marketing Solutions</h1>
                  </RisingText>
                </div>

                {/* Step 3: Description */}
                <div ref={descRef}>
                  <AnimatedText className="dark-text text-base md:text-lg max-w-xl">
                    We help businesses grow, launch products, and build enduring
                    relationships with their communities.
                  </AnimatedText>
                </div>

                {/* Step 4: Button */}
                <div ref={btnRef} className="mt-15">
                  <RisingText>
                    <MyButton text="GET STARTED" />
                  </RisingText>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}