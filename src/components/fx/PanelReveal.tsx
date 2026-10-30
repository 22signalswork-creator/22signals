/** The dark section after the light part opens out like a panel: it starts
 *  a little narrower with rounded top corners and settles to full width as
 *  it rises. Uses a GPU transform (no clip-path), so scrolling stays smooth. */
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const PanelReveal: React.FC<{ children: React.ReactNode; trace?: string }> = ({ children, trace }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [phone] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 20%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [phone ? 0.94 : 0.93, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [phone ? 28 : 56, 0]);
  return (
    <motion.div
      ref={ref}
      data-trace={trace}
      style={{ scale, borderTopLeftRadius: radius, borderTopRightRadius: radius, transformOrigin: "50% 0%", overflow: "clip", willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
};

export default PanelReveal;
