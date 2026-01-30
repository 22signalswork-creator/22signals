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

export default function Portfolio() {
  const sliderRef = useRef<HTMLDivElement | null>(null);

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
    <div className="portfolio-section">
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
