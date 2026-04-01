import { useState } from "react";
import ProjectCardContent, { Project } from "./projectcard.tsx"; // import Project type
import "../../../pages/home/home.css";
import "../work.css";

interface TabsProps {
  projects: Project[]; // now uses the same type as ProjectCardContent
}

const Tabs: React.FC<TabsProps> = ({ projects }) => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const tabs = ["All", "Digital & AI", "Creative & Marketing", "Broadcasting & Esports", "Manufacturing", "Outsourcing", "Game Development", "Trading & Investments (Coming Soon)"];

  const filteredProjects = selectedProject
    ? [selectedProject]
    : activeTab === "All"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  const onSelectProject = (project: Project) => {
    setSelectedProject(project);
    setActiveTab(project.category);
  };

  const clearSelection = () => {
    setSelectedProject(null);
    setActiveTab("All");
  };

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

      {/* Tab Content */}
      <div className="flex items-center justify-between mb-4">
        {selectedProject ? (
          <>
            <p className="card-description">
              Showing details for <strong>{(selectedProject as Project).title}</strong>.
            </p>
            <button
              className="px-4 mt-5 py-2 text-xs rounded-full border border-white/30 hover:bg-white/10"
              onClick={clearSelection}
            >
              Back to Projects
            </button>
          </>
        ) : (
          <p className="card-description mt-4">Click a card to view full details.</p>
        )}
      </div>

      {selectedProject ? (
        <div className="detailed-view glass-card rounded-2xl p-6 md:p-8 max-w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <span className="badge">{(selectedProject as Project).category}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-black">{(selectedProject as Project).title}</h1>
              <p className="dark-text">{(selectedProject as Project).subtitle}</p>
              <div className="card-description" dangerouslySetInnerHTML={{ __html: (selectedProject as Project).details }} />
            </div>
            <div className="flex justify-center">
              <img
                src={(selectedProject as Project).bigImage}
                alt={(selectedProject as Project).title}
                className="w-full max-w-md h-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="tab-content grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">{filteredProjects.length > 0 ? (
          filteredProjects.map((project, idx) => (
            <ProjectCardContent
              key={idx}
              project={project}
              onSelect={onSelectProject}
              isSelected={!!(selectedProject && (selectedProject as Project).title === project.title)}
              disabled={!!(selectedProject && (selectedProject as Project).title !== project.title)}
            />
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center py-20">
            No projects found in <strong>{activeTab}</strong>
          </p>
        )}
        </div>
      )}
    </div>
  );
};

export default Tabs;
