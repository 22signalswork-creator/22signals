import React from "react";
import "../services.css";
import Arrowright from "@/assets/image-removebg-preview (4).png";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";

const ProcessSteps: React.FC = () => {
  const getStaggerDelay = (index: number) => index * 0.15;

  // Per brief: replace text + graphics with these 4 stages
  const steps = [
    {
      number: "01",
      title: "Discovery",
      desc: "We analyze your bottlenecks.",
    },
    {
      number: "02",
      title: "Strategy",
      desc: "We curate a specialized strategy.",
    },
    {
      number: "03",
      title: "Execution",
      desc: "Rapid sprints with weekly reporting.",
    },
    {
      number: "04",
      title: "Scale",
      desc: "Scale your operations.",
    },
  ];

  return (
    <section className="process-section py-24 flex items-center justify-center">
      <div className="container items-center">
        <FadeIn>
          <div className="process-header">
            <RisingText end="80%">
              <h1>
                Our Process Step <br /> By Step Strategy
              </h1>
            </RisingText>
            <p className="dark-text">
              Stop managing multiple agencies. Partner with us to gain a
              dedicated supervisor and instant access to our full suite of
              digital, creative, and manufacturing solutions.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="process-steps mt-5">
            {steps.map((step, index, arr) => (
              <FadeIn key={index} delay={getStaggerDelay(index)}>
                <div className="step-item">
                  <div className="step">
                    {/* Hexagonal step indicator (no more PNGs) */}
                    <div className="step-number-wrapper">
                      <svg
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polygon
                          points="40,4 72,22 72,58 40,76 8,58 8,22"
                          fill="rgba(50, 95, 236, 0.08)"
                          stroke="#325FEC"
                          strokeWidth="1.5"
                        />
                        <text
                          x="40"
                          y="48"
                          textAnchor="middle"
                          fontSize="22"
                          fill="#325FEC"
                          fontFamily="Aeonik-medium, sans-serif"
                          fontWeight="500"
                        >
                          {step.number}
                        </text>
                      </svg>
                    </div>
                    <h2
                      className="card-heading pt-2 pl-2 animated-gradient-black"
                      style={{ fontSize: "30px" }}
                    >
                      {step.title}
                    </h2>
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
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default ProcessSteps;
