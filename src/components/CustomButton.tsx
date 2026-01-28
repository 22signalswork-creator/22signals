import React, { useRef, useEffect } from "react";
import icon from "../assets/btn-icon.svg";
import gsap from "gsap";

// Define your variants here
const VARIANTS = {
  primary: {
    base: "#325fec",
    text: "#ffffff",
    flair: "#ffffff",
    border: "rgba(50, 95, 236, 0.2)",
  },
  secondary: {
    base: "#000c77",
    text: "#ffffff",
    flair: "#325fec",
    border: "rgba(0, 12, 119, 0.2)",
  },
  white: {
    base: "#ffffff",
    text: "#000000",
    flair: "#000000",
    border: "rgba(255, 255, 255, 0.5)",
  },
  danger: {
    base: "#dc2626",
    text: "#ffffff",
    flair: "#ffffff",
    border: "rgba(220, 38, 38, 0.2)",
  },
};

type ButtonVariant = keyof typeof VARIANTS;

interface MyButtonProps {
  text?: string;
  variant?: ButtonVariant;
  className?: string;
}

function CustomButton({ variant = "primary", text = "LET’S TALK",   className = "", }: MyButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const flairRef = useRef<HTMLSpanElement>(null);
  const config = VARIANTS[variant];

  useEffect(() => {
    if (!btnRef.current || !flairRef.current) return;

    const btn = btnRef.current;
    const flair = flairRef.current;

    // 1. Set the initial "Transparent/Light" state (15% opacity)
    gsap.set(btn, { backgroundColor: `${config.base}26` }); // 26 is 15% in Hex
    gsap.set(flair, { scale: 0 });

    const xSet = gsap.quickSetter(flair, "xPercent");
    const ySet = gsap.quickSetter(flair, "yPercent");

    const getXY = (e: MouseEvent) => {
      const { left, top, width, height } = btn.getBoundingClientRect();
      const x = gsap.utils.clamp(0, 100, ((e.clientX - left) / width) * 100);
      const y = gsap.utils.clamp(0, 100, ((e.clientY - top) / height) * 100);
      return { x, y };
    };

    const onMouseEnter = (e: MouseEvent) => {
      const { x, y } = getXY(e);
      xSet(x);
      ySet(y);
      
      // Animate Flair & Button Lift
      gsap.to(flair, { scale: 1.2, duration: 0.5, ease: "power2.out" });
      gsap.to(btn, { y: -2, duration: 0.2, ease: "power2.out" });
      
      // Animate Background to 100% Solid
      gsap.to(btn, { backgroundColor: config.base, duration: 0.4 });
    };

    const onMouseLeave = (e: MouseEvent) => {
      const { x, y } = getXY(e);
      
      // Reset Flair & Button
      gsap.to(flair, { xPercent: x, yPercent: y, scale: 0, duration: 0.3, ease: "power2.out" });
      gsap.to(btn, { y: 0, duration: 0.3, ease: "power2.out" });
      
      // Reset Background to 15% Opacity
      gsap.to(btn, { backgroundColor: `${config.base}26`, duration: 0.4 });
    };

    const onMouseMove = (e: MouseEvent) => {
      const { x, y } = getXY(e);
      gsap.to(flair, { xPercent: x, yPercent: y, duration: 0.4, ease: "power2" });
    };

    btn.addEventListener("mouseenter", onMouseEnter);
    btn.addEventListener("mouseleave", onMouseLeave);
    btn.addEventListener("mousemove", onMouseMove);

    return () => {
      btn.removeEventListener("mouseenter", onMouseEnter);
      btn.removeEventListener("mouseleave", onMouseLeave);
      btn.removeEventListener("mousemove", onMouseMove);
    };
  }, [variant, config]); // Re-init if variant changes

  return (
    <button
      ref={btnRef}
      className={`gsap-btn relative overflow-hidden group rounded-full border px-8 py-3 transition-colors duration-300 ${className}`}
      style={{ 
        borderColor: config.border,
        color: config.text,
        // We pass the flair color to CSS via a variable
        ['--button-color' as any]: config.flair 
      }}
    >
      <span ref={flairRef} className="btn-flair"></span>
      <span className="btn-label flex items-center gap-2 relative z-10 font-medium">
        {text} 
        <img 
          src={icon} 
          alt="Icon" 
          className="h-4 w-4 pointer-events-none" 
          style={{ filter: variant === 'white' ? 'brightness(0)' : 'brightness(0) invert(1)' }}
        />
      </span>

      <style>{`
        .btn-flair {
          position: absolute;
          inset: 0;
          pointer-events: none;
          transform: scale(0);
          transform-origin: 0 0;
          z-index: 1;
        }
        .btn-flair::before {
          content: "";
          position: absolute;
          width: 180%;
          aspect-ratio: 1 / 1;
          background: var(--button-color); 
          border-radius: 50%;
          top: 0;
          left: 0;
          transform: translate(-50%, -50%);
          opacity: 0.15;
          z-index: -1;
        }
      `}</style>
    </button>
  );
}

export default CustomButton;