  import React from "react";
import Floatingimg from "@/assets/uil_arrow-up.svg";
import Bigimg1 from "@/assets/Bigimg1.png";
import Bigimg2 from "@/assets/Bigimg2.png";
import Bigimg3 from "@/assets/Bigimg3.png";
import Bigimg4 from "@/assets/Bigimg4.png";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx"

export interface Project {
  title: string;
  category: "Digital & AI" | "Creative & Marketing" | "Broadcasting & Esports" | "Manufacturing" | "Outsourcing" | "Game Development";
  subtitle: string;
  description: string;
  details: string;
  bigImage: string;
}

export const projects: Project[] = [
  {
    title: "Digital Solutions & Infrastructure",
    category: "Digital & AI",
    subtitle: "Building resilient digital ecosystems that dominate search, streamline operations, and scale without friction.",
    description: "We deliver cutting-edge digital infrastructure designed to future-proof your business. Whether you are a startup needing dynamic applications or an enterprise requiring robust backend systems, we build for performance, visibility, and automation.",
details: `<b>Web Architecture & Development:</b> High-performance, SEO-optimized development using MERN, MEAN, and Next.js stacks for lightning-fast server-side rendering and flawless user experiences.<br /><br /><b>Next-Gen Search Visibility:</b> We go beyond traditional SEO. Our strategies incorporate Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) to ensure your brand dominates both traditional search results and AI-driven platforms.<br /><br /><b>Applied AI & Process Automation:</b> We eliminate operational bottlenecks by building intelligent systems. From multi-agentic AI tools that automate complex workflows to predictive analytics and custom chatbots, we optimize your business processes for maximum efficiency.<br /><br /><b>IoT Software:</b> Real-time monitoring and smart industrial automation that connects devices for optimized performance and data-driven insights.<br /><br /><b>End-to-End Marketing (SMM & Paid Media):</b> Full-funnel digital marketing strategies. We manage comprehensive Social Media Marketing (SMM) and data-driven Paid Ad campaigns designed to maximize ROI, capture market share, and drive aggressive growth.<br /><br /><b>Visual & UI/UX Design:</b> Captivating, human-centered UI/UX design that builds trust and guides users seamlessly. Supported by professional graphic design, custom illustrations, and physical packaging design.<br /><br /><b>Motion & Immersive Media:</b> Dynamic motion graphics, video editing, and immersive 2D/3D animations that elevate your brand storytelling and engage modern audiences.`,
    bigImage: Bigimg1,
  },
  {
    title: "Creative & Marketing Solutions",
    category: "Creative & Marketing",
    subtitle: "Bridging the gap between aesthetic excellence and measurable conversion.",
    description: "In a saturated digital landscape, we don't just create content, we create comprehensive campaigns that leave a lasting impact. We translate your brand vision into visually compelling assets and distribute them through high-converting marketing channels.",
details: `<b>End-to-End Marketing (SMM & Paid Media):</b> Full-funnel digital marketing strategies. We manage comprehensive Social Media Marketing (SMM) and data-driven Paid Ad campaigns designed to maximize ROI, capture market share, and drive aggressive growth.<br /><br /><b>Visual & UI/UX Design:</b> Captivating, human-centered UI/UX design that builds trust and guides users seamlessly. Supported by professional graphic design, custom illustrations, and physical packaging design.<br /><br /><b>Motion & Immersive Media:</b> Dynamic motion graphics, video editing, and immersive 2D/3D animations that elevate your brand storytelling and engage modern audiences.`,    bigImage: Bigimg2,
  },
  {
    title: "Broadcasting & Esports Solutions",
    category: "Broadcasting & Esports",
    subtitle: "Flawless live execution and strategic access to the elusive youth demographic.",
    description: "We provide top-tier broadcast production tailored for high-stakes digital events. As a secondary pillar, our deep roots in the gaming industry allow us to bridge the gap between global brands and the highly engaged esports demographic.",
details: `<b>Broadcasting Solutions:</b> End-to-end online broadcast management. We handle live event direction, dynamic overlay productions, and seamless broadcast interval (commercial) management to ensure a premium viewing experience.<br /><br /><b>Esports & Tournament Management:</b> Comprehensive management of online and offline tournaments. We execute gaming-focused content strategies and handle talent scouting, allowing brands to tap into a booming market without the exorbitant costs of traditional sports advertising.`,    bigImage: Bigimg3,
  },
  {
    title: "Global Manufacturing Solutions",
    category: "Manufacturing",
    subtitle: "Scaling physical product lines without bleeding margins.",
    description: "We help businesses optimize their supply chains by leveraging an extensive international network. By outsourcing manufacturing to Pakistan and China, two of the world's most competitive production hubs, we deliver high-quality physical products while radically improving your profit margins.",
details: `<b>Production Capabilities:</b> Specialized manufacturing across various industries, with a primary focus on custom merchandise, apparel, shoes, sportswear, and accessories.<br /><br /><b>Supply Chain Optimization:</b> We handle everything from large-scale mass production runs to highly customized, specialized batch solutions.<br /><br /><b>The Impact:</b> Strict quality control integrated with fast turnaround times, resulting in overall product cost reductions of 30-60%.`,
    bigImage: Bigimg4,
  },
  {
    title: "Staff Augmentation",
    category: "Outsourcing",
    subtitle: "Building your global backend office with built-in management.",
    description: "We assist businesses in accessing top-tier global talent at a fraction of the cost. Scale your operations rapidly, maintain a high level of work output, and significantly reduce overhead expenses—all without the usual management headaches of remote teams.",
details: `<b>The Talent Arsenal: Tech & IT:</b> Software developers, AI specialists, data analysts, and UI/UX designers.<br /><br /><b>Creative & Marketing:</b> SEO specialists, content strategists, animators, and project managers.<br /><br /><b>Support & Finance:</b> Virtual assistants, accountants, bookkeepers, and real estate agents.<br /><br /><b>The Management Edge:</b> Unlike traditional outsourcing, we provide a dedicated supervisor at no additional cost. This ensures you have a single Point of Contact (POC) to efficiently manage your customized team, streamlining communication and guaranteeing productivity.`,
    bigImage: Bigimg1,
  },
  {
    title: "Game Development",
    category: "Game Development",
    subtitle: "Immersive gaming experiences built at highly competitive rates.",
    description: "Bring your gaming visions to life. Operating out of Pakistan, a rapidly growing tech hub producing over 30,000 software engineers annually, we give you direct access to top-tier developers, 3D modelers, and animators.",
details: `<b>Comprehensive Development:</b> End-to-end creation of mobile and console hits, immersive 2D/3D game design, and AR/VR experiences.<br /><br /><b>Next-Gen Gaming:</b> Expertise in integrating AI-driven NPCs and blockchain gaming models (NFTs & Play-to-Earn).<br /><br /><b>The Impact:</b> Our streamlined development pipelines ensure faster prototyping and deployment, yielding up to 60% savings on development expenses compared to North American or European markets, without compromising on quality.`,
    bigImage: Bigimg2,
  },
];


  const ProjectCardContent: React.FC<{
    project: Project;
    onSelect?: (project: Project) => void;
    isSelected?: boolean;
    disabled?: boolean;
  }> = ({ project, onSelect, isSelected = false, disabled = false }) => {
     const gradientBg =
    "linear-gradient(98.35deg, #325FEC -98.47%, #000000 3.34%, #000000 46.77%, #325FEC 145.86%)";

    return (
      <>
        {/* Desktop View */}
        <FadeIn>
          <Cardhovereffect>
      <div className={`glass-card rounded-2xl relative overflow-hidden my-4 group min-h-[307px] h-auto md:h-[307px] w-full md:mr-4 p-4 md:p-6 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 md:gap-6 items-center hidden md:grid ${disabled ? "opacity-40 pointer-events-none" : "cursor-pointer"} ${isSelected ? "ring-4 ring-blue-400" : ""}`}
        onClick={() => !disabled && onSelect?.(project)}
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
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-[30px] pt-2 md:pt-[10px]">
            <span className="badge">{project.category}</span>
            <h2 className="recentproject-title">{project.title}</h2>
            <p className="text-sm text-white">{project.subtitle}</p>
          </div>

        </div>

        <div className="flex flex-col items-end justify-start space-y-2 md:space-y-4 relative z-10">
          <img src={Floatingimg} alt={project.title} className="floating-img" />
        </div>
      </div>
      </Cardhovereffect>
      </FadeIn>


  {/* Mobile View */}
    <div className="block md:hidden">
      <FadeIn>
          <Cardhovereffect>
    <div className={`glass-card rounded-2xl relative overflow-hidden my-4 px-4 pt-6 flex flex-col gap-4 ${disabled ? 'opacity-40 pointer-events-none' : 'cursor-pointer'} ${isSelected ? 'ring-4 ring-blue-400' : ''}`}
      onClick={() => !disabled && onSelect?.(project)}
      style={{ background: gradientBg }}>
      {/* Text */}
      <div className="flex flex-col gap-2 ">
        <span className="badge">{project.category}</span>
        <h2 className="recentproject-title">{project.title}</h2>
        <p className="text-sm text-blue-200">{project.subtitle}</p>
        <p className="mt-1 text-black">{project.description}</p>
        {isSelected && (
          <div className="mt-2 text-xs text-black leading-relaxed" dangerouslySetInnerHTML={{ __html: project.details }} />
        )}
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

    </Cardhovereffect>
     </FadeIn>
  </div>

            </>
    );
  };

  export default ProjectCardContent;
