import { useState } from "react";
import ProjectCardContent, { Project } from "./projectcard.tsx";
import "../../../pages/home/home.css";
import "../../services/work.css";

interface TabsProps {
  projects: Project[];
}

const Tabs: React.FC<TabsProps> = ({ projects }) => {
  const [activeTab, setActiveTab] = useState<string>("All");

 const tabs = ["All", "Web Design", "App Design","Branding", "Marketing"];

  const filteredProjects =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Tabs */}
      <div className="tabs flex gap-4 overflow-x-auto scrollbar-hide">
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

      {/* Cards Only */}
      <div className="tab-content grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, idx) => (
            <ProjectCardContent
              key={idx}
              project={project}
              onSelect={() => {}}
              isSelected={false}
              disabled={false}
            />
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center py-20">
            No projects found in <strong>{activeTab}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default Tabs;