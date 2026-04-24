import { useState, useEffect, useRef } from "react";
import "@/pages/home/home.css";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";

// Updated Helper component with Intersection Observer
interface RollingNumberProps {
  target: number;
  duration?: number;
}

const RollingNumber = ({ target, duration = 2000 }: RollingNumberProps) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Start animation only when the element is visible
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (startTimestamp === null) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function (Optional: makes the finish smoother) 
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      setCount(Math.floor(easedProgress * target));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, target, duration]);

  return <span ref={elementRef}>{count}</span>;
};

interface CompanyStatsCountsProps {
  scrollNext?: () => void;
  scrollPrev?: () => void;
}

const CompanyStatsCounts: React.FC<CompanyStatsCountsProps> = ({ scrollNext, scrollPrev }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    const handleNext = () => {
      if (!isScrolling.current && scrollNext) {
        isScrolling.current = true;
        scrollNext();
        setTimeout(() => (isScrolling.current = false), 1500);
      }
    };

    const handlePrev = () => {
      if (!isScrolling.current && scrollPrev) {
        isScrolling.current = true;
        scrollPrev();
        setTimeout(() => (isScrolling.current = false), 1500);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const element = sectionRef.current;
      if (!element) return;

      const isAtBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 10;
      const isAtTop = element.scrollTop < 10;

      if (e.deltaY > 0 && isAtBottom) {
        e.preventDefault();
        handleNext();
      } else if (e.deltaY < 0 && isAtTop) {
        e.preventDefault();
        handlePrev();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const element = sectionRef.current;
      if (!element) return;

      const isAtBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 10;
      const isAtTop = element.scrollTop < 10;

      const touchEndY = e.changedTouches[0].clientY;
      if (touchStartY.current - touchEndY > 50 && isAtBottom) {
        handleNext();
      } else if (touchEndY - touchStartY.current > 50 && isAtTop) {
        handlePrev();
      }
    };

    const element = sectionRef.current;
    if (element) {
      element.addEventListener("wheel", handleWheel, { passive: false });
      element.addEventListener("touchstart", handleTouchStart, { passive: true });
      element.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    return () => {
      if (element) {
        element.removeEventListener("wheel", handleWheel);
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [scrollNext, scrollPrev]);

  const stats = [
    { id: 1, value: 150, suffix: "+", label: "Projects Delivered" },
    { id: 2, value: 98, suffix: "%", label: "Client Satisfaction" },
    { id: 3, value: 50, suffix: "+", label: "Global Clients" },
    { id: 4, value: 25, suffix: "+", label: "Industry Awards" },
  ];

  return (
    <div className="container mx-auto px-4  pt-30" ref={sectionRef}>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Our Successfully <br /> Growth
          </h1>
        </div>
        <div>
          <p className="dark-text text-base md:text-lg">
            You never get another chance to make a good first impression. At American Designers Hub, we use a complete spectrum.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <FadeIn key={stat.id}>
            <Cardhovereffect>
              <div className="second-card flex flex-col items-center">
                <h1 className="text-4xl font-bold">
                  <RollingNumber target={stat.value} />
                  {stat.suffix}
                </h1>
                <p className="dark-text">{stat.label}</p>
              </div>
            </Cardhovereffect>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

export default CompanyStatsCounts;