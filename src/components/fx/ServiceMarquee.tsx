/**
 * Two lines of large service names that slide in opposite directions as
 * you scroll past (driven by scroll position, not a timer, so it only moves
 * when you do).
 */
import React, { useEffect, useRef } from "react";
import { UMBRELLAS } from "@/content/umbrellas";

const NAMES = UMBRELLAS.map((u) => u.name);

const Row: React.FC<{ outline?: boolean }> = ({ outline }) => (
  <div className={`smq-row ${outline ? "is-outline" : ""}`}>
    {[0, 1, 2].map((k) => (
      <React.Fragment key={k}>
        {NAMES.map((n) => (
          <span key={n + k} className="smq-item">
            {n}
            <span className="smq-star" aria-hidden>✳</span>
          </span>
        ))}
      </React.Fragment>
    ))}
  </div>
);

const ServiceMarquee: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current, a = aRef.current, b = bRef.current;
    if (!box || !a || !b) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = box.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -200 || r.top > vh + 200) return;
      const p = (vh - r.top) / (vh + r.height); // 0 → 1 while it crosses the screen
      a.style.transform = `translate3d(${-8 - p * 22}%, 0, 0)`;
      b.style.transform = `translate3d(${-30 + p * 22}%, 0, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={boxRef} className="smq" aria-label={`Services: ${NAMES.join(", ")}`}>
      <div ref={aRef} className="smq-track"><Row /></div>
      <div ref={bRef} className="smq-track"><Row outline /></div>
    </div>
  );
};

export default ServiceMarquee;
