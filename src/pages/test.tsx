import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

const sections = [
  { title: "SOLID FRAME", color: "#0a0a0a", content: "Short section." },
  { 
    title: "HEAVY CONTENT", 
    color: "#111", 
    content: "This section has a massive amount of content. ".repeat(100) 
  },
  { title: "SLIDING PIECE", color: "#0a0a0a", content: "Another short section." },
];

export default function Test() {
  const [index, setIndex] = useState(0);
  const controls = useAnimation();
  const isMoving = useRef(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If we are currently sliding to another section, block everything
      if (isMoving.current) {
        e.preventDefault();
        return;
      }

      const currentSection = sectionRefs.current[index];
      if (!currentSection) return;

      // Logic to check if we are at the very edges of the inner content
      const isAtBottom = 
        Math.ceil(currentSection.scrollTop + currentSection.clientHeight) >= currentSection.scrollHeight;
      const isAtTop = currentSection.scrollTop <= 0;

      if (e.deltaY > 0) {
        // User wants to go DOWN
        if (isAtBottom && index < sections.length - 1) {
          e.preventDefault();
          moveToSection(index + 1);
        }
      } else if (e.deltaY < 0) {
        // User wants to go UP
        if (isAtTop && index > 0) {
          e.preventDefault();
          moveToSection(index - 1);
        }
      }
    };

    const moveToSection = async (nextIndex: number) => {
      isMoving.current = true;
      setIndex(nextIndex);

      await controls.start({
        y: `-${nextIndex * 100}vh`,
        transition: { 
          duration: 1.2, 
          ease: [0.60, 1, 0.61, 1] // Carrom-style glide
        },
      });

      // Unlock after settle
      setTimeout(() => {
        isMoving.current = false;
      }, 300); 
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [index, controls]);

  return (
    <div style={{ 
      height: "100vh", 
      width: "100vw", 
      overflow: "hidden", 
      position: "fixed", 
      top: 0, 
      left: 0,
      backgroundColor: "#000" 
    }}>
      <motion.div 
        animate={controls} 
        initial={{ y: 0 }} 
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        {sections.map((s, i) => (
          <section
            key={i}
            style={{
              height: "100vh",     // FORCE 100% Viewport Height
              width: "100vw",      // FORCE 100% Viewport Width
              flexShrink: 0,       // CRITICAL: Prevents section from squashing
              backgroundColor: s.color,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative"
            }}
          >
            {/* THIS INNER DIV HANDLES THE CONTENT SCROLLING */}
            <div 
              ref={(el) => (sectionRefs.current[i] = el)}
              className="custom-scrollbar" // Add CSS to hide scrollbar if wanted
              style={{
                maxHeight: "100vh",
                width: "100%",
                overflowY: "auto",
                padding: "10vh 5vw",
                boxSizing: "border-box",
                textAlign: "center"
              }}
            >
              <h1 style={{ fontSize: "5rem", color: "white", fontWeight: 900 }}>{s.title}</h1>
              <div style={{ color: "#888", fontSize: "1.8rem", lineHeight: "1.5", marginTop: "2rem" }}>
                {s.content}
              </div>
            </div>
          </section>
        ))}
      </motion.div>
    </div>
  );
}