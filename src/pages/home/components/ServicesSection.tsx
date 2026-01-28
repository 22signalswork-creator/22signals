import React from "react";
import { motion } from "framer-motion";

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
import slide1 from "@/assets/Frame68.png";
import slide2 from "@/assets/Frame69.png";
import slide8 from "@/assets/Frame76.png";
import slide3 from "@/assets/Frame70.png";
import slide4 from "@/assets/Frame71.png";
import slide5 from "@/assets/Frame72.png";
import slide6 from "@/assets/Frame73.png";
import slide7 from "@/assets/Frame74.png";
import ScrollLine from "./ScrollLine.js";
import ScrollLineBottom from "./ScrollLineBottom.js";

import Video from "./video.tsx";
import RisingText from "@/transitions/RisingText.tsx";
import ServiceCard from "./ServiceCard.tsx";
import FadeIn from "@/transitions/FadeIn.tsx";

const slides = [slide1, slide2, slide7, slide4, slide6, slide8, slide5, slide3];

const ServicesSection = () => {
  return (
    <section className="container relative pb-16 px-6 md:px-12 lg:px-20  allow-internal-scroll" style={{ paddingTop: '150px' }}>
      <div className="svg-container">
        <ScrollLine />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.7fr] gap-12 items-center mb-20">
        <div>
          <h1 className="animated-gradient text-transparent text-center md:text-left">
            <RisingText 
                 text="We translate complex challenges into tangible data driven results." 
                 className="" 
                 delay={2} 
               />
          </h1>
        </div>
        <Video />
        
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] items-center gap-8 mb-12">
        <div>
          <h1 className="font-thin text-[68px] leading-[1.1] text-center md:text-left">
            <RisingText 
                 text="Integrated Solutions Singular Focus." 
                 className="" 
                 delay={3} 
               />
          </h1>
        </div>

        <div className="flex justify-center md:justify-end mt-6 md:mt-0">
         <CustomButton text="CONTACT US" />
        </div>
      </div>

      {/* ROW 1: Digital & Creative */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1.3fr] gap-10 my-10">
        <FadeIn delay={1.7}>
          <ServiceCard 
            title="Digital Solutions"
            description="Web dev, app dev, IoT and AI automations"
            icon={Framed}
            bgImage={DigitalSolutions}
            bgColorClass="bg-[#325fec]"
            bgPosition="right -130px top 45px"
            buttonVariant="white"
          />
        </FadeIn>

        <FadeIn delay={1.8}>
          <ServiceCard 
            title="Creative Solutions"
            description="Social Media Marketing, PPC Ads, Video Editing, 2D/3D Animations, Modeling, Graphic Designing"
            icon={CreativeIcon}
            bgImage={Creative}
            titleColorClass="blue-gradient-text"
            bgPosition="right -50px top 60px"
          />
        </FadeIn>
      </div>

      {/* ROW 2: Staff & Broadcasting */}
      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_2fr] gap-10 my-10">
        <FadeIn delay={0.1}>
          <ServiceCard 
            title="Staff Augmentation"
            description="Back end offices and remote employees"
            icon={Stafficon}
            bgImage={staffbg}
            titleColorClass="blue-gradient-text"
            bgPosition="right -20px top 50px"
          />
        </FadeIn>

        <FadeIn delay={0.2}>
          <ServiceCard 
            title="Broadcasting & Event Execution"
            description="Broadcasting solutions, remote broadcasting, esports event management"
            icon={Broadcastingicon}
            bgImage={broadcastingbg}
            bgColorClass="bg-[#325fec]"
            bgPosition="right -5px top 50px"
            buttonVariant="white"
          />
        </FadeIn>
      </div>

      {/* ROW 3: Three Columns */}
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_2.5fr_1.2fr] gap-10 my-10 mb-20">
        <FadeIn delay={0.3}>
          <ServiceCard 
            title="Game Development"
            description="help you to build website company that is modern, user friendly, good CEO, and Clean design"
            icon={CreativeIcon}
            titleColorClass="blue-gradient-text"
          />
        </FadeIn>

        <FadeIn delay={0.4}>
          <ServiceCard 
            title="Global Manufacturing Solutions"
            description="help you to build website company that is modern, user friendly, good CEO, and Clean design"
            icon={Framed}
            bgImage={DigitalSolutions}
            bgColorClass="bg-[#325fec]"
            bgPosition="right -350px top 50px"
            buttonVariant="white"
          />
        </FadeIn>

        <FadeIn delay={0.5}>
          <ServiceCard 
            title="UI/UX Design"
            description="help you to build website company that is modern, user friendly, good CEO, and Clean design"
            icon={CreativeIcon}
            titleColorClass="blue-gradient-text"
          />
        </FadeIn>
      </div>

      <div className="mb-10">
        <ScrollLineBottom />
        <SliderComponent slides={slides} />
      </div>
      
    </section>
  );
};

export default ServicesSection;

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
  return (
    <div
      className={`${bg || ""} ${
        text || ""
      } rounded-[24px] p-6 flex flex-col justify-between min-h-[220px] shadow-lg ${
        className || ""
      }`}
      style={style}
    >
      <div>
        <h4 className="text-xl font-semibold mb-2">{title}</h4>
        <p className="text-sm opacity-90">{description}</p>
      </div>

      <CustomButton variant="white" text="GET STARTED" />
    </div>
  );
};


