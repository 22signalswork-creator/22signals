"use client";

import React, { useRef, useEffect } from "react";
import icon from "../assets/btn-icon.svg";
import gsap from "gsap";

const VARIANTS = {
  primary: {
    initialBg: "#325FEC",      // Default Solid Blue
    hoverBg: "#fff",        // Hover state (Solid Light)
    flair: "#fff",          // Moving Flair Color
    textDefault: "#ffffff",    // Default Text Color
    textHover: "#000",      // Hover Text Color (Dark Blue)
    borderDefault: "rgba(50, 95, 236, 0.5)",
    borderHover: "#000",    // Hover Border Color (Dark)
  },
  secondary: {
    initialBg: "#466fee",
     hoverBg: "#fff",        // Hover state (Solid Light)
    flair: "#fff",          // Moving Flair Color
    textDefault: "#ffffff",    // Default Text Color
    textHover: "#000",      // Hover Text Color (Dark Blue)
    borderDefault: "#466fee",
    borderHover: "#fff",    
  },
  white: {
    initialBg: "rgba(255, 255, 255, 0.1)",
    hoverBg: "rgba(255, 255, 255, 0.2)",
    flair: "#ffffff",
    text: "#000000",
    border: "rgba(255, 255, 255, 0.5)",
  },
  danger: {
    initialBg: "#191919",
    hoverBg: "#fff",
    flair: "#ffffff",
    textDefault: "#ffffff",    // Default Text Color
    textHover: "#000",      // Hover Text Color (Dark Blue)
    borderDefault: "#191919",
    borderHover: "none", 
  },
};
type ButtonVariant = keyof typeof VARIANTS;

interface MyButtonProps {
  text?: string;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
}

function CustomButton({ variant = "primary", text = "GET STARTED", className = "", onClick }: MyButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const flairRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const config = VARIANTS[variant];

  useEffect(() => {
    if (!btnRef.current || !flairRef.current || !labelRef.current) return;

    const btn = btnRef.current;
    const flair = flairRef.current;
    const label = labelRef.current;

    // --- INITIAL SETUP ---
    gsap.set(btn, { 
      backgroundColor: config.initialBg, 
      borderColor: config.borderDefault,
      color: config.textDefault,
      scale: 1 
    });
    gsap.set(flair, { scale: 0, xPercent: -50, yPercent: -50 });

    const onMouseEnter = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.killTweensOf([btn, flair, label]);
      gsap.set(flair, { x, y });

      // 1. SLOW ENTRY (Circle Fill)
      gsap.to(flair, { scale: 1, duration: 1.2, ease: "sine.out" });

      // 2. BUTTON ZOOM & TEXT/BORDER COLOR CHANGE
      gsap.to(btn, { 
        scale: 1.05, 
        borderColor: config.borderHover,
        color: config.textHover, // Text Dark ho jayega
        duration: 0.6, 
        ease: "power2.out" 
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(flair, { x, y, duration: 0.8, ease: "power1.out" });
    };

    const onMouseLeave = () => {
      gsap.killTweensOf([btn, flair, label]);

      // INSTANT RESET (Snap back to Blue Default)
      gsap.to(flair, { scale: 0, duration: 0.2, ease: "power2.in" });
      gsap.to(btn, { 
        scale: 1, 
        backgroundColor: config.initialBg, 
        borderColor: config.borderDefault,
        color: config.textDefault, // Text wapas White
        duration: 0.2, 
        ease: "power2.in" 
      });
    };

    btn.addEventListener("mouseenter", onMouseEnter);
    btn.addEventListener("mousemove", onMouseMove);
    btn.addEventListener("mouseleave", onMouseLeave);

    return () => {
      btn.removeEventListener("mouseenter", onMouseEnter);
      btn.removeEventListener("mousemove", onMouseMove);
      btn.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [variant, config]);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={`relative overflow-hidden group rounded-full border px-9 py-4 will-change-transform ${className}`}
      style={{
        transition: "color 0.3s ease, border-color 0.3s ease" // Smooth color switch
      }}
    >
      {/* Flair Element */}
      <span
        ref={flairRef}
        className="absolute pointer-events-none rounded-full"
        style={{
          width: "350%",
          aspectRatio: "1/1",
          backgroundColor: config.flair, // Your #dadada color
          left: 0,
          top: 0,
          zIndex: 1,
        }}
      ></span>

      {/* Label Content */}
    {/* Label Content */}
      <span ref={labelRef} className="relative z-10 flex items-center gap-3 font-semibold uppercase tracking-wider pointer-events-none">
        {text}
        <img
          src={icon}
          alt="icon"
          className="btn-icon h-4 w-4 transition-all duration-300"
          style={{
            // Default state: White icon
            filter: "brightness(0) invert(1)" 
          }}
        />
      </span>
      
      {/* CSS for Icon change on Hover */}
      <style jsx>{`
        /* Button hover par icon ko pure black karne ke liye */
        button:hover .btn-icon {
          filter: brightness(0) !important;
        }
        
        /* Text color ko bhi dark black karne ke liye agar zaroorat ho */
        button:hover {
          color: #000000 !important;
        }
      `}</style>
    </button>
  );
}

export default CustomButton;