  import React from "react";
import Floatingimg from "@/assets/uil_arrow-up.svg";
import Bigimg1 from "@/assets/Bigimg1.png";
import Bigimg2 from "@/assets/Bigimg2.png";
import Bigimg3 from "@/assets/Bigimg3.png";
import Bigimg4 from "@/assets/Bigimg4.png";

export interface Project {
  title: string;
  description: string;
  bigImage: string ;
  category: "Web Design" | "App Design" | "Branding" | "Marketing";
}

export const projects: Project[] = [
  {
    title: "MStore",
    description: "Mangcoding is a biggest company in Indonesia, who provides the...",
    bigImage: Bigimg1,
    category: "Web Design",
  },
  {
    title: "Beauty",
    description: "Mangcoding is a biggest company in Indonesia, who provides the...",
    bigImage: Bigimg2,
    category: "App Design",
  },
  {
    title: "Jual",
    description: "Mangcoding is a biggest company in Indonesia, who provides the...",
    bigImage: Bigimg3,
    category: "Branding",
  },
  {
    title: "MangStore",
    description: "Mangcoding is a biggest company in Indonesia, who provides the...",
    bigImage: Bigimg4,
    category: "Marketing",
  },
];


  const ProjectCardContent: React.FC<{ project: Project }> = ({ project }) => {
     const gradientBg =
    "linear-gradient(98.35deg, #325FEC -98.47%, #000000 3.34%, #000000 46.77%, #325FEC 145.86%)";

    return (
      <>
        {/* Desktop View */}
      <div className="glass-card  rounded-2xl relative overflow-hidden my-4 group 
        min-h-[307px] h-auto md:h-[307px] w-full md:mr-4 p-4 md:p-6 
        grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 md:gap-6 items-center hidden md:grid"
        style={{ background: gradientBg }}>

        <div
          className="absolute bottom-0  md:left-auto md:translate-x-6 md:right-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${project.bigImage})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center bottom",
            backgroundSize: "contain",
            width: "100%",
            maxWidth: "400px",
            height: "200px",
          }}
        />

        <div className="flex flex-col justify-between h-full relative z-10">
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-[30px] pt-2 md:pt-[10px]">
            <span className="badge">Development Project</span>
            <h2 className="recentproject-title">{project.title}</h2>
          </div>

          <p className="mt-2 sm:mt-3 md:mt-2">{project.description}</p>
        </div>

        <div className="flex flex-col items-end justify-start space-y-2 md:space-y-4 relative z-10">
          <img src={Floatingimg} alt={project.title} className="floating-img" />
        </div>
      </div>


  {/* Mobile View */}
    <div className="block md:hidden">
    <div className="glass-card  rounded-2xl relative overflow-hidden my-4 px-4 pt-6 flex flex-col gap-4"
    style={{ background: gradientBg }}>
      {/* Text */}
      <div className="flex flex-col gap-2 ">
        <span className="badge">Development Project</span>
        <h2 className="recentproject-title">{project.title}</h2>
        <p className="mt-1">{project.description}</p>
        <img
          src={Floatingimg}
          alt={project.title}
          className="absolute top-6 right-2 w-13 h-13"
        />
      </div>

      {/* Image + Floating Icon */}
      <div className="relative flex justify-center mt-2">
        <img
          src={project.bigImage}
          alt={project.title}
          className="w-full max-w-[500px] h-auto object-contain "
        />
        
      </div>
    </div>
  </div>

            </>
    );
  };

  export default ProjectCardContent;
