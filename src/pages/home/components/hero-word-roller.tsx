import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["Lead.", "Develop.", "Launch."];

const HomeWordRoller = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500); // Change word every 2.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex flex-col h-[1.1em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          // Starts from below, moves to center, exits to top
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ 
            duration: 0.3, 
            ease: [0.23, 1, 0.32, 1] // "Exponential" out ease for a snappy feel
          }}
          className="bg-clip-text text-transparent bg-[linear-gradient(91.16deg,#325FEC_1.74%,#ffffff_43.71%,#ffffff_61.62%,#325FEC_102.48%)] block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
export default HomeWordRoller;