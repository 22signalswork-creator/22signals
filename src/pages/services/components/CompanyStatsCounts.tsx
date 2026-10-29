import { useState, useEffect, useRef } from "react";
import "@/pages/home/home.css";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";
import { useCMS } from "@/hooks/useCMS";

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
        if (entry.isIntersecting && !hasStarted) setHasStarted(true);
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (startTimestamp === null) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      setCount(Number.isInteger(target) ? Math.floor(easedProgress * target) : Math.round(easedProgress * target * 10) / 10);
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, target, duration]);

  return <span ref={elementRef}>{count}</span>;
};

interface Stat {
  id: number | string;
  value: number;
  prefix?: string | null;
  suffix: string;
  label: string;
  sort_order?: number;
}

const FALLBACK_STATS: Stat[] = [
  { id: 1, value: 30, suffix: "+", label: "Companies worked with" },
  { id: 2, value: 30, suffix: "+", label: "AI builds" },
  { id: 3, value: 20, suffix: "+", label: "Live events broadcast" },
  { id: 4, value: 1.5, suffix: "M+", label: "In projects managed", prefix: "$" } as Stat,
];

const CompanyStatsCounts: React.FC = () => {
  const { data: stats } = useCMS<Stat>("company_stats", {
    orderBy: "sort_order",
    fallback: FALLBACK_STATS,
  });

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <FadeIn>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-6 mb-6 md:mb-10 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              In numbers we stand behind
            </h2>
          </div>
          {/* Right-side paragraph removed per request */}
        </div>
      </FadeIn>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat) => (
          <FadeIn key={stat.id} delay={(typeof stat.id === "number" ? stat.id : 1) * 0.1}>
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
    </div>
  );
};

export default CompanyStatsCounts;
