import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props { onComplete: () => void; }

const Preloader: React.FC<Props> = ({ onComplete }) => {
  const scope = useRef<HTMLDivElement>(null);
  const letters = "22SIGNALS".split("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ 
        onComplete: () => onComplete() 
      });

      // 1. Initial Setup
      gsap.set(".central-ball", { scale: 0, opacity: 0 });
      gsap.set(".fluo-letter", { x: 0, opacity: 0, scale: 0.8 });

      // 2. Letters Reveal and Spread
      tl.to(".fluo-letter", {
        opacity: 1,
        duration: 0.4,
      })
      .to(".fluo-letter", {
        x: (i) => (i - (letters.length - 1) / 2) * 40, 
        scale: 1,
        duration: 1,
        stagger: 0.04,
        ease: "expo.out",
      })

      .to({}, { duration: 0.8 }) // Reading pause

      // 3. COLLAPSE: Snap back to center
      .to(".fluo-letter", {
        x: 0,
        opacity: 0.2,
        duration: 0.5,
        stagger: { each: 0.02, from: "edges" },
        ease: "expo.in",
      })

      // 4. TRANSFORMATION: Letters vanish, Ball pops in
      .set(".fluo-letter", { opacity: 0 }) 
      .to(".central-ball", {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(2)", 
      }, "-=0.1")

      // 5. THE GROWTH: Ball grows slightly (Reduced size as requested)
      .to(".central-ball", {
        scale: 5, 
        duration: 0.8,
        ease: "power2.out",
      })

      // 6. INTERNAL FADE: Fade the ball itself first to keep the screen black
      .to(".central-ball", {
        opacity: 0,
        duration: 0.4,
      })
      
      
    }, scope);

    return () => ctx.revert();
  }, [onComplete, letters.length]);

  return (
    <div 
      ref={scope} 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden" 
      style={{ isolation: 'isolate', backgroundColor: '#000' }}
    >
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="fluo-goo" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -12" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="relative flex items-center justify-center">
        <div style={{ filter: "url(#fluo-goo)", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Blue Ball */}
          <div className="central-ball w-16 h-16 md:w-20 md:h-20 bg-[#325FEC] rounded-full shadow-[0_0_100px_rgba(50,95,236,1)] z-20" />

          {/* Letters Layer */}
          <div className="absolute flex items-center justify-center pointer-events-none">
            {letters.map((char, i) => (
              <span 
                key={i} 
                className="fluo-letter absolute text-white font-black text-5xl md:text-7xl tracking-widest"
                style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;