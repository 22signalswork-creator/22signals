import React from "react";
import Floatingimg from "@/assets/uil_arrow-up.svg";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";
import {
  VisualDigital,
  VisualCreative,
  VisualBroadcast,
  VisualManufacturing,
  VisualOutsourcing,
  VisualGame,
} from "./service-visuals.tsx";

export interface Project {
  title: string;
  category:
    | "Digital & AI"
    | "Creative & Marketing"
    | "Broadcasting & Esports"
    | "Manufacturing"
    | "Outsourcing"
    | "Game Development";
  subtitle: string;
  description: string;
  details: string;
  visual: React.ReactNode;
}

export const projects: Project[] = [
  {
    title: "Digital Solutions & Infrastructure",
    category: "Digital & AI",
    subtitle:
      "Building resilient digital ecosystems that dominate search, streamline operations, and scale without friction.",
    description:
      "Cutting-edge digital infrastructure designed to future-proof your business. Whether you are a startup needing dynamic applications or an enterprise requiring robust backend systems, we build for performance, visibility, and automation.",
    details: `<b>Web Architecture & Development:</b> High-performance MERN, MEAN, and Next.js stacks for lightning-fast SSR.<br/><br/><b>Next-Gen Search Visibility:</b> GEO and AEO so your brand dominates AI-driven platforms.<br/><br/><b>Applied AI & Process Automation:</b> Multi-agentic AI tools, predictive analytics, custom chatbots.<br/><br/><b>IoT Software:</b> Real-time monitoring and smart industrial automation.`,
    visual: <VisualDigital />,
  },
  {
    title: "Creative & Marketing Solutions",
    category: "Creative & Marketing",
    subtitle:
      "Bridging the gap between aesthetic excellence and measurable conversion.",
    description:
      "We don't just create content — we create comprehensive campaigns. Translating your brand vision into visually compelling assets distributed through high-converting marketing channels.",
    details: `<b>End-to-End Marketing (SMM & Paid Media):</b> Full-funnel digital marketing strategies for max ROI.<br/><br/><b>Visual & UI/UX Design:</b> Captivating, human-centered design that builds trust.<br/><br/><b>Motion & Immersive Media:</b> Dynamic motion graphics, video editing, immersive 2D/3D animations.`,
    visual: <VisualCreative />,
  },
  {
    title: "Broadcasting & Esports Solutions",
    category: "Broadcasting & Esports",
    subtitle:
      "Flawless live execution and strategic access to the elusive youth demographic.",
    description:
      "Top-tier broadcast production for high-stakes digital events. Deep roots in gaming bridge the gap between global brands and the highly engaged esports demographic.",
    details: `<b>Broadcasting Solutions:</b> End-to-end online broadcast management — live direction, dynamic overlays, broadcast intervals.<br/><br/><b>Esports & Tournament Management:</b> Online and offline tournaments, gaming-focused content, talent scouting.`,
    visual: <VisualBroadcast />,
  },
  {
    title: "Global Manufacturing Solutions",
    category: "Manufacturing",
    subtitle: "Scaling physical product lines without bleeding margins.",
    description:
      "We optimize supply chains by leveraging an extensive international network across Pakistan and China — two of the world's most competitive production hubs.",
    details: `<b>Production Capabilities:</b> Custom merchandise, apparel, shoes, sportswear, accessories.<br/><br/><b>Supply Chain Optimization:</b> Mass production runs to highly customized batch solutions.<br/><br/><b>The Impact:</b> Strict quality control + fast turnarounds = 30-60% product cost reductions.`,
    visual: <VisualManufacturing />,
  },
  {
    title: "Staff Augmentation",
    category: "Outsourcing",
    subtitle: "Building your global backend office with built-in management.",
    description:
      "Top-tier global talent at a fraction of the cost. Scale operations rapidly, maintain high work output, significantly reduce overhead — without the management headaches.",
    details: `<b>Tech & IT:</b> Software developers, AI specialists, data analysts, UI/UX designers.<br/><br/><b>Creative & Marketing:</b> SEO specialists, content strategists, animators, project managers.<br/><br/><b>Support & Finance:</b> Virtual assistants, accountants, bookkeepers.<br/><br/><b>The Management Edge:</b> A dedicated supervisor at no extra cost.`,
    visual: <VisualOutsourcing />,
  },
  {
    title: "Game Development",
    category: "Game Development",
    subtitle: "Immersive gaming experiences built at highly competitive rates.",
    description:
      "Operating from Pakistan, a tech hub producing 30,000+ software engineers annually. Direct access to top-tier developers, 3D modelers, and animators.",
    details: `<b>Comprehensive Development:</b> End-to-end mobile and console games, 2D/3D, AR/VR.<br/><br/><b>Next-Gen Gaming:</b> AI-driven NPCs and blockchain models (NFTs & Play-to-Earn).<br/><br/><b>The Impact:</b> Up to 60% savings vs North American/European markets.`,
    visual: <VisualGame />,
  },
];

