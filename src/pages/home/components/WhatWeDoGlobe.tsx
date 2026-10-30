/**
 * "What we do" globe. A dark wireframe globe sitting on the page (no card);
 * a soft light inside it follows the pointer, and the service area nearest
 * the light is highlighted, with three of its services shown in the globe.
 *
 * Performance: the orb moves through a ref (transform only, one rAF per
 * frame, nothing re-renders); React state changes only when the highlighted
 * area changes. Everything is plain DOM + one static SVG, no canvas or WebGL.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { UMBRELLAS, globeItems } from "@/content/umbrellas";

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

// Service names inside the globe are labels only on desktop.
const Chips: React.FC<{ index: number }> = ({ index }) => (
  <>
    {globeItems(UMBRELLAS[index]).map((s) => (
      <span key={s.label} className="wwd-chip">
        {s.label}
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

  // When nobody is pointing at it, the light drifts from area to area on its
  // own, so the globe never sits still on screen.
  const lastMove = useRef(0);
  useEffect(() => {
    const box = boxRef.current;
    if (!box || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let seen = false;
    const io = new IntersectionObserver((es) => { seen = !!es[0]?.isIntersecting; }, { threshold: 0.35 });
    io.observe(box);
    const iv = window.setInterval(() => {
      if (!seen || box.offsetParent === null || Date.now() - lastMove.current < 4000) return;
      const next = (activeRef.current + 1) % UMBRELLAS.length;
      target.current = { ...LABELS[next] };
      kick();
      pick(next);
    }, 2600);
    return () => {
      io.disconnect();
      window.clearInterval(iv);
    };
  }, [kick, pick]);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    lastMove.current = Date.now();
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
        className="wwd-stage hidden md:block mx-auto"
        onPointerMove={onMove}
        style={{ aspectRatio: `${W} / ${H}`, maxWidth: `min(1400px, calc(76vh * ${W / H}))` }}
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

      {/* Phone: globe with tap and hold controls, never holds the scroll */}
      <MobileWhatWeDo />
    </div>
  );
};

/* ── Phone version ─────────────────────────────────────────────────────
 * Sits on the page like any other section and never holds the scroll.
 * A half-globe on the right edge has the seven areas on a dotted arc beside
 * it. Tap a name, use the arrows (press and hold to cycle), or press and
 * hold anywhere on the globe and drag to steer the light, like the pointer
 * does on desktop. The three services underneath link to their pages.
 */
const VW = 360, VH = 330, GX = 374, GY = 165, GR = 150, AR = 196;
const A0 = 128, A1 = 232;
const ANG_DEG = UMBRELLAS.map((_, i) => A0 + (i * (A1 - A0)) / (UMBRELLAS.length - 1));
const ANG = ANG_DEG.map((d) => (d * Math.PI) / 180);
const MPOS = ANG.map((a) => ({ x: GX + AR * Math.cos(a), y: GY + AR * Math.sin(a) }));
const N = UMBRELLAS.length;
const ORB_R = 100;

