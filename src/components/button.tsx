import React, { useRef, useEffect } from "react";
import icon from "../assets/btn-icon.svg";
import gsap from "gsap";

interface MyButtonProps {
  text?: string;
  className?: string;
}

function MyButton({ text = "LET’S TALK", className = "" }: MyButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const flairRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!btnRef.current || !flairRef.current) return;

    const btn = btnRef.current;
    const flair = flairRef.current;

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
      gsap.to(flair, { scale: 1.2, duration: 0.5, ease: "power2.out" });
      gsap.to(btn, { y: -2, duration: 0.2, ease: "power2.out" });
    };
    const onMouseLeave = (e: MouseEvent) => {
      const { x, y } = getXY(e);
      gsap.to(flair, {
        xPercent: x,
        yPercent: y,
        scale: 0,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(btn, { y: 0, duration: 0.3, ease: "power2.out" });
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
  }, []);

  return (
    <button ref={btnRef} className={`gsap-btn relative overflow-hidden ${className}`}>
      <span ref={flairRef} className="btn-flair"></span>
      <span className="btn-label flex items-center gap-2 relative z-10">
        {text} <img src={icon} alt="Icon" className="h-4 w-4" />
      </span>
    </button>
  );
}

export default MyButton;
