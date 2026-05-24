import React from "react";
import { motion } from "framer-motion";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down";
}

const FadeIn = ({ children, delay = 0, direction = "up" }: FadeInProps) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: direction === "up" ? 40 : -40, // Reduced distance for a sleeker look
        scale: 0.98 
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        scale: 1 
      }}
      viewport={{ 
        once: true,       // Usually better for stats so they don't re-animate on scroll
        amount: 0.2,      
      }}
      transition={{ 
        duration: 0.7, 
        delay: delay,     // Use the raw delay passed from the parent
        ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for a "premium" snap
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;