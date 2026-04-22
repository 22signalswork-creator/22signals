import { useState } from "react";
import "../services.css";
import CustomDesigns from "@/assets/CustomDesigns.png";
import Portfolioslider from "./portfolioslider.tsx";
import FaqSection from "./FaqSection"; // NEW IMPORT
import Arrowright from "@/assets/image-removebg-preview (4).png";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";

export default function CreativeServices() {
  return (
    <section className="creative-services">
      <div className="container">
        {/* ================= HEADER ================= */}
        <div className="services-header">
          <FadeIn>
            <span className="services-badge-secondry">
              Creative Marketing Solutions
            </span>

            <div className="services-title-wrap">
              <h1>Refined <br/>Execution.</h1>
              <div>
                <p className="dark-text">
                  Stop managing multiple agencies. Partner with us to gain a dedicated supervisor and instant access to our full suite of digital, creative, and manufacturing solutions.
                </p>
                <div className="divider"></div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* ================= SERVICES ================= */}
        <div className="services-grid">
          <FadeIn>
            <Cardhovereffect>
            <div className="service-card">
              <img src={CustomDesigns} alt="" />
              <h4>Custom Designs</h4>
              <p>
                We are developing genuine, human-centered personalities that
                interact, arouse, and gain trust. With UI design services, we
                force brand names to describe their picture, and with UX design
                amenities
              </p>
            </div>
            </Cardhovereffect>
          </FadeIn>
          <FadeIn>
             <Cardhovereffect>
            <div className="service-card">
              <img src={CustomDesigns} alt="" />
              <h4>Influential UI/UX Services</h4>
              <p>
                We are developing genuine, human-centered personalities that
                interact, arouse, and gain trust. With UI design services, we
                force brand names to describe their picture, and with UX design
                amenities
              </p>
            </div>
            </Cardhovereffect>
          </FadeIn>
          <FadeIn>
             <Cardhovereffect>
            <div className="service-card">
              <img src={CustomDesigns} alt="" />
              <h4>Improve your brand</h4>
              <p>
                We are developing genuine, human-centered personalities that
                interact, arouse, and gain trust. With UI design services, we
                force brand names to describe their picture, and with UX design
                amenities
              </p>
            </div>
            </Cardhovereffect>
          </FadeIn>
          <FadeIn>
            <Cardhovereffect>
            <div className="service-card">
              <img src={CustomDesigns} alt="" />
              <h4>Improve your brand</h4>
              <p className="dark-text">
                We are developing genuine, human-centered personalities that
                interact, arouse, and gain trust. With UI design services, we
                force brand names to describe their picture, and with UX design
                amenities
              </p>
            </div>
            </Cardhovereffect>
          </FadeIn>
        </div>

        {/* ================= PROCESS ================= */}
        <div className="process-section">
          {/* Header */}
          <div className="process-header">
            <RisingText>
              <h1>
                Our Process Step <br /> By Step Strategy
              </h1>
            </RisingText>
            <p className="dark-text">
              You never get another chance to make a good first impression. At
              American Designers Hub, we use a complete spectrum.
            </p>
          </div>
          <FadeIn>
          <div className="process-steps">
            {[
              {
                number: "01",
                title: "Discovery",
                desc: "Understanding your vision, goals, and challenges",
                image: "/src/assets/image-removebg-preview.png",
              },
              {
                number: "02",
                title: "Design",
                desc: "Crafting the visual experience for your product",
                image: "/src/assets/image-removebg-preview (1).png",
              },
              {
                number: "03",
                title: "Development",
                desc: "Turning designs into functional products",
                image: "/src/assets/image-removebg-preview (2).png",
              },
              {
                number: "04",
                title: "Launch",
                desc: "Going live and optimizing performance",
                image: "/src/assets/image-removebg-preview (3).png",
              },
            ].map((step, index, arr) => (
              <div className="step-item" key={index}>
                <div className="step">
                  <div className="step-number-wrapper">
                    <img src={step.image} alt={step.title} />
                  </div>
                  <h1 className="card-heading pt-2 pl-2">{step.title}</h1>
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

        {/* ================= SLIDER ================= */}
 
      </div>
    </section>
  );
}
