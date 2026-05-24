import React, { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
}

const ScrollLineV2: React.FC<Props> = ({ children }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;
    if (!path || !svg) return;

    const pathLength = path.getTotalLength();
    path.setAttribute("stroke-dasharray", String(pathLength));
    path.setAttribute("stroke-dashoffset", String(pathLength));

    let raf = 0;
    let lastTop = Number.POSITIVE_INFINITY;

    const tick = () => {
      const rect = svg.getBoundingClientRect();
      if (rect.top !== lastTop) {
        lastTop = rect.top;
        const wh = window.innerHeight;
        const distance = wh - rect.top;
        let progress = (distance / wh) * 1.5;
        progress = Math.max(0, Math.min(1, progress));
        const offset = pathLength * (1 - progress);
        path.setAttribute("stroke-dashoffset", String(offset));
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  if (isMobile) return <>{children}</>;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1743 / 500",
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1743 742"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: -1, // sit BEHIND the video and stat cards
          display: "block",
          overflow: "visible",
        }}
      >
        <path
          ref={pathRef}
          d="M1652.13 2.5H1690.5C1715.91 2.5 1736.5 23.0949 1736.5 48.5V222.5C1736.5 247.905 1715.91 268.5 1690.5 268.5H52.5C27.0949 268.5 6.5 289.095 6.5 314.5V685.5C6.5 710.905 27.0949 731.5 52.5 731.5H80.749"
          stroke="url(#scrollLineV2Gradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <defs>
          <linearGradient
            id="scrollLineV2Gradient"
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

      <div
        style={{
          position: "relative",
          // Stats cards sit at ~75% down so they cover the bottom-left
          // endpoint of the line, hiding it behind the leftmost card.
          top: "75%",
          left: "5%",
          right: "5%",
          width: "90%",
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollLineV2;
