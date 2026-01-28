import React, { useEffect, useRef } from "react";

const ScrollLine = () => {
  const pathRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;
    if (!path || !svg) return;

    const pathLength = path.getTotalLength();
    
    path.style.strokeDasharray = pathLength;
    // Initial 30% visible (70% offset)
    path.style.strokeDashoffset = pathLength * 1;

    const scrollContainer = svg.closest(".allow-internal-scroll");

    const handleScroll = () => {
      if (!scrollContainer) return;

      const scrollTop = scrollContainer.scrollTop;
      
      const startScroll = 0;   
      /** * 🔹 SPEED TWEAK: 
       * Lower number = Faster drawing. 
       * Reduced from 800 to 500.
       */
      const finishScroll = 400; 

      let scrollProgress = (scrollTop - startScroll) / (finishScroll - startScroll);
      scrollProgress = Math.min(Math.max(scrollProgress, 0), 1);

      // Map scroll 0-1 to visual 0.3-1.0
      const visualProgress = 0.3 + (scrollProgress * 0.7);

      path.style.strokeDashoffset = pathLength * (1 - visualProgress);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll(); 
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      width="1743"
      height="742"
      viewBox="0 0 1743 742"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      style={{ pointerEvents: 'none' }}
    >
      <path
        ref={pathRef}
        d="M1652.13 2.5H1690.5C1715.91 2.5 1736.5 23.0949 1736.5 48.5V222.5C1736.5 247.905 1715.91 268.5 1690.5 268.5H52.5C27.0949 268.5 6.5 289.095 6.5 314.5V685.5C6.5 710.905 27.0949 731.5 52.5 731.5H80.749"
        stroke="url(#gradient)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        // 🔹 SMOOTHNESS TWEAK: 
        // Reduced transition time slightly to keep up with the faster speed
        style={{ transition: 'stroke-dashoffset 0.1s linear' }} 
      />
      <defs>
        <linearGradient
          id="gradient"
          x1="39.6245"
          y1="2.12241"
          x2="39.6245"
          y2="604"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#01002B" />
          <stop offset="0.0314417" stopColor="#3768FF" />
          <stop offset="0.959393" stopColor="#325FEC" />
          <stop offset="1" stopColor="#01002B" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ScrollLine;