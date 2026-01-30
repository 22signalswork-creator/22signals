import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Preloaderimg from "@/assets/preloader.png"

interface Props { onComplete: () => void; }

const Preloader: React.FC<Props> = ({ onComplete }) => {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => onComplete(),
      });

      // 1. Logo slides up from mask
      tl.to(".logo-img", {
        y: 0,
        duration: 1.2,
        ease: "power4.out",
      })
      // 2. Short pause
      .to({}, { duration: 0.4 })
      // 3. The "Signal" Zoom (Scales the logo container to cover screen)
      .to(".logo-container", {
        scale: 80,
        duration: 1.5,
        ease: "expo.inOut",
      })
      // 4. Fade out the whole black overlay
      .to(scope.current, {
        opacity: 0,
        duration: 0.6,
      }, "-=0.3");
    }, scope);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={scope} className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#325FEC]">
      <div className="logo-container relative overflow-hidden p-4">
        <img 
          src={Preloaderimg}
          className="logo-img w-32 md:w-48 h-auto translate-y-[110%]" 
        />
      </div>
    </div>
  );
};

export default Preloader;