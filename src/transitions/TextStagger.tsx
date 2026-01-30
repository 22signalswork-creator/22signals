"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TextStaggerProps {
  children: React.ReactNode;
  className?: string;
}

const TextStagger = ({ children, className = "" }: TextStaggerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Tag dhoondna (h1, h2, h3, p)
    const target = containerRef.current.querySelector("h1, h2, h3, p") || containerRef.current;
    const originalText = target.textContent || "";
    
    // 2. Text ko split karna aur styles ko inherit karna
    // 'color: inherit' ensure karta hai ke aapka original color wahi rahe
    target.innerHTML = originalText
      .split("")
      .map((char) => 
        `<span class="char-stagger inline-block opacity-0 translate-y-full" 
               style="color: inherit; font-family: inherit; font-weight: inherit;">${
          char === " " ? "&nbsp;" : char
        }</span>`
      )
      .join("");

    const chars = target.querySelectorAll(".char-stagger");

    // 3. Animation Logic
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: target,
        start: "top 95%", // Screen par aate hi animation shuru ho jaye
        toggleActions: "play none none reverse",
      },
    });

    tl.to(chars, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      stagger: 0.03,
      duration: 1,
      ease: "power4.out",
    });

    // ScrollTrigger ko refresh karna Next.js hydration ke liye
    ScrollTrigger.refresh();

    return () => {
      // Cleanup
      if (ScrollTrigger.getById("stagger-trigger")) {
        ScrollTrigger.getById("stagger-trigger")?.kill();
      }
    };
  }, [children]);

  return (
    <div ref={containerRef} className={`relative block overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export default TextStagger;