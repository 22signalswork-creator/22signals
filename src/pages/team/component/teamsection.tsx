import React from "react";
import TeamImage from "@/assets/team-3d.png";
import Valuicon from "@/assets/valueicon.png";
import Teammemberline from "@/assets/teammemberline.png";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";

const values = [
  {
    title: "Innovation First",
    desc: "We push boundaries and explore new possibilities",
  },
  { title: "User-Centric", desc: "Every decision is guided by user needs" },
  { title: "Excellence", desc: "We strive for perfection in every detail" },
  { title: "Collaboration", desc: "Great work comes from great teamwork" },
];

export default function TeamSection() {
  return (
    <section className="bg-black text-white py-0 md:py-24">
      {/* Top Grid */}
      <FadeIn>
        <div className="container grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3 items-start ">
          {/* Left Image */}
          <div className="relative w-full flex justify-center">
            <div className="relative w-full flex flex-col items-end md:items-center">
              <img
                src={TeamImage}
                alt="Sarah Chen"
                className="w-[220px] h-[391px] md:w-[620px] md:h-[891px]"
              />
              <div className="skeleton ">
                <img
                  src={Teammemberline}
                  alt=""
                  width={"400px"}
                  height={"100px"}
                />
                <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
                  <div>
                    <h4 className="teammemertitle">Sarah Chen</h4>
                    <p className="sub-title">Creative Director</p>
                  </div>
                  <span className="team-paragraph">
                    We are developing genuine, human-centered personalities that
                    interact, arouse, and gain trust. With UI design services,
                    we force brand names to describe their picture.
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
      <div className="flex flex-col gap-20">
        <div className="container grid grid-cols-1 pt-30  md:grid-cols-[2fr_1fr] gap-6 items-start">
          <div>
            <h2 className="">Our Values</h2>
          </div>
          <div>
            <p className="white-text mb-10 ">
              You never get another chance to make a good first impression. At
              American Designers Hub, we use a complete spectrum
            </p>
          </div>
        </div>
        <div className="container grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <FadeIn>
              <Cardhovereffect>
                <div
                  key={i}
                  style={{
                    background:
                      "linear-gradient(121.9deg, #1C1C1C 0%, #050505 96.81%)",
                    border: "1px solid #FFFFFF",
                  }}
                  className="rounded-[10px] p-6 flex flex-col items-start gap-4"
                >
                  <img src={Valuicon} width={"66px"} alt="" />
                  <h1 className="teamcard-title">{value.title}</h1>
                  <p className="text-white  text-left">{value.desc}</p>
                </div>
              </Cardhovereffect>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
