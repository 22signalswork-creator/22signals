import { useState, useRef, useEffect } from "react";
import ProjectCardContent, { Project } from "./projectcard.tsx";
import "../../../pages/home/home.css";
import "../work.css";

interface TabsProps {
  projects: Project[];
  scrollNext?: () => void;
}

const Tabs: React.FC<TabsProps> = ({ projects, scrollNext }) => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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

  const tabs = [
    "All",
    "Digital & AI",
    "Creative & Marketing",
    "Broadcasting & Esports",
    "Manufacturing",
    "Outsourcing",
    "Game Development",
    "Trading & Investments (Coming Soon)"
  ];

  const filteredProjects =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  const onSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  return (
    <div className="container mx-auto px-4 py-12" ref={sectionRef}>

      {/* Tabs */}
      <div className="tabs flex gap-4 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab);
              setSelectedProject(null);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ===================== */}
      {/* ALL TAB LOGIC */}
      {/* ===================== */}
      {activeTab === "All" ? (
        selectedProject ? (
          /* SHOW DETAIL WHEN CARD CLICKED */
          <div className="detailed-view glass-card rounded-2xl p-6 md:p-8 max-w-full mx-auto mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

              <div className="space-y-6">
                <span className="badge">{selectedProject.category}</span>
                <h1 className="text-3xl md:text-4xl font-bold text-black">
                  {selectedProject.title}
                </h1>
                <p className="dark-text">{selectedProject.subtitle}</p>
                <div
                  className="card-description"
                  dangerouslySetInnerHTML={{ __html: selectedProject.details }}
                />
              </div>

              <div className="flex justify-center">
                <img
                  src={selectedProject.bigImage}
                  alt={selectedProject.title}
                  className="w-full max-w-md h-auto object-contain rounded-lg"
                />
              </div>

            </div>
          </div>
        ) : (
          /* SHOW CARDS */
          <div className="tab-content grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {projects.map((project, idx) => (
              <ProjectCardContent
                key={idx}
                project={project}
                onSelect={onSelectProject}
              />
            ))}
          </div>
        )
      ) : (
        /* ===================== */
        /* OTHER TABS → DIRECT DETAIL VIEW */
        /* ===================== */
        filteredProjects.length > 0 ? (
          filteredProjects.map((project, idx) => (
            <div
              key={idx}
              className="detailed-view glass-card rounded-2xl p-6 md:p-8 max-w-full mx-auto mt-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                <div className="space-y-6">
                  <span className="badge">{project.category}</span>
                  <h1 className="text-3xl md:text-4xl font-bold text-black">
                    {project.title}
                  </h1>
                  <p className="dark-text">{project.subtitle}</p>
                  <div
                    className="card-description"
                    dangerouslySetInnerHTML={{ __html: project.details }}
                  />
                </div>

                <div className="flex justify-center">
                  <img
                    src={project.bigImage}
                    alt={project.title}
                    className="w-full max-w-md h-auto object-contain rounded-lg"
                  />
                </div>

              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-20">
            No projects found in <strong>{activeTab}</strong>
          </p>
        )
      )}
    </div>
  );
};

export default Tabs;