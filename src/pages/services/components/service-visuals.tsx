import React from "react";

/**
 * Branded service visuals — dark blue themed "mockup" illustrations
 * used as the right-side image inside service cards on the Services page.
 * Stays on-brand (blue + dark) instead of showing random photos.
 */

interface VisualProps {
  className?: string;
}

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="relative w-full h-full rounded-[14px] overflow-hidden"
    style={{
      background:
        "linear-gradient(135deg, #0E1628 0%, #050A18 60%, #02040D 100%)",
      border: "1px solid rgba(80,140,255,0.2)",
    }}
  >
    <div
      className="absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(80,140,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(80,140,255,0.5) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
    {children}
  </div>
);

// Digital & AI: code editor mockup
export const VisualDigital: React.FC<VisualProps> = () => (
  <Frame>
    <div className="absolute top-3 left-3 right-3 h-5 flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-red-400/60" />
      <span className="w-2 h-2 rounded-full bg-yellow-400/60" />
      <span className="w-2 h-2 rounded-full bg-green-400/60" />
      <span className="ml-2 text-[9px] tracking-widest text-blue-300/70 uppercase">
        api/intelligence.ts
      </span>
    </div>
    <svg viewBox="0 0 280 200" className="absolute inset-0 mt-9 px-3">
      <g fontFamily="monospace" fontSize="9" fill="rgba(180,200,255,0.85)">
        <text x="6" y="14"><tspan fill="rgba(150,170,255,0.5)">01</tspan>  <tspan fill="#6B92FF">const</tspan> agent = <tspan fill="#A8C5FF">await</tspan> spawn(</text>
        <text x="6" y="30"><tspan fill="rgba(150,170,255,0.5)">02</tspan>    {"{"} model: <tspan fill="#A8C5FF">"opus-4"</tspan>, </text>
        <text x="6" y="46"><tspan fill="rgba(150,170,255,0.5)">03</tspan>      tools: [<tspan fill="#A8C5FF">"vector"</tspan>, <tspan fill="#A8C5FF">"web"</tspan>]{"}"}</text>
        <text x="6" y="62"><tspan fill="rgba(150,170,255,0.5)">04</tspan>  );</text>
        <text x="6" y="80"><tspan fill="rgba(150,170,255,0.5)">05</tspan>  </text>
        <text x="6" y="96"><tspan fill="rgba(150,170,255,0.5)">06</tspan>  <tspan fill="#6B92FF">return</tspan> agent.<tspan fill="#FFB48C">predict</tspan>(input);</text>
        <text x="6" y="112"><tspan fill="rgba(150,170,255,0.5)">07</tspan>{"}"}</text>
      </g>
      <rect x="0" y="130" width="100%" height="40" fill="rgba(50,95,236,0.08)" />
      <text x="6" y="148" fontFamily="monospace" fontSize="8" fill="#7eaaff">
        ► Output: 99.4% confidence
      </text>
      <rect x="6" y="158" width="180" height="3" rx="1" fill="rgba(50,95,236,0.3)" />
      <rect x="6" y="158" width="160" height="3" rx="1" fill="#325FEC" />
    </svg>
  </Frame>
);

// Creative & Marketing: campaign analytics dashboard
export const VisualCreative: React.FC<VisualProps> = () => (
  <Frame>
    <div className="absolute top-3 left-3 text-[9px] tracking-widest text-blue-300/70 uppercase">
      Campaign · Q3
    </div>
    <svg viewBox="0 0 280 200" className="absolute inset-0">
      {/* Big number */}
      <text x="14" y="60" fontFamily="sans-serif" fontSize="32" fontWeight="200" fill="#fff">
        +247%
      </text>
      <text x="14" y="78" fontFamily="sans-serif" fontSize="9" fill="rgba(180,200,255,0.6)">
        ROI vs. previous quarter
      </text>
      {/* Chart line */}
      <path
        d="M14 150 Q 50 130, 80 138 T 140 110 T 200 95 T 264 60"
        stroke="#6B92FF"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M14 150 Q 50 130, 80 138 T 140 110 T 200 95 T 264 60 L 264 180 L 14 180 Z"
        fill="url(#cgrad)"
        opacity="0.3"
      />
      <defs>
        <linearGradient id="cgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#325FEC" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#325FEC" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Data points */}
      {[14, 80, 140, 200, 264].map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={[150, 138, 110, 95, 60][i]}
          r="3"
          fill="#fff"
          stroke="#325FEC"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  </Frame>
);

// Broadcasting: stream control overlay
export const VisualBroadcast: React.FC<VisualProps> = () => (
  <Frame>
    <div className="absolute top-3 left-3 right-3 flex justify-between items-center text-[9px] tracking-widest uppercase">
      <span className="flex items-center gap-1.5 text-red-400">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        LIVE
      </span>
      <span className="text-blue-300/70">125,432 viewers</span>
    </div>
    <svg viewBox="0 0 280 200" className="absolute inset-0">
      {/* Center "stream" video frame */}
      <rect x="20" y="40" width="240" height="110" rx="6" fill="rgba(50,95,236,0.15)" stroke="rgba(80,140,255,0.4)" strokeWidth="1" />
      <polygon points="130,75 130,115 165,95" fill="#325FEC" opacity="0.7" />
      {/* Audio bars */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const h = 4 + ((i * 13) % 24);
        return (
          <rect
            key={i}
            x={28 + i * 14}
            y={170 - h}
            width="6"
            height={h}
            rx="1"
            fill={i % 2 === 0 ? "#325FEC" : "#6B92FF"}
          />
        );
      })}
      {/* Score box */}
      <rect x="160" y="160" width="100" height="20" rx="3" fill="rgba(50,95,236,0.3)" />
      <text x="170" y="174" fontFamily="monospace" fontSize="9" fill="#fff">
        SET 2 · 3-1
      </text>
    </svg>
  </Frame>
);

