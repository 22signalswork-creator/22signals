import React from "react";
import "../services.css";
import Arrowright from "@/assets/image-removebg-preview (4).png";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";

const ProcessSteps: React.FC = () => {
  return (
    <section className="process-section py-24 flex items-center justify-center">
      <div className="container items-center">
        {/* ================= HEADER ================= */}
        <FadeIn>
          <div className="process-header">
            <RisingText end="80%">
              <h1>
                Our Process Step <br /> By Step Strategy
              </h1>
            </RisingText>
            <p className="dark-text">
              You never get another chance to make a good first impression. At
              American Designers Hub, we use a complete spectrum.
            </p>
          </div>
        </FadeIn>
        <FadeIn>
          <div className="process-steps mt-5">
            {[
              {
                number: "01",
                title: "Discovery",
                desc: "We analyze your bottlenecks.",
                image: "/src/assets/image-removebg-preview.png",
              },
              {
                number: "02",
                title: "Strategy",
                desc: "We curate a specialized strategy.",
                image: "/src/assets/image-removebg-preview (1).png",
              },
              {
                number: "03",
                title: "Execution",
                desc: "Rapid sprints with weekly reporting",
                image: "/src/assets/image-removebg-preview (2).png",
              },
              {
                number: "04",
                title: "Scale",
                desc: "Scale your applications",
                image: "/src/assets/image-removebg-preview (3).png",
              },
            ].map((step, index, arr) => (
              <div className="step-item" key={index}>
                <div className="step">
                  <div className="step-number-wrapper">
                    <img src={step.image} alt={step.title} style={{width: "80px"}}/>
                  </div>
                  <h2 className="card-heading pt-2 pl-2  animated-gradient-black" style={{fontSize: "30px"}}>{step.title}</h2>
                  <p>{step.desc}</p>
                </div>
                {index < arr.length - 1 && (
                  <img
                    src={Arrowright}
                    alt="arrow"
                    className="step-arrow-right"
                  />
                )}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default ProcessSteps;
