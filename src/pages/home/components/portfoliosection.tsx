import React from "react";
import MyButton from "@/components/CustomButton.js";
import ProjectCardContent, { projects } from "./projectcard.js"; // <- import component + projects
import cardbg from "@/assets/BrandMark.png";
import Portfoliobg from "@/assets/footerbg.png";
import "../home.css";
import "@/index.css";
import Union from "@/assets/Union.svg";
import Icon from "@/assets/Colon.png";
import Colons from "@/assets/Colons.png";
import ShadowL from "@/assets/ShadowL.png";
import ShadowR from "@/assets/ShadowR.png";
import ScrollLineThird from "./ScrollLineThird.jsx";
import test1 from "@/assets/test1.jpg";
import test2 from "@/assets/test2.jpg";
import test3 from "@/assets/test3.jpg";
import test5 from "@/assets/test5.jpg";
import test6 from "@/assets/test6.jpg";
import test7 from "@/assets/test7.jpg";
import test8 from "@/assets/test5.jpg";

import Slider from "react-slick";
import FadeIn from "@/transitions/FadeIn.js";
import Cardhovereffect from "@/transitions/cardhovereffect.js"


// Testimonials data (abhi component me shift nahi kiya, parent me hi rahega)
const testimonials = [
  {
    name: "Nugraha",
    role: "Fonder of Mangcoding",
    text: "Mangcoding is a biggest company in Indonesia, who provides the services in Development Website, Shopify and Wordpress",
    image: test1,
  },
  {
    name: "Alex Jounky",
    role: "Fonder of Robs",
    text: "Mangcoding is a biggest company in Indonesia, who provides the services in Development Website, Shopify and Wordpress",
    image: test2,
  },
  {
    name: "Chelsia Alexy",
    role: "Fonder of Frank",
    text: "Mangcoding is a biggest company in Indonesia, who provides the services in Development Website, Shopify and Wordpress",
    image: test3,
  },
  {
    name: "Nugraha",
    role: "Fonder of Mangcoding",
    text: "Mangcoding is a biggest company in Indonesia, who provides the services in Development Website, Shopify and Wordpress",
    image: test1,
  },
  {
    name: "Samuel Abey",
    role: "Full Stack Dev",
    text: "Mangcoding is a biggest company in Indonesia, who provides the services in Development Website, Shopify and Wordpress",
    image: test5,
  },
  {
    name: "Purwa Adi",
    role: "UI/UX Designer",
    text: "Mangcoding is a biggest company in Indonesia, who provides the services in Development Website, Shopify and Wordpress",
    image: test6,
  },
  {
    name: "Rizwan Gusnajmi",
    role: "Web Developer",
    text: "Mangcoding is a biggest company in Indonesia, who provides the services in Development Website, Shopify and Wordpress",
    image: test7,
  },
  {
    name: "Samuel Abey",
    role: "Full Stack Dev",
    text: "Mangcoding is a biggest company in Indonesia, who provides the services in Development Website, Shopify and Wordpress",
    image: test8,
  },
];

const isMobile = window.innerWidth <= 768;

const PortfolioSection = () => {
  const projectSliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: isMobile ? 1 : 2,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const testimonialSliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: isMobile ? 1 : 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2800,
    adaptiveHeight: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="relative w-full bg-[#000202] text-white pt-2 allow-internal-scroll">

  {/* Bottom Section - Testimonials */}
      <div
        className="relative w-full bg-[#000202] pb-10 mt-12"
        style={{
          backgroundImage: `url(${Portfoliobg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <img
          src={ShadowL}
          alt="Left Overlay"
          className="absolute left-0 top-0 h-full object-contain opacity-80 pointer-events-none"
        />
        <img
          src={Colons}
          alt="Right Overlay"
          className="absolute right-0 top-0 h-[286px] w-[423px] opacity-100 pointer-events-none"
        />
        <img
          src={ShadowR}
          alt="Right Shadow"
          className="absolute right-0 top-0 h-full object-contain opacity-100 pointer-events-none"
        />

        <section className="container mx-auto px-4 md:px-8 relative z-10 py-2">
   
          <h2 className="h2.recentproject-title text-2xl md:text-3xl font-light text-blue-400 mb-2  text-center md:text-left">
            Proven Results
            <img src={Union} alt="Union" className="ml-2 inline-block" />
          </h2>

          <div className="relative">
            <Slider {...testimonialSliderSettings} className="w-full">
              {testimonials.map((item, idx) => (
                <div key={idx} className="px-2">
                  <FadeIn delay={1.8}>
                    <Cardhovereffect>
                      <div className="glass-card-2 testimonial-border bg-gray-900 p-6 rounded-xl text-gray-300 hover:bg-gray-800 transition flex flex-col gap-3 md:gap-4 min-h-[180px] h-auto">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex flex-col mt-2">
                              <div className="testimonial-text">{item.name}</div>
                              <div className="testimonial-text-role">{item.role}</div>
                            </div>
                          </div>
                          <img
                            src={Icon}
                            alt={`${item.name}-extra`}
                            className="w-10 h-8 object-cover"
                          />
                        </div>
                        <p className="testimonial-text mt-2 text-sm md:text-base break-words">
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
      {/* Top Section - Recent Projects */}

      <div
        className="relative"
        style={{
          backgroundImage: `url(${Portfoliobg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <img
          src={ShadowL}
          alt="Left Overlay"
          className="absolute left-0 top-0 h-full object-contain opacity-80 pointer-events-none"
        />

        <section className="container mx-auto px-4 md:px-8 relative z-10 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-center ">
            
            <h2 className="h2.recentproject-title text-2xl md:text-3xl font-light text-blue-400   md:mb-0 text-center md:text-left">
              Featured Projects
              <img src={Union} alt="Union" className="ml-2 inline-block" />
            </h2>
            <MyButton text="All PORTFOLIO" variant="primary" />
          </div>

          {/* Projects Slider */}
          <div className="relative">
            <Slider {...projectSliderSettings} className="w-full">
              {projects.map((project, idx) => (
                <div key={idx} className="px-2">
                  <div
                    style={{
                      backgroundImage: `url(${cardbg})`,
                      backgroundPosition: isMobile ? "right -53px top 0" : "right 0 top 0",
                      backgroundRepeat: "no-repeat",
                    }}
                    className=" flex items-center pr-2 md:pr-4"
                  >
                    <ProjectCardContent project={project} />
                  </div>
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
