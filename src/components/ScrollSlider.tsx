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
  const indexRef = useRef(0); // Tracks the current slide index
  const animating = useRef(false);

  // Initial Setup: Hide all sections except the first one
  const { contextSafe } = useGSAP(() => {
    gsap.set(".section-container", { autoAlpha: 0, zIndex: 0 });
    gsap.set(".section-container:first-child", { autoAlpha: 1, zIndex: 1 });
  }, { scope: container });

  /**
   * Main Transition Function
   * Checks for internal scroll boundaries before executing the GSAP animation.
   */
  const gotoSection = contextSafe((nextIdx: number, direction: number) => {
    const sections = gsap.utils.toArray<HTMLElement>(".section-container");
    const currentSection = sections[indexRef.current];

    // 1. HYBRID CHECK: Handle internal scrolling for complex components
    const internalBox = currentSection.querySelector(".allow-internal-scroll");

    if (internalBox) {
      // Check if the user is at the top or bottom of the internal content
      const isAtTop = internalBox.scrollTop <= 5;
      const isAtBottom = 
        internalBox.scrollHeight - internalBox.scrollTop <= internalBox.clientHeight + 5;

      // If scrolling UP but not at the top of the component yet, STOP the slide change
      if (direction === -1 && !isAtTop) return;
      // If scrolling DOWN but not at the bottom of the component yet, STOP the slide change
      if (direction === 1 && !isAtBottom) return;
    }

    // 2. BOUNDARY CHECK: Prevent going out of array bounds or interrupting animations
    if (nextIdx < 0 || nextIdx >= sections.length || animating.current) {
      return;
    }

    // 3. EXECUTE GSAP WINDOW-BLIND ANIMATION
    animating.current = true;
    const dFactor = direction === -1 ? -1 : 1;
    const prevIdx = indexRef.current;
    const nextSection = sections[nextIdx];

    const tl = gsap.timeline({
      onComplete: () => {
        animating.current = false;
        indexRef.current = nextIdx; // Update ref for the next scroll event
        setCurrentIndex(nextIdx);    // Update state for React UI (dots, etc)
      }
    });

    tl.set(nextSection, { autoAlpha: 1, zIndex: 1 })
      .set(currentSection, { zIndex: 0 })
      // Move next section in
      .fromTo(nextSection.querySelector(".inner-content"), 
        { yPercent: 100 * dFactor }, 
        { yPercent: 0, duration: 1.2, ease: "power2.inOut" }
      )
      // Move current section out
      .to(currentSection.querySelector(".inner-content"), 
        { yPercent: -100 * dFactor, duration: 1.2, ease: "power2.inOut" }, 0);
  });

  /**
   * Observer Creation
   * Listens for scroll intent but allows internal scrolling by setting preventDefault to false.
   */
  useGSAP(() => {
    const obs = Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => gotoSection(indexRef.current - 1, -1),
      onUp: () => gotoSection(indexRef.current + 1, 1),
      tolerance: 10,
      preventDefault: false // Essential: allows standard scrolling inside HomeBody
    });

    return () => obs.kill(); // Cleanup
  }, { scope: container });

  return (
    <div ref={container} className="relative w-screen h-screen overflow-hidden ">
      {children.map((child, i) => (
        <div key={i} className="section-container fixed inset-0 w-full h-full visibility-hidden">
          <div className="inner-content w-full h-full overflow-hidden">
            {child}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScrollSlider;