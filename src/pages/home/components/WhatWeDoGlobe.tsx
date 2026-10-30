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
  // Phone deck: the card nearest the centre of the scroller is the active area.
  const deckRef = useRef<HTMLDivElement>(null);
  const [mActive, setMActive] = useState(0);
  const onDeckScroll = () => {
    const el = deckRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const w = card ? card.offsetWidth + 12 : el.clientWidth;
    const i = Math.max(0, Math.min(UMBRELLAS.length - 1, Math.round(el.scrollLeft / w)));
    setMActive((p) => (p === i ? p : i));
  };
  const goTo = (i: number) => {
    const el = deckRef.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  };

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

      {/* Phone: a swipeable deck of the seven areas. The light in the globe
          moves to the card you are on. */}
      <div className="wwd-box md:hidden" style={{ padding: "24px 0 20px" }}>
        <div className="relative mx-auto" style={{ width: "72%", aspectRatio: "2 / 1", overflow: "hidden" }}>
          <div className="wwd-ball" style={{ left: 0, top: 0, width: "100%", aspectRatio: "1 / 1" }} />
          <div className="absolute inset-0" style={{ borderRadius: "999px 999px 0 0", overflow: "hidden" }}>
            <div
              className="wwd-orb"
              style={{
                width: "62%",
                height: "124%",
                left: `${19 + Math.cos(Math.PI - (mActive * Math.PI) / 6) * 26}%`,
                top: `${8 + (1 - Math.sin((mActive * Math.PI) / 6)) * 22}%`,
                transition: "left .45s ease, top .45s ease",
              }}
            />
          </div>
          <svg aria-hidden="true" viewBox="0 0 360 180" className="absolute inset-0 w-full h-full">
            <g fill="none" stroke="rgba(220,230,255,0.4)" strokeWidth="1">
              <ellipse cx="180" cy="180" rx="40" ry="178" />
              <ellipse cx="180" cy="180" rx="105" ry="178" />
              <ellipse cx="180" cy="120" rx="150" ry="22" />
              <ellipse cx="180" cy="70" rx="104" ry="14" />
            </g>
            <path d="M 2 180 A 178 178 0 0 1 358 180" fill="none" stroke="rgba(220,230,255,0.8)" strokeWidth="1.2" />
          </svg>
        </div>

        <div ref={deckRef} onScroll={onDeckScroll} className="wwd-deck mt-5" aria-label="Service areas, swipe to see more">
          {UMBRELLAS.map((u, i) => (
            <Link
              key={u.slug}
              to={`/services?area=${u.slug}`}
              className={`wwd-card ${i === mActive ? "is-on" : ""}`}
              style={{ textDecoration: "none" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[0.3em]" style={{ color: "#93b8ff" }}>
                  {String(i + 1).padStart(2, "0")} / 07
                </span>
                <span aria-hidden className="wwd-card-arrow">↗</span>
              </div>
              <div className="mt-3 text-white" style={{ fontSize: 22, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
                {u.name}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {u.items.map((it) => (
                  <span key={it.label} className="wwd-chip" style={{ fontSize: 12, padding: "6px 10px", animation: "none" }}>
                    {it.label}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center gap-1.5 mt-4" role="tablist" aria-label="Choose a service area">
          {UMBRELLAS.map((u, i) => (
            <button
              key={u.slug}
              type="button"
              role="tab"
              aria-selected={i === mActive}
              aria-label={u.name}
              onClick={() => goTo(i)}
              className="wwd-dot-btn"
            >
              <span className={`wwd-dot ${i === mActive ? "is-on" : ""}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatWeDoGlobe;
