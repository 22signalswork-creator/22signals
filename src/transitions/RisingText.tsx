import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface RisingTextProps {
  children: React.ReactNode;
}

const RisingText: React.FC<RisingTextProps> = ({ children }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !triggerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      { 
        y: "100%", 
        opacity: 0 
      },
      {
        y: "0%",
        opacity: 1,
        ease: "none", // Scrubbing feels best with "none" or "power1.out"
        scrollTrigger: {
          trigger: triggerRef.current,
          // "top 90%" means animation starts when the top of the element hits 90% of viewport
          // "top 60%" means animation ends when the top of the element hits 60% of viewport
          start: "top 95%", 
          end: "top 70%",
          scrub: 1, // Smoothly catches up to the scrollbar (1 second delay for smoothness)
          toggleActions: "restart pause resume reverse",
        }
      }
    );
  }, []);

  return (
    <span 
      ref={triggerRef}
      className="rising-window-mask" 
      style={{ 
        display: 'inline-block', 
        overflow: 'hidden', 
        verticalAlign: 'bottom'
      }}
    >
      <span 
        ref={containerRef} 
        className="rising-reveal-layer" 
        style={{ 
          display: 'inline-block', 
          willChange: 'transform, opacity'
        }}
      >
        {children}
      </span>
    </span>
  );
};

export default RisingText;