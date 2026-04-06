import React, { useEffect, useRef } from "react";

const ScrollLine = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;
    if (!path || !svg) return;

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;

    const handleScroll = () => {
      const rect = svg.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      /**
       * 🚀 SPEED TWEAKING ZONE
       * * 1. 'distance' is how far the top of the SVG is from the bottom of the screen.
       * 2. 'speedMultiplier': Increase this to make it draw faster. 
       * (e.g., 2.0 means it draws twice as fast as the scroll).
       */
      const distance = windowHeight - rect.top;
      const speedMultiplier = 1.5; // Adjust this: 1.0 is natural, 2.0+ is very fast
      
      // Calculate progress based on visible area * multiplier
      let scrollProgress = (distance / windowHeight) * speedMultiplier;
      
      // Clamp between 0 and 1
      scrollProgress = Math.min(Math.max(scrollProgress, 0), 1);

      // Apply to the stroke
      path.style.strokeDashoffset = `${pathLength * (1 - scrollProgress)}`;
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 

    return () => window.removeEventListener("scroll", handleScroll);
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
      style={{ pointerEvents: 'none', marginBottom: '50px' }} // Added margin to ensure space to scroll
    >
      <path
        ref={pathRef}
        d="M1652.13 2.5H1690.5C1715.91 2.5 1736.5 23.0949 1736.5 48.5V222.5C1736.5 247.905 1715.91 268.5 1690.5 268.5H52.5C27.0949 268.5 6.5 289.095 6.5 314.5V685.5C6.5 710.905 27.0949 731.5 52.5 731.5H80.749"
        stroke="url(#gradient)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        // 🔹 SMOOTHNESS: Keep linear for direct mapping to scroll
        style={{ transition: 'stroke-dashoffset 0.15s linear' }} 
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