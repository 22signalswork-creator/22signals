import React from "react";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";

const Score = () => {
  const scores = [
    { label: "The Work in Progress", title: "Active Beta Frameworks", percent: 15 },
    { label: "The Effect on Speed", title: "Faster Prototyping", percent: 60 },
    { label: "The Effect on Margins", title: "Optimized Cost Reductions", percent: 60 },
    { label: "The Execution Standard", title: "Analytical Precision", percent: 100 },
  ];

  return (
    <div className="container mx-auto p-6 py-50">
      
      {/* Top Section */}
      <FadeIn>
        <div className="grid grid-cols-2 gap-4 mb-28 md:grid-cols-2">
          <div>
            <h1>Active R&D <br></br> Impact</h1>
          </div>
          <div className="max-w-[555px] w-full flex ml-auto">
            <p className="dark-text">
              We do not wait for the future; we engineer it. Our research division continuously develops, tests, and optimizes proprietary backend systems.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Score Grid */}
      <FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 items-stretch">
          {scores.map((item, index) => (
            <Cardhovereffect key={index}>
              <div className="progress-card h-full flex flex-col justify-between">
                
                <div>
                  <h1>{item.label}</h1>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-3">
                  <h1 className="progress-bar">{item.title}</h1>
                  <h1 className="progress-bar">{item.percent}%</h1>
                </div>

                <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-auto">
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