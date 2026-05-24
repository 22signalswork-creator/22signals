"use client";
import React, { useEffect, useRef } from "react";
import FadeIn from "./FadeIn"; 
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  { id: "01", title: "Design & Strategy", bg: "#111" },
  { id: "02", title: "Web Development", bg: "#1a1a1a" },
  { id: "03", title: "App Development", bg: "#222" },
  { id: "04", title: "Digital Marketing", bg: "#2a2a2a" },
];

const ServiceStack = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let mm = gsap.matchMedia();

    mm.add("(max-width: 768px)", () => {
      cardsRef.current.forEach((card, i) => {
        if (i !== services.length - 1 && card) {
          gsap.to(card, {
            scale: 0.9,
            opacity: 0.5,
            scrollTrigger: {
              trigger: cardsRef.current[i + 1],
              start: "top 85%",
              end: "top 25%",
              scrub: true,
            },
          });
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="card-wrapper sticky top-24 md:relative md:top-0 mb-12 md:mb-0"
          >
            <FadeIn delay={index} direction="up">
              <div 
                // Fix: Added curly braces to ensure the function returns void
                ref={(el) => { cardsRef.current[index] = el; }} 
                className="h-[400px] rounded-[30px] p-10 border border-[#333] flex flex-col justify-center"
                style={{ backgroundColor: service.bg }}
              >
                <h2 className="text-[#325fec] text-5xl font-bold mb-4">{service.id}</h2>
                <p className="text-white text-2xl font-medium">{service.title}</p>
              </div>
            </FadeIn>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceStack;