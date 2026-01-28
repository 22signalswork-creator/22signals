import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ProjectCardContent, { projects } from "./projectcard.js";
import cardbg from "@/assets/cartbg.png";
// ... baaki imports same

const PortfolioSection = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Sab cards ke background containers ko select karein
    const backgrounds = gsap.utils.toArray(".card-bg-layer");
    
    backgrounds.forEach((bg) => {
      gsap.to(bg, {
        y: -20, // Background thoda upar-niche hoga
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }, { scope: sectionRef });

  return (
    <div ref={sectionRef} className="relative w-full bg-[#000202] text-white pt-20">
      <section className="container mx-auto px-4 md:px-8 relative z-10 py-12">
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, idx) => (
            <div key={idx} className="relative h-[414px] overflow-hidden rounded-2xl flex items-center group">
              
              {/* Yeh Layer Move Karegi (Card Background) */}
              <div 
                className="card-bg-layer absolute inset-0 z-0"
                style={{
                  backgroundImage: `url(${cardbg})`,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  transform: "scale(1.1)" // Thoda scale kiya taaki movement ke waqt edges na dikhein
                }}
              />

              {/* Yeh Content Still Rahega */}
              <div className="relative z-10 w-full h-full">
                 <ProjectCardContent project={project} />
              </div>

            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PortfolioSection;