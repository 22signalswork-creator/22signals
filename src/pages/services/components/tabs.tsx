import { useState, useRef } from "react";
import Slider from "react-slick";
import ProjectCardContent, { Project } from "./projectcard.tsx";
import "../../../pages/home/home.css";
import "../work.css";
import "../services.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FadeIn from "@/transitions/FadeIn";

interface TabsProps {
  projects: Project[];
}

const Tabs: React.FC<TabsProps> = ({ projects }) => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const tabs = [
    "All",
    "Digital & AI",
    "Creative & Marketing",
    "Broadcasting & Esports",
    "Manufacturing",
    "Outsourcing",
    "Game Development",
    "Trading & Investments (Coming Soon)",
  ];

  const scrollLeft = () =>
    tabsRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  const scrollRight = () =>
    tabsRef.current?.scrollBy({ left: 200, behavior: "smooth" });

  const filtered =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  // Auto-playing slider — 2 rows × 2 cols visible (4 cards at once), advances automatically
  const sliderSettings = {
    dots: true,
    infinite: filtered.length > 4,
    speed: 700,
    slidesToShow: 2,
    slidesToScroll: 2,
    rows: 2,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, rows: 2, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, rows: 1, slidesToScroll: 1, arrows: false } },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button className="chevron-button" onClick={scrollLeft} aria-label="Scroll left">
            ‹
          </button>
          <div ref={tabsRef} className="tabs-scroll flex gap-4 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isComingSoon = tab.includes("Coming Soon");
              return (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => {
                    if (isComingSoon) return;
                    setActiveTab(tab);
                    setSelectedProject(null);
                  }}
                  style={isComingSoon ? { opacity: 0.55, cursor: "not-allowed" } : {}}
                >
                  {tab}
                </button>
              );
            })}
          </div>
          <button className="chevron-button" onClick={scrollRight} aria-label="Scroll right">
            ›
          </button>
        </div>
      </div>

      {/* Selected detail view (clicking a card shows full info) */}
      {selectedProject ? (
        <FadeIn>
          <div
            className="rounded-2xl p-6 md:p-10 mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
            style={{
              background:
                "linear-gradient(135deg, #050A18 0%, #0E1628 100%)",
              border: "1px solid rgba(80,140,255,0.25)",
            }}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="badge">{selectedProject.category}</span>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-white/60 hover:text-white text-sm"
                >
                  ← Back
                </button>
              </div>
              <h1 className="text-2xl md:text-4xl font-medium text-white leading-tight">
                {selectedProject.title}
              </h1>
              <p className="text-blue-300/90 text-sm md:text-base italic">
                {selectedProject.subtitle}
              </p>
              <p className="text-white/75 text-sm md:text-base leading-relaxed">
                {selectedProject.description}
              </p>
              <div
                className="text-white/70 text-sm leading-relaxed space-y-2"
                dangerouslySetInnerHTML={{ __html: selectedProject.details }}
              />
            </div>
            <div className="h-[300px] md:h-[400px]">
              {selectedProject.visual}
            </div>
          </div>
        </FadeIn>
      ) : filtered.length > 0 ? (
        /* Auto-playing slider */
        <div className="mt-8 services-slider">
          <Slider {...sliderSettings}>
            {filtered.map((project, idx) => (
              <div key={idx} className="px-2">
                <ProjectCardContent
                  project={project}
                  onSelect={setSelectedProject}
                  isSelected={false}
                  disabled={false}
                />
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-20">
          No projects found in <strong>{activeTab}</strong>
        </p>
      )}
    </div>
  );
};

export default Tabs;
