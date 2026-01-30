import React from "react";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";

const activeresearch = () => {
  return (
    <div className="container mx-auto px-4">
      <FadeIn>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start">
        <div>
          <span className="services-badge-secondry">Research & Development</span>
          <h1 className="text-3xl lg:text-5xl font-bold">Active Research</h1>
        </div>
        <div>
          <div className="max-w[555px] w-full flex ml-auto">
            <p className="dark-text">
              You never get another chance to make a good first impression. At American Designers Hub, we use a complete spectrum of UI/UX services.
              </p>
          </div>

          <div className="divider "></div>
        </div>
      </div>
      </FadeIn>
    </div>
  );
};

export default activeresearch;
