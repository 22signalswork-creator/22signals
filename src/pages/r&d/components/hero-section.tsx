import React, { useState, useRef } from "react";
import "@/pages/services/services.css";
import "@/pages/services/work.css";
import AnimatedText from "@/transitions/herosectionP.tsx";
import RisingText from "@/transitions/RisingText";
import serviceBg from "@/assets/servicebg.png";

const tabs = ["All", "AI Architecture", "Marketing", "Operations", "Web3", "Esports"];

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("All");
  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () =>
    tabsRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  const scrollRight = () =>
    tabsRef.current?.scrollBy({ left: 200, behavior: "smooth" });

  return (
    <section className="hero-section">
      <div className="container">
        <div className="servicebg-wrapper">
          <div
            className="servicebg w-[1600px] h-[657px] -mx-[70px] rounded-[50px] flex items-center relative"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(50,95,236,0.25) 7%, rgba(50,95,236,0.15) 25%, rgba(50,95,236,0) 52%), url(${serviceBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="content-container w-full">
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-12 gap-5 mb-10">
                <RisingText>
                  <h1>The Pulse of Innovation.</h1>
                </RisingText>

                <AnimatedText className="dark-text px-10 md:px-0 max-w-2xl">
                  Strategic perspectives on AI architecture, marketing, and the
                  future of scalable business operations.
                </AnimatedText>

                {/* Search bar */}
                <div className="flex justify-center w-full">
                  <input
                    type="text"
                    placeholder="Search insights, case studies, and industry trends..."
                    className="w-[260px] md:w-[800px] px-6 py-4 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>

                {/* Fixed category tabs */}
                <div className="tabs-container w-full mt-4">
                  <div className="tabs flex items-center justify-center gap-2">
                    <button
                      className="chevron-button"
                      onClick={scrollLeft}
                      aria-label="Scroll left"
                    >
                      ‹
                    </button>
                    <div
                      ref={tabsRef}
                      className="tabs-scroll flex gap-3 overflow-x-auto scrollbar-hide max-w-[680px]"
                    >
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          className={`tab ${activeTab === tab ? "active" : ""}`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <button
                      className="chevron-button"
                      onClick={scrollRight}
                      aria-label="Scroll right"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