// Manufacturing: supply chain network
export const VisualManufacturing: React.FC<VisualProps> = () => (
  <Frame>
    <div className="absolute top-3 left-3 text-[9px] tracking-widest text-blue-300/70 uppercase">
      Supply Chain · Live
    </div>
    <svg viewBox="0 0 280 200" className="absolute inset-0">
      {/* Network nodes */}
      <g>
        {[
          { x: 50, y: 60, label: "PK" },
          { x: 130, y: 40, label: "CN" },
          { x: 210, y: 70, label: "AE" },
          { x: 60, y: 130, label: "UK" },
          { x: 150, y: 150, label: "US" },
          { x: 220, y: 140, label: "SG" },
        ].map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="14" fill="rgba(50,95,236,0.15)" stroke="#325FEC" strokeWidth="1.5" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fff">
              {n.label}
            </text>
          </g>
        ))}
        {/* Connecting lines */}
        <g stroke="rgba(80,140,255,0.4)" strokeWidth="1" strokeDasharray="2 3">
          <line x1="50" y1="60" x2="130" y2="40" />
          <line x1="130" y1="40" x2="210" y2="70" />
          <line x1="50" y1="60" x2="60" y2="130" />
          <line x1="130" y1="40" x2="150" y2="150" />
          <line x1="210" y1="70" x2="220" y2="140" />
          <line x1="60" y1="130" x2="150" y2="150" />
          <line x1="150" y1="150" x2="220" y2="140" />
        </g>
      </g>
      {/* Legend strip */}
      <rect x="14" y="175" width="252" height="14" rx="2" fill="rgba(50,95,236,0.1)" />
      <text x="20" y="184" fontSize="8" fontFamily="monospace" fill="rgba(180,200,255,0.7)">
        ROUTES: 6 ACTIVE · COST -42%
      </text>
    </svg>
  </Frame>
);

// Outsourcing: team grid
export const VisualOutsourcing: React.FC<VisualProps> = () => (
  <Frame>
    <div className="absolute top-3 left-3 text-[9px] tracking-widest text-blue-300/70 uppercase">
      Team · 24 Members Online
    </div>
    <svg viewBox="0 0 280 200" className="absolute inset-0">
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4, 5].map((col) => {
          const x = 28 + col * 40;
          const y = 50 + row * 32;
          const isLead = row === 0 && col === 0;
          return (
            <g key={`${row}-${col}`}>
              <circle cx={x} cy={y} r="11" fill={isLead ? "#325FEC" : "rgba(50,95,236,0.2)"} stroke={isLead ? "#6B92FF" : "rgba(80,140,255,0.4)"} strokeWidth={isLead ? "2" : "1"} />
              <circle cx={x + 8} cy={y - 8} r="2.5" fill="#10B981" />
            </g>
          );
        })
      )}
      <text x="28" y="195" fontSize="8" fontFamily="monospace" fill="rgba(180,200,255,0.6)">
        ★ DEDICATED SUPERVISOR
      </text>
    </svg>
  </Frame>
);

// Game Dev: game UI mockup
export const VisualGame: React.FC<VisualProps> = () => (
  <Frame>
    <div className="absolute top-3 left-3 text-[9px] tracking-widest text-blue-300/70 uppercase">
      Build · v0.8.3
    </div>
    <svg viewBox="0 0 280 200" className="absolute inset-0">
      {/* HUD frame */}
      <rect x="14" y="30" width="252" height="150" rx="4" fill="rgba(50,95,236,0.08)" stroke="rgba(80,140,255,0.3)" strokeWidth="1" />
      {/* Health bar */}
      <rect x="22" y="40" width="60" height="6" rx="1" fill="rgba(255,255,255,0.1)" />
      <rect x="22" y="40" width="42" height="6" rx="1" fill="#10B981" />
      {/* Mana bar */}
      <rect x="22" y="50" width="60" height="6" rx="1" fill="rgba(255,255,255,0.1)" />
      <rect x="22" y="50" width="50" height="6" rx="1" fill="#325FEC" />
      {/* Score */}
      <text x="220" y="48" fontFamily="monospace" fontSize="11" fill="#fff" textAnchor="end">
        SCORE: 24,580
      </text>
      {/* Center 3D-ish geometry */}
      <g transform="translate(140, 110)">
        <polygon points="0,-25 22,12 -22,12" fill="rgba(50,95,236,0.4)" stroke="#6B92FF" strokeWidth="1" />
        <polygon points="0,15 22,40 -22,40" fill="rgba(50,95,236,0.6)" stroke="#6B92FF" strokeWidth="1" />
      </g>
      {/* Action bar */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={90 + i * 28} y={160} width="22" height="14" rx="2" fill="rgba(255,255,255,0.05)" stroke="rgba(80,140,255,0.3)" strokeWidth="0.8" />
      ))}
    </svg>
  </Frame>
);
