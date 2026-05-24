import React from "react";

/**
 * Decorative SVGs shared across all service cards.
 * Same geometric/triangular language as the brand → unified look.
 * Each one is positioned at the right of a card, semi-transparent.
 */

interface DecoProps {
  tone?: "blue" | "dark";
}

const baseColor = (tone?: "blue" | "dark") =>
  tone === "blue" ? "rgba(255,255,255,0.18)" : "rgba(80,140,255,0.22)";

const accent = (tone?: "blue" | "dark") =>
  tone === "blue" ? "rgba(255,255,255,0.28)" : "rgba(80,140,255,0.4)";

export const DecoTriangles: React.FC<DecoProps> = ({ tone }) => (
  <svg
    viewBox="0 0 320 320"
    className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-[280px] md:w-[320px] h-auto"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="160,40 220,140 100,140" fill={baseColor(tone)} />
    <polygon points="220,140 280,240 160,240" fill={accent(tone)} />
    <polygon points="100,140 160,240 40,240" fill={baseColor(tone)} />
    <polygon
      points="160,240 200,300 120,300"
      fill={accent(tone)}
      opacity="0.6"
    />
  </svg>
);

export const DecoCircuit: React.FC<DecoProps> = ({ tone }) => (
  <svg
    viewBox="0 0 320 320"
    className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-[260px] md:w-[300px] h-auto"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="160" cy="160" r="80" stroke={accent(tone)} strokeWidth="1" />
    <circle cx="160" cy="160" r="120" stroke={baseColor(tone)} strokeWidth="1" />
    <circle cx="160" cy="160" r="40" fill={baseColor(tone)} />
    <circle cx="160" cy="160" r="20" fill={accent(tone)} />
    <line x1="40" y1="160" x2="120" y2="160" stroke={baseColor(tone)} strokeWidth="1" />
    <line x1="200" y1="160" x2="280" y2="160" stroke={baseColor(tone)} strokeWidth="1" />
    <line x1="160" y1="40" x2="160" y2="120" stroke={baseColor(tone)} strokeWidth="1" />
    <line x1="160" y1="200" x2="160" y2="280" stroke={baseColor(tone)} strokeWidth="1" />
    <circle cx="40" cy="160" r="3" fill={accent(tone)} />
    <circle cx="280" cy="160" r="3" fill={accent(tone)} />
    <circle cx="160" cy="40" r="3" fill={accent(tone)} />
    <circle cx="160" cy="280" r="3" fill={accent(tone)} />
  </svg>
);

export const DecoData: React.FC<DecoProps> = ({ tone }) => (
  <svg
    viewBox="0 0 320 320"
    className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-[240px] md:w-[280px] h-auto"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {[60, 100, 140, 180, 220, 260].map((x, i) => (
      <rect
        key={i}
        x={x}
        y={260 - (i % 3 === 0 ? 120 : i % 2 === 0 ? 80 : 160)}
        width="20"
        height={i % 3 === 0 ? 120 : i % 2 === 0 ? 80 : 160}
        fill={i % 2 === 0 ? accent(tone) : baseColor(tone)}
        rx="3"
      />
    ))}
    <path
      d="M50 220 Q 130 140, 200 180 T 290 100"
      stroke={accent(tone)}
      strokeWidth="2"
      fill="none"
      opacity="0.7"
    />
  </svg>
);

export const DecoCloud: React.FC<DecoProps> = ({ tone }) => (
  <svg
    viewBox="0 0 320 320"
    className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-[260px] md:w-[300px] h-auto"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="160" cy="180" rx="100" ry="50" fill={baseColor(tone)} />
    <ellipse cx="200" cy="160" rx="80" ry="40" fill={accent(tone)} opacity="0.6" />
    <ellipse cx="120" cy="160" rx="70" ry="35" fill={baseColor(tone)} />
    <line x1="120" y1="220" x2="120" y2="260" stroke={accent(tone)} strokeDasharray="3 3" />
    <line x1="160" y1="220" x2="160" y2="270" stroke={accent(tone)} strokeDasharray="3 3" />
    <line x1="200" y1="220" x2="200" y2="260" stroke={accent(tone)} strokeDasharray="3 3" />
    <rect x="100" y="260" width="40" height="20" rx="3" fill={accent(tone)} opacity="0.7" />
    <rect x="150" y="270" width="40" height="20" rx="3" fill={baseColor(tone)} />
    <rect x="200" y="260" width="40" height="20" rx="3" fill={accent(tone)} opacity="0.7" />
  </svg>
);

