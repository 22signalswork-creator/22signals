import { useState, useEffect, useRef } from "react";
import "@/pages/home/home.css";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";
import { div } from "framer-motion/client";

// Updated Helper component with Intersection Observer
const RollingNumber = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef(null);

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

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function (Optional: makes the finish smoother) 
      const easeOutQuad = (t) => t * (2 - t);
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
const CompanyStatsCounts = () => {
  const stats = [
    { id: 1, value: 150, suffix: "+", label: "Projects Delivered" },
    { id: 2, value: 98, suffix: "%", label: "Client Satisfaction" },
    { id: 3, value: 50, suffix: "+", label: "Global Clients" },
    { id: 4, value: 25, suffix: "+", label: "Industry Awards" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <FadeIn 
          key={stat.id} 
          delay={index * 0.2} // Card 1: 0s, Card 2: 0.15s, Card 3: 0.3s...
        >
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
  );
};
export default CompanyStatsCounts;