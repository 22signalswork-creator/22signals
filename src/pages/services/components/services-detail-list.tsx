import React, { useState } from "react";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import {
  VisualDigital,
  VisualCreative,
  VisualBroadcast,
  VisualManufacturing,
  VisualOutsourcing,
  VisualGame,
} from "./service-visuals.tsx";
import { useCMS } from "@/hooks/useCMS";
import { usePageContent } from "@/hooks/usePageContent";

interface Bullet {
  label: string;
  text: string;
}

interface ServicePillar {
  id?: string;
  pillar_number: string;
  title: string;
  tagline: string;
  body: string;
  bullets: Bullet[] | string;
  visual_key?: string;
  sort_order?: number;
  is_active?: boolean;
}

const VISUAL_MAP: Record<string, React.ReactNode> = {
  digital: <VisualDigital />,
  creative: <VisualCreative />,
  broadcast: <VisualBroadcast />,
  manufacturing: <VisualManufacturing />,
  outsourcing: <VisualOutsourcing />,
  game: <VisualGame />,
};

const FALLBACK_PILLARS: ServicePillar[] = [
  {
    id: "f1",
    pillar_number: "01",
    title: "Digital Solutions & Infrastructure",
    tagline:
      "Building resilient digital ecosystems that dominate search, streamline operations, and scale without friction.",
    body:
      "We deliver cutting-edge digital infrastructure designed to future-proof your business. Whether you are a startup needing dynamic applications or an enterprise requiring robust backend systems, we build for performance, visibility, and automation.",
    bullets: [
      { label: "Web Architecture & Development", text: "High-performance, SEO-optimized development using MERN, MEAN, and Next.js stacks for lightning-fast server-side rendering and flawless user experiences." },
      { label: "Next-Gen Search Visibility", text: "We go beyond traditional SEO. Our strategies incorporate Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) to ensure your brand dominates both traditional search results and AI-driven platforms." },
      { label: "Applied AI & Process Automation", text: "We eliminate operational bottlenecks by building intelligent systems. From multi-agentic AI tools that automate complex workflows to predictive analytics and custom chatbots, we optimize your business processes for maximum efficiency." },
      { label: "IoT Software", text: "Real-time monitoring and smart industrial automation that connects devices for optimized performance and data-driven insights." },
    ],
    visual_key: "digital",
  },
  {
    id: "f2",
    pillar_number: "02",
    title: "Creative & Marketing Solutions",
    tagline: "Bridging the gap between aesthetic excellence and measurable conversion.",
    body:
      "In a saturated digital landscape, we don't just create content, we create comprehensive campaigns that leave a lasting impact. We translate your brand vision into visually compelling assets and distribute them through high-converting marketing channels.",
    bullets: [
      { label: "End-to-End Marketing (SMM & Paid Media)", text: "Full-funnel digital marketing strategies. We manage comprehensive Social Media Marketing (SMM) and data-driven Paid Ad campaigns designed to maximize ROI, capture market share, and drive aggressive growth." },
      { label: "Visual & UI/UX Design", text: "Captivating, human-centered UI/UX design that builds trust and guides users seamlessly. Supported by professional graphic design, custom illustrations, and physical packaging design." },
      { label: "Motion & Immersive Media", text: "Dynamic motion graphics, video editing, and immersive 2D/3D animations that elevate your brand storytelling and engage modern audiences." },
    ],
    visual_key: "creative",
  },
  {
    id: "f3",
    pillar_number: "03",
    title: "Broadcasting & Esports Solutions",
    tagline: "Flawless live execution and strategic access to the elusive youth demographic.",
    body:
      "We provide top-tier broadcast production tailored for high-stakes digital events. As a secondary pillar, our deep roots in the gaming industry allow us to bridge the gap between global brands and the highly engaged esports demographic.",
    bullets: [
      { label: "Broadcasting Solutions", text: "End-to-end online broadcast management. We handle live event direction, dynamic overlay productions, and seamless broadcast interval (commercial) management to ensure a premium viewing experience." },
      { label: "Esports & Tournament Management", text: "Comprehensive management of online and offline tournaments. We execute gaming-focused content strategies and handle talent scouting, allowing brands to tap into a booming market without the exorbitant costs of traditional sports advertising." },
    ],
    visual_key: "broadcast",
  },
  {
    id: "f4",
    pillar_number: "04",
    title: "Staff Augmentation",
    tagline: "Building your global backend office with built-in management.",
    body:
      "We assist businesses in accessing top-tier global talent at a fraction of the cost. Scale your operations rapidly, maintain a high level of work output, and significantly reduce overhead expenses—all without the usual management headaches of remote teams.",
    bullets: [
      { label: "The Talent Arsenal — Tech & IT", text: "Software developers, AI specialists, data analysts, and UI/UX designers." },
      { label: "Creative & Marketing", text: "SEO specialists, content strategists, animators, and project managers." },
      { label: "Support & Finance", text: "Virtual assistants, accountants, bookkeepers, and real estate agents." },
      { label: "The Management Edge", text: "Unlike traditional outsourcing, we provide a dedicated supervisor at no additional cost. This ensures you have a single Point of Contact (POC) to efficiently manage your customized team, streamlining communication and guaranteeing productivity." },
    ],
    visual_key: "outsourcing",
  },
  {
    id: "f5",
    pillar_number: "05",
    title: "Global Manufacturing Solutions",
    tagline: "Scaling physical product lines without bleeding margins.",
    body:
      "We help businesses optimize their supply chains by leveraging an extensive international network. By outsourcing manufacturing to Pakistan and China, two of the world's most competitive production hubs, we deliver high-quality physical products while radically improving your profit margins.",
    bullets: [
      { label: "Production Capabilities", text: "Specialized manufacturing across various industries, with a primary focus on custom merchandise, apparel, shoes, sportswear, and accessories." },
      { label: "Supply Chain Optimization", text: "We handle everything from large-scale mass production runs to highly customized, specialized batch solutions." },
      { label: "The Impact", text: "Strict quality control integrated with fast turnaround times, resulting in overall product cost reductions of 30-60%." },
    ],
    visual_key: "manufacturing",
  },
  {
    id: "f6",
    pillar_number: "06",
    title: "Game Development",
    tagline: "Immersive gaming experiences built at highly competitive rates.",
    body:
      "Bring your gaming visions to life. Operating out of Pakistan, a rapidly growing tech hub producing over 30,000 software engineers annually, we give you direct access to top-tier developers, 3D modelers, and animators.",
    bullets: [
      { label: "Comprehensive Development", text: "End-to-end creation of mobile and console hits, immersive 2D/3D game design, and AR/VR experiences." },
      { label: "Next-Gen Gaming", text: "Expertise in integrating AI-driven NPCs and blockchain gaming models (NFTs & Play-to-Earn)." },
      { label: "The Impact", text: "Our streamlined development pipelines ensure faster prototyping and deployment, yielding up to 60% savings on development expenses compared to North American or European markets, without compromising on quality." },
    ],
    visual_key: "game",
  },
];

