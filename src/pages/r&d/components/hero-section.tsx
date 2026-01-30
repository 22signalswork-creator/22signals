import "@/pages/services/services.css";
import MyButton from "@/components/CustomButton";
import AnimatedText from "@/transitions/herosectionP.tsx";
import RisingText from "@/transitions/RisingText";

export default function HeroSection() {
  return (
    <section className="hero-section">
      {/* Outer container for layout */}
      <div className="container">
        {/* Background holder */}
        <div className="servicebg-wrapper">
          <div className="servicebg">
            {/* Inner container for content */}
            <div className="content-container">
              <div className="service-content">
                <RisingText>
                  <h1>
                    Innovation <br></br>Laboratory
                  </h1>
                </RisingText>

                <AnimatedText className="dark-text">
                  Pioneering the future of digital experiences through
                  cutting-edge research and experimentation
                </AnimatedText>
                <RisingText>
                  <MyButton text="GET STARTED" />
                </RisingText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