const ProjectCardContent: React.FC<{
  project: Project;
  onSelect?: (project: Project) => void;
  isSelected?: boolean;
  disabled?: boolean;
}> = ({ project, onSelect, isSelected = false, disabled = false }) => {
  const gradientBg =
    "linear-gradient(98.35deg, #325FEC -98.47%, #050A18 8%, #050A18 50%, #1a3392 145.86%)";

  return (
    <>
      {/* Desktop */}
      <FadeIn>
        <Cardhovereffect>
          <div
            className={`glass-card rounded-2xl relative overflow-hidden my-2 group min-h-[280px] h-[300px] w-full p-5 md:p-6 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-5 items-stretch hidden md:grid ${
              disabled ? "opacity-40 pointer-events-none" : "cursor-pointer"
            } ${isSelected ? "ring-2 ring-blue-400" : ""}`}
            onClick={() => !disabled && onSelect?.(project)}
            style={{ background: gradientBg, border: "1px solid rgba(80,140,255,0.2)" }}
          >
            <div className="flex flex-col justify-between h-full relative z-10 py-2">
              <div className="flex flex-col gap-3">
                <span className="badge">{project.category}</span>
                <h2 className="recentproject-title text-[24px] md:text-[26px] leading-tight">
                  {project.title}
                </h2>
                <p className="text-[13px] text-blue-200/85 leading-relaxed">
                  {project.subtitle}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/50">
                  Service Pillar
                </span>
                <img src={Floatingimg} alt="" className="w-9 h-9 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Right: branded visual (no random photos) */}
            <div className="relative h-full min-h-[220px]">
              {project.visual}
            </div>
          </div>
        </Cardhovereffect>
      </FadeIn>

      {/* Mobile */}
      <div className="block md:hidden">
        <FadeIn>
          <Cardhovereffect>
            <div
              className={`glass-card rounded-2xl relative overflow-hidden my-3 px-4 pt-5 pb-4 flex flex-col gap-4 ${
                disabled ? "opacity-40 pointer-events-none" : "cursor-pointer"
              } ${isSelected ? "ring-2 ring-blue-400" : ""}`}
              onClick={() => !disabled && onSelect?.(project)}
              style={{ background: gradientBg, border: "1px solid rgba(80,140,255,0.2)" }}
            >
              <div className="flex flex-col gap-2">
                <span className="badge">{project.category}</span>
                <h2 className="recentproject-title text-[22px]">{project.title}</h2>
                <p className="text-sm text-blue-200/85">{project.subtitle}</p>
                <p className="mt-1 text-white/80 text-sm">{project.description}</p>
                {isSelected && (
                  <div
                    className="mt-2 text-xs text-white/70 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: project.details }}
                  />
                )}
              </div>
              <div className="relative w-full h-[180px]">{project.visual}</div>
            </div>
          </Cardhovereffect>
        </FadeIn>
      </div>
    </>
  );
};

export default ProjectCardContent;
