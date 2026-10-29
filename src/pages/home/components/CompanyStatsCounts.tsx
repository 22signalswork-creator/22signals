import { useState, useEffect, useRef } from "react";
import "@/pages/home/home.css";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";
import { useCMS } from "@/hooks/useCMS";

// Updated Helper component with Intersection Observer
const RollingNumber = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
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
      const easeOutQuad = (t) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      setCount(Number.isInteger(target) ? Math.floor(easedProgress * target) : Math.round(easedProgress * target * 10) / 10);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, target, duration]);

  return <span ref={elementRef}>{count}</span>;
};

// Type for a stat row from Supabase (matches `company_stats` table)
interface Stat {
  id: number | string;
  value: number;
  prefix?: string | null;
  suffix: string;
  label: string;
  sort_order?: number;
}

// Fallback data — used if Supabase table is empty so the site never breaks
const FALLBACK_STATS: Stat[] = [
  { id: 1, value: 30, suffix: "+", label: "Companies worked with" },
  { id: 2, value: 30, suffix: "+", label: "AI builds" },
  { id: 3, value: 20, suffix: "+", label: "Live events broadcast" },
  { id: 4, value: 1.5, suffix: "M+", label: "In projects managed", prefix: "$" } as Stat,
];

const CompanyStatsCounts = () => {
  const { data: stats } = useCMS<Stat>("company_stats", {
    orderBy: "sort_order",
    fallback: FALLBACK_STATS,
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
      {stats.map((stat, index) => (
        <FadeIn key={stat.id} delay={index * 0.2}>
          <Cardhovereffect>
            <div className="second-card flex flex-col items-center justify-center text-center stats-card-compact">
              <div className="stat-number">
                {stat.prefix || ""}
                <RollingNumber target={stat.value} />
                {stat.suffix}
              </div>
              <p className="dark-text text-xs md:text-base">{stat.label}</p>
            </div>
          </Cardhovereffect>
        </FadeIn>
      ))}
    </div>
  );
};
export default CompanyStatsCounts;
