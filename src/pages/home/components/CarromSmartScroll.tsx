import React, { useState, useEffect, useRef, ReactElement } from "react";
import { motion, useAnimation } from "framer-motion";

interface SmartScrollProps {
  children: React.ReactNode;
}

export default function CarromSmartScroll({ children }: SmartScrollProps) {
  const [index, setIndex] = useState(0);
  const controls = useAnimation();
  const isMoving = useRef(false);
  
  // Convert children to an array to count them and map refs
  const childrenArray = React.Children.toArray(children) as ReactElement[];
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Internal function to handle the glide animation
  const moveToSection = async (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= childrenArray.length || isMoving.current) return;

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

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isMoving.current) {
        e.preventDefault();
        return;
      }

      const currentSection = sectionRefs.current[index];
      if (!currentSection) return;

      const isAtBottom = 
        Math.ceil(currentSection.scrollTop + currentSection.clientHeight) >= currentSection.scrollHeight;
      const isAtTop = currentSection.scrollTop <= 0;

      if (e.deltaY > 0) {
        if (isAtBottom && index < childrenArray.length - 1) {
          e.preventDefault();
          moveToSection(index + 1);
        }
      } else if (e.deltaY < 0) {
        if (isAtTop && index > 0) {
          e.preventDefault();
          moveToSection(index - 1);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [index, controls, childrenArray.length]);

  return (
    <div style={{ 
      height: "100vh", 
      width: "100vw", 
      overflow: "hidden", 
      position: "fixed", 
      top: 0, 
      left: 0,
    }}>
      <motion.div 
        animate={controls} 
        initial={{ y: 0 }} 
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        {childrenArray.map((child, i) => (
          <section
            key={i}
            style={{
              height: "100vh",
              width: "100vw",
              flexShrink: 0,
              overflow: "hidden",
              position: "relative"
            }}
          >
            <div 
              ref={(el) => (sectionRefs.current[i] = el)}
              style={{
                height: "100vh",
                width: "100%",
                overflowY: "auto",
                boxSizing: "border-box",
              }}
            >
              {/* Injecting scrollNext prop so children can trigger the 
                parent's glide logic instead of using scrollIntoView
              */}
              {React.isValidElement(child) 
                ? React.cloneElement(child as ReactElement<any>, { 
                    scrollNext: () => moveToSection(i + 1),
                    scrollPrev: () => moveToSection(i - 1)
                  }) 
                : child}
            </div>
          </section>
        ))}
      </motion.div>
    </div>
  );
}