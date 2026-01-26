import { useState } from "react";
import Blogarrow from "@/assets/blogarrow.png";
import Bigimg1 from "@/assets/blog1.png";
import Bigimg2 from "@/assets/Bigimg2.png";
import Bigimg3 from "@/assets/Bigimg3.png";
import Bigimg4 from "@/assets/Bigimg4.png";
import "../../../pages/home/home.css";
import Calendar from "@/assets/clander.png";
import Clock from "@/assets/clock.png";

// Projects array with categories
const projects = [
  {
    title: "Neural Interface Protocol",
    description:
      "Developing next-generation human-computer interaction through advanced neural networks",
    bigImage: Bigimg1,
    category: "Web Design",
  },
  {
    title: "Neural Interface Protocol",
    description:
      "Developing next-generation human-computer interaction through advanced neural networks",
    bigImage: Bigimg1,
    category: "App Design",
  },
  {
    title: "Neural Interface Protocol",
    description:
      "Developing next-generation human-computer interaction through advanced neural networks",
    bigImage: Bigimg1,
    category: "Branding",
  },
  {
  title: "Neural Interface Protocol",
    description:
      "Developing next-generation human-computer interaction through advanced neural networks",
    bigImage: Bigimg1,
    category: "Marketing",
  },
];

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Web Design", "App Design", "Branding", "Marketing"];

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

      {/* Tab Content - Projects Grid */}
      <div className="tab-content grid grid-cols-1 sm:grid-cols-3 gap-20 mt-8">
        {filteredProjects.map((project, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[24px] shadow-lg overflow-hidden flex flex-col w-full md:w-full"
          >
          {/* Top Image */}
<div className="w-full h-[330px] md:h-[330px] overflow-hidden rounded-t-[24px]">
  <img
    src={project.bigImage}
    alt={project.title}
    className="w-full h-[330px] object-cover block rounded-b-[24px]"
  />
</div>



            {/* Content */}
            <div className="p-6 flex flex-col gap-4 ">
                <div>
                     <span className="services-badge-secondry">
                {project.category}
              </span>

                </div>
             
              {/* Title */}
              <h1 className="tab-card-heading">
                <span className="text-blue-600">
                  {project.title.split(" ")[0]}
                </span>{" "}
                {project.title.split(" ").slice(1).join(" ")}
              </h1>

              {/* Description */}
              <p className="blog-text">{project.description}</p>

              {/* Info: Date + Read Time */}
              <div className="flex items-center gap-4 text-gray-500 text-sm">
                <span className="text-[20px] font-thin flex items-center gap-2">
                  <img src={Calendar} alt="calendar" className="w-[22px] h-[22px]" />
                  Nov 15, 2025
                </span>
                <span className="text-[20px] font-thin flex items-center gap-2">
                  <img src={Clock} alt="clock" className="w-[22px] h-[22px]" />8 min read
                </span>
              </div>

                
                  <hr style={{ borderColor: "#BCBCBC" }} />
                
              <div className="flex justify-between items-center pt-2">
                <p className="blog-text">
                  Blog Write By: Sarah Chen
                </p>
                <img src={Blogarrow} alt="arrow" className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <p className="text-gray-400 col-span-full text-center py-20">
            No projects found in <strong>{activeTab}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default Tabs;
