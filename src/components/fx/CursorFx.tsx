/**
 * Desktop-only pointer effects for the homepage:
 *  - a soft ring that trails the pointer and swells over links and buttons
 *  - magnetic pull on elements marked data-magnetic
 * Off for touch screens and for people who prefer reduced motion. The real
 * cursor stays visible; this only adds to it.
 */
import React, { useEffect, useRef } from "react";

const CursorFx: React.FC = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (min-width: 768px)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ring = ringRef.current;
    if (!fine || calm || !ring) return;

    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    let mag: HTMLElement | null = null;

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.2 ? requestAnimationFrame(tick) : 0;
    };

    const release = () => {
      if (mag) {
        mag.style.transform = "";
        mag = null;
      }
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.classList.add("is-on");
      if (!raf) raf = requestAnimationFrame(tick);

      const t = e.target as HTMLElement | null;
      const hot = t?.closest?.("a, button, [role=button], [data-cursor]");
      const quiet = t?.closest?.(".wwd-stage");
      ring.classList.toggle("is-hot", !!hot && !quiet);
      ring.classList.toggle("is-quiet", !!quiet);
      const card = t?.closest?.(".dc, .fx-gallery-item");
      const reel = t?.closest?.("video");
      const lab = card ? "View" : reel ? "Reel" : "";
      ring.classList.toggle("is-label", !!lab);
      if (labelRef.current && lab) labelRef.current.textContent = lab;

      const m = t?.closest?.("[data-magnetic]") as HTMLElement | null;
      if (m !== mag) release();
      if (m) {
        mag = m;
        const r = m.getBoundingClientRect();
        const dx = (x - (r.left + r.width / 2)) * 0.22;
        const dy = (y - (r.top + r.height / 2)) * 0.3;
        m.style.transition = "transform .25s cubic-bezier(.22,1,.36,1)";
        m.style.transform = `translate(${Math.max(-12, Math.min(12, dx))}px, ${Math.max(-8, Math.min(8, dy))}px)`;
      }
    };
    const leave = () => {
      ring.classList.remove("is-on");
      release();
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    return () => {
      cancelAnimationFrame(raf);
      release();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden className="fx-ring"><span ref={labelRef} className="fx-ring-label" /></div>
      <div ref={dotRef} aria-hidden className="fx-dot hidden md:block" />
    </>
  );
};

export default CursorFx;
