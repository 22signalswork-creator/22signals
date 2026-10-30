/**
 * "What we do" globe. A still wireframe globe inside a dark card; a soft light
 * inside it follows the pointer, and the service area nearest the light is
 * highlighted, with its services shown as links inside the globe.
 *
 * Performance: the orb moves through a ref (transform only, one rAF per
 * frame, nothing re-renders); React state changes only when the highlighted
 * area changes. Everything is plain DOM + one static SVG, no canvas or WebGL.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { UMBRELLAS, NEW_SERVICES } from "@/content/umbrellas";

// Layout is designed on a 1344 x 860 frame and placed in percentages.
const W = 1344;
const H = 640;
const CX = 672;
const CY = 500;
const R_GLOBE = 300;
const R_LABEL = 450;
const ORB = 340;
const ORB_MAX = 210; // how far the orb centre may travel from the globe centre

const LABELS = UMBRELLAS.map((u, i) => {
  const a = Math.PI - (i * Math.PI) / 6;
  return { x: CX + R_LABEL * Math.cos(a), y: CY - R_LABEL * Math.sin(a) * 0.86 };
});

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

const START = 4; // Growth Marketing

const GlobeLines: React.FC = () => (
  <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
    <defs>
      <clipPath id="wwd-ball">
        <circle cx={CX} cy={CY} r={R_GLOBE} />
      </clipPath>
    </defs>
    <g clipPath="url(#wwd-ball)" fill="none" stroke="rgba(220,230,255,0.42)" strokeWidth="1">
      <ellipse cx={CX} cy={CY - 200} rx={168} ry={30} />
      <ellipse cx={CX} cy={CY - 140} rx={226} ry={40} />
      <ellipse cx={CX} cy={CY - 70} rx={272} ry={50} />
      <ellipse cx={CX} cy={CY + 10} rx={298} ry={56} />
      <ellipse cx={CX} cy={CY} rx={60} ry={R_GLOBE} />
      <ellipse cx={CX} cy={CY} rx={150} ry={R_GLOBE} />
      <ellipse cx={CX} cy={CY} rx={235} ry={R_GLOBE} />
    </g>
    <circle cx={CX} cy={CY} r={R_GLOBE} fill="none" stroke="rgba(220,230,255,0.8)" strokeWidth="1.2" />
  </svg>
);

// Service names inside the globe are labels only, not links.
const Chips: React.FC<{ index: number }> = ({ index }) => (
  <>
    {UMBRELLAS[index].items.map((s) => (
      <span key={s.label} className="wwd-chip">
        {s.label}
        {NEW_SERVICES.has(s.path) && <span className="wwd-new">NEW</span>}
      </span>
    ))}
  </>
);

const WhatWeDoGlobe: React.FC = () => {
  const [active, setActive] = useState(START);
  const activeRef = useRef(START);
  const boxRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: LABELS[START].x, y: LABELS[START].y });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  // Clamp a point to the orb's travel circle (frame coords).
  const clamp = (x: number, y: number) => {
    const dx = x - CX, dy = y - CY, d = Math.hypot(dx, dy);
    if (d <= ORB_MAX) return { x, y };
    return { x: CX + (dx / d) * ORB_MAX, y: CY + (dy / d) * ORB_MAX };
  };

  const pick = useCallback((i: number) => {
    if (activeRef.current !== i) {
      activeRef.current = i;
      setActive(i);
    }
  }, []);

  const step = useCallback(() => {
    const p = pos.current, t = clamp(target.current.x, target.current.y);
    p.x += (t.x - p.x) * 0.16;
    p.y += (t.y - p.y) * 0.16;
    if (orbRef.current) {
      const gx = p.x - (CX - R_GLOBE) - ORB / 2, gy = p.y - (CY - R_GLOBE) - ORB / 2;
      orbRef.current.style.transform = `translate3d(${(gx / ORB) * 100}%, ${(gy / ORB) * 100}%, 0)`;
    }
    if (Math.abs(t.x - p.x) > 0.3 || Math.abs(t.y - p.y) > 0.3) raf.current = requestAnimationFrame(step);
    else raf.current = 0;
  }, []);

  const kick = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(step);
  }, [step]);

  useEffect(() => {
    const s = clamp(LABELS[START].x, LABELS[START].y);
    pos.current = { ...s };
    kick();
    return () => cancelAnimationFrame(raf.current);
  }, [kick]);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const r = boxRef.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const y = ((e.clientY - r.top) / r.height) * H;
    target.current = { x, y };
    kick();
    // nearest area to where the light is heading
    const o = clamp(x, y);
    let best = 0, bd = Infinity;
    LABELS.forEach((q, i) => {
      const d = (q.x - o.x) ** 2 + (q.y - o.y) ** 2;
      if (d < bd) { bd = d; best = i; }
    });
    pick(best);
  };

  const focusArea = (i: number) => {
    target.current = { ...LABELS[i] };
    kick();
    pick(i);
  };

  return (
    <div className="wwd">
      {/* Desktop and tablet */}
      <div
        ref={boxRef}
        className="wwd-box hidden md:block mx-auto"
        onPointerMove={onMove}
        style={{ aspectRatio: `${W} / ${H}`, maxWidth: `calc(62vh * ${W / H})` }}
      >
        <div
          className="wwd-ball"
          style={{ left: pct(CX - R_GLOBE, W), top: pct(CY - R_GLOBE, H), width: pct(R_GLOBE * 2, W), height: pct(R_GLOBE * 2, H) }}
        />
        {/* the light: positioned in frame space, moved by transform only */}
        <div
          className="absolute pointer-events-none"
          style={{ left: pct(CX - R_GLOBE, W), top: pct(CY - R_GLOBE, H), width: pct(R_GLOBE * 2, W), height: pct(R_GLOBE * 2, H), borderRadius: "50%", overflow: "hidden" }}
        >
          <div
            style={{ position: "absolute", left: 0, top: 0, width: `${(ORB / (R_GLOBE * 2)) * 100}%`, height: `${(ORB / (R_GLOBE * 2)) * 100}%` }}
          >
            <div ref={orbRef} className="wwd-orb" style={{ left: 0, top: 0, width: "100%", height: "100%" }} />
          </div>
        </div>
        <GlobeLines />

        {UMBRELLAS.map((u, i) => (
          <Link
            key={u.slug}
            to={`/services?area=${u.slug}`}
            className={`wwd-label ${i === active ? "is-on" : ""}`}
            style={{ left: pct(LABELS[i].x, W), top: pct(LABELS[i].y, H) }}
            onMouseEnter={() => focusArea(i)}
            onFocus={() => focusArea(i)}
          >
            {u.short}
          </Link>
        ))}

        <div className="wwd-chips" style={{ left: pct(CX - 260, W), width: pct(520, W), top: pct(CY - 90, H) }} aria-live="polite">
          <Chips index={active} />
        </div>
      </div>

      {/* Phone: NoGood-style pinned globe, driven by scroll or tap */}
      <MobileWhatWeDo />
    </div>
  );
};

