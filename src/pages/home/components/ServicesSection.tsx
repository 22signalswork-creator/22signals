import React, { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

// Assets
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
import slide5 from "@/assets/home-slider-logos/daraz-logo-i8P9fH3b-removebg-preview.png";
import slide6 from "@/assets/home-slider-logos/e1d8f3_42c64c8e204843b193a7ed97e5b894cc~mv2.png";
import slide7 from "@/assets/home-slider-logos/garena-logo-0.png";
import slide13 from "@/assets/home-slider-logos/garena-red-logo-with-symbol-701751694791357ntd4cmq0yy.png";
import slide9 from "@/assets/home-slider-logos/idU5A-8HdM_logos.png";
import slide10 from "@/assets/home-slider-logos/images.png";
import slide11 from "@/assets/home-slider-logos/red-bull-logo-0.png";
import slide12 from "@/assets/home-slider-logos/xWjBhY0R_400x400.jpg";

// Components
import ScrollLine from "./ScrollLine.js";
import ScrollLineBottom from "./ScrollLineBottom.js";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";
import Video from "./video.tsx";
import RisingText from "@/transitions/RisingText.tsx";
import ServiceCard from "./ServiceCard.tsx";
import FadeIn from "@/transitions/FadeIn.tsx";
import CompanyStatsCounts from "./CompanyStatsCounts.tsx";

const slides = [slide1, slide2, slide7, slide4, slide6, slide8, slide5, slide3, slide13, slide9, slide10, slide11, slide12];

const ServicesSection = () => {
  // Helper to ensure each card follows the last one perfectly
  const getStaggerDelay = (index: number) => index * 0.15;

  return (
    <section className="container relative pb-16 px-6 md:px-12 lg:px-20 allow-internal-scroll" style={{ paddingTop: '150px', height: "100%" }}>
      
      {/* Video & Title Header */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.7fr] gap-12 items-start mb-80 ">
        <div className="pt-10">
          <RisingText>
            <h1 className="animated-gradient-black text-transparent text-center md:text-left">
              We translate complex challenges into tangible data driven results.
            </h1>
          </RisingText>
        </div>
        
        <div className="w-full">
          <Video />
        </div>

        <div className="svg-container">
          <ScrollLine />
        </div>
      </div>
      
      <div>
        <CompanyStatsCounts />
      </div>

      {/* ROW 1: Digital & Creative */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1.3fr] gap-10 my-10">
        <FadeIn delay={getStaggerDelay(0)}>
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

        <FadeIn delay={getStaggerDelay(1)}>
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
        <FadeIn delay={getStaggerDelay(2)}>
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

        <FadeIn delay={getStaggerDelay(3)}>
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
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_2fr_1.2fr] gap-10 my-10">
        <FadeIn delay={getStaggerDelay(4)}>
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

        <FadeIn delay={getStaggerDelay(5)}>
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

        <FadeIn delay={getStaggerDelay(6)}>
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

      <div className="">
        <ScrollLineBottom />
        <SliderComponent slides={slides} />
      </div>
      
    </section>
  );
};

export default ServicesSection;