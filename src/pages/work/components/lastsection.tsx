import { useState } from "react";
import "../../../pages/home/home.css";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";
import AnimatedText from "@/transitions/herosectionP.tsx";

const lastsection = () => {
  return (
    <div className="container  mx-auto px-4 py-16 space-y-16">
  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 items-start">
    <RisingText>
    <h1 className="sub-heading text-3xl md:text-5xl font-thin">
      Our Successfully <br /> Growth
    </h1>
    </RisingText>
    <p className="dark-text">
      You never get another chance to make a good first impression. At American Designers Hub, we use a complete spectrum
    </p>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    {/* Column 1 */}
    <FadeIn>
      <Cardhovereffect>
    <div className="second-card flex flex-col items-center">
      <h1>150+</h1>
      <p className="dark-text">Projects Delivered</p>
    </div>
    </Cardhovereffect>
</FadeIn>
    {/* Column 2 */}
    <FadeIn>
      <Cardhovereffect>
    <div className="second-card flex flex-col items-center">
      <h1>98% </h1>
      <p className="dark-text">Client Satisfaction</p>
    </div>
    </Cardhovereffect>
</FadeIn>
    {/* Column 3 */}
    <FadeIn>
      <Cardhovereffect>
    <div className="second-card flex flex-col items-center">
      <h1>50+ </h1>
      <p className="dark-text">Global Clients</p>
    </div>
    </Cardhovereffect>
    </FadeIn>

    {/* Column 4 */}
    <FadeIn>
      <Cardhovereffect>
    <div className="second-card flex flex-col items-center">
      <h1>25+ </h1>
      <p className="dark-text">Industry Awards</p>
    </div>
    </Cardhovereffect>
    </FadeIn>
  </div>
</div>

  );
};

export default lastsection;
