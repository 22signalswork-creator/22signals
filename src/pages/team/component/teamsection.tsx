import React from "react";
import TeamImage from "@/assets/team-3d.png";
import Valuicon from "@/assets/valueicon.png";
import Teammemberline from "@/assets/teammemberline.png";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";

const values = [
  {
    title: "Analytical Precision",
    desc: "Every strategy and execution plan is rooted in data, ensuring measurable results and optimized workflows.",
  },
  {
    title: "Competitive Excellence",
    desc: "Forged in the high-stakes environment, our team operates with speed, adaptability, and a drive to win.",
  },
  {
    title: "Strategic Alignment",
    desc: "Harness top talent to achieve your specific business goals.",
  },
  {
    title: "Collaboration",
    desc: "We provide the digital transformation and operational support you need, functioning as a flawless extension of your own internal team.",
  },
];

export default function TeamSection() {
  return (
    <section className="bg-black text-white py-0 md:py-24">
      {/* Top Grid */}
      <FadeIn>
        <div className="container grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3 items-start">
          {/* Left Image */}
          <div className="relative w-full flex justify-center">
            <div className="relative w-full flex flex-col items-end md:items-center">
              <img
                src={TeamImage}
                alt="Sarah Chen"
                className="w-[220px] h-[391px] md:w-[620px] md:h-[891px]"
              />

              <div className="skeleton">
                <img
                  src={Teammemberline}
                  alt=""
                  width={"400px"}
                  height={"100px"}
                />

                <div className="grid grid-cols-1 gap-0">
                  <div>
                    <h4 className="teammemertitle">Daniyal Mansur</h4>
                    <p className="sub-title">Founder & CEO</p>
                  </div>

                  <span className="team-paragraph">
                    Daniyal’s entrepreneurial journey is defined by a relentless pursuit of perfection, and a profound passion for building exciting technology. Fueled by a lifelong curiosity that began with deep-diving into digital landscapes as a child, he quickly established himself in the industry. At a young age, Daniyal spearheaded regional operations for a pioneering startup, managing global projects and executing high-stakes partnerships with industry titans. His ability to identify market opportunities and lead diverse teams naturally evolved into driving comprehensive digital transformation for prestigious international firms. Today, he channels that exact innovative energy into founding 22 Signals. His definitive goal is to push the boundaries of what is possible, engineering and developing the very technology that will lead the future. A strategist at heart, Daniyal backs his hands-on entrepreneurial success with a Master’s in Business Analytics from Queen Mary University of London.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="w-full flex flex-col justify-center md:pt-0 pt-20">
            <h1 className="h1-large-color py-10 md:py-0">MEET THE TEAM</h1>

            <p className="white-text">
              As a result of our diverse experience, we are able to think
              creatively and find new solutions to problems, providing clients
              with memorable, purpose-driven experiences that cut through the
              noise and connect where it matters, which leaves lasting
              impressions that form enduring connections between brands and
              consumers.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Values Section */}
      <div className="flex flex-col gap-20 mt-60">
        <div className="container grid grid-cols-1 pt-30 md:grid-cols-[2fr_1fr] gap-6 items-start">
          <div>
            <h2>The DNA of Our Standard.</h2>
          </div>

          <div>
            <p className="white-text mb-10">
              Our operational framework is built on precision, speed, and
              cross-departmental excellence to help you lead your market.
            </p>
          </div>
        </div>

        {/* ✅ Equal Height Cards */}
        <div className="container grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {values.map((value, i) => (
            <FadeIn key={i}>
              <Cardhovereffect>
                <div
                  style={{
                    background:
                      "linear-gradient(121.9deg, #1C1C1C 0%, #050505 96.81%)",
                    border: "1px solid #FFFFFF",
                  }}
                  className="rounded-[20px] p-6 flex flex-col gap-4 h-full"
                >
                  <img src={Valuicon} width={"66px"} alt="" />

                  <h1 className="teamcard-title">{value.title}</h1>

                  {/* flex-grow ensures equal spacing */}
                  <p className="text-white text-left flex-grow">
                    {value.desc}
                  </p>
                </div>
              </Cardhovereffect>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}