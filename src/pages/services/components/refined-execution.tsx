import React from "react";
import "../services.css";
import CustomDesigns from "@/assets/CustomDesigns.png";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";

const RefinedExecution: React.FC = () => {
  const getStaggerDelay = (index: number) => index * 0.15;

  return (
    <section className="creative-services mt-25  flex items-center justify-center">
      <div className="container">
        {/* ================= HEADER ================= */}
        <FadeIn>
          <div className="services-header">
            {/* <RisingText end="0%">
            <span className="services-badge-secondry">
              Creative Marketing Solutions
            </span>
            </RisingText> */}
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
           <FadeIn delay={getStaggerDelay(0)}>
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
          <FadeIn delay={getStaggerDelay(1)}>
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
          <FadeIn delay={getStaggerDelay(2)}>
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
          <FadeIn delay={getStaggerDelay(3)}>
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
