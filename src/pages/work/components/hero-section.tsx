import React from "react";
import bgImage from "@/assets/workbg.png";
import iconimage from "@/assets/iconimage.png";
import cardicon1 from "@/assets/card-icon-1.png";
import cardicon2 from "@/assets/card-icon-2.png";
import cardicon3 from "@/assets/card-icon-3.png";
import AnimatedText from "@/transitions/herosectionP.tsx";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx"

const HeroSection = () => {
  return (
    <section
      className="relative bg-overlay bg-cover bg-center -mt-12 md:-mt-30"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay and content wrapper */}
      <div className="container md:pt-60 relative z-10 px-4 md:px-0">
        {/* Heading section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left pt-60 md:pt-10">
           <RisingText>
          <h1 className="h1-large">
            FEATURED WORK
          </h1>
                     </RisingText>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full mt-8 gap-4">
            <AnimatedText className="dark-text text-base md:text-lg max-w-xl">
              We craft immersive digital experiences that push the boundaries of what's possible
            </AnimatedText>
            <img src={iconimage} alt="icon" className="w-16 h-16 md:w-20 md:h-20 mx-auto md:mx-0" />
          </div>
        </div>
      </div>

      {/* Cards Section */}
   
      <div className="container mx-auto pt-16 pb-16 md:pt-20 md:pb-30 px-4 md:px-0 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left card */}
           <FadeIn>
        <div className="flex flex-col gap-6 md:gap-10">
          <h2 className="sub-heading text-3xl md:text-[68px] leading-snug md:leading-[1.1] font-thin bg-clip-text text-transparent bg-gradient-to-r from-[#325fec] via-black to-[#325fec]">
            22 Signals
          </h2>
          <p className="dark-text text-base md:text-lg max-w-md">
            Our proprietary methodology combining 22 key signals to deliver exceptional digital experiences
          </p>
          <Cardhovereffect>
          <div className="card flex flex-col items-start p-6 md:p-10 rounded-2xl bg-white/5 backdrop-blur-sm gap-4 md:gap-6">
            <img src={cardicon1} className="w-12 h-12 md:w-16 md:h-16" alt="AI Icon" />
            <h3 className="cards-heading text-xl md:text-3xl font-thin bg-clip-text text-transparent bg-gradient-to-r from-[#325fec] via-black to-[#325fec]">
              AI-Powered Analytics
            </h3>
            <p className="dark-text text-sm md:text-base">
              Real-time insights and predictive modeling for smarter decisions
            </p>
          </div>
          </Cardhovereffect>
        </div>
</FadeIn>
 <FadeIn>
        {/* Middle Card */}
        <div className="flex justify-center md:justify-center items-start">
          <Cardhovereffect>
          <div className="middle-card flex flex-col items-start p-6 md:p-10 rounded-2xl bg-gradient-to-r from-[#325fec] via-black to-[#325fec] backdrop-blur-sm gap-4 md:gap-6 ">
            <img src={cardicon2} className="w-12 h-12 md:w-16 md:h-16" alt="Quantum Icon" />
            <h3 className="text-white text-xl md:text-3xl font-thin">
              Quantum Computing
            </h3>
            <p className="text-white text-sm md:text-base">
              Next-generation processing for complex computational challenges
            </p>
          </div>
          </Cardhovereffect>
        </div>
</FadeIn>
 <FadeIn>
        {/* Right card */}
        <div className="flex justify-end md:justify-start items-start">
          <Cardhovereffect>
          <div className="card flex flex-col items-start p-6 md:p-10 rounded-2xl bg-white/5 backdrop-blur-sm gap-4 md:gap-6 ">
            <img src={cardicon3} className="w-12 h-12 md:w-16 md:h-16" alt="Neural Icon" />
            <h3 className="cards-heading text-xl md:text-3xl font-thin bg-clip-text text-transparent bg-gradient-to-r from-[#325fec] via-black to-[#325fec]">
              Neural Interfaces
            </h3>
            <p className="dark-text text-sm md:text-base">
              Seamless human-computer interaction through advanced UX
            </p>
          </div>
          </Cardhovereffect>
        </div>
           </FadeIn>
      </div>
   
    </section>
  );
};

export default HeroSection;