const HoldArrow: React.FC<{ dir: 1 | -1; onStep: (d: number) => void }> = ({ dir, onStep }) => {
  const timers = useRef<{ t?: number; iv?: number }>({});
  const stop = () => {
    window.clearTimeout(timers.current.t);
    window.clearInterval(timers.current.iv);
    timers.current = {};
  };
  useEffect(() => stop, []);
  const start = (e: React.PointerEvent) => {
    e.preventDefault();
    stop();
    onStep(dir);
    timers.current.t = window.setTimeout(() => {
      timers.current.iv = window.setInterval(() => onStep(dir), 520);
    }, 420);
  };
  return (
    <button
      type="button"
      aria-label={dir > 0 ? "Next area" : "Previous area"}
      className="mwwd-arrow"
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onStep(dir);
        }
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d={dir > 0 ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

const MobileWhatWeDo: React.FC = () => {
  const [i, setI] = useState(0);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hold = useRef<{ t?: number; on: boolean; sx: number; sy: number }>({ on: false, sx: 0, sy: 0 });
  const step = (d: number) => setI((c) => (c + d + N) % N);

  // Finger position -> light position and nearest area.
  const steer = (cx: number, cy: number) => {
    const r = stageRef.current!.getBoundingClientRect();
    const x = ((cx - r.left) / r.width) * VW;
    const y = ((cy - r.top) / r.height) * VH;
    let deg = (Math.atan2(y - GY, x - GX) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    deg = Math.max(A0, Math.min(A1, deg));
    const dist = Math.max(30, Math.min(120, Math.hypot(x - GX, y - GY) - 50));
    const rad = (deg * Math.PI) / 180;
    setDrag({ x: GX + dist * Math.cos(rad), y: GY + dist * Math.sin(rad) });
    const k = Math.round(((deg - A0) / (A1 - A0)) * (N - 1));
    setI((c) => (c === k ? c : k));
  };

  // Press and hold (about a quarter second) to steer; a quick swipe still scrolls the page.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const h = hold.current;
    const end = () => {
      window.clearTimeout(h.t);
      if (h.on) {
        h.on = false;
        setDrag(null);
      }
    };
    const start = (e: TouchEvent) => {
      const t = e.touches[0];
      h.sx = t.clientX;
      h.sy = t.clientY;
      window.clearTimeout(h.t);
      h.t = window.setTimeout(() => {
        h.on = true;
        steer(h.sx, h.sy);
      }, 240);
    };
    const move = (e: TouchEvent) => {
      const t = e.touches[0];
      if (h.on) {
        e.preventDefault();
        steer(t.clientX, t.clientY);
      } else if (Math.hypot(t.clientX - h.sx, t.clientY - h.sy) > 8) {
        window.clearTimeout(h.t);
      }
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: false });
    el.addEventListener("touchend", end);
    el.addEventListener("touchcancel", end);
    return () => {
      end();
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end);
      el.removeEventListener("touchcancel", end);
    };
  }, []);

  // Mouse (small desktop windows): drag with the button held.
  const mouseDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hold.current.on = true;
    steer(e.clientX, e.clientY);
  };
  const mouseMove = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && hold.current.on) steer(e.clientX, e.clientY);
  };
  const mouseUp = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && hold.current.on) {
      hold.current.on = false;
      setDrag(null);
    }
  };

  const a = ANG[i];
  const orb = drag ?? { x: GX + 92 * Math.cos(a), y: GY + 92 * Math.sin(a) };
  const u = UMBRELLAS[i];

  return (
    <div className="md:hidden mwwd">
      <div
        ref={stageRef}
        className={`mwwd-stage relative w-full ${drag ? "is-dragging" : ""}`}
        style={{ aspectRatio: `${VW} / ${VH}` }}
        onPointerDown={mouseDown}
        onPointerMove={mouseMove}
        onPointerUp={mouseUp}
        onPointerLeave={mouseUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        <svg viewBox={`0 0 ${VW} ${VH}`} className="absolute inset-0 w-full h-full" aria-hidden="true">
          <defs>
            <clipPath id="mwwd-clip">
              <circle cx={GX} cy={GY} r={GR} />
            </clipPath>
            <radialGradient id="mwwd-orb">
              <stop offset="0" stopColor="#e6edff" stopOpacity="1" />
              <stop offset="0.22" stopColor="#7ea2ff" stopOpacity="0.95" />
              <stop offset="0.6" stopColor="#325FEC" stopOpacity="0.4" />
              <stop offset="1" stopColor="#325FEC" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="mwwd-ball" cx="0.3" cy="0.6" r="0.9">
              <stop offset="0" stopColor="#10215e" />
              <stop offset="1" stopColor="#050a18" />
            </radialGradient>
          </defs>
          <circle cx={GX} cy={GY} r={GR} fill="url(#mwwd-ball)" />
          <g clipPath="url(#mwwd-clip)">
            <circle
              cx={orb.x}
              cy={orb.y}
              r={ORB_R}
              fill="url(#mwwd-orb)"
              style={{ transition: drag ? "none" : "cx .5s ease, cy .5s ease" }}
            />
            <g fill="none" stroke="rgba(220,230,255,0.36)" strokeWidth="1">
              {[36, 80, 120].map((rx) => (
                <ellipse key={rx} cx={GX} cy={GY} rx={rx} ry={GR} />
              ))}
              {[-100, -50, 0, 50, 100].map((dy) => (
                <ellipse key={dy} cx={GX} cy={GY + dy} rx={Math.sqrt(GR * GR - dy * dy)} ry={16} />
              ))}
            </g>
          </g>
          <circle cx={GX} cy={GY} r={GR} fill="none" stroke="rgba(50,95,236,0.55)" strokeWidth="1.2" />
          <circle cx={GX} cy={GY} r={AR} fill="none" stroke="rgba(50,95,236,0.4)" strokeWidth="1" strokeDasharray="2 6" />
          {MPOS.map((q, k) => (
            <circle key={k} cx={q.x} cy={q.y} r={k === i ? 4.5 : 2.5} fill={k === i ? "#325FEC" : "rgba(50,95,236,0.45)"} />
          ))}
        </svg>
        {UMBRELLAS.map((m, k) => (
          <button
            key={m.slug}
            type="button"
            onClick={() => setI(k)}
            aria-pressed={k === i}
            className={`mwwd-label ${k === i ? "is-on" : ""}`}
            style={{ left: `${(MPOS[k].x / VW) * 100}%`, top: `${(MPOS[k].y / VH) * 100}%` }}
          >
            {m.short}
          </button>
        ))}
        <div className="mwwd-hint">Tap an area, or hold the globe and drag.</div>
      </div>

      <div className="px-5 pt-1">
        <div className="flex items-center gap-3">
          <HoldArrow dir={-1} onStep={step} />
          <div className="flex-1 flex gap-1.5" role="tablist" aria-label="Areas">
            {UMBRELLAS.map((m, k) => (
              <button
                key={m.slug}
                type="button"
                role="tab"
                aria-selected={k === i}
                aria-label={m.name}
                onClick={() => setI(k)}
                className="mwwd-seg"
              >
                <span style={{ background: k === i ? "#325FEC" : k < i ? "rgba(50,95,236,0.45)" : "rgba(10,21,48,0.12)" }} />
              </button>
            ))}
          </div>
          <HoldArrow dir={1} onStep={step} />
        </div>

        <div className="mt-3 text-[11px] tracking-[0.3em]" style={{ color: "#325FEC" }}>
          {String(i + 1).padStart(2, "0")} / 0{N}
        </div>
        <div key={u.slug} className="wwd-fade mt-1.5" style={{ fontSize: 23, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#0a1530" }}>
          {u.name}
        </div>
        <div key={`c-${u.slug}`} className="mt-2.5 flex flex-wrap gap-1.5">
          {globeItems(u).map((it) => (
            <Link key={it.label} to={it.path} className="mwwd-chip">
              {it.label} <span aria-hidden>↗</span>
            </Link>
          ))}
        </div>
        <Link to={`/services?area=${u.slug}`} className="inline-flex items-center gap-2 mt-2.5 text-[12px] tracking-[0.2em] uppercase" style={{ color: "#325FEC", textDecoration: "none" }}>
          Explore {u.short} <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
};

export default WhatWeDoGlobe;
