/**
 * One visual per service for the detail page hero, in the same dark-blue
 * "mockup" style as service-visuals.tsx (same frame, grid and palette).
 * City service pages use the visual of their global service.
 */
import React from "react";

const C = {
  dim: "rgba(150,170,255,0.5)",
  text: "rgba(180,200,255,0.85)",
  key: "#6B92FF",
  str: "#A8C5FF",
  fn: "#FFB48C",
  blue: "#325FEC",
  soft: "rgba(50,95,236,0.3)",
  label: "rgba(180,200,255,0.6)",
};

const Frame: React.FC<{ title: string; children: React.ReactNode; dots?: boolean }> = ({ title, children, dots = true }) => (
  <div
    className="relative w-full h-full rounded-[14px] overflow-hidden"
    style={{ background: "linear-gradient(135deg, #0E1628 0%, #050A18 60%, #02040D 100%)", border: "1px solid rgba(80,140,255,0.2)" }}
  >
    <div
      className="absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(80,140,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(80,140,255,0.5) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
    <div className="absolute top-3 left-3 right-3 h-5 flex items-center gap-1.5 z-10">
      {dots && (
        <>
          <span className="w-2 h-2 rounded-full bg-red-400/60" />
          <span className="w-2 h-2 rounded-full bg-yellow-400/60" />
          <span className="w-2 h-2 rounded-full bg-green-400/60" />
        </>
      )}
      <span className={`${dots ? "ml-2" : ""} text-[9px] tracking-widest text-blue-300/70 uppercase`}>{title}</span>
    </div>
    <svg viewBox="0 0 280 200" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
      {children}
    </svg>
  </div>
);

// Code panel: lines are arrays of [text, color] segments.
type Seg = [string, string?];
const Code: React.FC<{ title: string; lines: Seg[][]; footer: string; progress?: number }> = ({ title, lines, footer, progress = 0.85 }) => (
  <Frame title={title}>
    <g fontFamily="monospace" fontSize="9" fill={C.text}>
      {lines.map((segs, i) => (
        <text key={i} x="18" y={44 + i * 15}>
          <tspan fill={C.dim}>{String(i + 1).padStart(2, "0")}</tspan>
          {"  "}
          {segs.map(([t, c], j) => (
            <tspan key={j} fill={c || C.text}>
              {t}
            </tspan>
          ))}
        </text>
      ))}
    </g>
    <rect x="12" y="156" width="256" height="34" rx="4" fill="rgba(50,95,236,0.08)" />
    <text x="20" y="171" fontFamily="monospace" fontSize="8" fill="#7eaaff">
      ► {footer}
    </text>
    <rect x="20" y="178" width="180" height="3" rx="1" fill={C.soft} />
    <rect x="20" y="178" width={180 * progress} height="3" rx="1" fill={C.blue} />
  </Frame>
);

const Bars: React.FC<{ x: number; y: number; h: number; values: number[]; w?: number; gap?: number }> = ({ x, y, h, values, w = 14, gap = 8 }) => (
  <g>
    {values.map((v, i) => (
      <rect key={i} x={x + i * (w + gap)} y={y + h - h * v} width={w} height={h * v} rx="2" fill={i === values.length - 1 ? C.blue : "rgba(107,146,255,0.45)"} />
    ))}
  </g>
);

const Node: React.FC<{ x: number; y: number; w?: number; label: string; active?: boolean }> = ({ x, y, w = 72, label, active }) => (
  <g>
    <rect x={x} y={y} width={w} height="24" rx="6" fill={active ? "rgba(50,95,236,0.35)" : "rgba(255,255,255,0.04)"} stroke={active ? C.key : "rgba(107,146,255,0.35)"} />
    <text x={x + w / 2} y={y + 15.5} textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={active ? "#fff" : C.text}>
      {label}
    </text>
  </g>
);

