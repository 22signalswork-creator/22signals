import React from "react";
import { motion } from "framer-motion";

import DigitalSolutions from "@/assets/digitalsolutions.png";
import Framed from "@/assets/DigitalIcon.png";
import MyButton from "@/components/button.tsx";
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
import ScrollLine from "./ScrollLine.jsx";
import ScrollLineBottom from "./ScrollLineBottom.jsx";
import VideoSection from "./videosection.tsx";

const slides = [slide1, slide2, slide7, slide4, slide6, slide8, slide5, slide3];

const HomeBody = () => {
  return (
    <section className="container relative py-16 px-6 md:px-12 lg:px-20">
      <div className="svg-container">
        <ScrollLine />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.7fr] gap-12 items-center mb-20">
        {/* Left Column: Text */}
        <div>
          <h1
            className="bg-clip-text text-transparent text-center md:text-left"
            style={{
              backgroundImage:
                "linear-gradient(91.16deg, #325FEC 1.74%, #000000 43.71%, #000000 61.62%, #325FEC 102.48%)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              borderRadius: "18px",
            }}
          >
            We translate complex <br />
            challenges into tangible data driven results.
          </h1>
        </div>

            
            <VideoSection/>
        {/* <div className="w-full  m-0 p-0 flex justify-center">
          <div className="relative w-full max-w-[668px] h-[300px] bg-cover bg-center flex items-center justify-center overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center flex items-center justify-center"
              style={{
                backgroundImage: `url(${videoplayer})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                borderRadius: "24px",
              }}
            >
    
              <img
                src={videoplay}
                alt="Play Button"
                className="h-16 pointer-events-none"
              />
            </div>
          </div>
        </div> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] items-center gap-8 mb-12">
        <div>
          <h1 className="font-thin text-[68px] leading-[1.1] text-center md:text-left">
            <span className="bg-clip-text text-transparent bg-[linear-gradient(91.16deg,#325FEC_1.74%,#000000_43.71%,#000000_61.62%,#325FEC_102.48%)]">
              Integrated Solutions.
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-[linear-gradient(91.16deg,#325FEC_1.74%,#000000_43.71%,#000000_61.62%,#325FEC_102.48%)]">
              Singular Focus.
            </span>
          </h1>
        </div>

        <div className="flex justify-center md:justify-end mt-6 md:mt-0">
         <MyButton text="CONTACT US" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1.3fr] gap-10 my-10">
        {/* First Card */}
        <div className="h-[435px] relative rounded-[24px] overflow-hidden shadow-lg flex flex-col">
          <div className="absolute inset-0 bg-[#325fec] z-0"></div>
          <div
            className="absolute digital-bg inset-0 bg-no-repeat bg-contain bg-right object-contain z-10"
            style={{
              backgroundImage: `url(${DigitalSolutions})`,
              backgroundPosition: "right -130px top 45px",
            }}
          ></div>

          <div className="relative z-20 flex flex-col justify-between h-full p-[30px] md:p-[48px]  text-white">
            {/* Top Content: Icon + Title + Text */}
            <div className="space-y-4">
              <img src={Framed} alt="Card Icon" className="w-[60px] h-[60px]" />
              <h3 className=" w-[445px]">Digital Solutions</h3>
              <p className="text-base w-[337px]">
                Web dev, app dev, IoT and AI <br></br> automations
              </p>
            </div>
            <div className="w-full sm:w-auto flex justify-start">
              <MyButton text="GET STARTED" className="white-opacity" />
            </div>
          </div>
        </div>

        {/* Second Card */}
        <div className="h-[435px] relative rounded-[24px] overflow-hidden shadow-lg flex flex-col">
          <div className="absolute inset-0 bg-black z-0"></div>
          <div
            className="absolute creative-solutions inset-0 bg-no-repeat bg-contain bg-right object-contain z-10"
            style={{
              backgroundImage: `url(${Creative})`,
              backgroundPosition: "right -50px top 60px",
              backgroundSize: "auto",
            }}
          ></div>

          <div className="relative z-20 flex flex-col justify-between h-full p-[30px] md:p-[48px] text-white">
            {/* Top Content: Icon + Title + Text */}
            <div className="space-y-4">
              <img
                src={CreativeIcon}
                alt="Card Icon"
                className="w-[60px] h-[60px]"
              />
              <h3 className="blue-gradient-text">Creative Solutions</h3>
              <p className="text-base w-[322px]">
                Social Media Marketing, PPC Ads, Video Editing, 2D/3D
                Animations, Modeling, Graphic Designing
              </p>
            </div>
            <div className="w-full sm:w-auto flex justify-start">
              <MyButton text="GET STARTED" className="gray" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_2fr] gap-10 my-10">
        {/* First Card */}
        <div className="h-[435px] relative rounded-[24px] overflow-hidden shadow-lg flex flex-col">
          <div className="absolute inset-0 bg-black z-0"></div>
          <div
            className="absolute staff-bg inset-0 bg-no-repeat bg-contain bg-right object-contain z-10"
            style={{
              backgroundImage: `url(${staffbg})`,
              backgroundPosition: "right -20px top 50px",
            }}
          ></div>

          <div className="relative z-20 flex flex-col justify-between h-full p-[30px] md:p-[48px] text-white">
            {/* Top Content: Icon + Title + Text */}
            <div className="space-y-4">
              <img
                src={Stafficon}
                alt="Card Icon"
                className="w-[60px] h-[60px]"
              />
              <h3 className="blue-gradient-text">Staff Augmentation</h3>
              <p className="text-base w-[337px]">
                Back end offices and remote <br></br> employees
              </p>
            </div>
            <div className="w-full sm:w-auto flex justify-start">
              <MyButton text="GET STARTED" className="gray" />
            </div>
          </div>
        </div>

        {/* Second Card */}
        <div className="h-[435px] relative rounded-[24px] overflow-hidden shadow-lg flex flex-col">
          <div className="absolute inset-0 bg-[#325fec] z-0"></div>
          <div
            className="absolute broafcatingbg inset-0 bg-no-repeat bg-contain bg-right object-contain z-10"
            style={{
              backgroundImage: `url(${broadcastingbg})`,
              backgroundPosition: "right -5px top 50px",
            }}
          ></div>

          <div className="relative z-20 flex flex-col justify-between h-full p-[30px] md:p-[48px] text-white">
            {/* Top Content: Icon + Title + Text */}
            <div className="space-y-4">
              <img
                src={Broadcastingicon}
                alt="Card Icon"
                className="w-[60px] h-[60px]"
              />
              <h3 className="text-2xl font-semibold w-[445px]">
                Broadcasting & Event Execution
              </h3>
              <p className="text-base w-[377px]">
                Broadcasting solutions, remote broadcasting, esports event
                management
              </p>
            </div>
            <div className="w-full sm:w-auto flex justify-start">
              <MyButton text="GET STARTED"  className="white-opacity"/>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_2.5fr_1.2fr] gap-10 my-10 mb-20">
        <div className="h-[435px] relative rounded-[24px] overflow-hidden shadow-lg flex flex-col">
          <div className="absolute inset-0 bg-black z-0"></div>
          <div className="absolute inset-0 bg-no-repeat bg-contain bg-right object-contain z-10"></div>
          <div className="relative z-20 flex flex-col justify-between h-full px-[34px] py-[48px] text-white">
            <div className="space-y-4">
              <img
                src={CreativeIcon}
                alt="Card Icon"
                className="w-[60px] h-[60px]"
              />
              <h3 className="blue-gradient-text">Game Development</h3>
              <p className="text-base ">
                help you to build website company that is modern, user friendly,
                good CEO, and Clean design{" "}
              </p>
            </div>
            <div className="w-full sm:w-auto flex justify-start">
              <MyButton text="GET STARTED"  className="gray"/>
            </div>
          </div>
        </div>

        {/* Middle Card */}
        <div className="h-[435px] relative rounded-[24px] overflow-hidden shadow-lg flex flex-col">
          <div className="absolute inset-0 bg-[#325fec] z-0"></div>
          <div
            className="absolute digital-bg inset-0 bg-no-repeat bg-contain bg-right object-contain z-10"
            style={{
              backgroundImage: `url(${DigitalSolutions})`,
              backgroundPosition: "right -350px top 50px",
            }}
          ></div>
          <div className="relative z-20 flex flex-col justify-between h-full p-[30px] md:p-[48px] text-white">
            <div className="space-y-4">
              <img src={Framed} alt="Card Icon" className="w-[60px] h-[60px]" />
              <h3 className="text-2xl font-semibold w-[445px]">
                Global Manufacturing Solutions
              </h3>
              <p className="text-base w-[387px]">
                help you to build website company that is modern, user friendly,
                good CEO, and Clean design
              </p>
            </div>
            <div className="w-full sm:w-auto flex justify-start">
              <MyButton text="GET STARTED" className="white-opacity" />
            </div>
          </div>
        </div>

        {/* Third Card */}
        <div className="h-[435px] relative rounded-[24px] overflow-hidden shadow-lg flex flex-col">
          <div className="absolute inset-0 bg-black z-0"></div>
          <div className="absolute inset-0 bg-no-repeat bg-contain bg-right object-contain z-10"></div>
          <div className="relative z-20 flex flex-col justify-between h-full px-[34px] py-[48px] text-white">
            <div className="space-y-4">
              <img
                src={CreativeIcon}
                alt="Card Icon"
                className="w-[60px] h-[60px]"
              />
              <h3 className="blue-gradient-text">UI/UX Design</h3>
              <p className="text-base ">
                help you to build website company that is modern, user friendly,
                good CEO, and Clean design{" "}
              </p>
            </div>
            <div className="w-full sm:w-auto flex justify-start">
              <MyButton text="GET STARTED" className="gray" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <ScrollLineBottom />
        <SliderComponent slides={slides} />
      </div>
      <div></div>
    </section>
  );
};

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

      <MyButton text="GET STARTED" />
    </div>
  );
};

export default HomeBody;
