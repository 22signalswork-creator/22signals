import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;  // Tailwind classes
  delay?: number;
  duration?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  className = "",
  delay = 0.5,
  duration = 2.5,
}) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const isWhite = className.includes("white-text");

  useEffect(() => {
    if (textRef.current) {
      // Animate background size from 0% → 100%
      gsap.fromTo(
        textRef.current,
        { backgroundSize: "0% 100%" },
        {
          backgroundSize: "100% 100%",
          duration: duration,
          delay: delay,
          ease: "power2.out",
        }
      );
    }
  }, [delay, duration]);

  // Gradient color: dark or white
  const gradientColor = isWhite
    ? "linear-gradient(to right, #ffffff 0%, #ffffff 100%)"
    : "linear-gradient(to right, #0f172a 0%, #0f172a 100%)";

  return (
    <p
      ref={textRef}
      className={className}
      style={{
        backgroundImage: gradientColor,
        backgroundRepeat: "no-repeat",
        backgroundSize: "0% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </p>
  );
};

export default AnimatedText;
