import React, { useEffect, useRef } from "react";

const ScrollLineBottom = () => {
  const pathRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;
    const pathLength = path.getTotalLength();

    // Initial dash setup
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

const handleScroll = () => {
  const svgTop = svg.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;

  const start = windowHeight * 0.9;
  const end = windowHeight * 0.1;

  let progress = (svgTop - end) / (start - end);
  progress = Math.min(Math.max(progress, 0), 1);

  // Draw top → bottom (same as first component)
  path.style.strokeDashoffset = pathLength * progress;
};


    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <svg
      ref={svgRef}
      width="1735"
      height="432"
      viewBox="0 0 1735 432"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="second-svg"
    >
     <path
  ref={pathRef}
  opacity="0.8"
  d="M1267.93 0V5.00289C1267.93 30.408 1247.33 51.0029 1221.93 51.0029H48.5C23.0949 51.0029 2.5 71.5978 2.5 97.0029V208.192C2.5 233.597 23.0949 254.192 48.5 254.192H1686.5C1711.91 254.192 1732.5 274.787 1732.5 300.192V383C1732.5 408.405 1711.91 429 1686.5 429H1662.27"
  stroke="url(#gradientBottom)"
  strokeWidth="5"
  fill="none"
/>


      <defs>
        <linearGradient
          id="gradientBottom"
          x1="1681.18"
          y1="-10.6942"
          x2="1681.18"
          y2="429.411"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#01002B" />
          <stop offset="0.104167" stopColor="#325FEC" />
          <stop offset="0.965816" stopColor="#325FEC" />
          <stop offset="1" stopColor="#01002B" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ScrollLineBottom;