/* ── Phone version ─────────────────────────────────────────────────────
 * The section pins while you scroll through it. A half-globe sits on the
 * right edge with the seven areas on a dotted arc beside it. Scrolling moves
 * through the areas; tapping a name jumps to it. The light in the globe
 * turns towards the active name, and its services show underneath.
 */
const VW = 360, VH = 400, GX = 392, GY = 196, GR = 168, AR = 228;
const ANG = UMBRELLAS.map((_, i) => ((126 + (i * 108) / 6) * Math.PI) / 180);
const MPOS = ANG.map((a) => ({ x: GX + AR * Math.cos(a), y: GY + AR * Math.sin(a) }));

const MobileWhatWeDo: React.FC = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = outerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(0.9999, Math.max(0, -r.top / span)) : 0;
      const next = Math.floor(p * UMBRELLAS.length);
      setI((cur) => (cur === next ? cur : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const jump = (k: number) => {
    const el = outerRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((k + 0.5) / UMBRELLAS.length) * span, behavior: "smooth" });
  };

  const a = ANG[i];
  const orb = { x: GX + 105 * Math.cos(a), y: GY + 105 * Math.sin(a) };
  const u = UMBRELLAS[i];

  return (
    <div ref={outerRef} className="md:hidden relative" style={{ height: `calc(100svh + ${UMBRELLAS.length * 34}svh)` }}>
      <div className="wwd-box" style={{ position: "sticky", top: 84, height: "calc(100svh - 100px)", minHeight: 560 }}>
        <div className="relative w-full" style={{ aspectRatio: `${VW} / ${VH}` }}>
          <svg viewBox={`0 0 ${VW} ${VH}`} className="absolute inset-0 w-full h-full" aria-hidden="true">
            <defs>
              <clipPath id="mwwd-clip">
                <circle cx={GX} cy={GY} r={GR} />
              </clipPath>
              <radialGradient id="mwwd-orb">
                <stop offset="0" stopColor="#dfe8ff" stopOpacity="1" />
                <stop offset="0.25" stopColor="#7ea2ff" stopOpacity="0.9" />
                <stop offset="0.6" stopColor="#325FEC" stopOpacity="0.35" />
                <stop offset="1" stopColor="#325FEC" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx={GX} cy={GY} r={GR} fill="#0a1640" />
            <g clipPath="url(#mwwd-clip)">
              <circle cx={orb.x} cy={orb.y} r="120" fill="url(#mwwd-orb)" style={{ transition: "cx .5s ease, cy .5s ease" }} />
              <g fill="none" stroke="rgba(220,230,255,0.38)" strokeWidth="1">
                {[40, 90, 135].map((rx) => (
                  <ellipse key={rx} cx={GX} cy={GY} rx={rx} ry={GR} />
                ))}
                {[-110, -55, 0, 55, 110].map((dy) => (
                  <ellipse key={dy} cx={GX} cy={GY + dy} rx={Math.sqrt(GR * GR - dy * dy)} ry={18} />
                ))}
              </g>
            </g>
            <circle cx={GX} cy={GY} r={GR} fill="none" stroke="rgba(220,230,255,0.8)" strokeWidth="1.2" />
            <circle cx={GX} cy={GY} r={AR} fill="none" stroke="rgba(147,184,255,0.35)" strokeWidth="1" strokeDasharray="2 6" />
            {MPOS.map((q, k) => (
              <circle key={k} cx={q.x} cy={q.y} r={k === i ? 4 : 2.5} fill={k === i ? "#ffffff" : "rgba(147,184,255,0.6)"} />
            ))}
          </svg>
          {UMBRELLAS.map((m, k) => (
            <button
              key={m.slug}
              type="button"
              onClick={() => jump(k)}
              aria-pressed={k === i}
              className={`mwwd-label ${k === i ? "is-on" : ""}`}
              style={{ left: `${(MPOS[k].x / VW) * 100}%`, top: `${(MPOS[k].y / VH) * 100}%` }}
            >
              {m.short}
            </button>
          ))}
        </div>

        <div className="px-5 pt-2 pb-5">
          <div className="text-[11px] tracking-[0.3em]" style={{ color: "#93b8ff" }}>
            {String(i + 1).padStart(2, "0")} / 07
          </div>
          <div key={u.slug} className="wwd-fade mt-2 text-white" style={{ fontSize: 24, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            {u.name}
          </div>
          <div key={`c-${u.slug}`} className="mt-3 flex flex-wrap gap-1.5">
            {u.items.map((it) => (
              <span key={it.label} className="wwd-chip" style={{ fontSize: 12, padding: "6px 10px" }}>
                {it.label}
              </span>
            ))}
          </div>
          <Link to={`/services?area=${u.slug}`} className="inline-flex items-center gap-2 mt-4 text-[12px] tracking-[0.2em] uppercase" style={{ color: "#93b8ff", textDecoration: "none" }}>
            Explore {u.short} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDoGlobe;
