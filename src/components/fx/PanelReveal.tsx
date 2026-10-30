/** The dark section after the light part opens out like a panel: it starts
 *  inset with rounded top corners and widens to full bleed as it rises. */
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const PanelReveal: React.FC<{ children: React.ReactNode; trace?: string }> = ({ children, trace }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [phone] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 15%"] });
  const side = useTransform(scrollYProgress, [0, 1], [phone ? 14 : 64, 0]);
  const round = useTransform(scrollYProgress, [0, 1], [phone ? 28 : 64, 0]);
  const clip = useTransform([side, round], ([s, r]: any) => `inset(0px ${s}px 0px ${s}px round ${r}px ${r}px 0px 0px)`);
  return (
    <motion.div ref={ref} data-trace={trace} style={{ clipPath: clip, WebkitClipPath: clip as any }}>
      {children}
    </motion.div>
  );
};

export default PanelReveal;
