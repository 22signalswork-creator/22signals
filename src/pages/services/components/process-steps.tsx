import { useRef, useEffect } from "react";
import "../services.css";
import Arrowright from "@/assets/image-removebg-preview (4).png";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface ProcessStepsProps {
  scrollNext?: () => void;
  scrollPrev?: () => void; 
}

const ProcessSteps: React.FC<ProcessStepsProps> = ({ scrollNext, scrollPrev }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
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

  // Scroll-dependent GSAP animation
  useEffect(() => {
    const header = headerRef.current;
    const steps = stepsRef.current;

    if (header && steps) {
      // Header animation
      gsap.fromTo(
        header,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: header,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
            markers: false,
          },
        }
      );

      // Steps animation
      gsap.fromTo(
        steps,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: steps,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
            markers: false,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="process-section h-screen min-h-screen flex items-center justify-center " ref={sectionRef}>
      <div className="container items-center">
        {/* ================= HEADER ================= */}
        <div className="process-header" ref={headerRef}>
          <RisingText end="80%">
            <h1>
              Our Process Step <br /> By Step Strategy
            </h1>
          </RisingText>
          <p className="dark-text">
            You never get another chance to make a good first impression. At
            American Designers Hub, we use a complete spectrum.
          </p>
        </div>
        <FadeIn>
          <div className="process-steps" ref={stepsRef}>
            {[
              {
                number: "01",
                title: "Discovery",
                desc: "Understanding your vision, goals, and challenges",
                image: "/src/assets/image-removebg-preview.png",
              },
              {
                number: "02",
                title: "Design",
                desc: "Crafting the visual experience for your product",
                image: "/src/assets/image-removebg-preview (1).png",
              },
              {
                number: "03",
                title: "Development",
                desc: "Turning designs into functional products",
                image: "/src/assets/image-removebg-preview (2).png",
              },
              {
                number: "04",
                title: "Launch",
                desc: "Going live and optimizing performance",
                image: "/src/assets/image-removebg-preview (3).png",
              },
            ].map((step, index, arr) => (
              <div className="step-item" key={index}>
                <div className="step">
                  <div className="step-number-wrapper">
                    <img src={step.image} alt={step.title} />
                  </div>
                  <h1 className="card-heading pt-2 pl-2">{step.title}</h1>
                  <p>{step.desc}</p>
                </div>
                {index < arr.length - 1 && (
                  <img
                    src={Arrowright}
                    alt="arrow"
                    className="step-arrow-right"
                  />
                )}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default ProcessSteps;
