import React, { useRef } from "react";
import gsap from "gsap";

interface HoverAnimateProps {
  children: React.ReactNode;
  scale?: number;
  y?: number;
  depth?: string;
  borderRadius?: string; // New prop for rounded corners
}

const HoverAnimate: React.FC<HoverAnimateProps> = ({ 
  children, 
  scale = 1.03, 
  y = -10,
  depth = "0px 20px 40px rgba(0,0,0,0.15)",
  borderRadius = "5px", // default radius
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    gsap.to(elementRef.current, {
      scale: scale,
      y: y,
      boxShadow: depth,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const onLeave = () => {
    gsap.to(elementRef.current, {
      scale: 1,
      y: 0,
      boxShadow: "0px 0px 0px rgba(0,0,0,0)",
      duration: 0.4,
      ease: "power2.inOut",
    });
  };

  return (
    <div 
      ref={elementRef} 
      onMouseEnter={onEnter} 
      onMouseLeave={onLeave}
      className="w-full h-full transition-shadow duration-300"
      style={{ 
        willChange: "transform, box-shadow",
        borderRadius: borderRadius, // Apply border radius
        overflow: "hidden" // optional: ensures children don't overflow corners
      }}
    >
      {children}
    </div>
  );
};

export default HoverAnimate;
