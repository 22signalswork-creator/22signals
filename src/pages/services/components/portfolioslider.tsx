import { useRef, useEffect } from "react";
import Sliderimg1 from "@/assets/sliderimg1.png";
import Sliderimg2 from "@/assets/sliderimg2.png";
import Sliderimg3 from "@/assets/sliderimg3.png";
import Lefticon from "@/assets/lefticon.png";
import Righticon from "@/assets/righticon.png";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx"

const CARD_WIDTH = 800;
const GAP = 30;

interface PortfolioSliderProps {
  scrollNext?: () => void;
}

export default function Portfolio({ scrollNext }: PortfolioSliderProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
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

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) handleNext();
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      if (touchStartY.current - touchEndY > 50) {
        handleNext();
      }
    };

    const element = sectionRef.current;
    if (element) {
      element.addEventListener("wheel", handleWheel, { passive: true });
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
  }, [scrollNext]);

  const slide = (dir: number) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: dir * (CARD_WIDTH + GAP),
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = CARD_WIDTH + GAP;
    }
  }, []);

  return (
    <div className="portfolio-section" ref={sectionRef}>
      <div className="portfolio-header">
        <div className="icon-circle" onClick={() => slide(-1)}>
          <img src={Lefticon} alt="prev" />
        </div>
        <RisingText>
        <h1>Check Our Work</h1>
</RisingText>
        <div className="icon-circle" onClick={() => slide(1)}>
          <img src={Righticon} alt="next" />
        </div>
      </div>

      <p className="dark-text flex justify-center text-center w-[930px] mx-auto pb-20">
        Take a look at some of our recent projects to see how we've helped businesses like yours succeed online.
      </p>

      <div className="portfolio-slider" ref={sliderRef}>
        <div className="portfolio-track">
          <div className="portfolio-card">
            <img src={Sliderimg1} alt="" />
          </div>
          <div className="portfolio-card">
            <img src={Sliderimg2} alt="" />
          </div>
          <div className="portfolio-card">
            <img src={Sliderimg3} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
