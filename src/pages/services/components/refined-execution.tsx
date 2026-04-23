import { useRef, useEffect } from "react";
import "../services.css";
import CustomDesigns from "@/assets/CustomDesigns.png";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";
import React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RefinedExecutionProps {
  scrollNext?: () => void; 
}

const RefinedExecution: React.FC<RefinedExecutionProps> = ({ scrollNext }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
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

  // Scroll-dependent GSAP animation
  useEffect(() => {
    const header = headerRef.current;
    const grid = gridRef.current;

    if (header && grid) {
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

      // Grid animation
      gsap.fromTo(
        grid,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: grid,
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
    <section className="creative-services h-screen min-h-screen flex items-center justify-center" ref={sectionRef}>
      <div className="container">
        {/* ================= HEADER ================= */}
        <div className="services-header" ref={headerRef}>
          <FadeIn>
            <span className="services-badge-secondry">
              Creative Marketing Solutions
            </span>

            <div className="services-title-wrap">
              <RisingText end="80%">
                <h1>Refined <br/>Execution.</h1>
              </RisingText>
              <div>
                <RisingText end="80%">
                  <p className="dark-text">
                    Stop managing multiple agencies. Partner with us to gain a dedicated supervisor and instant access to our full suite of digital, creative, and manufacturing solutions.
                  </p>
                </RisingText>
                <div className="divider"></div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* ================= SERVICES ================= */}
        <div className="services-grid" ref={gridRef}>
          <FadeIn>
            <Cardhovereffect>
              <div className="service-card">
                <img src={CustomDesigns} alt="" />
                <h4>Custom Designs</h4>
                <p>
                  We are developing genuine, human-centered personalities that
                  interact, arouse, and gain trust. With UI design services, we
                  force brand names to describe their picture, and with UX design
                  amenities
                </p>
              </div>
            </Cardhovereffect>
          </FadeIn>
          <FadeIn>
            <Cardhovereffect>
              <div className="service-card">
                <img src={CustomDesigns} alt="" />
                <h4>Influential UI/UX Services</h4>
                <p>
                  We are developing genuine, human-centered personalities that
                  interact, arouse, and gain trust. With UI design services, we
                  force brand names to describe their picture, and with UX design
                  amenities
                </p>
              </div>
            </Cardhovereffect>
          </FadeIn>
          <FadeIn>
            <Cardhovereffect>
              <div className="service-card">
                <img src={CustomDesigns} alt="" />
                <h4>Improve your brand</h4>
                <p>
                  We are developing genuine, human-centered personalities that
                  interact, arouse, and gain trust. With UI design services, we
                  force brand names to describe their picture, and with UX design
                  amenities
                </p>
              </div>
            </Cardhovereffect>
          </FadeIn>
          <FadeIn>
            <Cardhovereffect>
              <div className="service-card">
                <img src={CustomDesigns} alt="" />
                <h4>Improve your brand</h4>
                <p className="dark-text">
                  We are developing genuine, human-centered personalities that
                  interact, arouse, and gain trust. With UI design services, we
                  force brand names to describe their picture, and with UX design
                  amenities
                </p>
              </div>
            </Cardhovereffect>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default RefinedExecution;
