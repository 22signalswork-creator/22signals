import React, { useRef } from "react";
import gsap from "gsap";

interface HoverAnimateProps {
  children: React.ReactNode;
  scale?: number;
  y?: number;
  borderRadius?: string;
}

const HoverAnimate: React.FC<HoverAnimateProps> = ({ 
  children, 
  scale = 1.02, // Subtle, not "big"
  y = -6,       // Gentle lift
  borderRadius = "20px",
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    if (!elementRef.current) return;
    
    gsap.to(elementRef.current, {
      scale: scale,
      y: y,
      boxShadow: "0px 15px 30px rgba(0,0,0,0.1)", // Soft shadow
      duration: 0.5,       // Longer duration = smoother, less aggressive
      ease: "power1.out",   // Professional, steady ease
      overwrite: "auto",
    });
  };

  const onLeave = () => {
    if (!elementRef.current) return;

    gsap.to(elementRef.current, {
      scale: 1,
      y: 0,
      boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
      duration: 0.3,
      ease: "power1.inOut",
      overwrite: "auto",
    });
  };

  return (
    <div 
      ref={elementRef} 
      onMouseEnter={onEnter} 
      onMouseLeave={onLeave}
      className="w-full h-full"
      style={{ 
        borderRadius,
        overflow: "hidden",
        willChange: "transform", 
        cursor: "pointer"
      }}
    >
      {children}
    </div>
  );
};

export default HoverAnimate;