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
                <h2 className="team-title">Behind The Scenes</h2>
                </RisingText>

               <AnimatedText className="white-text">
                 A diverse team of creators, thinkers, and innovators dedicated to excellence
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
