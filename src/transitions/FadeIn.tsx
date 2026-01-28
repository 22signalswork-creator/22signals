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
      // 1. Initial state (where it goes when out of view)
      initial={{ 
        opacity: 0, 
        y: direction === "up" ? 60 : -60,
        scale: 0.95 // Subtle scale down for a smoother "vanishing" effect
      }}
      // 2. The state it reaches when in view
      whileInView={{ 
        opacity: 1, 
        y: 0,
        scale: 1 
      }}
      // 3. Reset settings
      viewport={{ 
        once: false,      // Allows repeating the animation
        amount: 0.15,     // Triggers when 15% of the card is visible
        margin: "-50px"   // Adds a buffer so it doesn't pop in right at the edge
      }}
      transition={{ 
        duration: 0.8, 
        delay: delay * 0.1, // Scaling down your delay values for better responsiveness
        ease: [0.16, 1, 0.3, 1] // "Expo" ease out for a high-end feel
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;