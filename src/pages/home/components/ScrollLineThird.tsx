import React, { useEffect, useRef } from "react";

const ScrollLineThird = () => {
  const pathRef = useRef<SVGPathElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;

    if (!path || !svg) return;

    const pathLength = path.getTotalLength();

    // initial setup
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;

    const handleScroll = () => {
      const svgTop = svg.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      const start = windowHeight * 0.9;
      const end = windowHeight * 0.1;

      let progress = (svgTop - end) / (start - end);
      progress = Math.min(Math.max(progress, 0), 1);

      // SAME logic as your working component
      path.style.strokeDashoffset = `${pathLength * progress}`;
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <svg
      ref={svgRef}
      width="1743"
      height="2200"
      viewBox="0 0 1743 742"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="thirdsvg"
    >
      <g opacity="0.8">
        <path
          ref={pathRef}
          d="M1652.13 2.5H1690.5C1715.91 2.5 1736.5 23.0949 1736.5 48.5V222.5C1736.5 247.905 1715.91 268.5 1690.5 268.5H52.5C27.0949 268.5 6.5 289.095 6.5 314.5V685.5C6.5 710.905 27.0949 731.5 52.5 731.5H80.749"
          stroke="url(#gradientThird)"
          strokeWidth="5"
          fill="none"
        />
      </g>

      <defs>
        <linearGradient
          id="gradientThird"
          x1="43.6245"
          y1="2.5"
          x2="43.6245"
          y2="731.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#01002B" />
          <stop offset="0.0314417" stopColor="#504CFF" />
          <stop offset="0.959393" stopColor="#504CFF" />
          <stop offset="1" stopColor="#01002B" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ScrollLineThird;