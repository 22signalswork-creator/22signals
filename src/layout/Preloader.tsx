import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import iconImg from "@/assets/22signals-icon.png";

interface Props {
  onComplete: () => void;
}

const TARGET = "22 SIGNALS";
// Encrypted version — same length as TARGET, mapped 1:1 by position.
// Bengali, Arabic, Runic, CJK, Cherokee, Cyrillic, Greek, Armenian, Coptic.
const ENCRYPTED = "২٢ ᛋ丨ᏩИΛԼⲊ";

// Random characters used briefly during the "decrypting" cycle
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@*$&!?";

/**
 * Each char starts as its encrypted glyph, holds for a moment,
 * then briefly cycles random chars (the "decrypt" effect), then
 * settles on the real character.
 */
const FlapChar: React.FC<{
  startChar: string;
  finalChar: string;
  delay: number;
  onSettled?: () => void;
}> = ({ startChar, finalChar, delay, onSettled }) => {
  const [display, setDisplay] = useState(startChar);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    let i = 0;
    const cycles = 6 + Math.floor(Math.random() * 3);
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < delay) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (i < cycles) {
        const wait = 40;
        if (elapsed - delay > i * wait) {
          setDisplay(CHARS[Math.floor(Math.random() * CHARS.length)]);
          i++;
        }
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(finalChar);
        if (ref.current) {
          gsap.fromTo(
            ref.current,
            { scale: 1.2, color: "#6B92FF" },
            { scale: 1, color: "#ffffff", duration: 0.25, ease: "back.out(2)" }
          );
        }
        onSettled?.();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [finalChar, delay, onSettled]);

  return (
    <span
      ref={ref}
      className="inline-block font-bold text-center"
      style={{
        fontFamily:
          "'SF Mono', 'JetBrains Mono', 'Menlo', 'Consolas', monospace",
        fontFeatureSettings: '"tnum" 1',
        textShadow: "0 0 18px rgba(50, 95, 236, 0.5)",
        // Fixed column width keeps layout stable as glyphs change widths
        minWidth: "0.85em",
      }}
    >
      {display === " " ? "\u00A0" : display}
    </span>
  );
};

const Preloader: React.FC<Props> = ({ onComplete }) => {
  const scope = useRef<HTMLDivElement>(null);
  const settledCount = useRef(0);
  const triggered = useRef(false);

  const handleSettled = () => {
    settledCount.current += 1;
    const realChars = TARGET.replace(/ /g, "").length;
    if (settledCount.current >= realChars && !triggered.current) {
      triggered.current = true;

      const tl = gsap.timeline({
        delay: 0.4,
        onComplete: () => onComplete(),
      });

      tl.to(".pl-icon", {
        scale: 1.15,
        duration: 0.2,
        ease: "power2.out",
      })
        .to(
          ".pl-icon",
          {
            x: -60,
            scale: 0.6,
            opacity: 0,
            duration: 0.3,
            ease: "power3.in",
          },
          "+=0.05"
        )
        .to(
          ".pl-text-row",
          {
            x: 60,
            scale: 0.7,
            opacity: 0,
            duration: 0.3,
            ease: "power3.in",
          },
          "<"
        )
        .to(
          ".pl-divider",
          {
            scaleY: 0,
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
          },
          "<"
        )
        .to(scope.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".pl-icon", { opacity: 0, scale: 0.6, x: -20 });
      gsap.set(".pl-text-row", { opacity: 0, x: 20 });
      gsap.set(".pl-divider", { opacity: 0, scaleY: 0 });

      const tl = gsap.timeline();
      tl.to(".pl-icon", {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 0.5,
        ease: "expo.out",
      })
        .to(
          ".pl-divider",
          {
            opacity: 1,
            scaleY: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          "-=0.2"
        )
        .to(
          ".pl-text-row",
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: "expo.out",
          },
          "-=0.25"
        );
    }, scope);
    return () => ctx.revert();
  }, []);

  // Longer initial delay (900ms) so users actually see the encrypted text
  // before the decryption cycle starts. Then 60ms stagger between chars.
  const charDelays = TARGET.split("").map((_, i) => i * 60 + 900);

  return (
    <div
      ref={scope}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "#000",
      }}
    >
      <div className="relative flex items-center justify-center gap-5 md:gap-8 px-4">
        {/* Icon — left */}
        <div className="pl-icon flex-shrink-0">
          <img
            src={iconImg}
            alt="22 Signals"
            className="h-12 md:h-16 w-auto select-none"
            style={{
              filter: "drop-shadow(0 0 24px rgba(50,95,236,0.6))",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
            draggable={false}
          />
        </div>

        {/* Vertical separator */}
        <div
          className="pl-divider h-10 md:h-14 w-[1px] flex-shrink-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(80,140,255,0.5) 50%, transparent 100%)",
            transformOrigin: "center",
          }}
        />

        {/* Text counter — right */}
        <div
          className="pl-text-row text-white text-2xl md:text-[36px] flex items-center"
          style={{
            letterSpacing: "0.08em",
          }}
        >
          {TARGET.split("").map((ch, i) => (
            <FlapChar
              key={i}
              startChar={ENCRYPTED[i] || ch}
              finalChar={ch}
              delay={charDelays[i]}
              onSettled={ch !== " " ? handleSettled : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preloader;
