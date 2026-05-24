import React from "react";
import { useNavigate } from "react-router-dom";
import Floatingimg from "@/assets/uil_arrow-up.svg";

import Bigimg1 from "@/assets/Bigimg1.png";
import Bigimg2 from "@/assets/Bigimg2.png";
import Bigimg3 from "@/assets/Bigimg3.png";
import Bigimg4 from "@/assets/Bigimg4.png";

import FadeIn from "@/transitions/FadeIn.tsx";
import Cardhovereffect from "@/transitions/cardhovereffect";

/**
 * Project shape — supports both:
 *  - Supabase row    (id, title, description, image_url, slug)
 *  - Hardcoded item  (title, description, bigImage)
 *
 * The component reads `image_url` first, then `bigImage`, so it
 * works whether data comes from the CMS or the local fallback.
 */
export interface Project {
  id?: number | string;
  title: string;
  description: string;
  bigImage?: string;     // local imported asset (fallback)
  image_url?: string;    // public URL from Supabase Storage
  category?: string;
  is_featured?: boolean;
  sort_order?: number;
  slug?: string;         // URL slug → /portfolio/<slug>
}

/**
 * Fallback featured-project list — exported so `portfoliosection.tsx`
 * can pass it to `useCMS` as the fallback value. As soon as rows are
 * inserted into Supabase `projects` (with is_featured=true), they take
 * over and this list is no longer rendered.
 */
export const FALLBACK_PROJECTS: Project[] = [
  {
    id: "fallback-1",
    title: "LEAP",
    description: "Tech & innovation summit — full broadcast & event execution.",
    bigImage: Bigimg1,
    slug: "leap",
  },
  {
    id: "fallback-2",
    title: "VUJA DE",
    description: "Digital experience design and brand activation campaign.",
    bigImage: Bigimg2,
    slug: "vuja-de",
  },
  {
    id: "fallback-3",
    title: "Latakoo",
    description: "Enterprise media platform — UI/UX and product engineering.",
    bigImage: Bigimg3,
    slug: "latakoo",
  },
  {
    id: "fallback-4",
    title: "Gameview",
    description: "Esports broadcast platform with custom overlays and analytics.",
    bigImage: Bigimg4,
    slug: "gameview",
  },
];

// Backwards-compat alias so older imports `import { projects }` still work.
export const projects = FALLBACK_PROJECTS;

const ProjectCardContent: React.FC<{ project: Project }> = ({ project }) => {
  const navigate = useNavigate();
  const imgSrc = project.image_url || project.bigImage || "";
  const handleClick = () => {
    if (project.slug) navigate(`/portfolio/${project.slug}`);
    else navigate("/portfolio");
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        <FadeIn delay={0.2}>
          <Cardhovereffect>
            <div
              role="button"
              tabIndex={0}
              onClick={handleClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClick();
                }
              }}
              className="glass-card gradient-border rounded-2xl relative overflow-hidden my-4 min-h-[307px] md:h-[307px] w-full p-4 md:p-6 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 md:gap-6 items-center cursor-pointer"
            >
              {/* Background Image */}
              <div
                className="absolute bottom-0 md:right-0 md:translate-x-6 z-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${imgSrc})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center bottom",
                  backgroundSize: "contain",
                  width: "100%",
                  maxWidth: "400px",
                  height: "200px",
                }}
              />

              <div className="flex flex-col justify-between h-full relative z-10">
                <div className="flex flex-col gap-3 md:gap-[30px] pt-2 md:pt-[10px]">
                  <span className="badge">Featured Project</span>
                  <h2 className="recentproject-title">{project.title}</h2>
                </div>
                <p className="mt-2 md:mt-2">{project.description}</p>
              </div>

              <div className="flex flex-col items-end justify-start space-y-2 md:space-y-4 relative z-10">
                <img src={Floatingimg} alt={project.title} className="floating-img" />
              </div>
            </div>
          </Cardhovereffect>
        </FadeIn>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden">
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
          className="glass-card gradient-border rounded-2xl relative overflow-hidden my-4 px-4 pt-6 flex flex-col gap-4 cursor-pointer"
        >
          <div className="flex flex-col gap-2 relative">
            <span className="badge">Featured Project</span>
            <h2 className="recentproject-title">{project.title}</h2>
            <p className="mt-1">{project.description}</p>
            <img src={Floatingimg} alt={project.title} className="absolute top-6 right-2 w-13 h-13" />
          </div>
          <div className="relative flex justify-center mt-2">
            <img src={imgSrc} alt={project.title} className="w-full max-w-[500px] h-auto object-contain" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectCardContent;
