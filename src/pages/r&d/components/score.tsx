import React from "react";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";

const Score = () => {
  const scores = [
    { title: "Haptic Web Interfaces", percent: 75 },
    { title: "Brain-Computer UX", percent: 60 },
    { title: "Holographic Displays", percent: 38 },
    { title: "Voice-First Navigation", percent: 90 },
  ];

  return (
    <div className="container mx-auto p-6 py-50">

      {/* Top Section */}
      <FadeIn>
      <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-2">
        <div>
          <h1 className="">Project Details</h1>
        </div>
        <div className="max-w-[555px] w-full flex ml-auto">
          <p className="dark-text">
            You never get another chance to make a good first impression. At American Designers Hub, we use a complete spectrum
          </p>
        </div>
      </div>
      </FadeIn>

      {/* Score Grid */}
      <FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 md:gap-10">
        {scores.map((item, index) => (
          <Cardhovereffect>
          <div
            key={index}
            className="progress-card"
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-3">
              <h1 className="progress-bar">
                {item.title}
              </h1>
              <h1 className="progress-bar">
                {item.percent}%
              </h1>
            </div>

            <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="progressbar h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
          </Cardhovereffect>
        ))}
      </div>
      </FadeIn>

    </div>
  );
};

export default Score;