const parseBullets = (b: Bullet[] | string | null | undefined): Bullet[] => {
  if (!b) return [];
  if (Array.isArray(b)) return b;
  try {
    const parsed = JSON.parse(b);
    return Array.isArray(parsed) ? (parsed as Bullet[]) : [];
  } catch {
    return [];
  }
};

const ServicesDetailList: React.FC = () => {
  const { t } = usePageContent();
  const [active, setActive] = useState(0);

  const { data: services } = useCMS<ServicePillar>("service_pillars", {
    filter: { is_active: true },
    orderBy: "sort_order",
    fallback: FALLBACK_PILLARS,
  });

  const safeActive = Math.min(active, Math.max(0, services.length - 1));
  const current = services[safeActive];
  if (!current) return null;

  const currentBullets = parseBullets(current.bullets);
  const currentVisual =
    (current.visual_key && VISUAL_MAP[current.visual_key]) || <VisualDigital />;

  // Map a pillar's visual_key to the corresponding /services/:slug detail page.
  // Falls back to undefined (hides the Read more link) if no match.
  const VISUAL_TO_SLUG: Record<string, string> = {
    digital: "digital-solutions",
    creative: "creative-solutions",
    broadcast: "broadcasting-esports",
    manufacturing: "global-manufacturing",
    outsourcing: "managed-services",
    game: "digital-solutions",
  };
  const currentSlug = current.visual_key
    ? VISUAL_TO_SLUG[current.visual_key]
    : undefined;

  return (
    <section className="container relative py-20 md:py-28 overflow-hidden">
      <FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 md:gap-16 items-end mb-14 md:mb-20">
          <div>
            <div
              className="inline-block px-4 py-1.5 rounded-full text-[10px] tracking-[0.3em] uppercase mb-5"
              style={{
                border: "1px solid rgba(50,95,236,0.4)",
                color: "rgba(50,95,236,0.95)",
              }}
            >
              {t("services_pillars_eyebrow", "The Full Spectrum")}
            </div>
            <RisingText end="80%">
              <h2
                className="text-4xl md:text-[64px] leading-[1.0]"
                style={{
                  color: "#0A1530",
                  background: "none",
                  WebkitTextFillColor: "#0A1530",
                  backgroundClip: "unset",
                  WebkitBackgroundClip: "unset",
                }}
              >
                {t("services_pillars_heading_part1", "Refined")}{" "}
                <span style={{ color: "#325FEC", WebkitTextFillColor: "#325FEC" }}>
                  {t("services_pillars_heading_part2", "Execution.")}
                </span>
              </h2>
            </RisingText>
          </div>
          <p className="text-black/65 text-base md:text-lg">
            {t(
              "services_pillars_subtitle",
              "Six core service pillars. Click any to see the full breakdown of what we deliver, how we deliver it, and the impact you can expect."
            )}
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 md:gap-8 items-stretch">
          <div className="flex flex-col gap-3">
            {services.map((s, i) => {
              const isActive = safeActive === i;
              return (
                <button
                  key={s.id ?? s.pillar_number}
                  onClick={() => setActive(i)}
                  className={`text-left rounded-2xl p-5 md:p-6 transition-all duration-300 ${
                    isActive
                      ? "shadow-[0_10px_30px_-10px_rgba(50,95,236,0.4)]"
                      : "hover:bg-white/60"
                  }`}
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, #325FEC 0%, #1a3392 100%)"
                      : "#ffffff",
                    border: isActive
                      ? "1px solid rgba(80,140,255,0.3)"
                      : "1px solid rgba(10,21,48,0.08)",
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className="text-[10px] tracking-[0.3em] uppercase"
                      style={{ color: isActive ? "rgba(255,255,255,0.7)" : "rgba(50,95,236,0.7)" }}
                    >
                      Pillar {s.pillar_number}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-2">
                    <span
                      className="text-base md:text-lg font-medium"
                      style={{ color: isActive ? "#ffffff" : "#0A1530" }}
                    >
                      {s.title}
                    </span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isActive ? "#fff" : "#325FEC"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ opacity: isActive ? 1 : 0.5 }}
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                </button>
              );
            })}

            <div
              className="mt-3 rounded-2xl p-6 md:p-8 relative overflow-hidden flex-1 flex flex-col justify-center"
              style={{
                background: "linear-gradient(135deg, #050A18 0%, #0E1628 60%, #1a3392 130%)",
                border: "1px solid rgba(80,140,255,0.2)",
                minHeight: "160px",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-[2px] w-8 rounded-full bg-blue-400" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-blue-300/80">
                  {t("services_cta_eyebrow", "Ready to start?")}
                </span>
              </div>
              <h3 className="text-xl md:text-[22px] mb-2 text-white font-medium leading-tight">
                {t("services_cta_title", "Let's discuss your project")}
              </h3>
              <p className="text-white/65 text-sm mb-5">
                {t("services_cta_subtitle", "Schedule a free consultation to see how we can transform your business.")}
              </p>
              <a href="/contact" className="inline-flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-400 px-5 py-2.5 text-white text-sm font-medium transition-colors w-fit">
                {t("services_cta_button", "Get started")}
                <span>{"→"}</span>
              </a>
            </div>
          </div>

          <div
            key={current.pillar_number}
            className="rounded-3xl p-6 md:p-10 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #050A18 0%, #0E1628 60%, #1a3392 130%)",
              border: "1px solid rgba(80,140,255,0.2)",
              minHeight: "560px",
            }}
          >
            <div
              className="absolute -top-6 -right-2 md:-top-8 md:-right-4 text-[140px] md:text-[200px] leading-none font-bold pointer-events-none select-none"
              style={{
                background: "linear-gradient(180deg, rgba(80,140,255,0.18) 0%, rgba(50,95,236,0) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {current.pillar_number}
            </div>

            <div className="relative z-10">
              <div className="h-[260px] md:h-[320px] mb-6 rounded-2xl overflow-hidden">
                {currentVisual}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-10 rounded-full bg-blue-400" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-blue-300/80">
                  Pillar {current.pillar_number}
                </span>
              </div>

              <h3
                className="text-2xl md:text-[32px] mb-3 leading-tight"
                style={{
                  color: "#ffffff",
                  background: "none",
                  WebkitTextFillColor: "#ffffff",
                  WebkitBackgroundClip: "unset",
                  backgroundClip: "unset",
                }}
              >
                {current.title}
              </h3>

              <p className="text-blue-300/90 italic text-sm md:text-base mb-4">
                {current.tagline}
              </p>

              <p className="text-white/75 text-sm md:text-[15px] leading-relaxed mb-6">
                {current.body}
              </p>

              <div className="space-y-3">
                {currentBullets.map((b, j) => (
                  <div key={j} className="grid grid-cols-[auto_1fr] gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 bg-blue-400 flex-shrink-0" />
                    <div className="text-sm md:text-[14px] text-white/80 leading-relaxed">
                      <span className="font-semibold text-white">{b.label}:</span>{" "}
                      {b.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Read full details link — goes to the dedicated /services/:slug page */}
              {currentSlug && (
                <a
                  href={`/services/${currentSlug}`}
                  className="inline-flex items-center gap-2 mt-7 rounded-lg bg-blue-500 hover:bg-blue-400 px-5 py-2.5 text-white text-sm font-medium transition-colors w-fit"
                >
                  Read full details
                  <span>{"→"}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
};

export default ServicesDetailList;