export const DecoSparkle: React.FC<DecoProps> = ({ tone }) => (
  <svg
    viewBox="0 0 320 320"
    className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-[260px] md:w-[300px] h-auto"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M160 60 L180 140 L260 160 L180 180 L160 260 L140 180 L60 160 L140 140 Z"
      fill={accent(tone)}
      opacity="0.7"
    />
    <path
      d="M70 80 L80 110 L110 120 L80 130 L70 160 L60 130 L30 120 L60 110 Z"
      fill={baseColor(tone)}
    />
    <path
      d="M250 200 L260 230 L290 240 L260 250 L250 280 L240 250 L210 240 L240 230 Z"
      fill={baseColor(tone)}
    />
  </svg>
);

export const DecoTeam: React.FC<DecoProps> = ({ tone }) => (
  <svg
    viewBox="0 0 320 320"
    className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-[260px] md:w-[300px] h-auto"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="160" cy="120" r="32" fill={accent(tone)} />
    <circle cx="100" cy="180" r="28" fill={baseColor(tone)} />
    <circle cx="220" cy="180" r="28" fill={baseColor(tone)} />
    <circle cx="160" cy="240" r="24" fill={accent(tone)} opacity="0.8" />
    <line x1="160" y1="120" x2="100" y2="180" stroke={accent(tone)} strokeWidth="1" />
    <line x1="160" y1="120" x2="220" y2="180" stroke={accent(tone)} strokeWidth="1" />
    <line x1="100" y1="180" x2="160" y2="240" stroke={accent(tone)} strokeWidth="1" />
    <line x1="220" y1="180" x2="160" y2="240" stroke={accent(tone)} strokeWidth="1" />
    <line x1="100" y1="180" x2="220" y2="180" stroke={baseColor(tone)} strokeWidth="1" strokeDasharray="3 3" />
  </svg>
);

export const DecoBroadcast: React.FC<DecoProps> = ({ tone }) => (
  <svg
    viewBox="0 0 320 320"
    className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-[280px] md:w-[320px] h-auto"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="160" cy="180" r="20" fill={accent(tone)} />
    <path
      d="M120 180 A40 40 0 0 1 200 180"
      stroke={accent(tone)}
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M90 180 A70 70 0 0 1 230 180"
      stroke={baseColor(tone)}
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M60 180 A100 100 0 0 1 260 180"
      stroke={baseColor(tone)}
      strokeWidth="1.5"
      fill="none"
      opacity="0.7"
    />
    <path
      d="M30 180 A130 130 0 0 1 290 180"
      stroke={baseColor(tone)}
      strokeWidth="1"
      fill="none"
      opacity="0.5"
    />
  </svg>
);

export const DecoFactory: React.FC<DecoProps> = ({ tone }) => (
  <svg
    viewBox="0 0 320 320"
    className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-[260px] md:w-[300px] h-auto"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="80" y="180" width="160" height="80" fill={baseColor(tone)} />
    <polygon points="80,180 120,140 160,180" fill={accent(tone)} />
    <polygon points="160,180 200,140 240,180" fill={accent(tone)} />
    <rect x="180" y="120" width="20" height="60" fill={baseColor(tone)} />
    <rect x="100" y="210" width="20" height="30" fill={accent(tone)} opacity="0.7" />
    <rect x="140" y="210" width="20" height="30" fill={accent(tone)} opacity="0.7" />
    <rect x="180" y="210" width="20" height="30" fill={accent(tone)} opacity="0.7" />
    <circle cx="190" cy="100" r="8" fill={accent(tone)} opacity="0.5" />
    <circle cx="200" cy="80" r="6" fill={accent(tone)} opacity="0.4" />
    <circle cx="195" cy="60" r="4" fill={accent(tone)} opacity="0.3" />
  </svg>
);
