import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface RisingTextProps {
  children: React.ReactNode;
  delay?: number; // Optional delay before animation
}

const RisingText: React.FC<RisingTextProps> = ({ children, delay = 0.5 }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Set initial position: down 100%
      gsap.set(containerRef.current, { y: "100%" });

      // Animate up
      gsap.to(containerRef.current, {
        y: "0%",
        duration: 2,
        delay: delay,
        ease: "power4.out",
      });
    }
  }, [delay]);

  return (
    <>
      <style>{`
        .rising-window-mask {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          line-height: 1.3; /* Prevent cutting letters */
        }

        .rising-reveal-layer {
          display: inline-block;
          will-change: transform;
        }
      `}</style>

      <span className="rising-window-mask">
        <span ref={containerRef} className="rising-reveal-layer">
          {children}
        </span>
      </span>
    </>
  );
};

export default RisingText;