const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number }> = ({ x1, y1, x2, y2 }) => (
  <g stroke={C.key} strokeWidth="1.2" opacity="0.8">
    <line x1={x1} y1={y1} x2={x2} y2={y2} />
    <circle cx={x2} cy={y2} r="2" fill={C.key} />
  </g>
);

const Big: React.FC<{ value: string; label: string; x?: number; y?: number }> = ({ value, label, x = 18, y = 62 }) => (
  <g>
    <text x={x} y={y} fontFamily="sans-serif" fontSize="28" fontWeight="200" fill="#fff">
      {value}
    </text>
    <text x={x} y={y + 16} fontFamily="sans-serif" fontSize="8.5" fill={C.label}>
      {label}
    </text>
  </g>
);

const VISUALS: Record<string, () => React.ReactElement> = {
  // Strategy and Go-to-Market: launch plan timeline
  "go-to-market": () => (
    <Frame title="launch-plan · q1" dots={false}>
      <line x1="24" y1="104" x2="256" y2="104" stroke="rgba(107,146,255,0.35)" strokeWidth="2" />
      <line x1="24" y1="104" x2="170" y2="104" stroke={C.blue} strokeWidth="2" />
      {[
        ["Research", 24, true],
        ["Position", 82, true],
        ["Price", 140, true],
        ["Launch", 198, false],
        ["Scale", 250, false],
      ].map(([l, x, done]) => (
        <g key={l as string}>
          <circle cx={x as number} cy="104" r="6" fill={done ? C.blue : "#0E1628"} stroke={C.key} strokeWidth="1.5" />
          <text x={x as number} y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={C.text}>
            {l as string}
          </text>
        </g>
      ))}
      <Big value="Week 3" label="of a 12-week launch plan, dates in writing" y={64} />
      <rect x="18" y="150" width="244" height="30" rx="6" fill="rgba(50,95,236,0.1)" stroke="rgba(107,146,255,0.25)" />
      <text x="28" y="169" fontFamily="sans-serif" fontSize="8.5" fill={C.text}>
        Next: pricing sign-off · owner: Signal Lead
      </text>
    </Frame>
  ),

  // AI Consulting: use-case ranking by value and effort
  "ai-consulting": () => (
    <Frame title="ai-roadmap · ranked use cases" dots={false}>
      <line x1="40" y1="170" x2="262" y2="170" stroke="rgba(107,146,255,0.4)" />
      <line x1="40" y1="40" x2="40" y2="170" stroke="rgba(107,146,255,0.4)" />
      <text x="262" y="184" textAnchor="end" fontFamily="sans-serif" fontSize="7.5" fill={C.label}>
        effort →
      </text>
      <text x="22" y="46" fontFamily="sans-serif" fontSize="7.5" fill={C.label} transform="rotate(-90 22 46)" textAnchor="end">
        value →
      </text>
      <rect x="40" y="40" width="111" height="65" fill="rgba(50,95,236,0.12)" />
      <text x="48" y="54" fontFamily="sans-serif" fontSize="7.5" fill="#7eaaff">
        BUILD FIRST
      </text>
      {[
        [70, 70, 7, true],
        [110, 86, 6, true],
        [180, 64, 5, false],
        [140, 130, 4, false],
        [220, 120, 5, false],
        [90, 146, 4, false],
      ].map(([x, y, r, hot], i) => (
        <circle key={i} cx={x as number} cy={y as number} r={r as number} fill={hot ? C.blue : "rgba(107,146,255,0.4)"} stroke={hot ? "#A8C5FF" : "none"} />
      ))}
    </Frame>
  ),

  // Business Optimization: process before and after
  "business-optimization": () => (
    <Frame title="process map · order to cash" dots={false}>
      <text x="18" y="48" fontFamily="sans-serif" fontSize="8" fill={C.label}>
        BEFORE · 9 steps · 4.5 days
      </text>
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={18 + i * 28} y="56" width="22" height="16" rx="3" fill={i % 3 === 1 ? "rgba(255,120,120,0.35)" : "rgba(255,255,255,0.06)"} stroke="rgba(107,146,255,0.3)" />
      ))}
      <text x="18" y="108" fontFamily="sans-serif" fontSize="8" fill="#7eaaff">
        AFTER · 4 steps · automated
      </text>
      <Node x={18} y={118} w={54} label="Order" active />
      <Arrow x1={72} y1={130} x2={84} y2={130} />
      <Node x={86} y={118} w={54} label="Check" active />
      <Arrow x1={140} y1={130} x2={152} y2={130} />
      <Node x={154} y={118} w={54} label="Invoice" active />
      <Arrow x1={208} y1={130} x2={220} y2={130} />
      <Node x={222} y={118} w={42} label="Paid" active />
      <text x="18" y="176" fontFamily="sans-serif" fontSize="9" fill="#fff">
        −5 manual steps
      </text>
    </Frame>
  ),

  // Business Intelligence: KPI board
  "business-intelligence": () => (
    <Frame title="kpi board · weekly" dots={false}>
      <Big value="£2.4M" label="revenue, all regions, one source of truth" />
      <Bars x={18} y={100} h={70} values={[0.35, 0.5, 0.45, 0.62, 0.58, 0.74, 0.9]} />
      {[
        ["Margin", "31%"],
        ["Pipeline", "£6.1M"],
        ["Churn", "2.1%"],
      ].map(([l, v], i) => (
        <g key={l}>
          <rect x="178" y={92 + i * 28} width="86" height="22" rx="5" fill="rgba(255,255,255,0.04)" stroke="rgba(107,146,255,0.25)" />
          <text x="186" y={106 + i * 28} fontFamily="sans-serif" fontSize="8" fill={C.label}>
            {l}
          </text>
          <text x="256" y={106 + i * 28} textAnchor="end" fontFamily="sans-serif" fontSize="9" fill="#fff">
            {v}
          </text>
        </g>
      ))}
    </Frame>
  ),

  // Power BI: report canvas with donut and bars
  "power-bi-consulting": () => (
    <Frame title="sales.pbix · report" dots={false}>
      <circle cx="70" cy="100" r="34" fill="none" stroke="rgba(107,146,255,0.25)" strokeWidth="12" />
      <circle cx="70" cy="100" r="34" fill="none" stroke={C.blue} strokeWidth="12" strokeDasharray="150 214" transform="rotate(-90 70 100)" />
      <circle cx="70" cy="100" r="34" fill="none" stroke="#A8C5FF" strokeWidth="12" strokeDasharray="40 214" strokeDashoffset="-150" transform="rotate(-90 70 100)" />
      <text x="70" y="104" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#fff">
        70%
      </text>
      <Bars x={132} y={62} h={88} values={[0.4, 0.55, 0.5, 0.7, 0.85]} w={16} gap={10} />
      <text x="18" y="176" fontFamily="monospace" fontSize="8" fill="#7eaaff">
        ► Refresh: 06:00 daily · RLS on
      </text>
    </Frame>
  ),

  // Data Engineering: pipeline
  "data-engineering": () => (
    <Frame title="pipeline · nightly load" dots={false}>
      {[
        ["CRM", 50],
        ["Billing", 90],
        ["Ads", 130],
      ].map(([l, y]) => (
        <g key={l as string}>
          <Node x={16} y={(y as number) - 12} w={58} label={l as string} />
          <Arrow x1={74} y1={y as number} x2={110} y2={100} />
        </g>
      ))}
      <Node x={112} y={88} w={66} label="Clean + model" active />
      <Arrow x1={178} y1={100} x2={200} y2={100} />
      <Node x={202} y={88} w={62} label="Warehouse" active />
      <text x="18" y="176" fontFamily="monospace" fontSize="8" fill="#7eaaff">
        ► 3 sources · 1.2M rows · tests passed
      </text>
    </Frame>
  ),

  // AI and Automation: workflow
  "ai-automation": () => (
    <Frame title="workflow · new enquiry" dots={false}>
      <Node x={16} y={44} w={74} label="Email arrives" />
      <Arrow x1={90} y1={56} x2={104} y2={56} />
      <Node x={106} y={44} w={74} label="AI reads + sorts" active />
      <Arrow x1={180} y1={56} x2={194} y2={56} />
      <Node x={196} y={44} w={68} label="CRM updated" />
      <Arrow x1={143} y1={68} x2={143} y2={88} />
      <Node x={98} y={90} w={90} label="Reply drafted" active />
      <Arrow x1={143} y1={114} x2={143} y2={130} />
      <Node x={98} y={132} w={90} label="Person approves" />
      <text x="18" y="182" fontFamily="sans-serif" fontSize="9" fill="#fff">
        Runs 24/7 · a person signs off
      </text>
    </Frame>
  ),

  // Custom AI Development: agent code
  "custom-ai-development": () => (
    <Code
      title="agents/support.ts"
      lines={[
        [["const ", C.key], ["agent = "], ["createAgent", C.fn], ["({"]],
        [["  data: "], ['"your-docs"', C.str], [","]],
        [["  tools: ["], ['"crm"', C.str], [", "], ['"search"', C.str], ["],"]],
        [["  guardrails: "], ["true", C.key], [","]],
        [["});"]],
        [["return ", C.key], ["agent."], ["answer", C.fn], ["(question);"]],
      ]}
      footer="Eval set: 92% correct · cited"
      progress={0.92}
    />
  ),

  // WhatsApp Automation: chat
  "whatsapp-automation": () => (
    <Frame title="whatsapp · 22:41" dots={false}>
      <rect x="18" y="42" width="150" height="26" rx="10" fill="rgba(255,255,255,0.07)" />
      <text x="28" y="59" fontFamily="sans-serif" fontSize="8.5" fill={C.text}>
        Hi, do you have a slot on Friday?
      </text>
      <rect x="96" y="76" width="166" height="38" rx="10" fill="rgba(50,95,236,0.45)" />
      <text x="106" y="92" fontFamily="sans-serif" fontSize="8.5" fill="#fff">
        Yes: 11:00 or 15:30.
      </text>
      <text x="106" y="105" fontFamily="sans-serif" fontSize="8.5" fill="#fff">
        Which works for you?
      </text>
      <rect x="18" y="122" width="70" height="26" rx="10" fill="rgba(255,255,255,0.07)" />
      <text x="28" y="139" fontFamily="sans-serif" fontSize="8.5" fill={C.text}>
        15:30 please
      </text>
      <text x="18" y="176" fontFamily="monospace" fontSize="8" fill="#7eaaff">
        ► Booked · added to CRM · reminder set
      </text>
    </Frame>
  ),

  // Cloud Consulting: architecture
  cloud: () => (
    <Frame title="architecture · production" dots={false}>
      <rect x="14" y="36" width="252" height="132" rx="8" fill="none" stroke="rgba(107,146,255,0.3)" strokeDasharray="4 3" />
      <text x="22" y="49" fontFamily="sans-serif" fontSize="7.5" fill={C.label}>
        VPC · eu-west-2
      </text>
      <Node x={24} y={70} w={60} label="Load balancer" />
      <Arrow x1={84} y1={82} x2={104} y2={70} />
      <Arrow x1={84} y1={82} x2={104} y2={102} />
      <Node x={106} y={58} w={56} label="App" active />
      <Node x={106} y={90} w={56} label="App" active />
      <Arrow x1={162} y1={70} x2={190} y2={86} />
      <Arrow x1={162} y1={102} x2={190} y2={86} />
      <Node x={192} y={74} w={64} label="Database" />
      <text x="24" y="148" fontFamily="monospace" fontSize="8" fill="#7eaaff">
        ► Uptime 99.98% · cost −28% this month
      </text>
    </Frame>
  ),

  // Cloud Migration: progress log
  "cloud-migration": () => (
    <Code
      title="migration.log"
      lines={[
        [["✓ ", "#7CE0A3"], ["inventory: 42 servers mapped"]],
        [["✓ ", "#7CE0A3"], ["wave 1: web tier moved"]],
        [["✓ ", "#7CE0A3"], ["wave 2: databases synced"]],
        [["… ", C.fn], ["wave 3: cutover "], ["Sat 02:00", C.str]],
        [["  rollback plan: "], ["ready", C.key]],
        [["  downtime budget: "], ["15 min", C.str]],
      ]}
      footer="Migration 72% complete"
      progress={0.72}
    />
  ),

  // DevOps Consulting: CI/CD pipeline
  "devops-consulting": () => (
    <Frame title="ci/cd · main" dots={false}>
      {[
        ["Build", true],
        ["Test", true],
        ["Scan", true],
        ["Stage", true],
        ["Deploy", false],
      ].map(([l, ok], i) => (
        <g key={l as string}>
          <circle cx={36 + i * 52} cy="80" r="12" fill={ok ? "rgba(124,224,163,0.2)" : "rgba(50,95,236,0.35)"} stroke={ok ? "#7CE0A3" : C.key} />
          <text x={36 + i * 52} y="84" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill="#fff">
            {ok ? "✓" : "▸"}
          </text>
          <text x={36 + i * 52} y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={C.text}>
            {l as string}
          </text>
          {i < 4 && <line x1={48 + i * 52} y1="80" x2={76 + i * 52} y2="80" stroke="rgba(107,146,255,0.5)" />}
        </g>
      ))}
      <text x="18" y="150" fontFamily="sans-serif" fontSize="9" fill="#fff">
        Release #214 · 6 min · no manual steps
      </text>
      <text x="18" y="172" fontFamily="monospace" fontSize="8" fill="#7eaaff">
        ► Rollback in one click if anything fails
      </text>
    </Frame>
  ),

  // Web Development: component code
  "web-app-development": () => (
    <Code
      title="app/page.tsx"
      lines={[
        [["export default ", C.key], ["function "], ["Home", C.fn], ["() {"]],
        [["  return ", C.key], ["("]],
        [["    <Hero "], ["title", C.str], ["={...} />"]],
        [["    <Services "], ["schema", C.str], [" />"]],
        [["    <BookCall />"]],
        [["  );"]],
      ]}
      footer="Lighthouse 98 · LCP 1.1s · indexed"
      progress={0.98}
    />
  ),

  // App Development: phone screen
  "app-development": () => (
    <Frame title="app · ios + android" dots={false}>
      <rect x="104" y="34" width="72" height="150" rx="12" fill="#050A18" stroke="rgba(107,146,255,0.5)" />
      <rect x="128" y="40" width="24" height="4" rx="2" fill="rgba(107,146,255,0.4)" />
      <rect x="112" y="54" width="56" height="30" rx="5" fill="rgba(50,95,236,0.45)" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="112" y={92 + i * 22} width="56" height="16" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x="116" y={97 + i * 22} width={20 + i * 8} height="5" rx="2" fill="rgba(168,197,255,0.5)" />
        </g>
      ))}
      <rect x="112" y="160" width="56" height="14" rx="7" fill={C.blue} />
      <Big value="4.8★" label="store rating" x={196} y={92} />
      <Big value="v2.3" label="shipped this week" x={18} y={92} />
    </Frame>
  ),

  // SEO and GEO: search results plus AI answer
  "seo-geo": () => (
    <Frame title="search · google + ai answers" dots={false}>
      <rect x="18" y="38" width="244" height="18" rx="9" fill="rgba(255,255,255,0.06)" stroke="rgba(107,146,255,0.3)" />
      <text x="30" y="50" fontFamily="sans-serif" fontSize="8" fill={C.text}>
        best ai consultancy london
      </text>
      <rect x="18" y="64" width="244" height="42" rx="6" fill="rgba(50,95,236,0.18)" stroke={C.key} />
      <text x="26" y="77" fontFamily="sans-serif" fontSize="7.5" fill="#7eaaff">
        AI OVERVIEW
      </text>
      <text x="26" y="92" fontFamily="sans-serif" fontSize="8.5" fill="#fff">
        …such as 22 Signals, which builds and runs…
      </text>
      {[1, 2, 3].map((n) => (
        <g key={n}>
          <text x="18" y={124 + (n - 1) * 20} fontFamily="sans-serif" fontSize="9" fill={n === 1 ? "#A8C5FF" : C.label}>
            {n}. {n === 1 ? "22signals.com · AI consulting" : "competitor.com"}
          </text>
        </g>
      ))}
    </Frame>
  ),

  // Paid Media: campaign metrics
  "paid-media": () => (
    <Frame title="campaigns · last 30 days" dots={false}>
      <Big value="£38" label="cost per qualified lead, down from £61" />
      <path d="M18 160 Q 60 150, 90 140 T 150 120 T 210 104 T 262 88" stroke={C.key} strokeWidth="2" fill="none" />
      <path d="M18 160 Q 60 150, 90 140 T 150 120 T 210 104 T 262 88 L 262 176 L 18 176 Z" fill="rgba(50,95,236,0.2)" />
      {[
        ["Google", "212"],
        ["Meta", "164"],
      ].map(([l, v], i) => (
        <g key={l}>
          <text x={190} y={52 + i * 16} fontFamily="sans-serif" fontSize="8" fill={C.label}>
            {l}
          </text>
          <text x={262} y={52 + i * 16} textAnchor="end" fontFamily="sans-serif" fontSize="9" fill="#fff">
            {v} leads
          </text>
        </g>
      ))}
    </Frame>
  ),

  // Video and Motion Graphics: edit timeline
  "video-motion": () => (
    <Frame title="edit · brand-film_v3" dots={false}>
      <rect x="18" y="36" width="244" height="78" rx="6" fill="rgba(50,95,236,0.18)" stroke="rgba(107,146,255,0.3)" />
      <polygon points="132,62 132,90 154,76" fill="#fff" opacity="0.85" />
      {[
        ["V2", [[30, 60], [120, 50], [200, 50]]],
        ["V1", [[30, 100], [140, 90], [240, 22]]],
        ["A1", [[30, 232]]],
      ].map(([l, clips], r) => (
        <g key={l as string}>
          <text x="18" y={133 + r * 16} fontFamily="monospace" fontSize="7.5" fill={C.dim}>
            {l as string}
          </text>
          {(clips as number[][]).map(([x, w], i) => (
            <rect key={i} x={x} y={125 + r * 16} width={w - 4} height="10" rx="2" fill={r === 2 ? "rgba(124,224,163,0.35)" : i % 2 ? C.blue : "rgba(107,146,255,0.5)"} />
          ))}
        </g>
      ))}
      <line x1="150" y1="120" x2="150" y2="176" stroke="#FFB48C" strokeWidth="1.5" />
    </Frame>
  ),

  // AI Video Production: generated frames, labeled
  "ai-video-production": () => (
    <Frame title="ai video · variations" dots={false}>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={18 + i * 84} y="42" width="76" height="96" rx="6" fill={`rgba(50,95,236,${0.15 + i * 0.1})`} stroke="rgba(107,146,255,0.35)" />
          <circle cx={56 + i * 84} cy="78" r="14" fill="rgba(168,197,255,0.35)" />
          <rect x={36 + i * 84} y="98" width="40" height="22" rx="10" fill="rgba(168,197,255,0.25)" />
          <rect x={24 + i * 84} y="48" width="26" height="11" rx="3" fill="rgba(5,10,24,0.8)" />
          <text x={37 + i * 84} y="56" textAnchor="middle" fontFamily="sans-serif" fontSize="6.5" fill="#A8C5FF">
            AI
          </text>
        </g>
      ))}
      <text x="18" y="160" fontFamily="sans-serif" fontSize="9" fill="#fff">
        3 ad variations · labeled · reviewed by a person
      </text>
      <text x="18" y="178" fontFamily="monospace" fontSize="8" fill="#7eaaff">
        ► Likeness used with written permission only
      </text>
    </Frame>
  ),

  // 2D and 3D Animation: keyframes
  "3d-animation": () => (
    <Frame title="animation · explainer" dots={false}>
      <path d="M30 120 C 80 40, 140 160, 200 70 S 250 90, 262 60" stroke={C.key} strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
      {[
        [30, 120],
        [96, 92],
        [160, 108],
        [214, 72],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 9} y={y - 9} width="18" height="18" rx="3" transform={`rotate(${i * 25} ${x} ${y})`} fill={i === 3 ? C.blue : "rgba(107,146,255,0.35)"} stroke="#A8C5FF" strokeWidth="0.8" />
        </g>
      ))}
      <line x1="18" y1="160" x2="262" y2="160" stroke="rgba(107,146,255,0.35)" />
      {[30, 96, 160, 214].map((x) => (
        <polygon key={x} points={`${x},154 ${x + 5},160 ${x},166 ${x - 5},160`} fill="#A8C5FF" />
      ))}
      <text x="18" y="184" fontFamily="monospace" fontSize="8" fill="#7eaaff">
        ► 00:42 / 01:30 · 24 fps
      </text>
    </Frame>
  ),

  // 3D Rendering: wireframe product with light
  "3d-rendering": () => (
    <Frame title="render · product_hero.exr" dots={false}>
      <circle cx="210" cy="56" r="10" fill="#FFB48C" opacity="0.6" />
      <g stroke="#A8C5FF" strokeWidth="1" fill="none">
        <polygon points="110,70 160,50 210,70 160,90" fill="rgba(50,95,236,0.35)" />
        <polygon points="110,70 110,140 160,160 160,90" fill="rgba(50,95,236,0.2)" />
        <polygon points="160,90 160,160 210,140 210,70" fill="rgba(50,95,236,0.5)" />
      </g>
      <ellipse cx="160" cy="166" rx="62" ry="8" fill="rgba(0,0,0,0.5)" />
      <Big value="4K" label="photoreal · 3 angles" x={18} y={70} />
      <text x="18" y="184" fontFamily="monospace" fontSize="8" fill="#7eaaff">
        ► Sample 2048/2048 · denoised
      </text>
    </Frame>
  ),

  // More We Do: managed teams, events, games, sourcing
  more: () => (
    <Frame title="more we do" dots={false}>
      {[
        ["Managed teams", "◎"],
        ["Live events", "▶"],
        ["Game development", "◆"],
        ["Product sourcing", "▣"],
      ].map(([l, ic], i) => (
        <g key={l}>
          <rect x={18 + (i % 2) * 126} y={40 + Math.floor(i / 2) * 64} width="118" height="54" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(107,146,255,0.3)" />
          <text x={32 + (i % 2) * 126} y={64 + Math.floor(i / 2) * 64} fontFamily="sans-serif" fontSize="14" fill={C.key}>
            {ic}
          </text>
          <text x={32 + (i % 2) * 126} y={82 + Math.floor(i / 2) * 64} fontFamily="sans-serif" fontSize="8.5" fill="#fff">
            {l}
          </text>
        </g>
      ))}
      <text x="18" y="184" fontFamily="monospace" fontSize="8" fill="#7eaaff">
        ► One lead runs all of it
      </text>
    </Frame>
  ),
};

/** Visual for a service slug (e.g. "power-bi-consulting"), or null if none. */
export function visualForService(slug: string): React.ReactElement | null {
  const v = VISUALS[slug];
  return v ? v() : null;
}
