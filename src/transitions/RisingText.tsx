import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface RisingTextProps {
  text: string;
  className?: string; // This is where you pass "animated-gradient"
  delay?: number;
}

const RisingText: React.FC<RisingTextProps> = ({ text, className = "", delay = 4 }) => {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // 1. Set initial state: shifted down by 100% of its own height
      gsap.set(textRef.current, { y: "100%" });

      // 2. Auto-animate up after the 2s delay
      gsap.to(textRef.current, {
        y: "0%",
        duration: 2,
        delay: delay,
        ease: "power4.out",
      });
    }
  }, [delay, text]);

  return (
    <>
      <style>{`
        /* The "Window" that hides the text while it's below */
        .rising-window-mask {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          /* Adjusting line-height prevents the top of letters from being cut */
          line-height: 1.3; 
        }

        /* The moving layer */
        .rising-reveal-layer {
          display: inline-block;
          will-change: transform;
        }
      `}</style>
      
      <span className="rising-window-mask">
        <span 
          ref={textRef} 
          className={`rising-reveal-layer ${className} animated-gradient`}
        >
          {text}
        </span>
      </span>
    </>
  );
};

export default RisingText;