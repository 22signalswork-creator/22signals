import React from "react";
import "../services.css";
import CustomDesigns from "@/assets/CustomDesigns.png";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";

const RefinedExecution: React.FC = () => {
  return (
    <section className="creative-services py-24 flex items-center justify-center">
      <div className="container">
        {/* ================= HEADER ================= */}
        <FadeIn>
          <div className="services-header">
            <span className="services-badge-secondry">
              Creative Marketing Solutions
            </span>

            <div className="services-title-wrap">
              <RisingText end="80%">
                <h1>Refined <br/>Execution.</h1>
              </RisingText>
              <div>
                <RisingText end="80%">
                  <p className="dark-text">
                    Stop managing multiple agencies. Partner with us to gain a dedicated supervisor and instant access to our full suite of digital, creative, and manufacturing solutions.
                  </p>
                </RisingText>
                <div className="divider"></div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ================= SERVICES ================= */}
        <div className="services-grid">
          <FadeIn delay={0}>
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
          <FadeIn delay={0.1}>
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
          <FadeIn delay={0.2}>
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
          <FadeIn delay={0.3}>
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
      </div>
    </section>
  );
};

export default RefinedExecution;
