import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Per brief: "Create. Innovate. (Lead. Develop. Launch.)" - second word rolls
const words = ["Innovate.", "Lead.", "Develop.", "Launch."];

const HomeWordRoller = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Simple fade transition between words. The previous version used a
  // slide-up animation inside an `overflow: hidden` strip — when the
  // heading wrapped on mobile, the strip clipped the word entirely and
  // it appeared as if the word was missing.
  return (
    <span className="inline-block align-baseline">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-clip-text text-transparent bg-[linear-gradient(91.16deg,#325FEC_1.74%,#ffffff_43.71%,#ffffff_61.62%,#325FEC_102.48%)] inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default HomeWordRoller;
