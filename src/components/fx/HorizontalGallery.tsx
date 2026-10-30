/** Desktop: projects pinned on screen and scrolled sideways as you scroll down. */
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const HorizontalGallery: React.FC<{ items: React.ReactNode[] }> = ({ items }) => {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    const m = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 80));
    m();
    const ro = new ResizeObserver(m);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", m);
    return () => { ro.disconnect(); window.removeEventListener("resize", m); };
  }, [items.length]);
  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.35 });
  const x = useTransform(p, [0, 1], [0, -dist]);
  const bar = useTransform(p, [0, 1], [0, 1]);
  const [idx, setIdx] = useState(1);
  useEffect(() => p.on("change", (v) => setIdx(Math.min(items.length, Math.max(1, Math.round(v * (items.length - 1)) + 1)))), [p, items.length]);
  return (
    <div ref={outer} className="fx-gallery" style={{ height: `calc(100vh + ${Math.round(dist * 0.5)}px)` }}>
      <div className="fx-gallery-pin">
        <motion.div ref={track} className="fx-gallery-track" style={{ x }}>
          {items.map((it, i) => (
            <div key={i} className="fx-gallery-item">{it}</div>
          ))}
        </motion.div>
        <div className="fx-gallery-meta">
          <span>{String(idx).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          <div className="fx-gallery-bar"><motion.div style={{ scaleX: bar }} /></div>
          <span>Scroll</span>
        </div>
      </div>
    </div>
  );
};

export default HorizontalGallery;
