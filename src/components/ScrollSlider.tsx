import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Observer } from 'gsap/all';

gsap.registerPlugin(Observer);

interface ScrollSliderProps {
  children: React.ReactNode[];
}

const ScrollSlider = ({ children }: ScrollSliderProps) => {
  const container = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const indexRef = useRef(0);
  const animating = useRef(false);

  const { contextSafe } = useGSAP(() => {
    gsap.set(".section-container", { autoAlpha: 0, zIndex: 0 });
    gsap.set(".section-container:first-child", { autoAlpha: 1, zIndex: 1 });
  }, { scope: container });

  const gotoSection = contextSafe((nextIdx: number, direction: number) => {
    const sections = gsap.utils.toArray<HTMLElement>(".section-container");
    if (nextIdx < 0 || nextIdx >= sections.length || animating.current) return;

    const currentSection = sections[indexRef.current];
    const nextSection = sections[nextIdx];
    
    // Check for internal scrollable content (like the Footer)
    const activeInner = currentSection.querySelector(".inner-content");
    if (activeInner) {
        const isAtTop = activeInner.scrollTop <= 5;
        const isAtBottom = activeInner.scrollHeight - activeInner.scrollTop <= activeInner.clientHeight + 5;
        if (direction === -1 && !isAtTop) return;
        if (direction === 1 && !isAtBottom) return;
    }

    animating.current = true;
    const dFactor = direction === -1 ? -1 : 1;

    const tl = gsap.timeline({
      onComplete: () => {
        animating.current = false;
        indexRef.current = nextIdx;
        setCurrentIndex(nextIdx);
      }
    });

    tl.set(nextSection, { autoAlpha: 1, zIndex: 1 })
      .set(currentSection, { zIndex: 0 })
      .fromTo(nextSection.querySelector(".inner-content"), 
        { yPercent: 100 * dFactor }, 
        { yPercent: 0, duration: 1.2, ease: "power2.inOut" }
      )
      .to(currentSection.querySelector(".inner-content"), 
        { yPercent: -100 * dFactor, duration: 1.2, ease: "power2.inOut" }, 0);
  });

  useGSAP(() => {
    const obs = Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => gotoSection(indexRef.current - 1, -1),
      onUp: () => gotoSection(indexRef.current + 1, 1),
      tolerance: 10,
      preventDefault: false 
    });
    return () => obs.kill();
  }, { scope: container });

  return (
    <div ref={container} className="relative w-screen h-screen overflow-hidden ">
      {children.map((child, i) => (
        <div key={i} className="section-container fixed inset-0 w-full h-full">
          {/* Added overflow-y-auto so long footers don't get cut off */}
          <div className="inner-content w-full h-full overflow-y-auto overflow-x-hidden">
            {child}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScrollSlider;