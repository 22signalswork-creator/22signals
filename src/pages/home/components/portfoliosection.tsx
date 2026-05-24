import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "@/components/CustomButton.js";
import ProjectCardContent, {
  FALLBACK_PROJECTS,
  type Project,
} from "./projectcard.tsx";
import Logo22 from "@/assets/22signals-logo.png";
import Portfoliobg from "@/assets/footerbg.png";
import "../home.css";
import "@/index.css";
import Union from "@/assets/Union.svg";
import Icon from "@/assets/Colon.png";
import Colons from "@/assets/Colons.png";
import ShadowL from "@/assets/ShadowL.png";
import ShadowR from "@/assets/ShadowR.png";
import test1 from "@/assets/test1.jpg";
import test2 from "@/assets/test2.jpg";
import test3 from "@/assets/test3.jpg";
import test5 from "@/assets/test5.jpg";

import Slider from "react-slick";
import FadeIn from "@/transitions/FadeIn.tsx";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";
import { useCMS } from "@/hooks/useCMS";

interface Testimonial {
  id?: number | string;
  name: string;
  role: string;
  text: string;
  image?: string;       // local fallback (imported asset)
  image_url?: string;   // public URL from Supabase Storage
  sort_order?: number;
  is_active?: boolean;
}

// Fallback testimonials — used when the `testimonials` table is empty
const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Nugraha",
    role: "Founder, Mangcoding",
    text: "22 Signals delivered our enterprise platform on time with flawless execution. Their dedicated supervisor model is a game changer for outsourcing.",
    image: test1,
  },
  {
    id: "t2",
    name: "Alex Jounky",
    role: "Founder, Robs",
    text: "We scaled marketing, dev and broadcast all through one team. Cut overhead by half and shipped twice as fast.",
    image: test2,
  },
  {
    id: "t3",
    name: "Chelsia Alexy",
    role: "Founder, Frank",
    text: "Their team handled everything from product UI to ad campaigns. The quality and speed are unmatched.",
    image: test3,
  },
  {
    id: "t4",
    name: "Samuel Abey",
    role: "Director, Acme Co.",
    text: "From AI automation to esports broadcast, 22 Signals brings depth across every vertical we needed.",
    image: test5,
  },
  {
    id: "t5",
    name: "Nugraha",
    role: "Founder, Mangcoding",
    text: "A truly integrated partner — strategy, design, and engineering executed under one roof.",
    image: test1,
  },
  {
    id: "t6",
    name: "Alex Jounky",
    role: "Founder, Robs",
    text: "World-class delivery with global manufacturing know-how that saved us 40%+ on production.",
    image: test2,
  },
];

const PortfolioSection = () => {
  const navigate = useNavigate();
  // Reactive isMobile — was being calculated once at module load, which
  // meant if the page loaded as desktop and then user resized / opened
  // dev-tools mobile mode, the slider stayed on its desktop layout
  // forever. Now it updates whenever the viewport changes.
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Live data from Supabase, falls back to hardcoded lists if tables are empty
  const { data: testimonials } = useCMS<Testimonial>("testimonials", {
    filter: { is_active: true },
    orderBy: "sort_order",
    fallback: FALLBACK_TESTIMONIALS,
  });

  const { data: projects } = useCMS<Project>("projects", {
    filter: { is_featured: true },
    orderBy: "sort_order",
    fallback: FALLBACK_PROJECTS,
  });

  const projectSliderSettings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: isMobile ? 1 : 2,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    adaptiveHeight: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  // 4 testimonials shown at a time, arrows to scroll for more
  const testimonialSliderSettings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: isMobile ? 1 : 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3500,
    adaptiveHeight: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const getDelay = (index: number) => 0.1 + (index % 4) * 0.15;

  return (
    <div className="relative w-full bg-[#000202] text-white pt-2 allow-internal-scroll overflow-hidden">
      {/* === PROVEN RESULTS FIRST (per brief) === */}
      <div
        className="relative w-full bg-[#000202] pb-16 pt-12"
        style={{
          backgroundImage: `url(${Portfoliobg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <img src={ShadowL} alt="" className="absolute left-0 top-0 h-full object-contain opacity-60 pointer-events-none" />
        <img src={Colons} alt="" className="absolute right-0 top-0 h-[286px] w-[423px] opacity-100 pointer-events-none" />
        <img src={ShadowR} alt="" className="absolute right-0 top-0 h-full object-contain opacity-80 pointer-events-none" />

        <section className="container mx-auto px-4 md:px-8 relative z-10 py-2">
          <FadeIn direction="down">
            <h2 className="recentproject-title text-2xl md:text-3xl font-light text-blue-400 mb-6 text-center md:text-left flex items-center justify-center md:justify-start">
              Proven Results
              <img src={Union} alt="Union" className="ml-2 inline-block w-4 h-4" />
            </h2>
          </FadeIn>

          <div className="relative">
            <Slider {...testimonialSliderSettings} className="w-full">
              {testimonials.map((item, idx) => (
                <div key={item.id ?? idx} className="px-2">
                  <FadeIn delay={getDelay(idx)}>
                    <Cardhovereffect>
                      <div className="glass-card-2 testimonial-border bg-gray-900/40 p-6 rounded-xl text-gray-300 transition-all flex flex-col gap-3 md:gap-4 min-h-[210px] h-auto border border-white/5">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image_url || item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-full object-cover border border-blue-500/30"
                            />
                            <div className="flex flex-col">
                              <div className="testimonial-text font-bold text-white">{item.name}</div>
                              <div className="testimonial-text-role text-xs text-blue-400">{item.role}</div>
                            </div>
                          </div>
                          <img src={Icon} alt="Quote" className="w-8 opacity-60" />
                        </div>
                        <p className="testimonial-text mt-2 text-sm md:text-base leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </Cardhovereffect>
                  </FadeIn>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      </div>

      {/* === FEATURED PROJECTS (one-liner with arrows; bg uses 22 Signals logo) === */}
      <div
        className="relative pt-0 pb-12"
        style={{
          backgroundImage: `url(${Portfoliobg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <img src={ShadowL} alt="" className="absolute left-0 top-0 h-full object-contain opacity-60 pointer-events-none" />

        {/* Replaced bg "BrandMark" logo with 22 Signals logo, faded */}
        <img
          src={Logo22}
          alt=""
          aria-hidden
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[420px] md:w-[680px] opacity-[0.05] pointer-events-none select-none"
          draggable={false}
        />

        <section className="container mx-auto px-4 md:px-8 relative z-10 pb-6">
          <FadeIn direction="up">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h2 className="recentproject-title text-2xl md:text-3xl font-light text-blue-400 text-center md:text-left flex items-center">
                Featured Projects
                <img src={Union} alt="Union" className="ml-2 inline-block w-4 h-4" />
              </h2>
              <div className="mt-4 md:mt-0">
                <MyButton text="ALL PORTFOLIO" variant="primary" onClick={() => navigate("/portfolio")} />
              </div>
            </div>
          </FadeIn>

          <div className="relative">
            <Slider {...projectSliderSettings} className="w-full">
              {projects.map((project, idx) => (
                <div key={project.id ?? idx} className="px-2">
                  <FadeIn delay={0.1 + idx * 0.2}>
                    <ProjectCardContent project={project} />
                  </FadeIn>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PortfolioSection;
