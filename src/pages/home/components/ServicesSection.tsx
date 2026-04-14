import React, { useRef } from "react"; // 1. useRef add kiya
import { motion } from "framer-motion";
import gsap from "gsap"; // 2. GSAP import kiya

import DigitalSolutions from "@/assets/digitalsolutions.png";
import Framed from "@/assets/DigitalIcon.png";
import CustomButton from "@/components/CustomButton.tsx";
import SliderComponent from "@/components/Slider.tsx";
import Creative from "@/assets/creative.png";
import CreativeIcon from "@/assets/creativeicon.png";
import Stafficon from "@/assets/staffIcon.png";
import Broadcastingicon from "@/assets/broadcasticon.png";
import staffbg from "@/assets/staffbg.png";
import broadcastingbg from "@/assets/broadcastbg.png";
import slide1 from "@/assets/home-slider-logos/01_Tencent_Logo_Reverse-type.avif";
import slide2 from "@/assets/home-slider-logos/0b9273_dcfc3b20a7ba4880b55480727be12b67~mv2.jpg";
import slide8 from "@/assets/home-slider-logos/422430372_761676925980871_1742382672670991272_n.jpg";
import slide3 from "@/assets/home-slider-logos/Final Logo.png";
import slide4 from "@/assets/home-slider-logos/OutlierCreativeAgency_TMLogo_Final_FullLogo-White+Teal.png";
import slide5 from "@/assets/home-slider-logos/daraz-logo-i8P9fH3b.jpg";
import slide6 from "@/assets/home-slider-logos/e1d8f3_42c64c8e204843b193a7ed97e5b894cc~mv2.jpg";
import slide7 from "@/assets/home-slider-logos/garena-logo-0.png";
import slide13 from "@/assets/home-slider-logos/garena-red-logo-with-symbol-701751694791357ntd4cmq0yy.png";
import slide9 from "@/assets/home-slider-logos/idU5A-8HdM_logos.png";
import slide10 from "@/assets/home-slider-logos/images.png";
import slide11 from "@/assets/home-slider-logos/red-bull-logo-0.png";
import slide12 from "@/assets/home-slider-logos/xWjBhY0R_400x400.jpg";
import ScrollLine from "./ScrollLine.js";
import ScrollLineBottom from "./ScrollLineBottom.js";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx"
import Video from "./video.tsx";
import RisingText from "@/transitions/RisingText.tsx";
import ServiceCard from "./ServiceCard.tsx";
import FadeIn from "@/transitions/FadeIn.tsx";
import CompanyStatsCounts from "@/pages/work/components/CompanyStatsCounts.tsx";

const slides = [slide1, slide2, slide7, slide4, slide6, slide8, slide5, slide3, , slide13 , slide9 , slide10 , slide11 , slide12];

const ServicesSection = () => {
  return (
    <section className="container relative pb-16 px-6 md:px-12 lg:px-20 allow-internal-scroll" style={{ paddingTop: '150px' }}>
      <div className="svg-container">
        <ScrollLine />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.7fr] gap-12 items-center mb-20">
        <div>
          <RisingText>
          <h1 className="animated-gradient text-transparent text-center md:text-left">
            We translate complex challenges into tangible data driven results.
          </h1>
          </RisingText>
        </div>
        <Video />
      </div>

      

      <CompanyStatsCounts />

      {/* ROW 1: Digital & Creative */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1.3fr] gap-10 my-10">
        <FadeIn delay={1.7}>
          <Cardhovereffect>
          <ServiceCard 
            title="Digital Solutions"
            description="High-performance web development, SEO, GEO and intelligent AI systems."
            icon={Framed}
            bgImage={DigitalSolutions}
            bgColorClass="bg-[#325fec]"
            bgPosition="right -130px top 45px"
            buttonVariant="secondary"
          />
          </Cardhovereffect>
        </FadeIn>

        <FadeIn delay={1.8}>
           <Cardhovereffect>
          <ServiceCard 
            title="Creative Solutions"
            description="Social Media Management, motion graphics, and 2D/3D animations."
            icon={CreativeIcon}
            bgImage={Creative}
            titleColorClass="blue-gradient-text"
            bgPosition="right -50px top 60px"
            buttonVariant="danger"
          />
          </Cardhovereffect>
        </FadeIn>
      </div>

      {/* ROW 2: Staff & Broadcasting */}
      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_2fr] gap-10 my-10">
        <FadeIn delay={0.1}>
           <Cardhovereffect>
          <ServiceCard 
            title="Global Manufacturing"
            description="Optimize your supply chain and reduce product costs by 40-60%."
            icon={Stafficon}
            bgImage={staffbg}
            titleColorClass="blue-gradient-text"
            bgPosition="right -20px top 50px"
            buttonVariant="danger"
          />
          </Cardhovereffect>
        </FadeIn>

        <FadeIn delay={0.2}>
           <Cardhovereffect>
          <ServiceCard 
            title="Broadcasting & Esports Solutions"
            description="End-to-end online and offline tournament and broadcast management."
            icon={Broadcastingicon}
            bgImage={broadcastingbg}
            bgColorClass="bg-[#325fec]"
            bgPosition="right -5px top 50px"
            buttonVariant="secondary"
          />
          </Cardhovereffect>
        </FadeIn>
      </div>

      {/* ROW 3: Three Columns */}
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_2fr_1.2fr] gap-10 my-10 ">
        <FadeIn delay={0.3}>
           <Cardhovereffect>
          <ServiceCard 
            title="Game Development"
            description="2D/3D design, AR/VR, and blockchain gaming with up to 60% savings."
            icon={CreativeIcon}
            titleColorClass="blue-gradient-text"
            buttonVariant="danger"
          />
          </Cardhovereffect>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Cardhovereffect>
          <ServiceCard 
            title="Employee Outsourcing"
            description="Access top-tier global talent at a fraction of the cost."
            icon={Framed}
            bgImage={DigitalSolutions}
            bgColorClass="bg-[#325fec]"
            bgPosition="right -350px top 50px"
            buttonVariant="secondary"
          />
          </Cardhovereffect>
        </FadeIn>

        <FadeIn delay={0.5}>
           <Cardhovereffect>
          <ServiceCard 
            title="Trading & Investments"
            description="Coming Soon"
            icon={CreativeIcon}
            titleColorClass="blue-gradient-text"
            buttonVariant="danger"
          />
          </Cardhovereffect>
        </FadeIn>
      </div>

      <div className="mb-12">
        <ScrollLineBottom />
        <SliderComponent slides={slides} />
      </div>
      
    </section>
  );
};

// --- Updated Card Component with GSAP Hover ---
interface CardProps {
  title: string;
  description: string;
  bg?: string;
  text?: string;
  style?: React.CSSProperties;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  bg,
  text,
  style,
  className,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.05,
      y: -10,
      boxShadow: "0px 20px 40px rgba(0,0,0,0.2)",
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      y: 0,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
      duration: 0.4,
      ease: "power2.inOut"
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${bg || ""} ${
        text || ""
      } rounded-[24px] p-6 flex flex-col justify-between min-h-[220px] shadow-lg ${
        className || ""
      } cursor-pointer`}
      style={style}
    >
      <div>
        <h4 className="text-xl font-semibold mb-2">{title}</h4>
        <p className="text-sm opacity-90">{description}</p>
      </div>

      <CustomButton variant="danger" text="GET STARTED" />
    </div>
  );
};

export default ServicesSection;